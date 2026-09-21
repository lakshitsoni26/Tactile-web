"use client";

import React from "react";

interface LakshitSignatureProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Handcrafted vector cursive signature for Lakshit (Founder).
 * Flowing calligraphy strokes with natural ink pressure and penmanship flourish.
 */
export default function LakshitSignature({
  className = "",
  width = 180,
  height = 64,
  color = "#111111",
}: LakshitSignatureProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 80"
      width={width}
      height={height}
      className={`inline-block select-none ${className}`}
      aria-label="Signature of Lakshit"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ink-bleed)"
      >
        {/* Capital 'L' - Elegant ascending flourish, strong downstroke, loop, and base wave */}
        <path
          d="M 28 62 C 22 55 18 36 24 20 C 27 12 34 8 36 12 C 38 18 34 32 30 50 C 27 63 24 70 33 68 C 42 66 52 56 64 54"
          strokeWidth="2.4"
        />

        {/* 'a' - fluid connection, oval loop, downstroke */}
        <path
          d="M 64 54 C 61 50 63 43 69 41 C 75 39 80 43 80 50 C 80 55 77 60 72 61 C 67 62 64 57 66 51 C 68 45 74 42 79 46 C 81 49 81 58 83 60"
          strokeWidth="2.1"
        />

        {/* 'k' - high ascending loop and ligature kick */}
        <path
          d="M 83 60 C 86 54 90 32 94 18 C 96 11 100 12 99 22 C 97 37 93 54 95 62 M 93 46 C 97 43 103 40 108 43 C 111 45 107 50 102 53 M 100 52 C 103 54 107 59 112 62"
          strokeWidth="2.2"
        />

        {/* 'sh' - cursive wave transition into 's' and tall 'h' */}
        <path
          d="M 112 62 C 116 60 120 48 123 46 C 126 44 128 47 127 51 C 125 56 120 59 126 60 C 130 61 133 55 136 48 C 140 37 143 24 146 16 C 148 10 152 11 150 20 C 147 34 143 52 144 60 C 145 64 149 53 153 48 C 157 43 162 45 163 51 C 164 56 163 60 166 61"
          strokeWidth="2.0"
        />

        {/* 'i' - short stroke and distinct ink dot */}
        <path
          d="M 166 61 C 169 58 172 49 175 47 C 178 45 179 49 178 54 C 177 58 178 60 182 60"
          strokeWidth="2.1"
        />
        <circle cx="178" cy="38" r="1.8" fill={color} stroke="none" />

        {/* 't' - strong cross and energetic ending flourish sweep */}
        <path
          d="M 182 60 C 185 55 188 34 191 24 C 192 18 193 25 192 36 C 190 49 191 60 196 61 C 201 62 208 58 214 56"
          strokeWidth="2.2"
        />
        {/* 't' horizontal bar / flourish */}
        <path
          d="M 180 34 C 188 32 198 33 205 35"
          strokeWidth="2.0"
        />

        {/* Underline calligraphy swoosh with tapering flourish */}
        <path
          d="M 38 74 C 70 73 130 71 185 68 C 206 67 228 65 235 64"
          strokeWidth="1.6"
          strokeDasharray="200"
          strokeDashoffset="0"
        />
      </g>
    </svg>
  );
}
