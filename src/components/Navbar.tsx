"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element =
      document.getElementById("inquiry-form") ||
      document.getElementById("fencing-options");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col">
      {/* 1. Top Green Announcement Bar */}
      <div className="w-full bg-[#16271c] text-[#a4baa9] text-[11px] sm:text-xs py-2 px-4 sm:px-8 flex items-center justify-between border-b border-[#243a2b] shadow-sm">
        {/* Left: Status announcement */}
        <div className="flex items-center gap-2 max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-[#f95721] shrink-0 animate-pulse" />
          <span className="font-normal tracking-wide truncate">
            Looking for fencing experts? We&apos;re just a call away!
          </span>
        </div>

        {/* Right: Phone & Email Contact Info */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium shrink-0">
          <a
            href="tel:18005723362"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
            <span>1800-572-FENCE</span>
          </a>

          <span className="text-[#324b3a]">|</span>

          <a
            href="mailto:info@fenceco.in"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
            <span>info@fenceco.in</span>
          </a>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-colors duration-300 px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md border-b border-neutral-900 shadow-xl"
            : "bg-black/80 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          {/* Green Rounded Square with 'F' */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#374f3d] border border-[#48634e] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm group-hover:bg-[#405c47] transition-colors">
            F
          </div>

          {/* Company Name & LLC */}
          <div className="flex flex-col leading-none">
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center">
              <span>FenceCo</span>
              <span className="text-[#f95721]">.</span>
            </div>
            <span className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.2em] sm:tracking-[0.22em] text-[#8ea393] uppercase mt-0.5">
              INDIA PVT. LTD.
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium text-neutral-300">
          <Link
            href="/"
            className="text-white hover:text-white transition-colors"
          >
            Home
          </Link>
          <button
            onClick={(e) => handleNavClick(e, "why-choose-us")}
            className="hover:text-white transition-colors"
          >
            About Us
          </button>
          <button
            onClick={(e) => handleNavClick(e, "fencing-options")}
            className="hover:text-white transition-colors"
          >
            Fencing Options
          </button>
          <button
            onClick={(e) => handleNavClick(e, "before-after")}
            className="hover:text-white transition-colors"
          >
            Transformations
          </button>
          <button
            onClick={(e) => handleNavClick(e, "testimonials")}
            className="hover:text-white transition-colors"
          >
            Reviews
          </button>
          <button
            onClick={(e) => handleNavClick(e, "inquiry-form")}
            className="hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Right: CTA Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* "Get a free quote" Pill Button */}
          <button
            onClick={handleScrollToQuote}
            className="pl-3.5 sm:pl-5 pr-1.5 py-1.5 rounded-full bg-[#374f3d] hover:bg-[#425d48] border border-[#4d6b54] text-white text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 sm:gap-3 group min-h-[44px]"
          >
            <span className="tracking-wide hidden xs:inline">Get a free quote</span>
            <span className="tracking-wide xs:hidden">Free quote</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f95721] group-hover:bg-[#ff6834] flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 lg:hidden hover:text-white flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-neutral-950/98 backdrop-blur-xl border-b border-neutral-800 p-5 sm:p-6 flex flex-col gap-2 text-sm animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center font-medium"
          >
            Home
          </Link>
          <button
            onClick={(e) => handleNavClick(e, "why-choose-us")}
            className="text-neutral-300 px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center text-left"
          >
            About Us &amp; Standards
          </button>
          <button
            onClick={(e) => handleNavClick(e, "fencing-options")}
            className="text-neutral-300 px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center text-left"
          >
            Fencing Options &amp; Pricing
          </button>
          <button
            onClick={(e) => handleNavClick(e, "before-after")}
            className="text-neutral-300 px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center text-left"
          >
            Before &amp; After Transformation
          </button>
          <button
            onClick={(e) => handleNavClick(e, "testimonials")}
            className="text-neutral-300 px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center text-left"
          >
            Customer Reviews
          </button>
          <button
            onClick={(e) => handleNavClick(e, "inquiry-form")}
            className="text-[#f95721] font-semibold px-3 py-2.5 rounded-lg hover:bg-neutral-900 min-h-[44px] flex items-center text-left"
          >
            Request Free Estimate →
          </button>

          <div className="pt-3 mt-1 border-t border-neutral-800 flex flex-col gap-2.5 text-xs text-neutral-400">
            <a
              href="tel:18005723362"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-900 text-neutral-300 min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-[#f95721] shrink-0" />
              <span>1800-572-FENCE</span>
            </a>
            <a
              href="mailto:info@fenceco.in"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-900 text-neutral-300 min-h-[44px]"
            >
              <Mail className="w-4 h-4 text-[#f95721] shrink-0" />
              <span>info@fenceco.in</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
