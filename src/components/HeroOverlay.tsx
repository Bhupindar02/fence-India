"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export interface HeroOverlayProps {
  progress?: number;
}

export default function HeroOverlay({ progress = 0 }: HeroOverlayProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Smoothly fade out the hero text between progress 0.06 and 0.24 on desktop
  // On mobile (< 768px), keep content, CTAs, and scrims 100% visible and in standard scroll flow
  const fadeStart = 0.06;
  const fadeEnd = 0.24;
  const fadeFraction = Math.min(
    1,
    Math.max(0, (progress - fadeStart) / (fadeEnd - fadeStart))
  );
  const opacity = isDesktop ? 1 - fadeFraction : 1;
  const translateY = isDesktop ? -fadeFraction * 24 : 0;
  const isFadedOut = isDesktop && opacity <= 0.01;

  const handleEstimateClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("inquiry-form");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleExploreClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("fencing-options");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none select-none"
      aria-hidden={isFadedOut}
    >
      {/* 1. Cinematic Multi-Layer Backdrop Scrims for WCAG AAA Contrast (>= 7:1) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/80 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isDesktop ? Math.max(0.4, opacity) : 1 }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-transparent to-transparent pointer-events-none"
      />

      {/* 2. Top Clearance for Fixed Navbar (32px notice + 56px nav) */}
      <div className="w-full h-24 sm:h-28 md:h-32 shrink-0 pointer-events-none" />

      {/* 3. Main Center Editorial Hero Content */}
      <div
        style={{
          opacity,
          transform: isDesktop ? `translateY(${translateY}px)` : "none",
          transition: isDesktop ? "opacity 0.25s ease-out, transform 0.25s ease-out" : "none",
          visibility: isFadedOut ? "hidden" : "visible",
        }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center my-auto"
      >
        {/* Eyebrow / Trust Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16271c]/90 border border-[#27402f] text-xs font-mono font-medium tracking-wider text-neutral-300 mb-5 sm:mb-6 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
          <span>INDIA&apos;S PREMIER ARCHITECTURAL FENCING</span>
        </div>

        {/* User-Requested Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white mb-4 sm:mb-6 leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] max-w-4xl text-balance">
          <span>Strong Fences. </span>
          <span className="text-[#f95721] italic font-normal">
            Stronger Protection.
          </span>
        </h1>

        {/* User-Requested Subheading / Tagline */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-200 font-light leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-balance">
          Secure your space with durable, reliable fencing built for lasting
          strength and peace of mind.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none mb-6 sm:mb-8 ${
            isFadedOut ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <a
            href="#inquiry-form"
            onClick={handleEstimateClick}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-200 shadow-[0_4px_24px_rgba(249,87,33,0.4)] hover:shadow-[0_8px_32px_rgba(249,87,33,0.6)] hover:-translate-y-0.5 active:scale-[0.98] min-h-[48px]"
          >
            <span>Get a Free Estimate</span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          <a
            href="#fencing-options"
            onClick={handleExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] min-h-[48px]"
          >
            <span>Explore Fencing Options</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </a>
        </div>

        {/* Trust Proof Metrics Underneath CTAs */}
        <div
          className={`flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-6 text-[11px] sm:text-xs font-mono text-neutral-300 ${
            isFadedOut ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <div className="flex items-center gap-1.5 drop-shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
            <span>Licensed &amp; Insured</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <div className="flex items-center gap-1.5 drop-shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
            <span>Monsoon &amp; Heavy-Wind Specs</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <div className="flex items-center gap-1.5 drop-shadow">
            <Sparkles className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
            <span>Lifetime Craftsmanship</span>
          </div>
        </div>
      </div>

      {/* 4. Desktop Scroll Indicator (Fades out when user begins scrolling down) */}
      <div
        style={{
          opacity: Math.max(0, 1 - (progress || 0) * 12),
          transition: "opacity 0.2s ease-out",
        }}
        className="hidden md:flex flex-col items-center gap-2 pb-8 pointer-events-none text-neutral-400"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 drop-shadow">
          Scroll to Build Fence
        </span>
        <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm">
          <div className="w-1 h-2 bg-[#f95721] rounded-full animate-bounce" />
        </div>
      </div>

      {/* Mobile Bottom Spacing (prevents overlap with Replay button) */}
      <div className="block md:hidden w-full h-8 shrink-0 pointer-events-none" />
    </div>
  );
}

