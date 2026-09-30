"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import LakshitSignature from "@/components/LakshitSignature";
import WaitlistModal from "@/components/WaitlistModal";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

export default function StoryPage() {
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
            <span className="text-xs font-medium text-[#71717A]">Story</span>
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

      {/* Main Essay Document */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-28">
        {/* Essay Header */}
        <div className="mb-12">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Founding Essay</span>
          </div>

          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-5">
            Why we built Tactile.
          </h1>

          <div className="flex items-center gap-3 text-xs text-[#71717A] border-b border-black/[0.06] pb-6">
            <span>By Lakshit</span>
            <span>•</span>
            <span>September 2026</span>
            <span>•</span>
            <span>4 min read</span>
          </div>
        </div>

        {/* Essay Content */}
        <article className="prose prose-zinc prose-neutral max-w-none text-[16px] sm:text-[17px] text-[#374151] leading-[1.8] font-[family-name:var(--font-inter)] space-y-6">
          <p className="text-[19px] text-[#111111] leading-relaxed font-normal">
            Every day, millions of engineers and designers sit in front of the most powerful personal computers ever engineered: Apple Silicon Macs. Yet right beside their keyboard lies another marvel of modern computing—an OLED touchscreen with a 120Hz refresh rate, dedicated neural processing, and multi-touch haptics.
          </p>

          <p>
            And what does that pocket computer do while you work? It sits dark on your desk, face up, buzzing with notifications that distract you from flow.
          </p>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            The Mistake of Killing the Touch Bar
          </h2>

          <p>
            When Apple removed the Touch Bar from the MacBook Pro in 2021, the community celebrated the return of physical function keys. But Apple threw out the baby with the bathwater.
          </p>

          <p>
            The fundamental insight of the Touch Bar was correct: <em>software is contextual, so input surfaces should be contextual too.</em> If you are editing in VS Code, you need Git branches and debugger steps. If you are designing in Figma, you need auto-layout alignments and color variables. When you switch applications, your desk controls should adapt with you.
          </p>

          <p>
            The Touch Bar didn&apos;t fail because contextual controls are bad. It failed because it replaced the physical Escape key, suffered from a cramped 60px strip aspect ratio, and lacked haptic feedback.
          </p>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            Reclaiming the Missing Half
          </h2>

          <p>
            Tactile turns the phone you already own into the ultimate companion device for your Mac. No $200 plastic macro pad with mushy buttons. No locked-in Apple Sidecar requiring a $500 iPad.
          </p>

          <p>
            Just place your iPhone, Pixel, or Galaxy phone next to your MacBook or Studio Display. In seconds, it establishes a direct peer-to-peer connection. It transforms into:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-[#374151]">
            <li><strong>A Contextual Macro Deck:</strong> Adapts automatically to VS Code, Cursor, Figma, and Terminal.</li>
            <li><strong>An Always-On Peripheral Monitor:</strong> Glance at build outputs, git status, and music controls without giving up screen real estate.</li>
            <li><strong>A Model Context Protocol (MCP) AI Bridge:</strong> Gives Claude Code and Cursor agents a physical desk presence with one-tap hardware approvals.</li>
            <li><strong>A Precision Haptic Trackpad:</strong> Smooth multi-touch scrolling and gestures powered by your phone&apos;s vibration engine.</li>
          </ul>

          <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#111111] pt-4 tracking-[-0.01em]">
            Calm, Local-First, and Private
          </h2>

          <p>
            We believe in calm software. We refuse to add subscriptions, cloud sync lock-ins, or telemetry trackers. Everything Tactile does happens directly between your two devices over local Wi-Fi or a USB cable. Zero bytes ever touch a cloud server.
          </p>

          <p>
            We are building Tactile for people who care deeply about their craft and want tools that feel as fast as thought.
          </p>

          {/* Sign-off & Lakshit's Vector Calligraphy Signature */}
          <div className="pt-10 border-t border-black/[0.08] mt-12 space-y-4">
            <p className="text-[16px] text-[#555555]">
              Warmly,
            </p>

            <div className="py-2">
              <LakshitSignature width={160} height={52} color="#111111" />
            </div>

            <div>
              <div className="font-semibold text-[#111111] text-[15px]">Lakshit</div>
              <div className="text-xs text-[#71717A]">Founder & Design Engineer, Tactile</div>
            </div>
          </div>
        </article>
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
