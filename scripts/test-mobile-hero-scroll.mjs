import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function runMobileHeroScrollTests() {
  console.log("=== STARTING MOBILE HERO SCROLL VERIFICATION ===");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();

    // -------------------------------------------------------------
    // TEST 1: MOBILE VIEWPORT (390 x 844)
    // -------------------------------------------------------------
    console.log("\n--- TEST 1: Mobile Viewport (390 x 844, iPhone 14) ---");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));

    // Verify DOM structure on mobile
    const mobileInit = await page.evaluate(() => {
      const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
      const heroPinSpacer = hero?.querySelector(".pin-spacer");
      const heroDirectParentPin = hero?.parentElement?.classList.contains("pin-spacer");
      const mobileDiv = hero?.querySelector(".block.md\\:hidden");
      const desktopDiv = hero?.querySelector("canvas")?.parentElement;
      const heroOverlay = hero?.querySelector(".max-w-5xl");
      const nextSection = document.getElementById("fencing-options");

      return {
        hasHeroPinSpacer: !!heroPinSpacer || !!heroDirectParentPin,
        mobileDivVisible: mobileDiv ? window.getComputedStyle(mobileDiv).display === "block" : false,
        desktopDivHidden: desktopDiv ? window.getComputedStyle(desktopDiv).display === "none" : false,
        heroHeight: hero?.offsetHeight,
        heroTop: hero?.getBoundingClientRect().top,
        overlayOpacity: heroOverlay ? window.getComputedStyle(heroOverlay).opacity : null,
        overlayTransform: heroOverlay ? window.getComputedStyle(heroOverlay).transform : null,
        nextSectionTop: nextSection?.getBoundingClientRect().top,
      };
    });

    console.log("Mobile Initial State:", mobileInit);

    if (mobileInit.hasHeroPinSpacer) {
      throw new Error("FAIL: Hero section should NOT have a pin-spacer on mobile!");
    } else {
      console.log("PASS: No pin-spacer found in Hero section on mobile.");
    }

    if (!mobileInit.mobileDivVisible) {
      throw new Error("FAIL: Mobile video container should be visible on mobile!");
    } else {
      console.log("PASS: Mobile video container is visible.");
    }

    if (!mobileInit.desktopDivHidden) {
      throw new Error("FAIL: Desktop canvas container should be hidden on mobile!");
    } else {
      console.log("PASS: Desktop canvas container is hidden.");
    }

    if (mobileInit.overlayOpacity !== "1") {
      throw new Error(`FAIL: Overlay opacity should be 1 on mobile, got ${mobileInit.overlayOpacity}`);
    } else {
      console.log("PASS: Overlay opacity is locked to 1.");
    }

    // Verify natural scroll behavior:
    const scrollPositions = [150, 350, 600, 850];
    for (const y of scrollPositions) {
      await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
      await new Promise((r) => setTimeout(r, 250));

      const scrollState = await page.evaluate(() => {
        const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
        const heroOverlay = hero?.querySelector(".max-w-5xl");
        const nextSection = document.getElementById("fencing-options");
        const hR = hero?.getBoundingClientRect();
        const nR = nextSection?.getBoundingClientRect();

        return {
          scrollY: window.scrollY,
          heroTop: Math.round(hR?.top || 0),
          nextSectionTop: Math.round(nR?.top || 0),
          overlayOpacity: heroOverlay ? window.getComputedStyle(heroOverlay).opacity : null,
        };
      });

      console.log(`Scrolled to ${y}px:`, scrollState);

      // Verify linear natural scroll
      if (Math.abs(scrollState.heroTop - (-y)) > 5) {
        throw new Error(`FAIL: Hero section top (${scrollState.heroTop}) is not tracking scroll (${-y})! Background is stuck!`);
      }
      if (scrollState.overlayOpacity !== "1") {
        throw new Error(`FAIL: Overlay opacity changed to ${scrollState.overlayOpacity} while scrolling on mobile!`);
      }
    }
    console.log("PASS: Hero section, background video, and overlay content scroll up together naturally with zero pinning!");

    // Take mobile screenshot after scrolling 300px
    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise((r) => setTimeout(r, 300));
    const mobileScreenshot = "/Users/viper/.gemini/antigravity/brain/8f8c6f69-1c8f-4102-9f9a-7c82c80654a5/scratch/mobile-hero-scrolled-verified.png";
    await page.screenshot({ path: mobileScreenshot });
    console.log("Mobile verified screenshot saved to:", mobileScreenshot);

    // Close mobile page cleanly
    await page.close();

    // -------------------------------------------------------------
    // TEST 2: DESKTOP VIEWPORT (1440 x 900)
    // -------------------------------------------------------------
    console.log("\n--- TEST 2: Desktop Viewport (1440 x 900) ---");
    const desktopPage = await browser.newPage();
    desktopPage.setDefaultNavigationTimeout(60000);
    await desktopPage.setViewport({ width: 1440, height: 900, isMobile: false });
    await desktopPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));

    const desktopInit = await desktopPage.evaluate(() => {
      const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
      const pinSpacer = hero?.querySelector(".pin-spacer");
      const canvas = hero?.querySelector("canvas");
      const desktopDiv = hero?.querySelector("canvas")?.parentElement;
      const mobileDiv = hero?.querySelector(".block.md\\:hidden");

      return {
        hasPinSpacer: !!pinSpacer,
        pinSpacerHeight: pinSpacer?.offsetHeight,
        canvasVisible: !!canvas && canvas.offsetWidth > 0,
        desktopDivVisible: desktopDiv ? window.getComputedStyle(desktopDiv).display === "block" : false,
        mobileDivHidden: mobileDiv ? window.getComputedStyle(mobileDiv).display === "none" : false,
      };
    });

    console.log("Desktop Initial State:", desktopInit);

    if (!desktopInit.hasPinSpacer) {
      throw new Error("FAIL: Desktop should have a pin-spacer for 4000px scrub!");
    } else {
      console.log(`PASS: Desktop pin-spacer is active (height: ${desktopInit.pinSpacerHeight}px).`);
    }

    if (!desktopInit.canvasVisible) {
      throw new Error("FAIL: Desktop canvas should be visible!");
    } else {
      console.log("PASS: Desktop canvas is visible.");
    }

    // Scroll desktop to verify pinned scrub and text fade
    await desktopPage.evaluate(() => window.scrollTo(0, 1200));
    await new Promise((r) => setTimeout(r, 500));

    const desktopScrolled = await desktopPage.evaluate(() => {
      const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
      const heroOverlay = hero?.querySelector(".max-w-5xl");
      const pinnedContainer = hero?.querySelector(".pin-spacer > div");
      return {
        scrollY: window.scrollY,
        pinnedContainerPosition: pinnedContainer ? window.getComputedStyle(pinnedContainer).position : null,
        overlayOpacity: heroOverlay ? parseFloat(window.getComputedStyle(heroOverlay).opacity) : null,
      };
    });

    console.log("Desktop Scrolled State:", desktopScrolled);

    if (desktopScrolled.pinnedContainerPosition !== "fixed") {
      throw new Error(`FAIL: Pinned container on desktop should be position: fixed while scrubbing, got ${desktopScrolled.pinnedContainerPosition}`);
    } else {
      console.log("PASS: Desktop container remains pinned at position: fixed during scrub.");
    }

    if (desktopScrolled.overlayOpacity > 0.05) {
      throw new Error(`FAIL: Desktop overlay should have faded out by 1200px scroll, got opacity: ${desktopScrolled.overlayOpacity}`);
    } else {
      console.log("PASS: Desktop overlay smoothly faded out as expected.");
    }

    await desktopPage.close();

    console.log("\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

runMobileHeroScrollTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
