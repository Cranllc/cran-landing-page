"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import type { PostPreview } from "@/lib/blog";

type BlogPostForClient = Omit<PostPreview, "createdAt"> & { createdAt: string };

const HomePageBelowFold = dynamic(() => import("@/components/HomePageBelowFold"), {
  loading: () => <div className="min-h-[200px] bg-[#FAFAF8]" aria-hidden />,
  ssr: true, // Keep Trust, FAQ, Waitlist in HTML for SEO
});

export default function HomePage({ blogPosts = [] }: { blogPosts?: BlogPostForClient[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const [animationsPaused, setAnimationsPaused] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAnimationsPaused(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-10% 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-charcoal selection:bg-cran selection:text-white font-sans overflow-x-hidden">

      <SiteHeader />

      <main className="relative z-10 bg-[#FAFAF8]">

        {/* HERO — DARK (above fold, minimal deps) */}
        <section
          ref={heroRef}
          className="hero-section relative overflow-hidden pt-28 lg:pt-40 pb-0 flex flex-col items-center min-h-[90vh] bg-[#08080A]"
          {...(animationsPaused ? { "data-animations-paused": "true" } : {})}
        >
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center 30%, transparent 10%, #08080A 80%)' }} />
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(203,74,58,0.15) 0%, transparent 65%)' }} />
          <div className="absolute top-60 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.1) 0%, transparent 70%)' }} />

          <div className="relative mx-auto w-full max-w-4xl z-10 flex flex-col items-center text-center px-6">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-cran/20 bg-cran/[0.06] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cran select-none fade-up">
              <span className="w-1 h-1 rounded-full bg-cran animate-pulse"></span>
              Coming soon
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-[-0.03em] text-white leading-[0.92] w-full fade-up-d1">
              Save time. <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-cran via-[#E8614F] to-[#D4523F] bg-clip-text text-transparent">Save more animals.</span>
            </h1>

            <p className="mt-8 text-lg lg:text-xl leading-relaxed text-white/70 font-normal max-w-2xl [text-wrap:balance] fade-up-d2">
              Animal shelters deserve better. Equip your staff with tools that put the animals first.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-2 sm:flex-row pb-12 w-full max-w-xs sm:max-w-none fade-up-d3">
              <a href="#waitlist" className="group flex h-9 items-center justify-center gap-1.5 rounded-md bg-cran px-5 text-sm font-semibold text-white transition-all hover:bg-cran/90 shadow-md shadow-cran/25 hover:shadow-cran/40 hover:-translate-y-0.5">
                Join Waitlist
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#learn-more" className="flex h-9 items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white hover:bg-white/10">
                Learn more
              </a>
            </div>
          </div>

          {/* Abstract Product Preview */}
          <div className="relative w-full max-w-[1050px] mx-auto px-4 sm:px-6 mt-4 md:mt-12 z-10">
            <div className="absolute inset-x-12 inset-y-0 rounded-[3rem] pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(203,74,58,0.4) 0%, transparent 55%)' }} />
            <div
              className="relative w-full rounded-2xl md:rounded-[24px] overflow-hidden border border-white/[0.08] bg-[#0A0A0B] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-white/10 flex items-center justify-center p-8 md:p-12 mb-12"
              style={{ height: '420px' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(203,74,58,0.05)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative w-full h-full flex flex-col items-center justify-center opacity-70">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-cran/50 rounded-full"></div>
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-[0_0_30px_rgba(203,74,58,0.2)] glow-pulse">
                    <div className="w-3 h-3 rounded-full bg-cran shadow-[0_0_15px_rgba(203,74,58,0.8)]"></div>
                  </div>
                  <div className="w-16 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-cran/50 rounded-full"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex w-32 h-12 rounded-xl border border-white/5 bg-white/[0.01] items-center justify-center">
                    <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="w-48 h-12 rounded-xl border border-cran/20 bg-cran/[0.05] flex items-center px-4 gap-3 shadow-[0_0_20px_rgba(203,74,58,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-cran animate-pulse"></div>
                    <div className="flex-1 h-1 bg-cran/40 rounded-full"></div>
                  </div>
                  <div className="hidden md:flex w-24 h-12 rounded-xl border border-white/5 bg-white/[0.01] items-center justify-center">
                    <div className="w-8 h-1 bg-white/10 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10"></div>

                <div className="mt-10 text-white/50 text-[14px] sm:text-[15px] font-bold tracking-[0.2em] uppercase select-none">
                  Core Management Engine
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Below-fold: Trust, Built For, Why, Blog, FAQ, Waitlist, Footer — separate JS chunk */}
        <HomePageBelowFold blogPosts={blogPosts} />
      </main>
    </div>
  );
}
