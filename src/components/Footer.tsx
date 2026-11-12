"use client";

import React from "react";
import { ArrowUp, Phone, Mail, MapPin, Shield } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      aria-label="Site Footer"
      className="relative z-20 w-full bg-[#030504] text-white pt-16 pb-12 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
          {/* Column 1: Brand & Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#16271c] border border-[#27402f] flex items-center justify-center font-bold text-white shadow-sm text-sm">
                F
              </div>
              <span className="font-semibold tracking-tight text-base sm:text-lg text-white">
                FenceCo<span className="text-[#f95721]">.</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                INDIA PVT. LTD.
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Architectural fencing installation for Indian residential, commercial, and agricultural properties. Premium materials, laser-aligned setting depths, and transparent itemized pricing.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Licensed, Bonded &amp; Certified Pan-India</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              Explore Website
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <button
                  onClick={(e) => handleScrollTo(e, "fencing-options")}
                  className="hover:text-[#f95721] transition-colors text-left"
                >
                  All Types of Fencing &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleScrollTo(e, "fencing-showcase")}
                  className="hover:text-[#f95721] transition-colors text-left"
                >
                  Showcase Transformation Video
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleScrollTo(e, "before-after")}
                  className="hover:text-[#f95721] transition-colors text-left"
                >
                  Before &amp; After Comparison Slider
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleScrollTo(e, "why-choose-us")}
                  className="hover:text-[#f95721] transition-colors text-left"
                >
                  Why Property Owners Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleScrollTo(e, "testimonials")}
                  className="hover:text-[#f95721] transition-colors text-left"
                >
                  Client Reviews &amp; Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Fencing Specialties */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              Fencing Options
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>Seasoned Teak Wood Privacy</li>
              <li>Virgin Vinyl &amp; PVC Privacy</li>
              <li>Ornamental Aluminum &amp; Pool Fences</li>
              <li>Commercial Galvanized Chain-Link</li>
              <li>Architectural Composite Privacy</li>
              <li>3-Rail Split Rail &amp; Ranch Mesh</li>
            </ul>
          </div>

          {/* Column 4: Contact & Service Territory */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-neutral-300">
              <a
                href="tel:18005723362"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f95721] shrink-0" />
                <span>1800-572-FENCE</span>
              </a>

              <a
                href="mailto:info@fenceco.in"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#f95721] shrink-0" />
                <span>info@fenceco.in</span>
              </a>

              <div className="flex items-start gap-2.5 text-neutral-400 pt-1 leading-relaxed">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Serving Bengaluru, Delhi NCR, Mumbai, Pune, Hyderabad, Chennai &amp; Across India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} FenceCo India Pvt. Ltd. All rights reserved.</p>

          <button
            onClick={handleScrollToTop}
            aria-label="Back to Top"
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors group"
          >
            <span>Back to Top</span>
            <span className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-[#16271c] group-hover:border-[#27402f] group-hover:text-white transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

