"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });

/** Load CookieConsent + GA soon so consent and tracking work reliably */
export default function CookieConsentClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const cb = () => setMounted(true);
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(cb, { timeout: 300 });
    } else {
      setTimeout(cb, 100);
    }
  }, []);
  return mounted ? <CookieConsent /> : null;
}
