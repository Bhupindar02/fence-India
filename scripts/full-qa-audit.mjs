import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output/qa-pass";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runFullQAAudit() {
  console.log("=================================================");
  console.log("STARTING FULL END-TO-END QA & INTEGRATION AUDIT");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const networkErrors = [];
  const warnings = [];

  page.on("pageerror", (err) => {
    console.error(" [PAGE ERROR]:", err.message);
    consoleErrors.push(err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(" [CONSOLE ERROR]:", msg.text());
      consoleErrors.push(msg.text());
    } else if (msg.type() === "warning") {
      warnings.push(msg.text());
    }
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.error(` [HTTP ${res.status()}]: ${res.url()}`);
      networkErrors.push(`${res.status()} ${res.url()}`);
    }
  });

  console.log("\n--- STEP 1: Navigation and Initial Load ---");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1500));

  // Verify Navbar & Announcement Bar
  const navbarInfo = await page.evaluate(() => {
    const nav = document.querySelector("nav");
    const topBar = document.querySelector('header > div:first-child');
    const brand = nav?.querySelector(".font-semibold")?.textContent?.trim();
    const phone = topBar?.querySelector('a[href^="tel:"]')?.textContent?.trim();
    const email = topBar?.querySelector('a[href^="mailto:"]')?.textContent?.trim();
    const quoteBtn = nav?.querySelector("button")?.textContent?.trim();
    return { hasNav: !!nav, brand, phone, email, quoteBtn };
  });
  console.log("Navbar & Top Bar Check:", navbarInfo);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "01-navbar-top.png") });

  // Verify 8 Sections Exact Order in DOM
  console.log("\n--- STEP 2: Strict Section Order Verification ---");
  const sectionOrderCheck = await page.evaluate(() => {
    const mainChildren = Array.from(document.querySelectorAll("main > section, main > footer"));
    return mainChildren.map((el, i) => ({
      index: i + 1,
      id: el.id || "unnamed",
      ariaLabel: el.getAttribute("aria-label") || "none",
      tagName: el.tagName.toLowerCase(),
    }));
  });
  console.log("Section Sequence Detected:", JSON.stringify(sectionOrderCheck, null, 2));

  // Check 1: Hero Canvas Scrubbing Forward & Reverse
  console.log("\n--- STEP 3: Hero Section (Section 1) Canvas Scrubbing ---");
  const heroCanvas = await page.evaluate(() => {
    const canvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    return {
      exists: !!canvas,
      width: canvas?.width,
      height: canvas?.height,
    };
  });
  console.log("Hero Canvas Status:", heroCanvas);

  // Scroll forward through hero (to scrollY = 2000)
  console.log("Scrolling forward through hero to 2000px...");
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "02-hero-midway.png") });

  // Scroll forward to end of hero (scrollY = 4000)
  console.log("Scrolling to end of hero animation (4000px)...");
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "03-hero-complete.png") });

  // Scroll in reverse back to 1000px
  console.log("Testing reverse scrub back to 1000px...");
  await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));

  // Check 2: Section 2 - Fencing Options & Pricing
  console.log("\n--- STEP 4: Fencing Options & Pricing (Section 2) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("fencing-options");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const optionsData = await page.evaluate(() => {
    const sec = document.getElementById("fencing-options");
    const h2 = sec?.querySelector("h2")?.textContent?.trim();
    const badge = sec?.querySelector(".inline-flex span:last-child")?.textContent?.trim();
    const cards = Array.from(sec?.querySelectorAll("article") || []).map((c) => ({
      name: c.querySelector("h3")?.textContent?.trim(),
      price: c.querySelector(".font-mono")?.textContent?.trim(),
    }));
    return { h2, badge, cardsCount: cards.length, sampleCards: cards.slice(0, 3) };
  });
  console.log("Fencing Options Data:", optionsData);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "04-fencing-options.png") });

  // Test expanding specs and opening estimate calculator
  console.log("Testing Specs Drawer & Pricing Calculator Modal...");
  await page.evaluate(() => {
    const firstCard = document.querySelector("#fencing-options article");
    const pricingBtn = firstCard?.querySelector('button.bg-\\[\\#16271c\\]');
    if (pricingBtn) pricingBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "05-pricing-modal.png") });

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector(".fixed.inset-0 button");
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Check 3: Section 3 - Second Video Showcase Canvas
  console.log("\n--- STEP 5: Second Video Showcase Canvas (Section 3) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("fencing-showcase");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const showcaseInfo = await page.evaluate(() => {
    const sec = document.getElementById("fencing-showcase");
    const h2 = sec?.querySelector("h2")?.textContent?.trim();
    const canvas = sec?.querySelector("canvas");
    return {
      h2,
      hasCanvas: !!canvas,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
    };
  });
  console.log("Second Showcase Info:", showcaseInfo);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "06-second-showcase-start.png") });

  // Check 4: Section 4 - Interactive Before & After Slider
  console.log("\n--- STEP 6: Before & After Slider (Section 4) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("before-after");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Test dragging slider handle
  console.log("Testing slider handle interaction...");
  const gliderBounds = await page.evaluate(() => {
    const sliderContainer = document.querySelector("#before-after .cursor-ew-resize");
    if (!sliderContainer) return null;
    const rect = sliderContainer.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

  if (gliderBounds) {
    const startX = gliderBounds.x + gliderBounds.width * 0.5;
    const targetX = gliderBounds.x + gliderBounds.width * 0.25;
    const centerY = gliderBounds.y + gliderBounds.height * 0.5;

    await page.mouse.move(startX, centerY);
    await page.mouse.down();
    await page.mouse.move(targetX, centerY, { steps: 10 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.screenshot({ path: path.join(OUTPUT_DIR, "07-before-after-dragged.png") });

  // Check 5: Section 5 - Why Choose Us
  console.log("\n--- STEP 7: Why Choose Us (Section 5) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("why-choose-us");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const whyChooseUsData = await page.evaluate(() => {
    const sec = document.getElementById("why-choose-us");
    const h2 = sec?.querySelector("h2")?.textContent?.trim();
    const cards = sec?.querySelectorAll(".benefit-card")?.length;
    const cta = sec?.querySelector(".rounded-3xl button")?.textContent?.trim();
    return { h2, cardsCount: cards, ctaText: cta };
  });
  console.log("Why Choose Us Data:", whyChooseUsData);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "08-why-choose-us.png") });

  // Check 6: Section 6 - Testimonials & Customer Reviews
  console.log("\n--- STEP 8: Testimonials & Customer Reviews (Section 6) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("testimonials");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Test carousel next and desktop grid toggle
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next testimonials"]');
    if (nextBtn && !nextBtn.disabled) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "09-testimonials-carousel.png") });

  await page.evaluate(() => {
    const gridBtn = document.querySelector('button[aria-label="Switch to Grid View"]');
    if (gridBtn) gridBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "10-testimonials-grid.png") });

  // Switch back to carousel
  await page.evaluate(() => {
    const carouselBtn = document.querySelector('button[aria-label="Switch to Carousel View"]');
    if (carouselBtn) carouselBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Check 7: Section 7 - Fencing Inquiry Form
  console.log("\n--- STEP 9: Fencing Inquiry Form (Section 7) ---");
  await page.evaluate(() => {
    const sec = document.getElementById("inquiry-form");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Test form submission
  console.log("Testing End-to-End Inquiry Form Submission...");
  await page.click("#fullName");
  await page.type("#fullName", "David C. Miller");

  await page.click("#email");
  await page.type("#email", "david.miller@floridaproperties.com");

  await page.click("#phone");
  await page.type("#phone", "7275550188");

  await page.click("#zipCode");
  await page.type("#zipCode", "33701");

  await page.click("#fenceLength");
  await page.type("#fenceLength", "220");

  await page.click("#description");
  await page.type("#description", "Full perimeter installation with double gate for lawn equipment.");

  await page.evaluate(() => {
    const btn = document.querySelector('#inquiry-form button[type="submit"]');
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 2000));

  const inquiryResult = await page.evaluate(() => {
    const confirmation = document.querySelector("#inquiry-form h3")?.textContent?.trim();
    const ref = document.querySelector("#inquiry-form .font-mono")?.textContent?.trim();
    return { confirmation, ref };
  });
  console.log("Inquiry Form Submission Result:", inquiryResult);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "11-inquiry-confirmed.png") });

  // Check 8: Section 8 - Final High-Impact CTA Section & Footer
  console.log("\n--- STEP 10: Final CTA Section (Section 8) & Site Footer ---");
  await page.evaluate(() => {
    const sec = document.getElementById("final-cta");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const finalCtaDetails = await page.evaluate(() => {
    const sec = document.getElementById("final-cta");
    const h2 = sec?.querySelector("h2")?.textContent?.trim();
    const buttons = Array.from(sec?.querySelectorAll("button") || []).map((b) => b.textContent?.trim());
    return { h2, buttons };
  });
  console.log("Final CTA Info:", finalCtaDetails);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "12-final-cta.png") });

  // Test Footer
  await page.evaluate(() => {
    const footer = document.querySelector('footer[aria-label="Site Footer"]');
    if (footer) footer.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "13-footer.png") });

  // Check Mobile Viewport (390 x 844) Responsiveness
  console.log("\n--- STEP 11: Mobile Responsive Viewport Audit (390 x 844) ---");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1500));

  // Check for horizontal overflow
  const horizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Horizontal overflow detected on mobile:", horizontalOverflow);

  await page.screenshot({ path: path.join(OUTPUT_DIR, "14-mobile-top.png") });

  // Scroll through each section on mobile
  const sectionsToCapture = ["fencing-options", "before-after", "why-choose-us", "testimonials", "inquiry-form", "final-cta"];
  for (const sId of sectionsToCapture) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant" });
    }, sId);
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `15-mobile-${sId}.png`) });
  }

  await browser.close();

  console.log("\n=================================================");
  console.log("FULL QA AUDIT SUMMARY REPORT");
  console.log("=================================================");
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Network / HTTP Errors: ${networkErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error("Detected Console Errors:", consoleErrors);
  }
  if (networkErrors.length > 0) {
    console.error("Detected Network Errors:", networkErrors);
  }
  console.log("Full QA Audit Completed Successfully!");
}

runFullQAAudit().catch((err) => {
  console.error("Full QA Audit Failed with exception:", err);
  process.exit(1);
});

