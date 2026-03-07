import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="relative z-50 border-t border-charcoal/5 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 max-w-5xl mx-auto">
          
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/cran-logo.svg" 
                alt="Cran Logo" 
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 opacity-80"
              />
              <span className="text-[15px] font-bold text-charcoal" style={{ letterSpacing: '0.25em', marginRight: '-0.25em' }}>CRAN</span>
            </Link>
            <p className="text-[13px] text-charcoal/50 leading-relaxed max-w-[200px]">
              The operating system for modern animal shelters.
            </p>
          </div>
          
          <div>
            <h4 className="text-[13px] font-semibold text-charcoal mb-3">Product</h4>
            <ul className="space-y-2 text-[13px] text-charcoal/50">
              <li><Link href="/#solutions" className="hover:text-charcoal transition-colors">Platform</Link></li>
              <li><Link href="#" className="hover:text-charcoal transition-colors">Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[13px] font-semibold text-charcoal mb-3">Resources</h4>
            <ul className="space-y-2 text-[13px] text-charcoal/50">
              <li><Link href="/blog" className="hover:text-charcoal transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-charcoal transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[13px] font-semibold text-charcoal mb-3">Company</h4>
            <ul className="space-y-2 text-[13px] text-charcoal/50">
              <li><Link href="mailto:support@cran.ai" className="hover:text-charcoal transition-colors">Email</Link></li>
              <li><Link href="https://discord.gg/cran" className="hover:text-charcoal transition-colors">Discord</Link></li>
            </ul>
          </div>
        </div>

        {/* Watermark */}
        <div className="flex justify-center items-center w-full mb-8 select-none pointer-events-none overflow-hidden">
          <span className="text-[clamp(4rem,22vw,18rem)] font-bold leading-none text-charcoal/[0.08]" style={{ letterSpacing: '0.15em', marginRight: '-0.15em' }}>
            CRAN
          </span>
        </div>
        
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left border-t border-charcoal/[0.06] max-w-6xl mx-auto">
          <p className="text-[12px] text-charcoal/40">&copy; {new Date().getFullYear()} Cran, LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-charcoal/40">
            <Link href="/accessibility" className="hover:text-charcoal transition-colors">Accessibility</Link>
            <Link href="/legal/privacy-policy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms-of-service" className="hover:text-charcoal transition-colors">Terms of Service</Link>
            <button className="hover:text-charcoal transition-colors">Manage Cookies</button>
            <Link href="/sitemap.xml" className="hover:text-charcoal transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
