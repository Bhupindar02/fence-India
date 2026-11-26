import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function verifyCDNAnimation() {
  console.log("==================================================");
  console.log("TESTING CLOUDINARY SMOOTH ANIMATION INTEGRATION");
  console.log("==================================================");

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
  const consoleErrors = [];
  const cdnHeroRequests = [];
  const cdnShowcaseRequests = [];

  page.on("pageerror", (err) => {
    console.error(" [PAGE ERROR]:", err.message);
    consoleErrors.push(err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(" [CONSOLE ERROR]:", msg.text());
      consoleErrors.push(msg.text());
    }
  });

  page.on("response", (res) => {
    const url = res.url();
    if (url.includes("res.cloudinary.com")) {
      if (url.includes("frame_") || url.includes("fence_hero")) {
        cdnHeroRequests.push({ url, status: res.status() });
      } else if (url.includes("fencing-frame")) {
        cdnShowcaseRequests.push({ url, status: res.status() });
      }
    }
  });

  console.log("\n1. Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2500));

  console.log(`- Hero CDN Requests captured on initial load: ${cdnHeroRequests.length}`);
  if (cdnHeroRequests.length > 0) {
    console.log("  Initial Hero Frame:", cdnHeroRequests[0]);
  }

  // Scroll through Hero section
  console.log("\n2. Scrolling through Hero sequence to test dynamic canvas scrub...");
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 500));

  console.log(`- Total Hero CDN Requests captured after scrub: ${cdnHeroRequests.length}`);

  // Scroll to Showcase section
  console.log("\n3. Scrolling to Showcase section...");
  await page.evaluate(() => {
    const el = document.getElementById("fencing-showcase");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 2500));

  console.log(`- Showcase CDN Requests captured: ${cdnShowcaseRequests.length}`);
  if (cdnShowcaseRequests.length > 0) {
    console.log("  Initial Showcase Frame:", cdnShowcaseRequests[0]);
  }

  // Scroll within Showcase section
  await page.evaluate(() => {
    window.scrollBy({ top: 1500, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));

  // Check canvas status and ensure no canvas taint
  const canvasStatus = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll("canvas"));
    return canvases.map((c, i) => {
      let isTainted = false;
      try {
        c.toDataURL("image/jpeg", 0.1);
      } catch (e) {
        isTainted = true;
      }
      return {
        index: i + 1,
        width: c.width,
        height: c.height,
        isTainted,
      };
    });
  });

  console.log("\n4. Canvas Health & CORS Integrity Check:", canvasStatus);

  await browser.close();

  console.log("\n==================================================");
  console.log("CDN INTEGRATION VERIFICATION SUMMARY");
  console.log("==================================================");
  console.log(`Hero CDN Requests Count: ${cdnHeroRequests.length}`);
  console.log(`Showcase CDN Requests Count: ${cdnShowcaseRequests.length}`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Canvas Tainting Detected: ${canvasStatus.some((c) => c.isTainted)}`);

  const allPassed =
    cdnHeroRequests.length > 0 &&
    cdnHeroRequests.every((r) => r.status === 200 || r.status === 304) &&
    cdnShowcaseRequests.length > 0 &&
    cdnShowcaseRequests.every((r) => r.status === 200 || r.status === 304) &&
    consoleErrors.length === 0 &&
    !canvasStatus.some((c) => c.isTainted);

  if (!allPassed) {
    console.error("Test failed: Some assertions did not pass.");
    process.exit(1);
  }

  console.log("\n SUCCESS: All Hero and Showcase frames streaming smoothly over Cloudinary CDN with 0 errors!");
}

verifyCDNAnimation().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

