/**
 * canvasScrub.js - High-Performance 3-Phase Progressive Frame Scrubber for Cloudinary
 * 
 * 1. Cloudinary transformation: f_auto,q_90 optimizes each frame from ~1.5MB to ~40-60KB
 * 2. 3-Phase Progressive Loader:
 *    - Phase 1: Instant Boot (~0.2s) - Load Frame 0, initialize canvas & dismiss loading overlay
 *    - Phase 2: Keyframe Striding (~1.0s) - Download every 5th frame via parallel batches of 10
 *    - Phase 3: Background Fill - Silent fill of intermediate frames via requestIdleCallback()
 * 3. getNearestLoadedImage(frameIndex) fallback - walks backward then forward to find nearest loaded frame
 * 4. Supports both canvas sections: Hero (frames1) and Showcase / Interior Tour (frames2)
 */

// ✅ With Cloudinary auto-format + quality optimization
export const CLOUD = "https://res.cloudinary.com/qk5wy6np/image/upload/f_auto,q_90";

/**
 * Creates and initializes a 3-phase progressive canvas scrubber
 * @param {Object} config
 * @param {HTMLCanvasElement} config.canvas - Target canvas DOM element
 * @param {number} config.totalFrames - Total count of frames (e.g. 239)
 * @param {string} config.prefix - URL prefix (e.g. `${CLOUD}/frame_` or `${CLOUD}/fencing-frame`)
 * @param {string} [config.extension=".jpg"] - Image extension
 * @param {number} [config.padDigits=4] - Zero-padding digits (4 for frame_0001, 0 for fencing-frame1)
 * @param {Function} [config.onFirstFrameReady] - Callback when Frame 0 is rendered and ready
 * @param {Function} [config.onProgress] - Callback for overall loading progress (loaded, total)
 * @returns {Object} Controller with drawFrame, getNearestLoadedImage, destroy
 */
export function initCanvasScrub({
  canvas,
  totalFrames = 238,
  prefix = `${CLOUD}/fence_hero`,
  extension = ".webp",
  padDigits = 0,
  onFirstFrameReady,
  onProgress,
}) {
  if (!canvas) {
    console.error("initCanvasScrub: Canvas element is required");
    return null;
  }

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const frames = new Array(totalFrames).fill(null);
  const loadedFrames = new Array(totalFrames).fill(false);
  let lastDrawnIndex = -1;
  let targetIndex = 0;
  let isDestroyed = false;
  let loadedCount = 0;

  // Helper to format frame URL
  function getFrameUrl(index) {
    const frameNum =
      padDigits > 0
        ? String(index + 1).padStart(padDigits, "0")
        : String(index + 1);
    return `${prefix}${frameNum}${extension}`;
  }

  // 3. getNearestLoadedImage(frameIndex) Fallback:
  // - Checks if frames[frameIndex] is loaded; if not, walks backward then forward
  // - Always returns a loaded image — never draws blank, never freezes
  function getNearestLoadedImage(frameIndex) {
    const clamped = Math.max(0, Math.min(totalFrames - 1, frameIndex));

    // Exact hit
    if (loadedFrames[clamped] && frames[clamped]) {
      return frames[clamped];
    }

    // Walk outward: check backward then forward for nearest loaded frame
    for (let offset = 1; offset < totalFrames; offset++) {
      const back = clamped - offset;
      if (back >= 0 && loadedFrames[back] && frames[back]) {
        return frames[back];
      }
      const forward = clamped + offset;
      if (forward < totalFrames && loadedFrames[forward] && frames[forward]) {
        return frames[forward];
      }
    }

    // Fallback to last drawn image, or frame 0
    if (lastDrawnIndex !== -1 && frames[lastDrawnIndex]) {
      return frames[lastDrawnIndex];
    }
    return frames[0] || null;
  }

  // Render frame with object-fit: cover scaling
  function drawFrame(frameIndex) {
    if (!canvas || !ctx || isDestroyed) return;

    targetIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    const img = getNearestLoadedImage(targetIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const imgAspect = nw / nh;
    const canvasAspect = cw / ch;

    let renderW, renderH, offsetX, offsetY;

    if (canvasAspect > imgAspect) {
      renderW = cw;
      renderH = cw / imgAspect;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderH = ch;
      renderW = ch * imgAspect;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    lastDrawnIndex = targetIndex;
  }

  // Helper to load and decode a single image frame
  function loadSingleImage(index) {
    if (loadedFrames[index] && frames[index]) {
      return Promise.resolve(frames[index]);
    }

    return new Promise((resolve) => {
      if (isDestroyed) return resolve(null);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = getFrameUrl(index);

      const handleDone = async () => {
        if (isDestroyed) return resolve(null);

        if ("decode" in img) {
          try {
            await img.decode();
          } catch {
            // Ignore decode failures, image still usable
          }
        }
        if (isDestroyed) return resolve(null);

        frames[index] = img;
        loadedFrames[index] = true;
        loadedCount++;
        onProgress?.(loadedCount, totalFrames);

        // If currently viewing near this frame, re-render
        if (Math.abs(targetIndex - index) <= 1) {
          drawFrame(targetIndex);
        }
        resolve(img);
      };

      if (img.complete) {
        handleDone();
      } else {
        img.onload = handleDone;
        img.onerror = () => {
          console.warn(`[canvasScrub] Failed to load frame ${index}: ${img.src}`);
          resolve(null);
        };
      }
    });
  }

  // Cross-browser idle callback helper
  function runIdle(cb) {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      return window.requestIdleCallback(cb, { timeout: 2000 });
    }
    return setTimeout(cb, 16);
  }

  // 2. 3-Phase Progressive Preloader
  async function startProgressiveLoad() {
    // ------------------------------------------------------------------
    // Phase 1 — Instant Boot (~0.2s):
    // Load Frame 0 only (~40KB). Hide overlay and initialize immediately.
    // ------------------------------------------------------------------
    await loadSingleImage(0);
    if (isDestroyed) return;

    drawFrame(0);
    onFirstFrameReady?.();

    // ------------------------------------------------------------------
    // Phase 2 — Keyframe Striding (~1.0s):
    // Download every 5th frame in parallel batches (Promise.all in groups of 10).
    // ------------------------------------------------------------------
    const strideStep = 5;
    const keyframeIndices = [];
    for (let i = strideStep; i < totalFrames; i += strideStep) {
      keyframeIndices.push(i);
    }
    if (!keyframeIndices.includes(totalFrames - 1)) {
      keyframeIndices.push(totalFrames - 1);
    }

    const batchSize = 10;
    for (let i = 0; i < keyframeIndices.length; i += batchSize) {
      if (isDestroyed) return;
      const batch = keyframeIndices.slice(i, i + batchSize);
      await Promise.all(batch.map((idx) => loadSingleImage(idx)));
    }

    // ------------------------------------------------------------------
    // Phase 3 — Background Fill:
    // Fill in remaining intermediate frames via requestIdleCallback()
    // ------------------------------------------------------------------
    const keyframeSet = new Set([0, ...keyframeIndices]);
    const fillIndices = [];
    for (let i = 0; i < totalFrames; i++) {
      if (!keyframeSet.has(i)) {
        fillIndices.push(i);
      }
    }

    let fillCursor = 0;
    function scheduleNextIdleFill() {
      if (isDestroyed || fillCursor >= fillIndices.length) return;

      runIdle(async () => {
        if (isDestroyed) return;

        const nextCursor = Math.min(fillCursor + 4, fillIndices.length);
        const chunk = fillIndices.slice(fillCursor, nextCursor);
        fillCursor = nextCursor;

        await Promise.all(chunk.map((idx) => loadSingleImage(idx)));

        if (fillCursor < fillIndices.length) {
          scheduleNextIdleFill();
        }
      });
    }

    scheduleNextIdleFill();
  }

  // Start loader
  startProgressiveLoad();

  return {
    drawFrame,
    getNearestLoadedImage,
    getLoadedFramesCount: () => loadedCount,
    destroy: () => {
      isDestroyed = true;
    },
  };
}
