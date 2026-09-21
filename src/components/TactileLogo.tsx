"use client";

import React from "react";

export interface TactileLogoProps {
  size?: number;
  className?: string;
  withBadge?: boolean;
  animated?: boolean;
  glowIntensity?: "high" | "subtle" | "none";
}

/**
 * Tactile Master Brandmark
 * 
 * Concept:
 * An iconic geometric 'T' sculpted from the convergence of two physical hardware surfaces:
 * 1. The Horizontal Dynamic Touch Bar (laser cyan to electric sky gradient, sub-frame latency)
 * 2. The Vertical Companion Phone / Trackpad (cyber violet to indigo gradient, direct USB DMA)
 * 
 * At their tactile junction sits a calibrated haptic optical node.
 */
export function TactileMark({
  size = 32,
  className = "",
  glowIntensity = "high",
}: {
  size?: number;
  className?: string;
  glowIntensity?: "high" | "subtle" | "none";
}) {
  const glowOpacity = glowIntensity === "high" ? 0.6 : glowIntensity === "subtle" ? 0.3 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="Tactile Mark"
    >
      <defs>
        {/* Horizontal Touch Bar Gradient: Safety Orange -> Amber */}
        <linearGradient id="tactile-touchbar-grad" x1="4" y1="9" x2="28" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5500" />
          <stop offset="60%" stopColor="#FF7A29" />
          <stop offset="100%" stopColor="#FFA048" />
        </linearGradient>

        {/* Vertical Companion Device Gradient: Safety Orange -> Light Amber */}
        <linearGradient id="tactile-phone-grad" x1="16" y1="10" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5500" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FF7A29" />
          <stop offset="100%" stopColor="#FFA048" />
        </linearGradient>

        {/* Specular Rim Sheen */}
        <linearGradient id="tactile-specular" x1="16" y1="6" x2="16" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Glow Filters */}
        {glowOpacity > 0 && (
          <filter id="tactile-cyan-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Atmospheric Underglow */}
      {glowOpacity > 0 && (
        <>
          <rect
            x="5"
            y="6"
            width="22"
            height="6"
            rx="3"
            fill="#FF5500"
            opacity={glowOpacity * 0.45}
            filter="url(#tactile-cyan-bloom)"
          />
          <rect
            x="12.5"
            y="11"
            width="7"
            height="15"
            rx="3.5"
            fill="#FFA048"
            opacity={glowOpacity * 0.4}
            filter="url(#tactile-cyan-bloom)"
          />
        </>
      )}

      {/* 1. Horizontal Touch Bar / Auxiliary Screen Element */}
      <g filter={glowOpacity > 0 ? "url(#tactile-cyan-bloom)" : undefined}>
        {/* Base Dynamic Bar */}
        <rect
          x="5"
          y="6"
          width="22"
          height="6"
          rx="3"
          fill="url(#tactile-touchbar-grad)"
        />
        {/* Specular Edge Highlight */}
        <rect
          x="5.5"
          y="6.5"
          width="21"
          height="2"
          rx="1"
          fill="url(#tactile-specular)"
          opacity={0.65}
        />
        {/* Subtle Dynamic Touch Bar Status Notch */}
        <rect
          x="7.5"
          y="8"
          width="3.5"
          height="2"
          rx="1"
          fill="#05060B"
          opacity={0.35}
        />
      </g>

      {/* 2. Vertical Companion Device / Haptic Trackpad Element */}
      <g>
        {/* Phone / Trackpad Chassis */}
        <rect
          x="12.5"
          y="10.5"
          width="7"
          height="15.5"
          rx="3.5"
          fill="url(#tactile-phone-grad)"
        />

        {/* Inner Companion Glass Screen Bezel */}
        <rect
          x="13.75"
          y="12.5"
          width="4.5"
          height="11"
          rx="2"
          fill="#080914"
          fillOpacity={0.45}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="0.6"
        />

        {/* Haptic Pressure Core (Illuminated Center Ring) */}
        <circle cx="16" cy="18" r="1.2" fill="#00F0FF" />
        <circle cx="16" cy="18" r="2.2" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity={0.7} fill="none" />
      </g>

      {/* 3. Physical Hardware Junction Node (Mac-to-Companion Connection Point) */}
      <g>
        <circle cx="16" cy="9" r="1.6" fill="#FFFFFF" />
        <circle cx="16" cy="9" r="2.8" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity={0.9} fill="none" />
      </g>
    </svg>
  );
}

/**
 * Tactile Logo in Titanium Obsidian Enclosure
 */
export default function TactileLogo({
  size = 36,
  className = "",
  withBadge = true,
  animated = false,
  glowIntensity = "high",
}: TactileLogoProps) {
  if (!withBadge) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <TactileMark size={size} glowIntensity={glowIntensity} />
      </div>
    );
  }

  // Calculate inner mark size based on badge dimensions (approx 68% of badge)
  const markSize = Math.round(size * 0.68);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative group rounded-xl bg-gradient-to-b from-[#121422] to-[#06070c] border border-white/[0.14] flex items-center justify-center shadow-lg shadow-black/60 overflow-hidden transition-all duration-300 ${
        animated ? "hover:border-cyan-500/50 hover:shadow-cyan-500/20" : ""
      } ${className}`}
    >
      {/* Subtle Chamfer Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Ambient Radial Chroma Glow on Hover */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* The Central Geometric Mark */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
        <TactileMark size={markSize} glowIntensity={glowIntensity} />
      </div>
    </div>
  );
}

/**
 * Tactile Brand Lockup (Logo + Wordmark + Status Pill)
 */
export function TactileBrandLockup({
  size = 34,
  showTag = true,
  tagText = "Early Access",
  className = "",
}: {
  size?: number;
  showTag?: boolean;
  tagText?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <TactileLogo size={size} animated={true} />
      <div className="flex items-center gap-2">
        <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
          Tactile
        </span>
        {showTag && (
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-semibold hidden sm:inline">
            {tagText}
          </span>
        )}
      </div>
    </div>
  );
}
