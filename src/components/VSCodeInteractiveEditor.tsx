"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Terminal as TermIcon, Trash2, X, ChevronRight, Play, CheckCircle,
  GitBranch, Sparkles, Check, Bug, ShieldCheck, Cpu
} from "lucide-react";
import type { DemoAction } from "@/lib/demoState";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

import type { VSCodeSharedState } from "@/lib/desktopState";

interface VSCodeInteractiveEditorProps {
  mode?: "desktop" | "mobile-mirror";
  isExecuting: boolean;
  lastAction?: DemoAction | null;
  lastActionTimestamp?: number;
  vscodeState?: VSCodeSharedState;
  onSelectTab?: (tabId: string) => void;
  onToggleTerminal?: () => void;
  onToggleBreakpoint?: () => void;
  onSetBranch?: (branch: string) => void;
}

interface FileTab {
  id: string;
  name: string;
  ext: string;
  color: string;
}

const FILES: FileTab[] = [
  { id: "core", name: "tactile-core.rs", ext: "rs", color: "#FF471A" },
  { id: "bridge", name: "bridge.ts", ext: "ts", color: "#3178C6" },
  { id: "cargo", name: "Cargo.toml", ext: "toml", color: "#E34C26" },
];

interface CodeToken {
  text: string;
  color?: string;
  bold?: boolean;
}

interface CodeLineItem {
  num: number;
  tokens: CodeToken[];
  highlight?: boolean;
}

const CODE_BUFFERS: Record<string, CodeLineItem[]> = {
  core: [
    { num: 1, tokens: [{ text: "use", color: "#A626A4" }, { text: " stream::channel::DirectP2P;", color: "#383A42" }] },
    { num: 2, tokens: [{ text: "use", color: "#A626A4" }, { text: " hid::TouchReport;", color: "#383A42" }] },
    { num: 3, tokens: [{ text: "" }] },
    { num: 4, tokens: [{ text: "pub fn", color: "#A626A4" }, { text: " init_bridge", color: "#4078F2" }, { text: "() -> ", color: "#383A42" }, { text: "Result<TactileBridge>", color: "#0184BC" }, { text: " {", color: "#383A42" }] },
    { num: 5, tokens: [{ text: "    let", color: "#A626A4" }, { text: " ch = ", color: "#383A42" }, { text: "DirectP2P", color: "#0184BC" }, { text: "::", color: "#383A42" }, { text: "connect", color: "#4078F2" }, { text: "()?;", color: "#383A42" }], highlight: true },
    { num: 6, tokens: [{ text: "    ch.", color: "#383A42" }, { text: "set_latency", color: "#4078F2" }, { text: "(", color: "#383A42" }, { text: "Duration", color: "#0184BC" }, { text: "::from_micros(", color: "#383A42" }, { text: "4180", color: "#986801" }, { text: "))?;", color: "#383A42" }] },
    { num: 7, tokens: [{ text: "    let", color: "#A626A4" }, { text: " screen = ", color: "#383A42" }, { text: "Screen", color: "#0184BC" }, { text: "::new(", color: "#383A42" }, { text: "1080", color: "#986801" }, { text: ", ", color: "#383A42" }, { text: "2400", color: "#986801" }, { text: ");", color: "#383A42" }] },
    { num: 8, tokens: [{ text: "    Ok", color: "#0184BC" }, { text: "(TactileBridge::new(ch, screen))", color: "#383A42" }] },
    { num: 9, tokens: [{ text: "}", color: "#383A42" }] },
    { num: 10, tokens: [{ text: "" }] },
    { num: 11, tokens: [{ text: "pub fn", color: "#A626A4" }, { text: " stream_frame", color: "#4078F2" }, { text: "(buf: &", color: "#383A42" }, { text: "FrameBuffer", color: "#0184BC" }, { text: ") {", color: "#383A42" }] },
    { num: 12, tokens: [{ text: "    self.stream.", color: "#383A42" }, { text: "render_buffer", color: "#4078F2" }, { text: "(buf.as_bytes());", color: "#383A42" }] },
    { num: 13, tokens: [{ text: "}", color: "#383A42" }] },
  ],
  bridge: [
    { num: 1, tokens: [{ text: "import", color: "#A626A4" }, { text: " { TactileStream } ", color: "#383A42" }, { text: "from", color: "#A626A4" }, { text: ' "@tactile/core";', color: "#50A14F" }] },
    { num: 2, tokens: [{ text: "export const", color: "#A626A4" }, { text: " bridge = ", color: "#383A42" }, { text: "new", color: "#A626A4" }, { text: " TactileStream", color: "#0184BC" }, { text: "({ latency: ", color: "#383A42" }, { text: "4.18", color: "#986801" }, { text: " });", color: "#383A42" }] },
    { num: 3, tokens: [{ text: "bridge.", color: "#383A42" }, { text: "on", color: "#4078F2" }, { text: "(", color: "#383A42" }, { text: '"frame"', color: "#50A14F" }, { text: ", (buf) => ", color: "#383A42" }, { text: "renderXDR", color: "#4078F2" }, { text: "(buf));", color: "#383A42" }] },
    { num: 4, tokens: [{ text: "bridge.", color: "#383A42" }, { text: "on", color: "#4078F2" }, { text: "(", color: "#383A42" }, { text: '"touch"', color: "#50A14F" }, { text: ", (ev) => ", color: "#383A42" }, { text: "dispatchHID", color: "#4078F2" }, { text: "(ev));", color: "#383A42" }] },
  ],
  cargo: [
    { num: 1, tokens: [{ text: "[package]", color: "#0184BC" }] },
    { num: 2, tokens: [{ text: 'name = "tactile-core"', color: "#50A14F" }] },
    { num: 3, tokens: [{ text: 'version = "0.4.2"', color: "#50A14F" }] },
    { num: 4, tokens: [{ text: 'edition = "2024"', color: "#50A14F" }] },
    { num: 5, tokens: [{ text: "" }] },
    { num: 6, tokens: [{ text: "[dependencies]", color: "#0184BC" }] },
    { num: 7, tokens: [{ text: 'tactile-stream = "1.0"', color: "#50A14F" }] },
  ],
};

export default function VSCodeInteractiveEditor({
  mode = "desktop",
  isExecuting,
  lastAction,
  lastActionTimestamp,
  vscodeState,
  onSelectTab,
  onToggleTerminal,
  onToggleBreakpoint,
  onSetBranch,
}: VSCodeInteractiveEditorProps) {
  const isDesktop = mode === "desktop";

  // Shared synchronized states with local fallback
  const [internalTab, setInternalTab] = useState("core");
  const [internalTerminal, setInternalTerminal] = useState(false);
  const [internalBreakpoint, setInternalBreakpoint] = useState(true);
  const [internalBranch, setInternalBranch] = useState("feat/dma");
  const [internalToast, setInternalToast] = useState<string | null>(null);
  const [internalShimmer, setInternalShimmer] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [buildProgress, setBuildProgress] = useState<number | null>(null);

  const activeTab = vscodeState ? vscodeState.activeTab : internalTab;
  const isTerminalOpen = vscodeState ? vscodeState.isTerminalOpen : internalTerminal;
  const hasBreakpoint = vscodeState ? vscodeState.hasBreakpoint : internalBreakpoint;
  const currentBranch = vscodeState ? vscodeState.currentBranch : internalBranch;
  const toastMessage = vscodeState?.toastMessage ?? internalToast;
  const isShimmering = vscodeState?.isShimmering ?? internalShimmer;

  // React to macro executions if not managed externally
  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.id === "command-palette") {
      setShowPalette(true);
      setTimeout(() => setShowPalette(false), 1600);
    } else if (lastAction.id === "cargo-build") {
      setBuildProgress(20);
      const t1 = setTimeout(() => setBuildProgress(70), 300);
      const t2 = setTimeout(() => {
        setBuildProgress(100);
        setTimeout(() => setBuildProgress(null), 1800);
      }, 700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [lastAction, lastActionTimestamp]);

  const handleTabClick = (tabId: string) => {
    playKeyClick();
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  const handleBreakpointClick = () => {
    playTapticClick(0);
    if (onToggleBreakpoint) {
      onToggleBreakpoint();
    } else {
      setInternalBreakpoint((prev) => !prev);
    }
  };

  const handleTerminalToggle = () => {
    playKeyClick();
    if (onToggleTerminal) {
      onToggleTerminal();
    } else {
      setInternalTerminal((prev) => !prev);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFC] text-[9.5px] font-mono select-none relative w-full h-full touch-manipulation text-[#383A42]">
      
      {/* ── Command Palette Overlay (Triggered by macro or shortcut) ── */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-8 inset-x-8 z-50 bg-white/95 border border-black/15 rounded-lg shadow-2xl p-2 flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-pulse" />
            <span className="text-[9px] text-[#111111] font-mono font-medium flex-1 truncate">
              &gt; Rust: Format Document (rustfmt 2024)
            </span>
            <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 font-medium">
              Applied
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action Toast Notification Banner ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className={`absolute ${isDesktop ? "top-8 right-3" : "bottom-6 inset-x-2"} z-50 bg-white/95 backdrop-blur-md border border-black/15 rounded-lg px-2.5 py-1.5 shadow-xl flex items-center gap-2 pointer-events-none text-[#111111]`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="text-[8px] font-mono text-[#111111] font-medium truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Build Progress Bar Overlay ── */}
      {buildProgress !== null && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-black/5 z-50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D97706] via-amber-500 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${buildProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* ── Tab Strip Bar ────────────────────────────────────────── */}
      <div className="h-7 bg-[#ECECEE] border-b border-black/[0.08] flex items-center px-1 gap-1 shrink-0 overflow-x-auto">
        {FILES.map((f) => {
          const isSelected = activeTab === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleTabClick(f.id)}
              className={`flex items-center gap-1.5 px-2.5 h-6 rounded-t transition-colors cursor-pointer border-t-2 ${
                isSelected
                  ? "bg-[#FAFAFC] border-[#D97706] text-[#111111] font-medium shadow-xs"
                  : "border-transparent text-[#666666] hover:text-[#111111] hover:bg-black/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
              <span className={`text-[8.5px] truncate ${isDesktop ? "max-w-[110px]" : "max-w-[75px]"}`}>
                {f.name}
              </span>
              {isDesktop && <X className="w-2.5 h-2.5 opacity-40 hover:opacity-100 ml-0.5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ── Editor Body (Sidebar + Code View) ───────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Left Explorer Sidebar (Desktop only) */}
        {isDesktop && (
          <div className="w-24 shrink-0 bg-[#F4F4F6] border-r border-black/[0.06] p-2 space-y-1 overflow-hidden select-none">
            <div className="text-[7.5px] text-[#888888] uppercase font-bold tracking-wider mb-1">Explorer</div>
            <div className="text-[#555555] text-[8px] flex items-center gap-1">
              <ChevronRight className="w-2.5 h-2.5 rotate-90 shrink-0" />
              <span>src/</span>
            </div>
            {FILES.map((f) => (
              <div
                key={f.id}
                onClick={() => handleTabClick(f.id)}
                className={`pl-3 text-[8px] truncate cursor-pointer transition-colors py-0.5 rounded ${
                  activeTab === f.id ? "text-[#0969DA] font-semibold bg-black/[0.05]" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                {f.name}
              </div>
            ))}
          </div>
        )}

        {/* Code Canvas */}
        <div className={`flex-1 p-2 bg-[#FAFAFC] overflow-hidden flex flex-col justify-between select-text cursor-text relative ${
          isShimmering ? "animate-pulse" : ""
        }`}>
          
          {/* Subtle formatting shimmer overlay */}
          {isShimmering && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent pointer-events-none"
            />
          )}

          <div className="space-y-0.5 overflow-hidden">
            {(CODE_BUFFERS[activeTab] || CODE_BUFFERS.core).slice(0, isDesktop ? 9 : 6).map((line) => (
              <div key={line.num} className="flex gap-2 text-[9px] leading-relaxed group">
                {/* Line Gutter with Breakpoint Dot */}
                <div
                  onClick={line.num === 5 ? handleBreakpointClick : undefined}
                  className="w-4 shrink-0 flex items-center justify-end gap-1 cursor-pointer select-none"
                >
                  {line.num === 5 && hasBreakpoint && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shadow-[0_0_6px_#E11D48] animate-pulse" />
                  )}
                  <span className="text-[#A0A1A7] group-hover:text-[#555555] text-[8.5px] font-mono">
                    {line.num}
                  </span>
                </div>

                {/* Syntax Highlighted Tokens */}
                <span className="font-mono truncate">
                  {line.tokens.map((t, idx) => (
                    <span key={idx} style={{ color: t.color || "#383A42" }}>
                      {t.text}
                    </span>
                  ))}
                  {line.num === 5 && (
                    <span className="w-[1.5px] h-3 bg-[#D97706] inline-block ml-0.5 animate-pulse align-middle" />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Editor Status Bar */}
          <div className="pt-1.5 border-t border-black/[0.06] flex items-center justify-between text-[7.5px] text-[#71717A] shrink-0 select-none bg-[#F4F4F6] px-1.5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-[#0969DA] font-semibold">⎇ {currentBranch}</span>
              {isDesktop && <span>UTF-8</span>}
            </div>
            <span>Ln 5, Col 18</span>
          </div>
        </div>
      </div>

      {/* ── Sliding Integrated Bottom Terminal Drawer ────────── */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isDesktop ? 100 : 64, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="border-t border-black/10 bg-[#F4F4F6] flex flex-col shrink-0 overflow-hidden"
          >
            {/* Terminal Drawer Header Bar */}
            <div className="h-5 bg-[#EBEBEF] border-b border-black/[0.06] px-2 flex items-center justify-between shrink-0 select-none text-[#333333]">
              <div className="flex items-center gap-2 text-[7.5px] font-bold">
                <span className="text-[#111111] border-b-2 border-[#D97706] pb-0.5">TERMINAL</span>
                {isDesktop && (
                  <>
                    <span className="text-[#777777] hover:text-[#111111] cursor-pointer">OUTPUT</span>
                    <span className="text-[#777777] hover:text-[#111111] cursor-pointer">DEBUG CONSOLE</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <X
                  onClick={handleTerminalToggle}
                  className="w-2.5 h-2.5 text-[#777777] hover:text-[#111111] cursor-pointer"
                />
              </div>
            </div>

            {/* Terminal Streaming Output */}
            <div className="flex-1 p-1.5 font-mono text-[7.5px] space-y-0.5 overflow-hidden leading-tight bg-white">
              <div className="text-[#0969DA] font-semibold">$ cargo test --package tactile-core</div>
              <div className="text-emerald-700 font-medium">    Finished test [unoptimized] in 0.42s</div>
              <div className="text-emerald-700 font-medium">test stream::channel::direct_p2p ... ok (4.18ms)</div>
              <div className="text-emerald-800 font-bold">test result: ok. 14 passed; 0 failed</div>
              <div className="flex items-center gap-1 text-[#333333] pt-0.5">
                <span className="font-semibold text-[#0969DA]">lakshit@mac %</span>
                <span className="w-1 h-2 bg-[#D97706] animate-pulse inline-block" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
