"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { playKeyClick, playSwitchClick } from "@/lib/soundEngine";
import { useLenisLock } from "@/hooks/useLenisLock";

interface FounderManifestoProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist?: () => void;
}

export default function FounderManifesto({
  isOpen,
  onClose,
  onOpenWaitlist,
}: FounderManifestoProps) {
  useLenisLock(isOpen);
  const handleClose = useCallback(() => {
    playKeyClick();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          data-no-cursor-snap="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            data-no-cursor-snap="true"
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#08080C] border border-white/10 rounded-3xl shadow-[0_32px_96px_rgba(0,0,0,0.95),0_0_40px_rgba(255,85,0,0.06)] backdrop-blur-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Top Specular Rim */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/60 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-[#0B0B10] shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center font-black text-[11px] text-black shrink-0"
                  style={{
                    background: "linear-gradient(145deg, #39FF14 0%, #1DC900 100%)",
                    boxShadow: "0 0 10px rgba(57,255,20,0.35)",
                  }}
                >
                  T
                </div>
                <span className="text-xs font-mono text-[#39FF14] font-semibold uppercase tracking-wider">
                  Founder&apos;s Manifesto
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close manifesto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Essay Content */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="p-6 sm:p-8 overflow-y-auto overscroll-contain space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed font-sans scrollbar-thin scrollbar-thumb-white/10"
            >
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                  Dispatch #01 // San Francisco, CA
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  Why We Built Tactile: The Local-First Hardware Manifesto
                </h2>
              </div>

              <p className="text-zinc-300">
                Every software engineer and designer has experienced this: you are working at a cafe, an airport lounge, or a hotel desk. You open your laptop and immediately feel cramped. You need your terminal logs visible while editing code, or your Figma canvas alongside your browser inspector.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 font-mono text-xs text-zinc-400">
                <div className="text-zinc-200 font-semibold uppercase tracking-wider">
                  The Three Current &ldquo;Solutions&rdquo; (And Why They Fail):
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-white">1. Portable Monitors:</strong> Bulky slabs of plastic, extra cables, fragile kickstands, and heavy battery drain that kills your MacBook fast.
                  </p>
                  <p>
                    <strong className="text-white">2. Apple Sidecar:</strong> Artificially locked strictly to iPads. If you carry an Android phone, a Google Pixel, or an older tablet, you are locked out completely.
                  </p>
                  <p>
                    <strong className="text-white">3. Legacy Wi-Fi Apps:</strong> Jittery lag, compressed muddy artifacts, spinning laptop fans, and mandatory cloud login accounts.
                  </p>
                </div>
              </div>

              <p>
                Then we looked at the phone sitting on the desk next to the Mac. It has a gorgeous 120Hz OLED display, an ultra-fast modern GPU, and precision capacitive glass. <span className="text-white font-medium">It sits there 90% of the day doing nothing.</span>
              </p>

              <div className="border-l-2 border-[#39FF14] pl-4 py-1 italic text-zinc-200">
                &ldquo;Why buy another piece of glass when the best display you own is already in your pocket?&rdquo;
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight pt-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5500]" />
                The Breakthrough: Hardware-Accelerated Local Pipeline
              </h3>

              <p>
                To eliminate the lag that plagued previous apps, we designed an ultra-fast direct link over standard USB-C or Wi-Fi, combined with a hardware-accelerated frame buffer encoder.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#0e0e14] border border-[#39FF14]/20">
                  <div className="text-zinc-400 text-[10px] uppercase">Latency</div>
                  <div className="text-lg font-bold text-[#39FF14] mt-1">Sub-Frame</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">60–120 FPS</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0e14] border border-[#FF5500]/20">
                  <div className="text-zinc-400 text-[10px] uppercase">Host Overhead</div>
                  <div className="text-lg font-bold text-[#FF5500] mt-1">&lt; 1% CPU</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Zero Apple Silicon load</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0e14] border border-[#A855F7]/20">
                  <div className="text-zinc-400 text-[10px] uppercase">Input Sampling</div>
                  <div className="text-lg font-bold text-[#A855F7] mt-1">Multi-Touch</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Zero touch jitter</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight pt-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#39FF14]" />
                100% Local-First & Zero Cloud Relays
              </h3>

              <p>
                Engineers do not want proprietary screen data sent over cloud servers. Tactile is strictly <strong className="text-white">local-first</strong>. Your display frames, Touch Bar macros, and clipboard bridge never leave your physical USB cable or local encrypted Wi-Fi network. Zero accounts required. Zero telemetry on your code.
              </p>

              <div className="p-5 rounded-2xl bg-[#0f1018] border border-[#FF5500]/25 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <div className="font-semibold text-white text-sm">
                    Ready to turn your desk into a dual-screen studio?
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">
                    Founding Creator Batch now registering.
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSwitchClick();
                    handleClose();
                    if (onOpenWaitlist) onOpenWaitlist();
                    else {
                      const el = document.getElementById("hero");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #FF5500 0%, #FF8C00 100%)",
                    boxShadow: "0 0 20px rgba(255,85,0,0.40)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Claim Early Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#0a0a0f] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span>Tactile Engineering Team</span>
              <span>Local-First // macOS 14+ & Android 10+</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
