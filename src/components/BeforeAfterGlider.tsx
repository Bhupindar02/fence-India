"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Ruler,
  Clock,
  Compass,
} from "lucide-react";

export default function BeforeAfterGlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage: 2 to 98
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Update slider position based on pointer X
  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      // Clamp between 2% and 98%
      const clamped = Math.max(2, Math.min(98, percentage));
      setSliderPosition(clamped);
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If intro animation is running, cancel it immediately so user takes control
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    hasAnimatedRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // In case pointer capture was already released
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    hasAnimatedRef.current = true;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(2, prev - 3));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(98, prev + 3));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPosition(2);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPosition(98);
    }
  };

  // Perform one restrained demonstration animation when section enters viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const target = { pos: 50 };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const tl = gsap.timeline({
          onUpdate: () => {
            setSliderPosition(target.pos);
          },
        });

        // Restrained demo: glides to reveal more of AFTER (68%), then BEFORE (34%), then returns to center (50%)
        tl.to(target, { pos: 68, duration: 0.9, ease: "power2.out" })
          .to(target, { pos: 34, duration: 1.0, ease: "power2.inOut" })
          .to(target, { pos: 50, duration: 0.8, ease: "power2.out" });

        tweenRef.current = tl as unknown as gsap.core.Tween;
      },
    });

    return () => {
      trigger.kill();
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, []);

  return (
    <section
      id="before-after"
      ref={sectionRef}
      aria-label="Before and After Fence Transformation"
      className="relative z-20 w-full bg-[#0a0d0b] text-white py-24 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-neutral-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          {/* Restrained Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-800 bg-neutral-950/80 shadow-md mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
            <span className="text-[10.5px] font-mono tracking-widest text-neutral-300 font-semibold uppercase">
              ACTUAL INSTALLATION COMPARISON
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            See the <span className="text-[#f95721]">Transformation</span>
          </h2>

          {/* Subtitle */}
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Drag the divider horizontally to reveal the dramatic difference between the open property boundary
            and the completed architectural perimeter wall.
          </p>
        </div>

        {/* Interactive Comparison Glider */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Before and after fence installation comparison glider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={2}
          aria-valuemax={98}
          className="relative w-full aspect-[3/2] sm:aspect-[16/10] max-h-[680px] rounded-2xl sm:rounded-3xl overflow-hidden select-none cursor-ew-resize border border-neutral-800 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#f95721] focus:ring-offset-2 focus:ring-offset-black touch-pan-y"
        >
          {/* BOTTOM LAYER: AFTER IMAGE */}
          <div className="absolute inset-0 w-full h-full bg-neutral-950">
            <Image
              src="/images/transformation/after.jpg"
              alt="Completed perimeter fence installation"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover pointer-events-none"
            />

            {/* AFTER Badge Label */}
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-xs font-mono font-semibold tracking-wider text-white shadow-lg pointer-events-none flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline">AFTER INSTALLATION</span>
              <span className="sm:hidden">AFTER</span>
            </div>
          </div>

          {/* TOP LAYER: BEFORE IMAGE (Clipped horizontally) */}
          <div
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
            className="absolute inset-0 w-full h-full bg-neutral-950 pointer-events-none"
          >
            <Image
              src="/images/transformation/before.jpg"
              alt="Property before fence installation"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover pointer-events-none"
            />

            {/* BEFORE Badge Label */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-xs font-mono font-semibold tracking-wider text-white shadow-lg pointer-events-none flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f95721]" />
              <span className="hidden sm:inline">BEFORE INSTALLATION</span>
              <span className="sm:hidden">BEFORE</span>
            </div>
          </div>

          {/* VERTICAL DIVIDER LINE */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] pointer-events-none z-20 -translate-x-1/2"
          >
            {/* Top and Bottom Accents */}
            <div className="absolute top-0 -left-1 w-2.5 h-6 bg-white rounded-b-sm opacity-80" />
            <div className="absolute bottom-0 -left-1 w-2.5 h-6 bg-white rounded-t-sm opacity-80" />

            {/* CIRCULAR REFINED SLIDER HANDLE */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16271c] border-2 border-white shadow-2xl flex items-center justify-center text-white transition-all duration-150 ${
                isDragging
                  ? "scale-110 ring-4 ring-[#f95721]/50 bg-[#213a29]"
                  : "hover:scale-105 hover:bg-[#1c3323]"
              }`}
            >
              <div className="flex items-center gap-0.5">
                <ChevronLeft className="w-4 h-4 text-white" />
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Subtle Mobile Drag Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300 pointer-events-none flex items-center gap-2 sm:hidden">
            <span>Drag slider to compare</span>
          </div>
        </div>

        {/* Project Case Details Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-neutral-900">
            <div className="p-2.5 rounded-xl bg-[#16271c] border border-[#27402f] text-[#f95721]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Project Scope &amp; Specifications</h3>
              <p className="text-xs text-neutral-400 font-mono">
                Authentic installation profile captured from identical vantage point
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-500 font-mono flex items-center gap-1.5 uppercase text-[10.5px]">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                Fence Classification
              </span>
              <p className="text-sm font-medium text-white">
                Textured Precast Perimeter Wall
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Interlocking masonry-relief concrete panels with structural pilasters.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-500 font-mono flex items-center gap-1.5 uppercase text-[10.5px]">
                <Ruler className="w-3.5 h-3.5 text-neutral-400" />
                Boundary Dimensions
              </span>
              <p className="text-sm font-medium text-white">
                6.5 ft Wall Height · 85 Linear Ft
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Full-height street isolation with custom-fitted corner transition.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-500 font-mono flex items-center gap-1.5 uppercase text-[10.5px]">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Installation Duration
              </span>
              <p className="text-sm font-medium text-white">
                2 Days Total Turnaround
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Precast modular delivery with rapid same-day post footing embedment.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-500 font-mono flex items-center gap-1.5 uppercase text-[10.5px]">
                <Compass className="w-3.5 h-3.5 text-neutral-400" />
                Finishing Details
              </span>
              <p className="text-sm font-medium text-white">
                Dual-Tone Architectural Texture
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Terracotta stone façade with navy foundation curb and perimeter bedding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

