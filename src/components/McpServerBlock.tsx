"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Terminal, ShieldCheck } from "lucide-react";

export default function McpServerBlock() {
  const [copied, setCopied] = useState(false);

  const configJson = `{
  "mcpServers": {
    "tactile": {
      "command": "tactile",
      "args": ["mcp", "--listen-approvals"]
    }
  }
}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="mcp">
      <div className="resurf-card p-8 sm:p-14 bg-white border border-black/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Editorial copy */}
          <div>
            <div className="tag-badge mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Model Context Protocol</span>
            </div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08] mb-4">
              Give your AI coding agents <br />
              <span className="italic font-serif">a physical desk presence.</span>
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#666666] leading-relaxed mb-6 font-[family-name:var(--font-inter)]">
              Tactile natively implements the open Model Context Protocol (MCP). Claude Code, Cursor, and Codex can push build status alerts, ask for confirmation before executing bash commands, and await your one-tap physical approval.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-[#555555]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Physical hardware approvals for agent terminal commands</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Live agent step-by-step progress streamed to your OLED screen</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Zero cloud configuration — standard local JSON schema</span>
              </li>
            </ul>
          </div>

          {/* Right: Code Block */}
          <div className="rounded-2xl bg-[#18181B] text-white p-5 sm:p-6 font-mono text-xs shadow-xl border border-black/10 relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>claude_desktop_config.json</span>
              </div>
              <button
                onClick={copyConfig}
                className="flex items-center gap-1 text-[10.5px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <pre className="text-zinc-200 overflow-x-auto leading-relaxed py-1">
              <code>{configJson}</code>
            </pre>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                Native stdio & SSE transport
              </span>
              <span>v0.9.2+ verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
