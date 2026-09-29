"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Sparkles, CheckCircle2, ChevronDown, Smartphone } from "lucide-react";
import { saveStoredWaitlistUser, triggerConfetti, WaitlistEntry } from "@/lib/waitlistStore";

interface WaitlistFormProps {
  onSuccess?: (entry: WaitlistEntry) => void;
  className?: string;
  placeholder?: string;
}

const DEVICE_OPTIONS = [
  "Android Phone",
  "iPhone",
  "Android Tablet",
  "iPad",
] as const;

const ROLE_OPTIONS = [
  "Software Engineer",
  "Design Engineer",
  "UI/UX Designer",
  "Founder / Indie Hacker",
  "Product Manager",
] as const;

const RFC_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm({
  onSuccess,
  className = "",
  placeholder = "Enter your work or personal email...",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [devicePreference, setDevicePreference] = useState<string>(DEVICE_OPTIONS[0]);
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !RFC_EMAIL_REGEX.test(cleanEmail)) {
      setError("Please enter a valid email address.");
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

      const entry = (data.data || data.entry) as WaitlistEntry;
      saveStoredWaitlistUser(entry);

      // Trigger visual confetti
      triggerConfetti();

      setSuccessMessage(data.message || "Reservation confirmed! Your priority ticket is ready.");
      if (onSuccess) {
        onSuccess(entry);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="resurf-card !rounded-2xl p-3 sm:p-4 bg-white border border-black/[0.08] shadow-sm">
          {/* Preferences Row: Role & Device */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 pb-3 border-b border-black/[0.05]">
            {/* Role selector */}
            <div className="flex flex-col text-left">
              <label
                htmlFor="waitlist-role-select"
                className="text-[10.5px] uppercase tracking-wider text-[#71717A] font-medium mb-1 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                <span>Primary Role</span>
              </label>
              <div className="relative">
                <select
                  id="waitlist-role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#F4F4F5] border border-black/[0.06] text-[#111111] text-xs rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-black/30 transition-all cursor-pointer appearance-none font-sans"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-[#111111]">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Device preference selector */}
            <div className="flex flex-col text-left">
              <label
                htmlFor="waitlist-device-select"
                className="text-[10.5px] uppercase tracking-wider text-[#71717A] font-medium mb-1 flex items-center gap-1.5"
              >
                <Smartphone className="w-3 h-3 text-[#D97706]" />
                <span>Target Phone</span>
              </label>
              <div className="relative">
                <select
                  id="waitlist-device-select"
                  value={devicePreference}
                  onChange={(e) => setDevicePreference(e.target.value)}
                  className="w-full bg-[#F4F4F5] border border-black/[0.06] text-[#111111] text-xs rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-black/30 transition-all cursor-pointer appearance-none font-sans"
                >
                  {DEVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-[#111111]">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Email Input & Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center pl-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={placeholder}
                required
                className="w-full bg-transparent text-[14px] text-[#111111] placeholder:text-[#A1A1AA] focus:outline-none py-2 px-2 font-sans"
                aria-label="Email address for waitlist"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-pill !py-2.5 !px-5 !text-[13px] shrink-0 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Securing spot...</span>
                </>
              ) : (
                <>
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p className="mt-2 text-xs text-rose-600 text-left pl-2 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}

      {successMessage && (
        <p className="mt-2 text-xs text-emerald-600 text-left pl-2 flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {successMessage}
        </p>
      )}
    </div>
  );
}
