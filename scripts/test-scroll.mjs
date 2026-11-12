import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for Prompt 2 validation...");
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

  // Wait for initial load
  await new Promise((r) => setTimeout(r, 1000));

  // Scroll past hero into the Fencing Options section
  console.log("Scrolling past 4000px hero to Explore Our Fencing Options...");
  await page.evaluate(() => {
    const el = document.getElementById("fencing-options");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Capture full section overview
  console.log("Capturing Fencing Options Section...");
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fencing-options-overview.png") });

  // Verify that all 8 cards are present in the DOM
  const cardCount = await page.evaluate(() => {
    return document.querySelectorAll(".fence-card").length;
  });
  console.log(`Rendered cards count: ${cardCount} (Expected: 8)`);

  if (cardCount !== 8) {
    throw new Error(`Expected 8 cards, found ${cardCount}`);
  }

  // Test expanding specs on first card
  console.log("Testing 'Explore Specs' toggle...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const exploreBtn = buttons.find((b) => b.textContent?.includes("Explore Specs"));
    if (exploreBtn) exploreBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fencing-card-expanded.png") });

  // Test Material Filter: Click "Metal & Aluminum"
  console.log("Testing Material Filter: 'Metal & Aluminum'...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const metalBtn = buttons.find((b) => b.textContent?.includes("Metal & Aluminum"));
    if (metalBtn) metalBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const metalCardCount = await page.evaluate(() => {
    return document.querySelectorAll(".fence-card").length;
  });
  console.log(`Filtered metal cards count: ${metalCardCount} (Expected: 3 - aluminum, steel, chain-link)`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "fencing-filter-metal.png") });

  // Reset to "All Materials"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const allBtn = buttons.find((b) => b.textContent?.includes("All Materials"));
    if (allBtn) allBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Test clicking "Request Pricing" to trigger the linear-foot estimator drawer
  console.log("Testing 'Request Pricing' quote drawer...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const requestPricingBtn = buttons.find((b) => b.textContent?.includes("Request Pricing"));
    if (requestPricingBtn) requestPricingBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Verify modal is open and shows linear footage calculation
  const modalVisible = await page.evaluate(() => {
    return !!document.querySelector("input[type='range']");
  });
  console.log("Quote modal and linear foot slider visible:", modalVisible);

  await page.screenshot({ path: path.join(OUTPUT_DIR, "fencing-quote-modal.png") });

  await browser.close();

  if (errors.length > 0) {
    console.error("Test encountered errors:", errors);
    process.exit(1);
  }

  console.log("All Prompt 2 automated tests completed successfully!");
}

runTest().catch((err) => {
  console.error("Test run failed:", err);
  process.exit(1);
});
