"use client";

import React from "react";
import { Wifi } from "lucide-react";
import type { DeviceOS } from "@/lib/demoState";

interface DeviceFrameSwitcherProps {
  deviceOS: DeviceOS;
  onToggleDevice: (os: DeviceOS) => void;
  children: React.ReactNode;
}

export default function DeviceFrameSwitcher({
  deviceOS,
  onToggleDevice,
  children,
}: DeviceFrameSwitcherProps) {
  const isIos = deviceOS === "ios";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ── OS Switcher Capsule Bar ───────────────────────────────────────── */}
      <div className="flex items-center p-1 rounded-full border border-black/[0.08] bg-[#EBEBEB] shadow-xs">
        <button
          onClick={() => onToggleDevice("ios")}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono transition-all duration-150 cursor-pointer ${
            isIos
              ? "bg-white text-[#111111] font-semibold border border-black/[0.06] shadow-xs"
              : "text-[#555555] hover:text-[#111111]"
          }`}
        >
          <span className="text-sm leading-none"></span>
          <span>iPhone 16 Pro</span>
        </button>
        <button
          onClick={() => onToggleDevice("android")}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono transition-all duration-150 cursor-pointer ${
            !isIos
              ? "bg-white text-[#111111] font-semibold border border-black/[0.06] shadow-xs"
              : "text-[#555555] hover:text-[#111111]"
          }`}
        >
          <span className="text-xs leading-none">❖</span>
          <span>Android (Galaxy)</span>
        </button>
      </div>

      {/* ── Realistic Hardware Chassis ───────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 select-none"
        style={{ width: 286, height: 564 }}
      >
        {/* ── Physical Hardware Buttons — iPhone 16 Pro Layout ───────────── */}
        {isIos && (
          <>
            {/* Left: Action Button */}
            <div
              className="absolute -left-[4.5px] top-[94px] w-[3.5px] h-[22px] rounded-l-[2px] bg-gradient-to-r from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Action Button"
            />
            {/* Left: Volume Up */}
            <div
              className="absolute -left-[4.5px] top-[128px] w-[3.5px] h-[46px] rounded-l-[2px] bg-gradient-to-r from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Volume Up"
            />
            {/* Left: Volume Down */}
            <div
              className="absolute -left-[4.5px] top-[184px] w-[3.5px] h-[46px] rounded-l-[2px] bg-gradient-to-r from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Volume Down"
            />
            {/* Right: Side / Power Button */}
            <div
              className="absolute -right-[4.5px] top-[136px] w-[3.5px] h-[68px] rounded-r-[2px] bg-gradient-to-l from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Side Button"
            />
            {/* Right: iPhone 16 Camera Control Button */}
            <div
              className="absolute -right-[4px] top-[382px] w-[3px] h-[44px] rounded-r-[2px] bg-gradient-to-l from-[#9CA3AF] to-[#6B7280] border-y border-black/20 shadow-xs opacity-95 z-20"
              title="Camera Control"
            />
          </>
        )}

        {/* ── Physical Hardware Buttons — Android Flagship Layout ─────────── */}
        {!isIos && (
          <>
            {/* Right: Volume Rocker */}
            <div
              className="absolute -right-[4.5px] top-[112px] w-[3.5px] h-[58px] rounded-r-[2px] bg-gradient-to-l from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Volume Rocker"
            />
            {/* Right: Power Button */}
            <div
              className="absolute -right-[4.5px] top-[182px] w-[3.5px] h-[34px] rounded-r-[2px] bg-gradient-to-l from-[#8E8E93] via-[#AEAEB2] to-[#636366] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] z-20"
              title="Power Button"
            />
          </>
        )}

        {/* ── Outer Metal Rail (Grade 5 Titanium / Armor Aluminum) ────────── */}
        <div
          className={`absolute inset-0 transition-all duration-300 p-[3px] border border-black/15 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.7),inset_0_0_0_1px_rgba(0,0,0,0.12)] ${
            isIos
              ? "rounded-[50px] bg-gradient-to-b from-[#E4E4E7] via-[#D4D4D8] to-[#BCBCC2]"
              : "rounded-[38px] bg-gradient-to-b from-[#E2E4E9] via-[#D1D5DB] to-[#9CA3AF]"
          }`}
        >
          {/* Antenna Band Insets */}
          <div className="absolute left-[38px] -top-[1px] w-[2.5px] h-[4px] bg-black/25 z-10" />
          <div className="absolute right-[38px] -top-[1px] w-[2.5px] h-[4px] bg-black/25 z-10" />
          <div className="absolute left-[38px] -bottom-[1px] w-[2.5px] h-[4px] bg-black/25 z-10" />
          <div className="absolute right-[38px] -bottom-[1px] w-[2.5px] h-[4px] bg-black/25 z-10" />

          {/* ── Inner Black OLED Bezel ────────────────────────────────────── */}
          <div
            className={`w-full h-full p-[5px] bg-[#0A0B0E] relative overflow-hidden transition-all duration-300 shadow-[inset_0_0_2px_rgba(0,0,0,0.8)] ${
              isIos ? "rounded-[47px]" : "rounded-[35px]"
            }`}
          >
            {/* Top Earpiece Speaker Slit */}
            <div
              className={`absolute top-[2.5px] left-1/2 -translate-x-1/2 h-[2px] bg-[#1E2026] rounded-full z-40 border-t border-black/60 ${
                isIos ? "w-[44px]" : "w-[36px]"
              }`}
            />

            {/* ── Edge-to-Edge Display Canvas ──────────────────────────────── */}
            <div
              data-no-cursor-snap="true"
              className={`phone-sandbox w-full h-full bg-[#FAFAFC] overflow-hidden flex flex-col relative transition-all duration-300 shadow-[inset_0_0_3px_rgba(0,0,0,0.4)] ${
                isIos ? "rounded-[42px]" : "rounded-[30px]"
              }`}
            >
              {/* Dynamic Island (iOS) */}
              {isIos && (
                <div
                  className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[80px] h-[20px] bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)] ring-1 ring-white/10 pointer-events-none"
                  title="Dynamic Island"
                >
                  {/* FaceID flood sensor */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111216] border border-white/10" />
                  {/* TrueDepth camera with optical reflection */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-white/20 relative flex items-center justify-center overflow-hidden">
                    <div className="w-1 h-1 rounded-full bg-gradient-to-tr from-[#164e63] to-[#083344]" />
                  </div>
                </div>
              )}

              {/* Hole-Punch Camera (Android) */}
              {!isIos && (
                <div
                  className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] bg-black rounded-full z-30 flex items-center justify-center ring-1 ring-white/15 shadow-[0_1px_4px_rgba(0,0,0,0.5)] pointer-events-none"
                  title="Front Camera"
                >
                  <div className="w-[5px] h-[5px] rounded-full bg-[#0a1420] border border-cyan-400/40" />
                </div>
              )}

              {/* ── Status Bar ────────────────────────────────────────────── */}
              <div className="relative flex items-center justify-between px-5 h-[30px] bg-[#ECECEE] z-20 pointer-events-none flex-shrink-0">
                {/* Time */}
                <span className="text-[10px] font-sans font-semibold text-[#111111] tracking-tight">
                  9:41
                </span>

                {/* Right Indicators */}
                <div className="flex items-center gap-1.5 text-[#111111]">
                  {/* Wi-Fi Icon (Android) */}
                  {!isIos && <Wifi className="w-2.5 h-2.5 text-[#111111]" />}

                  {/* 4 Stepped Cellular Signal Bars */}
                  <div className="flex items-end gap-[1.5px] h-[8.5px]">
                    <div className="w-[2px] h-[2.5px] bg-[#111111] rounded-[0.5px]" />
                    <div className="w-[2px] h-[4.5px] bg-[#111111] rounded-[0.5px]" />
                    <div className="w-[2px] h-[6.5px] bg-[#111111] rounded-[0.5px]" />
                    <div className="w-[2px] h-[8.5px] bg-[#111111] rounded-[0.5px]" />
                  </div>

                  {/* 5G Badge */}
                  <span className="text-[8.5px] font-sans font-bold text-[#111111] tracking-tight">
                    5G
                  </span>

                  {/* Battery Gauge */}
                  <div className="relative flex items-center">
                    <div className="w-[19px] h-[9.5px] rounded-[3px] border border-[#111111] p-[1.5px] flex items-center">
                      <div className="h-full w-[78%] bg-[#111111] rounded-[1px]" />
                    </div>
                    <div className="w-[1.5px] h-[3.5px] bg-[#111111] rounded-r-[1px] -ml-[0.5px]" />
                  </div>
                </div>
              </div>

              {/* ── Screen Content (Scrollable / Interactive Superpowers) ──── */}
              <div className="flex-1 overflow-hidden min-h-0 bg-[#FAFAFC] flex flex-col">
                {children}
              </div>

              {/* ── Bottom Gesture / Home Indicator ────────────────────────── */}
              <div className="flex-shrink-0 flex items-center justify-center py-1.5 bg-[#FAFAFC] pointer-events-none z-20 border-t border-black/[0.04]">
                {isIos ? (
                  <div className="w-28 h-[3.5px] bg-black/30 rounded-full" />
                ) : (
                  <div className="w-20 h-[3.5px] bg-black/30 rounded-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
