"use client";

import React from "react";
import { Check, ShieldCheck, ArrowUpRight } from "lucide-react";

interface PricingSectionProps {
  onOpenWaitlist: () => void;
}

export default function PricingSection({ onOpenWaitlist }: PricingSectionProps) {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="pricing">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="tag-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>Transparent Licensing</span>
        </div>
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08] mb-3">
          Simple, honest pricing. <br className="hidden sm:inline" />
          <span className="italic font-serif">Zero subscriptions.</span>
        </h2>
        <p className="text-[16px] text-[#666666] max-w-md mx-auto font-[family-name:var(--font-inter)]">
          Pay once, own forever. Free companion apps for both iOS and Android.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Beta Tier */}
        <div className="resurf-card p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                Community Beta
              </span>
              <span className="tag-badge !text-[11px]">Free</span>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-semibold text-[#111111] font-[family-name:var(--font-geist-sans)]">
                $0
              </div>
              <div className="text-xs text-[#71717A] mt-1 font-mono">
                Free during our early access private beta
              </div>
            </div>

            <ul className="space-y-3 text-[14px] text-[#555555] mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Connect 1 Mac + 1 phone companion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Standard Touch Bar profiles (VS Code, Figma)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Local Wi-Fi & zero-latency USB modes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Community Discord access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenWaitlist}
            className="btn-secondary-pill w-full justify-center !py-3 !text-sm cursor-pointer"
          >
            Claim Beta Spot
          </button>
        </div>

        {/* Lifetime License */}
        <div className="resurf-card p-8 flex flex-col justify-between bg-white border-2 border-black/[0.15] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase rounded-bl-xl">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">
                Supporter Lifetime
              </span>
              <span className="tag-badge-amber !text-[11px]">One-Time</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-[#111111] font-[family-name:var(--font-geist-sans)]">
                  $39
                </span>
                <span className="text-xs text-[#71717A] line-through font-mono">$59</span>
              </div>
              <div className="text-xs text-[#71717A] mt-1 font-mono">
                Pay once. Own it forever. Up to 2 Macs.
              </div>
            </div>

            <ul className="space-y-3 text-[14px] text-[#555555] mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="text-[#111111] font-medium">All future software updates included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Model Context Protocol (MCP) AI bridge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>120Hz haptic trackpad mode & custom gestures</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Direct email support from founder Lakshit</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenWaitlist}
            className="btn-primary-pill w-full justify-center !py-3 !text-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Supporter Pass</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </div>

      {/* Guarantee Banner */}
      <div className="mt-12 text-center text-xs text-[#71717A] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#15803D]" />
        <span>14-day no-questions-asked refund guarantee • Powered by Polar.sh</span>
      </div>
    </section>
  );
}
