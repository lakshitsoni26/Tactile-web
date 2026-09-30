"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock, Sparkles, Zap, Laptop, Shield, MessageSquare } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import FeatureRequestModal from "@/components/FeatureRequestModal";
import Footer from "@/components/Footer";
import { getStoredWaitlistUser, type WaitlistEntry } from "@/lib/waitlistStore";

interface RoadmapItem {
  version: string;
  status: "shipped" | "in-progress" | "planned";
  title: string;
  description: string;
  tags: string[];
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  // Shipped
  {
    version: "v0.9.2",
    status: "shipped",
    title: "Native Model Context Protocol (MCP) Server",
    description: "Physical touch verification and live terminal execution streaming for Claude Code, Cursor, and Windsurf.",
    tags: ["MCP", "AI Agents", "Hardware Approval"],
  },
  {
    version: "v0.9.0",
    status: "shipped",
    title: "Apple Silicon Hardware HEVC 120 FPS Engine",
    description: "Sub-15ms glass-to-glass pipeline using VTCompressionSession on macOS and zero-copy SurfaceTexture on mobile.",
    tags: ["Metal", "HEVC", "120 FPS"],
  },
  {
    version: "v0.8.5",
    status: "shipped",
    title: "Dynamic Contextual Touch Bar Profiles",
    description: "Active frontmost app detection for VS Code, Figma, Terminal, and Finder with sub-0.5% battery/hr draw.",
    tags: ["Touch Bar", "App Profiles", "Zero Latency"],
  },
  {
    version: "v0.8.0",
    status: "shipped",
    title: "100% Local Encrypted P2P Transport",
    description: "Zero cloud servers and zero relays. Secure AES-256-GCM transport over local Wi-Fi and direct USB-C.",
    tags: ["Local-First", "P2P", "Privacy"],
  },

  // In Active Development
  {
    version: "v0.9.5",
    status: "in-progress",
    title: "1000Hz HID Precision Trackpad with Liquid Inertia",
    description: "Sub-millimeter tap-to-click, 2-finger right-click, and axis-locked vertical momentum scrolling.",
    tags: ["HID", "Trackpad", "Haptics"],
  },
  {
    version: "v0.9.6",
    status: "in-progress",
    title: "Clamshell Virtual Display Keepalive",
    description: "Keep MacBook lid completely closed while maintaining full 2940x1912 streaming and GPU VSync active.",
    tags: ["Clamshell", "Virtual Display", "macOS"],
  },
  {
    version: "v0.9.7",
    status: "in-progress",
    title: "Hardware CoreAudio Driver Mic Killswitch",
    description: "One-tap physical hardware mute directly at the kernel driver layer with zero possibility of software eavesdropping.",
    tags: ["CoreAudio", "Privacy", "Meeting Master"],
  },
  {
    version: "v0.9.8",
    status: "in-progress",
    title: "Echo-Suppressed 2-Way Clipboard Ring Buffer",
    description: "Instant bidirectional clipboard bridge with content-hash deduplication to prevent ping-pong feedback loops.",
    tags: ["Clipboard", "Ring Buffer", "Sync"],
  },

  // Planned
  {
    version: "v1.0.0",
    status: "planned",
    title: "Multi-Device Companion Cluster",
    description: "Connect multiple devices simultaneously — use your iPhone as a Touch Bar and an iPad as an auxiliary display at the same time.",
    tags: ["Multi-Screen", "Cluster", "Daisy Chain"],
  },
  {
    version: "v1.1.0",
    status: "planned",
    title: "Open Tactile Widget Plugin SDK",
    description: "Build custom macro surfaces and companion widgets in TypeScript and SwiftUI with full hot-reloading.",
    tags: ["Plugin SDK", "Extensibility", "Developer Tools"],
  },
  {
    version: "v1.2.0",
    status: "planned",
    title: "AirDrop-Style Zero-Setup Auto Discovery",
    description: "Instant peer discovery using Bluetooth Low Energy advertising with automatic fallback to high-speed Wi-Fi Direct.",
    tags: ["BLE", "Direct P2P", "Zero Config"],
  },
];

export default function RoadmapPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<WaitlistEntry | null>(() => getStoredWaitlistUser());

  const shipped = ROADMAP_ITEMS.filter((i) => i.status === "shipped");
  const inProgress = ROADMAP_ITEMS.filter((i) => i.status === "in-progress");
  const planned = ROADMAP_ITEMS.filter((i) => i.status === "planned");

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
            <span className="text-xs font-medium text-[#71717A]">Roadmap</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Public Engineering Roadmap</span>
          </div>

          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.05] mb-4">
            The future of physical computing. <br className="hidden sm:inline" />
            <span className="italic font-serif">Open and transparent.</span>
          </h1>

          <p className="text-[16px] text-[#555555] max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-inter)]">
            Explore what we have shipped, what we are actively coding in native Swift and Rust, and what is coming next for Tactile.
          </p>
        </div>

        {/* 3-Column Kanban-style Roadmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          
          {/* Column 1: Shipped */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <h2 className="font-semibold text-sm text-[#111111]">Shipped &amp; Live</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                {shipped.length} Releases
              </span>
            </div>

            <div className="space-y-3">
              {shipped.map((item) => (
                <div
                  key={item.version + item.title}
                  className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#D97706]">
                      {item.version}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="font-medium text-[13.5px] text-[#111111] mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[#F4F4F6] text-[#555555] border border-black/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Active Development */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <h2 className="font-semibold text-sm text-[#111111]">In Development</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                Next Wave
              </span>
            </div>

            <div className="space-y-3">
              {inProgress.map((item) => (
                <div
                  key={item.version + item.title}
                  className="p-4 rounded-2xl bg-white border border-amber-500/25 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#D97706]">
                      {item.version}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                  </div>
                  <h3 className="font-medium text-[13.5px] text-[#111111] mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Planned */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#71717A]" />
                <h2 className="font-semibold text-sm text-[#111111]">Planned Horizon</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/[0.04] text-[#71717A] border border-black/[0.06] font-medium">
                Up Next
              </span>
            </div>

            <div className="space-y-3">
              {planned.map((item) => (
                <div
                  key={item.version + item.title}
                  className="p-4 rounded-2xl bg-white/70 border border-black/[0.06] shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#71717A]">
                      {item.version}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  </div>
                  <h3 className="font-medium text-[13.5px] text-[#111111] mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#666666] leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[#F4F4F6] text-[#71717A] border border-black/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Feature Suggestion Card */}
        <div className="p-8 rounded-3xl bg-white border border-black/[0.08] shadow-xs text-center max-w-2xl mx-auto mb-20">
          <div className="w-10 h-10 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center text-[#D97706] mx-auto mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-[#111111] mb-2">
            Have a workflow you’d love to see in Tactile?
          </h3>
          <p className="text-xs text-[#666666] leading-relaxed max-w-md mx-auto mb-5">
            We prioritize features based directly on developer feedback. Tell us what application macro decks or hardware controls would elevate your Mac flow.
          </p>
          <button
            onClick={() => setFeatureModalOpen(true)}
            className="btn-secondary-pill !px-5 !py-2 !text-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Request a Feature / Vote</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* 1-Button Final CTA */}
        <div className="text-center py-12 px-6 rounded-3xl bg-white border border-black/[0.08] shadow-sm max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl font-normal text-[#111111] mb-3">
            Join the journey.
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

      <FeatureRequestModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
      />
    </div>
  );
}
