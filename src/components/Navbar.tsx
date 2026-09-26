"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      setHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_LINKS = [
    { href: "/story", label: "Story" },
    { href: "/compare", label: "Compare" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/#capabilities", label: "Capabilities" },
    { href: "/#surfaces", label: "Surfaces" },
    { href: "/pricing", label: "Pricing" },
    { href: "/changelog", label: "Changelog" },
  ];

  return (
    <>
      {/* ─────────────────────────────── Resurf 1:1 Dual-Layer Top Navigation ─────────────────────── */}
      <div className="sticky top-0 left-0 right-0 z-50 w-full select-none">
        {/* Layer 1: Masked Progressive Backdrop Blur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 backdrop-blur-md"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Layer 2: Soft Gradient White Diffusion */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-[#FAFAFA]/90 via-[#FAFAFA]/50 to-transparent"
        />

        <div className="relative w-full px-4 sm:px-6 py-3.5 max-w-6xl mx-auto">
          <div className="relative flex items-center justify-between gap-4">
            {/* ── Left: Logo ───────────────────────────────── */}
            <Link
              href="/"
              aria-label="Tactile Home"
              className="inline-flex items-center gap-2 group select-none"
            >
              {/* Geometric cube indicator (matching Resurf aesthetic) */}
              <div className="w-[18px] h-[18px] rounded-[5px] bg-[#111111] flex items-center justify-center text-white shadow-xs">
                <div className="w-[6px] h-[6px] rounded-[2px] bg-[#D97706]" />
              </div>
              <span className="text-[15px] font-semibold text-[#111111] tracking-[-0.02em] font-[family-name:var(--font-geist-sans)]">
                Tactile
              </span>
            </Link>

            {/* ── Center: Nav links (bare plain text, centered like Resurf) ──── */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
              <div className="nav-container relative">
                <ul className="relative z-10 flex items-center gap-0.5">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="rounded-full flex items-center px-3 h-7 text-[#111111]/70 font-medium transition-colors duration-200 hover:text-[#111111] hover:bg-black/[0.04] text-sm"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Right: Compact Download / Waitlist Button ── */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenWaitlist()}
                className="items-center cursor-pointer justify-center whitespace-nowrap text-[#111111]/90 hover:text-[#111111] hover:bg-[#E0E0E0] h-7 rounded-lg gap-1.5 px-2.5 text-xs font-medium bg-[#EBEBEB] transition-all hidden sm:inline-flex active:scale-[0.98]"
              >
                <span>Download</span>
              </button>

              {/* Mobile hamburger */}
              <div className="sm:hidden">
                <button
                  aria-label="Toggle menu"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="inline-flex items-center cursor-pointer justify-center size-8 rounded-lg text-[#111111]/70 hover:bg-black/5 hover:text-[#111111] transition-colors"
                >
                  {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────── Mobile Drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-40 bg-white border border-black/[0.08] shadow-xl rounded-2xl p-5 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[15px] font-medium text-[#333333] hover:text-[#111111] hover:bg-black/[0.03] px-3.5 py-2.5 rounded-xl transition-colors"
                  >
                    {label}
                  </Link>
                ))}

                <div className="h-px bg-black/[0.06] my-2" />

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWaitlist();
                  }}
                  className="btn-primary-pill w-full justify-center !py-2.5 !text-[14px]"
                >
                  Join Waitlist
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
