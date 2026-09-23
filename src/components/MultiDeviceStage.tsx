"use client";

import React from "react";
import { Laptop, Smartphone, Tablet, Shield, Zap, Cpu } from "lucide-react";

export default function MultiDeviceStage() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="devices">
      {/* Section Header — Resurf 1:1 Editorial Hierarchy */}
      <div className="text-center mb-10">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[32px] sm:text-[38px] md:text-[44px] leading-[1.08] tracking-tight font-normal text-[#111111] mb-2">
          Native on every screen.
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
          Written entirely in native Swift and Rust for macOS, iOS, and Android. Your companion streams peer-to-peer across your desk. Zero cloud relays, zero accounts.
        </p>

        {/* 3 Resurf-style Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-white border border-black/10 text-[#111111] shadow-2xs">
            100% native Swift &amp; Rust
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-white border border-black/10 text-[#111111] shadow-2xs">
            Direct Local P2P
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-white border border-black/10 text-[#111111] shadow-2xs">
            Zero Cloud Relays
          </span>
        </div>
      </div>

      {/* Hardware Cluster Display Stage with Diffuse Shadow */}
      <div className="relative max-w-4xl mx-auto mt-12 rounded-3xl bg-gradient-to-b from-white to-[#F4F4F6] border border-black/[0.08] shadow-[0_2px_6px_rgba(0,0,0,0.03),0_16px_40px_rgba(0,0,0,0.05),0_40px_100px_rgba(0,0,0,0.07)] p-4 sm:p-12 overflow-hidden text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-[0.5px] ring-inset ring-black/10 rounded-3xl"
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 relative z-10">
          {/* MacBook Pro Unibody */}
          <div className="flex flex-col items-center">
            <div className="w-56 sm:w-72 h-36 sm:h-44 rounded-xl bg-white border border-black/10 shadow-md p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 pb-2 border-b border-black/[0.06]">
                <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                <span className="text-[9px] font-mono text-[#71717A] ml-2">MacBook Pro · macOS Sequoia</span>
              </div>
              <div className="my-auto text-center space-y-1">
                <div className="text-xs font-mono font-bold text-[#111111]">Tactile Host Daemon</div>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Broadcast Stream Active
                </div>
              </div>
              <div className="text-[8px] font-mono text-[#888888] flex justify-between pt-1 border-t border-black/[0.06]">
                <span>120 FPS HEVC</span>
                <span>USB-C / Wi-Fi</span>
              </div>
            </div>
            <div className="w-64 sm:w-80 h-2.5 bg-[#D2D4DB] rounded-b-md mx-auto shadow-sm" />
            <span className="text-xs font-medium text-[#111111] mt-3">MacBook Pro</span>
          </div>

          {/* Connected P2P Pulse Arrow (Desktop) */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <span className="text-xs font-mono font-bold text-[#D97706]">4.18ms</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#D97706] to-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-[#71717A]">P2P Stream</span>
          </div>

          {/* Connected P2P Pulse Line (Mobile) */}
          <div className="flex sm:hidden flex-col items-center gap-1 my-0.5">
            <span className="text-[10px] font-mono font-bold text-[#D97706]">4.18ms Direct DMA</span>
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#D97706] to-emerald-500 rounded-full animate-pulse" />
          </div>

          {/* iPhone 16 Pro Companion */}
          <div className="flex flex-col items-center">
            <div className="w-28 sm:w-36 h-48 sm:h-56 rounded-[28px] bg-white border-4 border-[#222224] shadow-xl p-2 flex flex-col justify-between relative overflow-hidden">
              <div className="w-10 h-3 rounded-full bg-black mx-auto mb-1 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-blue-900" />
              </div>
              <div className="my-auto text-center space-y-1.5">
                <span className="text-[8px] font-mono font-bold text-[#D97706] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Touch Bar Deck
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#F4F4F6] rounded-lg">
                  <div className="p-1 rounded bg-white text-[7px] font-mono shadow-2xs font-semibold">VS Code</div>
                  <div className="p-1 rounded bg-white text-[7px] font-mono shadow-2xs font-semibold">Figma</div>
                </div>
              </div>
              <div className="w-10 h-1 bg-black rounded-full mx-auto" />
            </div>
            <span className="text-xs font-medium text-[#111111] mt-3">iPhone Companion</span>
          </div>
        </div>
      </div>
    </section>
  );
}
