"use client";

import { useEffect } from "react";
import {
  hasGlobalPrivacyControl,
  loadGoogleAnalytics,
  readStoredConsent,
  shouldGrantAnalytics,
} from "@/lib/ga";

export default function GoogleAnalytics() {
  useEffect(() => {
    if (
      !shouldGrantAnalytics({
        stored: readStoredConsent(),
        globalPrivacyControl: hasGlobalPrivacyControl(),
      })
    ) {
      return;
    }

    loadGoogleAnalytics();
  }, []);

  return null;
}
