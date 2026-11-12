"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight, ShieldCheck, PhoneCall, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.95,
        y: 35,
        duration: 0.85,
        ease: "power2.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("inquiry-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("fencing-options");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      aria-label="Call to Action"
      className="relative z-20 w-full py-28 sm:py-36 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-[#050806]"
    >
      {/* Background Architectural Photo with Restrained Dark Overlay */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/transformation/after.jpg"
          alt="Completed Architectural Fencing Installation"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 scale-105"
        />
        {/* Multi-layered dark gradient overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b08] via-black/85 to-[#040605] backdrop-blur-[2px]" />
      </div>

      {/* Ambient Radial Color Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#16271c]/50 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-[#f95721]/10 rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* Main Centered Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Introductory Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16271c] border border-[#27402f] text-xs font-mono font-medium tracking-wider text-neutral-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
          <span>LET&apos;S GET STARTED</span>
        </div>

        {/* Strong Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white mb-6 leading-tight">
          <span>Ready to Transform </span>
          <span className="text-[#f95721] italic">Your Property?</span>
        </h2>

        {/* Concise Supporting Copy */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12">
          Whether you&apos;re securing a private villa, defining commercial campus boundaries, or upgrading curb appeal with architectural privacy fencing, our India team is ready to inspect your property, confirm local setback guidelines, and deliver a transparent, itemized proposal.
        </p>

        {/* Dual Responsive Calls to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-12">
          {/* Primary Action Button: Navigates to Inquiry Form */}
          <button
            onClick={handleScrollToInquiry}
            className="w-full sm:w-auto pl-7 pr-2 py-2.5 rounded-full bg-[#16271c] hover:bg-[#1f3727] border border-[#27402f] hover:border-[#385b42] text-white text-sm sm:text-base font-medium transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group"
          >
            <span className="tracking-wide">Get a Free Fencing Estimate</span>
            <span className="w-10 h-10 rounded-full bg-[#f95721] group-hover:bg-[#ff6834] flex items-center justify-center text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-md shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </button>

          {/* Secondary Action Button: Navigates back to Fencing Options & Pricing */}
          <button
            onClick={handleScrollToOptions}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm sm:text-base font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group backdrop-blur-sm"
          >
            <span>Explore Fencing Options</span>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Reassurance Micro-Badges */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Licensed &amp; Certified in India</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f95721]" />
            <span>Fixed Per-Running-Foot Estimates</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-neutral-400" />
            <span>Direct Project Lead Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}

