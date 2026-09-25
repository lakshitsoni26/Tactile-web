"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Cpu, Wifi, ArrowLeftRight, Terminal, Lock } from "lucide-react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import { playKeyClick } from "@/lib/soundEngine";

export default function TransportInspectorView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  const transInfo = state.superpowerTelemetry.transport;
  const [controlPackets, setControlPackets] = useState(1482);

  useEffect(() => {
    const interval = setInterval(() => {
      setControlPackets((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-3 bg-[#FAFAFC] text-[#111111] overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono text-[#111111]">Dual-Plane Transport</div>
            <div className="text-[8px] font-mono text-[#71717A]">Zero Head-of-Line Blocking</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[8px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Direct P2P Link</span>
        </div>
      </div>

      {/* Dual-Plane Comparison Cards */}
      <div className="my-2 space-y-2">
        {/* Plane A: Realtime HID & Control Plane */}
        <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[8.5px] font-mono">
            <span className="flex items-center gap-1 text-[#D97706] font-bold">
              <Terminal className="w-3 h-3" />
              <span>Control Plane · Realtime HID &amp; Actions</span>
            </span>
            <span className="text-emerald-700 font-bold">0.42ms</span>
          </div>
          <div className="text-[8px] font-mono text-[#666666]">
            Macro clicks, rotary detents, clipboard sync, space switches.
          </div>
          <div className="flex items-center justify-between text-[7.5px] font-mono text-[#71717A] pt-1 border-t border-black/[0.06]">
            <span>Packets Exchanged: {controlPackets}</span>
            <span className="text-emerald-700 font-medium">Zero-Loss Guaranteed</span>
          </div>
        </div>

        {/* Plane B: Hardware Accelerated Video Stream Engine */}
        <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[8.5px] font-mono">
            <span className="flex items-center gap-1 text-[#111111] font-bold">
              <Cpu className="w-3 h-3 text-[#D97706]" />
              <span>Video Stream Plane · Hardware HEVC</span>
            </span>
            <span className="text-[#D97706] font-bold">120 FPS</span>
          </div>
          <div className="text-[8px] font-mono text-[#666666]">
            Apple Silicon hardware encoder stream directly to mobile GPU.
          </div>
          <div className="flex items-center justify-between text-[7.5px] font-mono text-[#71717A] pt-1 border-t border-black/[0.06]">
            <span>Bandwidth: 38.4 Mbps</span>
            <span className="text-emerald-700 font-medium">Zero HOL Delay</span>
          </div>
        </div>
      </div>

      {/* Zero-Config USB & Token Security HUD */}
      <div className="grid grid-cols-2 gap-1.5 my-1">
        <div className="p-2 rounded-xl bg-[#F8F8FA] border border-black/[0.08] flex flex-col justify-between">
          <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">Physical Link</span>
          <div className="text-[8.5px] font-mono text-[#111111] font-bold truncate mt-0.5">
            Direct Local Bus
          </div>
          <span className="text-[7.5px] font-mono text-emerald-700 font-medium mt-0.5">Plug &amp; Play · No Drivers</span>
        </div>

        <div className="p-2 rounded-xl bg-[#F8F8FA] border border-black/[0.08] flex flex-col justify-between">
          <span className="text-[7.5px] font-mono text-[#71717A] uppercase font-semibold">Peer Verification</span>
          <div className="flex items-center gap-1 text-[8.5px] font-mono text-[#111111] font-bold mt-0.5">
            <Lock className="w-2.5 h-2.5 text-[#D97706]" />
            <span className="truncate">Local Handshake</span>
          </div>
          <span className="text-[7.5px] font-mono text-[#D97706] font-medium mt-0.5">Mutual Session Validated</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-center text-[7.5px] font-mono text-[#71717A]">
        Video frame drops never delay button presses or clipboard sync events
      </div>
    </div>
  );
}
