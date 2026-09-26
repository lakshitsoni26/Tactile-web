"use client";

import { Code, Terminal, Globe, Film, Compass, Cpu, Boxes } from "lucide-react";

function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" />
    </svg>
  );
}

interface ToolItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const tools: ToolItem[] = [
  { name: "Cursor", category: "AI Code Editor", icon: Code, color: "#18181B" },
  { name: "VS Code", category: "IDE & Extensions", icon: Boxes, color: "#0284C7" },
  { name: "Figma", category: "Vector & Design", icon: FigmaIcon, color: "#EA580C" },
  { name: "Terminal", category: "CLI & Scripts", icon: Terminal, color: "#16A34A" },
  { name: "Xcode", category: "Apple SDKs", icon: Cpu, color: "#2563EB" },
  { name: "Chrome", category: "DevTools & Web", icon: Globe, color: "#DB2777" },
  { name: "DaVinci", category: "Color & Video", icon: Film, color: "#D97706" },
  { name: "Claude Code", category: "Agent Context", icon: Compass, color: "#7C3AED" },
];

export default function EcosystemTicker() {
  return (
    <section
      id="ecosystem"
      className="relative py-10 sm:py-12 overflow-hidden border-y border-black/[0.06] bg-[#FFFFFF]"
    >
      {/* Section label */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-center gap-3">
        <p className="text-[12px] font-medium tracking-wide text-[#71717A] uppercase font-mono">
          Contextual Macro Profiles & Live Continuity
        </p>
      </div>

      {/* Infinite marquee */}
      <div
        className="relative w-full overflow-hidden flex"
        style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
      >
        <div className="animate-marquee flex items-center gap-3 py-1">
          {[...tools, ...tools, ...tools].map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-black/[0.06] bg-[#FAFAFA] hover:bg-[#F4F4F5] hover:border-black/[0.12] shrink-0 cursor-default transition-all duration-200 shadow-2xs"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center p-1.5 shrink-0 bg-white border border-black/[0.05]"
                  style={{ color: tool.color }}
                >
                  <Icon className="w-full h-full" />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-semibold text-[#18181B]">
                    {tool.name}
                  </div>
                  <div className="text-[10.5px] text-[#71717A]">
                    {tool.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
