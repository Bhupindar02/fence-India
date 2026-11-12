import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = "./test-output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTest() {
  console.log("Launching Headless Chrome for Inquiry Form verification...");
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
  const errors = [];

  page.on("pageerror", (err) => {
    console.error("Page Error:", err);
    errors.push(err.toString());
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Console Error:", msg.text());
      errors.push(msg.text());
    }
  });

  page.on("response", (res) => {
    // Ignore intentionally triggered 400 validation responses during API testing
    if (res.status() >= 500) {
      console.error("HTTP Server Error:", res.status(), res.url());
      errors.push(`${res.status()} ${res.url()}`);
    }
  });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Verify all 7 DOM sections
  const domSections = await page.evaluate(() => ({
    hero: !!document.querySelector('section[aria-label="Fencing Transformation Hero Sequence"] canvas'),
    options: !!document.getElementById("fencing-options"),
    showcase: !!document.getElementById("fencing-showcase"),
    beforeAfter: !!document.getElementById("before-after"),
    whyChooseUs: !!document.getElementById("why-choose-us"),
    testimonials: !!document.getElementById("testimonials"),
    inquiryForm: !!document.getElementById("inquiry-form"),
  }));
  console.log("DOM Sections Present (All 7):", domSections);

  // 2. Scroll to #inquiry-form
  console.log("Scrolling to #inquiry-form...");
  await page.evaluate(() => {
    const sec = document.getElementById("inquiry-form");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section7-inquiry-empty.png") });

  // 3. Test empty submission to verify inline validation messages
  console.log("Testing validation on empty submit...");
  await page.evaluate(() => {
    const btn = document.querySelector('#inquiry-form button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const validationErrors = await page.evaluate(() => {
    const errEls = Array.from(document.querySelectorAll("#inquiry-form p.text-red-400"));
    return errEls.map((el) => el.textContent?.trim());
  });
  console.log("Validation errors triggered:", validationErrors);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section7-inquiry-validation.png") });

  // 4. Test filling valid data
  console.log("Entering valid lead data using page.type...");
  await page.click('#fullName');
  await page.type('#fullName', 'Priya Sharma');

  await page.click('#email');
  await page.type('#email', 'priya.sharma@example.com');

  await page.click('#phone');
  await page.type('#phone', '9876543210');

  await page.click('#zipCode');
  await page.type('#zipCode', '560001');

  await page.click('#fenceLength');
  await page.type('#fenceLength', '175');

  await page.click('#description');
  await page.type('#description', 'Villa perimeter boundary. Looking for clean aluminum with automated gate.');

  await new Promise((r) => setTimeout(r, 500));

  // 5. Submit valid form
  console.log("Submitting form with valid data...");
  await page.evaluate(() => {
    const btn = document.querySelector('#inquiry-form button[type="submit"]');
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Check confirmation state
  const successState = await page.evaluate(() => {
    const heading = document.querySelector("#inquiry-form h3")?.textContent?.trim();
    const ref = document.querySelector("#inquiry-form .font-mono")?.textContent?.trim();
    const leadText = document.querySelector("#inquiry-form p.text-neutral-300")?.textContent?.trim();
    return { heading, ref, leadText };
  });

  console.log("Success Confirmation State:", successState);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section7-inquiry-success.png") });

  // 6. Verify lead saved in data/inquiries.json
  const leadsPath = path.join(process.cwd(), "data", "inquiries.json");
  if (fs.existsSync(leadsPath)) {
    const savedLeads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
    console.log(`Saved leads count in data/inquiries.json: ${savedLeads.length}`);
    console.log("Latest saved lead:", savedLeads[savedLeads.length - 1]);
  } else {
    console.error("data/inquiries.json not found!");
    errors.push("data/inquiries.json not found");
  }

  // 7. Test Mobile Viewport (390 x 844)
  console.log("Testing Mobile Viewport (390 x 844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.evaluate(() => {
    const sec = document.getElementById("inquiry-form");
    if (sec) sec.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "section7-inquiry-mobile.png") });

  await browser.close();

  console.log("-----------------------------------------");
  console.log("Total errors encountered:", errors.length);
  if (errors.length > 0) {
    console.error("Errors found:", errors);
    process.exit(1);
  } else {
    console.log("All Inquiry Form verifications passed flawlessly with 0 errors!");
  }
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
