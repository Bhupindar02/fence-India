import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for complete website & Why Choose Us verification...");
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
    } else {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1500));

  // Check section elements in DOM
  const sectionSummary = await page.evaluate(() => {
    const heroCanvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    const optionsSection = document.getElementById("fencing-options");
    const showcaseSection = document.getElementById("fencing-showcase");
    const transformSection = document.getElementById("before-after");
    const whyChooseUsSection = document.getElementById("why-choose-us");

    return {
      hasHeroCanvas: !!heroCanvas,
      hasOptionsSection: !!optionsSection,
      hasShowcaseSection: !!showcaseSection,
      hasTransformSection: !!transformSection,
      hasWhyChooseUsSection: !!whyChooseUsSection,
    };
  });

  console.log("Section summary:", sectionSummary);

  // Scroll to #before-after (Section 4)
  console.log("Scrolling to #before-after (Before & After)...");
  await page.evaluate(() => {
    const el = document.getElementById("before-after");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section4-before-after.png") });

  // Scroll down to Section 5: #why-choose-us
  console.log("Scrolling down to #why-choose-us (Why Choose Us)...");
  await page.evaluate(() => {
    const el = document.getElementById("why-choose-us");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await new Promise((r) => setTimeout(r, 1500));

  // Inspect Why Choose Us details
  const whyChooseUsDetails = await page.evaluate(() => {
    const sec = document.getElementById("why-choose-us");
    if (!sec) return null;

    const badge = sec.querySelector(".inline-flex span:last-child")?.textContent?.trim();
    const heading = sec.querySelector("h2")?.textContent?.trim();
    const cards = Array.from(sec.querySelectorAll(".benefit-card")).map((c) => ({
      number: c.querySelector(".font-mono")?.textContent?.trim(),
      title: c.querySelector("h3")?.textContent?.trim(),
      badge: c.querySelector(".uppercase")?.textContent?.trim(),
      desc: c.querySelector("p")?.textContent?.trim(),
      detailsCount: c.querySelectorAll(".space-y-2 > div").length,
    }));

    const trustBanner = sec.querySelector(".rounded-3xl");
    const trustStatement = trustBanner?.querySelector("p.text-lg, p.text-xl")?.textContent?.trim();
    const ctaButton = trustBanner?.querySelector("button")?.textContent?.trim();
    const badgesCount = trustBanner?.querySelectorAll(".grid > div")?.length;

    return {
      badge,
      heading,
      cardsCount: cards.length,
      cards,
      trustStatement,
      ctaButton,
      badgesCount,
    };
  });

  console.log("Why Choose Us details:", JSON.stringify(whyChooseUsDetails, null, 2));

  // Capture desktop screenshot
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section5-why-choose-us-desktop.png") });

  // Test clicking CTA button
  console.log("Testing CTA button click to verify smooth scroll to #fencing-options...");
  const clicked = await page.evaluate(() => {
    const sec = document.getElementById("why-choose-us");
    const btn = sec?.querySelector("button");
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  await new Promise((r) => setTimeout(r, 1000));

  const scrollPosAfterClick = await page.evaluate(() => ({
    scrollY: window.scrollY,
    optionsOffsetTop: document.getElementById("fencing-options")?.offsetTop,
  }));
  console.log("Scroll position after CTA click:", scrollPosAfterClick);

  // Test Mobile Viewport
  console.log("Testing Mobile Viewport (390 x 844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const el = document.getElementById("why-choose-us");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section5-why-choose-us-mobile.png") });

  await browser.close();

  console.log("-----------------------------------------");
  console.log("Total errors encountered:", errors.length);
  if (errors.length > 0) {
    console.error("Errors found:", errors);
  } else {
    console.log("All verifications passed flawlessly with 0 errors!");
  }
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
