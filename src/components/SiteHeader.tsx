"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DEMO_URL, PILOT_CTA_LABEL, pilotCtaOpensInNewTab } from "@/lib/site-config";

export default function SiteHeader({ forceLightMode = false }: { forceLightMode?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(forceLightMode);

  useEffect(() => {
    if (forceLightMode) return;
    let rafId: number | undefined;
    let lastValue = false;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const v = window.scrollY > 50;
        if (v !== lastValue) {
          lastValue = v;
          setIsScrolled(v);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [forceLightMode]);

  return (
    <>
      <nav aria-label="Main navigation" className={`fixed inset-x-0 top-0 z-50 h-16 transition-[background-color,border-color,box-shadow] duration-300 [contain:paint] ${isScrolled ? "border-b border-charcoal/[0.07] bg-[#FAFAF8]/80 shadow-[0_1px_0_rgba(26,26,26,0.04)] backdrop-blur-xl" : forceLightMode ? "border-b border-transparent bg-[#FAFAF8]/70 backdrop-blur-xl" : "border-b border-white/[0.06] bg-[#0F0F10]/95"}`} style={{ transform: "translateZ(0)" }}>
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center relative gap-2">
              <Image 
                src="/cran-logo.png" 
                alt="Cran Logo"
                width={32}
                height={32}
                className={`block h-8 w-8 transition-[opacity,filter] duration-300 ${isScrolled || forceLightMode ? "brightness-0 opacity-80" : "brightness-0 invert opacity-100"}`}
                priority
              />
              <span className={`text-[14px] font-semibold tracking-[0.14em] transition-colors ${isScrolled || forceLightMode ? "text-charcoal" : "text-white"}`}>CRAN</span>
            </Link>
            <div className="hidden items-center gap-0.5 md:flex">
              <Link href="/#what-you-get" className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled || forceLightMode ? "text-charcoal/75 hover:text-charcoal hover:bg-charcoal/[0.04] focus:ring-offset-[#FAFAF8]" : "text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]"}`}>Features</Link>
              <Link href="/#faq" className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled || forceLightMode ? "text-charcoal/75 hover:text-charcoal hover:bg-charcoal/[0.04] focus:ring-offset-[#FAFAF8]" : "text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]"}`}>FAQ</Link>
              <Link href="/blog" className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled || forceLightMode ? "text-charcoal/75 hover:text-charcoal hover:bg-charcoal/[0.04] focus:ring-offset-[#FAFAF8]" : "text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]"}`}>Blog</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a
              href={DEMO_URL}
              className={`inline-flex h-9 items-center justify-center rounded-lg bg-cran px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-cran-hover focus:outline-none focus:ring-2 focus:ring-cran focus:ring-offset-2 ${isScrolled || forceLightMode ? "focus:ring-offset-[#FAFAF8]" : "focus:ring-offset-[#0F0F10]"}`}
              {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {PILOT_CTA_LABEL}
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-md md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-2 focus:ring-offset-transparent ${isScrolled || forceLightMode ? "text-charcoal/60 hover:bg-charcoal/5" : "text-white/60 hover:bg-white/[0.06]"}`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" role="navigation" aria-label="Mobile menu" className={`fixed inset-x-0 top-16 z-40 border-b md:hidden ${isScrolled || forceLightMode ? "border-charcoal/10 bg-[#FAFAF8] shadow-lg" : "border-white/10 bg-[#0F0F10]"}`}>
          <div className="mx-auto max-w-6xl flex flex-col px-6 py-4 gap-1">
            <Link href="/#what-you-get" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled || forceLightMode ? "text-charcoal hover:bg-charcoal/5" : "text-white hover:bg-white/[0.04]"}`}>Features</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled || forceLightMode ? "text-charcoal hover:bg-charcoal/5" : "text-white hover:bg-white/[0.04]"}`}>FAQ</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled || forceLightMode ? "text-charcoal hover:bg-charcoal/5" : "text-white hover:bg-white/[0.04]"}`}>Blog</Link>
            <div className={`my-2 h-px w-full ${isScrolled || forceLightMode ? "bg-charcoal/5" : "bg-white/[0.06]"}`}></div>
            <div className="pt-2 pb-1 flex flex-col gap-2">
              <a
                href={DEMO_URL}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full inline-flex h-10 items-center justify-center rounded-lg bg-cran text-[14px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-cran focus:ring-offset-2 focus:ring-inset ${isScrolled || forceLightMode ? "focus:ring-offset-[#FAFAF8]" : "focus:ring-offset-[#0F0F10]"}`}
                {...(pilotCtaOpensInNewTab() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {PILOT_CTA_LABEL}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
