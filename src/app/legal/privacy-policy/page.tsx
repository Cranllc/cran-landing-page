import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Cran's privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: `${SITE_URL}/legal/privacy-policy` },
  openGraph: {
    title: "Privacy Policy",
    description: "Cran's privacy policy. Learn how we collect, use, and protect your personal information.",
    url: `${SITE_URL}/legal/privacy-policy`,
    siteName: "Cran",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy",
    description: "How Cran collects, uses, and protects your personal information.",
  },
};

const LAST_UPDATED = "March 15, 2025";

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-[#26251E] mb-2">Privacy Policy</h1>
      <p className="text-[#26251E]/60 mb-12">Last updated: {LAST_UPDATED}</p>

      <p className="text-[#26251E]/80 leading-relaxed mb-6">
        Cran, LLC (&quot;Cran,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates getcran.ai and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">1. Information We Collect</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We may collect information you provide directly, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#26251E]/80">
          <li><strong>Contact information:</strong> Name, email address, and organization when you sign up for our waitlist or contact us</li>
          <li><strong>Account information:</strong> Login credentials and profile details if you create an account</li>
          <li><strong>Communications:</strong> Messages you send to us via email or other channels</li>
        </ul>
        <p className="text-[#26251E]/80 leading-relaxed mt-4">
          We also automatically collect certain information when you visit our site, such as IP address, browser type, device information, and usage data (pages visited, time spent, referring URL) through cookies and similar technologies.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">2. How We Use Your Information</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2 text-[#26251E]/80">
          <li>Provide, maintain, and improve our services</li>
          <li>Process your waitlist signup and communicate with you about potential product access</li>
          <li>Send marketing communications (where you have opted in)</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Analyze usage and improve our website and product</li>
          <li>Comply with legal obligations and protect our rights</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">3. Cookies and Tracking</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We use cookies and similar technologies to enhance your experience. These may include session cookies, preference cookies, and analytics cookies (e.g., Google Analytics). You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">4. Information Sharing</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We do not sell your personal information. We may share information with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#26251E]/80">
          <li><strong>Service providers:</strong> Vendors who help us operate our business (hosting, analytics, email delivery) under confidentiality agreements</li>
          <li><strong>Legal compliance:</strong> When required by law, court order, or government request</li>
          <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">5. Data Security</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our platform uses encryption in transit (TLS) and at rest (AES-256) where applicable. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">6. Your Rights</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          Depending on your location, you may have the right to access, correct, delete, or port your personal information, or to restrict or object to certain processing. To exercise these rights, contact us at{" "}
          <a href="mailto:privacy@getcran.ai" className="text-cran hover:underline">privacy@getcran.ai</a>.
        </p>
        <p className="text-[#26251E]/80 leading-relaxed">
          If you are in the European Economic Area, you also have the right to lodge a complaint with your local data protection authority.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">7. Data Retention</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We retain your information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law. When you request deletion, we will remove or anonymize your data within a reasonable timeframe.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">8. Children&apos;s Privacy</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          Our services are not directed to individuals under 16. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us at{" "}
          <a href="mailto:privacy@getcran.ai" className="text-cran hover:underline">privacy@getcran.ai</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">9. Changes to This Policy</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">10. Contact Us</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          If you have questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="text-[#26251E]/80">
          <strong>Cran, LLC</strong>
          <br />
          Email: <a href="mailto:privacy@getcran.ai" className="text-cran hover:underline">privacy@getcran.ai</a>
        </p>
      </section>
    </article>
  );
}
