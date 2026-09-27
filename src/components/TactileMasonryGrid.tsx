"use client";

import React, { useState } from "react";
import {
  Code,
  Palette,
  Terminal,
  Cpu,
  Music,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  GitCommit,
  Layers,
} from "lucide-react";

export default function TactileMasonryGrid() {
  const [activeTab, setActiveTab] = useState<"all" | "code" | "design" | "ai">("all");

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="gallery">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="tag-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>The Tactile Garden</span>
        </div>
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08] mb-3">
          A visual canvas for your <span className="italic font-serif">daily workflows.</span>
        </h2>
        <p className="text-[16px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)]">
          Everything you interact with on your companion phone is modular, tactile, and crafted with obsessively low latency.
        </p>

        {/* Filter Tabs matching Resurf style */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#F4F4F5] rounded-full border border-black/[0.06] mt-8">
          {[
            { id: "all", label: "All Decks" },
            { id: "code", label: "Coding & Git" },
            { id: "design", label: "Figma & Design" },
            { id: "ai", label: "AI Agent (MCP)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-[#111111] shadow-2xs"
                  : "text-[#71717A] hover:text-[#111111]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Columns Layout (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {/* COLUMN 1 */}
        <div className="flex flex-col gap-5">
          {/* Card A: VS Code Debugger & Git Card */}
          {(activeTab === "all" || activeTab === "code") && (
            <div className="resurf-card p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7]">
                    <Code className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">VS Code Debugger</span>
                </div>
                <span className="text-[10px] font-mono bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-full font-medium">
                  Live Sync
                </span>
              </div>

              {/* Mock interactive debugger buttons */}
              <div className="bg-[#F8F8FA] rounded-xl p-3 border border-black/[0.04] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Thread: main (line 142)</span>
                  <span className="text-[#15803D]">● Paused</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button className="p-2 rounded-lg bg-white border border-black/[0.06] text-xs font-mono font-medium text-[#111111] hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                    <Play className="w-3 h-3" />
                  </button>
                  <button className="p-2 rounded-lg bg-white border border-black/[0.06] text-xs font-mono font-medium text-[#111111] hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                    F10
                  </button>
                  <button className="p-2 rounded-lg bg-white border border-black/[0.06] text-xs font-mono font-medium text-[#111111] hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                    F11
                  </button>
                  <button className="p-2 rounded-lg bg-white border border-black/[0.06] text-xs font-mono font-medium text-[#111111] hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Git commit button */}
              <button className="w-full py-2 px-3 rounded-lg bg-[#111111] text-white text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#27272A] transition-colors cursor-pointer">
                <GitCommit className="w-3.5 h-3.5" />
                <span>Quick Commit (⌘↵)</span>
              </button>
            </div>
          )}

          {/* Card B: Color Swatch & Design Tokens */}
          {(activeTab === "all" || activeTab === "design") && (
            <div className="resurf-card p-5 bg-white space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">Design Swatches</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">Figma</span>
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { hex: "#FAFAFA", label: "Paper" },
                  { hex: "#F4F4F5", label: "Surface" },
                  { hex: "#D97706", label: "Amber" },
                  { hex: "#15803D", label: "Forest" },
                  { hex: "#111111", label: "Ink" },
                ].map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-lg border border-black/[0.08] shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[9.5px] font-mono text-[#71717A]">{color.label}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8F8FA] border border-black/[0.04] flex items-center justify-between text-xs font-mono text-[#52525B]">
                <span>activeColor: #D97706</span>
                <button className="text-[10.5px] text-[#D97706] font-medium hover:underline cursor-pointer">
                  Copy Token
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-5">
          {/* Card C: Model Context Protocol (MCP) AI Stream */}
          {(activeTab === "all" || activeTab === "ai") && (
            <div className="resurf-card p-5 bg-white space-y-3.5 border-2 border-black/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">Claude Code / Cursor MCP</span>
                </div>
                <span className="text-[10px] font-mono text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full font-medium">
                  Listening
                </span>
              </div>

              {/* Agent execution preview */}
              <div className="p-3.5 rounded-xl bg-[#F8F8FA] border border-black/[0.05] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#71717A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                  <span>claude-3-7-sonnet</span>
                </div>
                <div className="text-[#111111]">
                  $ npx prisma migrate deploy
                </div>
                <div className="text-[11px] text-[#71717A]">
                  Waiting for hardware approval on phone...
                </div>
              </div>

              {/* One-tap hardware approval button */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="py-2 rounded-lg bg-[#15803D] text-white text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#166534] transition-colors cursor-pointer">
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve (Tap)</span>
                </button>
                <button className="py-2 rounded-lg bg-[#F4F4F5] text-[#71717A] text-xs font-medium hover:bg-[#E4E4E7] transition-colors cursor-pointer">
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Card D: Terminal Watcher */}
          {(activeTab === "all" || activeTab === "code") && (
            <div className="resurf-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">Vite / Next.js Watcher</span>
                </div>
                <span className="text-[10px] font-mono text-[#15803D]">0 errors</span>
              </div>

              <div className="p-3 rounded-xl bg-[#18181B] text-white font-mono text-[11px] space-y-1 overflow-hidden">
                <div className="text-[#4ADE80]">✓ Compiled in 428ms</div>
                <div className="text-[#A1A1AA]">✓ 16/16 routes pre-rendered</div>
                <div className="text-zinc-400">ready on http://localhost:3000</div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#71717A] pt-1">
                <span>Auto-refresh enabled</span>
                <span className="font-mono">port: 3000</span>
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-5">
          {/* Card E: Precision Figma Layer Inspector */}
          {(activeTab === "all" || activeTab === "design") && (
            <div className="resurf-card p-5 bg-white space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#EA580C]/10 flex items-center justify-center text-[#EA580C]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">Figma Auto-Layout Deck</span>
                </div>
                <span className="text-[10px] font-mono text-[#71717A]">Auto-detected</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["Direction: Horizontal", "Spacing: 16px", "Padding: 24px"].map((prop, i) => (
                  <div key={i} className="p-2 rounded-lg bg-[#F8F8FA] border border-black/[0.04] text-center">
                    <div className="text-[11px] font-mono text-[#111111] font-medium">{prop.split(":")[1]}</div>
                    <div className="text-[9px] text-[#71717A] uppercase">{prop.split(":")[0]}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="py-2 rounded-lg bg-[#F4F4F5] text-xs font-mono text-[#111111] font-medium hover:bg-black hover:text-white transition-colors cursor-pointer text-center">
                  Wrap (⇧A)
                </button>
                <button className="py-2 rounded-lg bg-[#F4F4F5] text-xs font-mono text-[#111111] font-medium hover:bg-black hover:text-white transition-colors cursor-pointer text-center">
                  Fill Width
                </button>
              </div>
            </div>
          )}

          {/* Card F: System Monitors & Audio Deck */}
          {(activeTab === "all" || activeTab === "code") && (
            <div className="resurf-card p-5 bg-white space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#111111]">Mac Telemetry</span>
                </div>
                <span className="text-[10px] font-mono text-[#15803D]">Apple M4 Pro</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.04]">
                  <div className="text-[10px] text-[#71717A] uppercase font-mono">CPU Load</div>
                  <div className="text-[17px] font-semibold text-[#111111]">1.4%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.04]">
                  <div className="text-[10px] text-[#71717A] uppercase font-mono">Memory</div>
                  <div className="text-[17px] font-semibold text-[#111111]">34.2 GB</div>
                </div>
              </div>

              {/* Music mini-player */}
              <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#D97706]" />
                  <div className="text-left leading-tight">
                    <div className="text-[11.5px] font-medium text-[#111111]">Deep Work Session</div>
                    <div className="text-[9.5px] text-[#71717A]">Spotify</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white border border-black/[0.08] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors">
                  <Play className="w-2.5 h-2.5 ml-0.5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
