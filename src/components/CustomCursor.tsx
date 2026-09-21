"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextTarget, setIsTextTarget] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setMounted(true);

    // Start far off-screen so they never flash in the center
    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let ringW = 40;
    let ringH = 40;
    let targetW = 40;
    let targetH = 40;
    let targetX = -200;
    let targetY = -200;
    let isMagnetic = false;
    let magneticRadius = "9999px";
    let isTextActive = false;
    let rafId: number;
    let hasFirstMove = false;

    // Initialize dot off-screen
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(-200px, -200px, 0)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(-220px, -220px, 0)`;
      ringRef.current.style.width = "40px";
      ringRef.current.style.height = "40px";
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasFirstMove) {
        hasFirstMove = true;
        ringX = mouseX;
        ringY = mouseY;
        targetX = mouseX;
        targetY = mouseY;
        setIsVisible(true);
      }

      // Zero-lag dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Text input detection
      const textInput = target.closest(
        "input, textarea, select, [contenteditable='true'], [data-cursor='text']"
      );
      if (textInput) {
        if (!isTextActive) {
          isTextActive = true;
          setIsTextTarget(true);
          setIsHovered(false);
        }
        isMagnetic = false;
        targetX = mouseX;
        targetY = mouseY;
        targetW = 0;
        targetH = 0;
        return;
      } else if (isTextActive) {
        isTextActive = false;
        setIsTextTarget(false);
      }

      // Interactive element detection
      const interactiveEl = target.closest(
        "[data-magnetic], button, a, [role='button']"
      ) as HTMLElement | null;

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        const hasExplicitMagnetic = interactiveEl.getAttribute("data-magnetic") === "true";
        const isWithinModalOrSandbox = !!interactiveEl.closest(
          "[data-no-cursor-snap], [role='dialog'], [aria-modal='true'], .mac-sandbox, .phone-sandbox, [data-device-chassis]"
        );
        const isCompact = rect.width <= 180 && rect.height <= 60;
        const shouldMagnetize = (hasExplicitMagnetic || isCompact) && !isWithinModalOrSandbox;

        if (shouldMagnetize) {
          isMagnetic = true;
          setIsHovered(true);

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const pullFactor = 0.28;

          targetX = mouseX + (centerX - mouseX) * pullFactor;
          targetY = mouseY + (centerY - mouseY) * pullFactor;
          targetW = Math.max(rect.width + 14, 44);
          targetH = Math.max(rect.height + 10, 44);
          magneticRadius = `${Math.min(rect.height / 2 + 10, 9999)}px`;
          return;
        }
      }

      isMagnetic = false;
      setIsHovered(false);
      targetX = mouseX;
      targetY = mouseY;
      targetW = 40;
      targetH = 40;
      magneticRadius = "9999px";
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => { if (hasFirstMove) setIsVisible(true); };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const render = () => {
      const posLerp = isMagnetic ? 0.12 : 0.10;
      const sizeLerp = 0.14;

      ringX += (targetX - ringX) * posLerp;
      ringY += (targetY - ringY) * posLerp;
      ringW += (targetW - ringW) * sizeLerp;
      ringH += (targetH - ringH) * sizeLerp;

      if (ringRef.current) {
        const left = ringX - ringW / 2;
        const top = ringY - ringH / 2;
        ringRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        ringRef.current.style.width = `${ringW}px`;
        ringRef.current.style.height = `${ringH}px`;
        ringRef.current.style.borderRadius = magneticRadius;
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Zero-lag hardware micro-dot: Acid Green */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full will-change-transform pointer-events-none`}
        style={{
          background: "#39FF14",
          boxShadow: "0 0 8px rgba(57,255,20,0.9), 0 0 16px rgba(57,255,20,0.5)",
          opacity: !isVisible ? 0 : isTextTarget ? 0 : 1,
          transition: "opacity 0.20s ease",
        }}
      />

      {/* Damped spring ring follower: Molten Orange */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 h-10 w-10 rounded-full will-change-transform pointer-events-none`}
        style={{
          opacity: !isVisible ? 0 : isTextTarget ? 0 : 1,
          transition: "border-color 0.20s, background-color 0.20s, box-shadow 0.20s, opacity 0.20s ease",
          border: `1px solid ${isClicking ? "rgba(57,255,20,0.9)" : isHovered ? "rgba(255,85,0,0.90)" : "rgba(255,85,0,0.45)"}`,
          background: isClicking
            ? "rgba(57,255,20,0.15)"
            : isHovered
            ? "rgba(255,85,0,0.10)"
            : "rgba(255,85,0,0.04)",
          boxShadow: isClicking
            ? "0 0 20px rgba(57,255,20,0.5)"
            : isHovered
            ? "0 0 20px rgba(255,85,0,0.35)"
            : "0 0 10px rgba(255,85,0,0.12)",
        }}
      />
    </div>
  );
}
