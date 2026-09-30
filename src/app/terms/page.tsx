"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans px-4 sm:px-6 lg:px-8 py-16 sm:py-20 selection:bg-black/[0.08] selection:text-black relative">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#555555] hover:text-[#111111] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="border-b border-black/[0.06] pb-8 mb-8">
          <div className="tag-badge mb-4">
            <FileText className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Early Supporter Agreement</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal text-[#111111] tracking-[-0.02em] leading-tight">
            Terms of Service
          </h1>
          <p className="text-[#71717A] text-xs mt-3">
            Last revised: September 2026 • Effective immediately
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-[15px] leading-relaxed text-[#374151]">
          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#555555]">
              By accessing tactile.lakshitsoni.in, submitting your email to the waitlist, or downloading preview binaries of the Tactile host or companion applications, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              2. Beta Software License
            </h2>
            <p className="text-[#555555]">
              During the private beta phase, Tactile grants you a personal, non-exclusive, revocable license to evaluate the software on your personal devices. Beta builds are provided &ldquo;as is&rdquo; without warranty of uninterrupted operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              3. Lifetime License & Refund Guarantee
            </h2>
            <p className="text-[#555555]">
              Supporter lifetime licenses include all future minor and major updates for up to 2 Macs. We offer a 14-day, no-questions-asked refund policy for all license purchases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              4. Contact
            </h2>
            <p className="text-[#555555]">
              For inquiries regarding licensing or terms, please reach out to Lakshit at <a href="mailto:support@tactile.lakshitsoni.in" className="text-[#111111] underline">support@tactile.lakshitsoni.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
