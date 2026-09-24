"use client";

import React from "react";
import { Laptop, Power, ShieldCheck, Activity, Cpu } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

export default function ClamshellEngineView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const clamInfo = state.superpowerTelemetry.clamshell;

  const handleToggleClamshell = () => {
    playKeyClick();
    playTapticClick(2);
    dispatch({ type: "TOGGLE_CLAMSHELL" });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <Laptop className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Clamshell Headless Engine</div>
            <div className="text-[8px] font-mono text-[#71717A]">Virtual Display · Lid Closed</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] font-mono text-[8px] font-bold">
          <span>{clamInfo.isLidClosed ? "Lid Closed" : "Lid Open"}</span>
        </div>
      </div>

      {/* Main Big Clamshell Mode Toggle Button */}
      <div className="my-2 p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-2 text-center">
        <button
          onClick={handleToggleClamshell}
          className={`w-full py-3 rounded-xl border font-mono text-[9px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm ${
            clamInfo.isLidClosed
              ? "bg-amber-50 border-amber-300 text-[#D97706] shadow-xs"
              : "bg-[#F4F4F6] hover:bg-[#EBEBEB] border-black/[0.08] text-[#111111]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Power className={`w-4 h-4 ${clamInfo.isLidClosed ? "text-[#D97706] animate-pulse" : "text-[#71717A]"}`} />
            <span>{clamInfo.isLidClosed ? "Open MacBook Lid (Normal Mode)" : "Close MacBook Lid (Clamshell Mode)"}</span>
          </div>
          <span className="text-[7.5px] font-mono font-normal text-[#71717A]">
            {clamInfo.isLidClosed ? "Streaming continues while Mac lid is fully shut" : "Tap to simulate closing the MacBook lid"}
          </span>
        </button>
      </div>

      {/* 3 Low-Level Subsystem Architecture Cards */}
      <div className="space-y-1.5 my-1">
        {/* Virtual Display Engine */}
        <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-between text-[8px] font-mono">
          <div className="flex items-center gap-1.5 text-[#111111]">
            <Activity className="w-3 h-3 text-[#D97706]" />
            <span>Virtual Display Driver</span>
          </div>
          <span className="text-[#D97706] font-bold">{clamInfo.virtualDisplayRes}</span>
        </div>

        {/* Display Link Keepalive */}
        <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-between text-[8px] font-mono">
          <div className="flex items-center gap-1.5 text-[#111111]">
            <Cpu className="w-3 h-3 text-emerald-600" />
            <span>Hardware VSync Keepalive</span>
          </div>
          <span className="text-emerald-700 font-bold">120Hz Rasterizer Active</span>
        </div>

        {/* Power Assertion */}
        <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-between text-[8px] font-mono">
          <div className="flex items-center gap-1.5 text-[#111111]">
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            <span>Sleep Prevention Assertion</span>
          </div>
          <span className="text-amber-600 font-bold">Held by Daemon</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-center text-[7.5px] font-mono text-[#71717A]">
        macOS GPU driver stays fully active without physical display attached
      </div>
    </div>
  );
}
