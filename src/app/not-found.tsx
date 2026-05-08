import Link from "next/link";
import { PawPrint, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page could not be found on Cran.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Page Not Found",
    description: "This page could not be found on Cran.",
    url: SITE_URL,
    siteName: "Cran",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Page Not Found",
    description: "This page could not be found on Cran.",
  },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      <main className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans selection:bg-cran selection:text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          {/* Big playful 404 */}
          <div className="relative mb-8">
            <span className="text-[clamp(6rem,20vw,12rem)] font-bold leading-none text-charcoal/[0.06] select-none" style={{ letterSpacing: '-0.05em' }}>
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-cran/80" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-3">
            Oops. This page wandered off
          </h1>
          <p className="text-charcoal/60 text-lg mb-10 max-w-md mx-auto">
            Like a curious cat exploring the wrong kennel. Don&apos;t worry, we&apos;ll help you find your way back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cran px-6 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-cran-hover shadow-sm"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-charcoal/10 bg-white px-6 py-3.5 text-[15px] font-medium text-charcoal transition-colors hover:bg-charcoal/5"
            >
              Browse the Blog
            </Link>
          </div>

          {/* Decorative paws */}
          <div className="mt-20 flex justify-center gap-8 opacity-20">
            <PawPrint className="w-8 h-8 text-charcoal" strokeWidth={1} />
            <PawPrint className="w-6 h-6 text-charcoal -scale-x-100" strokeWidth={1} />
            <PawPrint className="w-8 h-8 text-charcoal" strokeWidth={1} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
