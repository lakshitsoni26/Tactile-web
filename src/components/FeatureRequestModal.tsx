"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Check,
  Copy,
  Loader2,
  Send,
  Sliders,
  Layers,
  Touchpad,
  Laptop,
} from "lucide-react";
import { useLenisLock } from "@/hooks/useLenisLock";

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_APPS = [
  "VS Code",
  "Xcode",
  "Figma",
  "Terminal",
  "Blender",
  "Final Cut Pro",
  "Obsidian",
  "Arc Browser",
  "Custom App",
] as const;

const CATEGORIES = [
  { label: "Application Macro Deck", icon: Layers, desc: "Contextual Touch Bar buttons & macros" },
  { label: "Hardware Gesture / Dial", icon: Sliders, desc: "Knurled rotary wheels, sliders & trackpad gestures" },
  { label: "Auxiliary Screen Widget", icon: Laptop, desc: "Secondary screen monitoring or floating tools" },
  { label: "System / OS Control", icon: Touchpad, desc: "Spaces, window snapping & global audio/mic hotkeys" },
] as const;

export default function FeatureRequestModal({
  isOpen,
  onClose,
}: FeatureRequestModalProps) {
  useLenisLock(isOpen);

  const [selectedApp, setSelectedApp] = useState<string>("Figma");
  const [customApp, setCustomApp] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Application Macro Deck");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut: Escape to close
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

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSubmittedId(null);
      setCopied(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please specify a title for the workflow or control.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe how you want this control to work in your workflow.");
      return;
    }

    const appName = selectedApp === "Custom App" ? (customApp.trim() || "Custom Application") : selectedApp;

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          title: title.trim(),
          description: description.trim(),
          category: selectedCategory,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmittedId(data.requestId || `REQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#FAF9F5] border border-black/[0.08] shadow-2xl rounded-3xl overflow-hidden z-10 my-auto text-[#111111]"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center text-[#D97706]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#111111] tracking-tight">
                  Propose a Workflow / Feature
                </h2>
                <p className="text-[12px] text-[#71717A]">
                  Direct engineering priority queue for Mac creators
                </p>
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

          {/* Body */}
          <div className="p-6">
            {submittedId ? (
              /* Success State */
              <div className="py-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706] mx-auto mb-4">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>

                <h3 className="font-semibold text-lg text-[#111111] mb-1">
                  Workflow Proposal Logged!
                </h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto mb-6 leading-relaxed">
                  Your request has been filed directly into our engineering triage board. We prioritize native Swift &amp; Rust macro decks based on this queue.
                </p>

                {/* Tracking ID Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] shadow-xs mb-6">
                  <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider font-medium">
                    Tracking ID:
                  </span>
                  <span className="text-sm font-mono font-bold text-[#D97706]">
                    {submittedId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 text-[#71717A] hover:text-[#111111] transition-colors cursor-pointer"
                    title="Copy Tracking ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="btn-primary-pill !h-10 !px-8 !text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner */}
                {error && (
                  <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                {/* 1. Target Application */}
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Target Application
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {POPULAR_APPS.map((app) => {
                      const isSelected = selectedApp === app;
                      return (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#111111] text-white border-[#111111] shadow-2xs font-medium"
                              : "bg-white text-[#555555] border-black/[0.08] hover:border-black/20 hover:text-black"
                          }`}
                        >
                          {app}
                        </button>
                      );
                    })}
                  </div>

                  {selectedApp === "Custom App" && (
                    <input
                      type="text"
                      placeholder="Enter application name (e.g. DaVinci Resolve, Ableton Live)"
                      value={customApp}
                      onChange={(e) => setCustomApp(e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-xl bg-white border border-black/[0.1] focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#111]"
                    />
                  )}
                </div>

                {/* 2. Control Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Control Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.label;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.label}
                          type="button"
                          onClick={() => setSelectedCategory(cat.label)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-white border-[#D97706] ring-1 ring-[#D97706]/30 shadow-xs"
                              : "bg-white/60 border-black/[0.08] hover:border-black/20"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#D97706]" : "text-[#71717A]"}`} />
                            <span className={`text-[11.5px] font-medium leading-tight ${isSelected ? "text-[#111111]" : "text-[#555555]"}`}>
                              {cat.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#888888] leading-tight">
                            {cat.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Feature / Control Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Control or Macro Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotary wheel to scrub timeline frames with haptic detents"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-black/[0.1] focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#111] placeholder:text-[#999]"
                  />
                </div>

                {/* 4. Workflow Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    What does your ideal workflow look like?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how you'd interact with your phone (e.g. thumb slide on right edge adjusts zoom, tapping macro 1 auto-formats rust code)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-white border border-black/[0.1] focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#111] placeholder:text-[#999] resize-none"
                  />
                </div>

                {/* 5. Notification Email (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Your Email <span className="text-[10px] font-normal text-[#888]">(optional, to get pinged when shipped)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="developer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3.5 text-xs rounded-xl bg-white border border-black/[0.1] focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#111] placeholder:text-[#999]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-[#666] hover:text-[#111] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-pill !h-10 !px-5 !text-xs cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Logging...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
