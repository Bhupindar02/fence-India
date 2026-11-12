import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

async function run() {
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
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Checking Navbar elements...");
  const brandText = await page.evaluate(() => {
    const brand = document.querySelector("header nav a");
    return brand ? brand.textContent : null;
  });
  console.log("Brand text found:", brandText);

  // Take screenshot of top with navbar
  await page.screenshot({ path: path.join(OUTPUT_DIR, "navbar-top-view.png") });
  console.log("Captured navbar-top-view.png");

  // Test scrolling down 1500px and capturing scrolled navbar state
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "navbar-scrolled-view.png") });
  console.log("Captured navbar-scrolled-view.png");

  // Test clicking "Get a free quote" button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const quoteBtn = buttons.find((b) => b.textContent?.includes("Get a free quote"));
    if (quoteBtn) quoteBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "navbar-quote-clicked.png") });
  console.log("Captured navbar-quote-clicked.png");

  await browser.close();
  console.log("Navbar tests completed successfully!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

