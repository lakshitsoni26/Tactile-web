"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Play, Braces, Terminal as TermIcon, LayoutGrid, Unlink,
  Download, Component, Zap, CheckCircle, Sparkles, Layers, Sliders, Volume2,
  ShieldCheck, Share2, Copy, Check, Cpu, Bug, Activity, Key, Trash2, History,
  Cloud, Maximize2, RotateCw, Code2, Folder, HardDrive,
  Mic, MicOff, Tv, ZoomIn, ZoomOut, Lock, Unlock, Eye, EyeOff,
  ChevronLeft, ChevronRight, Minimize2, Laptop, Shield, Wifi, Battery, Compass,
  RefreshCw, Sun, Pause, SkipForward
} from "lucide-react";
import type { DesktopState, DesktopEvent, CompanionMode } from "@/lib/desktopState";
import type { DemoAction } from "@/lib/demoState";
import { APP_PROFILES } from "@/lib/macroProfiles";
import {
  playKeyClick, playTapticClick, playScrollDetent, playAirDropChime, playWindowFocus
} from "@/lib/soundEngine";
import FigmaInteractiveCanvas from "./FigmaInteractiveCanvas";
import VSCodeInteractiveEditor from "./VSCodeInteractiveEditor";
import TerminalInteractiveShell from "./TerminalInteractiveShell";
import KnurledRotaryDial from "./KnurledRotaryDial";
import StreamingEngineView from "./superpowers/StreamingEngineView";
import ZoomPanEngineView from "./superpowers/ZoomPanEngineView";
import SpacesManagementView from "./superpowers/SpacesManagementView";
import ClipboardSyncView from "./superpowers/ClipboardSyncView";
import ClamshellEngineView from "./superpowers/ClamshellEngineView";
import MeetingMasterView from "./superpowers/MeetingMasterView";
import TransportInspectorView from "./superpowers/TransportInspectorView";
import MenuBarCompanionView from "./superpowers/MenuBarCompanionView";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitBranch, Play, Braces, Terminal: TermIcon, LayoutGrid, Unlink,
  Download, Component, Zap, CheckCircle, Sparkles, Layers, Cpu, Bug,
  Activity, Key, Trash2, History, Cloud, Maximize2, Code2, Folder, HardDrive,
};

function IconComponent({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name];
  return Icon ? <Icon className={className} /> : <Zap className={className} />;
}

function DesktopCompanionView({
  state,
  dispatch,
}: {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
}) {
  return (
    <div className="flex-1 flex flex-col justify-between p-2 bg-[#F8F9FA] overflow-hidden select-none font-sans relative text-[#111111]">
      {/* Subtle Warm Amber Ambient in Companion */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#D97706]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between shrink-0 pb-1 border-b border-black/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#111111]"></span>
          <div className="leading-tight">
            <div className="text-[8px] font-semibold text-[#111111] font-mono">MacBook Pro</div>
            <div className="text-[6.5px] font-mono text-[#71717A]">Sequoia · M4 Max</div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[6.5px] font-medium">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span>Desktop Synced</span>
        </div>
      </div>

      {/* System Telemetry Strips */}
      <div className="grid grid-cols-3 gap-1 my-1">
        <div className="p-1 rounded-lg bg-white border border-black/[0.06] shadow-xs flex flex-col">
          <span className="text-[6px] font-mono text-[#888888] uppercase">CPU</span>
          <span className="text-[7.5px] font-mono font-bold text-[#111111]">14.2%</span>
          <div className="w-full h-1 bg-black/[0.06] rounded-full mt-0.5 overflow-hidden">
            <div className="w-[14%] h-full bg-[#D97706] rounded-full" />
          </div>
        </div>

        <div className="p-1 rounded-lg bg-white border border-black/[0.06] shadow-xs flex flex-col">
          <span className="text-[6px] font-mono text-[#888888] uppercase">RAM</span>
          <span className="text-[7.5px] font-mono font-bold text-[#111111]">18.4 GB</span>
          <div className="w-full h-1 bg-black/[0.06] rounded-full mt-0.5 overflow-hidden">
            <div className="w-[28%] h-full bg-amber-500 rounded-full" />
          </div>
        </div>

        <div className="p-1 rounded-lg bg-white border border-black/[0.06] shadow-xs flex flex-col">
          <span className="text-[6px] font-mono text-[#888888] uppercase">P2P Stream</span>
          <span className="text-[7.5px] font-mono font-bold text-emerald-700">4.18ms</span>
          <div className="w-full h-1 bg-black/[0.06] rounded-full mt-0.5 overflow-hidden">
            <div className="w-[90%] h-full bg-emerald-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick App Launchers (1-Tap to open on Mac!) */}
      <div className="flex-1 flex flex-col justify-center gap-1 my-0.5">
        <span className="text-[6px] font-mono text-[#888888] uppercase tracking-wider font-semibold">
          Tap to Open App on Mac
        </span>

        {/* VS Code Launcher Card */}
        <button
          onClick={() => {
            playWindowFocus();
            dispatch({ type: "FOCUS_WINDOW", windowId: "vscode" });
          }}
          className="flex items-center justify-between p-1 rounded-lg bg-white hover:bg-[#F2F2F5] border border-black/[0.08] shadow-xs text-left transition-all cursor-pointer touch-manipulation active:scale-[0.97]"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-[#007ACC] flex items-center justify-center text-white shadow-xs">
              <Code2 className="w-2.5 h-2.5" />
            </div>
            <div>
              <div className="text-[7px] font-bold text-[#111111] font-mono">VS Code</div>
              <div className="text-[5.5px] text-[#71717A] font-mono">tactile-core.rs · Rust</div>
            </div>
          </div>
          <span className="text-[6px] font-mono text-[#0969DA] bg-blue-50 px-1 py-0.5 rounded border border-blue-200 font-medium">
            Launch ↗
          </span>
        </button>

        {/* Figma Launcher Card */}
        <button
          onClick={() => {
            playWindowFocus();
            dispatch({ type: "FOCUS_WINDOW", windowId: "figma" });
          }}
          className="flex items-center justify-between p-1 rounded-lg bg-white hover:bg-[#F2F2F5] border border-black/[0.08] shadow-xs text-left transition-all cursor-pointer touch-manipulation active:scale-[0.97]"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-[#F24E1E] flex items-center justify-center text-white shadow-xs">
              <Component className="w-2.5 h-2.5" />
            </div>
            <div>
              <div className="text-[7px] font-bold text-[#111111] font-mono">Figma</div>
              <div className="text-[5.5px] text-[#71717A] font-mono">Tactile UI Kit · Frame</div>
            </div>
          </div>
          <span className="text-[6px] font-mono text-[#EA580C] bg-orange-50 px-1 py-0.5 rounded border border-orange-200 font-medium">
            Launch ↗
          </span>
        </button>

        {/* Terminal Launcher Card */}
        <button
          onClick={() => {
            playWindowFocus();
            dispatch({ type: "FOCUS_WINDOW", windowId: "terminal" });
          }}
          className="flex items-center justify-between p-1 rounded-lg bg-white hover:bg-[#F2F2F5] border border-black/[0.08] shadow-xs text-left transition-all cursor-pointer touch-manipulation active:scale-[0.97]"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-[#1E293B] flex items-center justify-center text-white shadow-xs">
              <TermIcon className="w-2.5 h-2.5" />
            </div>
            <div>
              <div className="text-[7px] font-bold text-[#111111] font-mono">Terminal</div>
              <div className="text-[5.5px] text-[#71717A] font-mono">zsh · 80x24</div>
            </div>
          </div>
          <span className="text-[6px] font-mono text-[#0969DA] bg-blue-50 px-1 py-0.5 rounded border border-blue-200 font-medium">
            Launch ↗
          </span>
        </button>
      </div>

      {/* Footer AirDrop Shelf Preview */}
      <div className="pt-1 border-t border-black/[0.06] flex items-center justify-between text-[6px] font-mono text-[#71717A]">
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <Share2 className="w-2 h-2" />
          <span>AirDrop Ready (2 Files)</span>
        </span>
        <span
          onClick={() => {
            playKeyClick();
            dispatch({ type: "SET_COMPANION_MODE", mode: "airdrop" });
          }}
          className="text-[#00F0FF] hover:underline cursor-pointer"
        >
          Receive ↗
        </span>
      </div>
    </div>
  );
}

interface PhoneScreenContentProps {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
  scheduleReset: () => void;
}

export default function PhoneScreenContent({
  state,
  dispatch,
  scheduleReset,
}: PhoneScreenContentProps) {
  const trackpadRef = useRef<HTMLDivElement>(null);
  const [copiedPill, setCopiedPill] = useState(false);
  const [touchPoint, setTouchPoint] = useState<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{
    x: number;
    y: number;
    time: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Persistent mutable cursor coordinate ref to avoid React state closure jank
  const cursorPosRef = useRef({ x: state.trackpadCursor.x, y: state.trackpadCursor.y });
  useEffect(() => {
    cursorPosRef.current = { x: state.trackpadCursor.x, y: state.trackpadCursor.y };
  }, [state.trackpadCursor.x, state.trackpadCursor.y]);

  // Active focused app profile
  const focusedAppId = state.focusedWindowId;
  const currentProfile = APP_PROFILES[focusedAppId] || APP_PROFILES.vscode;
  const isExecuting = state.status === "executing";

  // Macro click/touch handler
  const handleMacroAction = (action: DemoAction) => {
    if (state.status === "executing") return;
    playKeyClick();
    dispatch({ type: "EXECUTE_ACTION", action });
    scheduleReset();
    setTimeout(() => dispatch({ type: "RESOLVE_ACTION" }), action.duration);
  };

  // Ballistic relative delta trackpad handler (120 FPS zero-jank)
  const handleTrackpadPointerDown = (e: React.PointerEvent) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = trackpadRef.current?.getBoundingClientRect();
    if (rect) {
      setTouchPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    lastTouchRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      startX: e.clientX,
      startY: e.clientY,
    };

    playTapticClick(0);
    dispatch({
      type: "SET_TRACKPAD_CURSOR",
      x: cursorPosRef.current.x,
      y: cursorPosRef.current.y,
      isDown: true,
      isVisible: true,
    });
  };

  const handleTrackpadPointerMove = (e: React.PointerEvent) => {
    if (!lastTouchRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastTouchRef.current.time);
    const rawDx = e.clientX - lastTouchRef.current.x;
    const rawDy = e.clientY - lastTouchRef.current.y;

    const rect = trackpadRef.current?.getBoundingClientRect();
    if (rect) {
      setTouchPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    // Ballistic velocity curve (precision slow, accelerated fast)
    const dist = Math.hypot(rawDx, rawDy);
    const speed = dist / dt;
    const accel = 1.0 + Math.min(1.8, speed * 1.1);

    const deltaX = rawDx * accel * 1.6;
    const deltaY = rawDy * accel * 1.6;

    // Apply delta directly to mutable ref clamped to [12, 698] on X and [26, 436] on Y
    cursorPosRef.current.x = Math.max(12, Math.min(698, Math.round(cursorPosRef.current.x + deltaX)));
    cursorPosRef.current.y = Math.max(26, Math.min(436, Math.round(cursorPosRef.current.y + deltaY)));

    lastTouchRef.current.x = e.clientX;
    lastTouchRef.current.y = e.clientY;
    lastTouchRef.current.time = now;

    dispatch({
      type: "SET_TRACKPAD_CURSOR",
      x: cursorPosRef.current.x,
      y: cursorPosRef.current.y,
      isDown: true,
      isVisible: true,
    });
  };

  const handleTrackpadPointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const touch = lastTouchRef.current;
    lastTouchRef.current = null;
    setTouchPoint(null);

    // If total travel was under 6px, execute TAP-TO-CLICK on Mac screen!
    if (touch) {
      const travelDist = Math.hypot(e.clientX - touch.startX, e.clientY - touch.startY);
      if (travelDist < 6) {
        playKeyClick();
        playTapticClick(1);
        dispatch({
          type: "TRACKPAD_CLICK",
          x: cursorPosRef.current.x,
          y: cursorPosRef.current.y,
        });
      }
    }

    dispatch({
      type: "SET_TRACKPAD_CURSOR",
      x: cursorPosRef.current.x,
      y: cursorPosRef.current.y,
      isDown: false,
      isVisible: true,
    });
  };

  const handleCopyClipboard = () => {
    playKeyClick();
    setCopiedPill(true);
    setTimeout(() => setCopiedPill(false), 1600);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFC] select-none text-[#111111] overflow-hidden touch-manipulation">
      
      {/* ── MODE SELECTOR CAPSULE / SUPERPOWER INDICATOR ──────────────────── */}
      <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1.5 bg-[#ECECEE] border-b border-black/[0.08] flex-shrink-0">
        {state.activeSuperpower === "touchbar" ? (
          <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#E0E0E2] border border-black/[0.06] text-[8.5px] font-mono">
            {(["touchbar", "trackpad", "sidecar", "airdrop"] as CompanionMode[]).map((mode) => {
              const isActive = state.companionMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "SET_COMPANION_MODE", mode });
                  }}
                  className={`px-2 py-0.5 rounded-full transition-all capitalize cursor-pointer touch-manipulation active:scale-95 ${
                    isActive
                      ? "bg-[#D97706] text-white font-bold shadow-xs"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  {mode === "touchbar" ? "TouchBar" : mode}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] font-mono font-bold text-[#111111] bg-white px-2.5 py-0.5 rounded-full border border-black/[0.08] flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse shadow-[0_0_6px_#D97706]" />
              <span className="capitalize">{state.activeSuperpower}</span>
            </span>
            <button
              onClick={() => {
                playWindowFocus();
                dispatch({ type: "SET_SUPERPOWER", powerId: "touchbar" });
              }}
              className="text-[8px] font-mono text-[#71717A] hover:text-[#111111] underline cursor-pointer"
            >
              Back to Deck
            </button>
          </div>
        )}

        <span className="text-[8px] font-mono text-[#D97706] font-semibold tracking-wider">
          4.18ms P2P
        </span>
      </div>

      {/* ── SUPERPOWER VIEWS DISPATCHER WITH FLUID ANIMATION ──────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.activeSuperpower + (state.activeSuperpower === "touchbar" ? `-${state.companionMode}` : "")}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {state.activeSuperpower === "streaming" && (
            <StreamingEngineView state={state} dispatch={dispatch} />
          )}

          {state.activeSuperpower === "zoom" && (
            <ZoomPanEngineView state={state} dispatch={dispatch} />
          )}

      {state.activeSuperpower === "spaces" && (
        <SpacesManagementView state={state} dispatch={dispatch} />
      )}

      {state.activeSuperpower === "clipboard" && (
        <ClipboardSyncView state={state} dispatch={dispatch} />
      )}

      {state.activeSuperpower === "clamshell" && (
        <ClamshellEngineView state={state} dispatch={dispatch} />
      )}

      {state.activeSuperpower === "meeting" && (
        <MeetingMasterView state={state} dispatch={dispatch} />
      )}

      {state.activeSuperpower === "transport" && (
        <TransportInspectorView state={state} dispatch={dispatch} />
      )}

      {state.activeSuperpower === "menubar" && (
        <MenuBarCompanionView state={state} dispatch={dispatch} />
      )}

      {/* ── SUPERPOWER 5: CONTEXTUAL TOUCH BAR & ROTARY SCRUBBER ─────────── */}
      {state.activeSuperpower === "touchbar" && state.companionMode === "touchbar" && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* 0% Video Mode Status Banner */}
          {state.superpowerTelemetry.touchbar.zeroVideoMode && (
            <div className="bg-purple-50 border-b border-purple-200/80 px-2 py-0.5 flex items-center justify-between text-[6.5px] font-mono text-purple-900 font-medium shrink-0">
              <span>0% Video Mode Active (Display Stream Paused)</span>
              <span className="text-emerald-700 font-bold">&lt;0.5% Batt/hr</span>
            </div>
          )}
          
          {/* Upper Auxiliary Mirrored Screen (~54%) — Fully Touchable Mirror */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-black/[0.08] relative min-h-0 bg-[#FAFAFC] touch-manipulation">
            {focusedAppId === "vscode" && (
              <VSCodeInteractiveEditor
                mode="mobile-mirror"
                isExecuting={isExecuting}
                lastAction={state.lastAction}
                lastActionTimestamp={state.lastActionTimestamp}
                vscodeState={state.vscodeState}
                onSelectTab={(tabId) => dispatch({ type: "VSCODE_SET_TAB", tabId })}
                onToggleTerminal={() => dispatch({ type: "VSCODE_TOGGLE_TERMINAL" })}
                onToggleBreakpoint={() => dispatch({ type: "VSCODE_TOGGLE_BREAKPOINT" })}
                onSetBranch={(branch) => dispatch({ type: "VSCODE_SET_BRANCH", branch })}
              />
            )}

            {focusedAppId === "figma" && (
              <div className="flex-1 w-full h-full relative overflow-hidden">
                <FigmaInteractiveCanvas
                  demoState={{
                    activeApp: "figma",
                    activeProtocol: state.protocol,
                    deviceOS: state.deviceOS,
                    status: state.status,
                    lastAction: state.lastAction,
                    lastActionTimestamp: state.lastActionTimestamp,
                    activityLog: [],
                    latencyMs: state.latencyMs,
                    latencyJitter: state.latencyJitter,
                  }}
                  mode="mobile-mirror"
                  figmaState={state.figmaState}
                  onToggleLink={() => dispatch({ type: "FIGMA_TOGGLE_LINK" })}
                  onSetLink={(isLinked) => dispatch({ type: "FIGMA_SET_LINK", isLinked })}
                  onToggleSwitch={() => dispatch({ type: "FIGMA_TOGGLE_SWITCH" })}
                  onSelectLayer={(layer) => dispatch({ type: "FIGMA_SELECT_LAYER", layer })}
                />
              </div>
            )}

            {focusedAppId === "terminal" && (
              <TerminalInteractiveShell
                mode="mobile-mirror"
                isExecuting={isExecuting}
                lastAction={state.lastAction}
                lastActionTimestamp={state.lastActionTimestamp}
                terminalState={state.terminalState}
                onAddCommand={(item) => dispatch({ type: "TERMINAL_ADD_COMMAND", item })}
                onClear={() => dispatch({ type: "TERMINAL_CLEAR" })}
              />
            )}

            {focusedAppId === "finder" && (
              <DesktopCompanionView
                state={state}
                dispatch={dispatch}
              />
            )}
          </div>

          {/* Middle: 3D Knurled Mechanical Rotary Dial (Teenage Engineering style) */}
          <KnurledRotaryDial
            value={state.rotaryControls.volume}
            onChange={(val) => dispatch({ type: "SET_ROTARY_VALUE", control: "volume", value: val })}
            label="HAPTIC DIAL"
            unit="%"
            size={40}
          />

          {/* Lower 40%: Context-Aware 2x4 Macro Button Grid */}
          <div className="px-2 pt-1 pb-2 bg-[#ECECEE] border-t border-black/[0.08] shrink-0">
            <div className="w-8 h-[2px] bg-black/15 rounded-full mx-auto mb-1.5" />
            
            <div className="grid grid-cols-4 gap-1">
              {currentProfile.macros.slice(0, 8).map((macro) => {
                const isActive = isExecuting && state.lastAction?.id === macro.action.id;
                const accentColor = macro.color || "#D97706";

                return (
                  <button
                    key={macro.id}
                    onClick={() => handleMacroAction(macro.action)}
                    disabled={isExecuting}
                    style={{
                      borderColor: isActive ? "#111111" : "rgba(0,0,0,0.08)",
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,0,0,0.15)"
                        : "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                    className={`flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-0.5 border transition-all cursor-pointer touch-manipulation active:scale-[0.93] active:translate-y-[1px] ${
                      isActive
                        ? "bg-[#111111] text-white scale-[0.96]"
                        : isExecuting
                        ? "bg-[#F0F0F2] text-[#999999] cursor-not-allowed"
                        : "bg-white hover:bg-[#F9F9FA] text-[#111111]"
                    }`}
                  >
                    <span style={{ color: isActive ? "#ffffff" : accentColor }}>
                      <IconComponent name={macro.icon} className="w-3 h-3" />
                    </span>
                    <span className={`text-[7.5px] font-mono leading-none truncate max-w-full font-medium ${
                      isActive ? "text-white" : "text-[#222222]"
                    }`}>
                      {macro.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── SUPERPOWER 2: INTERACTIVE GLASS TRACKPAD ─────────────────────── */}
      {(state.activeSuperpower === "trackpad" || (state.activeSuperpower === "touchbar" && state.companionMode === "trackpad")) && (
        <div
          ref={trackpadRef}
          onPointerDown={handleTrackpadPointerDown}
          onPointerMove={handleTrackpadPointerMove}
          onPointerUp={handleTrackpadPointerUp}
          onPointerCancel={handleTrackpadPointerUp}
          className="flex-1 relative flex flex-col justify-between p-3 bg-gradient-to-b from-[#FAFAFC] to-[#EDEDF0] text-[#111111] cursor-crosshair overflow-hidden touch-none select-none"
        >
          {/* Glass Texture Micro-Dots */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Header Telemetry */}
          <div className="flex items-center justify-between text-[7px] font-mono text-[#71717A] pointer-events-none shrink-0">
            <span className="text-[#D97706] font-semibold">HID 1000Hz · Relative Ballistics</span>
            {state.superpowerTelemetry.trackpad.axisLock !== "none" ? (
              <span className="text-amber-700 font-bold bg-amber-100 px-1 py-0.2 rounded border border-amber-300">
                [AXIS-LOCKED: {state.superpowerTelemetry.trackpad.axisLock.toUpperCase()}]
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">Liquid Inertia</span>
            )}
            <span>Tap to Click</span>
          </div>

          {/* Sub-Pixel Contact Ripple Animation */}
          {touchPoint && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ left: touchPoint.x - 20, top: touchPoint.y - 20 }}
              className="absolute w-10 h-10 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 shadow-[0_0_12px_rgba(217,119,6,0.3)] pointer-events-none"
            />
          )}

          {/* Center Haptic Glass Legend */}
          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none opacity-50 my-auto text-[#555555]">
            <div className="w-8 h-8 rounded-full border border-dashed border-black/20 flex items-center justify-center text-[10px]">
              ✥
            </div>
            <span className="text-[7.5px] font-mono text-center leading-relaxed">
              Glide thumb anywhere to drive Mac cursor
            </span>
          </div>

          {/* Bottom Live Coordinate Telemetry */}
          <div className="flex items-center justify-between pt-1.5 border-t border-black/[0.06] text-[7px] font-mono text-[#71717A] pointer-events-none shrink-0">
            <span>X: {state.trackpadCursor.x}px</span>
            <span className="text-emerald-700 font-semibold">Zero-Lag DMA</span>
            <span>Y: {state.trackpadCursor.y}px</span>
          </div>
        </div>
      )}

      {/* ── SUPERPOWER 3: SIDECAR AUXILIARY DISPLAY ───────────────────────── */}
      {state.activeSuperpower === "touchbar" && state.companionMode === "sidecar" && (
        <div className="flex-1 flex flex-col justify-between p-3 bg-[#F8F9FA] text-[#111111] text-center overflow-hidden touch-manipulation">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[7.5px] font-mono font-semibold">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sidecar Display Linked</span>
            </div>
            <div className="text-[10px] font-mono font-semibold text-[#111111]">
              Auxiliary Monitor Active
            </div>
            <div className="text-[7.5px] font-mono text-[#71717A]">
              1080x2400 Super Retina OLED · 60 FPS
            </div>
          </div>

          {/* Mini Simulated Content */}
          <div className="my-2 p-2 rounded-xl bg-white border border-black/[0.08] shadow-xs text-left">
            <div className="flex items-center gap-1 text-[7.5px] font-mono font-semibold text-[#111111] mb-1">
              <Laptop className="w-3 h-3 text-[#D97706]" />
              <span>Extended Desktop View</span>
            </div>
            <p className="text-[6.5px] font-sans text-[#555555] leading-relaxed">
              Touch to interact directly with macOS windows mirrored on phone display.
            </p>
          </div>

          <div className="text-[7px] font-mono text-[#888888]">
            Direct GPU Zero-Copy Stream
          </div>
        </div>
      )}

      {/* ── SUPERPOWER 4: AIRDROP & CLIPBOARD RECEIVER ────────────────────── */}
      {state.activeSuperpower === "touchbar" && state.companionMode === "airdrop" && (
        <div className="flex-1 flex flex-col justify-between p-2.5 bg-[#F8F9FA] text-[#111111] overflow-hidden">
          {/* AirDrop Drop Target Card */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-xs text-center relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Share2 className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-[8.5px] font-mono font-semibold text-[#111111]">
              AirDrop DMA Receiver
            </div>
            <div className="text-[7px] font-mono text-[#71717A]">
              Drag desktop files from Mac to transfer
            </div>

            {/* Received files list */}
            {state.airdropFiles.some((f) => f.status === "received") && (
              <div className="w-full mt-1 pt-1.5 border-t border-black/[0.08] space-y-1 text-left">
                {state.airdropFiles
                  .filter((f) => f.status === "received")
                  .map((f) => (
                    <div key={f.id} className="flex items-center justify-between text-[7px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-black/[0.06]">
                      <span className="truncate">{f.name}</span>
                      <span className="font-semibold">✓ 10 Gbps</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Universal Live Clipboard Card */}
          <div className="rounded-xl border border-black/[0.08] bg-white p-2 flex flex-col gap-1.5 text-left shadow-xs">
            <div className="flex items-center justify-between text-[7px] font-mono text-[#71717A]">
              <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                <Copy className="w-2.5 h-2.5" />
                <span>Universal Clipboard</span>
              </span>
              <span>Instant</span>
            </div>

            <div className="p-1.5 rounded bg-[#F4F4F6] border border-black/[0.04] font-mono text-[7.5px] text-[#111111] truncate">
              {state.clipboardContent}
            </div>

            <button
              onClick={handleCopyClipboard}
              className="w-full py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-white text-[7.5px] font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors touch-manipulation active:scale-95 shadow-xs"
            >
              {copiedPill ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Pasted to Terminal!</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" />
                  <span>Paste &amp; Execute on Mac</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
