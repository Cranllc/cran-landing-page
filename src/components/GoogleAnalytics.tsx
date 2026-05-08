import { GA_ID, COOKIE_CONSENT_KEY } from "@/lib/ga";

/**
 * GA4 via inline scripts only; no next/script onLoad (unreliable with beforeInteractive).
 *
 * Flow:
 * 1. Inline script sets up dataLayer, gtag, and consent defaults (denied).
 * 2. gtag.js loads via a regular <script async>.
 * 3. gtag("js") + gtag("config") run immediately; GA queues events until consent is granted.
 * 4. If the user already accepted cookies, consent is upgraded inline.
 * 5. If not, CookieConsent calls grantConsent() later which upgrades consent and triggers the queued hits.
 */
const gaInitScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
window.gtag=gtag;
gtag('js',new Date());
gtag('config','${GA_ID}');
try{
  if(localStorage.getItem('${COOKIE_CONSENT_KEY}')==='accepted'){
    gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
  }
}catch(e){}
`;

export default function GoogleAnalytics() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gaInitScript }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
    </>
  );
}
