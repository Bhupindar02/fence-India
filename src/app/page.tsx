"use client";

import React, { useState, useCallback } from "react";
import FrameScrubber from "@/components/FrameScrubber";
import HeroOverlay from "@/components/HeroOverlay";
import FencingOptionsSection from "@/components/FencingOptionsSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import BeforeAfterGlider from "@/components/BeforeAfterGlider";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InquiryFormSection from "@/components/InquiryFormSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import { useLenisScroll } from "@/hooks/useLenisScroll";

export default function Home() {
  // Initialize Lenis smooth scroll coordinated with GSAP ticker and ScrollTrigger
  useLenisScroll();

  const [heroProgress, setHeroProgress] = useState(0);
  const handleHeroProgress = useCallback((progress: number) => {
    setHeroProgress(progress);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#000000] text-white selection:bg-neutral-800">
      {/* 
        SECTION 1: HERO SECTION MAIN VIDEO
        - Apple-style, full-bleed, edge-to-edge image sequence canvas
        - Premium architectural headline & tagline with subtle cinematic contrast overlays
        - Responsive CTAs: "Get a Free Estimate" and "Explore Fencing Options"
        - Desktop: 4000px pinned scrub distance with graceful fade as construction unfolds
        - Mobile: Autoplay single-play Cloudinary video with persistent interactive copy
        - Exact 239 native frames extracted from video1.mp4 (1920x1080)
      */}
      <section
        aria-label="Fencing Transformation Hero Sequence"
        className="relative w-full bg-[#000000]"
      >
        <FrameScrubber
          totalFrames={238}
          framePathPrefix="https://res.cloudinary.com/qk5wy6np/image/upload/fence_hero"
          frameExtension=".webp"
          padDigits={0}
          scrollDistance={4000}
          scrubDuration={0.5}
          mobileVideoSrc="https://res.cloudinary.com/qk5wy6np/video/upload/v1794407836/video1.mp4"
          onProgress={handleHeroProgress}
        >
          <HeroOverlay progress={heroProgress} />
        </FrameScrubber>
      </section>

      {/* 
        SECTION 2: ALL TYPES OF FENCING AND THEIR PRICING
        - "Explore Our Fencing Options"
        - Placed immediately after the hero construction animation
        - Covers all 8 major US residential & commercial categories
        - Authentic photographs with crisp craftsmanship
        - Transparent per-linear-foot installed cost estimates
        - Interactive material, privacy, and budget filters
        - Custom linear-footage estimate drawer & inquiry form
      */}
      <FencingOptionsSection />

      {/* 
        SECTION 3: SECOND SCROLL-DRIVEN SHOWCASE VIDEO
        - "Crafted for Your Property"
        - Positioned directly below "Explore Our Fencing Options"
        - Second cinematic fence transformation (video2.mp4, 239 native frames)
        - Controlled through vertical scrolling via shared canvas architecture
        - Restrained chapter heading & description with subtle gradient overlay
        - Pinned with 4000px scrub distance
      */}
      <ShowcaseSection />

      {/* 
        SECTION 4: BEFORE-AND-AFTER IMAGE GLIDER
        - "See the Transformation"
        - Interactive drag-to-reveal slider showing actual property transformation
        - Identical camera position, angle, and perspective
        - Pointer events for desktop and touch with 2% - 98% clamping
        - Auto-play restrained demo animation via GSAP ScrollTrigger
        - Accessible keyboard support and case study specifications
      */}
      <BeforeAfterGlider />

      {/* 
        SECTION 5: WHY CHOOSE US
        - "Why Homeowners Choose Us"
        - Positioned immediately below the Before & After slider
        - 6 visually consistent benefit items with clean icons and verifiable details
        - Business-specific editable content configuration in src/data/whyChooseUs.ts
        - Subtle GSAP ScrollTrigger staggered entrance animations
        - Responsive layout (single/two-column mobile, 3-column desktop)
        - Trust-focused closing summary & direct CTA to the estimate inquiry form
      */}
      <WhyChooseUsSection />

      {/* 
        SECTION 6: CUSTOMER TESTIMONIALS AND REVIEWS
        - "What Our Customers Say"
        - Positioned immediately below the Why Choose Us section
        - Horizontal swipeable carousel on mobile, refined responsive track on desktop
        - Clean light card design with subtle quotation accents and star ratings
        - Mouse dragging, touch swiping, keyboard navigation, and previous/next controls
        - Non-fabricated authentic homeowner reviews with editable config in src/data/testimonials.ts
        - "Request Your Fencing Estimate" CTA button navigating to estimate inquiry form
      */}
      <TestimonialsSection />

      {/* 
        SECTION 7: FENCING INQUIRY FORM
        - "Tell Us About Your Fencing Project"
        - Positioned immediately below the customer testimonials section
        - Full name, email, phone, ZIP code, property type, fence type, length, height, gates, timeline, notes
        - Material preselection support and state transfer from previous CTAs
        - Server-side validation via Next.js Route Handler /api/inquiry
        - Atomic local lead persistence in data/inquiries.json + CRM webhook / Resend email integration hooks
        - Loading, success (with lead ID and recap), and failure error handling
        - Honeypot anti-spam, privacy notice, and "Request My Free Estimate" button
      */}
      <InquiryFormSection />

      {/* 
        SECTION 8: FINAL HIGH-IMPACT CALL TO ACTION
        - "Ready to Transform Your Property?"
        - Positioned directly below the inquiry form and immediately above the footer
        - Architectural background photograph with restrained contrast overlay
        - Dual CTAs: Primary ("Get a Free Fencing Estimate" -> #inquiry-form) and Secondary ("Explore Fencing Options" -> #fencing-options)
        - Subtle GSAP ScrollTrigger opacity and scale entrance transition
        - Smooth navigation with zero dead links
      */}
      <FinalCTASection />

      {/* 
        SITE FOOTER
        - Brand identity, contact details, service territory, quick anchor links, and back-to-top control
      */}
      <Footer />
    </main>
  );
}
