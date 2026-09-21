"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { playScrollDetent } from "@/lib/soundEngine";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Accessibility: bypass completely when prefers-reduced-motion is requested
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Throttled micro-click scroll detent acoustic feedback
    let accumulatedDelta = 0;
    let lastClickTime = 0;

    const unsubscribeScroll = lenis.on("scroll", (e) => {
      // 1. Dispatch high-precision scroll synchronization event for WebGL and 3D camera
      window.dispatchEvent(
        new CustomEvent("tactile_scroll_sync", {
          detail: {
            scrollY: e.scroll,
            progress: e.progress,
            velocity: e.velocity,
          },
        })
      );

      // 2. Audio haptic detents
      if (Math.abs(e.velocity) > 0.15) {
        accumulatedDelta += Math.abs(e.velocity) * 16;
        const now = performance.now();
        if (accumulatedDelta >= 68 && now - lastClickTime > 75) {
          playScrollDetent();
          accumulatedDelta = 0;
          lastClickTime = now;
        }
      }
    });

    // Handle initial hash on page load
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          lenis.scrollTo(element, { offset: -64, immediate: true });
        }, 100);
      }
    }

    // Intercept internal anchor navigation for silky Lenis target scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href) {
        const match = href.match(/^(?:\/)?#([a-zA-Z0-9_-]+)$/);
        if (match) {
          const targetId = match[1];
          const element = document.getElementById(targetId);
          if (element) {
            e.preventDefault();
            window.history.pushState(null, "", `#${targetId}`);
            lenis.scrollTo(element, { offset: -64, duration: 1.0 });
          }
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof unsubscribeScroll === "function") {
        unsubscribeScroll();
      }
      document.removeEventListener("click", handleAnchorClick);
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
