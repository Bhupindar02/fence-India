import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output/responsive-audit";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "320-iphone-se", width: 320, height: 667 },
  { name: "375-iphone-mini", width: 375, height: 812 },
  { name: "390-iphone-14", width: 390, height: 844 },
  { name: "768-ipad-portrait", width: 768, height: 1024 },
  { name: "1024-ipad-landscape", width: 1024, height: 768 },
  { name: "1440-desktop", width: 1440, height: 900 },
  { name: "1920-fhd", width: 1920, height: 1080 },
];

async function runResponsiveAudit() {
  console.log("Launching Headless Chrome for Multi-Viewport Responsive Audit...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const issues = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      isMobile: vp.width < 1024,
      hasTouch: vp.width < 1024,
    });

    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Check Horizontal Overflow
    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const hasOverflow = docWidth > winWidth;
      
      // Find elements causing overflow if any
      const overflowingElements = [];
      if (hasOverflow) {
        document.querySelectorAll("*").forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || "").toString().slice(0, 50),
              right: rect.right,
              winWidth,
            });
          }
        });
      }
      return { hasOverflow, docWidth, winWidth, overflowingElements: overflowingElements.slice(0, 5) };
    });

    console.log(`- Horizontal Overflow: ${overflowInfo.hasOverflow ? "FAIL (Elements found)" : "PASS (0px overflow)"}`);
    if (overflowInfo.hasOverflow) {
      console.error("  Overflow details:", overflowInfo.overflowingElements);
      issues.push({ viewport: vp.name, type: "horizontal-overflow", details: overflowInfo.overflowingElements });
    }

    // Capture full top screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}-top.png`) });

    // Check specific critical sections
    const sections = ["fencing-options", "before-after", "why-choose-us", "testimonials", "inquiry-form", "final-cta"];
    for (const sId of sections) {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "instant" });
      }, sId);
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}-${sId}.png`) });
    }
    await page.close();
  }

  await browser.close();

  console.log("\n==========================================");
  console.log("RESPONSIVE AUDIT COMPLETED");
  console.log(`Total layout issues found: ${issues.length}`);
  if (issues.length > 0) {
    console.error("Issues summary:", JSON.stringify(issues, null, 2));
  } else {
    console.log("Zero layout overflows across all 7 viewports!");
  }
}

runResponsiveAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});

