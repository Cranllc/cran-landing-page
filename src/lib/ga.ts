export const GA_ID = "G-FD6JVP8ZV5";
export const COOKIE_CONSENT_KEY = "cran_cookie_consent";
export const SHOW_COOKIE_PREFERENCES_EVENT = "show-cookie-preferences";
export const GOOGLE_ANALYTICS_SCRIPT_ID = "cran-google-analytics";

export type ConsentStatus = "accepted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export function hasGlobalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
}

export function readStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return stored === "accepted" || stored === "denied" ? stored : null;
}

export function shouldGrantAnalytics(input: {
  stored: ConsentStatus;
  globalPrivacyControl?: boolean;
}): boolean {
  return input.stored === "accepted" && input.globalPrivacyControl !== true;
}

export function analyticsGrantedConsent() {
  return {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  } as const;
}

export function analyticsDeniedConsent() {
  return {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  } as const;
}

export function loadGoogleAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", analyticsGrantedConsent());
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  if (document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function expireCookie(name: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
}

export function clearGoogleAnalyticsCookies() {
  if (typeof document === "undefined") return;

  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name === "_gid" || name.startsWith("_ga_") || name.startsWith("_gat"));

  const host = window.location.hostname;
  const domains = new Set<string | undefined>([undefined, host]);
  if (host.includes(".")) domains.add(`.${host}`);

  for (const name of cookieNames) {
    for (const domain of domains) {
      expireCookie(name, domain);
    }
  }
}

export function denyConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, "denied");
  window.gtag?.("consent", "update", analyticsDeniedConsent());
  clearGoogleAnalyticsCookies();
}

export function grantConsent() {
  if (typeof window === "undefined") return;
  if (hasGlobalPrivacyControl()) {
    denyConsent();
    return;
  }
  window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
  loadGoogleAnalytics();
  window.gtag?.("consent", "update", analyticsGrantedConsent());
  window.gtag?.("event", "page_view");
}
