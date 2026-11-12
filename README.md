# fence-India — Modern Architectural Fencing Website

A high-performance, conversion-focused web application for an Indian architectural fencing business (**FenceCo India Pvt. Ltd.**). Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **GSAP ScrollTrigger**, and **Lenis** smooth scrolling.

---

## Features & Section Sequence

The site follows an engineered 8-section user journey optimized for trust, visual impact, and lead conversion:

1. **Cinematic Hero Transformation** (`Section 1`):
   - Apple-style, full-bleed scroll-driven HTML5 canvas animation.
   - 239 frames streamed via Cloudinary/Cloudflare CDN with an intelligent two-tier stride preloader for instantaneous 60fps scrubbing.
2. **Material Catalog & Cost Guide** (`Section 2`):
   - All 8 primary fencing categories (Wood, Vinyl, Aluminum, Chain-link, Composite, Steel, Split-Rail, Farm & Ranch).
   - Dynamic linear-footage price calculator modal and material specs drawer.
3. **Architectural Showcase Video** (`Section 3`):
   - Second scroll-driven canvas sequence with contextual process callouts and subtle dark contrast overlays.
4. **Interactive Before & After Comparison Slider** (`Section 4`):
   - Touch/drag split glider comparing unsecure yards to finished architectural boundaries.
5. **Why Choose Us** (`Section 5`):
   - 6 visually consistent credential benefit items highlighting licensing, material standards, and transparent proposals.
6. **Customer Testimonials & Reviews** (`Section 6`):
   - Responsive horizontal swipeable carousel on mobile and grid view on desktop with verified badges and rating summaries.
7. **Fencing Estimate Inquiry Form** (`Section 7`):
   - Comprehensive lead capture with project specs (footage, height, gates, timeline, property type).
   - Server-side validation via Next.js Route Handler (`/api/inquiry`) and atomic persistence.
   - iOS Safari auto-zoom prevention (16px mobile input targets) and 44px minimum tap boundaries.
8. **Final High-Impact CTA & Footer** (`Section 8`):
   - Architectural backdrop with dual navigation CTAs and complete footer directory.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Animation**: GSAP 3 (ScrollTrigger), Lenis Smooth Scroll
- **CDN / Media**: Cloudinary + Cloudflare Global Edge CDN
- **Icons**: Lucide React
- **Testing**: Puppeteer End-to-End & Multi-Viewport Responsive QA Audits

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation
```bash
git clone https://github.com/Bhupindar02/fence-India.git
cd fence-India
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## Automated QA & Verification

The project includes automated Puppeteer testing scripts in the `scripts/` folder:

```bash
# Verify CDN image sequence streaming and canvas CORS integrity
node scripts/test-cdn-animation.mjs

# Verify 0 horizontal overflows across 7 device viewports (320px to 1920px)
node scripts/audit-responsive.mjs

# Full end-to-end integration and section sequence audit
node scripts/full-qa-audit.mjs
```

---

## License

Private repository — all rights reserved.
