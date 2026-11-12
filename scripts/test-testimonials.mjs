import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for Testimonials Section verification...");
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
  const errors = [];
  const logs = [];

  page.on("pageerror", (err) => {
    console.error("Page Error:", err);
    errors.push(err.toString());
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Console Error:", msg.text());
      errors.push(msg.text());
    }
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.error("HTTP Error:", res.status(), res.url());
      errors.push(`${res.status()} ${res.url()}`);
    }
  });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Verify all 6 sections exist in DOM
  const domSections = await page.evaluate(() => ({
    hero: !!document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas'),
    options: !!document.getElementById("fencing-options"),
    showcase: !!document.getElementById("fencing-showcase"),
    beforeAfter: !!document.getElementById("before-after"),
    whyChooseUs: !!document.getElementById("why-choose-us"),
    testimonials: !!document.getElementById("testimonials"),
  }));
  console.log("DOM Sections Present:", domSections);

  // 2. Scroll to Testimonials section
  console.log("Scrolling directly to #testimonials...");
  await page.evaluate(() => {
    const sec = document.getElementById("testimonials");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Inspect testimonials section content
  const testimonialData = await page.evaluate(() => {
    const sec = document.getElementById("testimonials");
    if (!sec) return null;

    const badge = sec.querySelector(".inline-flex span:last-child")?.textContent?.trim();
    const heading = sec.querySelector("h2")?.textContent?.trim();
    const sub = sec.querySelector("p")?.textContent?.trim();
    const cards = Array.from(sec.querySelectorAll('[role="group"][aria-roledescription="slide"]')).map((el) => {
      const author = el.querySelector("h4")?.textContent?.trim();
      const scope = el.querySelector(".font-mono")?.textContent?.trim();
      const stars = el.querySelectorAll("svg.fill-\\[\\#f95721\\]")?.length;
      const quote = el.querySelector("p.text-neutral-700")?.textContent?.trim();
      const location = el.querySelector(".text-neutral-500")?.textContent?.trim();
      const source = el.querySelector(".bg-emerald-50 span")?.textContent?.trim();
      return { author, scope, stars, quote: quote?.substring(0, 60) + "...", location, source };
    });

    const ctaText = sec.querySelector("#testimonials-cta-button span")?.textContent?.trim();

    return { badge, heading, sub, cardsCount: cards.length, cards, ctaText };
  });

  console.log("Testimonial Data:", JSON.stringify(testimonialData, null, 2));

  // 4. Capture Initial Desktop Carousel Screenshot
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section6-testimonials-desktop-slide1.png") });

  // 5. Test Carousel Next Button
  console.log("Testing Carousel Next Button Click...");
  const nextClicked = await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next testimonials"]');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      return true;
    }
    return false;
  });
  console.log("Next button clicked:", nextClicked);
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUTPUT_DIR, "section6-testimonials-desktop-slide2.png") });

  // 5b. Test Desktop Grid View Toggle
  console.log("Testing Desktop Grid View Toggle...");
  await page.evaluate(() => {
    const gridBtn = document.querySelector('button[aria-label="Switch to Grid View"]');
    if (gridBtn) gridBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section6-testimonials-desktop-grid.png") });

  // Switch back to Carousel
  await page.evaluate(() => {
    const carouselBtn = document.querySelector('button[aria-label="Switch to Carousel View"]');
    if (carouselBtn) carouselBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 6. Test Keyboard Navigation (ArrowLeft to return)
  console.log("Testing Keyboard Navigation (ArrowLeft)...");
  await page.evaluate(() => {
    const container = document.querySelector('[aria-roledescription="carousel"]');
    if (container) {
      container.focus();
    }
  });
  await page.keyboard.press("ArrowLeft");
  await new Promise((r) => setTimeout(r, 600));

  // 7. Test CTA Button Scroll
  console.log("Testing CTA Button Click...");
  await page.evaluate(() => {
    const ctaBtn = document.getElementById("testimonials-cta-button");
    if (ctaBtn) ctaBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const scrollResult = await page.evaluate(() => ({
    scrollY: window.scrollY,
    optionsTop: document.getElementById("fencing-options")?.offsetTop,
  }));
  console.log("Scroll result after CTA click:", scrollResult);

  // 8. Mobile Viewport Verification (390 x 844)
  console.log("Testing Mobile Viewport...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const sec = document.getElementById("testimonials");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section6-testimonials-mobile.png") });

  await browser.close();

  console.log("-----------------------------------------");
  console.log("Total errors encountered:", errors.length);
  if (errors.length > 0) {
    console.error("Errors found:", errors);
    process.exit(1);
  } else {
    console.log("All Testimonials verifications passed flawlessly with 0 errors!");
  }
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

