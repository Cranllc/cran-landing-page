"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import SiteFooter from "@/components/SiteFooter";
import type { PostPreview } from "@/lib/blog";
import { DEMO_URL, PILOT_CTA_LABEL, pilotCtaOpensInNewTab, SUPPORT_PREFILLED_MAILTO } from "@/lib/site-config";

type BlogPostForClient = Omit<PostPreview, "createdAt"> & { createdAt: string; dateString?: string };

const TRUST_CHIPS = ["In active pilot", "Mobile-first", "AI-assisted drafts (Berry)"] as const;

/** TODO: set when a partner has given permission to be named. Do not invent a shelter. */
const NAMED_PILOT_PARTNER: string | null = null;

const BUILT_FOR_ITEMS = [
  { label: "Shelter directors", desc: "See the full picture and make better decisions." },
  { label: "Operations staff", desc: "Intake, kennel cards, and daily workflows in one place." },
  { label: "Adoption coordinators", desc: "Match animals with families and track outcomes." },
  { label: "Medical & volunteers", desc: "Vaccinations, treatments, and notes where you need them." },
] as const;

const WHAT_YOU_GET_ITEMS = [
  {
    label: "Intake",
    desc: "Capture animals into shared profiles so the floor starts with the same record.",
  },
  {
    label: "Animal profiles",
    desc: "Medical notes, kennel context, and history on one animal record the floor can actually use.",
  },
  {
    label: "Tasks & care plans",
    desc: "Rounds, recurring care, and handoffs so the next shift knows what matters.",
  },
  {
    label: "Adoptions",
    desc: "Match animals with families and track outcomes without a separate spreadsheet.",
  },
  {
    label: "Reporting",
    desc: "Exports and reporting-style views for grants and partners, confirmed during onboarding.",
  },
  {
    label: "Berry AI",
    desc: "Assists with questions, priorities, photo-assisted suggestions, and bio drafts. Staff stay in control.",
  },
];

const PILOT_STEPS = [
  {
    label: "Apply",
    desc: "Share shelter type, team size, current tools, and biggest workflow pain points via the pilot CTA or email.",
  },
  {
    label: "Fit check",
    desc: "We confirm whether Cran is a good match and what is live today versus still refining.",
  },
  {
    label: "Onboard",
    desc: "Setup and role configuration, then go live on core workflows together.",
  },
];

const FAQ_ITEMS: { q: string; a: ReactNode }[] = [
  {
    q: "What is Cran?",
    a: "Shelter management powered by AI and designed for mobile. Staff stay on the floor instead of at a computer, with tools that keep them focused on animals instead of paperwork.",
  },
  {
    q: "Who is the pilot for?",
    a: "Shelters and rescues that want to run intake, care, and adoption workflows in one place, and are open to giving product feedback as we improve.",
  },
  {
    q: "What works today?",
    a: "Core workflows are live: intake, animal profiles, tasks and care plans, rounds, handoffs, adoptions, and reporting.",
  },
  {
    q: "What is still evolving?",
    a: "Some automation depth, workflow polish, and parts of the integration experience are still being refined during pilot.",
  },
  {
    q: "How does onboarding work?",
    a: "We start with setup and role configuration, then help your team go live on core workflows.",
  },
  {
    q: "Can we import from our current system?",
    a: "Yes. We support structured imports and field mapping so you are not retyping everything. During pilot we work with you on the cleanest path from your current tools.",
  },
  {
    q: "What AI features are available now?",
    a: "AI is there to speed up intake, bios, care notes, and reporting-style drafts. How we use it with your team is something we figure out together during the pilot.",
  },
  {
    q: "What integrations are available?",
    a: "We are piloting payments and listing integrations now, with more on the roadmap. During the pilot we align with you on what is live today and what we are building toward next.",
  },
  {
    q: "Does Cran work on mobile?",
    a: "Yes. It is built for floor use in the browser, and you can add it to your home screen on supported phones for a more app-like feel.",
  },
  {
    q: "How do we join the pilot?",
    a: (
        <>
        Share your shelter type, team size, current tools, and biggest workflow pain points, then{" "}
        <a
          href={DEMO_URL}
          className="text-cran font-medium underline underline-offset-2 hover:text-cran-hover"
          {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {PILOT_CTA_LABEL}
        </a>{" "}
        or add your email below for pilot updates. We&apos;ll confirm fit and next steps.
      </>
    ),
  },
];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-medium text-cran">{children}</p>;
}

function DefinitionRow({ label, desc }: { label: string; desc: string }) {
  return (
    <li className="grid gap-1 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-10 sm:py-7">
      <h3 className="text-[15px] font-semibold tracking-tight text-charcoal">{label}</h3>
      <p className="text-[15px] leading-relaxed text-charcoal/55">{desc}</p>
    </li>
  );
}

export default function HomePageBelowFold({ blogPosts = [] }: { blogPosts?: BlogPostForClient[] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const handlePilotEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage("");
    const result = await joinWaitlist(email);
    if (result.error) {
      setStatus("error");
      setErrorMessage(result.error);
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <>
      <section aria-label="Cran at a glance" className="scroll-mt-20 border-t border-charcoal/[0.07] py-8">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-[13px] leading-relaxed text-charcoal/45">
            {TRUST_CHIPS.join("  ·  ")}
            {NAMED_PILOT_PARTNER ? `  ·  Pilot partner: ${NAMED_PILOT_PARTNER}` : null}
          </p>
        </div>
      </section>

      <section
        id="learn-more"
        className="scroll-mt-20 border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_400px]"
      >
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>Built for</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
            Everyone who keeps a shelter running.
          </h2>
          <ul className="mt-10 divide-y divide-charcoal/[0.08] border-y border-charcoal/[0.08]">
            {BUILT_FOR_ITEMS.map((item) => (
              <DefinitionRow key={item.label} label={item.label} desc={item.desc} />
            ))}
          </ul>
        </div>
      </section>

      <section
        id="what-you-get"
        className="scroll-mt-20 border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_520px]"
      >
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>What you get</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
            Core workflows, live in pilot.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-charcoal/55">
            Built for floor use instead of another desktop silo.
          </p>
          <ul className="mt-10 divide-y divide-charcoal/[0.08] border-y border-charcoal/[0.08]">
            {WHAT_YOU_GET_ITEMS.map((item) => (
              <DefinitionRow key={item.label} label={item.label} desc={item.desc} />
            ))}
          </ul>
        </div>
      </section>

      <section
        id="how-pilot-works"
        className="scroll-mt-20 border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_420px]"
      >
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>How the pilot works</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
            A small partner program.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-charcoal/55">
            We confirm fit before you go live.
          </p>
          <ol className="mt-12 space-y-10">
            {PILOT_STEPS.map((step, i) => (
              <li key={step.label} className="grid gap-3 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8">
                <p className="text-[13px] font-medium tabular-nums text-cran" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-charcoal">{step.label}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal/55">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row">
            <a
              href={DEMO_URL}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cran px-6 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.08),0_8px_20px_-8px_rgba(214,68,54,0.55)] transition-colors hover:bg-cran-hover focus:outline-none focus:ring-2 focus:ring-cran/40 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
              {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {PILOT_CTA_LABEL}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <Link
              href="#pilot"
              className="inline-flex h-12 items-center justify-center rounded-xl px-2 text-[15px] font-semibold text-charcoal/70 transition-colors hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]"
            >
              Get email updates
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_250px]">
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>Why we&apos;re building</SectionEyebrow>
          <blockquote className="mt-6">
            <p className="text-xl font-medium leading-relaxed tracking-[-0.02em] text-charcoal md:text-[1.65rem] md:leading-[1.4]">
              Shelter staff deserve tools that actually help, not spreadsheets, paper trails, and software built for someone else. We&apos;re building Cran because animal welfare organizations do life-changing work, and they shouldn&apos;t have to fight their systems to do it.
            </p>
          </blockquote>
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section className="border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_500px]">
          <div className="mx-auto max-w-3xl px-6">
            <SectionEyebrow>Blog</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
              Latest from the team.
            </h2>
            <ul className="mt-10 divide-y divide-charcoal/[0.08] border-y border-charcoal/[0.08]">
              {blogPosts.map((post) => {
                const excerpt = post.content.replace(/[#*`_>]/g, "").substring(0, 120).trim() + "...";
                const dateString = post.dateString ?? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const hasImage = post.imageUrl && post.imageUrl.startsWith("http");
                return (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-5 py-8 sm:flex-row sm:items-start"
                    >
                      {hasImage ? (
                        <img
                          src={post.imageUrl!}
                          alt=""
                          className="aspect-[16/10] w-full shrink-0 rounded-lg object-cover sm:h-24 sm:w-36 sm:aspect-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-[#EDEAE4] sm:h-24 sm:w-36 sm:aspect-auto">
                          <Image
                            src="/cran-logo.png"
                            alt=""
                            width={40}
                            height={40}
                            className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain opacity-25"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <time className="text-[12px] font-medium text-charcoal/40" suppressHydrationWarning dateTime={post.createdAt}>
                          {dateString}
                        </time>
                        <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight text-charcoal group-hover:text-cran">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-charcoal/55">
                          {excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-charcoal/70 transition-colors hover:text-cran focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-2 rounded"
              >
                View all posts
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        className="scroll-mt-20 border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_400px]"
        id="faq"
      >
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
            Questions, answered.
          </h2>
          <div className="mt-10 divide-y divide-charcoal/[0.08] border-y border-charcoal/[0.08]">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <h3 className="text-[16px] font-semibold tracking-tight text-charcoal">{item.q}</h3>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-charcoal/40 transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${faqOpen === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-[15px] leading-relaxed text-charcoal/55">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-20 border-t border-charcoal/[0.07] py-20 md:py-28 [content-visibility:auto] [contain-intrinsic-size:auto_500px]"
        id="pilot"
      >
        <div className="mx-auto max-w-3xl px-6">
          <SectionEyebrow>Pilot</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-charcoal md:text-[2.5rem] md:leading-[1.15]">
            Interested in the pilot?
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-charcoal/55">
            Who it&apos;s for: shelters and rescues that want intake, care, and adoptions in one mobile-first system, and can give product feedback while we improve.
          </p>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-charcoal/55">
            We review every application for fit and follow up.{" "}
            <a
              href={DEMO_URL}
              className="font-semibold text-cran underline underline-offset-4 hover:text-cran-hover"
              {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {PILOT_CTA_LABEL}
            </a>{" "}
            to start a conversation, or use the form for email updates.
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal/45">
            Add your work email and we&apos;ll follow up about the pilot when it makes sense for your org.
          </p>

          <form
            onSubmit={handlePilotEmailSignup}
            className="mt-8 flex w-full max-w-md flex-col items-stretch gap-2 sm:flex-row sm:items-center"
          >
            <label htmlFor="pilot-email" className="sr-only">
              Email for pilot updates
            </label>
            <input
              id="pilot-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              disabled={status === "loading" || status === "success"}
              placeholder="you@shelter.org"
              autoComplete="email"
              className="h-12 w-full min-w-0 rounded-xl border border-charcoal/12 bg-white px-4 text-[15px] text-charcoal placeholder:text-charcoal/30 shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-colors focus:border-cran/40 focus:outline-none focus:ring-2 focus:ring-cran/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`h-12 w-full shrink-0 rounded-xl px-5 text-[15px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-90 sm:w-auto ${
                status === "success"
                  ? "bg-emerald-600"
                  : "bg-cran hover:bg-cran-hover"
              }`}
            >
              {status === "loading"
                ? "Sending…"
                : status === "success"
                  ? "Thanks"
                  : "Get updates"}
            </button>
          </form>

          {status === "error" && (
            <div role="alert" className="mt-3 max-w-md text-sm font-medium text-cran">
              {errorMessage}
            </div>
          )}
          {status === "success" && (
            <p className="mt-3 text-sm text-charcoal/55" role="status">
              Thanks. We will be in touch about the pilot.
            </p>
          )}

          <p className="mt-8 text-[14px] text-charcoal/45">
            Or email{" "}
            <a
              href={SUPPORT_PREFILLED_MAILTO}
              className="underline underline-offset-4 hover:text-charcoal"
            >
              support@getcran.ai
            </a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
