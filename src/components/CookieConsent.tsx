"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { COOKIE_CONSENT_KEY, grantConsent } from "@/lib/ga";

export const SHOW_COOKIE_PREFERENCES_EVENT = "show-cookie-preferences";

type ConsentStatus = "accepted" | "denied" | null;

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [showBanner, setShowBanner] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus | null;
    const forceTest = typeof window !== "undefined" && window.location.search.includes("test_cookies=1");
    if (stored === "accepted" && !forceTest) {
      setStatus("accepted");
      grantConsent();
      setShowBanner(false);
    } else if (stored === "denied" && !forceTest) {
      setStatus("denied");
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => setShowBanner(true);
    window.addEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
  }, []);

  // Focus first button when dialog opens; Escape to close
  useEffect(() => {
    if (!showBanner) return;
    const el = dialogRef.current;
    const firstButton = el?.querySelector<HTMLButtonElement>('button[type="button"]');
    firstButton?.focus({ preventScroll: true });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowBanner(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showBanner]);

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
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99] bg-charcoal/10" aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="true"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[100] w-full max-w-sm sm:max-w-[360px] rounded-xl border border-charcoal/8 bg-white shadow-[0_12px_32px_-8px_rgba(26,26,26,0.12)] overflow-hidden"
      >
        {/* Decorative paw prints */}
        <div className="flex justify-center gap-3 pt-4 pb-1 opacity-[0.12]" aria-hidden>
          <PawPrint className="w-4 h-4 text-charcoal" strokeWidth={1} />
          <PawPrint className="w-3 h-3 text-charcoal -scale-x-100" strokeWidth={1} />
          <PawPrint className="w-4 h-4 text-charcoal" strokeWidth={1} />
        </div>

        <div className="px-4 pb-4 pt-1">
          <div className="mb-3">
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-charcoal mb-0.5">Cookie preferences</h3>
              <p className="text-[12px] text-charcoal/70 leading-relaxed font-sans">
                We use cookies for analytics. See our{" "}
                <Link href="/legal/privacy-policy" className="text-[#9A3228] font-medium hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={deny}
              className="flex-1 rounded-lg border border-charcoal/12 bg-white px-3 py-2 text-[12px] font-semibold text-charcoal transition-all hover:border-cran/30 hover:text-cran font-sans focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={accept}
              className="flex-1 rounded-lg bg-cran-hover px-3 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#9A3228] shadow-md shadow-cran/20 font-sans focus:outline-none focus:ring-2 focus:ring-cran focus:ring-offset-2 focus:ring-offset-white"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
