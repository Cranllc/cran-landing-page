import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      <main id="main-content" className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans selection:bg-cran selection:text-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <nav className="mb-8 text-sm text-[#26251E]/60">
            <Link href="/" className="hover:text-[#26251E] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#26251E]/60">Legal</span>
          </nav>
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
