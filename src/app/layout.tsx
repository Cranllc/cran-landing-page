import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { SITE_URL } from "@/lib/site-config";
import CookieConsentClient from "@/components/CookieConsentClient";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cran | AI-Powered Shelter Management",
  description:
    "Shelter operations in one place: intake, medical and kennel workflows, tasks and care plans, adoptions, and reporting. Built for shelters and rescues in active pilot.",
  keywords: [
    "animal shelter software",
    "shelter management platform",
    "AI shelter software",
    "kennel management software",
    "pet adoption software",
    "AI breed detection",
    "shelter intake software",
    "shelter grant reporting",
    "animal rescue software",
    "foster management",
  ],
  authors: [{ name: "Cran, LLC" }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Cran",
    title: "Cran | AI-Powered Shelter Management",
    description: "One platform for everything: intake, medical, kennels, adoptions, reporting. Built for shelters.",
    images: [
      {
        url: `${SITE_URL.replace(/\/$/, "")}/openGraph.png`,
        width: 1200,
        height: 630,
        alt: "Cran",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cran | AI-Powered Shelter Management",
    description: "One platform for everything, built for shelters.",
    images: [`${SITE_URL.replace(/\/$/, "")}/openGraph.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Cran",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}`,
  description:
    "AI-assisted shelter management for intake, daily operations, adoptions, and reporting. Role-based access and mobile-friendly workflows. In active pilot with partner organizations.",
  featureList: [
    "AI-assisted intake and animal profiles",
    "Medical records and vaccination tracking",
    "Kennel, tasks, care plans, and shift handoffs",
    "Adoptions and public application links",
    "Fosters, partners, and transport coordination",
    "Reporting and data export",
    "Listing integrations as part of the pilot program",
    "Lost and found, behavior notes, and scheduling",
    "Installable web experience with offline-friendly flows where supported",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cran",
  url: SITE_URL,
  description: "AI-powered shelter management platform for animal shelters and rescues.",
  publisher: { "@type": "Organization", name: "Cran, LLC" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What AI features does Cran include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cran uses AI to speed up common shelter work like intake, bios, care notes, and reporting drafts. Scope depends on your pilot agreement and how we work together.",
      },
    },
    {
      "@type": "Question",
      name: "Does Cran work for rescues?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The same workflows support foster-based organizations and traditional shelters.",
      },
    },
    {
      "@type": "Question",
      name: "Does Cran work on phones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cran is built for mobile browsers and floor use. You can add it to your home screen like an app on supported devices.",
      },
    },
    {
      "@type": "Question",
      name: "Can Cran export data for grants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reporting and exports are built for grant and partner reporting needs. We confirm what is available during pilot onboarding.",
      },
    },
    {
      "@type": "Question",
      name: "Is shelter data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Role-based access, consent-first design, and you keep your data. We use industry-standard protections from our cloud providers and limit what is sent for AI-assisted features.",
      },
    },
    {
      "@type": "Question",
      name: "Can adoptable animals appear on major adoption sites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Listing integrations are part of the pilot. When you apply, we cover what your rollout includes today and what is planned next.",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <GoogleAnalytics />
        <CookieConsentClient />
      </body>
    </html>
  );
}
