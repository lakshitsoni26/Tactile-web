"use client";

import React from "react";
import type { DesktopState, DesktopEvent } from "@/lib/desktopState";
import MacDesktopSandbox from "./MacDesktopSandbox";

interface MacScreenContentProps {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
  scheduleReset: () => void;
}

const BASE_WIDTH = 708;
const BASE_HEIGHT = 444; // Authentic 16:10 active display below the top bezel

export default function MacScreenContent({
  state,
  dispatch,
  scheduleReset,
}: MacScreenContentProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const lastWidthRef = React.useRef(0);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const measureWidth = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      if (w > 0 && Math.abs(w - lastWidthRef.current) >= 2) {
        lastWidthRef.current = w;
        const newScale = Math.min(1, w / BASE_WIDTH);
        setScale(newScale);
      }
    };

    measureWidth();

    // ResizeObserver strictly filtering on width changes with hysteresis to eliminate loops
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0 && Math.abs(w - lastWidthRef.current) >= 2) {
          lastWidthRef.current = w;
          const newScale = Math.min(1, w / BASE_WIDTH);
          setScale(newScale);
        }
      }
    });

    ro.observe(containerRef.current);
    window.addEventListener("resize", measureWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureWidth);
    };
  }, []);

  const scaledHeight = Math.round(BASE_HEIGHT * scale);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full select-none max-w-[708px]">
      {/* ── 1. DISPLAY LID (Apple CNC Anodized Silver Unibody) ───────────────── */}
      <div className="relative w-full rounded-t-[20px] sm:rounded-t-[24px] bg-gradient-to-b from-[#E6E7EE] via-[#D6D8E0] to-[#C0C2CC] border border-black/15 border-b-0 p-[3.5px] sm:p-[4px] pb-0 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.22)] overflow-hidden">
        
        {/* Top Specular Chamfer Hairline */}
        <div className="absolute top-0 inset-x-5 h-[1px] bg-white/90 pointer-events-none" />

        {/* Display Bezel Frame (Matte Black Vulcanized Rubber Rim) */}
        <div className="relative rounded-t-[16px] sm:rounded-t-[20px] bg-[#101114] overflow-hidden border border-black/50 ring-1 ring-black/80">
          
          {/* Iconic MacBook Camera Notch Cutout with Smooth Concave Ears */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none select-none transition-all"
            style={{
              width: scale < 1 ? Math.max(86, Math.round(116 * scale)) : 116,
              height: scale < 1 ? Math.max(18, Math.round(24 * scale)) : 24,
            }}
          >
            {/* Notch Inner Container */}
            <div className="relative w-full h-full bg-[#101114] rounded-b-[10px] border-x border-b border-black/60 shadow-[0_2px_8px_rgba(0,0,0,0.65)] flex items-center justify-center gap-2 sm:gap-2.5 px-3">
              {/* Left Concave Ear Flair */}
              <div 
                className="absolute -left-[6px] top-0 w-[6px] h-[6px] pointer-events-none hidden sm:block"
                style={{
                  background: "radial-gradient(circle at 0 6px, transparent 6px, #101114 6px)"
                }}
              />
              {/* Right Concave Ear Flair */}
              <div 
                className="absolute -right-[6px] top-0 w-[6px] h-[6px] pointer-events-none hidden sm:block"
                style={{
                  background: "radial-gradient(circle at 6px 6px, transparent 6px, #101114 6px)"
                }}
              />

              {/* 1. Ambient Light Sensor */}
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#07080B] border border-white/10 shrink-0" />
              
              {/* 2. 1080p FaceTime HD Camera Lens with Anti-Reflective Coating Sheen */}
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#05060A] border border-cyan-500/25 relative flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                <div
                  className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #00F0FF 0%, #1e1b4b 55%, #050508 100%)",
                  }}
                />
                <div className="absolute top-[2px] right-[2px] w-[1px] h-[1px] rounded-full bg-white/70" />
              </div>
              
              {/* 3. Camera Activity LED (Authentic Soft Emerald Glow) */}
              <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-[#30D158] border border-emerald-400/80 shadow-[0_0_4px_#30D158] shrink-0" />
            </div>
          </div>

          {/* Living macOS Screen Canvas (Authentic 16:10 Ratio, Top Rounded, Bottom Square) */}
          <div 
            className="w-full relative overflow-hidden" 
            style={{ 
              height: scaledHeight,
              WebkitFontSmoothing: "subpixel-antialiased",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          >
            <div
              style={{
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                transform: scale < 1 ? `scale(${scale})` : undefined,
                transformOrigin: "top left",
              }}
              className="relative"
            >
              <MacDesktopSandbox
                state={state}
                dispatch={dispatch}
                scheduleReset={scheduleReset}
              />
            </div>
          </div>

          {/* Display Bottom Bezel Chin with Subtle Tone-on-Tone MacBook Pro Wordmark */}
          <div className="w-full h-[6px] bg-[#101114] flex items-center justify-center border-t border-black/40">
            <span className="text-[#32343E] text-[6.5px] tracking-[0.22em] font-semibold uppercase select-none opacity-80 scale-90">
              MacBook Pro
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. DISPLAY HINGE & RECESSED AIRFLOW GROOVE ───────────── */}
      <div className="w-full h-[6px] bg-[#0E0F13] border-t border-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] flex items-center justify-center">
        {/* Centered Hinge Barrel */}
        <div className="w-44 sm:w-48 h-full bg-gradient-to-b from-[#2B2C33] to-[#1C1D23] rounded-[1px] border-x border-black/50" />
      </div>

      {/* ── 3. UNIBODY ALUMINUM BASE DECK (Authentic Overhanging Chassis) ── */}
      <div className="relative w-[calc(100%+16px)] sm:w-[calc(100%+20px)] -mx-2 sm:-mx-2.5 h-[18px] sm:h-[20px] bg-gradient-to-b from-[#ECEEF5] via-[#D8DAE2] to-[#B0B2BE] rounded-b-[16px] sm:rounded-b-[18px] border-x border-b border-black/25 border-t border-t-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_28px_rgba(0,0,0,0.16)] flex flex-col items-center justify-between z-10">
        
        {/* Left Edge Port Cutouts (MagSafe 3 & Thunderbolt 4) */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 opacity-70 pointer-events-none">
          <div className="w-[3px] h-[2px] bg-[#1B1C22] rounded-[0.5px]" title="MagSafe 3" />
          <div className="w-[2.5px] h-[1.5px] bg-[#1B1C22] rounded-[0.5px]" title="Thunderbolt 4" />
        </div>

        {/* Right Edge Port Cutouts (HDMI & Thunderbolt 4) */}
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-70 pointer-events-none">
          <div className="w-[2.5px] h-[1.5px] bg-[#1B1C22] rounded-[0.5px]" title="Thunderbolt 4" />
          <div className="w-[3.5px] h-[2px] bg-[#1B1C22] rounded-[0.5px]" title="HDMI" />
        </div>

        {/* Centered Machined Opening Lip / Thumb Scoop */}
        <div className="w-[76px] sm:w-[84px] h-[5px] sm:h-[5.5px] bg-gradient-to-b from-[#9496A0] via-[#858792] to-[#747680] rounded-b-[7px] border-x border-b border-black/25 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.35)] flex flex-col items-center">
          {/* Hairline Specular Reflection inside scoop */}
          <div className="w-14 h-[0.75px] bg-white/50 rounded-full mt-0.5" />
        </div>

        {/* Rubber Feet Profile (peeking beneath subtle side chamfers) */}
        <div className="w-full flex items-center justify-between px-8 sm:px-10 pb-0.5">
          <div className="w-11 sm:w-12 h-[2px] bg-[#202126] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
          <div className="w-11 sm:w-12 h-[2px] bg-[#202126] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
        </div>
      </div>

      {/* ── 4. MULTI-STAGE GROUND CONTACT SHADOW ─────────────────────────── */}
      <div className="w-full relative flex flex-col items-center pointer-events-none">
        {/* Stage 1: Tight Contact Occlusion */}
        <div className="h-2 w-[96%] bg-black/30 blur-xs rounded-full -mt-1" />
        {/* Stage 2: Diffuse Ambient Drop Shadow */}
        <div className="h-6 w-[88%] bg-black/16 blur-md rounded-full -mt-2" />
        {/* Stage 3: Floor Ambient Halo */}
        <div className="h-10 w-[78%] bg-black/8 blur-xl rounded-full -mt-4" />
      </div>
    </div>
  );
}
