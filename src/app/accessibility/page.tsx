import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | Cran",
  description: "Cran's commitment to digital accessibility and how we work to make our website and platform accessible to everyone.",
  alternates: { canonical: `${SITE_URL}/accessibility` },
  openGraph: {
    title: "Accessibility | Cran",
    description: "Cran's commitment to digital accessibility and how we work to make our website and platform accessible to everyone.",
    url: `${SITE_URL}/accessibility`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Accessibility | Cran",
    description: "Cran's commitment to digital accessibility.",
  },
};

export default function AccessibilityPage() {
  return (
    <>
      <SiteHeader forceLightMode={true} />
      <main id="main-content" className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans selection:bg-cran selection:text-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#26251E]/60">
            <Link href="/" className="hover:text-[#26251E] transition-colors focus:outline-none focus:ring-2 focus:ring-cran/30 focus:ring-offset-1 rounded">Home</Link>
            <span className="mx-2" aria-hidden>/</span>
            <span className="text-[#26251E]/60" aria-current="page">Accessibility</span>
          </nav>

          <article className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-[#26251E] mb-12">Accessibility</h1>

            <p className="text-[#26251E]/80 leading-relaxed mb-6">
              Cran, LLC is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
            </p>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#26251E] mb-4">Our Goal</h2>
              <p className="text-[#26251E]/80 leading-relaxed mb-4">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines help make web content more accessible to people with a wide range of disabilities, including visual, auditory, motor, and cognitive.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#26251E] mb-4">What We Do</h2>
              <ul className="list-disc pl-6 space-y-2 text-[#26251E]/80">
                <li>Maintain semantic HTML and clear structure for screen readers</li>
                <li>Ensure sufficient color contrast and avoid relying on color alone</li>
                <li>Support keyboard navigation and focus indicators</li>
                <li>Provide alt text for meaningful images</li>
                <li>Design forms and interactive elements to be accessible</li>
                <li>Test with assistive technologies and address issues we find</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#26251E] mb-4">Feedback</h2>
              <p className="text-[#26251E]/80 leading-relaxed mb-4">
                We welcome your feedback. If you encounter accessibility barriers on our website or have suggestions for improvement, please contact us:
              </p>
              <p className="text-[#26251E]/80">
                Email: <a href="mailto:accessibility@getcran.ai" className="text-cran hover:underline">accessibility@getcran.ai</a>
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#26251E] mb-4">Last Updated</h2>
              <p className="text-[#26251E]/80">March 2025</p>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
