import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/** Training / bulk-scrape agents: official summary only, not the full site. */
const TRAINING_CRAWLERS = [
  "GPTBot",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "Bytespider",
  "Applebot-Extended",
  "Google-Extended",
  "Meta-ExternalAgent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "Omgilibot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Googlebot-News",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      ...TRAINING_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/llms.txt"],
        disallow: ["/"],
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/auth/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
