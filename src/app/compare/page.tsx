"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, X, ShieldCheck, Zap, Smartphone } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import Footer from "@/components/Footer";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

export default function ComparePage() {
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
            <span className="text-xs font-medium text-[#71717A]">Compare</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary-pill !h-[32px] !px-3.5 !text-xs cursor-pointer flex items-center gap-1"
            >
              <span>Download</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Architecture Breakdown</span>
          </div>

          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-4">
            Why carry another screen? <br className="hidden sm:inline" />
            <span className="italic font-serif">You already own the best one.</span>
          </h1>

          <p className="text-[16px] text-[#555555] max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-inter)]">
            How Tactile compares directly against physical macro pads like Elgato Stream Deck, cloud-reliant VNC tools, and Apple Sidecar.
          </p>
        </div>

        {/* Embedded Comparison Matrix Table */}
        <div className="mb-20">
          <ComparisonMatrix />
        </div>

        {/* Deep Dive Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="p-6 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#D97706] mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-[#111111] mb-2">
              Sub-15ms Direct Hardware Pipeline
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Unlike traditional VNC or browser streaming tools that run through web sockets and remote relays, Tactile streams peer-to-peer over local USB-C or Wi-Fi with Apple Silicon HEVC hardware acceleration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#15803D] mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-[#111111] mb-2">
              Zero Cloud, Zero Logins
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Your screen frames and macro keystrokes never touch a cloud server. Everything stays 100% on your local desk with end-to-end encrypted transport. Works offline, on airplanes, and in air-gapped rooms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0969DA] mb-4">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-[#111111] mb-2">
              Universal iPhone &amp; Android Support
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Apple Sidecar requires a $499+ iPad and ties you into iCloud. Tactile works seamlessly with any iPhone or Android phone you already keep on your desk beside your Mac keyboard.
            </p>
          </div>
        </div>

        {/* 1-Button Final CTA */}
        <div className="text-center py-12 px-6 rounded-3xl bg-white border border-black/[0.08] shadow-sm max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl font-normal text-[#111111] mb-3">
            Experience your Mac’s missing companion.
          </h2>
          <p className="text-xs text-[#71717A] max-w-md mx-auto mb-6">
            Free to try · macOS Sequoia 14.3+ (Apple Silicon &amp; Intel) · iPhone &amp; Android
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center cursor-pointer justify-center gap-2 font-medium bg-[#111111] text-white hover:bg-[#262626] active:scale-[0.98] h-11 px-7 text-[15px] rounded-xl shadow-xs"
          >
            <span></span>
            <span>Download for Mac</span>
          </button>
        </div>
      </main>

      <Footer />

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={currentUser}
        onSuccess={(entry) => setCurrentUser(entry)}
      />
    </div>
  );
}
