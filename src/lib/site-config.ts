/** Canonical site URL for SEO (sitemap, canonical, openGraph, robots). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.getcran.ai";

/**
 * mailto: with subject + body prefilled so the default action is “review and send”.
 * Used when no HTTPS booking URL is configured and for general “email us” links.
 */
export const SUPPORT_PREFILLED_MAILTO = `mailto:support@getcran.ai?subject=${encodeURIComponent(
  "Cran: pilot interest"
)}&body=${encodeURIComponent(
  "Hi Cran team,\n\nWe're interested in learning more about Cran for our shelter.\n\nOrganization:\nMy name and role:\n\nThanks,\n"
)}`;

const MAILTO_DEMO = SUPPORT_PREFILLED_MAILTO;

function resolveDemoUrl(): string {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_CAL?.trim() || "";
  if (!raw) return MAILTO_DEMO;
  try {
    const u = new URL(raw);
    if (u.protocol === "http:" || u.protocol === "https:" || u.protocol === "mailto:") {
      return u.href;
    }
  } catch {
    // Invalid URI pasted in env; use safe fallback.
  }
  return MAILTO_DEMO;
}

/**
 * Pilot / demo booking URL from `google_cal` (mapped in next.config.ts).
 * Invalid values fall back to prefilled mailto.
 */
export const DEMO_URL = resolveDemoUrl();

/** Primary marketing CTA label (pilot conversation). */
export const PILOT_CTA_LABEL =
  process.env.NEXT_PUBLIC_PILOT_CTA_LABEL?.trim() || "Apply for pilot";

/** Use new tab + rel for https booking pages; omit for mailto. */
export function pilotCtaOpensInNewTab(): boolean {
  return DEMO_URL.startsWith("http://") || DEMO_URL.startsWith("https://");
}
