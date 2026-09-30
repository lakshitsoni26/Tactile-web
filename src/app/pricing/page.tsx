"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

export default function PricingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<WaitlistEntry | null>(() => getStoredWaitlistUser());

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-black/[0.08] selection:text-black relative">
      {/* Floating Header Capsule */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4 pointer-events-none">
        <nav className="nav-shell pointer-events-auto flex items-center justify-between w-full max-w-3xl h-[50px] px-4 bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-sm">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-black transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span className="text-[14px] tracking-tight">Tactile</span>
            </Link>
            <span className="text-black/20 text-xs">/</span>
            <span className="text-xs font-medium text-[#71717A]">Pricing</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary-pill !h-[32px] !px-3.5 !text-xs cursor-pointer flex items-center gap-1"
            >
              <span>Join Waitlist</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Pricing Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-28">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Ethical Licensing</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-4">
            Simple, honest pricing. <br className="hidden sm:inline" />
            <span className="italic font-serif">Zero subscriptions.</span>
          </h1>
          <p className="text-[16px] text-[#666666] max-w-lg mx-auto">
            Pay once, own forever. Free companion mobile apps for iOS and Android.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Beta Tier */}
          <div className="resurf-card p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                  Community Beta
                </span>
                <span className="tag-badge !text-[11px]">Free</span>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-semibold text-[#111111] font-[family-name:var(--font-geist-sans)]">
                  $0
                </div>
                <div className="text-xs text-[#71717A] mt-1">
                  Free during our early access private beta
                </div>
              </div>

              <ul className="space-y-3 text-[14px] text-[#555555] mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Connect 1 Mac + 1 phone companion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Standard Touch Bar profiles (VS Code, Figma)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Local Wi-Fi & USB connection modes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Community Discord support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-secondary-pill w-full justify-center !py-3 !text-sm cursor-pointer"
            >
              Claim Beta Spot
            </button>
          </div>

          {/* Lifetime License */}
          <div className="resurf-card p-8 flex flex-col justify-between bg-[#FFFFFF] border-2 border-black/[0.15] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase rounded-bl-xl">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">
                  Supporter Lifetime
                </span>
                <span className="tag-badge-amber !text-[11px]">One-Time</span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-[#111111] font-[family-name:var(--font-geist-sans)]">
                    $39
                  </span>
                  <span className="text-xs text-[#71717A] line-through">$59</span>
                </div>
                <div className="text-xs text-[#71717A] mt-1">
                  Pay once. Own it forever. Up to 2 Macs.
                </div>
              </div>

              <ul className="space-y-3 text-[14px] text-[#555555] mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span className="text-[#111111] font-medium">All future software updates included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Model Context Protocol (MCP) AI bridge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Haptic trackpad mode & custom multi-touch gestures</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Direct email support from founder Lakshit</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary-pill w-full justify-center !py-3 !text-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Supporter Pass</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 text-center text-xs text-[#71717A] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span>14-day no-questions-asked refund policy • Powered by Polar.sh</span>
        </div>
      </main>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={currentUser}
        onSuccess={(entry) => setCurrentUser(entry)}
      />
    </div>
  );
}
