/** Canonical site URL for SEO (sitemap, canonical, openGraph, robots). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.getcran.ai";

/**
 * mailto: with subject + body prefilled so the default action is “review and send”.
 * Used when no HTTPS booking URL is configured and for general “email us” links.
 */
export const SUPPORT_PREFILLED_MAILTO = `mailto:support@getcran.ai?subject=${encodeURIComponent(
  "Cran — pilot interest"
)}&body=${encodeURIComponent(
  "Hi Cran team,\n\nWe're interested in learning more about Cran for our shelter.\n\nOrganization:\nMy name and role:\n\nThanks,\n"
)}`;

const MAILTO_DEMO = SUPPORT_PREFILLED_MAILTO;

/**
 * Pilot / demo booking URL (Google Calendar, Calendly, etc.).
 * `google_cal` from `.env` is mapped to `NEXT_PUBLIC_GOOGLE_CAL` in `next.config.ts` for the client bundle.
 * Order: that value, then `NEXT_PUBLIC_DEMO_URL`, then prefilled mailto.
 */
export const DEMO_URL =
  process.env.NEXT_PUBLIC_GOOGLE_CAL?.trim() ||
  process.env.NEXT_PUBLIC_DEMO_URL?.trim() ||
  MAILTO_DEMO;

/** Primary marketing CTA label (pilot conversation). */
export const PILOT_CTA_LABEL =
  process.env.NEXT_PUBLIC_PILOT_CTA_LABEL?.trim() || "Apply for pilot";

/** Use new tab + rel for https booking pages; omit for mailto. */
export function pilotCtaOpensInNewTab(): boolean {
  return DEMO_URL.startsWith("http://") || DEMO_URL.startsWith("https://");
}
