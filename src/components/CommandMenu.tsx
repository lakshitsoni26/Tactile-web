"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Laptop,
  Smartphone,
  MousePointer,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Code2,
  Layers,
  Shield,
  HelpCircle,
  BarChart3,
  BookOpen,
  X,
} from "lucide-react";
import {
  playKeyClick,
  playSwitchClick,
  playBeamChime,
  toggleSound,
  isSoundEnabled,
} from "@/lib/soundEngine";
import { useLenisLock } from "@/hooks/useLenisLock";
import { TactileMark } from "@/components/TactileLogo";

interface CommandItem {
  id: string;
  category: "Actions" | "Simulator" | "Audio" | "Navigation";
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManifesto?: () => void;
  onOpenWaitlist?: () => void;
}

export default function CommandMenu({
  isOpen,
  onClose,
  onOpenManifesto,
  onOpenWaitlist,
}: CommandMenuProps) {
  useLenisLock(isOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const copyShareLink = useCallback(() => {
    playSwitchClick();
    navigator.clipboard.writeText("https://tactile.lakshitsoni.in");
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      onClose();
    }, 800);
  }, [onClose]);

  const scrollTo = useCallback((id: string) => {
    playKeyClick();
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -72, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 80);
  }, [onClose]);

  // Dispatch custom event to coordinate with DeviceShowcase and scroll to sandbox view
  const triggerSimulatorEvent = useCallback((detail: Record<string, unknown>) => {
    playKeyClick();
    window.dispatchEvent(new CustomEvent("tactile_simulator_command", { detail }));
    onClose();
    setTimeout(() => {
      const el = document.getElementById("experience");
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -72, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 80);
  }, [onClose]);

  const commands: CommandItem[] = [
    {
      id: "share-tactile",
      category: "Actions",
      title: "Copy Shareable Link",
      subtitle: "https://tactile.lakshitsoni.in — Share Tactile with friends",
      shortcut: "↵",
      icon: copiedLink ? Check : Copy,
      action: copyShareLink,
    },
    {
      id: "join-waitlist",
      category: "Actions",
      title: "Claim VIP Founding Creator Pass",
      subtitle: "Join 239+ founding engineers with instant ticket generation",
      shortcut: "VIP",
      icon: Sparkles,
      action: () => {
        playBeamChime();
        onClose();
        if (onOpenWaitlist) onOpenWaitlist();
        else scrollTo("waitlist");
      },
    },
    {
      id: "read-manifesto",
      category: "Actions",
      title: "Read Founder's Manifesto",
      subtitle: "Why we built Tactile: The local-first hardware manifesto",
      shortcut: "DOC",
      icon: BookOpen,
      action: () => {
        playKeyClick();
        onClose();
        if (onOpenManifesto) {
          onOpenManifesto();
        } else {
          router.push("/manifesto");
        }
      },
    },
    {
      id: "sim-touchbar",
      category: "Simulator",
      title: "Switch to Dynamic Touch Bar Mode",
      subtitle: "Contextual app-aware macro deck on phone",
      shortcut: "1",
      icon: Smartphone,
      action: () => triggerSimulatorEvent({ mode: "touchbar" }),
    },
    {
      id: "sim-screen",
      category: "Simulator",
      title: "Switch to 60 FPS Auxiliary Display Mode",
      subtitle: "Full desktop extension with subpixel RGB zoom",
      shortcut: "2",
      icon: Laptop,
      action: () => triggerSimulatorEvent({ mode: "screen" }),
    },
    {
      id: "sim-trackpad",
      category: "Simulator",
      title: "Switch to Precision Glass Trackpad Mode",
      subtitle: "Ballistic inertia and multi-touch steering",
      shortcut: "3",
      icon: MousePointer,
      action: () => triggerSimulatorEvent({ mode: "trackpad" }),
    },
    {
      id: "sim-vscode",
      category: "Simulator",
      title: "Load VS Code Workspace Profile",
      subtitle: "Format, vitest runner, git commit triggers",
      icon: Code2,
      action: () => triggerSimulatorEvent({ tab: "vscode" }),
    },
    {
      id: "sim-figma",
      category: "Simulator",
      title: "Load Figma Studio Profile",
      subtitle: "Auto-layout, component detach, SVG export",
      icon: Layers,
      action: () => triggerSimulatorEvent({ tab: "figma" }),
    },
    {
      id: "sim-terminal",
      category: "Simulator",
      title: "Load Terminal / Docker Profile",
      subtitle: "Docker ps, dev server reload, build triggers",
      icon: Terminal,
      action: () => triggerSimulatorEvent({ tab: "terminal" }),
    },
    {
      id: "audio-toggle",
      category: "Audio",
      title: "Toggle Micro-Haptic Sound Synthesizer",
      subtitle: isSoundEnabled() ? "Currently active (Web Audio API)" : "Currently muted",
      shortcut: "M",
      icon: isSoundEnabled() ? Volume2 : VolumeX,
      action: () => {
        toggleSound();
      },
    },
    {
      id: "audio-cherry",
      category: "Audio",
      title: "Test Cherry MX Mechanical Click",
      subtitle: "Synthesized 2.8kHz transient snap (±12% acoustic jitter)",
      icon: Volume2,
      action: () => playKeyClick(1.0),
    },
    {
      id: "audio-killswitch",
      category: "Audio",
      title: "Test Heavy Hardware Killswitch Snap",
      subtitle: "Dual-resonant metallic relay click",
      icon: Volume2,
      action: () => playSwitchClick(),
    },
    {
      id: "nav-sandbox",
      category: "Navigation",
      title: "Jump to Hardware Studio Sandbox",
      subtitle: "Interactive dual-device Mac & phone emulator",
      icon: Laptop,
      action: () => scrollTo("experience"),
    },
    {
      id: "nav-features",
      category: "Navigation",
      title: "Jump to 5 Superpowers Bento Grid",
      subtitle: "Ultra-low latency, Touch Bar, precision glass trackpad",
      icon: Layers,
      action: () => scrollTo("features"),
    },
    {
      id: "nav-ecosystem",
      category: "Navigation",
      title: "Jump to Ecosystem & Peripheral Ticker",
      subtitle: "Android, Foldable, macOS, iPad compatibility specs",
      icon: Smartphone,
      action: () => scrollTo("ecosystem"),
    },
    {
      id: "nav-matrix",
      category: "Navigation",
      title: "Jump to Technical Benchmark Matrix",
      subtitle: "Tactile vs Apple Sidecar vs Duet Display vs Spacedesk",
      icon: BarChart3,
      action: () => scrollTo("comparison"),
    },
    {
      id: "nav-faq",
      category: "Navigation",
      title: "Jump to Technical FAQ & Security Specs",
      subtitle: "Latency measurements, USB protocols, and privacy guarantees",
      icon: HelpCircle,
      action: () => scrollTo("faq"),
    },
    {
      id: "nav-privacy",
      category: "Navigation",
      title: "View Local-First Privacy Architecture",
      subtitle: "Zero telemetry on display frames, zero cloud relays",
      icon: Shield,
      action: () => {
        onClose();
        router.push("/privacy");
      },
    },
    {
      id: "nav-terms",
      category: "Navigation",
      title: "View Terms of Service & License",
      subtitle: "Early-access developer preview terms",
      icon: BookOpen,
      action: () => {
        onClose();
        router.push("/terms");
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        playKeyClick();
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        playKeyClick(0.7);
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        playKeyClick(0.7);
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          if (cmd.category !== "Audio") {
            handleClose();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleClose}
          data-lenis-prevent="true"
          data-no-cursor-snap="true"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-28 px-4 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain cursor-pointer"
        >
          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-no-cursor-snap="true"
            className="relative w-full max-w-xl bg-[#080914]/98 border border-white/12 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_30px_rgba(0,240,255,0.12)] backdrop-blur-2xl overflow-hidden z-10 cursor-default my-4"
          >
            {/* Top Specular Rim */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <TactileMark size={20} glowIntensity="high" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, macro, or shortcut..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  title="Close (ESC)"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 hover:bg-white/16 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                >
                  <span>ESC</span>
                  <X className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="max-h-[380px] overflow-y-auto overscroll-contain py-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                  No matching commands found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs group cursor-pointer ${
                        isSelected
                          ? "bg-white/10 border border-blue-500/30 text-white shadow-sm"
                          : "text-zinc-300 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-white/5 text-zinc-400 group-hover:text-zinc-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white flex items-center gap-2">
                            <span>{cmd.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/6 text-zinc-400 uppercase tracking-wider">
                              {cmd.category}
                            </span>
                          </div>
                          {cmd.subtitle && (
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {cmd.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {cmd.shortcut && (
                        <div className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/6 border border-white/8 text-zinc-400">
                          {cmd.shortcut}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2.5 bg-[#05060d] border-t border-white/8 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white/8">↑</kbd>
                  <kbd className="px-1 rounded bg-white/8">↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white/8">↵</kbd> to execute
                </span>
              </div>
              <span className="text-zinc-400">Tactile Engine v2.4</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
