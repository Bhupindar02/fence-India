"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FENCING_OPTIONS,
  FencingOption,
} from "@/data/fencingOptions";
import {
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  SlidersHorizontal,
  X,
  Check,
  Info,
  Calculator,
  Phone,
  Mail,
  User,
  MapPin,
} from "lucide-react";

export default function FencingOptionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Card Expansion State for Detailed Specs
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Quote Drawer / Inquiry Modal State
  const [quoteFence, setQuoteFence] = useState<FencingOption | null>(null);
  const [linearFootage, setLinearFootage] = useState<number>(150);
  const [gateCount, setGateCount] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    notes: "",
  });

  // Filter Logic
  const filteredFences = useMemo(() => {
    return FENCING_OPTIONS.filter((fence) => {
      // Category Filter
      if (selectedCategory !== "all" && fence.category !== selectedCategory) {
        return false;
      }
      // Privacy Filter
      if (selectedPrivacy !== "all" && fence.privacyLevel !== selectedPrivacy) {
        return false;
      }
      // Budget Tier Filter
      if (selectedBudget !== "all") {
        if (selectedBudget === "value" && fence.budgetTier !== "₹") return false;
        if (selectedBudget === "mid" && fence.budgetTier !== "₹₹") return false;
        if (selectedBudget === "premium" && !["₹₹₹", "₹₹₹₹"].includes(fence.budgetTier)) return false;
      }
      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = fence.name.toLowerCase().includes(query);
        const matchesDesc = fence.description.toLowerCase().includes(query);
        const matchesCat = fence.categoryLabel.toLowerCase().includes(query);
        const matchesStyle = fence.availableStyles.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesStyle) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedPrivacy, selectedBudget, searchQuery]);

  // GSAP Entrance Animation on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsGridRef.current?.querySelectorAll(".fence-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: cardsGridRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  // Animate cards on filter changes
  useEffect(() => {
    const cards = cardsGridRef.current?.querySelectorAll(".fence-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0.5, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: "power1.out", clearProps: "all" }
      );
    }
  }, [filteredFences]);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleOpenQuote = (fence: FencingOption) => {
    setQuoteFence(fence);
    setFormSubmitted(false);
  };

  const handleCloseQuote = () => {
    setQuoteFence(null);
    setFormSubmitted(false);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Prevent background page scrolling & support Escape key when quote modal is open
  useEffect(() => {
    if (quoteFence) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleCloseQuote();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [quoteFence]);

  // Quick Estimated Calculation for Drawer
  const calculatedEstimate = useMemo(() => {
    if (!quoteFence) return { min: 0, max: 0 };
    const baseMin = linearFootage * quoteFence.pricePerLinearFootEstimate.min;
    const baseMax = linearFootage * quoteFence.pricePerLinearFootEstimate.max;
    // Gate allowance: ~₹15,000 - ₹35,000 per gate installed
    const gateAllowanceMin = gateCount * 15000;
    const gateAllowanceMax = gateCount * 35000;
    return {
      min: baseMin + gateAllowanceMin,
      max: baseMax + gateAllowanceMax,
    };
  }, [quoteFence, linearFootage, gateCount]);

  return (
    <section
      id="fencing-options"
      ref={sectionRef}
      aria-label="Explore Our Fencing Options"
      className="relative z-20 w-full bg-[#fbfbfb] text-neutral-900 pt-14 sm:pt-20 md:pt-28 pb-24 px-4 sm:px-6 md:px-12 lg:px-20 scroll-mt-28 overflow-hidden"
    >
      {/* 1. Luminous Amber Gradient Top Accent Line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#f95721] to-transparent z-10"
      />

      {/* 2. Seamless Dark-to-Light Atmospheric Gradient Bridge from Hero */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-44 sm:h-64 bg-gradient-to-b from-[#000000] via-[#0b140f]/60 via-[#e5ede7]/50 to-transparent pointer-events-none z-0"
      />

      {/* 3. Ambient Warm Orange Radial Glow at Top Center */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 sm:h-72 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(249,87,33,0.14),transparent_75%)] pointer-events-none z-0"
      />

      {/* 4. Subtle Architectural Blueprint Drafting Grid Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Exact Header matching the user's reference image */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">
          {/* Badge: MATERIAL & PRICE GUIDE with orange dot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-200/90 bg-white shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f95721] shrink-0" />
            <span className="text-[10.5px] font-mono tracking-[0.16em] text-neutral-600 font-semibold uppercase">
              MATERIAL &amp; PRICE GUIDE
            </span>
          </div>

          {/* Serif Heading with Orange Highlight - Single line on desktop */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-[#111827] mb-5 leading-tight">
            Explore Our <span className="text-[#f95721] inline-block">Fencing Options</span>
          </h2>

          {/* Exact Subtitle from user's image */}
          <p className="text-neutral-600 text-sm sm:text-base md:text-[17px] leading-relaxed font-normal max-w-2xl mx-auto">
            Compare India&apos;s leading residential and commercial fencing materials. Explore realistic
            installed pricing, privacy ratings, lifespan expectations, and popular architectural styles to
            find your perfect perimeter solution.
          </p>
        </div>

        {/* Transparent Pricing Disclaimer Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm text-neutral-600">
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[#f95721] shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold text-neutral-900">Pricing Transparency Note: </span>
            All rates shown are realistic contractor estimates per running foot for standard residential
            installations including posts and concrete footing. Final project cost varies according to
            exact site measurements, terrain slopes, gate quantities, soil conditions, and old wall removal.
          </div>
          <div className="shrink-0 font-mono text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
            Verified Indian Estimates
          </div>
        </div>

        {/* Interactive Filter Toolbar */}
        <div className="mb-12 flex flex-col gap-5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          {/* Top Row: Category Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap -mx-2 px-2 sm:mx-0 sm:px-0">
              {[
                { id: "all", label: "All Materials" },
                { id: "wood", label: "Natural Wood" },
                { id: "vinyl", label: "Engineered Vinyl" },
                { id: "metal", label: "Metal & Aluminum" },
                { id: "composite", label: "Composite" },
                { id: "ranch", label: "Farm & Ranch" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 sm:shrink min-h-[40px] flex items-center ${
                    selectedCategory === cat.id
                      ? "bg-[#111827] text-white shadow-md"
                      : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 border border-transparent"
                  }`}
                  aria-pressed={selectedCategory === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Reset if filters active */}
            {(selectedCategory !== "all" ||
              selectedPrivacy !== "all" ||
              selectedBudget !== "all" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedPrivacy("all");
                  setSelectedBudget("all");
                  setSearchQuery("");
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Bottom Row: Privacy, Budget & Keyword Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Privacy Level Dropdown Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 uppercase">Privacy:</span>
                <select
                  value={selectedPrivacy}
                  onChange={(e) => setSelectedPrivacy(e.target.value)}
                  className="bg-neutral-50 text-xs sm:text-sm text-neutral-800 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-400 cursor-pointer"
                >
                  <option value="all">Any Privacy</option>
                  <option value="Full Privacy">Full Privacy (100%)</option>
                  <option value="Open View">Open View / Picket</option>
                </select>
              </div>

              {/* Budget Tier Dropdown Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 uppercase">Budget:</span>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="bg-neutral-50 text-xs sm:text-sm text-neutral-800 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-400 cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="value">Value (₹1,100–₹2,600/ft)</option>
                  <option value="mid">Mid-Range (₹1,800–₹4,600/ft)</option>
                  <option value="premium">Premium (₹3,000–₹7,500/ft)</option>
                </select>
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search styles, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 border border-neutral-200 rounded-lg px-3.5 py-1.5 focus:outline-none focus:border-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 text-xs font-mono text-neutral-500">
          <span>
            Showing {filteredFences.length} of {FENCING_OPTIONS.length} Fencing Solutions
          </span>
          <span>Currency: INR (₹) · Installed Running Foot Rates</span>
        </div>

        {/* Fencing Cards Grid */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredFences.map((fence) => {
            const isExpanded = expandedCardId === fence.id;

            return (
              <article
                key={fence.id}
                className="fence-card group relative flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50"
              >
                {/* Authentic Photograph Container */}
                <div className="relative w-full aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <Image
                    src={fence.image}
                    alt={fence.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority={fence.id === "wood-privacy" || fence.id === "vinyl-pvc"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-wider text-white uppercase">
                    {fence.categoryLabel}
                  </div>

                  {/* Privacy Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-wider text-white">
                    {fence.privacyLevel}
                  </div>

                  {/* Price Tag Overlay at Image Base */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
                    <div>
                      <div className="text-2xl font-light tracking-tight text-white">
                        {fence.pricePerLinearFootEstimate.displayRange}
                      </div>
                      <div className="text-[11px] text-neutral-300 font-mono">
                        / running foot (installed est.)
                      </div>
                    </div>
                    <div className="text-xs font-mono px-2 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/20 text-white">
                      Tier: {fence.budgetTier}
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-1.5 font-serif">
                      {fence.name}
                    </h3>
                    <p className="text-xs text-neutral-500 italic mb-4 leading-relaxed">
                      &quot;{fence.tagline}&quot;
                    </p>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-5 line-clamp-3">
                      {fence.description}
                    </p>

                    {/* Quick Specs Matrix */}
                    <div className="space-y-2.5 py-3 border-y border-neutral-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-mono flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                          Durability
                        </span>
                        <span className="text-neutral-800 text-right font-medium">
                          {fence.durability.split("(")[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-mono flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          Maintenance
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                            fence.maintenanceLevel === "Low"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : fence.maintenanceLevel === "Moderate"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {fence.maintenanceLevel} Care
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-mono flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                          Styles
                        </span>
                        <span className="text-neutral-600 text-[11px] truncate max-w-[150px]">
                          {fence.availableStyles.slice(0, 2).join(", ")}...
                        </span>
                      </div>
                    </div>

                    {/* Expandable Technical Details Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-neutral-100 space-y-3.5 text-xs animate-in fade-in duration-300">
                        <div>
                          <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1.5 font-semibold">
                            Key Structural Advantages
                          </div>
                          <ul className="space-y-1.5">
                            {fence.advantages.map((adv, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-neutral-700">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{adv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1.5 font-semibold">
                            Typical Applications
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {fence.typicalApplications.map((app, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-700 font-medium"
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1.5 font-semibold">
                            Maintenance Guidance
                          </div>
                          <p className="text-[11px] text-neutral-600 leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                            {fence.maintenanceDetails}
                          </p>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1.5 font-semibold">
                            Cost Variables
                          </div>
                          <p className="text-[11px] text-neutral-600 leading-relaxed italic bg-amber-50/50 p-2 rounded border border-amber-200/50">
                            {fence.variableFactorsNote}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(fence.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors flex items-center justify-center gap-1.5"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? "Close Specs" : "Explore Specs"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenQuote(fence)}
                      className="py-2.5 px-4 rounded-xl bg-[#16271c] hover:bg-[#203a29] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 group/btn"
                    >
                      <span>Request Pricing</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f95721] group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredFences.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-white border border-neutral-200">
            <Info className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No Fencing Matches Found</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Try adjusting your material filters, privacy selection, or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPrivacy("all");
                setSelectedBudget("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bottom Editorial Callout */}
        <div className="mt-16 p-8 rounded-2xl bg-[#16271c] text-white border border-[#243b2b] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-2xl">
            <h4 className="text-2xl font-serif font-bold text-white">Need On-Site Engineering Guidance?</h4>
            <p className="text-xs sm:text-sm text-[#c7d7cb] leading-relaxed font-light">
              Our licensed master installers provide free on-site property measurements, laser-grade elevation
              surveys, and tailored design proposals throughout our service territory.
            </p>
          </div>
          <button
            onClick={() => handleOpenQuote(FENCING_OPTIONS[0])}
            className="px-6 py-3 rounded-xl bg-white text-neutral-900 font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            <Calculator className="w-4 h-4 text-[#f95721]" />
            <span>Schedule Free Property Estimate</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick Quote & Linear-Foot Estimator Drawer / Modal */}
      {quoteFence && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseQuote();
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] flex flex-col bg-white border border-neutral-200 rounded-3xl shadow-2xl text-neutral-900 overflow-hidden"
            data-lenis-prevent
          >
            {/* 1. Fixed / Sticky Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-neutral-100 flex items-center justify-between gap-3 bg-white z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 sm:p-3 rounded-xl bg-orange-50 border border-orange-100 text-[#f95721] shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-neutral-900 truncate">
                    Request Pricing: {quoteFence.name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">
                    Standard: {quoteFence.pricePerLinearFootEstimate.displayRange} per running foot installed
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseQuote}
                className="p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors shrink-0"
                aria-label="Close quote modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!formSubmitted ? (
              <form
                onSubmit={handleQuoteSubmit}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
              >
                {/* 2. Scrollable Modal Form Body with data-lenis-prevent */}
                <div
                  className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 text-neutral-900"
                  data-lenis-prevent
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {/* Instant Linear Footage Estimator Tool */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="text-neutral-500 uppercase font-semibold">Estimated Footage:</span>
                      <span className="text-neutral-900 font-bold text-base">{linearFootage} Running Feet</span>
                    </div>

                    <input
                      type="range"
                      min="30"
                      max="600"
                      step="10"
                      value={linearFootage}
                      onChange={(e) => setLinearFootage(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#f95721] mb-4"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-200 text-xs">
                      <div>
                        <label className="text-neutral-600 block mb-1 font-medium">Gates Needed:</label>
                        <select
                          value={gateCount}
                          onChange={(e) => setGateCount(Number(e.target.value))}
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-[#f95721]"
                        >
                          <option value="0">0 Gates</option>
                          <option value="1">1 Standard Walk Gate</option>
                          <option value="2">2 Walk Gates</option>
                          <option value="3">3 Walk Gates</option>
                          <option value="4">Walk + Automated Driveway Gate</option>
                        </select>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex flex-col justify-center shadow-xs">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Estimated Total</span>
                        <span className="text-base sm:text-lg font-bold text-[#16271c]">
                          ₹{calculatedEstimate.min.toLocaleString("en-IN")} – ₹{calculatedEstimate.max.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase font-semibold mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Priya Sharma"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#f95721]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase font-semibold mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#f95721]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase font-semibold mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="priya@example.com"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#f95721]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase font-semibold mb-1">
                        Property PIN Code *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.zip}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          placeholder="e.g. 560001"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#f95721]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase font-semibold mb-1">
                      Project Notes &amp; Slope / Site Conditions
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Need old boundary wall removed, sloped boundary on east side..."
                      className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-base sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#f95721] resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-normal">
                    By submitting, you request an official written estimate. We never sell your data or spam.
                  </p>
                </div>

                {/* 3. Sticky Modal Action Footer */}
                <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 bg-neutral-50/95 backdrop-blur-xs border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={handleCloseQuote}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-[#16271c] text-white font-semibold text-xs sm:text-sm hover:bg-[#203a29] transition-colors shadow-md min-h-[44px]"
                  >
                    Submit Custom Estimate Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 sm:p-8 text-center space-y-4 my-auto overflow-y-auto" data-lenis-prevent>
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Estimate Request Received</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-neutral-900 font-semibold">{formData.name}</span>! Our project
                  estimator will review your <span className="text-neutral-900 font-semibold">{quoteFence.name}</span> project for
                  PIN code <span className="text-neutral-900 font-semibold">{formData.zip}</span> and contact you at{" "}
                  <span className="text-neutral-900 font-semibold">{formData.phone}</span> within 1 business day.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleCloseQuote}
                    className="px-6 py-2.5 rounded-xl bg-[#16271c] text-white font-semibold text-xs sm:text-sm hover:bg-[#203a29] transition-colors shadow-md min-h-[44px]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
