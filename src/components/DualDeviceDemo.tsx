"use client";

import React, { useReducer, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MacScreenContent from "./MacScreenContent";
import PhoneScreenContent from "./PhoneScreenContent";
import DeviceFrameSwitcher from "./DeviceFrameSwitcher";
import {
  desktopReducer,
  INITIAL_DESKTOP_STATE,
  type WindowId,
  type FocusedAppId,
  type SuperpowerId,
} from "@/lib/desktopState";
import type { ProtocolId } from "@/lib/demoState";
import { playKeyClick, playWindowFocus } from "@/lib/soundEngine";
import {
  Tv,
  Sliders,
  ZoomIn,
  LayoutGrid,
  Sparkles,
  Copy,
  Laptop,
  Mic,
  Activity,
  Compass,
  ShieldCheck,
  Zap,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

interface SuperpowerSpec {
  id: SuperpowerId;
  index: string;
  label: string;
  tag: string;
  subsystem: string;
  api: string;
  subsystemDetail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUPERPOWERS: SuperpowerSpec[] = [
  {
    id: "streaming",
    index: "01",
    label: "Display Stream",
    tag: "<15ms · 120 FPS",
    subsystem: "Apple Silicon Hardware HEVC + Android MediaCodec",
    api: "VTCompressionSession / ScreenCaptureKit",
    subsystemDetail:
      "Dual capture pipeline with hardware-accelerated HEVC encoding on Apple Silicon and zero-copy GPU SurfaceTexture decode on mobile (<4% phone CPU).",
    icon: Tv,
  },
  {
    id: "trackpad",
    index: "02",
    label: "Precision Trackpad",
    tag: "Liquid Inertia",
    subsystem: "HID 1000Hz Ballistic Engine & Axis-Locking",
    subsystemDetail:
      "Delta relative ballistics, sub-millimeter tap-to-click, 2-finger right-click, and axis-locked vertical momentum scrolling.",
    api: "IOHIDEventSystem / CGEventCreateMouseEvent",
    icon: Sliders,
  },
  {
    id: "zoom",
    index: "03",
    label: "Zoom & Pan",
    tag: "1x–5x Matrix",
    subsystem: "M⁻¹ Inverse Coordinate Matrix Remap",
    subsystemDetail:
      "Continuous pinch zoom with affine inverse coordinate transformation and _isZoomLocked / _isMouseMuted circuit breakers.",
    api: "CGAffineTransformInvert / Touch Dispatch",
    icon: ZoomIn,
  },
  {
    id: "spaces",
    index: "04",
    label: "Spaces HUD",
    tag: "<0.4ms CGEvent",
    subsystem: "macOS CGEvent HID Dispatch Engine",
    subsystemDetail:
      "1-Tap Spaces capsule navigation, Mission Control, App Exposé, Show Desktop (Cmd+F3), and 50/50 window tiling.",
    api: "CGEventPost(kCGHIDEventTap)",
    icon: LayoutGrid,
  },
  {
    id: "touchbar",
    index: "05",
    label: "Context Touch Bar",
    tag: "0% Video Mode",
    subsystem: "Direct JSON Macro Bus",
    subsystemDetail:
      "Active frontmost app detection for VS Code, Figma, Terminal, and Finder. 0% Video Mode operates at sub-0.5% battery/hr.",
    api: "NSWorkspaceDidActivateApplicationNotification",
    icon: Sparkles,
  },
  {
    id: "clipboard",
    index: "06",
    label: "2-Way Clipboard",
    tag: "<20ms Sync",
    subsystem: "Echo-Suppressed P2P Ring Buffer",
    subsystemDetail:
      "Bidirectional real-time clipboard bridge with ring buffer hashing to eliminate ping-pong echo loops.",
    api: "NSPasteboard changeCount / Local P2P",
    icon: Copy,
  },
  {
    id: "clamshell",
    index: "07",
    label: "Clamshell Mode",
    tag: "Lid-Closed",
    subsystem: "CGVirtualDisplay Keepalive",
    subsystemDetail:
      "Maintains uninterrupted 2940x1912 streaming with MacBook lid shut; virtual display keepalive keeps GPU VSync alive at 120 FPS.",
    api: "CGVirtualDisplay / IOPMAssertionCreate",
    icon: Laptop,
  },
  {
    id: "meeting",
    index: "08",
    label: "Meeting Master",
    tag: "HW Mic Mute",
    subsystem: "CoreAudio HAL Driver Killswitch",
    subsystemDetail:
      "Mutes microphone input directly at the kernel driver layer; zero software apps can leak audio.",
    api: "AudioObjectSetPropertyData / CoreAudio",
    icon: Mic,
  },
  {
    id: "transport",
    index: "09",
    label: "Dual-Plane Bus",
    tag: "Local Stream",
    subsystem: "Direct P2P Stream Architecture",
    subsystemDetail:
      "Control plane separated from UDP HEVC stream plane to eliminate head-of-line blocking and achieve sub-15ms glass-to-glass latency.",
    api: "End-to-End Encrypted Local P2P",
    icon: Activity,
  },
  {
    id: "menubar",
    index: "10",
    label: "Mac Menu App",
    tag: "Tactile.app",
    subsystem: "macOS Native Menu Bar Service",
    subsystemDetail:
      "Status popover anchored in top menu bar with connected companion telemetry, master switches, and 1-click diagnostics.",
    api: "NSStatusItem / NSPopover / LaunchAgent",
    icon: Compass,
  },
];

const APPS: { id: FocusedAppId; name: string }[] = [
  { id: "finder", name: "Desktop" },
  { id: "vscode", name: "VS Code" },
  { id: "figma", name: "Figma" },
  { id: "terminal", name: "Terminal" },
];

const PROTOCOLS: { id: ProtocolId; label: string; latency: string }[] = [
  { id: "usbc", label: "USB-C", latency: "4.18ms" },
  { id: "wifi", label: "Wi-Fi", latency: "11.8ms" },
  { id: "mesh", label: "Mesh VPN", latency: "14.2ms" },
];

const AUTO_RESET_TIMEOUT = 45_000;

export default function DualDeviceDemo() {
  const [state, dispatch] = useReducer(desktopReducer, INITIAL_DESKTOP_STATE);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-reset on inactivity
  const scheduleReset = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      dispatch({ type: "RESET" });
    }, AUTO_RESET_TIMEOUT);
  }, []);

  useEffect(() => {
    scheduleReset();
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [state.lastActionTimestamp, state.focusedWindowId, state.protocol, state.activeSuperpower, scheduleReset]);

  // Telemetry jitter animation
  const [displayLatency, setDisplayLatency] = React.useState(state.latencyMs);
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 2 * state.latencyJitter;
      setDisplayLatency(parseFloat((state.latencyMs + jitter).toFixed(2)));
    }, 2400);
    return () => clearInterval(interval);
  }, [state.latencyMs, state.latencyJitter]);

  const handleSetSuperpower = (powerId: SuperpowerId) => {
    playKeyClick();
    dispatch({ type: "SET_SUPERPOWER", powerId });
    scheduleReset();
  };

  const handleSetApp = (app: FocusedAppId) => {
    playKeyClick();
    if (app === "finder") {
      dispatch({ type: "FOCUS_DESKTOP" });
    } else {
      dispatch({ type: "FOCUS_WINDOW", windowId: app });
    }
    scheduleReset();
  };

  const handleSetProtocol = (protocol: ProtocolId) => {
    playKeyClick();
    dispatch({ type: "SET_PROTOCOL", protocol });
    scheduleReset();
  };

  const activePower = SUPERPOWERS.find((p) => p.id === state.activeSuperpower) || SUPERPOWERS[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">

      {/* ── 10-Superpower Capsule Strip ──────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.5)] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#111111]">
              10 Tactile Core Superpowers
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A] hidden sm:inline">
            Click any power to test in live workstation
          </span>
        </div>

        {/* 5x2 Responsive Command Deck (All 10 Superpowers visible simultaneously on desktop) */}
        <div className="p-2 sm:p-2.5 rounded-2xl border border-black/[0.08] bg-white shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {SUPERPOWERS.map((power) => {
              const isSelected = state.activeSuperpower === power.id;
              const Icon = power.icon;
              return (
                <button
                  key={power.id}
                  onClick={() => handleSetSuperpower(power.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer select-none text-left min-h-[44px] ${
                    isSelected
                      ? "bg-[#111111] text-white border border-transparent shadow-xs"
                      : "bg-white border border-black/[0.08] text-[#333333] hover:bg-[#F4F4F5] hover:text-[#111111] hover:border-black/[0.14]"
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-white/20 text-white" : "bg-black/[0.04] text-[#71717A]"
                  }`}>
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-mono font-medium ${isSelected ? "text-white/60" : "text-[#888888]"}`}>{power.index}</span>
                      <span className={`font-semibold text-[10.5px] sm:text-[11px] truncate ${isSelected ? "text-white" : "text-[#111111]"}`}>{power.label}</span>
                    </div>
                    <span className={`text-[8px] sm:text-[8.5px] mt-0.5 truncate ${isSelected ? "text-amber-300 font-semibold" : "text-[#71717A]"}`}>
                      {power.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── App Tab Switcher (Context for Touch Bar & Desktop) ─────────────── */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center p-1 rounded-full border border-black/[0.08] bg-[#EBEBEB] shadow-xs">
          {APPS.map((app) => {
            const isSelected = state.focusedWindowId === app.id;
            return (
              <button
                key={app.id}
                onClick={() => handleSetApp(app.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "text-[#111111] font-semibold"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeAppTab"
                    className="absolute inset-0 bg-white rounded-full border border-black/[0.06] shadow-xs"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dual Device Layout ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">

        {/* Mac Screen (Liquid Retina XDR MacBook Pro) */}
        <div className="w-full min-w-0 lg:flex-1 max-w-[710px] lg:max-w-[720px] flex justify-center">
          <MacScreenContent
            state={state}
            dispatch={dispatch}
            scheduleReset={scheduleReset}
          />
        </div>

        {/* Warm Amber P2P Data Beam */}
        <div className="hidden lg:flex items-center flex-shrink-0 relative w-12">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D97706]/50 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.6)] animate-pulse" />
        </div>

        {/* Companion Phone (iPhone 16 Pro / Android) */}
        <div className="flex-shrink-0">
          <DeviceFrameSwitcher
            deviceOS={state.deviceOS}
            onToggleDevice={(os) => {
              playKeyClick();
              dispatch({ type: "SET_DEVICE", os });
            }}
          >
            <PhoneScreenContent
              state={state}
              dispatch={dispatch}
              scheduleReset={scheduleReset}
            />
          </DeviceFrameSwitcher>
        </div>
      </div>

      {/* ── Protocol + Telemetry Bar ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        {/* Protocol switcher */}
        <div className="flex items-center p-1 rounded-full border border-black/[0.08] bg-[#EBEBEB] shadow-xs">
          {PROTOCOLS.map((proto) => (
            <button
              key={proto.id}
              onClick={() => handleSetProtocol(proto.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-150 cursor-pointer ${
                state.protocol === proto.id
                  ? "text-[#111111]"
                  : "text-[#555555] hover:text-[#111111]"
              }`}
            >
              {state.protocol === proto.id && (
                <motion.div
                  layoutId="activeProtocol"
                  className="absolute inset-0 bg-white rounded-full border border-black/[0.06] shadow-xs"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 font-semibold">{proto.label}</span>
              <span className={`relative z-10 ${state.protocol === proto.id ? "text-[#D97706] font-bold" : "text-[#888888]"}`}>
                {proto.latency}
              </span>
            </button>
          ))}
        </div>

        {/* Live telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981] animate-pulse flex-shrink-0" />
          <span className="text-[11px] font-mono text-[#555555]">
            Bus Latency:{" "}
            <span className="text-[#111111] tabular-nums font-bold">
              {displayLatency.toFixed(2)}ms
            </span>{" "}
            <span className="text-[#888888]">
              ±{state.latencyJitter.toFixed(2)}ms
            </span>
          </span>
        </div>
      </div>

      {/* ── Subsystem Architecture Telemetry Deck ────────────────────────── */}
      <motion.div
        key={activePower.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-8 p-5 rounded-2xl border border-black/[0.08] bg-white shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97706]/10 border border-[#D97706]/25 flex items-center justify-center text-[#D97706]">
              <activePower.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.05] text-[#555555] font-medium">
                  FEATURE {activePower.index} / 10
                </span>
                <h4 className="text-sm font-bold font-mono text-[#111111]">
                  {activePower.label}
                </h4>
              </div>
              <p className="text-xs font-mono text-[#D97706] font-medium">
                {activePower.subsystem}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
            <span className="px-2 py-0.5 rounded-full bg-black/[0.03] border border-black/[0.06] text-[#555555]">
              Bridge: {activePower.api}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs font-sans text-[#555555] leading-relaxed">
          {activePower.subsystemDetail}
        </p>

        {/* Live Subsystem Architecture Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-black/[0.06] text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#888888] text-[9px] uppercase block font-medium">Transport Layer</span>
            <span className="text-[#111111] font-bold">Direct P2P Stream</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#888888] text-[9px] uppercase block font-medium">Security Architecture</span>
            <span className="text-emerald-600 font-bold">100% Local P2P</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#888888] text-[9px] uppercase block font-medium">System Integration</span>
            <span className="text-[#111111] font-bold">Native Driver Hook</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F8FA] border border-black/[0.06]">
            <span className="text-[#888888] text-[9px] uppercase block font-medium">Target Latency</span>
            <span className="text-[#D97706] font-bold">{activePower.tag}</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
