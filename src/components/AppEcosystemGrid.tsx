"use client";

import React from "react";
import {
  Code2,
  Component,
  Terminal,
  Cpu,
  Music,
  Video,
  Layers,
  Folder,
  Bot,
  MessageSquare,
} from "lucide-react";

interface EcosystemApp {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const APPS_ROW_1: EcosystemApp[] = [
  { id: "vscode", name: "VS Code", category: "Debugger & Format", color: "#007ACC", icon: Code2 },
  { id: "xcode", name: "Xcode", category: "Build & Simulator", color: "#147EFB", icon: Layers },
  { id: "figma", name: "Figma", category: "AutoLayout & Tokens", color: "#F24E1E", icon: Component },
  { id: "terminal", name: "Terminal", category: "Shell & Git Ops", color: "#1E293B", icon: Terminal },
  { id: "cursor", name: "Cursor", category: "AI Agent MCP", color: "#6366F1", icon: Bot },
];

const APPS_ROW_2: EcosystemApp[] = [
  { id: "davinci", name: "DaVinci Resolve", category: "Timeline Scrub", color: "#EC4899", icon: Video },
  { id: "spotify", name: "Spotify", category: "Audio Controls", color: "#10B981", icon: Music },
  { id: "slack", name: "Slack", category: "Quick Status & Mute", color: "#E11D48", icon: MessageSquare },
  { id: "docker", name: "Docker", category: "Container Switch", color: "#0284C7", icon: Cpu },
  { id: "finder", name: "Finder", category: "Spaces & AirDrop", color: "#0969DA", icon: Folder },
];

export default function AppEcosystemGrid() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="workflows">
      {/* Resurf 1:1 Clean Header */}
      <div className="text-center mb-12">
        <h3 className="font-[family-name:var(--font-instrument-serif)] text-[28px] sm:text-[34px] md:text-[38px] leading-[1.1] tracking-tight font-normal text-[#111111] mb-2">
          Control every Mac workflow
        </h3>
        <p className="text-[14.5px] sm:text-[15.5px] text-[#666666] max-w-lg mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
          VS Code, Xcode, Figma, Terminal, Cursor, Spotify, DaVinci, and Finder — native companion decks for every frontmost application.
        </p>
      </div>

      {/* Clean Minimal App Deck — 10 Apps perfectly balanced: 2 cols on mobile (5 rows), 5 cols on desktop (2 rows) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 max-w-4xl mx-auto">
        {[...APPS_ROW_1, ...APPS_ROW_2].map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-black/[0.07] shadow-xs hover:shadow-md hover:border-black/15 transition-all duration-200 group text-center cursor-default"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs transition-transform group-hover:scale-105"
                style={{ backgroundColor: app.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-[#111111] tracking-tight whitespace-nowrap">
                {app.name}
              </span>
              <span className="text-[10px] text-[#71717A] mt-0.5 line-clamp-1">
                {app.category}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
