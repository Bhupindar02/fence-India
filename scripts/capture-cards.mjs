import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const cards = document.querySelector(".fence-card");
    if (cards) cards.scrollIntoView({ behavior: "instant", block: "start" });
  });

  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "cards-grid-view.png") });

  await browser.close();
}

capture();

