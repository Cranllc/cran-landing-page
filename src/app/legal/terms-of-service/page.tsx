import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cran | Terms of Service",
  description: "Terms of service for using Cran's website and AI-powered shelter management platform.",
  alternates: { canonical: `${SITE_URL}/legal/terms-of-service` },
};

const LAST_UPDATED = "March 15, 2025";

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-[#26251E] mb-2">Terms of Service</h1>
      <p className="text-[#26251E]/60 mb-12">Last updated: {LAST_UPDATED}</p>

      <p className="text-[#26251E]/80 leading-relaxed mb-6">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the websites, products, and services operated by Cran, LLC (&quot;Cran,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including getcran.ai and our AI-powered shelter management platform. By accessing or using our services, you agree to be bound by these Terms.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">1. Acceptance of Terms</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          By accessing our website, signing up for our waitlist, creating an account, or using any Cran products or services, you agree to these Terms and our Privacy Policy. If you do not agree, do not use our services. If you are using our services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">2. Description of Services</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          Cran provides an AI-powered shelter management platform designed for animal shelters and rescues. Our services include, but are not limited to, camera intake with breed detection, medical records, kennel management, task automation, foster management, and related tools. We may modify, suspend, or discontinue any part of our services at any time with or without notice.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">3. Accounts and Eligibility</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          You must be at least 18 years old and capable of forming a binding contract to use our services. When you create an account, you agree to provide accurate and complete information and to keep your credentials secure. You are responsible for all activity under your account.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">4. Acceptable Use</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#26251E]/80">
          <li>Use our services for any illegal purpose or in violation of applicable laws</li>
          <li>Upload, transmit, or process data that infringes on intellectual property, privacy, or other rights of third parties</li>
          <li>Attempt to gain unauthorized access to our systems, accounts, or other users&apos; data</li>
          <li>Interfere with or disrupt the integrity or performance of our services</li>
          <li>Use our services to harm animals or facilitate animal cruelty</li>
          <li>Resell, sublicense, or redistribute our services without our written consent</li>
        </ul>
        <p className="text-[#26251E]/80 leading-relaxed mt-4">
          We may suspend or terminate your access if we determine you have violated these Terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">5. Intellectual Property</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          Cran retains all rights, title, and interest in and to our services, including our software, trademarks, logos, and content. You do not acquire any ownership rights by using our services. You may not copy, modify, distribute, or create derivative works of our materials without our express written permission.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">6. Your Data</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          You retain ownership of the data you input into our platform. You grant us a limited license to use, store, and process your data solely to provide and improve our services, in accordance with our Privacy Policy. We will not use your data to train AI models for purposes unrelated to your use of our services without your consent.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">7. Disclaimers</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          OUR SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. AI-FACILITATED FEATURES (SUCH AS BREED DETECTION OR HEALTH TRIAGE) ARE PROVIDED FOR ASSISTANCE AND MAY NOT BE 100% ACCURATE.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">8. Limitation of Liability</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, CRAN AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED U.S. DOLLARS ($100), WHICHEVER IS GREATER.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">9. Indemnification</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          You agree to indemnify and hold harmless Cran and its officers, directors, employees, and affiliates from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&apos; fees) arising from your use of our services, your violation of these Terms, or your violation of any third-party rights.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">10. Governing Law</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Delaware.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">11. Changes</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated Terms. If you do not agree, you must stop using our services.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#26251E] mb-4">12. Contact</h2>
        <p className="text-[#26251E]/80 leading-relaxed mb-4">
          For questions about these Terms of Service, please contact us at:
        </p>
        <p className="text-[#26251E]/80">
          <strong>Cran, LLC</strong>
          <br />
          Email: <a href="mailto:legal@getcran.ai" className="text-cran hover:underline">legal@getcran.ai</a>
        </p>
      </section>
    </article>
  );
}
