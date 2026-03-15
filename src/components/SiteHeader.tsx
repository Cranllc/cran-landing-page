"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SiteHeader({ forceLightMode = false }: { forceLightMode?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(forceLightMode);

  useEffect(() => {
    if (forceLightMode) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceLightMode]);

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${isScrolled ? 'border-b border-charcoal/5 bg-white/90 backdrop-blur-xl shadow-sm' : 'border-b border-white/[0.06] bg-[#0F0F10]/80 backdrop-blur-md'}`}>
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center relative gap-2">
              <img 
                src="/cran-logo.png" 
                alt="Cran Logo"
                width={512}
                height={512}
                style={{ height: '40px', width: 'auto' }}
                className={`block transition-all duration-300 ${isScrolled ? 'brightness-0 opacity-80' : 'brightness-0 invert opacity-100'}`}
              />
              <span className={`text-[15px] font-bold transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'}`} style={{ letterSpacing: '0.25em', marginRight: '-0.25em' }}>CRAN</span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/#solutions" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors ${isScrolled ? 'text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'}`}>Platform</Link>
              <Link href="/blog" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors ${isScrolled ? 'text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'}`}>Blog</Link>
              <Link href="https://discord.gg/5zrEvfpCSw" className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors ${isScrolled ? 'text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'}`}>Support</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="mailto:support@gocran.ai" className={`inline-flex h-8 items-center justify-center rounded-md border bg-transparent px-3.5 text-[13px] font-medium transition-colors ${isScrolled ? 'border-charcoal/10 text-charcoal/70 hover:text-charcoal hover:border-charcoal/20' : 'border-white/10 text-white/70 hover:text-white hover:border-white/20'}`}>
              Contact
            </Link>
            <Link href="/#waitlist" className={`inline-flex h-8 items-center justify-center rounded-md bg-cran px-3.5 text-[13px] font-medium text-white transition-all hover:bg-cran/90 ${isScrolled ? 'shadow-sm' : 'shadow-lg shadow-cran/20'}`}>
              Join Waitlist
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-md md:hidden transition-colors ${isScrolled ? 'text-charcoal/60 hover:bg-charcoal/5' : 'text-white/60 hover:bg-white/[0.06]'}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-x-0 top-16 z-40 border-b backdrop-blur-xl md:hidden ${isScrolled ? 'border-charcoal/10 bg-white/95 shadow-lg' : 'border-white/10 bg-[#0F0F10]/95'}`}>
          <div className="mx-auto max-w-6xl flex flex-col px-6 py-4 gap-1">
            <Link href="/#solutions" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>Platform</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>Blog</Link>
            <Link href="https://discord.gg/5zrEvfpCSw" onClick={() => setMobileMenuOpen(false)} className={`text-[15px] font-medium py-2.5 px-3 rounded-md transition-colors flex items-center gap-2 ${isScrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-white hover:bg-white/[0.04]'}`}>
              <MessageSquare size={16} className="text-[#5865F2]" /> Support
            </Link>
            <div className={`my-2 h-px w-full ${isScrolled ? 'bg-charcoal/5' : 'bg-white/[0.06]'}`}></div>
            <div className="flex gap-3 pt-2 pb-1">
              <Link href="mailto:support@gocran.ai" className={`flex-1 inline-flex h-10 items-center justify-center rounded-lg border text-[14px] font-medium transition-colors ${isScrolled ? 'border-charcoal/10 text-charcoal bg-white' : 'border-white/10 text-white'}`}>Contact</Link>
              <Link href="/#waitlist" onClick={() => setMobileMenuOpen(false)} className={`flex-1 inline-flex h-10 items-center justify-center rounded-lg bg-cran text-[14px] font-medium text-white ${isScrolled ? 'shadow-sm' : ''}`}>Join Waitlist</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
