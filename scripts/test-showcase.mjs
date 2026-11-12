import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for Showcase Section validation...");
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

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Scroll directly to Section 3: #fencing-showcase
  console.log("Scrolling down to #fencing-showcase...");
  await page.evaluate(() => {
    const el = document.getElementById("fencing-showcase");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });

  await new Promise((r) => setTimeout(r, 1200));

  // Verify Showcase Section presence and text
  const showcaseInfo = await page.evaluate(() => {
    const section = document.getElementById("fencing-showcase");
    if (!section) return null;
    const h2 = section.querySelector("h2");
    const badge = section.querySelector("span");
    const canvas = section.querySelector("canvas");
    return {
      hasSection: true,
      headingText: h2 ? h2.textContent : null,
      badgeText: badge ? badge.textContent : null,
      canvasWidth: canvas ? canvas.width : 0,
      canvasHeight: canvas ? canvas.height : 0,
    };
  });

  console.log("Showcase Section Info:", showcaseInfo);

  if (!showcaseInfo || !showcaseInfo.headingText?.includes("Crafted for Your")) {
    throw new Error("Showcase Section heading not found or incorrect!");
  }

  // 2. Capture initial state of showcase (0%)
  console.log("Capturing showcase 0% start...");
  await page.screenshot({ path: path.join(OUTPUT_DIR, "showcase-00-start.png") });

  // Get current scroll position of the showcase section trigger
  const showcaseScrollTop = await page.evaluate(() => window.scrollY);
  console.log("Showcase section top scroll offset:", showcaseScrollTop);

  // 3. Scrub 2000px into the showcase section (50%)
  console.log("Scrubbing +2000px into showcase...");
  await page.evaluate((top) => window.scrollTo({ top: top + 2000, behavior: "instant" }), showcaseScrollTop);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "showcase-50-mid.png") });

  // 4. Scrub +4000px to the end of the showcase (100%)
  console.log("Scrubbing +4000px to completion of showcase...");
  await page.evaluate((top) => window.scrollTo({ top: top + 4000, behavior: "instant" }), showcaseScrollTop);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "showcase-100-end.png") });

  // 5. Reverse scrub back to 0% of showcase
  console.log("Reverse scrubbing back to 0% of showcase...");
  await page.evaluate((top) => window.scrollTo({ top: top, behavior: "instant" }), showcaseScrollTop);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "showcase-00-reverse.png") });

  // 6. Verify Hero section still functions at the top of the page
  console.log("Verifying Hero section at top of page...");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-recheck.png") });

  await browser.close();

  if (errors.length > 0) {
    console.error("Test encountered errors:", errors);
    process.exit(1);
  }

  console.log("All Showcase Section automated tests passed successfully!");
}

runTest().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});

