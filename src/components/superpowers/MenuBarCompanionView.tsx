"use client";

import React, { useState } from "react";
import { Compass, CheckCircle2, ShieldCheck, Power, RefreshCw, Cpu, Activity, Laptop } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

export default function MenuBarCompanionView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const menuInfo = state.superpowerTelemetry.menubar;
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagPass, setDiagPass] = useState(false);

  const handleTogglePopover = () => {
    playKeyClick();
    playTapticClick(1);
    dispatch({ type: "TOGGLE_TACTILE_MENU_APP" });
  };

  const handleToggleSwitch = (switchKey: "clipboard" | "touchbar" | "zeroVideo" | "clamshell") => {
    playKeyClick();
    playTapticClick(1);
    dispatch({ type: "TOGGLE_MASTER_SWITCH", switchKey });
  };

  const handleRunDiagnostics = () => {
    playKeyClick();
    playTapticClick(2);
    setDiagRunning(true);
    setTimeout(() => {
      setDiagRunning(false);
      setDiagPass(true);
      setTimeout(() => setDiagPass(false), 2500);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Tactile.app Menu Bar Popover</div>
            <div className="text-[8px] font-mono text-[#71717A]">Native macOS Status Item</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[8px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Daemon Active</span>
        </div>
      </div>

      {/* Main Remote Trigger: Toggle Popover on Mac */}
      <div className="my-2 p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5 text-center">
        <button
          onClick={handleTogglePopover}
          className={`w-full py-2.5 rounded-xl border font-mono text-[8.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm ${
            menuInfo.isTactileAppPopoverOpen
              ? "bg-[#D97706] text-white border-[#D97706]"
              : "bg-[#F4F4F6] hover:bg-[#EBEBEB] border-black/[0.08] text-[#111111]"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{menuInfo.isTactileAppPopoverOpen ? "Hide Popover on Mac" : "Open Tactile.app Popover on Mac Screen"}</span>
        </button>
        <span className="text-[7.5px] font-mono text-[#71717A]">
          Shows status popover anchored in the top right menu bar of the MacBook
        </span>
      </div>

      {/* Master Switches Grid */}
      <div className="p-2 rounded-xl bg-[#F8F8FA] border border-black/[0.08] flex flex-col gap-1.5">
        <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">Daemon Master Switches</span>
        
        <div className="grid grid-cols-2 gap-1.5 text-[8px] font-mono">
          {/* Clipboard Switch */}
          <button
            onClick={() => handleToggleSwitch("clipboard")}
            className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
              menuInfo.masterSwitches.clipboard
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-black/[0.06] text-[#888888]"
            }`}
          >
            <span>2-Way Clipboard</span>
            <span className="font-bold">{menuInfo.masterSwitches.clipboard ? "ON" : "OFF"}</span>
          </button>

          {/* Touchbar Switch */}
          <button
            onClick={() => handleToggleSwitch("touchbar")}
            className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
              menuInfo.masterSwitches.touchbar
                ? "bg-amber-50 border-amber-300 text-[#D97706]"
                : "bg-white border-black/[0.06] text-[#888888]"
            }`}
          >
            <span>Touch Bar Sync</span>
            <span className="font-bold">{menuInfo.masterSwitches.touchbar ? "ON" : "OFF"}</span>
          </button>

          {/* Zero Video Switch */}
          <button
            onClick={() => handleToggleSwitch("zeroVideo")}
            className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
              menuInfo.masterSwitches.zeroVideo
                ? "bg-purple-50 border-purple-300 text-purple-800"
                : "bg-white border-black/[0.06] text-[#888888]"
            }`}
          >
            <span>0% Video Mode</span>
            <span className="font-bold">{menuInfo.masterSwitches.zeroVideo ? "ON" : "OFF"}</span>
          </button>

          {/* Clamshell Switch */}
          <button
            onClick={() => handleToggleSwitch("clamshell")}
            className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
              menuInfo.masterSwitches.clamshell
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-white border-black/[0.06] text-[#888888]"
            }`}
          >
            <span>Clamshell Mode</span>
            <span className="font-bold">{menuInfo.masterSwitches.clamshell ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* 1-Click Diagnostics Self-Test */}
      <button
        onClick={handleRunDiagnostics}
        disabled={diagRunning}
        className={`w-full py-2 rounded-xl border font-mono text-[8.5px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
          diagPass
            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
            : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111] shadow-xs"
        }`}
      >
        {diagRunning ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin text-[#D97706]" />
            <span>Auditing Direct P2P Link &amp; Drivers...</span>
          </>
        ) : diagPass ? (
          <>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>All 10 Subsystems Passed (0 Errors)</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3 h-3 text-[#D97706]" />
            <span>Run 1-Click Subsystem Diagnostics</span>
          </>
        )}
      </button>
    </div>
  );
}
