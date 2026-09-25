"use client";

import React from "react";
import { ZoomIn, ZoomOut, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

export default function ZoomPanEngineView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const zoomInfo = state.superpowerTelemetry.zoom;

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    dispatch({ type: "SET_ZOOM_SCALE", scale });
  };

  const handleSetPreset = (scale: number) => {
    playKeyClick();
    playTapticClick(1);
    dispatch({ type: "SET_ZOOM_SCALE", scale });
  };

  const handleToggleZoomLock = () => {
    playKeyClick();
    playTapticClick(2);
    dispatch({ type: "TOGGLE_ZOOM_LOCK" });
  };

  const handleToggleMouseMute = () => {
    playKeyClick();
    playTapticClick(2);
    dispatch({ type: "TOGGLE_MOUSE_MUTE" });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <ZoomIn className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Zoom &amp; Pan Engine</div>
            <div className="text-[8px] font-mono text-[#71717A]">M⁻¹ Coordinate Remapping</div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] font-mono text-[8px] font-bold">
          <span>{zoomInfo.scale.toFixed(1)}x Scale</span>
        </div>
      </div>

      {/* Interactive Zoom Slider */}
      <div className="my-2 p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-[8px] font-mono text-[#71717A]">
          <span className="flex items-center gap-1.5 text-[#D97706] font-medium">
            <ZoomOut className="w-3 h-3" />
            <span>Pinch / Dynamic Focal Scale</span>
          </span>
          <span className="text-[#111111] font-bold text-[9px]">{zoomInfo.scale.toFixed(2)}x</span>
        </div>

        <input
          type="range"
          min="1.0"
          max="5.0"
          step="0.1"
          value={zoomInfo.scale}
          onChange={handleZoomChange}
          className="w-full h-2 bg-black/[0.08] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
        />

        {/* Quick Scale Presets */}
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          {[1.0, 2.0, 3.5, 5.0].map((preset) => (
            <button
              key={preset}
              onClick={() => handleSetPreset(preset)}
              className={`py-1 rounded-lg text-[8.5px] font-mono transition-all cursor-pointer ${
                Math.abs(zoomInfo.scale - preset) < 0.05
                  ? "bg-[#111111] text-white font-bold shadow-xs"
                  : "bg-white border border-black/[0.08] text-[#555555] hover:bg-[#F4F4F5] hover:text-[#111111]"
              }`}
            >
              {preset.toFixed(1)}x
            </button>
          ))}
        </div>
      </div>

      {/* Inverse Matrix Coordinate Remapping Math HUD */}
      <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.08] font-mono text-[8px] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[#D97706] font-semibold border-b border-black/[0.06] pb-1">
          <span>Inverse Matrix Transform (M⁻¹)</span>
          <span className="text-emerald-700">det(M) ≠ 0</span>
        </div>
        <div className="text-[#333333] leading-relaxed font-mono">
          P_mac = M⁻¹ · P_phone = [1/{(zoomInfo.scale).toFixed(1)}, 0 ; 0, 1/{(zoomInfo.scale).toFixed(1)}] · (P_touch - Focal)
        </div>
        <div className="flex items-center justify-between text-[#71717A] pt-0.5 text-[7.5px]">
          <span>Focal: ({zoomInfo.focal.x}, {zoomInfo.focal.y})</span>
          <span className="text-emerald-700 font-medium">Subpixel Clamped</span>
        </div>
      </div>

      {/* Critical Circuit Breakers */}
      <div className="grid grid-cols-2 gap-2 my-1">
        {/* _isZoomLocked */}
        <button
          onClick={handleToggleZoomLock}
          className={`p-2 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 ${
            zoomInfo.isZoomLocked
              ? "bg-amber-50 border-amber-300 text-[#D97706]"
              : "bg-white border-black/[0.08] text-[#555555] hover:bg-[#F4F4F5] hover:text-[#111111]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono uppercase font-bold">_isZoomLocked</span>
            {zoomInfo.isZoomLocked ? <Lock className="w-3 h-3 text-[#D97706]" /> : <Unlock className="w-3 h-3" />}
          </div>
          <span className="text-[7.5px] font-mono mt-1 text-[#71717A]">
            {zoomInfo.isZoomLocked ? "Locked (Zero drag jitter)" : "Unlocked (Pinch active)"}
          </span>
        </button>

        {/* _isMouseMuted */}
        <button
          onClick={handleToggleMouseMute}
          className={`p-2 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 ${
            zoomInfo.isMouseMuted
              ? "bg-rose-50 border-rose-300 text-rose-700"
              : "bg-white border-black/[0.08] text-[#555555] hover:bg-[#F4F4F5] hover:text-[#111111]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono uppercase font-bold">_isMouseMuted</span>
            {zoomInfo.isMouseMuted ? <EyeOff className="w-3 h-3 text-rose-600" /> : <Eye className="w-3 h-3" />}
          </div>
          <span className="text-[7.5px] font-mono mt-1 text-[#71717A]">
            {zoomInfo.isMouseMuted ? "Muted (Pan without click)" : "Active (Clicks enabled)"}
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-center text-[7.5px] font-mono text-[#71717A]">
        Continuous pan clamp ensures cursor stays strictly inside display bounds
      </div>
    </div>
  );
}
