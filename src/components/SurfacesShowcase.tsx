"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sliders,
  Tv,
  Bot,
  Command,
  Check,
  ChevronRight,
  Laptop,
  Smartphone,
  Copy,
  Zap,
} from "lucide-react";

type SurfaceId = "touchbar" | "trackpad" | "aux" | "agent";

interface SurfaceSpec {
  id: SurfaceId;
  label: string;
  tag: string;
  caption: string;
}

const SURFACES: SurfaceSpec[] = [
  {
    id: "touchbar",
    label: "Touch Bar",
    tag: "Context Deck",
    caption: "Frontmost app detection for VS Code, Figma, Terminal, and Xcode. 0% Video Mode operates at <0.5% battery/hr.",
  },
  {
    id: "trackpad",
    label: "Trackpad",
    tag: "1000Hz HID",
    caption: "Sub-millimeter liquid inertia with axis-locking, tap-to-click, and mechanical haptic click feedback.",
  },
  {
    id: "aux",
    label: "Aux Display",
    tag: "120 FPS Stream",
    caption: "Extended macOS monitor at native phone resolution with zero-copy GPU decoding.",
  },
  {
    id: "agent",
    label: "AI Agent Deck",
    tag: "MCP Verified",
    caption: "Physical touch verification for Claude Code, Cursor, and automated terminal bash execution.",
  },
];

export default function SurfacesShowcase() {
  const [activeSurface, setActiveSurface] = useState<SurfaceId>("touchbar");
  const selected = SURFACES.find((s) => s.id === activeSurface) || SURFACES[0];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="surfaces">
      {/* Section Header — Resurf 1:1 Editorial Layout */}
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[32px] sm:text-[38px] md:text-[44px] leading-[1.08] tracking-tight font-normal text-[#111111] mb-2">
          Four surfaces, one companion.
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
          A quick tour through Touch Bar, Trackpad, Auxiliary Display, and AI Agent Deck. The four surfaces you’ll actually spend your time in Tactile.
        </p>
      </div>

      {/* Resurf 1:1 Centered Tablist Pill */}
      <div className="flex justify-center mb-8 px-2 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Surface views"
          className="inline-flex items-center gap-1 rounded-full p-1 ring-[0.5px] ring-black/10 bg-[#EBEBEB] backdrop-blur-sm shadow-xs max-w-full overflow-x-auto whitespace-nowrap"
        >
          {SURFACES.map((surface) => {
            const isSelected = activeSurface === surface.id;
            return (
              <button
                key={surface.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveSurface(surface.id)}
                className={`relative px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected ? "text-[#111111]" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeSurfaceTab"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-[0.5px] ring-black/10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{surface.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resurf 1:1 Application Window Frame with Context Preview */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl ring-[0.5px] ring-black/10 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.03),0_16px_40px_rgba(0,0,0,0.05),0_40px_100px_rgba(0,0,0,0.07)] p-4 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-[0.5px] ring-inset ring-black/10 rounded-2xl"
        />

        {/* macOS Sequoia Titlebar Chrome */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-5 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs" />
            </div>
            <span className="text-xs font-mono text-[#888888] ml-2 truncate">
              Tactile Companion — {selected.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>4.18ms Direct P2P</span>
          </div>
        </div>

        {/* Dynamic Surface Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSurface}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-[260px] sm:min-h-[300px] flex flex-col justify-center"
          >
            {activeSurface === "touchbar" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">VS Code Macro</span>
                    <span className="text-[10px] font-mono text-[#D97706]">Rust 2024</span>
                  </div>
                  <p className="text-xs text-[#666666]">
                    Format document, toggle debugger breakpoint, and trigger cargo test with 1 physical tap.
                  </p>
                  <div className="pt-2 flex gap-1.5">
                    <span className="px-2 py-1 rounded bg-white border border-black/10 text-[10px] font-mono font-medium">
                      ⌘⇧P Format
                    </span>
                    <span className="px-2 py-1 rounded bg-[#111111] text-white text-[10px] font-mono font-medium">
                      Cargo Test
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">Figma Macro</span>
                    <span className="text-[10px] font-mono text-[#EA580C]">AutoLayout</span>
                  </div>
                  <p className="text-xs text-[#666666]">
                    Toggle parent frame constraints, distribute horizontal spacing, and export SVG tokens.
                  </p>
                  <div className="pt-2 flex gap-1.5">
                    <span className="px-2 py-1 rounded bg-white border border-black/10 text-[10px] font-mono font-medium">
                      Shift+A
                    </span>
                    <span className="px-2 py-1 rounded bg-white border border-black/10 text-[10px] font-mono font-medium">
                      Token Sync
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">Terminal Ops</span>
                    <span className="text-[10px] font-mono text-emerald-700">Zsh / Fish</span>
                  </div>
                  <p className="text-xs text-[#666666]">
                    Clear screen, git status overview, docker compose up, and clean process killswitch.
                  </p>
                  <div className="pt-2 flex gap-1.5">
                    <span className="px-2 py-1 rounded bg-white border border-black/10 text-[10px] font-mono font-medium">
                      git status
                    </span>
                    <span className="px-2 py-1 rounded bg-[#111111] text-white text-[10px] font-mono font-medium">
                      ⌘K Clear
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSurface === "trackpad" && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider">
                    High-Precision HID Ballistics
                  </span>
                  <h4 className="text-xl font-medium tracking-tight text-[#111111]">
                    Sub-millimeter inertia with zero acceleration jitter.
                  </h4>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Turns any iPhone or iPad into an auxiliary glass trackpad for your MacBook with 2-finger right click and locked vertical momentum.
                  </p>
                </div>
                <div className="w-full md:w-64 h-36 rounded-2xl bg-white border border-black/10 shadow-sm p-3 flex flex-col justify-between">
                  <div className="flex justify-between text-[9px] font-mono text-[#888888]">
                    <span>1000Hz HID</span>
                    <span className="text-emerald-700 font-bold">Relative Delta</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#D97706]/15 border border-[#D97706]/40 mx-auto flex items-center justify-center text-[9px] text-[#D97706] animate-pulse">
                    ●
                  </div>
                  <div className="text-[8px] font-mono text-center text-[#555555]">
                    Tap anywhere · Drag with inertia
                  </div>
                </div>
              </div>
            )}

            {activeSurface === "aux" && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    120 FPS Liquid Retina Stream
                  </span>
                  <h4 className="text-xl font-medium tracking-tight text-[#111111]">
                    Secondary OLED display without Sidecar limitations.
                  </h4>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Stream your Mac screen, debugger terminals, and Slack windows onto your phone with hardware-accelerated HEVC compression.
                  </p>
                </div>
                <div className="w-full md:w-64 h-36 rounded-2xl bg-white border border-black/10 shadow-sm p-3 flex flex-col justify-center items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-[#111111]" />
                    <span className="text-xs font-mono text-[#D97706]">⇄</span>
                    <Smartphone className="w-5 h-5 text-[#111111]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    2940x1912 @ 120 FPS
                  </span>
                </div>
              </div>
            )}

            {activeSurface === "agent" && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider">
                    Physical Touch Verification
                  </span>
                  <h4 className="text-xl font-medium tracking-tight text-[#111111]">
                    Approve Claude Code and Cursor actions on device.
                  </h4>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Model Context Protocol (MCP) server integration lets autonomous AI agents push step-by-step progress to your phone and await your physical tap.
                  </p>
                </div>
                <div className="w-full md:w-64 p-3 rounded-2xl bg-white border border-black/10 shadow-sm space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-[#888888]">
                    <span>Claude Code Agent</span>
                    <span className="text-amber-600 font-bold">Awaiting Approval</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#F4F4F6] text-[8px] font-mono text-[#111111]">
                    $ git push origin feat/companion
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <span className="px-2 py-1 rounded bg-[#111111] text-white text-[8px] font-mono font-medium cursor-pointer">
                      Approve (Tap)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Resurf 1:1 Caption Beneath Window */}
        <div className="mt-6 pt-4 border-t border-black/[0.06] flex justify-center">
          <p className="text-xs sm:text-sm text-[#71717A] text-center max-w-[640px] leading-relaxed">
            {selected.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
