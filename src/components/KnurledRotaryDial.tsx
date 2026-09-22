"use client";

import React, { useRef, useState } from "react";
import { playScrollDetent } from "@/lib/soundEngine";
import { Volume2 } from "lucide-react";

interface KnurledRotaryDialProps {
  value: number; // 0..100
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  size?: number; // default 48
}

export default function KnurledRotaryDial({
  value,
  onChange,
  label = "HAPTIC DIAL",
  unit = "%",
  size = 48,
}: KnurledRotaryDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartVal = useRef(0);
  const lastDetentVal = useRef(value);

  // Map 0..100 to rotation angle -135deg to +135deg (270deg total sweep)
  const angle = -135 + (value / 100) * 270;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartVal.current = value;
    lastDetentVal.current = value;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    // Horizontal drag sensitivity (drag right/up = increase, drag left/down = decrease)
    const deltaX = e.clientX - dragStartX.current;
    const step = deltaX * 0.75;
    const clamped = Math.min(100, Math.max(0, Math.round(dragStartVal.current + step)));

    if (clamped !== value) {
      onChange(clamped);

      // Trigger crisp mechanical detent click every 2.5% increment
      if (Math.abs(clamped - lastDetentVal.current) >= 2.5) {
        playScrollDetent();
        lastDetentVal.current = clamped;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div className="flex items-center justify-between w-full px-2 py-1 bg-[#10121a] border-b border-white/[0.08] select-none touch-none">
      
      {/* Label & Status */}
      <div className="flex items-center gap-1.5 text-white/70">
        <Volume2 className="w-3 h-3 text-[#FF5500] shrink-0" />
        <span className="text-[7.5px] font-mono font-medium tracking-wide uppercase">
          {label}
        </span>
        <span className="text-[#FF5500] font-mono text-[8px] font-bold tabular-nums">
          {value}{unit}
        </span>
      </div>

      {/* Interactive Knurled Dial Assembly */}
      <div className="flex items-center gap-2">
        
        {/* Horizontal scrub track slider helper */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-20 h-2 bg-white/10 rounded-full overflow-hidden relative cursor-ew-resize border border-white/10 touch-none active:scale-[0.98] transition-transform"
        >
          <div
            className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA048] shadow-[0_0_8px_rgba(255,85,0,0.45)]"
            style={{ width: `${value}%` }}
          />
        </div>

        {/* 3D Machined Mechanical Thumbwheel */}
        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ width: size, height: size }}
          className={`relative rounded-full cursor-ew-resize touch-none flex items-center justify-center transition-transform ${
            isDragging ? "scale-105" : "hover:scale-[1.02]"
          }`}
        >
          {/* Outer Bezel */}
          <div className="absolute inset-0 rounded-full border border-white/20 bg-[#12141f] shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.18)]" />

          {/* 16 Perimeter Tick Marks */}
          {Array.from({ length: 16 }).map((_, i) => {
            const tickAngle = -135 + (i / 15) * 270;
            const isActive = tickAngle <= angle;
            return (
              <div
                key={i}
                className="absolute w-[1.2px] h-[2.5px] rounded-full"
                style={{
                  top: 2,
                  left: `calc(50% - 0.6px)`,
                  transformOrigin: `0.6px ${size / 2 - 2}px`,
                  transform: `rotate(${tickAngle}deg)`,
                  backgroundColor: isActive ? "#FF5500" : "rgba(255,255,255,0.18)",
                  boxShadow: isActive ? "0 0 3px #FF5500" : "none",
                }}
              />
            );
          })}

          {/* Knurled Aluminum Rotor Body */}
          <div
            className="relative rounded-full border border-white/25 flex items-center justify-center shadow-inner"
            style={{
              width: size - 12,
              height: size - 12,
              transform: `rotate(${angle}deg)`,
              background: `repeating-conic-gradient(
                from 0deg,
                #2d3142 0deg 11.25deg,
                #13151f 11.25deg 22.5deg
              )`,
            }}
          >
            {/* Center Machined Cap with Glowing Indicator Pip */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-[#1c1f2b] to-[#0c0d13] border border-white/20 flex items-center justify-center shadow-md">
              <div className="w-0.5 h-1.5 rounded-full bg-[#FF5500] -translate-y-0.5 shadow-[0_0_4px_#FF5500]" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
