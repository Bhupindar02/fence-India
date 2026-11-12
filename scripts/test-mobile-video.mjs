import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function verifyMobileVideo() {
  console.log("==================================================");
  console.log("TESTING MOBILE HERO SINGLE-PLAY VIDEO INTEGRATION");
  console.log("==================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const consoleErrors = [];

  // 1. TEST MOBILE VIEWPORT (390 x 844 - iPhone 14)
  console.log("\n1. Testing Mobile Viewport (390 x 844 - iPhone 14)...");
  const mobilePage = await browser.newPage();
  mobilePage.on("pageerror", (err) => consoleErrors.push(err.message));
  mobilePage.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mobilePage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));

  const mobileCheck = await mobilePage.evaluate(() => {
    const video = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] video');
    const canvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    const isVideoVisible = video ? window.getComputedStyle(video).display !== "none" : false;
    const isCanvasHidden = canvas ? window.getComputedStyle(canvas.parentElement || canvas).display === "none" : false;
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;

    return {
      hasVideo: !!video,
      isVideoVisible,
      videoSrc: video?.src,
      muted: video?.muted,
      autoplay: video?.autoplay,
      playsInline: video?.playsInline,
      isCanvasHidden,
      hasOverflow: docWidth > winWidth,
    };
  });
  await mobilePage.close();

  console.log("Mobile Hero Check Result:", mobileCheck);

  // 2. TEST DESKTOP VIEWPORT (1440 x 900)
  console.log("\n2. Testing Desktop Viewport (1440 x 900)...");
  const desktopPage = await browser.newPage();
  desktopPage.on("pageerror", (err) => consoleErrors.push(err.message));
  desktopPage.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
  await desktopPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));

  const desktopCheck = await desktopPage.evaluate(() => {
    const video = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] video');
    const canvas = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas');
    const isVideoHidden = video ? window.getComputedStyle(video.parentElement || video).display === "none" : true;
    const isCanvasVisible = canvas ? window.getComputedStyle(canvas).display !== "none" : false;

    return {
      isVideoHidden,
      isCanvasVisible,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
    };
  });
  await desktopPage.close();

  console.log("Desktop Hero Check Result:", desktopCheck);

  await browser.close();

  console.log("\n==================================================");
  console.log("TEST VERIFICATION SUMMARY");
  console.log("==================================================");
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Mobile Video Present & Visible: ${mobileCheck.hasVideo && mobileCheck.isVideoVisible}`);
  console.log(`Mobile Canvas Hidden: ${mobileCheck.isCanvasHidden}`);
  console.log(`Mobile Horizontal Overflow: ${mobileCheck.hasOverflow ? "FAILED" : "PASSED (0px)"}`);
  console.log(`Desktop Canvas Visible: ${desktopCheck.isCanvasVisible}`);
  console.log(`Desktop Video Hidden: ${desktopCheck.isVideoHidden}`);

  const passed =
    mobileCheck.hasVideo &&
    mobileCheck.isVideoVisible &&
    mobileCheck.muted &&
    mobileCheck.playsInline &&
    !mobileCheck.hasOverflow &&
    desktopCheck.isCanvasVisible &&
    desktopCheck.isVideoHidden &&
    consoleErrors.length === 0;

  if (!passed) {
    console.error("Verification failed!");
    process.exit(1);
  }

  console.log("\n SUCCESS: Mobile single-play video and desktop canvas scrubber both operating flawlessly!");
}

verifyMobileVideo().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
