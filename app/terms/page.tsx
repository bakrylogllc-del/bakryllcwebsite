import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions — Bakry LLC",
  description: "Terms and conditions for Bakry LLC services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#E6E2D6] text-[#111111]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <p className="mb-6 text-sm text-[#2A2A2A]/70">
          <Link href="/" className="text-[#55624A] hover:text-[#111111]">
            Home
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-[#2A2A2A]/60">Last updated: July 2026</p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#2A2A2A] sm:text-base">
          <p>
            By using Bakry LLC services — including web, mobile, SaaS, and automation
            work — you agree to these terms. Project scope, timelines, and fees are
            defined in the proposal or contract for each engagement.
          </p>
          <p>
            Deliverables remain subject to payment terms. Confidential information shared
            during a project stays confidential unless disclosure is required by law.
          </p>
          <p>
            These terms may be updated from time to time. Continued use of our services
            after changes means you accept the updated terms. For questions, contact{" "}
            <a href="mailto:hello@bakryllc.com" className="text-[#55624A] hover:text-[#111111]">
              hello@bakryllc.com
            </a>
            .
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
