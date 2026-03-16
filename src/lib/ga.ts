export const GA_ID = "G-FD6JVP8ZV5";
export const COOKIE_CONSENT_KEY = "cran_cookie_consent";

export function grantConsent() {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag;
  const debug = typeof window !== "undefined" && window.location.search.includes("debug_ga=1");
  if (!gtag) {
    if (debug) console.log("[GA Debug] grantConsent: gtag not found (script may not have loaded)");
    return;
  }
  if (debug) console.log("[GA Debug] grantConsent: updating consent + sending page_view");
  gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  gtag("config", GA_ID, { send_page_view: true });
}
