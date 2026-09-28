"use client";

import React from "react";
import { ShieldCheck, Lock, HardDrive, Wifi, Cable, CloudOff } from "lucide-react";

export default function LocalFirstBlock() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="resurf-card p-8 sm:p-14 bg-white border border-black/[0.08] relative overflow-hidden">
        {/* Subtle warm halo */}
        <div
          className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(217, 119, 6, 0.2), transparent 70%)" }}
        />

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="tag-badge mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Architectural Sovereignty</span>
            </div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08] mb-4">
              Your code and pixels <br />
              <span className="italic font-serif">never leave your desk.</span>
            </h2>
            <p className="text-[16px] text-[#666666] leading-relaxed font-[family-name:var(--font-inter)]">
              Most companion apps route your screen frames through cloud servers. Tactile establishes a direct, encrypted peer-to-peer bridge inside your room. Zero cloud relays. Zero telemetry.
            </p>
          </div>

          {/* Architecture Diagram Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F8FA] border border-black/[0.06] mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
              {/* Node 1: Mac */}
              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center mx-auto mb-2">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[#111111] text-sm">Mac Studio / MacBook</div>
                <div className="text-xs text-[#71717A] mt-0.5 font-mono">Host Daemon (Native Swift)</div>
              </div>

              {/* Center: Direct P2P Pipe */}
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <div className="flex items-center gap-3 text-xs font-mono text-[#15803D] bg-[#DCFCE7] px-3.5 py-1.5 rounded-full border border-[#86EFAC]/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Direct Encrypted P2P</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#71717A] font-mono">
                  <Cable className="w-3.5 h-3.5" />
                  <span>USB-C Cable</span>
                  <span>or</span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>5GHz Local LAN</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#B91C1C] font-mono mt-1">
                  <CloudOff className="w-3 h-3" />
                  <span>Zero Cloud Servers Involved</span>
                </div>
              </div>

              {/* Node 2: Phone */}
              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#D97706] text-white flex items-center justify-center mx-auto mb-2">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[#111111] text-sm">Phone Companion</div>
                <div className="text-xs text-[#71717A] mt-0.5 font-mono">iOS & Android (120Hz OLED)</div>
              </div>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="text-sm font-semibold text-[#111111] mb-1">100% Offline Capable</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Works on planes, trains, and secure air-gapped engineering networks without internet access.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#111111] mb-1">Enterprise Grade Security</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Confidential code, proprietary Figma frames, and private API keys never touch third-party cloud relays.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#111111] mb-1">Zero Telemetry Trackers</h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                No tracking pixels, no keystroke analytics, no marketing cookies. Your work is entirely yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
