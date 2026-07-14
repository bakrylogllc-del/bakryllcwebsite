import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — Bakry LLC",
  description: "Privacy policy for Bakry LLC.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b1230] text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <p className="mb-6 text-sm text-white/50">
          <Link href="/" className="text-cyan hover:text-white">
            Home
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-white/45">Last updated: July 2026</p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/70 sm:text-base">
          <p>
            Bakry LLC collects only what we need to respond to inquiries and deliver
            projects — typically your name, email, and project details you choose to share.
          </p>
          <p>
            We do not sell personal information. Data is used to communicate, fulfill
            contracts, and improve our services. Access is limited to people who need it
            for those purposes.
          </p>
          <p>
            You can ask for access, correction, or deletion of your personal data by
            emailing{" "}
            <a href="mailto:hello@bakryllc.com" className="text-cyan hover:text-white">
              hello@bakryllc.com
            </a>
            . This policy may be updated as our practices evolve.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
