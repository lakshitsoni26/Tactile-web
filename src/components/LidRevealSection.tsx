"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface LidRevealSectionProps {
  children: React.ReactNode;
}

/**
 * Scroll-driven MacBook lid opening.
 * ALL hooks are called unconditionally at the top level.
 * Mobile/reduced-motion: render static open Mac (no scroll anim).
 */
export default function LidRevealSection({ children }: LidRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(max-width: 767px)");

    setPrefersReducedMotion(motionMq.matches);
    setIsMobile(widthMq.matches);

    const onMotion = () => setPrefersReducedMotion(motionMq.matches);
    const onWidth = () => setIsMobile(widthMq.matches);

    motionMq.addEventListener("change", onMotion);
    widthMq.addEventListener("change", onWidth);
    return () => {
      motionMq.removeEventListener("change", onMotion);
      widthMq.removeEventListener("change", onWidth);
    };
  }, []);

  // ALL hooks unconditional — never inside a conditional branch
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Lid angle: -87° (almost closed) → +12° (fully open)
  const lidRotateX = useTransform(scrollYProgress, [0, 0.6], [-87, 12]);

  // Screen content fades in as lid opens
  const screenOpacity = useTransform(scrollYProgress, [0.1, 0.55], [0.0, 1.0]);

  // Dark overlay fades OUT as lid opens (derived from screenOpacity)
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.55], [0.95, 0.0]);

  // Scroll hint fades out early
  const hintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const skipAnimation = prefersReducedMotion || isMobile;

  // ── MOBILE / REDUCED MOTION ─────────────────────────────────────────
  if (skipAnimation) {
    return (
      <div className="w-full py-16 px-4">
        <div className="relative mx-auto" style={{ maxWidth: 680 }}>
          <StaticMacBook>{children}</StaticMacBook>
        </div>
      </div>
    );
  }

  // ── SCROLL-DRIVEN DESKTOP ───────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Perspective container */}
        <div
          className="relative flex items-end justify-center w-full"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 55%", transformStyle: "preserve-3d" }}
        >
          {/* ── MacBook Assembly ─────────────────────────────────── */}
          <div
            className="relative"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(16deg)" }}
          >
            {/* LID */}
            <motion.div
              style={{
                rotateX: lidRotateX,
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
                translateY: "-100%",
                width: 680,
                height: 430,
              }}
            >
              {/* Front face — screen */}
              <div
                className="absolute inset-0 bg-[#0a0b0e] rounded-[20px] overflow-hidden border border-white/[0.12]"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Camera notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#07080b] rounded-b-xl border-b border-white/10 z-20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#101215] border border-[#00F0FF]/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0c0d10] border border-white/20" />
                </div>

                {/* Screen content */}
                <div className="relative w-full h-full p-2 pt-5">
                  <motion.div
                    style={{ opacity: screenOpacity }}
                    className="w-full h-full rounded-[12px] overflow-hidden"
                  >
                    {children}
                  </motion.div>

                  {/* Dark blackout overlay — fades as lid opens */}
                  <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-2 rounded-[12px] bg-black pointer-events-none"
                  />
                </div>

                {/* Glass reflection sheen */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay rounded-[20px]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%)",
                  }}
                />
              </div>

              {/* Back face — aluminum exterior */}
              <div
                className="absolute inset-0 bg-[#18191e] rounded-[20px] border border-white/10 flex items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center">
                  <span className="text-white/30 font-mono text-xs">✦</span>
                </div>
              </div>
            </motion.div>

            {/* BASE */}
            <div
              className="relative bg-[#14151a] rounded-b-[20px] rounded-t-[6px] border border-white/[0.10] border-t-0"
              style={{ width: 680, height: 210, transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-3 top-4 rounded-[12px] bg-[#0b0c10] border border-white/[0.05] p-2.5">
                {/* F-row */}
                <div className="flex gap-1 mb-1">
                  {["esc", ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`), "⊙"].map((k, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3.5 rounded-[2px] flex items-center justify-center text-[5px] font-mono border ${
                        i === 13
                          ? "bg-[#1a1b20] border-[#00F0FF]/20 text-[#00F0FF]/50"
                          : "bg-[#181920] border-white/[0.04] text-white/20"
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* QWERTY rows */}
                {[
                  ["~","1","2","3","4","5","6","7","8","9","0","-","=","⌫"],
                  ["⇥","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
                  ["⇪","A","S","D","F","G","H","J","K","L",";","'","↵"],
                  ["⇧","Z","X","C","V","B","N","M",",",".","/","⇧"],
                ].map((row, ri) => (
                  <div key={ri} className="flex gap-1 mb-1">
                    {row.map((k, ki) => (
                      <div
                        key={ki}
                        className={`flex items-center justify-center h-5 rounded-[2px] bg-[#16171c] border border-white/[0.06] text-[6px] font-mono text-white/25 ${
                          k === "⌫" || k === "⇪" || k === "↵" || k === "⇧" ? "flex-[1.5]" : "flex-1"
                        }`}
                      >
                        {k}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Space bar row */}
                <div className="flex gap-1">
                  {["fn","⌃","⌥","⌘"].map((k) => (
                    <div key={k} className="flex-1 h-5 rounded-[2px] bg-[#16171c] border border-white/[0.06] flex items-center justify-center text-[6px] font-mono text-white/20">{k}</div>
                  ))}
                  <div className="flex-[4] h-5 rounded-[2px] bg-[#16171c] border border-white/[0.06]" />
                  {["⌘","⌥","←","↕","→"].map((k) => (
                    <div key={k} className="flex-1 h-5 rounded-[2px] bg-[#16171c] border border-white/[0.06] flex items-center justify-center text-[6px] font-mono text-white/20">{k}</div>
                  ))}
                </div>
              </div>

              {/* Trackpad */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-28 rounded-[10px] bg-[#111216] border border-white/[0.06]" />

              {/* Hinge line */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Ground shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full h-8 bg-black/40 blur-xl rounded-full" />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-12 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[11px] font-mono text-white/30 tracking-wider">scroll to open</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/20 text-xs"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/** Static already-open Mac for mobile / reduced-motion */
function StaticMacBook({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 640 }}>
      <div className="rounded-[16px] overflow-hidden border border-white/[0.12] bg-[#0a0b0e] shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-[#07080b] rounded-b-lg z-10" />
        <div className="p-2 pt-4">{children}</div>
      </div>
      <div className="mt-0.5 h-6 bg-[#14151a] rounded-b-[12px] border border-t-0 border-white/[0.08] mx-4" />
    </div>
  );
}
