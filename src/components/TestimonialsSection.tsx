"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle,
  ArrowUpRight,
  MapPin,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import {
  testimonialsContent,
  TestimonialItem,
} from "@/data/testimonials";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentDelta, setDragCurrentDelta] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [desktopViewMode, setDesktopViewMode] = useState<"carousel" | "grid">("carousel");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const activeItems: TestimonialItem[] = testimonialsContent.testimonials;

  // Responsive items-per-view calculation
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems, { passive: true });
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const maxIndex = Math.max(0, activeItems.length - visibleItems);

  // Clamp current index on resize or dataset change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // GSAP scroll entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      if (containerRef.current) {
        gsap.from(containerRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Pointer dragging / touch swipe handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (desktopViewMode === "grid" && window.innerWidth >= 1024) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentDelta(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    if (
      (currentIndex === 0 && delta > 0) ||
      (currentIndex === maxIndex && delta < 0)
    ) {
      setDragCurrentDelta(delta * 0.3); // rubber-band resistance
    } else {
      setDragCurrentDelta(delta);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const threshold = 50;
    if (dragCurrentDelta < -threshold && currentIndex < maxIndex) {
      handleNext();
    } else if (dragCurrentDelta > threshold && currentIndex > 0) {
      handlePrev();
    }
    setDragCurrentDelta(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragCurrentDelta(0);
  };

  const handleScrollToEstimate = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(testimonialsContent.ctaTargetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stepPercentage = 100 / visibleItems;
  const baseTranslate = -(currentIndex * stepPercentage);

  return (
    <section
      id={testimonialsContent.sectionId}
      ref={sectionRef}
      aria-label="Customer Testimonials"
      className="relative z-20 w-full bg-[#f8f9fa] text-neutral-900 py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-neutral-200/90 overflow-hidden"
    >
      {/* Background Subtle Gradient Accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-mono font-medium tracking-wider text-neutral-700 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f95721]" />
            <span>{testimonialsContent.badgeLabel}</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-neutral-950 mb-5">
            <span>{testimonialsContent.mainHeading.prefix}</span>
            <span className="text-[#f95721] italic">
              {testimonialsContent.mainHeading.accent}
            </span>
            {testimonialsContent.mainHeading.suffix && (
              <span>{testimonialsContent.mainHeading.suffix}</span>
            )}
          </h2>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            {testimonialsContent.subheading}
          </p>

          {/* Aggregate Rating Summary (Omitted if unverified to prevent fake stats) */}
          {testimonialsContent.aggregateRating ? (
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-xs text-neutral-800">
              <div className="flex items-center gap-1 text-[#f95721]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#f95721]" />
                ))}
              </div>
              <span className="font-semibold text-neutral-900">
                {testimonialsContent.aggregateRating.average.toFixed(1)} / 5.0
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">
                Based on {testimonialsContent.aggregateRating.totalReviews}{" "}
                {testimonialsContent.aggregateRating.platform} reviews
              </span>
            </div>
          ) : null}
        </div>

        {/* CONTROLS BAR: Desktop Grid/Carousel Toggle & Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto px-2">
          {/* Left: View Mode Toggle (Desktop only) or Item Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-500">
              {desktopViewMode === "carousel" ? (
                <span>
                  Showing {currentIndex + 1}–
                  {Math.min(currentIndex + visibleItems, activeItems.length)} of{" "}
                  {activeItems.length}
                </span>
              ) : (
                <span>All Reviews ({activeItems.length})</span>
              )}
            </span>

            {/* Desktop View Mode Switcher */}
            <div className="hidden lg:flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-sm text-xs">
              <button
                onClick={() => setDesktopViewMode("carousel")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  desktopViewMode === "carousel"
                    ? "bg-[#16271c] text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                aria-label="Switch to Carousel View"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setDesktopViewMode("grid")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  desktopViewMode === "grid"
                    ? "bg-[#16271c] text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                aria-label="Switch to Grid View"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Right: Carousel Navigation Arrows (shown when in carousel mode) */}
          {desktopViewMode === "carousel" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous testimonials"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  currentIndex === 0
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-white/50"
                    : "border-neutral-300 text-neutral-800 hover:bg-[#16271c] hover:border-[#16271c] hover:text-white bg-white shadow-sm active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                aria-label="Next testimonials"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  currentIndex >= maxIndex
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-white/50"
                    : "border-neutral-300 text-neutral-800 hover:bg-[#16271c] hover:border-[#16271c] hover:text-white bg-white shadow-sm active:scale-95"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* REFINED DESKTOP GRID VIEW (when toggled on desktop) */}
        {desktopViewMode === "grid" ? (
          <div
            ref={gridRef}
            className="hidden lg:grid grid-cols-3 gap-6 mb-16"
          >
            {activeItems.map((item: TestimonialItem, idx: number) => (
              <TestimonialCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        ) : null}

        {/* HORIZONTALLY NAVIGABLE / SWIPEABLE CAROUSEL (Always on mobile/tablet, and default on desktop) */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer Testimonials Carousel"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`${
            desktopViewMode === "grid" ? "lg:hidden" : "block"
          } relative outline-none cursor-grab active:cursor-grabbing select-none overflow-hidden pb-4`}
        >
          {/* Slider Track */}
          <div
            ref={trackRef}
            style={{
              transform: `translateX(calc(${baseTranslate}% + ${dragCurrentDelta}px))`,
              transition: isDragging
                ? "none"
                : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            className="flex transition-transform will-change-transform"
          >
            {activeItems.map((item: TestimonialItem, idx: number) => (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${idx + 1} of ${activeItems.length}`}
                style={{ width: `${stepPercentage}%` }}
                className="shrink-0 px-2 sm:px-3 sm:px-4"
              >
                <TestimonialCard item={item} index={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {desktopViewMode === "carousel" && (
          <div className="flex items-center justify-center gap-2 mt-8 mb-16">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === dotIdx
                    ? "w-8 bg-[#16271c]"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* FINISH SECTION CTA: REQUEST YOUR FENCING ESTIMATE */}
        <div
          ref={ctaRef}
          className="text-center pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <p className="text-sm text-neutral-600 font-normal">
            Ready to experience our verified standard of fencing craftsmanship?
          </p>
          <button
            id="testimonials-cta-button"
            onClick={handleScrollToEstimate}
            className="pl-6 pr-2 py-2 rounded-full bg-[#16271c] hover:bg-[#203927] border border-[#27402f] text-white text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-3 group"
          >
            <span className="tracking-wide">{testimonialsContent.ctaText}</span>
            <span className="w-8 h-8 rounded-full bg-[#f95721] group-hover:bg-[#ff6834] flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Reusable Clean Light Testimonial Card Component
 */
function TestimonialCard({
  item,
  index,
}: {
  item: TestimonialItem;
  index: number;
}) {
  return (
    <div className="h-full flex flex-col justify-between p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:border-neutral-300 transition-all duration-300">
      <div>
        {/* Top: Star Rating & Quotation Accent */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1">
            {[...Array(item.rating)].map((_, sIdx) => (
              <Star
                key={sIdx}
                className="w-4 h-4 fill-[#f95721] text-[#f95721]"
              />
            ))}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#16271c]/5 flex items-center justify-center text-[#16271c]/40">
            <Quote className="w-4 h-4" />
          </div>
        </div>

        {/* Review Body Text */}
        <p className="text-neutral-700 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-normal">
          &ldquo;{item.reviewText}&rdquo;
        </p>
      </div>

      {/* Card Bottom Meta */}
      <div className="pt-5 border-t border-neutral-100">
        {/* Project Scope Tag */}
        <div className="mb-4">
          <span className="inline-block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#16271c]/5 text-[#16271c] font-medium border border-[#16271c]/10">
            {item.projectScope}
          </span>
        </div>

        {/* Customer Profile Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            {/* Monogram Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#16271c] border border-[#27402f] flex items-center justify-center text-white text-xs font-semibold tracking-wider shadow-sm shrink-0">
              {item.avatarInitials}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
                {item.author}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{item.location}</span>
              </div>
            </div>
          </div>

          {/* Status & Source Badge */}
          <div className="text-right">
            {item.source && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>{item.source}</span>
              </span>
            )}

            {item.date && (
              <p className="text-[10px] text-neutral-400 font-mono mt-1">
                {item.date}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
