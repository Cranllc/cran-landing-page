"use client";

import Script from "next/script";
import { GA_ID, COOKIE_CONSENT_KEY } from "@/lib/ga";

/** GA script + inline init. Loads in head before React for reliable tracking. */
const gaInlineScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag = gtag;
  window.__cran_ga_id__ = '${GA_ID}';
  window.__cran_consent_key__ = '${COOKIE_CONSENT_KEY}';
`;

export default function GoogleAnalytics() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: gaInlineScript }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="beforeInteractive"
        onLoad={() => {
          const gtag = (window as any).gtag;
          const id = (window as any).__cran_ga_id__;
          const key = (window as any).__cran_consent_key__;
          if (!gtag || !id) return;
          gtag("js", new Date());
          if (typeof localStorage !== "undefined" && localStorage.getItem(key) === "accepted") {
            gtag("consent", "update", {
              analytics_storage: "granted",
              ad_storage: "granted",
              ad_user_data: "granted",
              ad_personalization: "granted",
            });
            gtag("config", id, { send_page_view: true });
          } else {
            gtag("config", id);
          }
        }}
      />
    </>
  );
}
