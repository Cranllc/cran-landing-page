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

/** Stale pilot CTAs sometimes point here; skip so calendar / mailto can win. */
function looksLikeFirebaseDynamicLinkUrl(url: URL): boolean {
  const h = url.hostname;
  return h.endsWith(".page.link") || h.includes("firebasedynamiclinks");
}

function pickHttpDemoUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (looksLikeFirebaseDynamicLinkUrl(u)) return null;
    return u.href;
  } catch {
    return null;
  }
}

function resolveDemoUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_GOOGLE_CAL?.trim(),
    process.env.NEXT_PUBLIC_DEMO_URL?.trim(),
  ].filter((s): s is string => Boolean(s));

  for (const raw of candidates) {
    if (raw.startsWith("mailto:")) {
      try {
        new URL(raw);
        return raw;
      } catch {
        continue;
      }
    }
    const http = pickHttpDemoUrl(raw);
    if (http) return http;
  }

  return MAILTO_DEMO;
}

/**
 * Pilot / demo booking URL (Google Calendar, Calendly, etc.).
 * `google_cal` is merged first in `next.config.ts` into `NEXT_PUBLIC_GOOGLE_CAL`.
 * Tries that, then `NEXT_PUBLIC_DEMO_URL`, skipping Firebase Dynamic Link URLs so a stale
 * `*.page.link` value does not beat a real `calendar.app.google` link. Unusable values → mailto.
 */
export const DEMO_URL = resolveDemoUrl();

/** Primary marketing CTA label (pilot conversation). */
export const PILOT_CTA_LABEL =
  process.env.NEXT_PUBLIC_PILOT_CTA_LABEL?.trim() || "Apply for pilot";

/** Use new tab + rel for https booking pages; omit for mailto. */
export function pilotCtaOpensInNewTab(): boolean {
  return DEMO_URL.startsWith("http://") || DEMO_URL.startsWith("https://");
}
