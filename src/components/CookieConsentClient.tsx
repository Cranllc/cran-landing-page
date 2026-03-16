"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });

/** Mount CookieConsent after hydration so GA (in head) is ready */
export default function CookieConsentClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <CookieConsent /> : null;
}
