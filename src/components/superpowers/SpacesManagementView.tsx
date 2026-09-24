"use client";

import React from "react";
import { LayoutGrid, ChevronLeft, ChevronRight, Maximize2, Laptop, Layers, Sparkles } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick, playWindowFocus, playWindowSnap } from "@/lib/soundEngine";

const SPACES = [
  { id: 0, label: "Space 1: Dev", app: "VS Code" },
  { id: 1, label: "Space 2: Design", app: "Figma" },
  { id: 2, label: "Space 3: Ops", app: "Terminal" },
];

export default function SpacesManagementView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const spacesInfo = state.superpowerTelemetry.spaces;

  const handleSwitchSpace = (spaceIndex: number) => {
    playWindowFocus();
    playTapticClick(1);
    dispatch({ type: "SWITCH_SPACE", spaceIndex });
  };

  const handlePrevSpace = () => {
    playWindowFocus();
    playTapticClick(1);
    const nextIdx = Math.max(0, spacesInfo.activeSpace - 1);
    dispatch({ type: "SWITCH_SPACE", spaceIndex: nextIdx });
  };

  const handleNextSpace = () => {
    playWindowFocus();
    playTapticClick(1);
    const nextIdx = Math.min(SPACES.length - 1, spacesInfo.activeSpace + 1);
    dispatch({ type: "SWITCH_SPACE", spaceIndex: nextIdx });
  };

  const handleToggleMissionControl = () => {
    playKeyClick();
    playTapticClick(2);
    dispatch({ type: "TOGGLE_MISSION_CONTROL" });
  };

  const handleToggleExpose = () => {
    playKeyClick();
    playTapticClick(2);
    dispatch({ type: "TOGGLE_EXPOSE" });
  };

  const handleShowDesktop = () => {
    playKeyClick();
    playTapticClick(1);
    dispatch({ type: "FOCUS_DESKTOP" });
  };

  const handleSnap = (snap: "left" | "right" | "top" | "max") => {
    playWindowSnap();
    playTapticClick(1);
    dispatch({ type: "SNAP_WINDOW", snap });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Spaces &amp; Window HUD</div>
            <div className="text-[8px] font-mono text-[#71717A]">&lt;0.4ms Native Dispatch</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] font-mono text-[8px] font-bold">
          <span>Space {spacesInfo.activeSpace + 1} Active</span>
        </div>
      </div>

      {/* Spaces Strip Selector */}
      <div className="my-1.5 p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[8px] font-mono text-[#71717A] uppercase font-semibold">
          <span>Virtual Spaces Strip</span>
          <span className="text-[#D97706]">Instant Switch</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {SPACES.map((space) => {
            const isActive = spacesInfo.activeSpace === space.id;
            return (
              <button
                key={space.id}
                onClick={() => handleSwitchSpace(space.id)}
                className={`p-2 rounded-xl border text-left flex flex-col transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#111111] border-black text-white shadow-xs"
                    : "bg-[#F8F8FA] border-black/[0.06] hover:bg-[#EAEAEA] text-[#111111]"
                }`}
              >
                <span className={`text-[9px] font-mono font-bold ${isActive ? "text-white" : "text-[#111111]"}`}>
                  Space {space.id + 1}
                </span>
                <span className={`text-[7.5px] font-mono truncate mt-0.5 ${isActive ? "text-white/70" : "text-[#71717A]"}`}>
                  {space.app}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-Tap Management Action Grid */}
      <div className="grid grid-cols-2 gap-1.5 my-1">
        {/* Previous / Next Space */}
        <button
          onClick={handlePrevSpace}
          disabled={spacesInfo.activeSpace === 0}
          className="py-1.5 px-2 rounded-xl bg-white hover:bg-[#F4F4F6] border border-black/[0.08] shadow-xs flex items-center justify-center gap-1.5 text-[8.5px] font-mono text-[#111111] disabled:opacity-30 cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-3 h-3 text-[#D97706]" />
          <span>◀ Space Left</span>
        </button>

        <button
          onClick={handleNextSpace}
          disabled={spacesInfo.activeSpace === SPACES.length - 1}
          className="py-1.5 px-2 rounded-xl bg-white hover:bg-[#F4F4F6] border border-black/[0.08] shadow-xs flex items-center justify-center gap-1.5 text-[8.5px] font-mono text-[#111111] disabled:opacity-30 cursor-pointer active:scale-95"
        >
          <span>Space Right ▶</span>
          <ChevronRight className="w-3 h-3 text-[#D97706]" />
        </button>

        {/* Mission Control */}
        <button
          onClick={handleToggleMissionControl}
          className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-[8.5px] font-mono transition-all cursor-pointer active:scale-95 shadow-xs ${
            spacesInfo.isMissionControl
              ? "bg-[#D97706] text-white font-bold border-[#D97706]"
              : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111]"
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>⊞ Mission Control</span>
        </button>

        {/* App Exposé */}
        <button
          onClick={handleToggleExpose}
          className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-[8.5px] font-mono transition-all cursor-pointer active:scale-95 shadow-xs ${
            spacesInfo.isAppExpose
              ? "bg-[#111111] text-white font-bold border-black"
              : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111]"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>🗖 App Exposé</span>
        </button>

        {/* Show Desktop */}
        <button
          onClick={handleShowDesktop}
          className="col-span-2 py-1.5 px-2 rounded-xl bg-white hover:bg-[#F4F4F6] border border-black/[0.08] shadow-xs flex items-center justify-center gap-2 text-[8.5px] font-mono text-[#111111] cursor-pointer active:scale-95"
        >
          <Laptop className="w-3 h-3 text-emerald-600" />
          <span>🖥️ Show Desktop (Cmd+F3)</span>
        </button>
      </div>

      {/* Window Snapping HUD */}
      <div className="p-2 rounded-xl bg-[#F8F8FA] border border-black/[0.08] flex flex-col gap-1.5">
        <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">1-Tap Window Snapping (50/50 Tiling)</span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleSnap("left")}
            className={`py-1.5 rounded-lg border text-[8px] font-mono flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all ${
              spacesInfo.activeSnap === "left"
                ? "bg-[#D97706] border-[#D97706] text-white font-bold shadow-xs"
                : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111]"
            }`}
          >
            <span>◧ Left 50%</span>
          </button>
          <button
            onClick={() => handleSnap("right")}
            className={`py-1.5 rounded-lg border text-[8px] font-mono flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all ${
              spacesInfo.activeSnap === "right"
                ? "bg-[#D97706] border-[#D97706] text-white font-bold shadow-xs"
                : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111]"
            }`}
          >
            <span>◨ Right 50%</span>
          </button>
          <button
            onClick={() => handleSnap("max")}
            className={`py-1.5 rounded-lg border text-[8px] font-mono flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all ${
              spacesInfo.activeSnap === "max"
                ? "bg-[#D97706] border-[#D97706] text-white font-bold shadow-xs"
                : "bg-white hover:bg-[#F4F4F6] border-black/[0.08] text-[#111111]"
            }`}
          >
            <Maximize2 className="w-2.5 h-2.5 text-[#D97706]" />
            <span>Maximize</span>
          </button>
        </div>
      </div>
    </div>
  );
}
