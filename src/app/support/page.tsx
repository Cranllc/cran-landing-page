import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site-config";
import { MessageSquare, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Cran",
  description: "Get help, ask questions, or join the Cran community. We're here to support animal shelters.",
  alternates: { canonical: `${SITE_URL}/support` },
};

export default function SupportPage() {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      <main className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans selection:bg-cran selection:text-white">
        <div className="mx-auto max-w-2xl px-6 lg:px-12">
          <nav className="mb-8 text-sm text-[#26251E]/60">
            <Link href="/" className="hover:text-[#26251E] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#26251E]/60">Support</span>
          </nav>

          <h1 className="text-4xl font-bold text-[#26251E] mb-6">Support</h1>
          <p className="text-lg text-[#26251E]/70 leading-relaxed mb-12">
            Have questions or need help? We&apos;re building Cran for animal shelters — and we&apos;d love to hear from you.
          </p>

          <div className="space-y-6">
            <a
              href="https://discord.gg/5zrEvfpCSw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-xl border border-charcoal/10 bg-white hover:border-cran/30 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#5865F2]/10 flex items-center justify-center group-hover:bg-[#5865F2]/20 transition-colors">
                <MessageSquare size={24} className="text-[#5865F2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-charcoal mb-1">Join our Discord</h2>
                <p className="text-[#26251E]/65 text-sm">Chat with the team, ask questions, and connect with other shelters.</p>
              </div>
            </a>

            <a
              href="mailto:support@getcran.ai"
              className="flex items-center gap-4 p-6 rounded-xl border border-charcoal/10 bg-white hover:border-cran/30 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-cran/10 flex items-center justify-center group-hover:bg-cran/20 transition-colors">
                <Mail size={24} className="text-cran" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-charcoal mb-1">Email us</h2>
                <p className="text-[#26251E]/65 text-sm">Reach out at support@getcran.ai for direct support.</p>
              </div>
            </a>
          </div>

          <p className="mt-12 text-sm text-[#26251E]/50">
            Prefer to join the waitlist? <Link href="/#waitlist" className="text-cran font-medium hover:underline">Sign up for early access</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
