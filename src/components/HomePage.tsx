"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Mail, Shield, Zap, Users, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { joinWaitlist } from "@/actions/waitlist";
import type { PostPreview } from "@/lib/blog";

/* ── Animated counter hook ── */
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

/* ── Scroll reveal hook ── */
function useReveal<elementT extends HTMLElement>() {
  const [node, setNode] = useState<elementT | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { setNode, visible };
}

type BlogPostForClient = Omit<PostPreview, "createdAt"> & { createdAt: string };

const FAQ_ITEMS = [
  { q: "What is Cran?", a: "A shelter management platform — intake, medical, adoptions, all in one." },
  { q: "Who is it for?", a: "Shelters and rescues of any size." },
  { q: "How do I get started?", a: "Schedule a demo. We'll walk you through and get you set up." },
];

export default function HomePage({ blogPosts = [] }: { blogPosts?: BlogPostForClient[] }) {
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

  const stat1 = useCounter(12400, 2200);
  const stat2 = useCounter(340, 1800);
  const stat3 = useCounter(98, 1500);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const feat1 = useReveal<HTMLDivElement>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const feat2 = useReveal<HTMLDivElement>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const feat3 = useReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-white text-charcoal selection:bg-cran selection:text-white font-sans overflow-x-hidden">

      <SiteHeader />

      {/* Background that only exists behind the Hero (NOT fixed) to prevent covering the light mode footer/features */}
      <main className="relative z-10 bg-[#FAFAF8]">

        {/* ══════════════════ HERO — DARK ══════════════════ */}
        <section className="relative overflow-hidden pt-28 lg:pt-40 pb-0 flex flex-col items-center min-h-[90vh] bg-[#08080A]">
          {/* Ambient radial grid bg moved inside Hero section */}
          <div className="absolute inset-0 opacity-[0.12] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center 30%, transparent 10%, #08080A 80%)' }} />

          {/* Ambient glow */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(203,74,58,0.15) 0%, transparent 65%)' }} />
          <div className="absolute top-60 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.1) 0%, transparent 70%)' }} />
          
          <div className="relative mx-auto w-full max-w-4xl z-10 flex flex-col items-center text-center px-6">
            
            {/* Status badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cran/20 bg-cran/[0.06] px-4 py-1.5 text-[15px] font-semibold uppercase tracking-[0.12em] text-cran select-none fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-cran animate-pulse"></span>
              Now in private beta
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-[-0.03em] text-white leading-[0.92] w-full fade-up-d1">
              Save time. <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-cran via-[#E8614F] to-[#D4523F] bg-clip-text text-transparent">Save more animals.</span>
            </h1>

            <p className="mt-8 text-lg lg:text-xl leading-relaxed text-white/45 font-normal max-w-2xl [text-wrap:balance] fade-up-d2">
              Intake, kennel management, medical tracking, and adoptions — unified in one mobile-first platform that your team can learn in minutes.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row pb-12 w-full max-w-xs sm:max-w-none fade-up-d3">
              <a href="#waitlist" className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-cran px-7 text-base font-semibold text-white transition-all hover:bg-cran/90 shadow-lg shadow-cran/25 hover:shadow-cran/40 hover:-translate-y-0.5">
                Join Waitlist
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#learn-more" className="group flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-7 text-base font-medium text-white/70 transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.06]">
                Learn more
                <ArrowRight size={17} className="text-white/30" />
              </a>
            </div>
          </div>

          {/* ── Abstract Product Preview ── */}
          <div className="relative w-full max-w-[1050px] mx-auto px-4 sm:px-6 mt-4 md:mt-12 z-10" style={{ perspective: '1200px' }}>
            {/* Ambient deep red glow */}
            <div className="absolute inset-x-12 inset-y-0 rounded-[3rem] pointer-events-none opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(ellipse at top, rgba(203,74,58,0.5) 0%, transparent 60%)', filter: 'blur(70px)' }} />
            
            <div 
              className="relative w-full rounded-2xl md:rounded-[24px] overflow-hidden border border-white/[0.08] bg-[#0A0A0B] shadow-[0_0_0_1px_rgba(255,255,255,0.05),_0_60px_160px_-20px_rgba(0,0,0,0.9),_0_0_80px_rgba(203,74,58,0.15)] ring-1 ring-white/10 flex items-center justify-center p-8 md:p-12 mb-12"
              style={{ 
                transform: 'rotateX(5deg)',
                height: '420px',
                transformOrigin: 'top center'
              }}
            >
              {/* Abstract inner glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(203,74,58,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Abstract data lines/nodes to look techy but hide the actual UI */}
              <div className="relative w-full h-full flex flex-col items-center justify-center opacity-70">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-cran/50 rounded-full"></div>
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[0_0_30px_rgba(203,74,58,0.2)] glow-pulse">
                    <div className="w-3 h-3 rounded-full bg-cran shadow-[0_0_15px_rgba(203,74,58,0.8)]"></div>
                  </div>
                  <div className="w-16 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-cran/50 rounded-full"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex w-32 h-12 rounded-xl border border-white/5 bg-white/[0.01] items-center justify-center blur-[1px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="w-48 h-12 rounded-xl border border-cran/20 bg-cran/[0.05] flex items-center px-4 gap-3 shadow-[0_0_20px_rgba(203,74,58,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-cran animate-pulse"></div>
                    <div className="flex-1 h-1 bg-cran/40 rounded-full"></div>
                  </div>
                  <div className="hidden md:flex w-24 h-12 rounded-xl border border-white/5 bg-white/[0.01] items-center justify-center blur-[1px]">
                     <div className="w-8 h-1 bg-white/10 rounded-full"></div>
                  </div>
                </div>
                
                {/* Connecting vertical lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10"></div>
                
                <div className="mt-10 text-white/30 text-[14px] sm:text-[15px] font-bold tracking-[0.2em] uppercase select-none">
                  Core Management Engine
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ══════════════════ TRUST — Partners + Infrastructure (combined) ══════════════════ */}
        <section id="learn-more" className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-16">
              <h3 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-6">
                Piloting with forward-thinking shelters
              </h3>
              <div className="text-3xl md:text-4xl font-black text-charcoal tracking-tighter opacity-80">Safe Harbor Animal Sanctuary</div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 pt-8 border-t border-charcoal/10">
              <span className="text-base font-semibold tracking-[0.12em] uppercase text-charcoal/40">Built on</span>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
                <div className="text-[1.5rem] font-bold tracking-tight text-charcoal/30 hover:text-charcoal/50 transition-colors">▲ Vercel</div>
                <div className="text-[1.75rem] font-bold tracking-tighter text-charcoal/30 hover:text-charcoal/50 transition-colors">Stripe</div>
                <div className="text-[1.5rem] font-bold tracking-wide text-charcoal/30 hover:text-charcoal/50 transition-colors">AWS</div>
                <div className="text-[1.25rem] font-semibold tracking-tight text-charcoal/30 hover:text-charcoal/50 transition-colors flex items-center gap-1.5"><Sparkles size={18} fill="currentColor"/> OpenAI</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ BUILT FOR ══════════════════ */}
        <section className="py-20 md:py-24 relative bg-white border-t border-charcoal/5">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-14">
              <h3 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-4">
                Built for
              </h3>
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
                  <p className="text-base text-charcoal/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ WHY WE'RE BUILDING ══════════════════ */}
        <section className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h3 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-6">
              Why we&apos;re building
            </h3>
            <p className="text-xl md:text-2xl text-charcoal/70 leading-relaxed font-medium">
              Shelter staff deserve tools that actually help — not spreadsheets, paper trails, and software built for someone else. We&apos;re building Cran because animal welfare organizations do life-changing work, and they shouldn&apos;t have to fight their systems to do it.
            </p>
          </div>
        </section>

        {/* ══════════════════ BLOG FEED (LIGHT) — Matches Trust section treatment ══════════════════ */}
        {blogPosts.length > 0 && (
          <section className="py-20 md:py-24 relative bg-[#FAFAF8] border-t border-charcoal/5">
            <div className="mx-auto max-w-5xl px-6">
              <div className="text-center mb-12">
                <h3 className="text-base font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-4">
                  Latest from the blog
                </h3>
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
                      {/* Preview image or themed placeholder */}
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
                              `
                            }}
                          >
                            {/* Soft floating orbs */}
                            <div className="absolute top-[15%] right-[20%] w-20 h-20 rounded-full bg-cran/10 blur-xl" />
                            <div className="absolute bottom-[25%] left-[15%] w-24 h-24 rounded-full bg-[#D0C4B8]/40 blur-2xl" />
                            <div className="absolute top-[50%] left-[45%] w-16 h-16 rounded-full bg-cran/8 blur-lg" />
                            <img
                              src="/cran-logo.png"
                              alt=""
                              className="w-14 h-14 object-contain opacity-30 relative z-10 drop-shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col p-5">
                        <time className="text-[15px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">
                          {dateString}
                        </time>
                        <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-cran transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-lg text-charcoal/55 leading-relaxed flex-1 line-clamp-2">
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
                  className="text-base font-semibold tracking-[0.08em] uppercase text-charcoal/50 hover:text-cran transition-colors"
                >
                  View all posts
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════ FAQ ══════════════════ */}
        <section className="py-16 md:py-20 relative bg-white border-t border-charcoal/5" id="faq">
          <div className="mx-auto max-w-2xl px-6">
            <h3 className="text-lg font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-8 text-center">
              FAQ
            </h3>
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
                      className={`text-charcoal/40 shrink-0 transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${faqOpen === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-xl text-charcoal/55 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ WAITLIST — CTA ══════════════════ */}
        <section className="py-24 md:py-32 relative overflow-hidden bg-[#F8F7F4] border-t border-charcoal/10" id="waitlist">
          
          <div className="relative mx-auto max-w-2xl px-6 text-center z-10">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-cran/20 bg-white px-3 py-1.5 text-[15px] font-semibold uppercase tracking-[0.1em] text-cran mb-6 shadow-sm">
              <Mail size={12} strokeWidth={1.5} /> Early Access
            </div>

            <h2 className="text-3xl md:text-[2.8rem] font-bold tracking-tight text-charcoal leading-tight mb-5">
              Ready to upgrade?
            </h2>
            <p className="text-xl text-charcoal/60 font-medium mb-10 leading-relaxed max-w-lg mx-auto">
              Cran is currently in closed beta. Join the waitlist for priority access and founding member pricing.
            </p>
            
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-md mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                disabled={status === "loading" || status === "success"}
                placeholder="you@shelter.org"
                className="w-full min-w-0 h-14 rounded-xl border border-charcoal/10 bg-white px-5 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-cran/50 focus:ring-2 focus:ring-cran/20 shadow-sm transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full sm:w-auto h-14 rounded-xl px-8 text-base font-bold text-white transition-all shadow-lg shrink-0 disabled:opacity-90 disabled:cursor-not-allowed ${
                  status === "success" 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                    : "bg-cran hover:bg-cran-hover shadow-cran/20 hover:shadow-cran/40 hover:-translate-y-0.5"
                }`}
              >
                {status === "loading" ? "Joining..." : status === "success" ? "You're on the list!" : "Join Waitlist"}
              </button>
            </form>

            {status === "error" && (
              <div className="text-cran text-base font-medium mb-8 max-w-md mx-auto text-center">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-6 text-base text-charcoal/50 font-medium">
              <span className="flex items-center gap-1.5"><Zap size={16} className="text-cran" /> Priority access</span>
              <span className="flex items-center gap-1.5"><Users size={16} className="text-cran" /> Founding pricing</span>
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-cran" /> Dedicated onboarding</span>
            </div>
            
            <p className="mt-10 text-lg text-charcoal/40 font-medium">
              Or email <a href="mailto:support@getcran.ai" className="text-charcoal/60 underline underline-offset-4 hover:text-charcoal transition-colors">support@getcran.ai</a>
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
