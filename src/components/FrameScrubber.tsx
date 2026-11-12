"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RotateCcw } from "lucide-react";

export interface FrameScrubberProps {
  totalFrames?: number;
  framePathPrefix?: string;
  frameExtension?: string;
  padDigits?: number;
  scrollDistance?: number;
  scrubDuration?: number;
  mobileVideoSrc?: string;
  className?: string;
  id?: string;
  onFirstFrameReady?: () => void;
  onLoadingProgress?: (loaded: number, total: number) => void;
  onProgress?: (progress: number) => void;
  children?: React.ReactNode;
}

export default function FrameScrubber({
  totalFrames = 239,
  framePathPrefix = "https://res.cloudinary.com/qk5wy6np/image/upload/f_auto,q_90/frame_",
  frameExtension = ".jpg",
  padDigits = 4,
  scrollDistance = 4000,
  scrubDuration = 0.5,
  mobileVideoSrc,
  className = "",
  id,
  onFirstFrameReady,
  onLoadingProgress,
  onProgress,
  children,
}: FrameScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFramesRef = useRef<boolean[]>([]);
  const lastDrawnIndexRef = useRef<number>(-1);
  const targetIndexRef = useRef<number>(0);
  const isUnmountedRef = useRef<boolean>(false);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Replay handler for mobile video
  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoEnded(false);
    }
  }, []);

  // Helper to construct frame URL with customizable zero-padding
  const getFrameUrl = useCallback(
    (index: number) => {
      const frameNum =
        padDigits > 0
          ? String(index + 1).padStart(padDigits, "0")
          : String(index + 1);
      return `${framePathPrefix}${frameNum}${frameExtension}`;
    },
    [framePathPrefix, frameExtension, padDigits]
  );

  // 3. getNearestLoadedImage(frameIndex) Fallback:
  // - Checks if frames[frameIndex] is loaded; if not, walks backward then forward
  //   to find the closest already-loaded frame
  // - Always returns a loaded image — never draws blank, never freezes
  // - Enables smooth scrubbing from the very first second of page load
  const getNearestLoadedImage = useCallback(
    (frameIndex: number): HTMLImageElement | null => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, frameIndex));

      // 1. Exact hit
      if (loadedFramesRef.current[clamped] && imagesRef.current[clamped]) {
        return imagesRef.current[clamped];
      }

      // 2. Walk outward: check backward then forward for closest loaded frame
      for (let offset = 1; offset < totalFrames; offset++) {
        const back = clamped - offset;
        if (back >= 0 && loadedFramesRef.current[back] && imagesRef.current[back]) {
          return imagesRef.current[back];
        }
        const forward = clamped + offset;
        if (forward < totalFrames && loadedFramesRef.current[forward] && imagesRef.current[forward]) {
          return imagesRef.current[forward];
        }
      }

      // 3. Fallback to last drawn image or initial frame
      if (lastDrawnIndexRef.current !== -1 && imagesRef.current[lastDrawnIndexRef.current]) {
        return imagesRef.current[lastDrawnIndexRef.current];
      }
      return imagesRef.current[0] || null;
    },
    [totalFrames]
  );

  // Core render function: draws the specified frame with object-fit: cover
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (!ctx) return;

      const clampedIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
      const img = getNearestLoadedImage(clampedIndex);

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;

      // Mathematically correct object-fit: cover scaling
      const imgAspect = nw / nh;
      const canvasAspect = cw / ch;

      let renderW: number;
      let renderH: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasAspect > imgAspect) {
        // Canvas is wider relative to image -> fit width, crop vertical overflow
        renderW = cw;
        renderH = cw / imgAspect;
        offsetX = 0;
        offsetY = (ch - renderH) / 2;
      } else {
        // Canvas is taller relative to image -> fit height, crop horizontal overflow
        renderH = ch;
        renderW = ch * imgAspect;
        offsetX = (cw - renderW) / 2;
        offsetY = 0;
      }

      // Draw cleanly onto the black canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      lastDrawnIndexRef.current = clampedIndex;
    },
    [totalFrames, getNearestLoadedImage]
  );

  // Resize canvas for devicePixelRatio (Retina displays) and redraw
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use devicePixelRatio capped at 2 to balance crispness with memory usage
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const physicalWidth = Math.round(width * dpr);
    const physicalHeight = Math.round(height * dpr);

    if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    drawFrame(targetIndexRef.current);
  }, [drawFrame]);

  // Helper to load and decode a single image frame
  const loadSingleImage = useCallback(
    (index: number): Promise<HTMLImageElement | null> => {
      if (loadedFramesRef.current[index] && imagesRef.current[index]) {
        return Promise.resolve(imagesRef.current[index]);
      }

      return new Promise((resolve) => {
        if (isUnmountedRef.current) return resolve(null);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = getFrameUrl(index);

        const handleDone = async () => {
          if (isUnmountedRef.current) return resolve(null);

          if ("decode" in img) {
            try {
              await img.decode();
            } catch {
              // Ignore decode promise rejection, image still usable
            }
          }
          if (isUnmountedRef.current) return resolve(null);

          imagesRef.current[index] = img;
          loadedFramesRef.current[index] = true;

          setLoadPercent(() => {
            const count = loadedFramesRef.current.filter(Boolean).length;
            const pct = Math.round((count / totalFrames) * 100);
            onLoadingProgress?.(count, totalFrames);
            return pct;
          });

          // If scrubber is currently viewing near this frame, re-render immediately
          if (Math.abs(targetIndexRef.current - index) <= 1) {
            drawFrame(targetIndexRef.current);
          }
          resolve(img);
        };

        if (img.complete) {
          handleDone();
        } else {
          img.onload = handleDone;
          img.onerror = () => {
            console.warn(`Failed to load frame ${index}: ${img.src}`);
            resolve(null);
          };
        }
      });
    },
    [getFrameUrl, drawFrame, onLoadingProgress, totalFrames]
  );

  // 2. 3-Phase Progressive Preloader
  useEffect(() => {
    isUnmountedRef.current = false;

    // On mobile devices (< 768px), if mobileVideoSrc is active, skip heavy image frame preloading
    if (mobileVideoSrc && typeof window !== "undefined" && window.innerWidth < 768) {
      setIsFirstFrameLoaded(true);
      return;
    }

    imagesRef.current = new Array(totalFrames).fill(null);
    loadedFramesRef.current = new Array(totalFrames).fill(false);

    let isCancelled = false;

    // Helper for cross-browser requestIdleCallback with Safari fallback
    const runIdle = (cb: () => void) => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        return window.requestIdleCallback(cb, { timeout: 2000 });
      }
      return setTimeout(cb, 16);
    };

    const runThreePhaseLoader = async () => {
      // ------------------------------------------------------------------
      // Phase 1 — Instant Boot (~0.2s):
      // Load Frame 0 only (~40KB). As soon as it arrives, hide loading overlay
      // and initialize the section. The user can see and scroll immediately.
      // ------------------------------------------------------------------
      await loadSingleImage(0);
      if (isCancelled || isUnmountedRef.current) return;

      setIsFirstFrameLoaded(true);
      onFirstFrameReady?.();
      updateCanvasDimensions();
      drawFrame(0);
      ScrollTrigger.refresh();

      // ------------------------------------------------------------------
      // Phase 2 — Keyframe Striding (~1.0s):
      // Download every 5th frame in parallel batches (Promise.all in groups of 10).
      // This covers the full animation timeline within ~1 second.
      // ------------------------------------------------------------------
      const strideStep = 5;
      const keyframeIndices: number[] = [];
      for (let i = strideStep; i < totalFrames; i += strideStep) {
        keyframeIndices.push(i);
      }
      if (!keyframeIndices.includes(totalFrames - 1)) {
        keyframeIndices.push(totalFrames - 1);
      }

      const batchSize = 10;
      for (let i = 0; i < keyframeIndices.length; i += batchSize) {
        if (isCancelled || isUnmountedRef.current) return;
        const batch = keyframeIndices.slice(i, i + batchSize);
        await Promise.all(batch.map((idx) => loadSingleImage(idx)));
      }

      // ------------------------------------------------------------------
      // Phase 3 — Background Fill:
      // Fill in all remaining intermediate frames silently via requestIdleCallback()
      // so it never competes with UI or scroll performance.
      // ------------------------------------------------------------------
      const keyframeSet = new Set([0, ...keyframeIndices]);
      const remainingFrames: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        if (!keyframeSet.has(i)) {
          remainingFrames.push(i);
        }
      }

      let fillIndex = 0;
      const scheduleIdleFill = () => {
        if (isCancelled || isUnmountedRef.current || fillIndex >= remainingFrames.length) return;

        runIdle(async () => {
          if (isCancelled || isUnmountedRef.current) return;

          const sliceEnd = Math.min(fillIndex + 4, remainingFrames.length);
          const slice = remainingFrames.slice(fillIndex, sliceEnd);
          fillIndex = sliceEnd;

          await Promise.all(slice.map((idx) => loadSingleImage(idx)));

          if (fillIndex < remainingFrames.length) {
            scheduleIdleFill();
          }
        });
      };

      scheduleIdleFill();
    };

    runThreePhaseLoader();

    return () => {
      isCancelled = true;
      isUnmountedRef.current = true;
    };
  }, [
    totalFrames,
    mobileVideoSrc,
    loadSingleImage,
    updateCanvasDimensions,
    drawFrame,
    onFirstFrameReady,
  ]);

  // Setup GSAP ScrollTrigger & Resize Listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    if (mobileVideoSrc) {
      // 1. DESKTOP ONLY (>= 768px): Pinned Canvas Scrubbing Sequence
      mm.add("(min-width: 768px)", () => {
        updateCanvasDimensions();

        if (containerRef.current) {
          triggerRef.current = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: scrubDuration,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const frameIndex = Math.min(
                totalFrames - 1,
                Math.max(0, Math.round(progress * (totalFrames - 1)))
              );

              if (targetIndexRef.current !== frameIndex) {
                targetIndexRef.current = frameIndex;
                drawFrame(frameIndex);
              }

              onProgress?.(progress);
            },
          });
        }

        const handleResize = () => {
          updateCanvasDimensions();
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize, { passive: true });
        window.addEventListener("orientationchange", handleResize, { passive: true });

        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("orientationchange", handleResize);
          if (triggerRef.current) {
            triggerRef.current.kill();
            triggerRef.current = null;
          }
        };
      });

      // 2. MOBILE ONLY (< 768px): Natural Document Flow (No Pinning, Progress 0)
      mm.add("(max-width: 767px)", () => {
        onProgress?.(0);
        if (triggerRef.current) {
          triggerRef.current.kill();
          triggerRef.current = null;
        }
        ScrollTrigger.refresh();
      });

      return () => {
        mm.revert();
      };
    } else {
      // For sections without mobileVideoSrc (ShowcaseSection), standard scrub
      updateCanvasDimensions();

      const handleResize = () => {
        updateCanvasDimensions();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize, { passive: true });
      window.addEventListener("orientationchange", handleResize, { passive: true });

      if (containerRef.current) {
        triggerRef.current = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: scrubDuration,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const frameIndex = Math.min(
              totalFrames - 1,
              Math.max(0, Math.round(progress * (totalFrames - 1)))
            );

            if (targetIndexRef.current !== frameIndex) {
              targetIndexRef.current = frameIndex;
              drawFrame(frameIndex);
            }

            onProgress?.(progress);
          },
        });
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        if (triggerRef.current) {
          triggerRef.current.kill();
          triggerRef.current = null;
        }
      };
    }
  }, [scrollDistance, scrubDuration, totalFrames, drawFrame, updateCanvasDimensions, onProgress, mobileVideoSrc]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative w-full bg-[#000000] overflow-hidden ${className}`}
    >
      {/* Mobile Native Video (< 768px): Autoplays Once, Freezes on Finished Frame */}
      {mobileVideoSrc && (
        <div className="block md:hidden relative w-full h-[100dvh] min-h-[640px] overflow-hidden bg-[#000000]">
          <video
            ref={videoRef}
            src={mobileVideoSrc}
            poster={getFrameUrl(0)}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setIsVideoEnded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle Bottom Gradient Vignette on mobile video to ground and blend */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />
          {isVideoEnded && (
            <button
              onClick={handleReplay}
              aria-label="Replay transformation video"
              className="absolute bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-neutral-300 flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Replay</span>
            </button>
          )}
          {children}
        </div>
      )}

      {/* Desktop Pinned Viewport Container (>= 768px or if no mobileVideoSrc) */}
      <div className={`${mobileVideoSrc ? "hidden md:block" : "block"} relative w-full h-screen overflow-hidden bg-[#000000]`}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block bg-[#000000] select-none pointer-events-none"
        />

        {/* Children Overlay Elements (such as Chapter headings, captions) */}
        {children}

        {/* Minimal Apple-Style Loading Indicator (fades out as soon as frame 1 is ready) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-[#000000] transition-opacity duration-700 pointer-events-none z-10 ${
            isFirstFrameLoaded ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={isFirstFrameLoaded}
        >
          <div className="w-36 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${Math.max(10, loadPercent)}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            Loading Experience
          </p>
        </div>
      </div>
    </div>
  );
}
