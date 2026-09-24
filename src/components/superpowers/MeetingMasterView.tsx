"use client";

import React from "react";
import { Mic, MicOff, Video, VideoOff, Volume2, Sun, Lock, Moon, Shield } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";
import KnurledRotaryDial from "@/components/KnurledRotaryDial";

export default function MeetingMasterView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const meetInfo = state.superpowerTelemetry.meeting;

  const handleToggleHardwareMic = () => {
    playKeyClick();
    playTapticClick(3);
    dispatch({ type: "TOGGLE_HARDWARE_MIC" });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Meeting Master &amp; Controls</div>
            <div className="text-[8px] font-mono text-[#71717A]">CoreAudio HAL Driver Killswitch</div>
          </div>
        </div>

        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[8px] font-bold border ${
          meetInfo.isHardwareMicMuted
            ? "bg-rose-100 border-rose-300 text-rose-700 animate-pulse"
            : "bg-emerald-50 border-emerald-200 text-emerald-700"
        }`}>
          <span>{meetInfo.isHardwareMicMuted ? "MIC MUTED" : "Mic Active"}</span>
        </div>
      </div>

      {/* Large Industrial Hardware Mic Killswitch Button */}
      <div className="my-1.5 p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col items-center justify-center text-center">
        <button
          onClick={handleToggleHardwareMic}
          className={`w-full py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm ${
            meetInfo.isHardwareMicMuted
              ? "bg-gradient-to-b from-rose-500 to-rose-700 border-rose-600 text-white shadow-md"
              : "bg-[#F4F4F6] hover:bg-[#EBEBEB] border-black/[0.08] text-[#111111]"
          }`}
        >
          <div className="flex items-center gap-2">
            {meetInfo.isHardwareMicMuted ? (
              <MicOff className="w-5 h-5 text-white animate-bounce" />
            ) : (
              <Mic className="w-5 h-5 text-rose-600" />
            )}
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wide">
              {meetInfo.isHardwareMicMuted ? "DRIVER MIC MUTED" : "HARDWARE MIC KILLSWITCH"}
            </span>
          </div>
          <span className={`text-[7.5px] font-mono px-2 text-center ${meetInfo.isHardwareMicMuted ? "text-white/90" : "text-[#71717A]"}`}>
            {meetInfo.isHardwareMicMuted
              ? "CoreAudio HAL kAudioDevicePropertyMute set to 1 (Zero App Leak)"
              : "Tap to unconditionally kill microphone input at the kernel driver layer"}
          </span>
        </button>
      </div>

      {/* Dedicated Master Volume Card (Full Width - Zero Overlap!) */}
      <div className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[8px] font-mono text-[#71717A] uppercase font-semibold">
            <Volume2 className="w-3 h-3 text-[#D97706]" />
            <span>Master Volume</span>
          </span>
          <span className="text-[9px] font-mono font-bold text-[#111111] tabular-nums">
            {state.rotaryControls.volume}%
          </span>
        </div>

        {/* Scrub Slider Track */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={state.rotaryControls.volume}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            dispatch({ type: "SET_ROTARY_VALUE", control: "volume", value: val });
          }}
          className="w-full h-2 bg-black/[0.08] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
        />

        {/* Quick Presets */}
        <div className="grid grid-cols-4 gap-1 pt-0.5">
          {[0, 30, 65, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                playKeyClick();
                dispatch({ type: "SET_ROTARY_VALUE", control: "volume", value: preset });
              }}
              className={`py-0.5 rounded text-[7.5px] font-mono transition-all cursor-pointer ${
                Math.abs(state.rotaryControls.volume - preset) < 5
                  ? "bg-[#111111] text-white font-bold shadow-xs"
                  : "bg-[#F4F4F6] border border-black/[0.06] text-[#555555] hover:bg-[#EAEAEA] hover:text-[#111111]"
              }`}
            >
              {preset === 0 ? "Mute" : `${preset}%`}
            </button>
          ))}
        </div>
      </div>

      {/* System Quick Controls (Display, Theme, Lock) */}
      <div className="grid grid-cols-3 gap-1.5 my-1">
        {/* Brightness */}
        <button
          onClick={() => {
            playKeyClick();
            const nextBrightness = state.rotaryControls.brightness >= 100 ? 40 : state.rotaryControls.brightness + 20;
            dispatch({ type: "SET_ROTARY_VALUE", control: "brightness", value: nextBrightness });
          }}
          className="p-1.5 rounded-lg bg-white hover:bg-[#F4F4F6] border border-black/[0.08] shadow-xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-95"
        >
          <Sun className="w-3 h-3 text-amber-500 mb-0.5" />
          <span className="text-[7px] font-mono text-[#71717A] uppercase">Display</span>
          <span className="text-[8px] font-mono text-[#111111] font-bold">{state.rotaryControls.brightness}%</span>
        </button>

        {/* Theme */}
        <div className="p-1.5 rounded-lg bg-white border border-black/[0.08] shadow-xs flex flex-col items-center justify-center text-center">
          <Moon className="w-3 h-3 text-[#D97706] mb-0.5" />
          <span className="text-[7px] font-mono text-[#71717A] uppercase">Theme</span>
          <span className="text-[8px] font-mono text-[#111111] font-bold">Light</span>
        </div>

        {/* Lock Screen */}
        <button
          onClick={() => {
            playKeyClick();
            playTapticClick(1);
          }}
          className="p-1.5 rounded-lg bg-white hover:bg-[#F4F4F6] border border-black/[0.08] shadow-xs flex flex-col items-center justify-center text-center cursor-pointer active:scale-95"
        >
          <Lock className="w-3 h-3 text-emerald-600 mb-0.5" />
          <span className="text-[7px] font-mono text-[#71717A] uppercase">Lock Mac</span>
          <span className="text-[7.5px] font-mono text-[#111111] font-bold">⌘⌃Q</span>
        </button>
      </div>

      {/* Driver Layer Security Badge */}
      <div className="p-1.5 rounded-lg bg-[#F8F8FA] border border-black/[0.06] flex items-center justify-between text-[7.5px] font-mono text-[#555555]">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span>Apps cannot override HAL driver mute</span>
        </div>
        <span className="text-emerald-700 font-bold">Secure</span>
      </div>
    </div>
  );
}
