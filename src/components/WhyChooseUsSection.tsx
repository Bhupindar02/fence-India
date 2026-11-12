"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Ruler,
  ReceiptText,
  Mountain,
  HardHat,
  UserCheck,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { whyChooseUsContent, WhyChooseUsBenefit } from "@/data/whyChooseUs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  ShieldCheck,
  Ruler,
  ReceiptText,
  Mountain,
  HardHat,
  UserCheck,
};

export default function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance animation
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Benefit cards staggered entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".benefit-card");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 35,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // Trust banner entrance
      if (bannerRef.current) {
        gsap.from(bannerRef.current, {
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToEstimate = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetElement = document.getElementById(
      whyChooseUsContent.trustSummary.ctaTargetId
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id={whyChooseUsContent.sectionId}
      ref={sectionRef}
      aria-label="Why Choose FenceCo"
      className="relative z-20 w-full bg-[#070b08] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-neutral-800/80 overflow-hidden"
    >
      {/* Background subtle radial glow accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-[#16271c]/30 to-transparent blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-[#f95721]/5 blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16271c] border border-[#27402f] text-xs font-mono font-medium tracking-wider text-neutral-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
            <span>{whyChooseUsContent.badgeLabel}</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white mb-6">
            <span>{whyChooseUsContent.mainHeading.prefix}</span>
            <span className="text-[#f95721] italic">
              {whyChooseUsContent.mainHeading.accent}
            </span>
            {whyChooseUsContent.mainHeading.suffix && (
              <span>{whyChooseUsContent.mainHeading.suffix}</span>
            )}
          </h2>

          {/* Subheading / Concise Description */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed">
            {whyChooseUsContent.subheading}
          </p>
        </div>

        {/* 6 VISUALLY CONSISTENT BENEFIT ITEMS */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
        >
          {whyChooseUsContent.benefits.map((benefit: WhyChooseUsBenefit, index: number) => {
            const IconComponent = iconMap[benefit.iconName] || ShieldCheck;
            return (
              <div
                key={benefit.id}
                className="benefit-card group relative p-6 sm:p-8 rounded-2xl bg-[#0c120e] hover:bg-[#111914] border border-neutral-800/80 hover:border-[#27402f] transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Subtle Card Accent Highlight on Hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#16271c]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />

                <div className="relative z-10">
                  {/* Top: Icon + Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#16271c] border border-[#27402f] text-[#f95721] flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-[#1c3323] transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-medium text-neutral-500 tracking-wider">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Benefit Badge */}
                  <div className="inline-block mb-3">
                    <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-neutral-300 group-hover:border-neutral-700 transition-colors">
                      {benefit.badge}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight group-hover:text-emerald-50 transition-colors">
                    {benefit.title}
                  </h3>

                  {/* Short Explanation */}
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {benefit.shortDescription}
                  </p>
                </div>

                {/* Micro Details List */}
                {benefit.highlightDetails && benefit.highlightDetails.length > 0 && (
                  <div className="relative z-10 pt-4 border-t border-neutral-800/70 space-y-2">
                    {benefit.highlightDetails.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start gap-2 text-xs text-neutral-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#374f3d] group-hover:text-[#f95721] transition-colors shrink-0 mt-0.5" />
                        <span className="leading-tight">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TRUST-FOCUSED CLOSING SUMMARY & CTA */}
        <div
          ref={bannerRef}
          className="relative rounded-3xl bg-gradient-to-b from-[#0e1611] to-[#0a0f0c] border border-[#1f2e22] p-8 sm:p-10 md:p-12 shadow-2xl overflow-hidden"
        >
          {/* Subtle Decorative Elements */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-80 h-80 bg-[#16271c]/40 blur-3xl rounded-full pointer-events-none"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#f95721] font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparent Estimating &amp; Quality Guarantee</span>
              </div>
              <p className="text-lg sm:text-xl font-normal text-white leading-relaxed mb-6">
                {whyChooseUsContent.trustSummary.statement}
              </p>

              {/* Guarantee Credential Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {whyChooseUsContent.trustSummary.guaranteeBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/40 border border-neutral-800/80"
                  >
                    <p className="text-xs font-medium text-white mb-1">
                      {badge.label}
                    </p>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <button
                onClick={handleScrollToEstimate}
                className="pl-6 pr-2 py-2 rounded-full bg-[#16271c] hover:bg-[#1f3727] border border-[#27402f] hover:border-[#385b42] text-white text-sm sm:text-base font-medium transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center gap-4 group"
              >
                <span className="tracking-wide">
                  {whyChooseUsContent.trustSummary.ctaButtonText}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f95721] group-hover:bg-[#ff6834] flex items-center justify-center text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </button>
              <span className="text-[11px] font-mono text-neutral-500">
                Direct linear-foot calculator &amp; itemized proposal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

