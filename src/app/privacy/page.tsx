"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, HardDrive } from "lucide-react";

export default function PrivacyPolicy() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Local-First Guarantee</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal text-[#111111] tracking-[-0.02em] leading-tight">
            Privacy Policy & Architecture
          </h1>
          <p className="text-[#71717A] text-xs mt-3">
            Last revised: September 2026 • Effective immediately
          </p>
        </div>

        {/* Local-First Callout Box */}
        <div className="resurf-card p-6 border border-black/[0.08] bg-white mb-10 space-y-2.5">
          <div className="flex items-center gap-2 text-[#111111] font-semibold text-base">
            <Lock className="w-4 h-4 text-[#15803D]" />
            <span>The Core Guarantee: Your Display Data Never Leaves Your Desk</span>
          </div>
          <p className="text-[#555555] text-sm leading-relaxed">
            Tactile is engineered from the ground up as a <strong>local-first system</strong>.
            When you stream an auxiliary screen, trigger Touch Bar macros, or sync your clipboard, all data travels
            exclusively between your devices over your physical USB-C cable or local Wi-Fi network.
            Zero frames, zero touch coordinates, and zero clipboard snippets are ever transmitted to cloud servers.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-[15px] leading-relaxed text-[#374151]">
          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#D97706]" />
              1. Information We Collect
            </h2>
            <p className="mb-2">
              We collect only the minimum data required to deliver early access invitations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555555]">
              <li><strong>Waitlist Email:</strong> Provided voluntarily by you to receive your early access ticket and release notifications.</li>
              <li><strong>Optional Survey Metadata:</strong> Optional fields such as primary development discipline and phone preference to prioritize native optimizations.</li>
              <li><strong>Anonymous Error Telemetry:</strong> Completely opt-in crash reports that never contain personal identifiers, screen captures, or code.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#D97706]" />
              2. Local Storage & On-Device Processing
            </h2>
            <p className="text-[#555555]">
              Macro configurations, custom shortcut palettes, and pairing credentials are saved locally in standard Application Support directories on macOS and local sandboxed storage on iOS/Android. You own your data in its entirety.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              3. Contact
            </h2>
            <p className="text-[#555555]">
              If you have any questions about this privacy architecture, please contact founder Lakshit directly at <a href="mailto:privacy@tactile.lakshitsoni.in" className="text-[#111111] underline">privacy@tactile.lakshitsoni.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
