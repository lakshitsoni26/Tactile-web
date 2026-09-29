"use client";

import React from "react";
import Link from "next/link";
import LakshitSignature from "./LakshitSignature";

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/[0.06] py-10 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand + Lakshit Signature */}
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 select-none">
            <div className="w-[16px] h-[16px] rounded-[4px] bg-[#111111] flex items-center justify-center text-white shadow-xs">
              <div className="w-[5px] h-[5px] rounded-[1.5px] bg-[#D97706]" />
            </div>
            <span className="text-xs font-semibold text-[#111111] tracking-tight">
              Tactile © 2026.
            </span>
          </Link>

          <div className="h-3 w-px bg-black/10" />

          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <span className="italic font-[family-name:var(--font-instrument-serif)]">Crafted by</span>
            <LakshitSignature width={80} height={26} color="#18181B" />
          </div>
        </div>

        {/* Right: Resurf 1:1 Horizontal Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[12.5px] text-[#71717A]">
          <Link href="/story" className="hover:text-[#111111] transition-colors">
            Story
          </Link>
          <Link href="/compare" className="hover:text-[#111111] transition-colors">
            Compare
          </Link>
          <Link href="/roadmap" className="hover:text-[#111111] transition-colors">
            Roadmap
          </Link>
          <Link href="/#capabilities" className="hover:text-[#111111] transition-colors">
            Capabilities
          </Link>
          <Link href="/#surfaces" className="hover:text-[#111111] transition-colors">
            Surfaces
          </Link>
          <Link href="/pricing" className="hover:text-[#111111] transition-colors">
            Pricing
          </Link>
          <Link href="/changelog" className="hover:text-[#111111] transition-colors">
            Changelog
          </Link>
          <Link href="/manifesto" className="hover:text-[#111111] transition-colors">
            Manifesto
          </Link>
          <Link href="/privacy" className="hover:text-[#111111] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#111111] transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
