"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DemoAction } from "@/lib/demoState";
import { playKeyClick, playScrollDetent } from "@/lib/soundEngine";

import type { TerminalSharedState, CommandHistoryItem } from "@/lib/desktopState";

interface TerminalInteractiveShellProps {
  mode?: "desktop" | "mobile-mirror";
  isExecuting: boolean;
  lastAction?: DemoAction | null;
  lastActionTimestamp?: number;
  terminalState?: TerminalSharedState;
  onAddCommand?: (item: CommandHistoryItem) => void;
  onClear?: () => void;
}

const INITIAL_HISTORY: CommandHistoryItem[] = [
  {
    id: "init-1",
    command: "cargo test --package tactile-core",
    output: [
      "   Compiling tactile-core v0.4.2 (/Users/lakshit/dev/tactile)",
      "    Finished test [unoptimized + debuginfo] in 0.82s",
      "test dma::channel::usb_bulk_handshake ... ok",
      "test dma::latency::sub_5ms_guarantee ... ok (4.18ms)",
      "test hid::trackpad_1000hz_stream ... ok",
      "test result: ok. 14 passed; 0 failed; 0 ignored",
    ],
    type: "success",
  },
];

export default function TerminalInteractiveShell({
  mode = "desktop",
  isExecuting,
  lastAction,
  lastActionTimestamp,
  terminalState,
  onAddCommand,
  onClear,
}: TerminalInteractiveShellProps) {
  const isDesktop = mode === "desktop";
  const [internalHistory, setInternalHistory] = useState<CommandHistoryItem[]>(INITIAL_HISTORY);
  const history = terminalState ? terminalState.history : internalHistory;
  const setHistory = setInternalHistory;
  const scrollRef = useRef<HTMLDivElement>(null);

  // React to macro executions
  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.id === "docker-ps") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `docker-${Date.now()}`,
          command: "docker ps --format 'table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'",
          output: [
            "CONTAINER ID   IMAGE                STATUS         PORTS",
            "8f31b2c4a9e1   tactile/dma:latest   Up 2 hours     0.0.0.0:4180->4180/tcp",
            "a2c4e8f91b03   redis:7-alpine       Up 2 hours     0.0.0.0:6379->6379/tcp",
          ],
          type: "table",
        },
      ]);
    } else if (lastAction.id === "cargo-run") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `cargo-${Date.now()}`,
          command: "cargo run --release",
          output: [
            "   Compiling tactile-core v0.4.2 [release]",
            "    Finished release [optimized] in 1.12s",
            "     Running `target/release/tactile-daemon`",
            "2026-09-15 12:10:04 [INFO] DMA Bulk Stream opened on /dev/cu.usbmodem4180",
            "2026-09-15 12:10:04 [INFO] Bus Latency: 4.18ms | Jitter: ±0.06ms | 1000Hz HID",
          ],
          type: "success",
        },
      ]);
    } else if (lastAction.id === "htop-monitor") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `htop-${Date.now()}`,
          command: "htop --dma-stream",
          output: [
            "CPU [||||||||||||||||||||||||||| 44.8%]   Tasks: 38, 142 thr",
            "MEM [|||||||||| 4.8G/32G]                 Uptime: 04:18:22",
            "DMA [||||||||||||||||||||||||||| 984 MB/s] Bus: USB-C Bulk (1000Hz)",
          ],
          type: "info",
        },
      ]);
    } else if (lastAction.id === "git-status") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `status-${Date.now()}`,
          command: "git status -sb",
          output: [
            "## feat/dma-pipeline...origin/feat/dma-pipeline [ahead 1]",
            " M src/tactile.rs",
            " M src/bridge.ts",
            "?? tests/latency_dma.rs",
          ],
          type: "warning",
        },
      ]);
    } else if (lastAction.id === "ssh-connect") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `ssh-${Date.now()}`,
          command: "ssh root@gateway-01.tactile.internal",
          output: [
            "ECDSA key fingerprint SHA256:dma919e1b2f0a3c7.",
            "Authenticated to gateway-01 (tactile-os-edge v2.4).",
            "Last login: Tue Sep 15 12:04:18 from 127.0.0.1",
            "root@gateway-01:~# dma-status --live",
            "Peer: MacBookPro18,1 [Linked 10 Gbps]",
          ],
          type: "info",
        },
      ]);
    } else if (lastAction.id === "quick-deploy") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `deploy-${Date.now()}`,
          command: "tactile deploy --fleet --verify-checksum",
          output: [
            "→ Packaging tactile-core binary (4.2 MB)...",
            "→ Streaming over USB-C Direct DMA...",
            "✓ Handshake confirmed by iPhone 16 Pro (latency 4.18ms)",
            "✓ Daemon live and listening on 1000Hz HID pipe.",
          ],
          type: "success",
        },
      ]);
    } else if (lastAction.id === "show-history") {
      setHistory((prev) => [
        ...prev.slice(-3),
        {
          id: `history-${Date.now()}`,
          command: "history | tail -n 5",
          output: [
            "  138  git commit -m 'feat: zero-copy ringbuffer'",
            "  139  cargo test",
            "  140  docker compose up -d",
            "  141  tactile status",
            "  142  cargo run --release",
          ],
          type: "info",
        },
      ]);
    } else if (lastAction.id === "clear-terminal") {
      setHistory([]);
    }
  }, [lastAction, lastActionTimestamp]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 w-full h-full bg-[#08090f] p-2.5 font-mono text-[8.5px] leading-relaxed select-text overflow-y-auto overflow-x-hidden space-y-2 text-white/90 touch-manipulation"
    >
      {/* Historical Output Blocks */}
      {history.map((item) => (
        <div key={item.id} className="space-y-0.5">
          {/* Prompt line */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-emerald-400 font-semibold">lakshit@mac</span>
            <span className="text-[#3B82F6]">~/tactile-core</span>
            <span className="text-[#A855F7] text-[7.5px]">(feat/dma)</span>
            <span className="text-white/40">%</span>
            <span className="text-white font-medium">{item.command}</span>
          </div>

          {/* Output lines */}
          <div className="pl-2 space-y-0.5 border-l border-white/10 my-0.5">
            {item.output.map((line, idx) => {
              let textColor = "text-white/70";
              if (line.includes("... ok") || line.includes("Finished") || line.includes("✓")) {
                textColor = "text-emerald-400 font-semibold";
              } else if (line.includes("Compiling") || line.includes("Deploying")) {
                textColor = "text-white/40";
              } else if (line.includes("CPU") || line.includes("DMA") || line.includes("MEM")) {
                textColor = "text-[#00F0FF]";
              } else if (line.includes("CONTAINER ID")) {
                textColor = "text-white/50 font-bold";
              }

              return (
                <div key={idx} className={`${textColor} text-[8px] font-mono leading-normal`}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Active Blinking Cursor Prompt */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <span className="text-emerald-400 font-semibold">lakshit@mac</span>
        <span className="text-[#3B82F6]">~/tactile-core</span>
        <span className="text-[#A855F7] text-[7.5px]">(feat/dma)</span>
        <span className="text-[#00F0FF]">%</span>
        <span className="w-1.5 h-3 bg-[#00F0FF] animate-pulse inline-block shadow-[0_0_6px_#00F0FF]" />
      </div>
    </div>
  );
}
