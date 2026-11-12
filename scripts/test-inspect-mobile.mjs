import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2000));

  // Check initial state
  const infoInitial = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
    const heroContainer = hero?.querySelector('div[id]');
    const mobileDiv = hero?.querySelector('.block.md\\:hidden');
    const desktopDiv = hero?.querySelector('.hidden.md\\:block');
    const video = mobileDiv?.querySelector('video');
    const canvas = desktopDiv?.querySelector('canvas');
    const heroContent = hero?.querySelector('.max-w-5xl');
    const pinSpacer = document.querySelector('.pin-spacer');

    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      heroHeight: hero?.offsetHeight,
      heroBounding: hero?.getBoundingClientRect(),
      mobileDivBounding: mobileDiv?.getBoundingClientRect(),
      heroContentBounding: heroContent?.getBoundingClientRect(),
      hasPinSpacer: !!pinSpacer,
      pinSpacerHeight: pinSpacer?.offsetHeight,
      mobileDivDisplay: mobileDiv ? window.getComputedStyle(mobileDiv).display : null,
      desktopDivDisplay: desktopDiv ? window.getComputedStyle(desktopDiv).display : null,
    };
  });
  console.log("INITIAL:", JSON.stringify(infoInitial, null, 2));

  // Scroll 300px
  await page.evaluate(() => window.scrollTo(0, 300));
  await new Promise(r => setTimeout(r, 500));

  const infoScrolled300 = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"]');
    const mobileDiv = hero?.querySelector('.block.md\\:hidden');
    const heroContent = hero?.querySelector('.max-w-5xl');
    const pinSpacer = document.querySelector('.pin-spacer');
    return {
      scrollY: window.scrollY,
      heroBounding: hero?.getBoundingClientRect(),
      mobileDivBounding: mobileDiv?.getBoundingClientRect(),
      heroContentBounding: heroContent?.getBoundingClientRect(),
      hasPinSpacer: !!pinSpacer,
      pinSpacerBounding: pinSpacer?.getBoundingClientRect(),
      pinSpacerStyle: pinSpacer ? pinSpacer.getAttribute('style') : null,
      mobileDivStyle: mobileDiv ? mobileDiv.getAttribute('style') : null,
      heroContainerStyle: hero?.firstElementChild?.getAttribute('style'),
      allPinSpacers: Array.from(document.querySelectorAll('.pin-spacer')).map(p => ({
        style: p.getAttribute('style'),
        parent: p.parentElement?.tagName
      }))
    };
  });
  console.log("SCROLLED 300:", JSON.stringify(infoScrolled300, null, 2));

  // Take screenshot at 300px scroll
  const screenshotPath = "/Users/viper/.gemini/antigravity/brain/8f8c6f69-1c8f-4102-9f9a-7c82c80654a5/scratch/scrolled-300.png";
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved to:", screenshotPath);

  await browser.close();
}

main().catch(console.error);

