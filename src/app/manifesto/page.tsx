"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import LakshitSignature from "@/components/LakshitSignature";
import WaitlistModal from "@/components/WaitlistModal";
import WaitlistForm from "@/components/WaitlistForm";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

export default function ManifestoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<WaitlistEntry | null>(() => getStoredWaitlistUser());

  const handleSuccess = (entry: WaitlistEntry) => {
    setCurrentUser(entry);
    setModalOpen(true);
  };

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
            <span className="text-xs font-medium text-[#71717A]">Manifesto</span>
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
              <span>Get Access</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Document */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-28">
        {/* Document Header */}
        <div className="mb-12">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Founding Philosophy</span>
          </div>

          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-5">
            The Tactile Manifesto.
          </h1>

          <div className="flex items-center gap-3 text-xs text-[#71717A] border-b border-black/[0.06] pb-6">
            <span>By Lakshit</span>
            <span>•</span>
            <span>Founder & Design Engineer</span>
            <span>•</span>
            <span>September 2026</span>
          </div>
        </div>

        {/* Manifesto Content */}
        <article className="prose prose-zinc max-w-none text-[16px] sm:text-[17px] text-[#374151] leading-[1.8] font-[family-name:var(--font-inter)] space-y-6">
          <p className="text-[19px] text-[#111111] leading-relaxed font-normal">
            We spend our entire working lives at a desk, yet the physical interface between human thought and digital machine has remained fundamentally frozen for thirty years.
          </p>

          <p>
            A glass screen. A plastic QWERTY slab. A piece of glass you drag a finger across. We have increased compute density by ten thousand times, yet we still interact with code, canvas, and systems through an input aperture designed when computing was textual.
          </p>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            I. The Tyranny of the Cluttered Desktop
          </h2>
          <p>
            You have three IDE windows, fourteen browser tabs, a terminal running test watchers, a Figma file, and Slack. Every time you switch tasks to inspect a Git diff or trigger a debugger step, your focus fractures. You command-tab. You lose your place.
          </p>
          <p>
            Secondary monitors don&apos;t fix this—they just give you more room to hoard clutter. What engineers need is not more pixels in their peripheral vision. They need <em>dedicated, glanceable, tactile control surfaces</em> that stay glued to their immediate context.
          </p>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            II. Contextual Input is the Future
          </h2>
          <p>
            When you hold a camera, the shutter button is where your index finger naturally falls. When you drive, the accelerator is under your right foot. You don&apos;t navigate a menu to brake.
          </p>
          <p>
            Software should be identical. When you are writing code in VS Code, your phone should show test execution buttons and Git branch state. When you switch to Figma, it should present layer alignments and typography scales. Input should shape-shift to match the task at hand.
          </p>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            III. Local-First Sovereignty
          </h2>
          <p>
            Modern software has lost its mind. Simple desktop utilities now require cloud user accounts, mandatory telemetry, and monthly subscriptions.
          </p>
          <p>
            Tactile rejects this model entirely. When you connect your phone to your Mac with Tactile, zero bytes leave your desk. No servers. No analytics tracking your keystrokes. No internet connection required. Your computer is yours.
          </p>

          <div className="pt-10 border-t border-black/[0.08] mt-12 space-y-4">
            <p className="text-[16px] text-[#555555]">
              Let’s reclaim the machine.
            </p>

            <div className="py-2">
              <LakshitSignature width={160} height={52} color="#111111" />
            </div>

            <div>
              <div className="font-semibold text-[#111111] text-[15px]">Lakshit</div>
              <div className="text-xs text-[#71717A]">Founder, Tactile Technologies</div>
            </div>
          </div>
        </article>

        {/* Embedded Waitlist Form */}
        <div className="mt-16 pt-10 border-t border-black/[0.08]">
          <div className="text-center mb-6">
            <h3 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] mb-2">
              Join the Private Beta
            </h3>
            <p className="text-xs text-[#666666]">
              Claim your early supporter pass and test Tactile on your Mac and phone today.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <WaitlistForm onSuccess={handleSuccess} />
          </div>
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
