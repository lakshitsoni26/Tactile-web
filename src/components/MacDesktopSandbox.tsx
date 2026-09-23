"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import type { DesktopState, DesktopEvent, WindowId } from "@/lib/desktopState";
import { APP_PROFILES } from "@/lib/macroProfiles";
import {
  playKeyClick, playTapticClick, playWindowFocus, playWindowSnap, playAirDropChime
} from "@/lib/soundEngine";
import FigmaInteractiveCanvas from "./FigmaInteractiveCanvas";
import VSCodeInteractiveEditor from "./VSCodeInteractiveEditor";
import TerminalInteractiveShell from "./TerminalInteractiveShell";
import {
  Code2, Terminal as TermIcon, Layers, Folder, Settings, Trash2,
  FileCode, FileText, Wifi, Battery, Sliders, HardDrive, Disc,
  Search, Share2, Play, MousePointer, Square, Type, PenTool, Hand, MessageSquare,
  Sun, Volume2, LayoutGrid
} from "lucide-react";

interface MacDesktopSandboxProps {
  state: DesktopState;
  dispatch: React.Dispatch<DesktopEvent>;
  scheduleReset: () => void;
}

function MacTrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5 shrink-0 select-none"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center cursor-pointer transition-transform active:scale-90 shadow-sm"
        title="Close"
      >
        <span className={`text-[7.5px] font-bold text-[#4D0000] leading-none ${isHovered ? "opacity-100" : "opacity-0"}`}>×</span>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center cursor-pointer transition-transform active:scale-90 shadow-sm"
        title="Minimize to Dock"
      >
        <span className={`text-[7.5px] font-bold text-[#5C3A00] leading-none ${isHovered ? "opacity-100" : "opacity-0"}`}>−</span>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center cursor-pointer transition-transform active:scale-90 shadow-sm"
        title="Zoom / Fullscreen"
      >
        <span className={`text-[7px] font-bold text-[#004D00] leading-none ${isHovered ? "opacity-100" : "opacity-0"}`}>+</span>
      </button>
    </div>
  );
}

// ── REAL macOS DOCK SVG ICONS ─────────────────────────────────────────────

function FinderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="url(#finder-grad)" />
      {/* Two-tone Smiling Face */}
      <path d="M14 16C14 14.5 15.5 13 17 13H31C32.5 13 34 14.5 34 16V30C34 32.5 32 34 29 34H19C16 34 14 32.5 14 30V16Z" fill="#E8F4FC" />
      <path d="M24 13V29C24 31 22.5 32.5 20.5 32.5H19C16 32.5 14 31 14 29V16C14 14.5 15.5 13 17 13H24Z" fill="#75C2F6" />
      {/* Eyes and Smile */}
      <circle cx="19" cy="20" r="1.8" fill="#1D2A44" />
      <circle cx="29" cy="20" r="1.8" fill="#1D2A44" />
      <path d="M19 26C21 28.5 27 28.5 29 26" stroke="#1D2A44" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="finder-grad" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#389BFF" />
          <stop offset="1" stopColor="#0B63D6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VSCodeDockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="#1E1E1E" />
      <path d="M36 7.5L25 18L17 11.5L12 15V33L17 36.5L25 30L36 40.5L40 38.5V9.5L36 7.5Z" fill="#0066B8" />
      <path d="M36 7.5L25 18L36 28V7.5Z" fill="#007ACC" />
      <path d="M25 18L17 11.5L12 15L20 22.5L25 18Z" fill="#1F9CF0" />
      <path d="M36 40.5L25 30L36 20V40.5Z" fill="#007ACC" />
      <path d="M25 30L17 36.5L12 33L20 25.5L25 30Z" fill="#1F9CF0" />
    </svg>
  );
}

function FigmaDockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="#1E1E1E" />
      <path d="M16 12C16 8.7 18.7 6 22 6H28V18H22C18.7 18 16 15.3 16 12Z" fill="#F24E1E" />
      <path d="M28 6H34C37.3 6 40 8.7 40 12C40 15.3 37.3 18 34 18H28V6Z" fill="#FF7262" />
      <path d="M16 24C16 20.7 18.7 18 22 18H28V30H22C18.7 30 16 27.3 16 24Z" fill="#A259FF" />
      <circle cx="34" cy="24" r="6" fill="#1ABCFE" />
      <path d="M16 36C16 32.7 18.7 30 22 30H28V36C28 39.3 25.3 42 22 42C18.7 42 16 39.3 16 36Z" fill="#0ACF83" />
    </svg>
  );
}

function TerminalDockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="#1A1B23" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <rect x="4" y="4" width="40" height="7" rx="3" fill="#262835" />
      <circle cx="9" cy="7.5" r="1.5" fill="#FF5F56" />
      <circle cx="14" cy="7.5" r="1.5" fill="#FFBD2E" />
      <circle cx="19" cy="7.5" r="1.5" fill="#27C93F" />
      <path d="M12 20L18 25L12 30" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 30H32" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SystemSettingsDockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="url(#settings-grad)" />
      <circle cx="24" cy="24" r="7" fill="#6B7280" stroke="#E5E7EB" strokeWidth="2" />
      <defs>
        <linearGradient id="settings-grad" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CA3AF" />
          <stop offset="1" stopColor="#4B5563" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TrashDockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
      <rect width="48" height="48" rx="11" fill="#2D303E" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path d="M16 16H32V34C32 36.2 30.2 38 28 38H20C17.8 38 16 36.2 16 34V16Z" fill="#4B5166" />
      <path d="M14 14H34" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 12H27" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="20" x2="21" y2="32" stroke="#232634" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="20" x2="27" y2="32" stroke="#232634" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function MacDesktopSandbox({
  state,
  dispatch,
  scheduleReset,
}: MacDesktopSandboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDockIndex, setHoveredDockIndex] = useState<number | null>(null);
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<string | null>(null);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [spaceBanner, setSpaceBanner] = useState<string | null>(null);
  const prevSpaceRef = useRef(state.superpowerTelemetry.spaces.activeSpace);

  useEffect(() => {
    if (prevSpaceRef.current !== state.superpowerTelemetry.spaces.activeSpace) {
      const spaceNames = [
        "Space 1: Dev (VS Code)",
        "Space 2: Design (Figma)",
        "Space 3: Ops (Terminal)",
      ];
      setSpaceBanner(
        spaceNames[state.superpowerTelemetry.spaces.activeSpace] ||
          `Space ${state.superpowerTelemetry.spaces.activeSpace + 1}`
      );
      prevSpaceRef.current = state.superpowerTelemetry.spaces.activeSpace;
      const t = setTimeout(() => setSpaceBanner(null), 1300);
      return () => clearTimeout(t);
    }
  }, [state.superpowerTelemetry.spaces.activeSpace]);

  // Global Keyboard Shortcuts (⌘Space for Spotlight, Escape for dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        playKeyClick();
        dispatch({ type: "TOGGLE_SPOTLIGHT" });
      } else if (e.key === "Escape") {
        dispatch({ type: "CLOSE_ALL_OVERLAYS" });
        setActiveMenuDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // Time ticker (Clean authentic macOS menu bar clock format)
  const [timeString, setTimeString] = useState("Thu 9:41 AM");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString("en-US", { weekday: "short" }) +
        " " +
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, []);

  const focusedAppId = state.focusedWindowId;

  // Virtual macOS workspace canvas coordinates (scaled smoothly by MacScreenContent)
  const canvasSize = { width: 708, height: 420 };

  // Compute responsive layout coordinates for floating, left, right, and maximize snapping
  const getWindowLayout = (win: (typeof state.windows)[WindowId]) => {
    const cWidth = canvasSize.width || 708;
    const margin = 8;
    const gap = 8;
    const halfWidth = Math.max(260, Math.floor((cWidth - margin * 2 - gap) / 2));
    const usableHeight = 358;

    if (win.snap === "left") {
      return { x: margin, y: 6, width: halfWidth, height: usableHeight };
    }
    if (win.snap === "right") {
      return { x: margin + halfWidth + gap, y: 6, width: halfWidth, height: usableHeight };
    }
    if (win.snap === "max" || win.isMaximized) {
      return { x: margin, y: 6, width: Math.max(300, cWidth - margin * 2), height: usableHeight };
    }
    // Floating layout clamped safely within screen bounds
    const clampedX = Math.max(0, Math.min(cWidth - 100, win.rect.x));
    const clampedY = Math.max(6, Math.min(370, win.rect.y));
    const clampedW = Math.min(cWidth - clampedX, Math.max(280, win.rect.width));
    return { x: clampedX, y: clampedY, width: clampedW, height: win.rect.height };
  };

  // Pointer-based title drag: decoupled from Framer Motion's transform cache for zero conflict
  const draggingWindowRef = useRef<{
    windowId: WindowId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const handleTitlePointerDown = (windowId: WindowId, e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    handleFocusWindow(windowId);
    const win = state.windows[windowId];
    if (!win) return;

    const currentLayout = getWindowLayout(win);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    draggingWindowRef.current = {
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentLayout.x,
      origY: currentLayout.y,
    };
  };

  const handleTitlePointerMove = (e: React.PointerEvent) => {
    if (!draggingWindowRef.current) return;
    const { windowId, startX, startY, origX, origY } = draggingWindowRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const cWidth = canvasSize.width || 708;
    const newX = Math.max(0, Math.min(cWidth - 100, origX + dx));
    const newY = Math.max(6, Math.min(365, origY + dy));
    dispatch({ type: "MOVE_WINDOW", windowId, x: newX, y: newY });
  };

  const handleTitlePointerUp = (e: React.PointerEvent) => {
    if (draggingWindowRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      draggingWindowRef.current = null;
    }
  };

  const handleFocusWindow = (windowId: WindowId) => {
    if (state.isControlCenterOpen) dispatch({ type: "TOGGLE_CONTROL_CENTER" });
    if (state.isSpotlightOpen) dispatch({ type: "TOGGLE_SPOTLIGHT" });
    if (state.superpowerTelemetry.menubar.isTactileAppPopoverOpen) dispatch({ type: "TOGGLE_TACTILE_MENU_APP" });
    if (state.focusedWindowId !== windowId) {
      playWindowFocus();
      dispatch({ type: "FOCUS_WINDOW", windowId });
      scheduleReset();
    }
  };

  // Dock items
  const dockItems = [
    { id: "finder", label: "Finder", icon: FinderIcon, isRunning: true },
    { id: "vscode", label: "Visual Studio Code", icon: VSCodeDockIcon, isRunning: !state.windows.vscode.isMinimized },
    { id: "figma", label: "Figma", icon: FigmaDockIcon, isRunning: !state.windows.figma.isMinimized },
    { id: "terminal", label: "Terminal", icon: TerminalDockIcon, isRunning: !state.windows.terminal.isMinimized },
    { id: "settings", label: "System Settings", icon: SystemSettingsDockIcon, isRunning: false },
    { id: "trash", label: "Trash", icon: TrashDockIcon, isRunning: false },
  ];

  // AirDrop desktop file drag
  const handleStartFileDrag = (fileId: string) => {
    setDraggedFileId(fileId);
    playKeyClick();
  };

  const handleEndFileDrag = (e: React.PointerEvent) => {
    if (!draggedFileId) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > rect.width * 0.70) {
        dispatch({ type: "START_AIRDROP", fileId: draggedFileId });
        playAirDropChime(0.5);
        setTimeout(() => {
          dispatch({ type: "COMPLETE_AIRDROP", fileId: draggedFileId });
        }, 800);
      }
    }
    setDraggedFileId(null);
  };

  return (
    <div
      ref={containerRef}
      onPointerUp={handleEndFileDrag}
      onClick={() => setActiveMenuDropdown(null)}
      data-no-cursor-snap="true"
      className="mac-sandbox relative w-full h-[444px] bg-[#E5E7EB] select-none overflow-hidden flex flex-col font-sans touch-manipulation"
    >
      {/* ── REAL macOS SEQUOIA GRAPHIC LAYERED WALLPAPER ────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Deep Radiant Dusk Base */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 80% 20%, rgba(254, 215, 170, 0.70) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(191, 219, 254, 0.70) 0%, transparent 65%),
              radial-gradient(circle at 50% 50%, rgba(243, 232, 255, 0.60) 0%, transparent 70%),
              #E5E7EB
            `,
          }}
        />

        {/* Dynamic Graphic Ribbons (Authentic Sequoia Curves) */}
        <div className="absolute -top-[20%] right-[-10%] w-[580px] h-[340px] rounded-full bg-gradient-to-br from-amber-400/25 via-rose-300/20 to-transparent blur-[70px] -rotate-15 pointer-events-none" />
        <div className="absolute -bottom-[20%] left-[-10%] w-[540px] h-[320px] rounded-full bg-gradient-to-tr from-sky-400/25 via-indigo-300/20 to-transparent blur-[80px] rotate-12 pointer-events-none" />

        {/* Crisp Specular Horizon Arch */}
        <div className="absolute top-[35%] inset-x-[-10%] h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80" />

        {/* Fine SVG Grain Texture for anti-banding */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay pointer-events-none">
          <filter id="desktop-grain-mac">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#desktop-grain-mac)" />
        </svg>
      </div>

      {/* ── TOP REAL macOS TRANSLUCENT MENU BAR ───────────────────────────── */}
      <div className="h-6 bg-white/85 backdrop-blur-2xl border-b border-black/[0.08] px-2.5 flex items-center justify-between z-50 text-[10.5px] font-medium text-[#111111] flex-shrink-0 shadow-xs relative">
        
        {/* Left: Apple logo + Active Application Menus with Dropdowns (Stops cleanly before notch) */}
        <div className="flex items-center gap-2 relative w-[282px] shrink-0">
          
          {/* Apple Logo  */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playKeyClick();
              setActiveMenuDropdown(activeMenuDropdown === "apple" ? null : "apple");
            }}
            className="text-[13px] opacity-90 hover:opacity-100 cursor-pointer transition-opacity outline-none focus:outline-none focus-visible:outline-none select-none text-[#111111]"
          >
            
          </button>

          {/* Active Process Title */}
          <span className="font-bold tracking-tight text-[#111111] cursor-default shrink-0">
            {focusedAppId === "finder"
              ? "Finder"
              : focusedAppId === "vscode"
              ? "Code"
              : focusedAppId === "figma"
              ? "Figma"
              : "Terminal"}
          </span>

          {/* Standard Menus (Curated to fit comfortably to the left of the MacBook camera notch) */}
          <div className="flex items-center gap-2 text-[#555555] text-[10px] truncate">
            {(focusedAppId === "finder"
              ? ["File", "Edit", "View", "Go", "Window"]
              : focusedAppId === "vscode"
              ? ["File", "Edit", "Selection", "View", "Go"]
              : focusedAppId === "figma"
              ? ["File", "Edit", "View", "Object", "Vector"]
              : ["Shell", "Edit", "View", "Window"]
            ).map((m) => (
              <button
                key={m}
                onClick={(e) => {
                  e.stopPropagation();
                  playKeyClick();
                  setActiveMenuDropdown(activeMenuDropdown === m ? null : m);
                }}
                className={`hover:text-[#111111] cursor-pointer px-1 py-0.5 rounded transition-colors outline-none focus:outline-none focus-visible:outline-none select-none whitespace-nowrap ${
                  activeMenuDropdown === m ? "bg-black/[0.06] text-[#111111]" : ""
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* ── Apple Dropdown Menu ── */}
          <AnimatePresence>
            {activeMenuDropdown === "apple" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-6 left-0 w-48 bg-[#1b1e2c]/95 backdrop-blur-2xl border border-white/20 rounded-lg p-1 shadow-2xl z-50 text-[9px] font-sans text-white/90 space-y-0.5"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDropdown(null);
                    playKeyClick();
                    dispatch({ type: "TOGGLE_ABOUT_THIS_MAC" });
                  }}
                  className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between"
                >
                  <span>About This Mac</span>
                  <span className="opacity-40">Sequoia</span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDropdown(null);
                    playKeyClick();
                    dispatch({ type: "TOGGLE_CONTROL_CENTER" });
                  }}
                  className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer"
                >
                  System Settings...
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDropdown(null);
                    playKeyClick();
                    dispatch({ type: "TOGGLE_SPOTLIGHT" });
                  }}
                  className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between"
                >
                  <span>Spotlight Search</span>
                  <span className="opacity-50">⌘Space</span>
                </div>
                <div className="h-[1px] bg-white/10 my-1" />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDropdown(null);
                    playWindowFocus();
                    dispatch({ type: "FOCUS_DESKTOP" });
                  }}
                  className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between"
                >
                  <span>Hide All Windows</span>
                  <span className="opacity-50">⌘H</span>
                </div>
                <div className="h-[1px] bg-white/10 my-1" />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDropdown(null);
                    dispatch({ type: "RESET" });
                  }}
                  className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer"
                >
                  Restart Sandbox...
                </div>
              </motion.div>
            )}

            {/* ── File Dropdown Menu ── */}
            {activeMenuDropdown === "File" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-6 left-12 w-44 bg-[#1b1e2c]/95 backdrop-blur-2xl border border-white/20 rounded-lg p-1 shadow-2xl z-50 text-[9px] font-sans text-white/90 space-y-0.5"
              >
                <div className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between">
                  <span>New Window</span>
                  <span className="opacity-50">⌘N</span>
                </div>
                <div className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between">
                  <span>Open...</span>
                  <span className="opacity-50">⌘O</span>
                </div>
                <div className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between">
                  <span>Save</span>
                  <span className="opacity-50">⌘S</span>
                </div>
                <div className="h-[1px] bg-white/10 my-1" />
                <div className="px-2 py-1 hover:bg-[#3B82F6] hover:text-white rounded cursor-pointer flex justify-between">
                  <span>Close Window</span>
                  <span className="opacity-50">⌘W</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Center Notch Exclusion Zone (guarantees zero menu or telemetry collision) */}
        <div className="w-[124px] h-full shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Right: System Telemetry & Hardware Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] font-mono justify-end w-[282px] shrink-0">
          {/* Hardware Mic Muted Indicator (CoreAudio HAL) */}
          {state.superpowerTelemetry.meeting.isHardwareMicMuted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/25 border border-red-500/60 text-red-400 text-[7.5px] font-sans font-bold shadow-sm"
              title="Hardware Mic Gain 0.0 (CoreAudio HAL Driver Killswitch Active)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>MIC MUTED</span>
            </motion.div>
          )}

          {/* Tactile Native Menu Bar App Popover Trigger */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playKeyClick();
                dispatch({ type: "TOGGLE_TACTILE_MENU_APP" });
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${
                state.superpowerTelemetry.menubar.isTactileAppPopoverOpen
                  ? "bg-black/[0.08] text-[#111111]"
                  : "hover:bg-black/[0.05] text-[#333333]"
              }`}
              title="Tactile Menu Bar App"
            >
              <span className="w-2 h-2 rounded-[2px] bg-gradient-to-tr from-[#D97706] to-[#F59E0B] inline-block shadow-xs" />
              <span className="text-[8.5px] font-bold tracking-tight">Tactile</span>
            </button>

            {/* ── TACTILE.APP NATIVE MENU BAR POPOVER ── */}
            <AnimatePresence>
              {state.superpowerTelemetry.menubar.isTactileAppPopoverOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-6 right-0 w-64 bg-white/95 backdrop-blur-3xl border border-black/10 rounded-2xl p-3 shadow-2xl z-50 text-[#111111] font-sans select-none space-y-2.5"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                      <div>
                        <div className="text-[9.5px] font-bold text-[#111111]">Tactile Companion Host</div>
                        <div className="text-[7px] text-[#71717A] font-mono">Native Bridge · Apple Silicon</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[7.5px] font-mono font-bold">ACTIVE</span>
                  </div>

                  {/* Connected Companion */}
                  <div className="p-2 rounded-xl bg-[#F4F4F6] border border-black/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-[#555555]">Connected Companion</span>
                      <span className="text-[#D97706] font-mono font-bold">4.18ms</span>
                    </div>
                    <div className="text-[9px] font-semibold text-[#111111] flex items-center justify-between">
                      <span>iPhone 16 Pro Max</span>
                      <span className="text-[7.5px] px-1 py-0.2 rounded bg-black/[0.05] font-mono text-[#555555]">USB-C P2P</span>
                    </div>
                    <div className="text-[7px] text-[#71717A] font-mono">Stream: 120 FPS Retina · Hardware Encrypted</div>
                  </div>

                  {/* Dual-Plane Status */}
                  <div className="grid grid-cols-2 gap-1.5 text-[7.5px] font-mono">
                    <div className="p-1.5 rounded-lg bg-white border border-black/[0.06]">
                      <div className="text-[#888888]">CONTROL PLANE</div>
                      <div className="text-[#111111] font-bold">Direct P2P</div>
                      <div className="text-[#555555]">Local IPC Stream</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-black/[0.06]">
                      <div className="text-[#888888]">DISPLAY ENGINE</div>
                      <div className="text-[#D97706] font-bold">Zero-Lag</div>
                      <div className="text-[#555555]">Metal Accelerated</div>
                    </div>
                  </div>

                  {/* Master Switches */}
                  <div className="space-y-1.5 border-t border-black/[0.06] pt-2 text-[8px]">
                    {[
                      { key: "clipboard" as const, label: "Universal Clipboard Sync", desc: "Local encrypted sync" },
                      { key: "touchbar" as const, label: "Dynamic Contextual Touch Bar", desc: "Auto-adapts to active app" },
                      { key: "zeroVideo" as const, label: "Eco Battery Mode", desc: "<0.5% battery per hour" },
                      { key: "clamshell" as const, label: "Clamshell Mode Keepalive", desc: "Stay connected lid-closed" },
                    ].map((item) => {
                      const isActive = state.superpowerTelemetry.menubar.masterSwitches[item.key];
                      return (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-[#111111]">{item.label}</div>
                            <div className="text-[7px] text-[#71717A]">{item.desc}</div>
                          </div>
                          <button
                            onClick={() => dispatch({ type: "TOGGLE_MASTER_SWITCH", switchKey: item.key })}
                            className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                              isActive ? "bg-[#D97706]" : "bg-black/15"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${
                                isActive ? "right-0.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Diagnostic Actions */}
                  <div className="pt-1 flex items-center gap-1.5">
                    <button
                      onClick={() => dispatch({ type: "TRIGGER_KEYFRAME_SYNC" })}
                      className="flex-1 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[#111111] text-[7.5px] font-medium transition-colors cursor-pointer text-center"
                    >
                      Sync Keyframe
                    </button>
                    <button
                      onClick={() => dispatch({ type: "RESET" })}
                      className="flex-1 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-rose-600 text-[7.5px] font-medium transition-colors cursor-pointer text-center"
                    >
                      Reset Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DMA Status Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-xs text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tabular-nums font-semibold">4.18ms P2P</span>
          </div>

          <div className="flex items-center gap-2 text-[#555555]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playKeyClick();
                dispatch({ type: "TOGGLE_SPOTLIGHT" });
              }}
              title="Spotlight Search (⌘Space)"
              className="hover:text-[#111111] cursor-pointer transition-colors p-0.5 outline-none focus:outline-none focus-visible:outline-none select-none"
            >
              <Search className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playKeyClick();
                dispatch({ type: "TOGGLE_CONTROL_CENTER" });
              }}
              title="Control Center"
              className="hover:text-[#111111] cursor-pointer transition-colors p-0.5 outline-none focus:outline-none focus-visible:outline-none select-none"
            >
              <Sliders className="w-3 h-3" />
            </button>
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5 text-[8.5px]">
              <Battery className="w-3 h-3" />
              <span>100%</span>
            </div>
            <span className="font-sans font-medium text-[9.5px] text-[#111111] pl-1 select-none pointer-events-none whitespace-nowrap tabular-nums">{timeString}</span>
          </div>
        </div>
      </div>

      {/* ── DESKTOP CANVAS ────────────────────────────────────────────────── */}
      <div
        onClick={() => {
          setActiveMenuDropdown(null);
          if (state.isControlCenterOpen) dispatch({ type: "TOGGLE_CONTROL_CENTER" });
          if (state.isSpotlightOpen) dispatch({ type: "TOGGLE_SPOTLIGHT" });
          if (state.superpowerTelemetry.menubar.isTactileAppPopoverOpen) dispatch({ type: "TOGGLE_TACTILE_MENU_APP" });
          if (state.focusedWindowId !== "finder") {
            playWindowFocus();
            dispatch({ type: "FOCUS_DESKTOP" });
            scheduleReset();
          }
        }}
        className="flex-1 relative overflow-hidden cursor-default"
      >
        {/* Zoom Transform Layer (Superpower 03: 1x to 5x Zoom & Pan) */}
        <div
          style={{
            transform:
              state.activeSuperpower === "zoom"
                ? `scale(${state.superpowerTelemetry.zoom.scale})`
                : undefined,
            transformOrigin: `${state.superpowerTelemetry.zoom.focal.x}% ${state.superpowerTelemetry.zoom.focal.y}%`,
            transition: "transform 0.15s ease-out",
          }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="w-full h-full relative pointer-events-auto">
            {/* ── AUTHENTIC macOS DESKTOP ICONS (Top Right Side) ──────────────── */}
        <div className="absolute top-3 right-3 flex flex-col gap-2.5 z-0 pointer-events-auto">
          {/* Macintosh HD Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              playKeyClick();
              dispatch({ type: "FOCUS_DESKTOP" });
            }}
            className="flex flex-col items-center gap-0.5 w-16 p-1 rounded-md hover:bg-white/10 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#71717A] to-[#3F3F46] border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <HardDrive className="w-4 h-4 text-white" />
            </div>
            <span className="text-[7.5px] font-sans font-semibold text-white/90 text-center leading-tight drop-shadow">
              Macintosh HD
            </span>
          </div>

          {/* Draggable Project Files (AirDrop Sources) */}
          {state.airdropFiles.map((file) => (
            <div
              key={file.id}
              onPointerDown={() => handleStartFileDrag(file.id)}
              className={`flex flex-col items-center gap-0.5 w-16 p-1 rounded-md transition-all cursor-grab active:cursor-grabbing touch-manipulation group ${
                draggedFileId === file.id
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : "hover:bg-white/10"
              }`}
            >
              {file.type === "bin" ? (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#0EA5E9] to-[#0284C7] border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <FileCode className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-[7.5px] font-sans font-semibold text-white/90 text-center leading-tight truncate w-full drop-shadow">
                {file.name}
              </span>
              <span className="text-[6.5px] font-mono text-white/40">{file.size}</span>
            </div>
          ))}
        </div>

        {/* ── MULTI-WINDOW STACK ─────────────────────────────────────────── */}
        
        {/* 1. VS CODE WINDOW */}
        {!state.windows.vscode.isMinimized && (() => {
          const win = state.windows.vscode;
          const layout = getWindowLayout(win);
          return (
            <motion.div
              key="vscode-win"
              initial={false}
              animate={{
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              }}
              transition={{
                type: "spring",
                stiffness: 440,
                damping: 34,
                mass: 0.8,
              }}
              style={{
                position: "absolute",
                zIndex: win.zIndex,
              }}
              onPointerDown={() => handleFocusWindow("vscode")}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-xl overflow-hidden border flex flex-col will-change-transform ${
                state.focusedWindowId === "vscode"
                  ? "border-black/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)] opacity-100"
                  : "border-black/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] opacity-85 hover:opacity-95"
              } bg-[#FAFAFC]`}
            >
              {/* Sequoia Snap Halo Pulse */}
              {win.snap && state.focusedWindowId === "vscode" && (
                <motion.div
                  key={`snap-vscode-${win.snap}`}
                  initial={{ opacity: 0.9, scale: 0.985 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute -inset-[2px] rounded-xl border-2 border-[#D97706] pointer-events-none z-50 shadow-[0_0_24px_rgba(217,119,6,0.35)]"
                />
              )}

              {/* Title bar — DRAG HANDLE */}
              <div
                onPointerDown={(e) => handleTitlePointerDown("vscode", e)}
                onPointerMove={handleTitlePointerMove}
                onPointerUp={handleTitlePointerUp}
                onDoubleClick={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "vscode" })}
                className="h-7 bg-[#ECECEE] border-b border-black/[0.08] px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
              >
                <MacTrafficLights
                  onClose={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "vscode" })}
                  onMinimize={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "vscode" })}
                  onMaximize={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "vscode" })}
                />
                <span className="text-[8.5px] font-mono text-[#333333] font-medium truncate max-w-[200px]">
                  tactile-core.rs — VS Code
                </span>
                <div className="w-10" />
              </div>

              {/* Window Content */}
              <div className="flex-1 overflow-hidden min-h-0 relative pointer-events-auto">
                <VSCodeInteractiveEditor
                  mode="desktop"
                  isExecuting={state.status === "executing"}
                  lastAction={state.lastAction}
                  lastActionTimestamp={state.lastActionTimestamp}
                  vscodeState={state.vscodeState}
                  onSelectTab={(tabId) => dispatch({ type: "VSCODE_SET_TAB", tabId })}
                  onToggleTerminal={() => dispatch({ type: "VSCODE_TOGGLE_TERMINAL" })}
                  onToggleBreakpoint={() => dispatch({ type: "VSCODE_TOGGLE_BREAKPOINT" })}
                  onSetBranch={(branch) => dispatch({ type: "VSCODE_SET_BRANCH", branch })}
                />
              </div>
            </motion.div>
          );
        })()}

        {/* 2. FIGMA WINDOW */}
        {!state.windows.figma.isMinimized && (() => {
          const win = state.windows.figma;
          const layout = getWindowLayout(win);
          return (
            <motion.div
              key="figma-win"
              initial={false}
              animate={{
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              }}
              transition={{
                type: "spring",
                stiffness: 440,
                damping: 34,
                mass: 0.8,
              }}
              style={{
                position: "absolute",
                zIndex: win.zIndex,
              }}
              onPointerDown={() => handleFocusWindow("figma")}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-xl overflow-hidden border flex flex-col will-change-transform ${
                state.focusedWindowId === "figma"
                  ? "border-black/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)] opacity-100"
                  : "border-black/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] opacity-85 hover:opacity-95"
              } bg-[#F8F9FA]`}
            >
              {/* Sequoia Snap Halo Pulse */}
              {win.snap && state.focusedWindowId === "figma" && (
                <motion.div
                  key={`snap-figma-${win.snap}`}
                  initial={{ opacity: 0.9, scale: 0.985 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute -inset-[2px] rounded-xl border-2 border-[#D97706] pointer-events-none z-50 shadow-[0_0_24px_rgba(217,119,6,0.35)]"
                />
              )}

              {/* Title bar — DRAG HANDLE with Figma Toolbar */}
              <div
                onPointerDown={(e) => handleTitlePointerDown("figma", e)}
                onPointerMove={handleTitlePointerMove}
                onPointerUp={handleTitlePointerUp}
                onDoubleClick={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "figma" })}
                className="h-7 bg-[#ECECEE] border-b border-black/[0.08] px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
              >
                <div className="flex items-center gap-3">
                  <MacTrafficLights
                    onClose={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "figma" })}
                    onMinimize={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "figma" })}
                    onMaximize={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "figma" })}
                  />
                  
                  {/* Figma Tool Icons in Header */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[#555555] border-l border-black/10 pl-2">
                    <MousePointer className="w-2.5 h-2.5 text-[#0D99FF]" />
                    <Square className="w-2.5 h-2.5 hover:text-[#111111]" />
                    <Type className="w-2.5 h-2.5 hover:text-[#111111]" />
                    <PenTool className="w-2.5 h-2.5 hover:text-[#111111]" />
                  </div>
                </div>

                <span className="text-[8.5px] font-mono text-[#333333] font-medium truncate max-w-[180px]">
                  Tactile UI Kit
                </span>

                {/* Right Figma Actions */}
                <div className="flex items-center gap-1.5">
                  <button className="px-2 py-0.5 rounded bg-[#0D99FF] text-white text-[7.5px] font-semibold hover:brightness-110 cursor-pointer">
                    Share
                  </button>
                  <div className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center text-[#555555]">
                    <Play className="w-2 h-2 fill-[#555555]" />
                  </div>
                </div>
              </div>

            {/* Window Content: Layers on Left, Canvas Center, Inspector on Right */}
            <div className="flex-1 flex overflow-hidden min-h-0 relative pointer-events-auto">
              {/* Left Layers Sidebar */}
              <div className="w-20 shrink-0 bg-[#F4F4F6] border-r border-black/[0.08] p-1.5 space-y-1 overflow-hidden font-mono text-[7px] select-none text-[#111111]">
                <div className="text-[6.5px] text-[#888888] uppercase font-bold tracking-wider">Layers</div>
                <div
                  onClick={() => dispatch({ type: "FIGMA_SELECT_LAYER", layer: "companion" })}
                  className={`truncate font-semibold flex items-center gap-1 cursor-pointer ${
                    state.figmaState.selectedLayer === "companion" ? "text-[#D97706]" : "text-[#111111]"
                  }`}
                >
                  <span>❖</span>
                  <span>Companion</span>
                </div>
                <div
                  onClick={() => dispatch({ type: "FIGMA_SELECT_LAYER", layer: "header" })}
                  className={`truncate pl-2 flex items-center gap-1 cursor-pointer hover:text-[#111111] ${
                    state.figmaState.selectedLayer === "header" ? "text-[#D97706] font-semibold" : "text-[#666666]"
                  }`}
                >
                  <span>⊡</span>
                  <span>Header</span>
                </div>
                <div
                  onClick={() => dispatch({ type: "FIGMA_SELECT_LAYER", layer: "card" })}
                  className={`truncate pl-2 flex items-center gap-1 cursor-pointer hover:text-[#111111] ${
                    state.figmaState.selectedLayer === "card" ? "text-[#D97706] font-semibold" : "text-[#666666]"
                  }`}
                >
                  <span>⊡</span>
                  <span>Hero Card</span>
                </div>
                <div
                  onClick={() => dispatch({ type: "FIGMA_SELECT_LAYER", layer: "cta" })}
                  className={`truncate pl-2 flex items-center gap-1 cursor-pointer hover:text-[#111111] ${
                    state.figmaState.selectedLayer === "cta" ? "text-[#D97706] font-semibold" : "text-[#666666]"
                  }`}
                >
                  <span>⊡</span>
                  <span>CTA Group</span>
                </div>
              </div>

              {/* Center Canvas */}
              <div className="flex-1 relative overflow-hidden bg-[#EDEDF0]">
                <FigmaInteractiveCanvas
                  demoState={{
                    activeApp: "figma",
                    activeProtocol: state.protocol,
                    deviceOS: state.deviceOS,
                    status: state.status,
                    lastAction: state.lastAction,
                    lastActionTimestamp: state.lastActionTimestamp,
                    activityLog: [],
                    latencyMs: state.latencyMs,
                    latencyJitter: state.latencyJitter,
                  }}
                  mode="desktop"
                  figmaState={state.figmaState}
                  onToggleLink={() => dispatch({ type: "FIGMA_TOGGLE_LINK" })}
                  onSetLink={(isLinked) => dispatch({ type: "FIGMA_SET_LINK", isLinked })}
                  onToggleSwitch={() => dispatch({ type: "FIGMA_TOGGLE_SWITCH" })}
                  onSelectLayer={(layer) => dispatch({ type: "FIGMA_SELECT_LAYER", layer })}
                />
              </div>

              {/* Right Design Properties Inspector */}
              <div className="w-20 shrink-0 bg-[#F4F4F6] border-l border-black/[0.08] p-1.5 space-y-1 overflow-hidden font-mono text-[7px] select-none text-[#111111]">
                <div className="text-[6.5px] text-[#888888] uppercase font-bold tracking-wider">Design</div>
                <div className="grid grid-cols-2 gap-1 text-[#555555]">
                  <span>W 390</span>
                  <span>H 844</span>
                  <span>X 120</span>
                  <span>Y 48</span>
                </div>
                <div className="pt-1 border-t border-black/[0.06]">
                  <div className="text-[6.5px] text-[#888888] uppercase font-bold">Auto Layout</div>
                  <span className="text-[#D97706] font-semibold">16px gap</span>
                </div>
                <div className="pt-1 border-t border-black/[0.06]">
                  <div className="text-[6.5px] text-[#888888] uppercase font-bold">Fill</div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-white border border-black/20" />
                    <span>#FFFFFF</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

        {/* 3. TERMINAL WINDOW */}
        {!state.windows.terminal.isMinimized && (() => {
          const win = state.windows.terminal;
          const layout = getWindowLayout(win);
          return (
            <motion.div
              key="terminal-win"
              initial={false}
              animate={{
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              }}
              transition={{
                type: "spring",
                stiffness: 440,
                damping: 34,
                mass: 0.8,
              }}
              style={{
                position: "absolute",
                zIndex: win.zIndex,
              }}
              onPointerDown={() => handleFocusWindow("terminal")}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-xl overflow-hidden border flex flex-col will-change-transform ${
                state.focusedWindowId === "terminal"
                  ? "border-black/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)] opacity-100"
                  : "border-black/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] opacity-85 hover:opacity-95"
              } bg-[#FAFAFC]`}
            >
              {/* Sequoia Snap Halo Pulse */}
              {win.snap && state.focusedWindowId === "terminal" && (
                <motion.div
                  key={`snap-term-${win.snap}`}
                  initial={{ opacity: 0.9, scale: 0.985 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute -inset-[2px] rounded-xl border-2 border-[#D97706] pointer-events-none z-50 shadow-[0_0_24px_rgba(217,119,6,0.35)]"
                />
              )}

              {/* Title bar — DRAG HANDLE */}
              <div
                onPointerDown={(e) => handleTitlePointerDown("terminal", e)}
                onPointerMove={handleTitlePointerMove}
                onPointerUp={handleTitlePointerUp}
                onDoubleClick={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "terminal" })}
                className="h-7 bg-[#ECECEE] border-b border-black/[0.08] px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
              >
                <MacTrafficLights
                  onClose={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "terminal" })}
                  onMinimize={() => dispatch({ type: "MINIMIZE_WINDOW", windowId: "terminal" })}
                  onMaximize={() => dispatch({ type: "MAXIMIZE_WINDOW", windowId: "terminal" })}
                />
                <span className="text-[8.5px] font-mono text-[#333333] font-medium truncate max-w-[200px]">
                  lakshit — zsh — 80×24
                </span>
                <div className="w-10" />
              </div>

              {/* Window Content */}
              <div className="flex-1 overflow-hidden min-h-0 relative pointer-events-auto">
                <TerminalInteractiveShell
                  mode="desktop"
                  isExecuting={state.status === "executing"}
                  lastAction={state.lastAction}
                  lastActionTimestamp={state.lastActionTimestamp}
                  terminalState={state.terminalState}
                  onAddCommand={(item) => dispatch({ type: "TERMINAL_ADD_COMMAND", item })}
                  onClear={() => dispatch({ type: "TERMINAL_CLEAR" })}
                />
              </div>
            </motion.div>
          );
        })()}
          </div>
        </div>

        {/* ── ZOOM ACTIVE FLOATING HUD ────────────────────────────────────── */}
        {state.activeSuperpower === "zoom" && state.superpowerTelemetry.zoom.scale > 1.05 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.35)] text-[8px] font-mono text-[#8B5CF6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span>ZOOM {state.superpowerTelemetry.zoom.scale.toFixed(1)}x · M⁻¹ INVERSE MATRIX ACTIVE</span>
          </div>
        )}

        {/* ── macOS SPACE SWITCH CENTERED BEZEL HUD ───────────────────────── */}
        <AnimatePresence>
          {spaceBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-1/3 mx-auto w-fit z-50 pointer-events-none px-4 py-2 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-center gap-2.5 text-white font-mono text-[9.5px]"
            >
              <LayoutGrid className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-bold">{spaceBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── REAL macOS BEZEL VOLUME / BRIGHTNESS HUD OVERLAY ─────────────── */}
        <AnimatePresence>
          {state.hudState.type && Date.now() - state.hudState.timestamp < 1800 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none select-none"
            >
              <div className="w-32 h-32 rounded-2xl bg-[#161824]/85 backdrop-blur-2xl border border-white/20 shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-4 text-white">
                <div className="w-10 h-10 flex items-center justify-center text-white/90">
                  {state.hudState.type === "volume" ? (
                    <Volume2 className="w-8 h-8 text-white" />
                  ) : (
                    <Sun className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="text-[9.5px] font-sans font-semibold tracking-wide capitalize text-white/80">
                  {state.hudState.type}
                </div>
                {/* 16-Segment Apple Bezel Meter */}
                <div className="w-full flex items-center gap-[2px] h-2 bg-black/40 p-[1.5px] rounded-md border border-white/10">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const stepValue = ((i + 1) / 16) * 100;
                    const isFilled = state.hudState.value >= stepValue - 3;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-[1px] transition-colors ${
                          isFilled ? "bg-white shadow-[0_0_4px_white]" : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MISSION CONTROL OVERLAY ─────────────────────────────────────── */}
        <AnimatePresence>
          {state.superpowerTelemetry.spaces.isMissionControl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: "TOGGLE_MISSION_CONTROL" })}
              className="absolute inset-0 bg-black/75 backdrop-blur-md z-40 p-4 flex flex-col justify-between select-none cursor-pointer"
            >
              {/* Top Spaces Strip */}
              <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                {[
                  { id: 0, label: "Space 1: Dev" },
                  { id: 1, label: "Space 2: Design" },
                  { id: 2, label: "Space 3: Ops" },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      playWindowFocus();
                      dispatch({ type: "SWITCH_SPACE", spaceIndex: sp.id });
                    }}
                    className={`px-3 py-1 rounded-lg text-[8.5px] font-medium transition-all cursor-pointer ${
                      state.superpowerTelemetry.spaces.activeSpace === sp.id
                        ? "bg-[#00F0FF]/25 border border-[#00F0FF]/60 text-white font-bold shadow-lg"
                        : "bg-white/10 border border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              {/* Tiled Windows Gallery */}
              <div className="flex items-center justify-center gap-3 my-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "vscode" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "vscode" });
                    dispatch({ type: "TOGGLE_MISSION_CONTROL" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#00F0FF] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <VSCodeDockIcon /> VS Code
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-mono text-[7px] text-white/70 overflow-hidden leading-relaxed border border-white/5">
                    <div>pub fn init_bridge() &#123;</div>
                    <div className="text-[#00F0FF]">  UsbBulk::connect()?;</div>
                    <div>&#125;</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "figma" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "figma" });
                    dispatch({ type: "TOGGLE_MISSION_CONTROL" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#00F0FF] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <FigmaDockIcon /> Figma
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-sans text-[7.5px] text-purple-400 flex items-center justify-center border border-white/5">
                    Touch Bar Canvas
                  </div>
                </button>

                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "terminal" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "terminal" });
                    dispatch({ type: "TOGGLE_MISSION_CONTROL" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#00F0FF] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <TerminalDockIcon /> Terminal
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-mono text-[7px] text-emerald-400 leading-relaxed border border-white/5">
                    <div>cargo run --release</div>
                    <div className="text-white/40">1000Hz HID pipe</div>
                  </div>
                </button>
              </div>

              <div className="text-center text-[8px] text-white/50">
                Click window to focus • Click backdrop or press ⎋ to exit Mission Control
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── APP EXPOSÉ OVERLAY ──────────────────────────────────────────── */}
        <AnimatePresence>
          {state.superpowerTelemetry.spaces.isAppExpose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: "TOGGLE_EXPOSE" })}
              className="absolute inset-0 bg-black/75 backdrop-blur-md z-40 p-4 flex flex-col justify-between select-none cursor-pointer"
            >
              <div className="text-center" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/40">
                  🗖 App Exposé · All Windows
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 my-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "vscode" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "vscode" });
                    dispatch({ type: "TOGGLE_EXPOSE" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#8B5CF6] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <VSCodeDockIcon /> VS Code
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-mono text-[7px] text-white/70 overflow-hidden leading-relaxed border border-white/5">
                    <div>tactile-core.rs · Rust</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "figma" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "figma" });
                    dispatch({ type: "TOGGLE_EXPOSE" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#8B5CF6] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <FigmaDockIcon /> Figma
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-sans text-[7.5px] text-purple-400 flex items-center justify-center border border-white/5">
                    Tactile UI Kit · Frame
                  </div>
                </button>

                <button
                  onClick={() => {
                    playWindowFocus();
                    dispatch({ type: "FOCUS_WINDOW", windowId: "terminal" });
                    dispatch({ type: "RESTORE_WINDOW", windowId: "terminal" });
                    dispatch({ type: "TOGGLE_EXPOSE" });
                  }}
                  className="p-2.5 rounded-xl bg-[#0c0d14] border border-white/20 hover:border-[#8B5CF6] shadow-2xl transition-all hover:scale-105 cursor-pointer text-left w-52"
                >
                  <div className="text-[8.5px] font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <TerminalDockIcon /> Terminal
                  </div>
                  <div className="h-24 bg-black/70 rounded-lg p-2 font-mono text-[7px] text-emerald-400 leading-relaxed border border-white/5">
                    <div>zsh · /dev/usb4180</div>
                  </div>
                </button>
              </div>

              <div className="text-center text-[8px] text-white/50">
                Click window to focus • Click backdrop or press ⎋ to exit App Exposé
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CLAMSHELL HEADLESS MODE OVERLAY (Mac Screen Sleeping) ─────── */}
        <AnimatePresence>
          {state.superpowerTelemetry.clamshell.isLidClosed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-[#05060b]/96 backdrop-blur-2xl z-40 flex flex-col items-center justify-center text-center p-6 select-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-2xl">
                <span className="text-xl opacity-70"></span>
              </div>
              <h3 className="text-xs font-bold text-white tracking-tight">MacBook Pro Lid Closed (Clamshell Mode)</h3>
              <p className="text-[8.5px] text-white/50 max-w-sm mt-1 mb-3 leading-relaxed">
                Internal display asleep. Headless streaming active on <strong className="text-[#00F0FF]">iPhone 16 Pro</strong> via virtual <strong className="text-white">2940×1912 CGVirtualDisplay</strong> & CVDisplayLink keepalive.
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[8px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                  <span>CVDisplayLink: 60 FPS GPU Keepalive</span>
                </div>
                <button
                  onClick={() => dispatch({ type: "TOGGLE_CLAMSHELL" })}
                  className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[8px] font-medium text-white transition-colors cursor-pointer"
                >
                  Open Lid (Wake Mac)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SPOTLIGHT SEARCH MODAL (⌘Space) ──────────────────────────────── */}
        <AnimatePresence>
          {state.isSpotlightOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-10 inset-x-0 mx-auto w-[360px] bg-[#1a1c28]/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] z-50 overflow-hidden font-sans select-none"
            >
              {/* Search input field */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10">
                <Search className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                <input
                  type="text"
                  placeholder="Spotlight Search"
                  autoFocus
                  value={spotlightQuery}
                  onChange={(e) => setSpotlightQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const targets: WindowId[] = ["vscode", "figma", "terminal"];
                      const matched = targets.find((t) =>
                        t.includes(spotlightQuery.toLowerCase()) ||
                        (t === "vscode" && "code".includes(spotlightQuery.toLowerCase()))
                      ) || "vscode";
                      playWindowSnap();
                      dispatch({ type: "RESTORE_WINDOW", windowId: matched });
                      dispatch({ type: "TOGGLE_SPOTLIGHT" });
                      setSpotlightQuery("");
                    }
                  }}
                  className="bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none w-full font-sans"
                />
                <button
                  onClick={() => {
                    dispatch({ type: "TOGGLE_SPOTLIGHT" });
                    setSpotlightQuery("");
                  }}
                  className="text-[8px] font-mono text-white/40 hover:text-white px-1.5 py-0.5 rounded border border-white/15 cursor-pointer"
                >
                  esc
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="p-1.5 space-y-0.5 text-[9px]">
                <div className="text-[7.5px] font-semibold text-white/40 px-2 py-0.5 uppercase tracking-wider">
                  Top Hit & Applications
                </div>

                {[
                  {
                    id: "vscode" as WindowId,
                    name: "Visual Studio Code",
                    desc: "Applications • Rust Core DMA Engine",
                    icon: VSCodeDockIcon,
                  },
                  {
                    id: "figma" as WindowId,
                    name: "Figma",
                    desc: "Applications • Tactile Touch Bar Canvas",
                    icon: FigmaDockIcon,
                  },
                  {
                    id: "terminal" as WindowId,
                    name: "Terminal",
                    desc: "Utilities • zsh shell (1000Hz HID daemon)",
                    icon: TerminalDockIcon,
                  },
                ]
                  .filter((item) =>
                    spotlightQuery.trim() === "" ||
                    item.name.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(spotlightQuery.toLowerCase())
                  )
                  .map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          playWindowSnap();
                          dispatch({ type: "RESTORE_WINDOW", windowId: item.id });
                          dispatch({ type: "TOGGLE_SPOTLIGHT" });
                          setSpotlightQuery("");
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[#00F0FF]/15 hover:text-[#00F0FF] text-white/90 group cursor-pointer transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <ItemIcon />
                          </div>
                          <div>
                            <div className="font-medium text-[9.5px] text-white group-hover:text-[#00F0FF]">
                              {item.name}
                            </div>
                            <div className="text-[7.5px] text-white/50 group-hover:text-[#00F0FF]/70">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] text-white/40 font-mono group-hover:text-[#00F0FF]">
                          ↵ Open
                        </span>
                      </button>
                    );
                  })}

                <div className="pt-1 border-t border-white/10 flex items-center justify-between px-2 text-[7.5px] text-white/40">
                  <span>Tactile DMA Protocol: 4.18ms Direct Link</span>
                  <span>Press ⎋ to close</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CONTROL CENTER PANEL ────────────────────────────────────────── */}
        <AnimatePresence>
          {state.isControlCenterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 w-64 bg-[#1b1e2c]/95 backdrop-blur-3xl border border-white/20 rounded-2xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] z-50 text-white font-sans select-none space-y-2"
            >
              {/* Top connectivity 2x2 grid */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00F0FF] text-black flex items-center justify-center shrink-0">
                    <Wifi className="w-3 h-3" />
                  </div>
                  <div className="leading-tight overflow-hidden">
                    <div className="text-[9px] font-semibold truncate">Wi-Fi</div>
                    <div className="text-[7.5px] text-white/60 truncate">Tactile-Direct-5G</div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00F0FF] text-black flex items-center justify-center shrink-0">
                    <Battery className="w-3 h-3" />
                  </div>
                  <div className="leading-tight overflow-hidden">
                    <div className="text-[9px] font-semibold truncate">Power</div>
                    <div className="text-[7.5px] text-white/60 truncate">100% (MagSafe)</div>
                  </div>
                </div>
              </div>

              {/* Sliders: Display & Sound */}
              <div className="space-y-1.5 bg-white/5 border border-white/10 rounded-xl p-2">
                <div className="flex items-center justify-between text-[8px] text-white/70">
                  <span className="flex items-center gap-1"><Sun className="w-2.5 h-2.5" /> Display</span>
                  <span className="font-mono">{state.rotaryControls.brightness}%</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-150"
                    style={{ width: `${state.rotaryControls.brightness}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[8px] text-white/70 pt-1">
                  <span className="flex items-center gap-1"><Volume2 className="w-2.5 h-2.5" /> Sound</span>
                  <span className="font-mono">{state.rotaryControls.volume}%</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-150"
                    style={{ width: `${state.rotaryControls.volume}%` }}
                  />
                </div>
              </div>

              {/* Tactile Hardware Bridge Telemetry */}
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#00F0FF]/15 to-[#8B5CF6]/15 border border-[#00F0FF]/30 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                    <span className="text-[8.5px] font-bold text-[#00F0FF] uppercase tracking-wider">Tactile DMA Host</span>
                  </div>
                  <span className="text-[7.5px] font-mono text-white/60">4.18ms</span>
                </div>
                <div className="text-[7.5px] text-white/70">
                  Companion: iPhone 16 Pro (Active HID Pipe)
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={() => dispatch({ type: "SET_COMPANION_MODE", mode: "touchbar" })}
                    className={`flex-1 py-1 rounded text-[7.5px] font-medium transition-all ${
                      state.companionMode === "touchbar"
                        ? "bg-[#00F0FF] text-black font-bold shadow-sm"
                        : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    Touch Bar
                  </button>
                  <button
                    onClick={() => dispatch({ type: "SET_COMPANION_MODE", mode: "sidecar" })}
                    className={`flex-1 py-1 rounded text-[7.5px] font-medium transition-all ${
                      state.companionMode === "sidecar"
                        ? "bg-[#00F0FF] text-black font-bold shadow-sm"
                        : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    Aux Display
                  </button>
                  <button
                    onClick={() => dispatch({ type: "SET_COMPANION_MODE", mode: "trackpad" })}
                    className={`flex-1 py-1 rounded text-[7.5px] font-medium transition-all ${
                      state.companionMode === "trackpad"
                        ? "bg-[#00F0FF] text-black font-bold shadow-sm"
                        : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    Trackpad
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ABOUT THIS MAC MODAL ────────────────────────────────────────── */}
        <AnimatePresence>
          {state.isAboutThisMacOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#1b1e2c]/95 backdrop-blur-3xl border border-white/20 rounded-2xl p-3 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] z-50 text-white font-sans select-none space-y-2.5"
            >
              {/* Modal header with close red traffic light */}
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_ABOUT_THIS_MAC" })}
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-90"
                    title="Close"
                  >
                    <span className="text-[6.5px] text-[#4D0000] font-bold leading-none">×</span>
                  </button>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-[8.5px] font-semibold text-white/70">About This Mac</span>
                <div className="w-6" />
              </div>

              {/* Hardware Information */}
              <div className="flex flex-col items-center text-center space-y-1 py-0.5">
                {/* Apple Silicon Graphic */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-700 to-black border border-white/25 flex items-center justify-center shadow-lg">
                  <span className="text-lg"></span>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-white tracking-tight">MacBook Pro</h3>
                  <p className="text-[7.5px] text-white/50">16-inch, 2024</p>
                </div>

                <div className="w-full bg-white/5 rounded-lg p-2 border border-white/10 text-[7.5px] space-y-0.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-white/50">Chip:</span>
                    <span className="font-semibold text-white">Apple M4 Max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Memory:</span>
                    <span className="font-semibold text-white">64 GB Unified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">macOS:</span>
                    <span className="font-semibold text-white">Sequoia 15.3.1</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-0.5 text-[#00F0FF]">
                    <span>Tactile Host:</span>
                    <span className="font-mono font-semibold">v2.4 (4.18ms DMA)</span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch({ type: "TOGGLE_ABOUT_THIS_MAC" })}
                  className="w-full py-1 rounded-md bg-white/15 hover:bg-white/25 text-[8px] font-medium transition-colors cursor-pointer"
                >
                  System Report...
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── VIRTUAL DESKTOP CURSOR (Driven by Phone Trackpad) ───────────── */}
        <AnimatePresence>
          {state.companionMode === "trackpad" && state.trackpadCursor.isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: state.trackpadCursor.isDown ? 0.88 : 1,
                x: state.trackpadCursor.x,
                y: state.trackpadCursor.y,
              }}
              exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.4 }}
              className="absolute pointer-events-none z-50 transform -translate-x-1 -translate-y-1"
            >
              {/* macOS Black/White Arrow Pointer */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
                  fill="black"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Click Ripple Indicator */}
              {state.trackpadCursor.isDown && (
                <span className="absolute -inset-2 rounded-full border-2 border-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-ping" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AUTHENTIC 3D FROSTED GLASS macOS DOCK ────────────────────────── */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center z-40 pointer-events-auto select-none">
          <div
            onMouseLeave={() => setHoveredDockIndex(null)}
            className="flex items-end gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.12] backdrop-blur-3xl border border-white/[0.22] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)]"
          >
            {dockItems.map((item, idx) => {
              let scale = 1.0;
              if (hoveredDockIndex !== null) {
                const dist = Math.abs(hoveredDockIndex - idx);
                scale = 1.0 + 0.45 * Math.exp(-(dist * dist) / 1.8);
              }

              const Icon = item.icon;
              const isRunning = item.isRunning;
              const isHovered = hoveredDockIndex === idx;

              return (
                <div key={item.id} className="relative flex flex-col items-center">
                  {/* Tooltip on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: -4, scale: 1 }}
                        exit={{ opacity: 0, y: 2, scale: 0.9 }}
                        className="absolute -top-7 px-2 py-0.5 rounded-md bg-[#12141e]/90 backdrop-blur-md border border-white/15 text-[8px] font-sans font-medium text-white shadow-xl whitespace-nowrap pointer-events-none z-50"
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dock Icon Button */}
                  <button
                    onMouseEnter={() => {
                      setHoveredDockIndex(idx);
                      playTapticClick(0);
                    }}
                    onClick={() => {
                      playWindowSnap();
                      if (item.id === "finder") {
                        dispatch({ type: "FOCUS_DESKTOP" });
                      } else if (item.id === "vscode" || item.id === "figma" || item.id === "terminal") {
                        dispatch({ type: "RESTORE_WINDOW", windowId: item.id });
                      } else if (item.id === "settings") {
                        dispatch({ type: "TOGGLE_CONTROL_CENTER" });
                      }
                    }}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "bottom center",
                    }}
                    className="flex flex-col items-center justify-end p-0.5 transition-transform duration-100 cursor-pointer touch-manipulation active:scale-95"
                  >
                    <div className="w-8 h-8 flex items-center justify-center filter drop-shadow-md">
                      <Icon />
                    </div>

                    {/* Running Indicator Dot */}
                    {isRunning ? (
                      <span
                        className={`w-1 h-1 rounded-full mt-1 transition-all ${
                          state.focusedWindowId === item.id
                            ? "bg-[#00F0FF] shadow-[0_0_6px_#00F0FF] scale-125"
                            : "bg-white/80 shadow-[0_0_4px_white]"
                        }`}
                      />
                    ) : (
                      <span className="w-1 h-1 mt-1 opacity-0" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
