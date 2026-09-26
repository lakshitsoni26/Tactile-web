"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Smartphone, Zap, ShieldCheck } from "lucide-react";
import { playKeyClick } from "@/lib/soundEngine";
import { type WaitlistEntry } from "@/lib/waitlistStore";

interface HeroSectionProps {
  onSuccessWaitlist?: (entry: WaitlistEntry) => void;
  onOpenWaitlist: () => void;
}

export default function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  const [platform, setPlatform] = useState<"mac" | "mobile" | "other">("mac");

  // Dynamic platform detection for native download labeling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|android/.test(ua)) {
      setPlatform("mobile");
    } else if (/macintosh|mac os x/.test(ua)) {
      setPlatform("mac");
    } else {
      setPlatform("other");
    }
  }, []);

  const handleDownloadClick = () => {
    playKeyClick();
    onOpenWaitlist();
  };

  const handleScrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    playKeyClick();
    const target = document.getElementById("experience");
    if (target) {
      const w = window as unknown as { __lenis?: { scrollTo: (el: HTMLElement, opts: { offset: number }) => void } };
      if (w.__lenis) {
        w.__lenis.scrollTo(target, { offset: -32 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 overflow-hidden"
      aria-label="Tactile Hero"
    >
      {/* =========================================================================
          LAYER 1: Aceternity-Inspired Ambient Warmth Glow
          Soft, expansive radial light that sets the calm editorial tone
          ========================================================================= */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] pointer-events-none rounded-full blur-[120px] opacity-60 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 0%, rgba(245, 158, 11, 0.16), rgba(254, 243, 199, 0.08) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle secondary violet ambient rim for optical depth */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[320px] pointer-events-none rounded-full blur-[140px] opacity-25 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(139, 92, 246, 0.12), transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          LAYER 2: Hairline Graph Grid with Radial Transparency Mask
          ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 35%, black 20%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 35%, black 20%, transparent 85%)",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          LAYER 3: Tactile SVG Paper Noise Texture
          ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.022] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          HERO CORE CONTENT CONTAINER
          ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[840px] mx-auto w-full">

        {/* ── Magic UI Style Shimmer Badge (No Spinning Paddle Bug) ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#111111] text-white text-[12.5px] font-medium shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-white/15 select-none mb-6 group overflow-hidden cursor-default"
        >
          {/* Periodic smooth shimmer sweep across badge */}
          <div
            className="absolute inset-0 animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="tracking-tight text-amber-300 font-semibold">Tactile v0.4.2</span>
          <span className="text-white/30">·</span>
          <span className="text-white/85 font-normal">#1 Mac Companion of the Day</span>
          <span className="text-white/40 group-hover:translate-x-0.5 transition-transform text-[11px] ml-0.5">→</span>
        </motion.div>

        {/* ── Editorial Display Headline — Instrument Serif (Fluid Clamp for all viewports 320px to 4K) ── */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2.5rem,7.5vw,5.35rem)] leading-[1.0] tracking-[-0.035em] text-[#111111] font-normal select-none text-balance"
        >
          Your Mac’s missing <span className="italic font-serif">companion.</span>
        </motion.h1>

        {/* ── Subtitle — Balanced Editorial Sans ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-center text-balance tracking-normal max-w-[580px] text-[16.5px] sm:text-[18px] text-[#52525B] leading-[1.58] font-[family-name:var(--font-inter)]"
        >
          Transform your phone into a zero-latency auxiliary display, contextual Touch Bar, and tactile companion controller for Mac. Native, direct DMA, and completely local-first.
        </motion.p>

        {/* ── Dual Ergonomic CTAs: Apple Pro Pill + Smooth Scroll to Sandbox ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full sm:w-auto px-4 sm:px-0"
        >
          {/* Primary CTA: Apple Pro Specular Pill */}
          <button
            onClick={handleDownloadClick}
            className="inline-flex items-center cursor-pointer justify-center gap-2.5 whitespace-nowrap font-medium transition-all bg-[#111111] text-white hover:bg-[#222224] active:scale-[0.98] h-[52px] w-full sm:w-auto px-8 text-[15px] rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_8px_rgba(0,0,0,0.10),0_12px_28px_-6px_rgba(0,0,0,0.18)]"
          >
            <span className="text-[18px] leading-none mb-0.5 shrink-0"></span>
            <span className="tracking-tight font-medium">
              {platform === "mac" ? "Download for Mac" : platform === "mobile" ? "Get Mac Companion" : "Download for macOS"}
            </span>
            <span className="text-[11px] font-mono text-white/50 bg-white/10 px-2 py-0.5 rounded-full ml-1 shrink-0 whitespace-nowrap">
              Free .dmg
            </span>
          </button>

          {/* Secondary CTA: Interactive Live Sandbox Anchor */}
          <a
            href="#experience"
            onClick={handleScrollToDemo}
            className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full bg-white/90 hover:bg-white text-[#18181B] font-medium text-[14.5px] border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.9)] hover:border-black/[0.16] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all group select-none w-full sm:w-auto"
            title="Explore the live dual-device sandbox below"
          >
            <span className="tracking-tight whitespace-nowrap">Explore Live Sandbox</span>
            <ArrowDown className="w-3.5 h-3.5 text-black/40 group-hover:text-black/80 group-hover:translate-y-0.5 transition-all shrink-0" />
          </a>
        </motion.div>

        {/* ── Platform Architecture & Compatibility Tagline ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[12px] text-[#71717A] font-mono select-none"
        >
          <span>macOS 14+ Sonoma & Sequoia</span>
          <span className="text-black/20">·</span>
          <span>Universal (Apple Silicon M1–M4 & Intel)</span>
          <span className="text-black/20">·</span>
          <span>Direct .dmg</span>
        </motion.div>

        {/* ── Unified Glass Telemetry & Trust Ribbon (Clean, Integrated, No Floating Clutter) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-5 md:gap-x-6 gap-y-2 px-6 py-2.5 rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-md border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03),inset_0_1px_0_0_rgba(255,255,255,0.85)] text-[12px] sm:text-[12.5px] text-[#52525B] select-none sm:whitespace-nowrap"
        >
          {/* Direct DMA Metric */}
          <div className="inline-flex items-center gap-2 font-medium whitespace-nowrap shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#18181B]">Direct USB DMA</span>
            <span className="font-mono text-[11px] text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              4.18ms
            </span>
          </div>

          <span className="text-black/20 hidden sm:inline select-none">·</span>

          {/* Apple Notarized */}
          <div className="inline-flex items-center gap-1.5 hover:text-[#111111] transition-colors whitespace-nowrap shrink-0">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Apple Notarized & Signed</span>
          </div>

          <span className="text-black/20 hidden sm:inline select-none">·</span>

          {/* OS Support */}
          <div className="inline-flex items-center gap-1.5 hover:text-[#111111] transition-colors whitespace-nowrap shrink-0">
            <Smartphone className="size-3.5 text-[#18181B]/50" />
            <span>iOS 17+ & Android 14+</span>
          </div>

          <span className="text-black/20 hidden sm:inline select-none">·</span>

          {/* Privacy */}
          <div className="inline-flex items-center gap-1.5 hover:text-[#111111] transition-colors whitespace-nowrap shrink-0">
            <Zap className="size-3.5 text-amber-500" />
            <span>100% Local · Zero Cloud</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
