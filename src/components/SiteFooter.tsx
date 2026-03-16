"use client";

import Link from "next/link";
import Image from "next/image";
import { SHOW_COOKIE_PREFERENCES_EVENT } from "./CookieConsent";

export default function SiteFooter() {
  return (
    <footer className="relative z-50 border-t border-charcoal/5 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 mb-16 md:flex md:flex-nowrap md:justify-center md:gap-x-12">
          
          <div className="text-center md:text-left col-span-2 md:col-span-1 md:min-w-[180px]">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 md:justify-start justify-center">
              <Image 
                src="/cran-logo.png" 
                alt="Cran Logo" 
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 opacity-80"
                loading="lazy"
              />
              <span className="text-[15px] font-bold text-charcoal" style={{ letterSpacing: '0.25em', marginRight: '-0.25em' }}>CRAN</span>
            </Link>
            <p className="text-[13px] text-charcoal/65 leading-relaxed max-w-[200px] mx-auto md:mx-0">
              The operating system for modern animal shelters.
            </p>
          </div>
          
          <div className="text-center md:text-left md:min-w-[100px]">
            <h4 className="text-[13px] font-semibold text-charcoal mb-3">Resources</h4>
            <ul className="space-y-2 text-[13px] text-charcoal/65">
              <li><Link href="/blog" className="hover:text-charcoal transition-colors">Blog</Link></li>
              <li><Link href="/support" className="hover:text-charcoal transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left md:min-w-[100px]">
            <h4 className="text-[13px] font-semibold text-charcoal mb-3">Company</h4>
            <ul className="space-y-2 text-[13px] text-charcoal/65">
              <li><Link href="/support" className="hover:text-charcoal transition-colors">Contact</Link></li>
              <li><Link href="https://discord.gg/5zrEvfpCSw" className="hover:text-charcoal transition-colors">Discord</Link></li>
            </ul>
          </div>
        </div>

        {/* Watermark */}
        <div className="flex justify-center items-center w-full mb-8 select-none pointer-events-none min-h-[6rem]">
          <span className="text-[clamp(4rem,20vw,16rem)] font-bold leading-none text-charcoal/[0.08]" style={{ letterSpacing: '0.12em', marginRight: '-0.12em' }}>
            CRAN
          </span>
        </div>
        
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left border-t border-charcoal/[0.06]">
          <p className="text-[12px] text-charcoal/60">&copy; {new Date().getFullYear()} Cran, LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-charcoal/60">
            <Link href="/accessibility" className="hover:text-charcoal transition-colors">Accessibility</Link>
            <Link href="/legal/privacy-policy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms-of-service" className="hover:text-charcoal transition-colors">Terms of Service</Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent(SHOW_COOKIE_PREFERENCES_EVENT))}
              className="hover:text-charcoal transition-colors"
            >
              Manage Cookies
            </button>
            <Link href="/sitemap.xml" className="hover:text-charcoal transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
