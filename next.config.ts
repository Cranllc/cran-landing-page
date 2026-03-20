import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    /** Blog uploads use Server Actions + FormData; default ~1MB causes 400 + broken RSC response */
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async redirects() {
    return [
      // Canonical: redirect getcran.ai → www.getcran.ai to avoid Search Console redirect errors
      {
        source: "/:path*",
        has: [{ type: "host", value: "getcran.ai" }],
        destination: "https://www.getcran.ai/:path*",
        permanent: true,
      },
      // Strip trailing slash from sitemap (GSC may submit sitemap.xml/ which causes issues)
      {
        source: "/sitemap.xml/",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.supabase.co",
              "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.resend.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
