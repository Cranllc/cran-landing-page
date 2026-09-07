"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import type { PostPreview } from "@/lib/blog";
import { DEMO_URL, PILOT_CTA_LABEL, pilotCtaOpensInNewTab } from "@/lib/site-config";

type BlogPostForClient = Omit<PostPreview, "createdAt"> & { createdAt: string };

const HomePageBelowFold = dynamic(() => import("@/components/HomePageBelowFold"), {
  loading: () => <div className="min-h-[200px] bg-[#FAFAF8]" aria-hidden />,
  ssr: true,
});

const WORKFLOWS = [
  { step: "01", label: "Intake", hint: "Shared from the floor" },
  { step: "02", label: "Care", hint: "Rounds and handoffs" },
  { step: "03", label: "Adoptions", hint: "Match and outcomes" },
  { step: "04", label: "Reporting", hint: "Grants and partners" },
] as const;

export default function HomePage({ blogPosts = [] }: { blogPosts?: BlogPostForClient[] }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-charcoal selection:bg-cran/15 selection:text-charcoal font-sans overflow-x-hidden">
      <SiteHeader forceLightMode />

      <main id="main-content" className="relative z-10 bg-[#FAFAF8]">
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 55% at 50% -15%, rgba(214,68,54,0.10) 0%, transparent 58%)",
            }}
          />

          <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-charcoal/[0.08] bg-white/80 px-3 py-1 text-[13px] font-medium text-charcoal/70 shadow-[0_1px_2px_rgba(26,26,26,0.04)]">
              <span className="h-1.5 w-1.5 rounded-full bg-cran" aria-hidden />
              Now in pilot
            </p>

            <h1 className="mt-8 text-[2.75rem] font-semibold tracking-[-0.04em] text-charcoal leading-[1.05] sm:text-6xl lg:text-[4.35rem]">
              Save time.
              <br />
              <span className="text-cran">Put animals first.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/60 sm:text-xl">
              One mobile-first system for intake, care, adoptions, and reporting. Built for shelter floor staff.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={DEMO_URL}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cran px-6 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.08),0_8px_20px_-8px_rgba(214,68,54,0.55)] transition-colors hover:bg-cran-hover focus:outline-none focus:ring-2 focus:ring-cran/40 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
                {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {PILOT_CTA_LABEL}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href="#what-you-get"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-charcoal/[0.12] bg-white px-6 text-[15px] font-semibold text-charcoal/80 shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-colors hover:border-charcoal/20 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-charcoal/45">
              We review each application for fit and follow up.
            </p>
          </div>

          <div className="relative mx-auto mt-14 w-full max-w-4xl px-6 lg:mt-16">
            <div className="overflow-hidden rounded-2xl border border-charcoal/[0.08] bg-white shadow-[0_24px_80px_-32px_rgba(26,26,26,0.22)]">
              <ul className="grid grid-cols-2 md:grid-cols-4">
                {WORKFLOWS.map((item, i) => (
                  <li
                    key={item.label}
                    className={`px-5 py-6 text-left md:px-7 md:py-8 ${i % 2 === 1 ? "border-l border-charcoal/[0.06]" : ""} ${i >= 2 ? "border-t border-charcoal/[0.06] md:border-t-0" : ""} ${i === 2 || i === 3 ? "md:border-l md:border-charcoal/[0.06]" : ""}`}
                  >
                    <p className="text-[11px] font-medium tabular-nums tracking-wide text-cran">{item.step}</p>
                    <p className="mt-3 text-[15px] font-semibold tracking-tight text-charcoal">{item.label}</p>
                    <p className="mt-1 text-[13px] leading-snug text-charcoal/50">{item.hint}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-center text-[13px] text-charcoal/40">
              Berry AI assists with drafts. Staff stay in control.
            </p>
          </div>
        </section>

        <HomePageBelowFold blogPosts={blogPosts} />
      </main>
    </div>
  );
}
