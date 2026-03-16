"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
      <nav aria-label="Main navigation" className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 [contain:paint] ${isScrolled ? 'border-b border-charcoal/5 bg-white/95 shadow-sm' : 'border-b border-white/[0.06] bg-[#0F0F10]/95'}`} style={{ transform: 'translateZ(0)' }}>
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center relative gap-2">
              <Image 
                src="/cran-logo.png" 
                alt="Cran Logo"
                width={40}
                height={40}
                className={`block transition-[opacity,filter] duration-300 ${isScrolled ? 'brightness-0 opacity-80' : 'brightness-0 invert opacity-100'}`}
                priority
              />
              <span className={`text-[15px] font-bold transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'}`} style={{ letterSpacing: '0.25em', marginRight: '-0.25em' }}>CRAN</span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/#learn-more" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled ? 'text-charcoal/65 hover:text-charcoal hover:bg-charcoal/5 focus:ring-offset-white' : 'text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]'}`}>Features</Link>
              <Link href="/#faq" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled ? 'text-charcoal/65 hover:text-charcoal hover:bg-charcoal/5 focus:ring-offset-white' : 'text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]'}`}>FAQ</Link>
              <Link href="/blog" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-1 ${isScrolled ? 'text-charcoal/65 hover:text-charcoal hover:bg-charcoal/5 focus:ring-offset-white' : 'text-white/75 hover:text-white hover:bg-white/[0.06] focus:ring-offset-[#0F0F10]'}`}>Blog</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/#waitlist" className={`inline-flex h-8 items-center justify-center rounded-md bg-cran px-3.5 text-[13px] font-medium text-white transition-all hover:bg-cran/90 focus:outline-none focus:ring-2 focus:ring-cran focus:ring-offset-2 ${isScrolled ? 'shadow-sm focus:ring-offset-white' : 'shadow-lg shadow-cran/20 focus:ring-offset-[#0F0F10]'}`}>
              Join Waitlist
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-md md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-offset-2 focus:ring-offset-transparent ${isScrolled ? 'text-charcoal/60 hover:bg-charcoal/5' : 'text-white/60 hover:bg-white/[0.06]'}`}
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
        <div id="mobile-menu" role="navigation" aria-label="Mobile menu" className={`fixed inset-x-0 top-16 z-40 border-b md:hidden ${isScrolled ? 'border-charcoal/10 bg-white shadow-lg' : 'border-white/10 bg-[#0F0F10]'}`}>
          <div className="mx-auto max-w-6xl flex flex-col px-6 py-4 gap-1">
            <Link href="/#learn-more" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>Features</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>FAQ</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cran/50 focus:ring-inset ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>Blog</Link>
            <div className={`my-2 h-px w-full ${isScrolled ? 'bg-charcoal/5' : 'bg-white/[0.06]'}`}></div>
            <div className="pt-2 pb-1">
              <Link href="/#waitlist" onClick={() => setMobileMenuOpen(false)} className={`block w-full inline-flex h-10 items-center justify-center rounded-lg bg-cran text-[14px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-cran focus:ring-offset-2 focus:ring-inset ${isScrolled ? 'shadow-sm focus:ring-offset-white' : 'focus:ring-offset-[#0F0F10]'}`}>Join Waitlist</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
