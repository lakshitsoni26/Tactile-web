"use client";

import React from "react";
import {
  Tv, Sliders, Sparkles, Copy, Laptop, Mic,
  LayoutGrid, ShieldCheck, BatteryCharging, Disc, Compass, Bot
} from "lucide-react";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  optIn?: boolean;
  preview: React.ReactNode;
}

const FEATURES: FeatureCard[] = [
  {
    id: "streaming",
    title: "Display Stream",
    description: "Sub-15ms glass-to-glass pipeline with Apple Silicon HEVC encode.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1.5 rounded-lg bg-white border border-black/10 shadow-xs flex items-center justify-center text-[8.5px] font-mono text-[#111111] whitespace-nowrap">
            Mac 120 FPS
          </div>
          <span className="text-[#D97706] font-mono text-xs">➔</span>
          <div className="px-2.5 py-2 rounded-lg bg-white border border-black/10 shadow-xs flex items-center justify-center text-[8px] font-mono text-[#111111] whitespace-nowrap">
            OLED
          </div>
        </div>
        <span className="text-[9.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold whitespace-nowrap">
          &lt;14.4ms latency
        </span>
      </div>
    ),
  },
  {
    id: "trackpad",
    title: "Precision Trackpad",
    description: "Sub-millimeter liquid inertia with axis-locked vertical momentum.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center p-3">
        <div className="w-full max-w-[200px] h-24 rounded-xl bg-white border border-black/10 shadow-xs p-2 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between text-[8px] font-mono text-[#888888] whitespace-nowrap">
            <span>1000Hz HID</span>
            <span className="text-emerald-700 font-semibold">Ballistic OK</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-[#D97706]/20 border border-[#D97706]/50 mx-auto animate-pulse flex items-center justify-center text-[8px] text-[#D97706]">
            ●
          </div>
          <div className="text-[7.5px] font-mono text-center text-[#555555] whitespace-nowrap">
            Axis-Locked Vertical Scroll
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "touchbar",
    title: "Context Touch Bar",
    description: "Dynamic macro decks that detect frontmost app and morph instantly.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3">
        <div className="w-full max-w-[210px] py-1.5 px-2 rounded-xl bg-white border border-black/10 shadow-xs flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold text-[#111111]">VS Code</span>
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] text-[8px] font-mono whitespace-nowrap">Format</span>
            <span className="px-1.5 py-0.5 rounded bg-[#111111] text-white text-[8px] font-mono whitespace-nowrap">Run</span>
          </div>
        </div>
        <div className="w-full max-w-[210px] py-1.5 px-2 rounded-xl bg-white border border-black/10 shadow-xs flex items-center justify-between opacity-60">
          <span className="text-[9px] font-mono font-bold text-[#111111]">Figma</span>
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] text-[8px] font-mono whitespace-nowrap">AutoLayout</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] text-[8px] font-mono whitespace-nowrap">Tokens</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "clipboard",
    title: "2-Way Clipboard",
    description: "Instant echo-suppressed P2P ring buffer sync between Mac and mobile.",
    preview: (
      <div className="w-full h-full flex items-center justify-center p-3">
        <div className="w-full max-w-[210px] p-2.5 rounded-xl bg-white border border-black/10 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#71717A] whitespace-nowrap">
            <span className="flex items-center gap-1 text-[#D97706] font-semibold">
              <Copy className="w-2.5 h-2.5" />
              <span>P2P Ring Buffer</span>
            </span>
            <span className="text-emerald-700 font-semibold">0 echo</span>
          </div>
          <div className="p-1 rounded bg-[#F4F4F6] text-[8px] font-mono text-[#111111] truncate">
            https://github.com/lakshitsoni/tactile
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "clamshell",
    title: "Clamshell Mode",
    description: "Keep MacBook lid completely closed while streaming 120 FPS display.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3">
        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-black/10 shadow-xs flex flex-col items-center justify-center gap-1">
          <Laptop className="w-5 h-5 text-[#111111]" />
          <span className="text-[8px] font-mono text-emerald-700 font-bold whitespace-nowrap">
            Lid Closed · 120 FPS
          </span>
        </div>
        <span className="text-[8.5px] font-mono text-[#71717A] whitespace-nowrap">
          Virtual Display Keepalive
        </span>
      </div>
    ),
  },
  {
    id: "meeting",
    title: "Meeting Killswitch",
    description: "Hardware mic mute at kernel driver layer; zero software leaks.",
    preview: (
      <div className="w-full h-full flex items-center justify-center p-3">
        <div className="px-3 py-2 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 shadow-xs max-w-[210px] w-full">
          <div className="w-7 h-7 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shadow-xs shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div className="text-left whitespace-nowrap">
            <div className="text-[9px] font-bold font-mono text-rose-900">HARDWARE MUTED</div>
            <div className="text-[7.5px] font-mono text-rose-700">Driver Layer Locked</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "spaces",
    title: "Spaces HUD",
    description: "1-Tap Mission Control, Spaces navigation, and 50/50 window tiling.",
    preview: (
      <div className="w-full h-full flex items-center justify-center gap-1.5 p-3">
        <div className="px-2.5 py-1 rounded-lg bg-[#111111] text-white text-[8px] font-mono font-bold shadow-xs whitespace-nowrap">
          Space 1: Dev
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[#666666] text-[8px] font-mono shadow-xs whitespace-nowrap">
          Space 2: Design
        </div>
      </div>
    ),
  },
  {
    id: "mcp",
    title: "AI MCP Bridge",
    description: "Physical touch verification for Claude Code, Cursor, and terminal bash.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center p-3">
        <div className="w-full max-w-[210px] p-2 rounded-xl bg-white border border-black/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#71717A] whitespace-nowrap">
            <span className="text-[#D97706] font-semibold">Claude / Cursor</span>
            <span className="text-emerald-700 font-bold">MCP Verified</span>
          </div>
          <div className="p-1 rounded bg-[#F4F4F6] text-[7.5px] font-mono text-[#111111] truncate">
            $ npm run prisma migrate deploy
          </div>
          <div className="flex justify-end gap-1 pt-0.5">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[7px] font-mono font-semibold whitespace-nowrap">
              Approve (Tap)
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "localfirst",
    title: "100% Local-First",
    description: "Zero cloud servers, zero relays. Works offline in airplanes and vaults.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 px-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-[8.5px] font-mono font-bold text-[#111111] whitespace-nowrap">Direct Device P2P</span>
        <span className="text-[7.5px] font-mono text-[#888888] whitespace-nowrap">Zero Data Exfiltration</span>
      </div>
    ),
  },
  {
    id: "zeroVideo",
    title: "0% Video Mode",
    description: "Pauses video stream when macros are active for sub-0.5% battery/hr.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 px-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/10 shadow-xs whitespace-nowrap">
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[8.5px] font-mono font-bold text-[#111111]">&lt;0.5% Batt/hr</span>
        </div>
        <span className="text-[8px] font-mono text-[#71717A] whitespace-nowrap">Display Stream Sleeping</span>
      </div>
    ),
  },
  {
    id: "rotary",
    title: "Haptic Scrubber",
    description: "Teenage Engineering styled knurled rotary dial for precision scrub.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 px-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ECECEE] to-[#D4D4D8] border border-black/15 shadow-sm flex items-center justify-center">
          <div className="w-1 h-3 bg-[#D97706] rounded-full mb-3" />
        </div>
        <span className="text-[8px] font-mono font-semibold text-[#555555] whitespace-nowrap">Haptic Dial Scrub</span>
      </div>
    ),
  },
  {
    id: "menubar",
    title: "Mac Menu App",
    description: "Native macOS menu bar popover for instant companion diagnostics.",
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center p-3">
        <div className="w-full max-w-[210px] p-2 rounded-xl bg-white border border-black/10 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px]"></span>
            <span className="text-[8.5px] font-mono font-bold text-[#111111]">Tactile.app</span>
          </div>
          <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
            Connected 4.2ms
          </span>
        </div>
      </div>
    ),
  },
];

export default function WorkflowPillars() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="capabilities">
      {/* Section Header — Resurf 1:1 Editorial Hierarchy */}
      <div className="text-center mb-14">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[32px] sm:text-[38px] md:text-[44px] leading-[1.08] tracking-tight font-normal text-[#111111] mb-2">
          A companion that gets more useful every time you work.
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
          Fully local. Sub-15ms latency. Designed to stay completely out of your way.
        </p>
      </div>

      {/* 4x3 Grid matching Resurf's exact 12-Card Feature Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col rounded-2xl bg-white border border-black/[0.07] p-2.5 shadow-xs hover:shadow-md transition-all duration-200 group"
          >
            {/* Visual Canvas Stage (Upper Rounded Box) */}
            <div className="w-full h-36 rounded-xl bg-[#F4F4F5] border border-black/[0.03] flex items-center justify-center relative overflow-hidden transition-colors group-hover:bg-[#EFEFEF]">
              {feature.preview}
            </div>

            {/* Content Information */}
            <div className="p-2 pt-3 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="font-medium text-[15px] tracking-tight text-[#111111]">
                    {feature.title}
                  </h3>
                  {feature.optIn && (
                    <span className="text-[9px] font-mono text-[#71717A] bg-[#F4F4F6] px-1.5 py-0.2 rounded border border-black/[0.04]">
                      Opt-in
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] text-[#666666] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
