"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cran_cookie_consent";
export const SHOW_COOKIE_PREFERENCES_EVENT = "show-cookie-preferences";
const GA_ID = "G-FD6JVP8ZV5";

type ConsentStatus = "accepted" | "denied" | null;

/** Initialize gtag with Google Consent Mode v2 (default denied). Load once, then update on user choice. */
function initGAWithConsent() {
  if (typeof window === "undefined" || (window as any).cranGALoaded) return;
  (window as any).cranGALoaded = true;

  (window as any).dataLayer = (window as any).dataLayer || [];
  const gtag = (...args: unknown[]) => {
    (window as any).dataLayer.push(args);
  };
  (window as any).gtag = gtag;

  // Consent Mode v2: default denied before any tags load (GDPR/CCPA)
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    gtag("js", new Date());
    gtag("config", GA_ID);
  };
}

function grantConsent() {
  if (typeof window === "undefined" || !(window as any).gtag) return;
  (window as any).gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // GA loads on every page with Consent Mode default denied
    initGAWithConsent();

    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus | null;
    if (stored === "accepted") {
      setStatus("accepted");
      grantConsent();
    } else if (stored === "denied") {
      setStatus("denied");
    } else {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => setShowBanner(true);
    window.addEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setStatus("accepted");
    setShowBanner(false);
    grantConsent();
  };

  const deny = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "denied");
    setStatus("denied");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-beige-border bg-cream shadow-[0_-4px_32px_rgba(26,26,26,0.06)] px-4 py-4 sm:px-6 sm:py-5"
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[13px] text-charcoal/70 leading-relaxed pr-4 font-sans">
          We use cookies for analytics to improve our site. Accept or reject non-essential cookies — see our{" "}
          <Link href="/legal/privacy-policy" className="text-cran font-medium hover:underline">Privacy Policy</Link> for details.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={deny}
            className="rounded-lg border border-beige-border bg-white px-5 py-2.5 text-[13px] font-semibold text-charcoal transition-all hover:border-cran/30 hover:text-cran hover:-translate-y-0.5 min-h-[44px] min-w-[110px] font-sans"
          >
            Reject All
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-cran px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-cran-hover shadow-lg shadow-cran/25 hover:shadow-cran/40 hover:-translate-y-0.5 min-h-[44px] min-w-[110px] font-sans"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
