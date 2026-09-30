"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles, Check } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

interface Release {
  version: string;
  date: string;
  badge?: string;
  summary: string;
  highlights: string[];
}

const RELEASES: Release[] = [
  {
    version: "v0.9.2",
    date: "September 12, 2026",
    badge: "Latest",
    summary: "Native Model Context Protocol (MCP) server integration for AI coding assistants.",
    highlights: [
      "Added native MCP stdio/SSE server for Claude Code, Cursor, and Windsurf.",
      "Physical approval macros: AI agent terminal commands can now be approved with one tap on phone.",
      "Live agent stream notifications: compile status and test results stream directly to phone screen.",
      "Reduced CPU footprint to under 0.8% during active dual-screen mirroring.",
    ],
  },
  {
    version: "v0.9.0",
    date: "August 28, 2026",
    badge: "Major",
    summary: "Zero-configuration peer-to-peer pairing and dynamic Touch Bar profiles.",
    highlights: [
      "Instant peer-to-peer discovery over local Wi-Fi — zero pairing codes or router setup.",
      "Universal USB-C high-throughput connection mode with simultaneous device charging.",
      "Adaptive application profiles for VS Code, Cursor, Figma, and macOS Terminal.",
      "Instant 2-way clipboard bridge: copy on Mac, paste on phone with zero latency.",
    ],
  },
  {
    version: "v0.8.5",
    date: "August 10, 2026",
    summary: "Precision haptic trackpad canvas and custom multi-touch gesture engine.",
    highlights: [
      "120Hz smooth trackpad mode with physical haptic click feedback.",
      "Multi-touch gestures: two-finger scrolling, pinch-to-zoom in Figma and browser.",
      "Headless clamshell mode support: keep Mac active with laptop lid fully closed.",
      "Dark and light companion UI themes matching macOS system preferences.",
    ],
  },
];

export default function ChangelogPage() {
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
            <span className="text-xs font-medium text-[#71717A]">Changelog</span>
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

      {/* Main Changelog Timeline */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-28">
        {/* Header */}
        <div className="mb-14 text-center sm:text-left">
          <div className="tag-badge mb-4">
            <Sparkles className="w-3 h-3 text-[#D97706]" />
            <span>Product Updates</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-3">
            Changelog & <span className="italic font-serif">Release Notes.</span>
          </h1>
          <p className="text-[16px] text-[#666666]">
            Every refinement, feature release, and performance improvement to Tactile.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          {RELEASES.map((release, i) => (
            <div key={i} className="relative pl-6 sm:pl-8 border-l border-black/[0.08]">
              {/* Timeline marker */}
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#111111]" />

              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[18px] font-semibold text-[#111111]">
                  {release.version}
                </span>
                {release.badge && (
                  <span className="tag-badge-amber !text-[11px] !py-0.5 !px-2">
                    {release.badge}
                  </span>
                )}
                <span className="text-xs text-[#71717A] font-mono">
                  {release.date}
                </span>
              </div>

              <p className="text-[15px] text-[#333333] mb-4 font-medium">
                {release.summary}
              </p>

              <div className="resurf-card p-5 bg-white space-y-2.5">
                {release.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[14px] text-[#555555] leading-relaxed">
                    <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
