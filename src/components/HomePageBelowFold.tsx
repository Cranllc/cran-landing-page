"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import SiteFooter from "@/components/SiteFooter";
import type { PostPreview } from "@/lib/blog";

type BlogPostForClient = Omit<PostPreview, "createdAt"> & { createdAt: string };

const FAQ_ITEMS = [
  { q: "What is Cran?", a: "A shelter management platform — intake, medical, adoptions, all in one." },
  { q: "Who is it for?", a: "Shelters and rescues of any size." },
  { q: "How do I get started?", a: "Schedule a demo. We'll walk you through and get you set up." },
];

export default function HomePageBelowFold({ blogPosts = [] }: { blogPosts?: BlogPostForClient[] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
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
      {/* TRUST — Partners + Infrastructure */}
      <section id="learn-more" className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-6">
              Piloting with forward-thinking shelters
            </h2>
            <div className="text-3xl md:text-4xl font-black text-charcoal tracking-tighter opacity-80">Safe Harbor Animal Sanctuary</div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 pt-8 border-t border-charcoal/10">
              <div className="text-[1.5rem] font-bold tracking-tight text-charcoal/50 hover:text-charcoal/70 transition-colors">▲ Vercel</div>
              <div className="text-[1.75rem] font-bold tracking-tighter text-charcoal/50 hover:text-charcoal/70 transition-colors">Stripe</div>
              <div className="text-[1.5rem] font-bold tracking-wide text-charcoal/50 hover:text-charcoal/70 transition-colors">AWS</div>
              <div className="text-[1.25rem] font-semibold tracking-tight text-charcoal/50 hover:text-charcoal/70 transition-colors flex items-center gap-1.5"><Sparkles size={18} fill="currentColor"/> OpenAI</div>
          </div>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="py-20 md:py-24 relative bg-white border-t border-charcoal/5 [content-visibility:auto] [contain-intrinsic-size:auto_400px]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-4">
              Built for
            </h2>
            <p className="text-xl text-charcoal/60 font-medium max-w-xl mx-auto">
              Everyone who keeps a shelter running.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Shelter directors", desc: "See the full picture and make better decisions." },
              { label: "Operations staff", desc: "Intake, kennel cards, and daily workflows in one place." },
              { label: "Adoption coordinators", desc: "Match animals with families and track outcomes." },
              { label: "Medical & volunteers", desc: "Vaccinations, treatments, and notes where you need them." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-charcoal/5 bg-[#FAFAF8]/80">
                <h4 className="text-lg font-bold text-charcoal mb-2">{item.label}</h4>
                <p className="text-base text-charcoal/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE&apos;RE BUILDING */}
      <section className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5 [content-visibility:auto] [contain-intrinsic-size:auto_250px]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-8 text-center">
            Why we&apos;re building
          </h2>
          <blockquote className="relative text-center pt-4 pb-8">
            <span className="absolute top-0 left-0 md:-left-2 text-[3.5rem] md:text-[5rem] font-serif leading-none text-cran select-none pointer-events-none" aria-hidden="true">&ldquo;</span>
            <span className="absolute bottom-0 right-0 md:-right-2 text-[3.5rem] md:text-[5rem] font-serif leading-none text-cran select-none pointer-events-none" aria-hidden="true">&rdquo;</span>
            <p className="relative z-10 text-lg md:text-xl text-charcoal/75 leading-relaxed font-medium italic px-8 md:px-14">
              Shelter staff deserve tools that actually help — not spreadsheets, paper trails, and software built for someone else. We&apos;re building Cran because animal welfare organizations do life-changing work, and they shouldn&apos;t have to fight their systems to do it.
            </p>
          </blockquote>
        </div>
      </section>

      {/* BLOG FEED */}
      {blogPosts.length > 0 && (
        <section className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5 [content-visibility:auto] [contain-intrinsic-size:auto_500px]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-4">
                Latest from the blog
              </h2>
              <p className="text-xl text-charcoal/60 font-medium max-w-lg mx-auto">
                Stories, insights, and updates from the Cran team.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {blogPosts.map((post) => {
                const excerpt = post.content.replace(/[#*`_>]/g, "").substring(0, 120).trim() + "...";
                const dateString = new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const hasImage = post.imageUrl && post.imageUrl.startsWith("http");
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-charcoal/5 bg-white overflow-hidden transition-all hover:border-charcoal/10 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative w-full aspect-[16/10] bg-[#E8E7E4] overflow-hidden shrink-0">
                      {hasImage ? (
                        <img
                          src={post.imageUrl!}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center overflow-hidden"
                          style={{
                            background: `
                              radial-gradient(ellipse 120% 80% at 10% 90%, rgba(214, 68, 54, 0.2) 0%, transparent 55%),
                              radial-gradient(ellipse 100% 100% at 90% 10%, rgba(214, 68, 54, 0.14) 0%, transparent 50%),
                              radial-gradient(ellipse 70% 90% at 70% 65%, rgba(208, 196, 184, 0.5) 0%, transparent 55%),
                              radial-gradient(ellipse 90% 70% at 25% 30%, rgba(250, 250, 248, 0.95) 0%, transparent 50%),
                              linear-gradient(155deg, #F5EDE8 0%, #FAFAF8 40%, #EFE8E3 75%, #EDE6E1 100%)
                            `,
                          }}
                        >
                          <div className="absolute top-[15%] right-[20%] w-20 h-20 rounded-full bg-cran/10 blur-sm" />
                          <div className="absolute bottom-[25%] left-[15%] w-24 h-24 rounded-full bg-[#D0C4B8]/40 blur-sm" />
                          <div className="absolute top-[50%] left-[45%] w-16 h-16 rounded-full bg-cran/8 blur-sm" />
                          <Image
                            src="/cran-logo.png"
                            alt=""
                            width={56}
                            height={56}
                            className="w-14 h-14 object-contain opacity-30 relative z-10 drop-shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col p-5">
                      <time className="text-[15px] font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                        {dateString}
                      </time>
                      <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-cran transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-lg text-charcoal/65 leading-relaxed flex-1 line-clamp-2">
                        {excerpt}
                      </p>
                      <span className="mt-4 text-base font-semibold text-charcoal/60 group-hover:text-cran inline-flex items-center gap-1.5 transition-colors">
                        Read article
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="text-base font-semibold tracking-[0.08em] uppercase text-charcoal/65 hover:text-cran transition-colors"
              >
                View all posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-20 relative bg-white border-t border-charcoal/5 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" id="faq">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-lg font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-8 text-center">
            FAQ
          </h2>
          <div className="space-y-1">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-charcoal/10 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left hover:bg-charcoal/[0.02] transition-colors"
                >
                  <h4 className="text-xl font-bold text-charcoal">{item.q}</h4>
                  <ChevronDown
                    size={24}
                    className={`text-charcoal/60 shrink-0 transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${faqOpen === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-xl text-charcoal/70 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="py-20 md:py-24 relative overflow-hidden bg-[#F8F7F4] border-t border-charcoal/10 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" id="waitlist">
        <div className="relative mx-auto max-w-2xl px-6 text-center z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cran/20 bg-white px-2.5 py-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-cran mb-4 shadow-sm">
            <Mail size={10} strokeWidth={1.5} /> Early Access
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-charcoal leading-tight mb-3">
            Ready to upgrade?
          </h2>
          <p className="text-lg md:text-xl text-charcoal/60 font-medium mb-6 leading-relaxed max-w-lg mx-auto">
            We're building Cran. Join the waitlist for early access and for updates.
          </p>

          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-sm mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              disabled={status === "loading" || status === "success"}
              placeholder="you@shelter.org"
              className="w-full min-w-0 h-11 rounded-lg border border-charcoal/10 bg-white px-4 text-[15px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-cran/50 focus:ring-2 focus:ring-cran/20 shadow-sm transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`w-full sm:w-auto h-11 rounded-lg px-6 text-[15px] font-bold text-white transition-all shadow-md shrink-0 disabled:opacity-90 disabled:cursor-not-allowed ${
                status === "success"
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                  : "bg-cran hover:bg-cran-hover shadow-cran/20 hover:shadow-cran/40 hover:-translate-y-0.5"
              }`}
            >
              {status === "loading" ? "Joining..." : status === "success" ? "You're on the list!" : "Join Waitlist"}
            </button>
          </form>

          {status === "error" && (
            <div className="text-cran text-sm font-medium mb-6 max-w-md mx-auto text-center">
              {errorMessage}
            </div>
          )}

          <p className="mt-6 text-base text-charcoal/60 font-medium">
            Or email <a href="mailto:support@getcran.ai" className="text-charcoal/75 underline underline-offset-4 hover:text-charcoal transition-colors">support@getcran.ai</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
