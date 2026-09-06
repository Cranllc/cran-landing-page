/**
 * Quick test: verify analytics is opt-in only.
 * Run with the dev server up: npm run test:ga
 */
const { chromium } = await import("playwright");

const BASE_URL = "http://localhost:3000";
const CONSENT_KEY = "cran_cookie_consent";

const browser = await chromium.launch();

function isGoogleAnalyticsRequest(url) {
  return (
    url.includes("google-analytics.com") ||
    url.includes("googletagmanager.com") ||
    url.includes("/g/collect") ||
    url.includes("/j/collect") ||
    url.includes("region1")
  );
}

async function createTrackedPage({ gpc = false, storedConsent = null } = {}) {
  const context = await browser.newContext();
  if (storedConsent) {
    await context.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: CONSENT_KEY, value: storedConsent },
    );
  }
  if (gpc) {
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "globalPrivacyControl", {
        configurable: true,
        value: true,
      });
    });
  }
  const requests = [];
  const page = await context.newPage();
  page.on("request", (req) => {
    const url = req.url();
    if (isGoogleAnalyticsRequest(url)) requests.push({ url, method: req.method() });
  });
  return { context, page, requests };
}

async function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const normal = await createTrackedPage();
  await normal.page.goto(`${BASE_URL}?test_cookies=1`, { waitUntil: "networkidle", timeout: 15000 });
  await assert(normal.requests.length === 0, "Google Analytics requested before consent");

  await normal.page.locator('button:has-text("Accept analytics")').click();
  await normal.page.waitForTimeout(2500);
  await assert(
    normal.requests.some((r) => r.url.includes("googletagmanager.com/gtag/js")),
    "Google Analytics script did not load after accepting analytics",
  );
  await assert(
    (await normal.page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY)) === "accepted",
    "Accept did not persist accepted consent",
  );

  await normal.page.locator('button:has-text("Your Privacy Choices")').click();
  await normal.page.locator('button:has-text("Decline analytics")').click();
  await assert(
    (await normal.page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY)) === "denied",
    "Decline did not persist denied consent",
  );
  await normal.context.close();

  const deniedReload = await createTrackedPage({ storedConsent: "denied" });
  await deniedReload.page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 15000 });
  await deniedReload.page.waitForTimeout(1000);
  await assert(deniedReload.requests.length === 0, "Stored denied consent still loaded Google Analytics");
  await deniedReload.context.close();

  const gpc = await createTrackedPage({ gpc: true });
  await gpc.page.goto(`${BASE_URL}?test_cookies=1`, { waitUntil: "networkidle", timeout: 15000 });
  await gpc.page.waitForTimeout(1000);
  await assert(gpc.requests.length === 0, "GPC-enabled browser loaded Google Analytics");
  await assert(
    await gpc.page.locator('button:has-text("Accept analytics")').isDisabled(),
    "GPC-enabled browser could still accept analytics",
  );
  await gpc.context.close();

  console.log("\nPASS: analytics stays opt-in, decline persists, and GPC blocks upgrades.");
  await browser.close();
  process.exit(0);
} catch (error) {
  await browser.close();
  console.error("\nFAIL: GA Analytics Consent Test");
  console.error(error);
  process.exit(1);
}
