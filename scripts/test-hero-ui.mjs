import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ARTIFACT_DIR = "/Users/viper/.gemini/antigravity/brain/e0a73da9-5414-4cb0-93d7-2ffe58271e5a/hero-qa";

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function verifyHeroUI() {
  console.log("==================================================");
  console.log("VERIFYING HERO HEADLINE, TAGLINE & UI/UX POLISH");
  console.log("==================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const viewports = [
    { name: "mobile-390", width: 390, height: 844, isMobile: true },
    { name: "tablet-768", width: 768, height: 1024, isMobile: false },
    { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
  ];

  for (const vp of viewports) {
    console.log(`\nTesting ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));

    const evaluation = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const h1Text = h1 ? h1.innerText.replace(/\s+/g, " ").trim() : "";
      
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const taglineP = paragraphs.find(p => p.innerText.includes("Secure your space with durable, reliable fencing"));
      const taglineText = taglineP ? taglineP.innerText.trim() : "";

      const buttons = Array.from(document.querySelectorAll('a[href="#inquiry-form"], a[href="#fencing-options"]'));
      const buttonMetrics = buttons.map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
          text: btn.innerText.trim(),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          meetsMinTouchTarget: rect.width >= 44 && rect.height >= 44,
        };
      });

      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const hasOverflow = docWidth > winWidth;

      return {
        h1Found: !!h1,
        h1Text,
        taglineFound: !!taglineP,
        taglineText,
        buttonMetrics,
        hasOverflow,
        scrollWidth: docWidth,
        innerWidth: winWidth,
      };
    });

    console.log("Results for", vp.name, evaluation);

    const screenshotPath = path.join(ARTIFACT_DIR, `hero-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: ${screenshotPath}`);

    if (consoleErrors.length > 0) {
      console.warn("Console errors encountered:", consoleErrors);
    }

    await page.close();
  }

  // Also test desktop scroll fade behavior
  console.log("\nTesting Desktop Scroll Fade Behavior...");
  const desktopScrollPage = await browser.newPage();
  await desktopScrollPage.setViewport({ width: 1440, height: 900 });
  await desktopScrollPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1500));

  // Check before scroll (progress 0)
  const initialOpacity = await desktopScrollPage.evaluate(() => {
    const h1 = document.querySelector("h1");
    const container = h1?.closest(".text-center");
    return container ? window.getComputedStyle(container).opacity : null;
  });
  console.log("Initial container opacity (at progress 0):", initialOpacity);

  // Scroll down by 800px
  await desktopScrollPage.evaluate(() => window.scrollTo(0, 800));
  await new Promise((r) => setTimeout(r, 600));

  const scrolledOpacity = await desktopScrollPage.evaluate(() => {
    const h1 = document.querySelector("h1");
    const container = h1?.closest(".text-center");
    return container ? window.getComputedStyle(container).opacity : null;
  });
  console.log("Scrolled container opacity (at 800px scroll):", scrolledOpacity);

  const scrollScreenshotPath = path.join(ARTIFACT_DIR, `hero-desktop-scrolled-800px.png`);
  await desktopScrollPage.screenshot({ path: scrollScreenshotPath });
  console.log(`Saved scrolled screenshot: ${scrollScreenshotPath}`);

  await desktopScrollPage.close();
  await browser.close();
  console.log("\nALL HERO UI CHECKS COMPLETE.");
}

verifyHeroUI().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

