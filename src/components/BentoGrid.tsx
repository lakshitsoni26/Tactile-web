"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, ShieldCheck, Sparkles, Sliders, Smartphone, Terminal } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function BentoGrid() {
  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#FAFAFA]" id="features">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header — Resurf style */}
        <div className="mb-16 text-center">
          <div className="tag-badge mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08]">
            Everything you need. <span className="italic font-serif">Nothing you don’t.</span>
          </h2>
          <p className="mt-3 text-[16px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)]">
            Built for power users and engineers. Completely native, local-first, and designed to stay out of your flow.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Contextual Controls (Wide 2-col) */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-2 resurf-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="tag-badge">
                  <Sliders className="w-3 h-3 text-[#D97706]" />
                  <span>Context-Aware</span>
                </span>
                <span className="text-[12px] font-mono text-[#A1A1AA]">01</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#111111] mb-2.5">
                Dynamic Touch Bar & Macro Deck
              </h3>
              <p className="text-[#666666] text-[15px] leading-relaxed max-w-xl mb-6">
                Tactile instantly adapts to the active macOS application. Switch from VS Code to Figma, and your phone transforms from a Git commit runner to a vector inspector with zero manual switching.
              </p>
            </div>

            {/* Interactive preview pills */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-black/[0.05]">
              {["Git Commit (⌘↵)", "Format Prettier (⇧⌥F)", "Figma Auto-Layout (⇧A)", "Terminal Re-run (↑↵)"].map((action, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#F4F4F5] border border-black/[0.04] text-[#3F3F46]"
                >
                  {action}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: 100% Local-First & Privacy */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="resurf-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="tag-badge">
                  <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                  <span>Local-First</span>
                </span>
                <span className="text-[12px] font-mono text-[#A1A1AA]">02</span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#111111] mb-2.5">
                Your data stays on your desk.
              </h3>
              <p className="text-[#666666] text-[14px] leading-relaxed">
                Direct peer-to-peer streaming over your local Wi-Fi or USB-C. Zero cloud servers, no account logins, no telemetry, and zero tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/[0.05]">
              <div className="text-[12px] font-mono text-[#71717A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                100% Offline Capable
              </div>
            </div>
          </motion.div>

          {/* Card 3: Model Context Protocol (MCP) AI Bridge */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="resurf-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="tag-badge">
                  <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                  <span>AI Agent Bridge</span>
                </span>
                <span className="text-[12px] font-mono text-[#A1A1AA]">03</span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#111111] mb-2.5">
                Model Context Protocol (MCP)
              </h3>
              <p className="text-[#666666] text-[14px] leading-relaxed">
                Connect Claude Code, Cursor, and Codex directly to Tactile. Give your AI coding agents physical approval buttons and instant glanceable alerts on your desk.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-[#F4F4F5] border border-black/[0.05] font-mono text-[11px] text-[#3F3F46]">
              tactile mcp --listen-approvals
            </div>
          </motion.div>

          {/* Card 4: Precision Haptic Trackpad */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="resurf-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="tag-badge">
                  <Smartphone className="w-3 h-3 text-[#2563EB]" />
                  <span>Haptic Canvas</span>
                </span>
                <span className="text-[12px] font-mono text-[#A1A1AA]">04</span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#111111] mb-2.5">
                Precision Haptic Trackpad
              </h3>
              <p className="text-[#666666] text-[14px] leading-relaxed">
                Smooth 120Hz gesture surface. Pinch-to-zoom in Figma, 2-finger timeline scrubbing in DaVinci, and tactile click feedback through your phone’s vibration motor.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/[0.05]">
              <span className="text-[12px] text-[#71717A]">Multi-touch gesture recognized</span>
            </div>
          </motion.div>

          {/* Card 5: Glanceable Auxiliary Monitor (Wide 2-col) */}
          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-2 resurf-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="tag-badge">
                  <Layers className="w-3 h-3 text-[#D97706]" />
                  <span>Always-On Companion</span>
                </span>
                <span className="text-[12px] font-mono text-[#A1A1AA]">05</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#111111] mb-2.5">
                Glanceable Auxiliary Display
              </h3>
              <p className="text-[#666666] text-[15px] leading-relaxed max-w-xl mb-6">
                Never lose your terminal logs or build status behind full-screen editor windows again. Tactile gives you an always-visible, dedicated peripheral screen right under your line of sight.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-black/[0.05]">
              <div className="p-3 rounded-xl bg-[#F4F4F5] border border-black/[0.04] text-center">
                <div className="text-[16px] font-semibold text-[#111111]">60 FPS</div>
                <div className="text-[11px] text-[#71717A]">Smooth Display</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F4F5] border border-black/[0.04] text-center">
                <div className="text-[16px] font-semibold text-[#111111]">0 MB</div>
                <div className="text-[11px] text-[#71717A]">Cloud Data</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F4F5] border border-black/[0.04] text-center">
                <div className="text-[16px] font-semibold text-[#111111]">&lt; 1%</div>
                <div className="text-[11px] text-[#71717A]">CPU Overhead</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F4F5] border border-black/[0.04] text-center">
                <div className="text-[16px] font-semibold text-[#111111]">Universal</div>
                <div className="text-[11px] text-[#71717A]">iOS & Android</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
