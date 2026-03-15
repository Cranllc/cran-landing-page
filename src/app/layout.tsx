import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cran | AI-Powered Shelter Management",
  description:
    "Camera intake with AI breed detection, medical records, kennel management, task automation, and SPDA export — one platform built for animal shelters and rescues.",
  keywords: [
    "animal shelter software",
    "shelter management platform",
    "AI shelter software",
    "kennel management software",
    "pet adoption software",
    "AI breed detection",
    "shelter intake software",
    "SPDA export software",
    "animal rescue software",
    "foster management",
  ],
  authors: [{ name: "Cran, LLC" }],
  metadataBase: new URL("https://cran.ai"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cran.ai",
    siteName: "Cran",
    title: "Cran | AI-Powered Shelter Management",
    description: "One platform for everything — intake, medical, kennels, adoptions, reporting. Built for shelters.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cran" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cran | AI-Powered Shelter Management",
    description: "One platform for everything — built for shelters.",
    images: ["/og-image.png"],
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
  url: "https://cran.ai",
  description: "AI-powered shelter management with camera intake, breed detection, medical records, kennel management, task automation, foster management, and SPDA export.",
  featureList: [
    "AI camera intake with breed detection",
    "AI bio generation",
    "AI health triage",
    "Kennel & cage management",
    "Medical records with vaccination tracking",
    "Staff & volunteer task management",
    "Foster management",
    "Transport coordination",
    "Behavior assessments",
    "Lost & found tracking",
    "Adoption event scheduling",
    "SPDA export & automated reports",
    "Petfinder & Adopt-a-Pet sync",
    "Public adopter portal",
    "Two-way SMS",
    "Inventory tracking with AI predictions",
    "Progressive Web App (offline capable)",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What AI features does Cran include?", acceptedAnswer: { "@type": "Answer", text: "Camera intake with breed detection, AI bio generation, AI health triage with risk prediction, AI grant report generation, AI task assignment, and AI shift handoff summaries. All included." } },
    { "@type": "Question", name: "Does Cran work for rescues?", acceptedAnswer: { "@type": "Answer", text: "Yes. Foster management, transport coordination, volunteer tools, and adoption events — all included for rescues and shelters." } },
    { "@type": "Question", name: "Does Cran work on phones?", acceptedAnswer: { "@type": "Answer", text: "Cran is mobile-first. Camera intake is the default home screen. Works as a Progressive Web App with offline capability." } },
    { "@type": "Question", name: "Can Cran export data for grants?", acceptedAnswer: { "@type": "Answer", text: "One-click SPDA CSV export plus AI-drafted grant narratives. 200+ pre-built compliance reports." } },
    { "@type": "Question", name: "Is shelter data safe?", acceptedAnswer: { "@type": "Answer", text: "Consent-first. Full data ownership. PII scrubbed before AI. AES-256 at rest, TLS 1.2+ in transit." } },
    { "@type": "Question", name: "Does Cran sync with Petfinder?", acceptedAnswer: { "@type": "Answer", text: "Automatic sync with Petfinder, Adopt-a-Pet, and other listing platforms." } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FD6JVP8ZV5" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FD6JVP8ZV5');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
