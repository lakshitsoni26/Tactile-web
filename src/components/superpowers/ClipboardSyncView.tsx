"use client";

import React, { useState } from "react";
import { Copy, Check, ArrowLeftRight, Key } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

export default function ClipboardSyncView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const [copiedPill, setCopiedPill] = useState<string | null>(null);
  const clipInfo = state.superpowerTelemetry.clipboard;

  const handleSyncPhoneToMac = () => {
    playKeyClick();
    playTapticClick(1);
    setCopiedPill("phone");
    dispatch({
      type: "SYNC_CLIPBOARD",
      source: "phone",
      text: clipInfo.phoneClipboard,
    });
    setTimeout(() => setCopiedPill(null), 1400);
  };

  const handleSyncMacToPhone = () => {
    playKeyClick();
    playTapticClick(1);
    setCopiedPill("mac");
    dispatch({
      type: "SYNC_CLIPBOARD",
      source: "mac",
      text: clipInfo.macClipboard,
    });
    setTimeout(() => setCopiedPill(null), 1400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Copy className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">2-Way Clipboard Sync</div>
            <div className="text-[8px] font-mono text-[#71717A]">&lt;20ms · 100% Local P2P</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[8px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{clipInfo.syncLatencyMs}ms Sync</span>
        </div>
      </div>

      {/* SHA-256 Echo-Loop Suppression Visualizer */}
      <div className="my-1.5 p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5 text-[8px] font-mono">
        <div className="flex items-center justify-between text-[#D97706] font-semibold border-b border-black/[0.06] pb-1">
          <span className="flex items-center gap-1.5">
            <Key className="w-3 h-3" />
            <span>SHA-256 Echo Suppression</span>
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[7.5px]">
            Echo Filter Active
          </span>
        </div>
        <div className="text-[#333333] truncate">
          Hash: <span className="text-[#D97706] font-mono">{clipInfo.lastSha256}</span>
        </div>
        <div className="text-[7.5px] text-[#71717A] leading-relaxed">
          Ring buffer stores last 16 hashes; eliminates ping-pong echo loops between Mac NSPasteboard &amp; Companion Clipboard.
        </div>
      </div>

      {/* Mac Pasteboard Card */}
      <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">
          <span className="flex items-center gap-1 text-[#111111]">
            <span> Mac NSPasteboard</span>
          </span>
          <span>UTF-8 String</span>
        </div>
        <div className="p-2 rounded-lg bg-[#F8F8FA] border border-black/[0.06] text-[8.5px] font-mono text-[#111111] truncate">
          {clipInfo.macClipboard}
        </div>
        <button
          onClick={handleSyncMacToPhone}
          className="w-full py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#D97706] text-[8.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95 font-semibold"
        >
          {copiedPill === "mac" ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Synced to Phone!</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3 h-3" />
              <span>Pull Mac Clipboard to Phone</span>
            </>
          )}
        </button>
      </div>

      {/* Phone Clipboard Card */}
      <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">
          <span className="flex items-center gap-1 text-[#111111]">
            <span>📱 Companion Clipboard</span>
          </span>
          <span>Local Device</span>
        </div>
        <div className="p-2 rounded-lg bg-[#F8F8FA] border border-black/[0.06] text-[8.5px] font-mono text-[#111111] truncate">
          {clipInfo.phoneClipboard}
        </div>
        <button
          onClick={handleSyncPhoneToMac}
          className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[8.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95 font-semibold"
        >
          {copiedPill === "phone" ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Pushed to Mac!</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3 h-3" />
              <span>Push Phone Clipboard to Mac</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
