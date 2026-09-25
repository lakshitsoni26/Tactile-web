"use client";

import { Download, Smartphone, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install on Mac",
    description: "Download the native Mac app. Lightweight, fast, zero kernel extensions, and zero account logins required.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Place phone nearby",
    description: "Launch the companion on iOS or Android. Instant peer-to-peer discovery over local Wi-Fi or zero-latency USB cable.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Tactile flow active",
    description: "Your phone immediately becomes an auxiliary glanceable monitor, contextual macro deck, and precision trackpad.",
  },
];

export default function TerminalQuickstart() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section label */}
      <div className="text-center mb-14">
        <div className="tag-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>Frictionless Setup</span>
        </div>
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08]">
          Up and running in <span className="italic font-serif">60 seconds.</span>
        </h2>
        <p className="mt-3 text-[15px] text-[#666666] max-w-md mx-auto">
          No cloud servers. No subscriptions. No extra hardware to buy.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="resurf-card p-7 group"
            >
              {/* Number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[12px] font-mono font-medium tracking-wider text-[#A1A1AA]">
                  {step.number}
                </span>
                <div className="w-9 h-9 rounded-full bg-[#F4F4F5] border border-black/[0.04] flex items-center justify-center text-[#18181B] group-hover:bg-black group-hover:text-white transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-[17px] font-semibold text-[#111111] mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
