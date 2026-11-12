import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ARTIFACT_DIR = "/Users/viper/.gemini/antigravity/brain/e0a73da9-5414-4cb0-93d7-2ffe58271e5a/mobile-debug";

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));

  // Initial view (hero)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "01-initial-mobile-load.png") });

  // Scroll down 400px (around bottom of hero / start of Section 2)
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "02-scrolled-400px.png") });

  // Scroll down 700px (right at the cut of hero and Section 2)
  await page.evaluate(() => window.scrollTo(0, 700));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "03-scrolled-700px.png") });

  await browser.close();
  console.log("Captured screenshots to:", ARTIFACT_DIR);
}

capture().catch(console.error);

