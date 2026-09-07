"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  type ConsentStatus,
  denyConsent,
  grantConsent,
  hasGlobalPrivacyControl,
  readStoredConsent,
  SHOW_COOKIE_PREFERENCES_EVENT,
} from "@/lib/ga";

function isForcedCookieTest(): boolean {
  return typeof window !== "undefined" && window.location.search.includes("test_cookies=1");
}

function getInitialCookieState(): {
  status: ConsentStatus;
  showBanner: boolean;
  gpcEnabled: boolean;
} {
  const stored = readStoredConsent();
  const gpcEnabled = hasGlobalPrivacyControl();
  const forceTest = isForcedCookieTest();

  if (gpcEnabled && !forceTest) {
    return { status: "denied", showBanner: false, gpcEnabled };
  }

  if ((stored === "accepted" || stored === "denied") && !forceTest) {
    return { status: stored, showBanner: false, gpcEnabled };
  }

  return { status: stored, showBanner: true, gpcEnabled };
}

export default function CookieConsent() {
  const [initialCookieState] = useState(getInitialCookieState);
  const [status, setStatus] = useState<ConsentStatus>(initialCookieState.status);
  const [showBanner, setShowBanner] = useState(initialCookieState.showBanner);
  const [gpcEnabled, setGpcEnabled] = useState(initialCookieState.gpcEnabled);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const closeAndRestoreFocus = useCallback(() => {
    setShowBanner(false);
    returnFocusRef.current?.focus({ preventScroll: true });
    returnFocusRef.current = null;
  }, []);

  const deny = useCallback(() => {
    denyConsent();
    setStatus("denied");
    closeAndRestoreFocus();
  }, [closeAndRestoreFocus]);

  const accept = useCallback(() => {
    grantConsent();
    const nextStatus = hasGlobalPrivacyControl() ? "denied" : "accepted";
    setStatus(nextStatus);
    setGpcEnabled(hasGlobalPrivacyControl());
    closeAndRestoreFocus();
  }, [closeAndRestoreFocus]);

  useEffect(() => {
    if (hasGlobalPrivacyControl() && !isForcedCookieTest()) {
      denyConsent();
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setGpcEnabled(hasGlobalPrivacyControl());
      setStatus(readStoredConsent());
      setShowBanner(true);
    };
    window.addEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(SHOW_COOKIE_PREFERENCES_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!showBanner) return;
    const el = dialogRef.current;
    const firstButton = el?.querySelector<HTMLButtonElement>('button[type="button"]:not(:disabled)');
    firstButton?.focus({ preventScroll: true });

    const close = () => {
      setShowBanner(false);
      returnFocusRef.current?.focus({ preventScroll: true });
      returnFocusRef.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (readStoredConsent() === null) {
          deny();
        } else {
          close();
        }
        return;
      }

      if (e.key !== "Tab" || !el) return;

      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAndRestoreFocus, deny, showBanner]);

  const statusText =
    gpcEnabled
      ? "Your browser's Global Privacy Control signal is on, so optional cookies stay off."
      : status === "accepted"
        ? "Optional cookies are currently on. You can decline at any time."
        : status === "denied"
          ? "Optional cookies are currently off."
          : "Choose whether Cran may use optional cookies.";

  if (!showBanner) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-charcoal/[0.08] bg-[#FAFAF8]/95 px-4 py-2.5 shadow-[0_-8px_24px_-12px_rgba(26,26,26,0.12)] backdrop-blur-md sm:px-6 sm:py-3"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:pr-8">
          <h3 className="text-[13px] font-semibold text-charcoal">Cookie preferences</h3>
          <p className="mt-0.5 text-[12px] leading-relaxed text-charcoal/60">
            We use optional cookies to understand site usage. See our{" "}
            <Link href="/legal/privacy-policy" className="font-medium text-cran hover:underline">Privacy Policy</Link>.
            {" "}{statusText}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={deny}
            className="rounded-lg border border-charcoal/12 bg-white px-3.5 py-2 text-[12px] font-semibold text-charcoal transition-colors hover:border-charcoal/20 focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            disabled={gpcEnabled}
            className="rounded-lg bg-cran px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-cran-hover focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
