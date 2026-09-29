"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Copy,
  Share2,
  Sparkles,
  X,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  WaitlistEntry,
  getStoredWaitlistUser,
  saveStoredWaitlistUser,
  clearStoredWaitlistUser,
  isValidWaitlistEntry,
  triggerConfetti,
} from "@/lib/waitlistStore";
import { useLenisLock } from "@/hooks/useLenisLock";
import TactileLogo from "@/components/TactileLogo";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: WaitlistEntry | null;
  onSuccess?: (entry: WaitlistEntry | null) => void;
  onReset?: () => void;
}

const DEVICE_OPTIONS = [
  "iPhone 16 Pro / iPhone",
  "Android Flagship (Pixel/Galaxy)",
  "iPad Pro / iPad Air",
  "Android Tablet",
] as const;

const ROLE_OPTIONS = [
  "Software Engineer",
  "Design Engineer",
  "UI/UX Designer",
  "Founder / Indie Hacker",
] as const;

export default function WaitlistModal({
  isOpen,
  onClose,
  entry,
  onSuccess,
  onReset,
}: WaitlistModalProps) {
  useLenisLock(isOpen);
  const [claimedEntry, setClaimedEntry] = useState<WaitlistEntry | null>(null);

  // Strict validation: entry is ONLY considered active if it is a genuine WaitlistEntry object
  const activeEntry = isValidWaitlistEntry(entry)
    ? entry
    : isValidWaitlistEntry(claimedEntry)
    ? claimedEntry
    : null;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [devicePreference, setDevicePreference] = useState<string>(DEVICE_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [alreadyRegisteredNotice, setAlreadyRegisteredNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(239);

  // 3D holographic tilt state
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Sync stored user from localStorage on open, strictly guarding against invalid/event objects
  useEffect(() => {
    if (isOpen) {
      if (!isValidWaitlistEntry(entry)) {
        const stored = getStoredWaitlistUser();
        setClaimedEntry(isValidWaitlistEntry(stored) ? stored : null);
      }
      // Fetch live waitlist counter
      fetch("/api/waitlist")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.totalCount === "number") {
            setLiveCount(data.totalCount);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, entry]);

  // Keyboard shortcut: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeTicketNumber = activeEntry?.ticketNumber ?? "#240";
  const safeReferralCode = activeEntry?.referralCode ?? "TAC-EARLY";
  const referralUrl = `https://tactile.lakshitsoni.in?ref=${safeReferralCode}`;
  const safeQueueRank =
    activeEntry?.queuePosition ??
    (typeof activeEntry?.ticketNumber === "string"
      ? parseInt(activeEntry.ticketNumber.replace(/\D/g, ""), 10) || 240
      : 240);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const tweetText = `Just claimed VIP Early Access Ticket ${safeTicketNumber} for @TactileApp! ⚡\n\nTurning my phone into an auxiliary screen & dynamic Touch Bar for Mac. Join here:\n`;
    const tweet = encodeURIComponent(tweetText);
    const url = encodeURIComponent(referralUrl);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleClaimPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.length < 5) {
      setFormError("Please enter a valid work or personal email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          devicePreference,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join waitlist. Please try again.");
      }

      const newEntry = (data.data || data.entry) as WaitlistEntry;
      if (data.alreadyRegistered) {
        setAlreadyRegisteredNotice(
          `Welcome back! This email is already registered with Ticket ${newEntry.ticketNumber}.`
        );
      } else {
        setAlreadyRegisteredNotice(null);
      }
      saveStoredWaitlistUser(newEntry);
      setClaimedEntry(newEntry);
      triggerConfetti();
      if (onSuccess) onSuccess(newEntry);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetRegistration = () => {
    clearStoredWaitlistUser();
    setClaimedEntry(null);
    setEmail("");
    setFormError(null);
    setAlreadyRegisteredNotice(null);
    if (onReset) onReset();
    if (onSuccess) onSuccess(null);
  };

  // 3D Card tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    const rotY = Math.round(normX * 8 * 10) / 10;
    const rotX = Math.round(-normY * 8 * 10) / 10;
    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);
    setTilt({ rotX, rotY, glareX, glareY });
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Early Access Reservation Pass"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-md transition-all cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#FAF9F5] border border-black/[0.08] shadow-2xl rounded-3xl overflow-hidden z-10 my-auto text-[#111111]"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <TactileLogo size={28} withBadge={false} glowIntensity="subtle" />
              <div>
                <span className="text-[13px] font-semibold text-[#111111] tracking-tight block">
                  Tactile Studio
                </span>
                <span className="text-[10px] font-mono text-[#D97706] tracking-wider uppercase font-semibold">
                  Priority Wave 01 · Direct DMA
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#111111] hover:bg-black/[0.05] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {!activeEntry ? (
              /* VIEW A: Single Unified Reservation Form */
              <form onSubmit={handleClaimPass} className="space-y-4">
                {/* Live Counter Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 text-[11px] font-medium text-[#92400E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                  <span>Live Queue: {liveCount}+ Founding Engineers</span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#111111] tracking-tight mb-1">
                    Claim your early access pass.
                  </h2>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Reserve priority access for sub-15ms companion display streaming, dynamic Touch Bar macros, and zero-cloud local continuity.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {formError}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Work or Personal Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@company.com"
                      required
                      className="w-full h-10 bg-white border border-black/[0.1] focus:ring-1 focus:ring-[#D97706] rounded-xl px-3.5 text-xs text-[#111111] placeholder:text-[#999] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Primary Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-10 bg-white border border-black/[0.1] focus:ring-1 focus:ring-[#D97706] rounded-xl px-3 text-xs text-[#111111] focus:outline-none cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Target Device
                      </label>
                      <select
                        value={devicePreference}
                        onChange={(e) => setDevicePreference(e.target.value)}
                        className="w-full h-10 bg-white border border-black/[0.1] focus:ring-1 focus:ring-[#D97706] rounded-xl px-3 text-xs text-[#111111] focus:outline-none cursor-pointer"
                      >
                        {DEVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-pill w-full !h-11 !text-xs cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Your Pass...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim Priority Pass</span>
                        <ArrowRight className="w-4 h-4 opacity-80" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW B: Confirmed Luxury Physical VIP Pass */
              <div className="space-y-4">
                {/* Already registered notice if re-submitted same email */}
                {alreadyRegisteredNotice && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{alreadyRegisteredNotice}</span>
                  </div>
                )}

                {/* Physical Ticket Pass */}
                <div
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
                  }}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
                    transition: isHovered
                      ? "transform 0.08s ease-out"
                      : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                  className="relative w-full rounded-2xl bg-white border border-black/[0.1] p-6 shadow-md shadow-black/5 overflow-hidden select-none cursor-default"
                >
                  {/* Amber Holographic Sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 0.35 : 0.15,
                      background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(217, 119, 6, 0.25) 0%, rgba(255, 255, 255, 0.6) 65%, transparent 100%)`,
                    }}
                  />

                  {/* Ticket Header */}
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[12px] font-bold text-[#111111] tracking-tight block">
                        TACTILE STUDIO
                      </span>
                      <span className="text-[9.5px] font-mono text-[#D97706] tracking-wider uppercase font-semibold">
                        VIP FOUNDING PASS • NO. {safeReferralCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-mono text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>WAVE 01 (CONFIRMED)</span>
                    </div>
                  </div>

                  {/* Central Display */}
                  <div className="relative z-10 flex items-baseline justify-between py-3 border-y border-black/[0.06] mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block mb-0.5">
                        Ticket Pass
                      </span>
                      <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[#D97706]">
                        {safeTicketNumber}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block mb-0.5">
                        Queue Position
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-[#111111]">
                        #{safeQueueRank.toLocaleString()}{" "}
                        <span className="text-xs text-[#71717A] font-normal">of 10k</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="relative z-10 flex items-end justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[11.5px] font-mono font-medium text-[#111111] block">
                        {activeEntry.email}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] font-mono">
                        <span>{activeEntry.role || "Software Engineer"}</span>
                        <span>•</span>
                        <span>{activeEntry.devicePreference || "iPhone"}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider font-semibold">
                      VERIFIED LOCAL-FIRST
                    </span>
                  </div>
                </div>

                {/* Supporter Privileges */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Early Supporter Privileges</span>
                  </div>
                  <ul className="text-xs text-[#555555] space-y-1.5">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Ultra-low latency 60 FPS display engine unlock</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dynamic Touch Bar profiles (VS Code, Cursor, Figma, Terminal)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Model Context Protocol (MCP) AI agent integration</span>
                    </li>
                  </ul>
                </div>

                {/* Referral Link Box */}
                <div className="rounded-xl bg-white border border-black/[0.08] p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                      Invite peers to move up the queue
                    </span>
                    <span className="text-[10px] font-mono text-[#D97706] font-semibold">
                      Priority Boost
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralUrl}
                      className="w-full bg-[#F4F4F5] border border-black/[0.06] rounded-lg px-3 py-1.5 text-xs text-[#111111] font-mono focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="btn-secondary-pill !py-1.5 !px-3 !text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#71717A]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleShareTwitter}
                    className="btn-primary-pill !h-10 !text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on X</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-secondary-pill !h-10 !text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>

                {/* Register another email button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResetRegistration}
                    className="w-full h-10 rounded-xl border border-black/[0.1] hover:border-black/25 bg-black/[0.02] hover:bg-black/[0.05] text-xs font-semibold text-[#333333] hover:text-[#111111] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>+ Claim a Pass for Another Email / New Spot</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
