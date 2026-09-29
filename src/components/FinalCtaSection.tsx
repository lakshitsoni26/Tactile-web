"use client";

import React from "react";
import { type WaitlistEntry } from "@/lib/waitlistStore";

interface FinalCtaSectionProps {
  onSuccessWaitlist: (entry: WaitlistEntry) => void;
  onOpenWaitlist?: () => void;
}

export default function FinalCtaSection({ onSuccessWaitlist, onOpenWaitlist }: FinalCtaSectionProps) {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center" id="download">
      <div className="flex flex-col items-center">
        {/* Headline in Signifier Serif */}
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[32px] sm:text-[40px] md:text-[46px] font-normal tracking-[-0.02em] text-[#111111] mb-5 leading-[1.1] max-w-xl">
          Turn your phone into your Mac’s missing companion.
        </h2>

        {/* Resurf 1:1 Solid Black Button */}
        <button
          onClick={onOpenWaitlist}
          className="inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap font-medium transition-all bg-[#111111] text-white hover:bg-[#262626] active:scale-[0.98] h-11 px-7 text-[15px] rounded-xl shadow-sm mb-4"
        >
          <span className="text-[17px] leading-none mb-0.5"></span>
          <span>Download for Mac</span>
        </button>

        {/* Resurf 1:1 Platform Subtitle */}
        <p className="text-[13px] text-[#71717A]">
          Free to try · macOS 14.3+ (Apple Silicon &amp; Intel) · Free companion on iPhone &amp; Android
        </p>
      </div>
    </section>
  );
}
