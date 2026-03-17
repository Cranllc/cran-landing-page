/** Canonical site URL for SEO (sitemap, canonical, openGraph, robots). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.getcran.ai";

/** Demo booking URL (Calendly, Cal.com, etc.). Falls back to mailto if not set. */
export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL || "mailto:support@getcran.ai?subject=Schedule%20a%20Demo";
