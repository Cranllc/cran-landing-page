import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DiscordLogo from "@/components/DiscordLogo";
import {
  DEMO_URL,
  PILOT_CTA_LABEL,
  pilotCtaOpensInNewTab,
  SITE_URL,
  SUPPORT_PREFILLED_MAILTO,
} from "@/lib/site-config";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

const DISCORD_BLURPLE = "#5865F2";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help, ask questions, or join the Cran community. We're here to support animal shelters.",
  alternates: { canonical: `${SITE_URL}/support` },
  openGraph: {
    title: "Support",
    description: "Get help, ask questions, or join the Cran community. We're here to support animal shelters.",
    url: `${SITE_URL}/support`,
    siteName: "Cran",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Support",
    description: "Get help, ask questions, or join the Cran community.",
  },
};

export default function SupportPage() {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      <main
        id="main-content"
        className="min-h-screen bg-[#FAFAF8] pt-28 pb-24 font-sans selection:bg-cran selection:text-white"
      >
        <div className="mx-auto max-w-2xl px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal/55">
            <Link
              href="/"
              className="hover:text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2 focus:ring-offset-[#FAFAF8] rounded"
            >
              Home
            </Link>
            <span className="mx-2 text-charcoal/35" aria-hidden>
              /
            </span>
            <span className="text-charcoal/55" aria-current="page">
              Support
            </span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-charcoal mb-4">Support</h1>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-10 max-w-xl">
            Have questions or need help? We&apos;re building Cran for animal shelters, and we&apos;d love to hear from you.
          </p>

          <div className="space-y-5">
            <a
              href="https://discord.gg/5zrEvfpCSw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-2xl border border-[#5865F2]/15 bg-white shadow-sm hover:shadow-md hover:border-[#5865F2]/40 hover:-translate-y-0.5 transition-all group focus:outline-none focus:ring-2 focus:ring-[#5865F2]/35 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
              aria-label="Join our Discord community (opens in new window)"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white shadow-inner transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: DISCORD_BLURPLE }}
              >
                <DiscordLogo size={28} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-charcoal mb-1">Join our Discord</h2>
                <p className="text-charcoal/65 text-sm leading-relaxed">
                  Chat with the team, ask questions, and connect with other shelters.
                </p>
              </div>
            </a>

            <a
              href={SUPPORT_PREFILLED_MAILTO}
              className="flex items-center gap-5 p-6 rounded-2xl border border-cran/15 bg-white shadow-sm hover:shadow-md hover:border-cran/35 hover:-translate-y-0.5 transition-all group focus:outline-none focus:ring-2 focus:ring-cran/35 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
            >
              <div className="w-14 h-14 rounded-xl bg-cran flex items-center justify-center shrink-0 text-white shadow-inner transition-transform group-hover:scale-[1.02]">
                <Mail size={26} className="text-white" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-charcoal mb-1">Email us</h2>
                <p className="text-charcoal/65 text-sm leading-relaxed">
                  Reach out at support@getcran.ai for direct support.
                </p>
              </div>
            </a>
          </div>

          <p className="mt-12 text-sm text-charcoal/55 leading-relaxed border-t border-charcoal/10 pt-10 text-center max-w-xl mx-auto text-balance">
            Interested in the pilot?{" "}
            <a
              href={DEMO_URL}
              className="text-cran font-semibold hover:text-cran-hover hover:underline underline-offset-4"
              {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {PILOT_CTA_LABEL}
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
