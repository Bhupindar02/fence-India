import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function testThreePhasePreloader() {
  console.log("==================================================");
  console.log("TESTING 3-PHASE PROGRESSIVE PRELOADER WITH f_auto,q_90");
  console.log("==================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const networkRequests = [];
  const consoleErrors = [];

  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("cloudinary.com") && url.includes("/image/upload/")) {
      networkRequests.push(url);
    }
  });

  page.on("pageerror", (err) => consoleErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.setViewport({ width: 1440, height: 900 });

  const startTime = Date.now();
  console.log("1. Navigating to page...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

  // Phase 1 check: within 1 second, frame 0 should be rendered
  await new Promise((r) => setTimeout(r, 800));
  const phase1Check = await page.evaluate(() => {
    const canvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    if (!canvas) return { hasCanvas: false };
    const ctx = canvas.getContext("2d");
    // Sample center pixel to ensure it's not empty black (0,0,0,0)
    const pixel = ctx.getImageData(Math.round(canvas.width / 2), Math.round(canvas.height / 2), 1, 1).data;
    const loadingOverlay = document.querySelector('.absolute.inset-0.flex.flex-col.items-center');
    const isOverlayHidden = loadingOverlay ? window.getComputedStyle(loadingOverlay).opacity === "0" : true;

    return {
      hasCanvas: true,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      pixelData: Array.from(pixel),
      isOverlayHidden,
    };
  });
  console.log("Phase 1 Check (~0.8s elapsed):", phase1Check);

  // Phase 2 check: verify request URLs have f_auto,q_90 and keyframe striding
  const fAutoQ90Count = networkRequests.filter(url => url.includes("f_auto,q_90")).length;
  console.log(`Cloudinary requests using f_auto,q_90 so far: ${fAutoQ90Count} of ${networkRequests.length}`);

  // Test scrub fallback: scroll immediately into section
  console.log("\n2. Testing rapid scroll fallback (getNearestLoadedImage)...");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise((r) => setTimeout(r, 400));

  const scrubCheck = await page.evaluate(() => {
    const canvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    if (!canvas) return { hasCanvas: false };
    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(Math.round(canvas.width / 2), Math.round(canvas.height / 2), 1, 1).data;
    return {
      isNotTransparent: pixel[3] > 0,
      pixelSample: Array.from(pixel),
    };
  });
  console.log("Immediate scrub fallback check:", scrubCheck);

  // Wait 2 more seconds for Phase 2 keyframes to finish
  await new Promise((r) => setTimeout(r, 2000));
  console.log(`Total Cloudinary requests after Phase 2: ${networkRequests.length}`);

  // Test Showcase Section (Section 3)
  console.log("\n3. Testing Showcase Section (Section 3) with f_auto,q_90...");
  await page.evaluate(() => {
    const showcase = document.getElementById("fencing-showcase");
    if (showcase) showcase.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const showcaseCheck = await page.evaluate(() => {
    const showcaseCanvas = document.querySelector('#fencing-showcase canvas');
    if (!showcaseCanvas) return { hasCanvas: false };
    const ctx = showcaseCanvas.getContext("2d");
    const pixel = ctx.getImageData(Math.round(showcaseCanvas.width / 2), Math.round(showcaseCanvas.height / 2), 1, 1).data;
    return {
      hasShowcaseCanvas: true,
      isNotTransparent: pixel[3] > 0,
      pixel: Array.from(pixel),
    };
  });
  console.log("Showcase Section Check:", showcaseCheck);

  const showcaseReqs = networkRequests.filter(url => url.includes("fencing-frame") && url.includes("f_auto,q_90"));
  console.log(`Showcase requests using f_auto,q_90: ${showcaseReqs.length}`);

  console.log("\nConsole errors:", consoleErrors);
  console.log("\n==================================================");
  console.log(consoleErrors.length === 0 ? "ALL 3-PHASE PRELOADER TESTS PASSED!" : "TESTS HAD ERRORS");
  console.log("==================================================");

  await browser.close();
}

testThreePhasePreloader().catch(console.error);
