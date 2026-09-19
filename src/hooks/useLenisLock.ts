"use client";

import { useEffect } from "react";

// Reference counter to cleanly support nested modals (e.g. CommandMenu -> WaitlistModal)
let activeModalLocks = 0;
let originalBodyOverflow = "";

export function useLenisLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof window === "undefined" || !isLocked) return;

    activeModalLocks++;
    if (activeModalLocks === 1) {
      // 1. Pause global Lenis momentum scrolling
      window.__lenis?.stop();
      // 2. Lock body scroll so native viewport never slips
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      activeModalLocks = Math.max(0, activeModalLocks - 1);
      if (activeModalLocks === 0) {
        // Resume Lenis momentum scrolling
        window.__lenis?.start();
        document.body.style.overflow = originalBodyOverflow;
      }
    };
  }, [isLocked]);
}
