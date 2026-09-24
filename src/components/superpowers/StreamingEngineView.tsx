"use client";

import React, { useState } from "react";
import { Tv, Zap, ShieldCheck, Activity } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

export default function StreamingEngineView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const [keyframeFlash, setKeyframeFlash] = useState(false);
  const streamInfo = state.superpowerTelemetry.streaming;

  const handleTriggerKeyframe = () => {
    playKeyClick();
    playTapticClick(2);
    setKeyframeFlash(true);
    dispatch({ type: "TRIGGER_KEYFRAME_SYNC" });
    setTimeout(() => setKeyframeFlash(false), 800);
  };

  const handleSetFps = (fps: 60 | 120) => {
    playKeyClick();
    dispatch({ type: "SET_STREAM_FPS", fps });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Display Stream Engine</div>
            <div className="text-[8px] font-mono text-[#71717A]">Hardware-Accelerated HEVC</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[8px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>14.4ms Glass-to-Glass</span>
        </div>
      </div>

      {/* Latency Breakdown Card */}
      <div className="my-2 p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-[8px] font-mono text-[#71717A] uppercase tracking-wider">
          <span>Sub-15ms Pipeline Breakdown</span>
          <span className="text-[#D97706] font-bold">14.4ms Total</span>
        </div>

        {/* Animated Stacked Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-black/[0.06] border border-black/[0.08] flex overflow-hidden">
          <div className="w-[12%] h-full bg-[#D97706]" title="ScreenCaptureKit: 1.8ms" />
          <div className="w-[22%] h-full bg-amber-400" title="Hardware Encode: 3.2ms" />
          <div className="w-[29%] h-full bg-[#111111]" title="P2P Transport Bus: 4.2ms" />
          <div className="w-[18%] h-full bg-blue-500" title="GPU Decode: 2.6ms" />
          <div className="w-[19%] h-full bg-emerald-500" title="Surface Present: 2.6ms" />
        </div>

        {/* Breakdown Chips */}
        <div className="grid grid-cols-2 gap-1.5 text-[8px] font-mono">
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#666666]">Capture (ScreenCaptureKit)</span>
            <span className="text-[#D97706] font-bold">1.8ms</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#666666]">Encode (Apple Silicon HEVC)</span>
            <span className="text-amber-600 font-bold">3.2ms</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#666666]">Transport (Local P2P)</span>
            <span className="text-[#111111] font-bold">4.2ms</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#666666]">Decode (Hardware GPU)</span>
            <span className="text-blue-600 font-bold">2.6ms</span>
          </div>
        </div>
      </div>

      {/* Frame Rate & Keyframe Controls */}
      <div className="grid grid-cols-2 gap-2 my-1">
        {/* FPS Switcher */}
        <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col justify-between">
          <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">Frame Rate Target</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <button
              onClick={() => handleSetFps(60)}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                streamInfo.fps === 60
                  ? "bg-[#111111] text-white shadow-xs"
                  : "bg-white border border-black/[0.08] text-[#555555] hover:bg-[#F4F4F5] hover:text-[#111111]"
              }`}
            >
              60 FPS
            </button>
            <button
              onClick={() => handleSetFps(120)}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                streamInfo.fps === 120
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "bg-white border border-black/[0.08] text-[#555555] hover:bg-[#F4F4F5] hover:text-[#111111]"
              }`}
            >
              120 FPS
            </button>
          </div>
        </div>

        {/* IDR Keyframe Sync Trigger */}
        <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col justify-between">
          <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">On-Demand Sync</span>
          <button
            onClick={handleTriggerKeyframe}
            className={`w-full mt-1.5 py-1.5 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              keyframeFlash
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#D97706]"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{keyframeFlash ? "Keyframe Synced!" : "Sync Keyframe"}</span>
          </button>
        </div>
      </div>

      {/* Hardware Decoders Telemetry Strip */}
      <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-between text-[8px] font-mono text-[#555555]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>GPU SurfaceTexture (&lt;4% CPU)</span>
        </div>
        <div className="text-[#D97706] font-bold">HEVC Main 10</div>
      </div>
    </div>
  );
}
