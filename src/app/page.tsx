"use client";

import {
  Camera, Stethoscope, CheckCircle2, ArrowRight,
  Sparkles, Menu, X, PlayCircle, PawPrint, Heart,
  Smartphone, Link2, Globe, BarChart3, Mail, MessageSquare,
  LayoutDashboard, ClipboardList, Settings, BarChart2,
  Shield, Zap, Users
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { joinWaitlist } from "@/actions/waitlist";

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

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cran/20 bg-cran/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cran select-none fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-cran animate-pulse"></span>
              Open Beta
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-[-0.03em] text-white leading-[0.92] w-full fade-up-d1">
              Save time. <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-cran via-[#E8614F] to-[#D4523F] bg-clip-text text-transparent">Save more animals.</span>
            </h1>

            <p className="mt-8 text-[17px] lg:text-lg leading-relaxed text-white/45 font-normal max-w-2xl [text-wrap:balance] fade-up-d2">
              Intake, kennel management, medical tracking, and adoptions — unified in one mobile-first platform that your team can learn in minutes.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row pb-12 w-full max-w-xs sm:max-w-none fade-up-d3">
              <a href="#waitlist" className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-cran px-7 text-sm font-semibold text-white transition-all hover:bg-cran/90 shadow-lg shadow-cran/25 hover:shadow-cran/40 hover:-translate-y-0.5">
                Join Waitlist
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#demo" className="group flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-7 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.06]">
                Watch demo
                <PlayCircle size={15} className="text-white/30" />
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
                
                <div className="mt-10 text-white/30 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase select-none">
                  Core Management Engine
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ══════════════════ SHELTER PARTNERS (LIGHT) - DRAFT FOR WHEN LOGOS ARE READY ══════════════════ */}
        {/*
        <section className="pt-24 pb-8 relative bg-[#FAFAF8]">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-12">
              Trusted by forward-thinking shelters
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12">
               <div className="text-2xl md:text-3xl font-black text-charcoal tracking-tighter opacity-40 hover:opacity-100 transition-all duration-300">AUSTIN PETS ALIVE!</div>
               <div className="text-2xl md:text-3xl font-serif italic text-charcoal tracking-tight opacity-40 hover:opacity-100 transition-all duration-300">Humane Society</div>
               <div className="text-3xl md:text-4xl font-extrabold text-charcoal tracking-widest uppercase opacity-40 hover:opacity-100 transition-all duration-300">SPCA</div>
               <div className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight opacity-40 hover:opacity-100 transition-all duration-300">Best Friends</div>
               <div className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tighter opacity-40 hover:opacity-100 transition-all duration-300">PAWS Chicago</div>
            </div>
          </div>
        </section>
        */}

        {/* ══════════════════ STATEMENT SCROLL REVEAL (LIGHT) ══════════════════ */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-24 bg-[#FAFAF8]">
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-charcoal reveal-up">
               Stop fighting <br className="hidden md:block"/>
               <span className="bg-gradient-to-r from-cran via-[#E8614F] to-[#D4523F] bg-clip-text text-transparent">your software.</span>
            </h2>
            <p className="mt-8 text-[17px] md:text-lg text-charcoal/60 max-w-2xl mx-auto font-medium tracking-wide reveal-up" style={{ animationDelay: '0.1s' }}>
              The smartest shelter management platform ever built. Designed to completely fade into the background so your team can focus on what actually matters—the animals.
            </p>
          </div>
        </section>

        {/* ══════════════════ FEATURES — SPLIT PANELS (LIGHT) ══════════════════ */}
        <section className="py-20 md:py-28 bg-[#FAFAF8]" id="solutions">
          <div className="mx-auto max-w-5xl px-6">
            
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-[2.8rem] font-bold tracking-tight text-charcoal leading-tight">
                Built for shelter operations.
              </h2>
              <p className="mt-5 text-base text-white/40 font-normal max-w-xl mx-auto leading-relaxed">
                Every feature designed around the daily reality of running an animal shelter — not repurposed from generic software.
              </p>
            </div>

            {/* Feature 1 — Camera Intake */}
            <div ref={feat1.setNode} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-24 transition-all duration-700 ${feat1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex-1 order-2 md:order-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-cran/20 bg-cran/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cran mb-4 shadow-[0_0_15px_rgba(214,68,54,0.05)]">
                  <Camera size={12} strokeWidth={1.5} /> Intake
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight mb-4 leading-snug">
                  One photo.<br/>Full profile generated.
                </h3>
                <p className="text-[15px] text-charcoal/60 leading-relaxed mb-6">
                  Abstract analysis pipelines detect breed, age, and flags instantaneously. No manual entry required.
                </p>
                <div className="flex flex-col gap-2">
                  {['AI breed & age detection', 'Auto kennel assignment', 'Behavioral flagging'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[13px] text-charcoal/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-cran shadow-[0_0_8px_rgba(214,68,54,0.4)]" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                {/* Abstract Camera Intake Outline */}
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[16px] border border-white/[0.04] bg-[#0F0F10] p-6 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_60%)] glow-pulse pointer-events-none" />
                  
                  {/* Focus reticle */}
                  <div className="absolute inset-x-12 inset-y-12 border border-white/[0.03] rounded-2xl flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cran/40 rounded-tl-xl transition-all duration-700 group-hover:border-cran/80 group-hover:shadow-[0_0_15px_rgba(203,74,58,0.3)]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cran/40 rounded-tr-xl transition-all duration-700 group-hover:border-cran/80 group-hover:shadow-[0_0_15px_rgba(203,74,58,0.3)]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cran/40 rounded-bl-xl transition-all duration-700 group-hover:border-cran/80 group-hover:shadow-[0_0_15px_rgba(203,74,58,0.3)]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cran/40 rounded-br-xl transition-all duration-700 group-hover:border-cran/80 group-hover:shadow-[0_0_15px_rgba(203,74,58,0.3)]" />

                    {/* Central scan line */}
                    <div className="w-full h-[1px] bg-cran pb-[1px] shadow-[0_0_15px_rgba(203,74,58,0.8)] absolute top-1/2 -translate-y-1/2 opacity-50" />
                  </div>

                  {/* Detected Node Tags */}
                  <div className="absolute top-6 left-6 border border-white/[0.05] bg-white/[0.02] backdrop-blur-md rounded-md px-3 py-1.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    <div className="w-16 h-1.5 bg-white/[0.2] rounded-full" />
                  </div>

                  <div className="absolute bottom-6 right-6 border border-white/[0.05] bg-white/[0.02] backdrop-blur-md rounded-md px-3 py-1.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                    <div className="w-12 h-1.5 bg-white/[0.2] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — Medical */}
            <div ref={feat2.setNode} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-24 transition-all duration-700 ${feat2.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex-1">
                {/* Abstract Medical Timeline Outline */}
                <div className="relative w-full aspect-[4/3] rounded-[16px] border border-white/[0.04] bg-[#0F0F10] p-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col justify-center">
                  <div className="absolute top-12 left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="relative space-y-6">
                    {/* Node 1: Completed */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] relative z-10" />
                        <div className="absolute top-4 left-1/2 -ml-[1px] w-[2px] h-6 bg-white/[0.05]" />
                      </div>
                      <div className="w-48 h-2 bg-white/[0.1] rounded-full" />
                    </div>

                    {/* Node 2: Active/Pulsing */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center relative z-10 glow-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </div>
                        <div className="absolute top-4 left-1/2 -ml-[1px] w-[2px] h-6 bg-white/[0.05]" />
                      </div>
                      <div className="w-32 h-2 bg-white/[0.3] shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-full" />
                    </div>

                    {/* Node 3: Future */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full border border-white/[0.1] bg-[#0A0A0B] relative z-10" />
                      </div>
                      <div className="w-40 h-2 bg-white/[0.03] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-600 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                  <Stethoscope size={12} strokeWidth={1.5} /> Medical
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight mb-4 leading-snug">
                  Every vaccination.<br/>Visualized.
                </h3>
                <p className="text-[15px] text-charcoal/60 leading-relaxed mb-6">
                  Abstract data streams replace post-it notes, creating automated timelines that pulse exactly when attention is needed.
                </p>
                <div className="flex flex-col gap-2">
                  {['Event stream processing', 'Real-time alert nodes', 'Immutable records'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[13px] text-charcoal/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 3 — Offline Mobile */}
            <div ref={feat3.setNode} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-all duration-700 ${feat3.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex-1 order-2 md:order-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                  <Smartphone size={12} strokeWidth={1.5} /> Mobile
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight mb-4 leading-snug">
                  Unbroken context.<br/>Even offline.
                </h3>
                <p className="text-[15px] text-charcoal/60 leading-relaxed mb-6">
                  A detached local state cache means you never lose data on the kennel floor. Sync resolves transparently in the background.
                </p>
                <div className="flex flex-col gap-2">
                  {['Local mutation queuing', 'Optimistic UI rendering', 'Conflict resolution'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[13px] text-charcoal/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                {/* Abstract Offline Mobile Outline */}
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[16px] border border-white/[0.04] bg-[#0F0F10] flex items-center justify-center overflow-hidden">
                  
                  {/* Floating abstract mobile card */}
                  <div className="w-48 h-72 rounded-[24px] border border-white/[0.08] bg-[#0A0A0B]/80 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] relative flex flex-col p-4 z-10 hover:-translate-y-2 transition-transform duration-700 float">
                    {/* Status bar */}
                    <div className="w-full flex justify-end mb-6">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                        <span className="text-[8px] font-bold text-amber-500 tracking-wider">OFFLINE</span>
                      </div>
                    </div>

                    {/* Queued events */}
                    <div className="space-y-3">
                      <div className="h-10 rounded-lg border border-dashed border-white/[0.1] bg-white/[0.02] flex items-center px-3">
                        <div className="w-16 h-1.5 bg-white/[0.2] rounded-full opacity-50" />
                      </div>
                      <div className="h-10 rounded-lg border border-dashed border-white/[0.1] bg-white/[0.02] flex items-center px-3">
                        <div className="w-20 h-1.5 bg-white/[0.2] rounded-full opacity-50" />
                      </div>
                    </div>

                    {/* Sync icon outline */}
                    <div className="mt-auto self-center w-8 h-8 rounded-full border-2 border-white/[0.05] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white/[0.2] animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>

                  {/* Disconnected abstract data waves behind */}
                  <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent top-1/2 -translate-y-12 rotate-12" />
                  <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent top-1/2 translate-y-12 -rotate-12 blur-[1px]" />

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════ BENTO GRID (LIGHT) ══════════════════ */}
        <section className="py-24 relative z-10 bg-[#FAFAF8]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-charcoal tracking-tight reveal-up">
                Everything you need. Nothing you don&apos;t.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bento 1 */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-8 transition-all hover:bg-white hover:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 reveal-up">
                <div className="w-12 h-12 rounded-xl bg-charcoal/[0.03] border border-charcoal/5 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:bg-cran/5 group-hover:border-cran/20">
                  <Globe className="text-charcoal/40 group-hover:text-cran transition-colors duration-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2 tracking-tight">1-Click Petfinder Sync</h3>
                <p className="text-charcoal/60 text-[15px] max-w-md">No more double data entry. Adoptable animals instantly push to Petfinder, Adopt-a-Pet, and your own website simultaneously.</p>
              </div>

              {/* Bento 2 */}
              <div className="group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-8 transition-all hover:bg-white hover:shadow-[0_12px_40px_-15px_rgba(168,85,247,0.15)] hover:-translate-y-1 reveal-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-charcoal/[0.03] border border-charcoal/5 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:bg-purple-500/5 group-hover:border-purple-500/20">
                  <ClipboardList className="text-charcoal/40 group-hover:text-purple-500 transition-colors duration-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2 tracking-tight">Custom Forms</h3>
                <p className="text-charcoal/60 text-[15px]">Build beautiful adoption surveys that automatically link to animal profiles.</p>
              </div>

              {/* Bento 3 */}
              <div className="group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-8 transition-all hover:bg-white hover:shadow-[0_12px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1 reveal-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-charcoal/[0.03] border border-charcoal/5 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:bg-emerald-500/5 group-hover:border-emerald-500/20">
                  <Shield className="text-charcoal/40 group-hover:text-emerald-500 transition-colors duration-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2 tracking-tight">Role-based Access</h3>
                <p className="text-charcoal/60 text-[15px]">Granular permissions for staff, fosters, and volunteers. Hide sensitive medical notes automatically.</p>
              </div>

              {/* Bento 4 */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-8 transition-all hover:bg-white hover:shadow-[0_12px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 reveal-up" style={{ animationDelay: '0.2s' }}>
                 <div className="w-12 h-12 rounded-xl bg-charcoal/[0.03] border border-charcoal/5 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:bg-blue-500/5 group-hover:border-blue-500/20">
                  <Settings className="text-charcoal/40 group-hover:text-blue-500 transition-colors duration-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2 tracking-tight">Extensible API</h3>
                <p className="text-charcoal/60 text-[15px] max-w-md">Connect Cran to your existing tools. Automate workflows with Zapier, or build custom dashboard integrations with our developer-first REST API.</p>
              </div>
              
            </div>
          </div>
        </section>

        {/* ══════════════════ TECH INFRASTRUCTURE (LIGHT) ══════════════════ */}
        <section className="pb-24 pt-16 relative bg-[#FAFAF8] border-t border-charcoal/5">
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-charcoal/40 mb-12">
              Built on enterprise-grade infrastructure
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
               <div className="text-[2rem] font-bold tracking-tight text-charcoal/30 hover:text-charcoal/60 transition-colors">▲ Vercel</div>
               <div className="text-[2.5rem] font-bold tracking-tighter text-charcoal/30 hover:text-charcoal/60 transition-colors">stripe</div>
               <div className="text-[2.25rem] font-bold tracking-wide text-charcoal/30 hover:text-charcoal/60 transition-colors">AWS</div>
               <div className="text-[1.75rem] font-semibold tracking-tight text-charcoal/30 hover:text-charcoal/60 transition-colors flex items-center gap-2"><Sparkles size={24} fill="currentColor"/> OpenAI</div>
            </div>
          </div>
        </section>

        {/* ══════════════════ NEWSLETTER / WAITLIST (LIGHT) ══════════════════ */}
        <section className="py-24 md:py-32 relative overflow-hidden bg-[#FAFAF8] border-t border-charcoal/5" id="waitlist">
          
          <div className="relative mx-auto max-w-2xl px-6 text-center z-10">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-cran/20 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-cran mb-6 shadow-sm">
              <Mail size={12} strokeWidth={1.5} /> Early Access
            </div>

            <h2 className="text-3xl md:text-[2.8rem] font-bold tracking-tight text-charcoal leading-tight mb-5">
              Ready to upgrade?
            </h2>
            <p className="text-base text-charcoal/60 font-medium mb-10 leading-relaxed max-w-lg mx-auto">
              Cran is currently in closed beta for select shelters. Join the waitlist and get priority access, onboarding, and founding member pricing.
            </p>
            
            {/* Email signup */}
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                disabled={status === "loading" || status === "success"}
                placeholder="you@shelter.org"
                className="flex-1 w-full h-14 rounded-xl border border-charcoal/10 bg-white px-5 text-[15px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-cran/50 focus:ring-2 focus:ring-cran/20 shadow-sm transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full sm:w-auto h-14 rounded-xl px-8 text-[15px] font-bold text-white transition-all shadow-lg shrink-0 disabled:opacity-90 disabled:cursor-not-allowed ${
                  status === "success" 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                    : "bg-cran hover:bg-cran-hover shadow-cran/20 hover:shadow-cran/40 hover:-translate-y-0.5"
                }`}
              >
                {status === "loading" ? "Joining..." : status === "success" ? "You're on the list!" : "Join Waitlist"}
              </button>
            </form>

            {status === "error" && (
              <div className="text-cran text-sm font-medium mb-8 max-w-md mx-auto text-center">
                {errorMessage}
              </div>
            )}


            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 text-[13px] text-charcoal/50 font-medium">
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-cran" /> Priority access</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-cran" /> Founding pricing</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-cran" /> Dedicated onboarding</span>
            </div>
            
            <p className="mt-10 text-[14px] text-charcoal/40 font-medium">
              Or email <a href="mailto:support@cran.ai" className="text-charcoal/60 underline underline-offset-4 hover:text-charcoal transition-colors">support@cran.ai</a>
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
