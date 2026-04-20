/** Canonical site URL for SEO (sitemap, canonical, openGraph, robots). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.getcran.ai";

const MAILTO_DEMO = "mailto:support@getcran.ai?subject=Schedule%20a%20Demo";

/**
 * Pilot / demo booking URL: Google Calendar appointment schedule, Calendly, etc.
 * Order: NEXT_PUBLIC_GOOGLE_CAL, then NEXT_PUBLIC_DEMO_URL, then mailto.
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
