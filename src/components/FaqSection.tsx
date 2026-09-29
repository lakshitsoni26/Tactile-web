"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const faqs: FaqItem[] = [
  {
    tag: "Devices",
    question: "Does it require an iPad or does it work with my phone?",
    answer:
      "Tactile works with both Android phones and iPhones. While Apple Sidecar locks you into an expensive iPad, Tactile lets you reuse the high-resolution OLED screen already on your desk or in your pocket.",
  },
  {
    tag: "Connectivity",
    question: "Can I connect over USB or only Wi-Fi?",
    answer:
      "Both. For zero-latency responsiveness and simultaneous charging, connect with a standard USB-C cable. For wire-free convenience, Tactile connects automatically over your local Wi-Fi network.",
  },
  {
    tag: "AI Agents",
    question: "How does the Model Context Protocol (MCP) server work?",
    answer:
      "Tactile includes a built-in MCP server that registers with tools like Claude Code, Cursor, and Windsurf. Your AI coding agents can stream status notifications, build completions, and wait for one-tap approvals on your physical phone.",
  },
  {
    tag: "Battery & Performance",
    question: "Does running Tactile drain my laptop or phone battery?",
    answer:
      "Remarkably little. Tactile uses hardware-accelerated encoding and native AppKit APIs with under 1% CPU utilization on Apple Silicon Macs. When plugged into USB, your Mac charges your phone.",
  },
  {
    tag: "Privacy",
    question: "Is my screen content secure? Does data touch the cloud?",
    answer:
      "Zero cloud servers. 100% local peer-to-peer. Your display framebuffers and clipboard content never travel over the public internet. Everything stays strictly on your local desk.",
  },
  {
    tag: "Compatibility",
    question: "Which macOS versions and Macs are supported?",
    answer:
      "Tactile supports all modern Macs running macOS Sonoma (14.0+) or macOS Sequoia (15.0+), with native Apple Silicon optimization for M1, M2, M3, and M4 processors, as well as Intel Macs.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="tag-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>Questions & Answers</span>
        </div>
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08]">
          Frequently asked <span className="italic font-serif">questions.</span>
        </h2>
      </div>

      {/* FAQ items */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="resurf-card overflow-hidden !rounded-2xl transition-all duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 pr-4">
                  <span className="text-[12px] font-mono text-[#A1A1AA]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] font-medium text-[#111111]">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-45 bg-[#111111] text-white" : "bg-[#F4F4F5] text-[#71717A]"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#555555] leading-relaxed border-t border-black/[0.04]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
