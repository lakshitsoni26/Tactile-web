"use client";

import confetti from "canvas-confetti";
import { playCelebrationChime } from "@/lib/soundEngine";

export interface WaitlistEntry {
  id?: string;
  email: string;
  ticketNumber: string;
  queuePosition: number;
  referralCode: string;
  referredBy?: string;
  role?: string;
  devicePreference?: string;
  tier?: string;
  accessWave?: string;
  joinedAt: string;
  perks?: string[];
}

const STORAGE_KEY = "tactile_waitlist_user";
export const BASE_COUNT = 239;

export function isValidWaitlistEntry(val: unknown): val is WaitlistEntry {
  if (!val || typeof val !== "object") return false;
  // Guard against React SyntheticEvent or DOM events
  if ("nativeEvent" in val || "isTrusted" in val || "_reactName" in val) return false;
  const entry = val as WaitlistEntry;
  return (
    typeof entry.email === "string" &&
    entry.email.includes("@") &&
    typeof entry.ticketNumber === "string" &&
    entry.ticketNumber.startsWith("#")
  );
}

export function getStoredWaitlistUser(): WaitlistEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidWaitlistEntry(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Invalidate and purge stale prototype records (e.g. #1429, VIP-1429, queuePosition >= 1000)
    if (
      parsed.queuePosition >= 1000 ||
      parsed.ticketNumber.includes("142") ||
      (typeof parsed.referralCode === "string" && parsed.referralCode.includes("142"))
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to read waitlist user from localStorage", e);
    return null;
  }
}

export function saveStoredWaitlistUser(user: WaitlistEntry): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("tactile_waitlist_updated", { detail: user }));
  } catch (e) {
    console.error("Failed to save waitlist user to localStorage", e);
  }
}

export function clearStoredWaitlistUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("tactile_waitlist_updated", { detail: null }));
  } catch (e) {
    console.error("Failed to clear waitlist user from localStorage", e);
  }
}

/**
 * 4-Stage Choreographed Canvas Confetti & Audio Multi-Sensory Celebration:
 * - Burst 1 (0ms): Center blast velocity 55 with obsidian, cyan, electric violet, silver particles.
 * - Burst 2 (+120ms): Left angled sweep with emerald and gold foil.
 * - Burst 3 (+240ms): Right angled sweep with electric cyan and white stars.
 * - Burst 4 (+400ms): Gravity-decayed shimmer rain.
 * Synchronously calls playCelebrationChime() for the 6-note pentatonic arpeggio.
 */
export function triggerConfetti(): void {
  if (typeof window === "undefined") return;

  // Sound cue
  try {
    playCelebrationChime();
  } catch {
    // Gracefully handle browser autoplay policies
  }

  const defaults = {
    origin: { y: 0.7 },
    zIndex: 99999,
  };

  // Burst 1: Center blast velocity 55 with obsidian, cyan, electric violet, silver metallic particles
  confetti({
    ...defaults,
    particleCount: 75,
    spread: 70,
    startVelocity: 55,
    colors: ["#050508", "#00F0FF", "#A855F7", "#FFFFFF", "#6366F1", "#94A3B8"],
  });

  // Burst 2 (+120ms): Left angled sweep
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.7 },
      colors: ["#10B981", "#F59E0B", "#00F0FF", "#6366F1"],
    });
  }, 120);

  // Burst 3 (+240ms): Right angled sweep
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.7 },
      colors: ["#00F0FF", "#A855F7", "#FFFFFF", "#F59E0B"],
    });
  }, 240);

  // Burst 4 (+400ms): Gravity-decayed shimmer rain
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 60,
      spread: 140,
      startVelocity: 25,
      decay: 0.94,
      scalar: 0.85,
      origin: { x: 0.5, y: 0.35 },
      colors: ["#00F0FF", "#A855F7", "#10B981", "#FFFFFF"],
    });
  }, 400);
}
