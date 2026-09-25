"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DemoState } from "@/lib/demoState";
import {
  Zap, Play, Download, ShieldCheck, Check, Sparkles, Sliders, Wifi,
  Smartphone, Share2, Layers, MousePointer, Square, Circle, Type
} from "lucide-react";
import { playKeyClick, playTapticClick } from "@/lib/soundEngine";

import type { FigmaSharedState } from "@/lib/desktopState";

interface FigmaInteractiveCanvasProps {
  demoState: DemoState;
  mode?: "desktop" | "mobile-mirror";
  figmaState?: FigmaSharedState;
  onToggleLink?: () => void;
  onSetLink?: (linked: boolean) => void;
  onToggleSwitch?: () => void;
  onSelectLayer?: (layer: string) => void;
}

export default function FigmaInteractiveCanvas({
  demoState,
  mode = "desktop",
  figmaState,
  onToggleLink,
  onSetLink,
  onToggleSwitch,
  onSelectLayer,
}: FigmaInteractiveCanvasProps) {
  const isExecuting = demoState.status === "executing";
  const lastActionId = demoState.lastAction?.id;

  // Active macro states
  const isAutoLayout = lastActionId === "auto-layout";
  const isDetached = lastActionId === "detach-instance";
  const isExporting = lastActionId === "export-assets";
  const isPrototypeFlow = lastActionId === "prototype-flow";
  const isPresenting = lastActionId === "present-figma";
  const isSyncingTokens = lastActionId === "sync-tokens";

  const isDesktop = mode === "desktop";

  // Shared synchronized state with fallback for standalone instances
  const [internalConnected, setInternalConnected] = useState(false);
  const [internalToggle, setInternalToggle] = useState(true);
  const [internalLayer, setInternalLayer] = useState<string>("card");

  const primaryConnected = figmaState ? figmaState.isLinked : internalConnected;
  const toggleActive = figmaState ? figmaState.toggleActive : internalToggle;
  const selectedLayer = figmaState ? figmaState.selectedLayer : internalLayer;

  const handlePrimaryClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    playKeyClick();
    if (onToggleLink) {
      onToggleLink();
    } else {
      setInternalConnected((prev) => !prev);
    }
  };

  const handleCancelClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    playTapticClick(0);
    if (onSetLink) {
      onSetLink(false);
    } else {
      setInternalConnected(false);
    }
  };

  const handleToggleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    playTapticClick(0);
    if (onToggleSwitch) {
      onToggleSwitch();
    } else {
      setInternalToggle((prev) => !prev);
    }
  };

  const handleSelectLayer = (layer: string) => {
    playTapticClick(0);
    if (onSelectLayer) {
      onSelectLayer(layer);
    } else {
      setInternalLayer(layer);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full select-none overflow-hidden touch-manipulation ${
        isDesktop ? "bg-[#EDEDF0]" : "bg-[#F4F4F6]"
      }`}
    >
      {/* Background Subtle Dot Grid Canvas */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px)",
          backgroundSize: isDesktop ? "16px 16px" : "12px 12px",
        }}
      />

      {/* ── Figma Desktop Canvas Coordinates & Zoom Pill (Desktop Only) ── */}
      {isDesktop && (
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/90 border border-black/10 text-[8px] font-mono text-[#71717A] z-20 pointer-events-none shadow-xs">
          <span>100%</span>
          <span className="text-black/20">|</span>
          <span className="text-[#D97706] font-semibold">Frame 1</span>
        </div>
      )}

      {/* ── Main Wireframe Artboard (Touch-interactive on both Mac and Mobile) ── */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={() => handleSelectLayer("artboard")}
        className={`relative flex flex-col rounded-[26px] border transition-all duration-300 shadow-xl cursor-pointer touch-manipulation ${
          isDetached
            ? "border-[#3B82F6] bg-white shadow-[0_8px_30px_rgba(59,130,246,0.15)]"
            : isPresenting
            ? "border-emerald-500 bg-white shadow-[0_8px_30px_rgba(16,185,129,0.15)]"
            : "border-black/15 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
        } ${isDesktop ? "w-48 h-72" : "w-36 h-52"}`}
      >
        {/* Dynamic Island / Device Notch */}
        <div className={`flex items-center justify-between px-3 shrink-0 select-none ${
          isDesktop ? "h-6 bg-[#111111] rounded-t-[25px]" : "h-4 bg-[#111111] rounded-t-[25px]"
        }`}>
          <span className={`font-mono font-semibold text-white/90 ${isDesktop ? "text-[8px]" : "text-[6.5px]"}`}>
            9:41
          </span>
          <div className={`rounded-full bg-black/60 border border-white/20 flex items-center justify-center ${
            isDesktop ? "w-14 h-3" : "w-10 h-2"
          }`}>
            <span className="w-1 h-1 rounded-full bg-[#D97706] animate-pulse" />
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <Wifi className={`${isDesktop ? "w-2.5 h-2.5" : "w-2 h-2"}`} />
            <div className={`border border-white/80 rounded-[2px] p-[1px] ${isDesktop ? "w-3 h-1.5" : "w-2.5 h-1"}`}>
              <div className="h-full w-3/4 bg-white rounded-[0.5px]" />
            </div>
          </div>
        </div>

        {/* Artboard Screen Content */}
        <motion.div
          layout
          className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden bg-white ${
            isAutoLayout
              ? isDesktop ? "p-3 gap-2.5" : "p-2 gap-1.5"
              : isDesktop ? "p-2.5 gap-2" : "p-1.5 gap-1.5"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between shrink-0">
            <div className="space-y-0.5">
              <span className={`font-mono font-bold text-[#111111] tracking-tight ${isDesktop ? "text-[10px]" : "text-[7.5px]"}`}>
                Tactile Companion
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#D97706] animate-pulse" />
                <span className={`font-mono text-[#D97706] font-semibold ${isDesktop ? "text-[7.5px]" : "text-[6px]"}`}>
                  Direct P2P Link
                </span>
              </div>
            </div>

            {/* Live Toggle Pill */}
            <button
              onClick={handleToggleClick}
              className={`rounded-full flex items-center p-0.5 transition-colors cursor-pointer touch-manipulation active:scale-95 ${
                toggleActive ? "bg-[#D97706] text-white" : "bg-black/10 text-black/40"
              } ${isDesktop ? "w-8 h-4" : "w-6 h-3"}`}
            >
              <div
                className={`rounded-full bg-white shadow-xs transition-transform ${
                  toggleActive
                    ? isDesktop ? "translate-x-4 w-3 h-3" : "translate-x-3 w-2 h-2"
                    : isDesktop ? "translate-x-0 w-3 h-3" : "translate-x-0 w-2 h-2"
                }`}
              />
            </button>
          </div>

          {/* Hero Interactive Surface Card */}
          <motion.div
            layout
            onClick={(e) => {
              e.stopPropagation();
              handleSelectLayer("card");
            }}
            className={`rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden cursor-pointer touch-manipulation active:scale-[0.98] ${
              isPresenting
                ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                : isDetached
                ? "bg-blue-50/70 border-blue-300"
                : isAutoLayout
                ? "bg-amber-50/70 border-amber-300"
                : "bg-[#F8F8FA] border-black/[0.08]"
            } ${
              isAutoLayout
                ? isDesktop ? "h-28 p-2.5" : "h-18 p-1.5"
                : isDesktop ? "h-24 p-2" : "h-16 p-1.5"
            }`}
          >
            {/* Card Content */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[#111111] font-semibold ${isDesktop ? "text-[8.5px]" : "text-[6.5px]"}`}>
                  Direct Hardware Bridge
                </span>
                <span className={`font-mono text-emerald-700 font-bold bg-emerald-100/80 px-1 py-0.2 rounded ${isDesktop ? "text-[8px]" : "text-[6px]"}`}>
                  1000Hz HID
                </span>
              </div>
              <p className={`font-mono text-[#666666] leading-tight ${isDesktop ? "text-[7.5px]" : "text-[5.5px]"}`}>
                Zero-copy P2P streaming active
              </p>
            </div>

            {/* Animated Waveform Sine Graphic */}
            <div className={`w-full flex items-center justify-between gap-0.5 ${isDesktop ? "h-4" : "h-2.5"}`}>
              {[40, 75, 95, 60, 30, 85, 100, 70, 45, 90, 65, 35].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-full bg-gradient-to-t from-[#D97706] to-amber-300 opacity-85"
                />
              ))}
            </div>

            {/* Auto-layout 16px measurement guide */}
            {isAutoLayout && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-x-1 bottom-0.5 flex items-center justify-between pointer-events-none"
              >
                <div className="h-[1px] flex-1 bg-[#D97706]/60" />
                <span className="px-1 text-[6.5px] font-mono text-[#D97706] bg-white rounded border border-[#D97706]/40 shadow-xs">
                  16px
                </span>
                <div className="h-[1px] flex-1 bg-[#D97706]/60" />
              </motion.div>
            )}
          </motion.div>

          {/* ── TOUCHABLE CTA BUTTON GROUP ── */}
          <motion.div
            layout
            className={`flex items-center mt-auto ${
              isAutoLayout ? "gap-2" : "gap-1.5"
            }`}
          >
            {/* Primary Action Button (Fully touchable & interactive) */}
            <button
              onClick={handlePrimaryClick}
              className={`flex-1 rounded-full flex items-center justify-center font-mono font-bold transition-all duration-150 cursor-pointer touch-manipulation active:scale-95 active:translate-y-[1px] ${
                primaryConnected
                  ? "bg-emerald-600 text-white shadow-xs border border-emerald-600"
                  : isPresenting
                  ? "bg-[#D97706] text-white shadow-xs border border-[#D97706]"
                  : isDetached
                  ? "bg-[#3B82F6] text-white border border-[#3B82F6]"
                  : "bg-[#111111] text-white hover:bg-[#262626] border border-black"
              } ${isDesktop ? "h-6 text-[8.5px]" : "h-5 text-[6.5px]"}`}
            >
              {primaryConnected ? "✓ Linked" : isPresenting ? "Connected" : "Connect"}
            </button>

            {/* Secondary Action Button (Fully touchable & interactive) */}
            <button
              onClick={handleCancelClick}
              className={`flex-1 rounded-full border border-black/10 bg-[#F4F4F6] hover:bg-[#EAEAEA] text-[#555555] hover:text-[#111111] flex items-center justify-center font-mono font-medium transition-all duration-150 cursor-pointer touch-manipulation active:scale-95 ${
                isDesktop ? "h-6 text-[8.5px]" : "h-5 text-[6.5px]"
              }`}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>

        {/* ── Selection Handles & Bounding Outline ─────────────────────── */}
        <div
          className={`absolute -inset-1.5 border border-dashed rounded-[30px] pointer-events-none transition-colors duration-200 ${
            isDetached
              ? "border-[#3B82F6]"
              : isPresenting
              ? "border-emerald-500"
              : "border-[#D97706]"
          }`}
        />

        {/* 4 Corner Resize Nodes */}
        {[
          "-top-1 -left-1",
          "-top-1 -right-1",
          "-bottom-1 -left-1",
          "-bottom-1 -right-1",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} border border-white transition-all duration-200 shadow-xs ${
              isDetached
                ? "w-2.5 h-2.5 bg-[#3B82F6] rounded-full"
                : isPresenting
                ? "w-2 h-2 bg-emerald-500 rounded-sm"
                : "w-2 h-2 bg-[#D97706] rounded-sm"
            }`}
          />
        ))}

        {/* Prototype Flow 1 badge */}
        {isPrototypeFlow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`absolute -top-3 left-2 px-1.5 py-0.5 rounded-full bg-[#111111] text-white font-mono flex items-center gap-1 shadow-xs ${
              isDesktop ? "text-[8px]" : "text-[6.5px]"
            }`}
          >
            <Play className="w-2 h-2 fill-white" />
            <span>Flow 1</span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Export Assets Modal (Triggered by 'export' macro) ─────────── */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-8 top-12 z-30 bg-white/95 backdrop-blur-xl border border-black/10 rounded-xl p-3 shadow-2xl space-y-2 text-[#111111] font-mono"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
              <span className="text-[9px] font-bold">Export Selection</span>
              <Download className="w-3 h-3 text-emerald-600 animate-bounce" />
            </div>
            <div className="space-y-1 text-[8px] text-[#555555]">
              <div className="flex justify-between">
                <span>Frame: Hero Block</span>
                <span className="text-[#111111] font-bold">PNG @2x</span>
              </div>
              <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.75 }}
                  className="h-full bg-gradient-to-r from-[#D97706] to-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Token Sync Toast (Triggered by 'styles' macro) ────────────── */}
      <AnimatePresence>
        {isSyncingTokens && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 inset-x-6 z-30 bg-white/95 backdrop-blur-xl border border-black/10 rounded-lg p-2 shadow-xl flex items-center gap-2 text-[#111111] font-mono text-[8px]"
          >
            <Sparkles className="w-3 h-3 text-[#D97706] shrink-0" />
            <span className="truncate text-[#111111]">Design tokens exported to companion palette</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
