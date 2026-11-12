import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function runMobilePricingModalTest() {
  console.log("=== STARTING MOBILE PRICING MODAL VERIFICATION ===");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    // -------------------------------------------------------------
    // TEST 1: MOBILE VIEWPORT (390 x 844, iPhone 14)
    // -------------------------------------------------------------
    console.log("\n--- TEST 1: Mobile Viewport (390 x 844) ---");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));

    // Scroll to section 2 and click "Request Pricing"
    const clickedFence = await page.evaluate(() => {
      const sec = document.getElementById("fencing-options");
      if (sec) sec.scrollIntoView();
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.innerText.trim() === "Request Pricing");
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!clickedFence) {
      throw new Error("FAIL: Could not find 'Request Pricing' button!");
    }
    console.log("PASS: Clicked 'Request Pricing' button.");
    await new Promise((r) => setTimeout(r, 1000));

    // Inspect modal layout & button visibility
    const modalState = await page.evaluate(() => {
      const backdrop = document.querySelector("div[data-lenis-prevent].fixed.inset-0") || document.querySelector(".fixed.inset-0");
      const modal = backdrop?.querySelector(".max-w-2xl");
      const header = modal?.querySelector(".border-b");
      const body = modal?.querySelector(".overflow-y-auto");
      const footer = modal?.querySelector(".border-t");
      const submitBtn = modal?.querySelector('button[type="submit"]');
      const cancelBtn = Array.from(modal?.querySelectorAll("button") || []).find((b) =>
        b.innerText.includes("Cancel")
      );
      const closeBtn = modal?.querySelector('button[aria-label="Close quote modal"]');
      const navbar = document.querySelector("header");

      const wH = window.innerHeight;
      const mR = modal?.getBoundingClientRect();
      const sR = submitBtn?.getBoundingClientRect();
      const cR = cancelBtn?.getBoundingClientRect();
      const nR = navbar?.getBoundingClientRect();

      return {
        hasBackdrop: !!backdrop,
        backdropZIndex: backdrop ? window.getComputedStyle(backdrop).zIndex : null,
        bodyOverflowLocked: document.body.style.overflow === "hidden",
        modalTop: Math.round(mR?.top || 0),
        modalBottom: Math.round(mR?.bottom || 0),
        modalHeight: Math.round(mR?.height || 0),
        windowHeight: wH,
        navbarBottom: Math.round(nR?.bottom || 0),
        // Button positions relative to viewport
        submitTop: Math.round(sR?.top || 0),
        submitBottom: Math.round(sR?.bottom || 0),
        cancelTop: Math.round(cR?.top || 0),
        cancelBottom: Math.round(cR?.bottom || 0),
        isSubmitFullyVisible: sR ? sR.bottom <= wH && sR.top >= 0 : false,
        isCancelFullyVisible: cR ? cR.bottom <= wH && cR.top >= 0 : false,
        bodyScrollable: body ? body.scrollHeight > body.clientHeight : false,
        bodyScrollHeight: body?.scrollHeight,
        bodyClientHeight: body?.clientHeight,
        hasLenisPrevent: backdrop?.hasAttribute("data-lenis-prevent") && modal?.hasAttribute("data-lenis-prevent"),
      };
    });

    console.log("Modal Inspection State on Mobile:", JSON.stringify(modalState, null, 2));

    if (!modalState.hasBackdrop) {
      throw new Error("FAIL: Modal backdrop not found!");
    }
    if (modalState.backdropZIndex !== "100") {
      throw new Error(`FAIL: Modal backdrop should have z-index 100, got ${modalState.backdropZIndex}`);
    }
    if (!modalState.bodyOverflowLocked) {
      throw new Error("FAIL: Document body scroll should be locked (overflow: hidden) when modal is open!");
    }
    if (!modalState.hasLenisPrevent) {
      throw new Error("FAIL: Modal containers must have data-lenis-prevent!");
    }
    if (!modalState.isSubmitFullyVisible) {
      throw new Error(`FAIL: Submit button is NOT fully visible! Position: top=${modalState.submitTop}, bottom=${modalState.submitBottom}, windowHeight=${modalState.windowHeight}`);
    }
    if (!modalState.isCancelFullyVisible) {
      throw new Error(`FAIL: Cancel button is NOT fully visible! Position: top=${modalState.cancelTop}, bottom=${modalState.cancelBottom}, windowHeight=${modalState.windowHeight}`);
    }
    if (!modalState.bodyScrollable) {
      throw new Error("FAIL: Modal body should be scrollable!");
    }

    console.log("PASS: Modal is elevated to z-[100] above navbar.");
    console.log("PASS: Document body scroll is locked.");
    console.log("PASS: data-lenis-prevent is active on modal and backdrop.");
    console.log("PASS: Both 'Cancel' and 'Submit Custom Estimate Request' buttons are 100% visible on initial open!");
    console.log(`PASS: Modal body is scrollable (scrollHeight: ${modalState.bodyScrollHeight}px > clientHeight: ${modalState.bodyClientHeight}px).`);

    // Take screenshot of opened modal on mobile
    const screenshot1 = "/Users/viper/.gemini/antigravity/brain/8f8c6f69-1c8f-4102-9f9a-7c82c80654a5/scratch/mobile-pricing-modal-opened.png";
    await page.screenshot({ path: screenshot1 });
    console.log("Screenshot saved to:", screenshot1);

    // Test scrolling inside the modal body
    console.log("\nTesting scroll inside modal body...");
    const scrolledDown = await page.evaluate(() => {
      const body = document.querySelector("div[data-lenis-prevent].fixed.inset-0 .overflow-y-auto");
      if (!body) return false;
      body.scrollTop = 250;
      return body.scrollTop > 0;
    });
    if (!scrolledDown) {
      throw new Error("FAIL: Could not scroll modal body!");
    }
    console.log("PASS: Modal body scrolled smoothly.");

    // Take screenshot scrolled
    const screenshot2 = "/Users/viper/.gemini/antigravity/brain/8f8c6f69-1c8f-4102-9f9a-7c82c80654a5/scratch/mobile-pricing-modal-scrolled.png";
    await page.screenshot({ path: screenshot2 });
    console.log("Screenshot saved to:", screenshot2);

    // Test filling in the form and submitting
    console.log("\nTesting form interaction and submission...");
    await page.evaluate(() => {
      const setReactValue = (el, val) => {
        const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      };

      const modal = document.querySelector("div[data-lenis-prevent].fixed.inset-0");
      const nameInput = modal?.querySelector('input[placeholder="Priya Sharma"]');
      const phoneInput = modal?.querySelector('input[placeholder="+91 98765 43210"]');
      const emailInput = modal?.querySelector('input[placeholder="priya@example.com"]');
      const pinInput = modal?.querySelector('input[placeholder="e.g. 560001"]');
      const submitBtn = modal?.querySelector('button[type="submit"]');

      if (nameInput) setReactValue(nameInput, "Rajesh Verma");
      if (phoneInput) setReactValue(phoneInput, "+91 98111 22334");
      if (emailInput) setReactValue(emailInput, "rajesh.verma@example.in");
      if (pinInput) setReactValue(pinInput, "560100");

      if (submitBtn) {
        submitBtn.click();
      }
    });

    await new Promise((r) => setTimeout(r, 600));

    const confirmationState = await page.evaluate(() => {
      const modal = document.querySelector("div[data-lenis-prevent].fixed.inset-0");
      const allH3 = Array.from(modal?.querySelectorAll("h3") || []).map((h) => h.innerText);
      const allBtns = Array.from(modal?.querySelectorAll("button") || []).map((b) => b.innerText);
      return {
        allH3,
        hasDoneBtn: allBtns.some((b) => b.includes("Done")),
      };
    });

    console.log("Confirmation State:", confirmationState);
    if (!confirmationState.allH3.some((t) => t.includes("Estimate Request Received"))) {
      throw new Error(`FAIL: Expected 'Estimate Request Received', got: ${JSON.stringify(confirmationState.allH3)}`);
    }
    console.log("PASS: Estimate form submitted successfully and rendered confirmation screen.");

    // Close modal via Done button
    await page.evaluate(() => {
      const modal = document.querySelector("div[data-lenis-prevent].fixed.inset-0");
      const doneBtn = Array.from(modal?.querySelectorAll("button") || []).find((b) => b.innerText.includes("Done"));
      if (doneBtn) doneBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const closedState = await page.evaluate(() => {
      const modal = document.querySelector("div[data-lenis-prevent].fixed.inset-0");
      return {
        isClosed: !modal,
        bodyOverflowRestored: document.body.style.overflow === "",
      };
    });
    console.log("Closed State:", closedState);
    if (!closedState.isClosed || !closedState.bodyOverflowRestored) {
      throw new Error("FAIL: Modal did not close or body overflow was not restored!");
    }
    console.log("PASS: Modal closed and body scroll unlocked.");

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

    await desktopPage.evaluate(() => {
      const sec = document.getElementById("fencing-options");
      if (sec) sec.scrollIntoView();
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.innerText.trim() === "Request Pricing");
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const desktopModal = await desktopPage.evaluate(() => {
      const modal = document.querySelector("div[data-lenis-prevent].fixed.inset-0 .max-w-2xl");
      const submitBtn = modal?.querySelector('button[type="submit"]');
      const cancelBtn = Array.from(modal?.querySelectorAll("button") || []).find((b) =>
        b.innerText.includes("Cancel")
      );
      const mR = modal?.getBoundingClientRect();
      const sR = submitBtn?.getBoundingClientRect();
      const cR = cancelBtn?.getBoundingClientRect();
      const wH = window.innerHeight;

      return {
        modalWidth: Math.round(mR?.width || 0),
        modalHeight: Math.round(mR?.height || 0),
        isSubmitVisible: sR ? sR.bottom <= wH && sR.top >= 0 : false,
        isCancelVisible: cR ? cR.bottom <= wH && cR.top >= 0 : false,
      };
    });

    console.log("Desktop Modal State:", desktopModal);
    if (!desktopModal.isSubmitVisible || !desktopModal.isCancelVisible) {
      throw new Error("FAIL: Desktop modal buttons not visible!");
    }
    console.log("PASS: Desktop modal renders cleanly with visible action buttons.");

    await desktopPage.close();
    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

runMobilePricingModalTest().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
