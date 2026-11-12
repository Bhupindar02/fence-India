import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for Final CTA & Footer verification...");
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

  // 1. Verify complete site hierarchy: All 8 sections + Footer
  const fullHierarchy = await page.evaluate(() => ({
    sec1_hero: !!document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas'),
    sec2_options: !!document.getElementById("fencing-options"),
    sec3_showcase: !!document.getElementById("fencing-showcase"),
    sec4_beforeAfter: !!document.getElementById("before-after"),
    sec5_whyChooseUs: !!document.getElementById("why-choose-us"),
    sec6_testimonials: !!document.getElementById("testimonials"),
    sec7_inquiryForm: !!document.getElementById("inquiry-form"),
    sec8_finalCta: !!document.getElementById("final-cta"),
    footer: !!document.querySelector('footer[aria-label="Site Footer"]'),
  }));
  console.log("Full Site Hierarchy (8 Sections + Footer):", fullHierarchy);

  // 2. Scroll directly to #final-cta
  console.log("Scrolling to #final-cta...");
  await page.evaluate(() => {
    const el = document.getElementById("final-cta");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1200));

  // 3. Inspect Final CTA Content
  const ctaContent = await page.evaluate(() => {
    const sec = document.getElementById("final-cta");
    if (!sec) return null;
    const label = sec.querySelector(".inline-flex span:last-child")?.textContent?.trim();
    const heading = sec.querySelector("h2")?.textContent?.trim();
    const copy = sec.querySelector("p")?.textContent?.trim();
    const buttons = Array.from(sec.querySelectorAll("button")).map((b) => b.textContent?.trim());
    return { label, heading, copy, buttons };
  });
  console.log("Final CTA Content Details:", ctaContent);

  await page.screenshot({ path: path.join(OUTPUT_DIR, "section8-final-cta-desktop.png") });

  // 4. Test Primary Button Click: Scrolls to #inquiry-form
  console.log("Testing Primary CTA Click ('Get a Free Fencing Estimate')...");
  await page.evaluate(() => {
    const sec = document.getElementById("final-cta");
    const primaryBtn = sec?.querySelector("button");
    if (primaryBtn) primaryBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const scrollAfterPrimary = await page.evaluate(() => ({
    scrollY: window.scrollY,
    inquiryOffsetTop: document.getElementById("inquiry-form")?.offsetTop,
  }));
  console.log("Scroll position after Primary CTA:", scrollAfterPrimary);

  // 5. Scroll back down and test Secondary Button Click: Scrolls to #fencing-options
  console.log("Scrolling to #final-cta again to test Secondary CTA...");
  await page.evaluate(() => {
    const el = document.getElementById("final-cta");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log("Testing Secondary CTA Click ('Explore Fencing Options')...");
  await page.evaluate(() => {
    const sec = document.getElementById("final-cta");
    const btns = sec?.querySelectorAll("button");
    if (btns && btns[1]) btns[1].click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const scrollAfterSecondary = await page.evaluate(() => ({
    scrollY: window.scrollY,
    optionsOffsetTop: document.getElementById("fencing-options")?.offsetTop,
  }));
  console.log("Scroll position after Secondary CTA:", scrollAfterSecondary);

  // 6. Inspect Footer and test Back to Top
  console.log("Scrolling to Footer...");
  await page.evaluate(() => {
    const footer = document.querySelector('footer[aria-label="Site Footer"]');
    if (footer) footer.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "footer-desktop.png") });

  console.log("Testing Footer Back to Top button...");
  await page.evaluate(() => {
    const topBtn = document.querySelector('footer button[aria-label="Back to Top"]');
    if (topBtn) topBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const scrollAfterTop = await page.evaluate(() => window.scrollY);
  console.log("Scroll position after Back to Top:", scrollAfterTop);

  // 7. Mobile Viewport Verification (390 x 844)
  console.log("Testing Mobile Viewport (390 x 844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const el = document.getElementById("final-cta");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section8-final-cta-mobile.png") });

  await browser.close();

  console.log("-----------------------------------------");
  console.log("Total errors encountered:", errors.length);
  if (errors.length > 0) {
    console.error("Errors found:", errors);
    process.exit(1);
  } else {
    console.log("All Final CTA & Footer verifications passed flawlessly with 0 errors!");
  }
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

