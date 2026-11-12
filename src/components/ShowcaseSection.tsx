"use client";

import React, { useRef, useState, useCallback } from "react";
import FrameScrubber from "./FrameScrubber";

export default function ShowcaseSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  // Text is fully visible upon entering the section (progress 0 - 0.82),
  // and softly fades out only near the very end (0.85 - 1.0) so the visitor can take in the completed property
  const textOpacity =
    scrollProgress > 0.82
      ? Math.max(0.15, 1 - ((scrollProgress - 0.82) / 0.18) * 0.85)
      : 1;

  const textTranslateY =
    scrollProgress > 0.82 ? ((scrollProgress - 0.82) / 0.18) * -15 : 0;

  return (
    <section
      id="fencing-showcase"
      aria-label="Architectural Fencing Showcase"
      className="relative w-full bg-[#000000] border-t border-neutral-900"
    >
      <FrameScrubber
        totalFrames={239}
        framePathPrefix="https://res.cloudinary.com/qk5wy6np/image/upload/f_auto,q_90/fencing-frame"
        frameExtension=".jpg"
        padDigits={0}
        scrollDistance={4000}
        scrubDuration={0.5}
        onProgress={handleProgress}
      >
        {/* Subtle cinematic gradient overlay to ensure perfect copy contrast without obscuring construction */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />

        {/* Narrative Copy Container: Positioned top-left away from the fence construction zone */}
        <div
          ref={textRef}
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
          }}
          className="absolute top-28 sm:top-32 md:top-36 left-4 sm:left-8 md:left-14 lg:left-20 max-w-lg z-20 pointer-events-none"
        >
          {/* Chapter / Process Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md shadow-lg mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
            <span className="text-[10.5px] font-mono tracking-widest text-neutral-300 font-semibold uppercase">
              CHAPTER 02 — ARCHITECTURAL EXECUTION
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight drop-shadow-md">
            Crafted for Your <span className="text-[#f95721]">Property</span>
          </h2>

          {/* Description */}
          <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-light drop-shadow-sm max-w-md">
            Every perimeter boundary requires uncompromising engineering. From deep-set structural
            concrete footings and laser-grade post leveling to automated sliding security gates, our
            master craftsmen construct fences that elevate property value and stand resilient through
            all seasons.
          </p>

          {/* Key Engineering Highlights */}
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-neutral-300">
            <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
              Laser-Aligned Grade
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
              Automated Gate Integration
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
              Structural Footings
            </span>
          </div>
        </div>

        {/* Minimal Scroll Indicator in Bottom Left */}
        <div className="absolute bottom-6 left-4 sm:left-8 md:left-14 lg:left-20 z-20 flex items-center gap-3 text-xs font-mono text-neutral-400 pointer-events-none">
          <span className="text-[11px] tracking-widest uppercase text-neutral-500">
            Installation Sequence
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f95721] transition-all duration-150 ease-out"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-white">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </FrameScrubber>
    </section>
  );
}
