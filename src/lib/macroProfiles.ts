/**
 * Macro Profiles — Single Source of Truth
 *
 * Each supported app has a config defining:
 * - Its display name and icon
 * - The code/content shown in the Mac screen
 * - The macro buttons shown in the phone control strip
 * - The terminal/output content
 */

import type { AppId, DemoAction } from "./demoState";

export interface MacroButton {
  id: string;
  icon: string; // Lucide icon name
  label: string;
  color?: string; // Semantic accent color
  action: DemoAction;
}

export interface CodeLine {
  num: number;
  content: string;
  highlight?: boolean; // Active line
}

export interface AppProfile {
  id: AppId;
  name: string;
  icon: string; // Lucide icon name
  fileName: string;
  fileTree: string[];
  codeLines: CodeLine[];
  terminalContent: string[];
  macros: MacroButton[];
}

export const APP_PROFILES: Record<AppId, AppProfile> = {
  vscode: {
    id: "vscode",
    name: "VS Code",
    icon: "Code2",
    fileName: "tactile-core.rs",
    fileTree: ["src/", "  main.rs", "  lib.rs", "  bridge.rs", "tests/", "  dma_test.rs", "Cargo.toml"],
    codeLines: [
      { num: 1, content: "use dma::channel::UsbBulk;" },
      { num: 2, content: "use hid::TouchReport;" },
      { num: 3, content: "" },
      { num: 4, content: "pub fn init_bridge() -> Result<DmaBridge> {" },
      { num: 5, content: "    let ch = UsbBulk::connect()?;", highlight: true },
      { num: 6, content: "    ch.set_latency(Duration::from" },
      { num: 7, content: "        _micros(4180))?;" },
      { num: 8, content: "    let screen = Screen::new(1080, 2400);" },
      { num: 9, content: "    Ok(DmaBridge::new(ch, screen))" },
      { num: 10, content: "}" },
      { num: 11, content: "" },
      { num: 12, content: "pub fn stream_frame(buf: &FrameBuffer) {" },
      { num: 13, content: "    self.dma.write_bulk(buf.as_bytes());" },
      { num: 14, content: "}" },
    ],
    terminalContent: [
      "$ cargo test",
      "   Compiling tactile-core v0.4.2",
      "    Finished test [unoptimized] in 1.82s",
      "     Running 14 tests",
      "test dma::bridge_connect ... ok",
      "test dma::latency_under_5ms ... ok (4.18ms)",
      "test hid::touch_report ... ok",
      "test result: ok. 14 passed; 0 failed",
    ],
    macros: [
      {
        id: "git",
        icon: "GitBranch",
        label: "Git",
        color: "#F05032",
        action: {
          id: "git-commit",
          label: "Git Commit",
          description: "Staging changes → feat/dma-pipeline (8a19f0)",
          duration: 650,
        },
      },
      {
        id: "test",
        icon: "CheckCircle",
        label: "Test",
        color: "#10B981",
        action: {
          id: "run-tests",
          label: "Cargo Test",
          description: "Running cargo test (14 passed, 0 failed)...",
          duration: 800,
        },
      },
      {
        id: "format",
        icon: "Braces",
        label: "Format",
        color: "#3B82F6",
        action: {
          id: "format-code",
          label: "rustfmt",
          description: "rustfmt → 3 files formatted cleanly",
          duration: 500,
        },
      },
      {
        id: "terminal",
        icon: "Terminal",
        label: "Terminal",
        color: "#00F0FF",
        action: {
          id: "open-terminal",
          label: "Terminal Drawer",
          description: "Toggling integrated terminal drawer",
          duration: 450,
        },
      },
      {
        id: "main",
        icon: "GitBranch",
        label: "Branch",
        color: "#8B5CF6",
        action: {
          id: "checkout-main",
          label: "Switch Branch",
          description: "Switching branch to main (synchronized)",
          duration: 600,
        },
      },
      {
        id: "build",
        icon: "Cpu",
        label: "Build",
        color: "#F59E0B",
        action: {
          id: "cargo-build",
          label: "Cargo Build",
          description: "Compiling tactile-core v0.4.2 [release]",
          duration: 850,
        },
      },
      {
        id: "debug",
        icon: "Bug",
        label: "Debug",
        color: "#F43F5E",
        action: {
          id: "toggle-breakpoint",
          label: "Breakpoint",
          description: "Toggling breakpoint at tactile.rs:5",
          duration: 500,
        },
      },
      {
        id: "palette",
        icon: "Sparkles",
        label: "Palette",
        color: "#A855F7",
        action: {
          id: "command-palette",
          label: "Quick Open",
          description: "Opening Command Palette (⌘P)",
          duration: 500,
        },
      },
    ],
  },

  figma: {
    id: "figma",
    name: "Figma",
    icon: "Figma",
    fileName: "Tactile UI Kit",
    fileTree: ["Pages/", "  Landing", "  Dashboard", "  Touch Bar", "Components/", "  Button", "  Card"],
    codeLines: [
      { num: 1, content: "// Figma Canvas Preview" },
      { num: 2, content: "Frame: Landing Hero" },
      { num: 3, content: "  ├─ Navbar (Auto Layout)" },
      { num: 4, content: "  ├─ Hero Text Block", highlight: true },
      { num: 5, content: "  │   ├─ H1: \"Your Mac's missing half.\"" },
      { num: 6, content: "  │   └─ Subtitle: Inter 18/28" },
      { num: 7, content: "  ├─ CTA Button Group" },
      { num: 8, content: "  │   ├─ Primary: \"Request Access\"" },
      { num: 9, content: "  │   └─ Secondary: brew install" },
      { num: 10, content: "  └─ Device Showcase" },
      { num: 11, content: "      ├─ MacBook Frame" },
      { num: 12, content: "      └─ Phone Companion" },
    ],
    terminalContent: [
      "Figma → VS Code sync active",
      "Exported: 12 components, 3 variants",
      "Design tokens synced to Tailwind",
    ],
    macros: [
      {
        id: "autolayout",
        icon: "LayoutGrid",
        label: "Layout",
        color: "#8B5CF6",
        action: {
          id: "auto-layout",
          label: "Auto Layout",
          description: "Applying Auto Layout to selection",
          duration: 650,
        },
      },
      {
        id: "detach",
        icon: "Unlink",
        label: "Detach",
        color: "#3B82F6",
        action: {
          id: "detach-instance",
          label: "Detach",
          description: "Detaching component instance",
          duration: 550,
        },
      },
      {
        id: "export",
        icon: "Download",
        label: "Export",
        color: "#10B981",
        action: {
          id: "export-assets",
          label: "Export",
          description: "Exporting @2x PNG + SVG assets",
          duration: 900,
        },
      },
      {
        id: "components",
        icon: "Component",
        label: "Library",
        color: "#00F0FF",
        action: {
          id: "open-library",
          label: "Library",
          description: "Opening component library panel",
          duration: 500,
        },
      },
      {
        id: "prototype",
        icon: "Zap",
        label: "Flow",
        color: "#F59E0B",
        action: {
          id: "prototype-flow",
          label: "Prototype",
          description: "Starting interactive preview mode",
          duration: 650,
        },
      },
      {
        id: "preview",
        icon: "Play",
        label: "Present",
        color: "#6366F1",
        action: {
          id: "present-figma",
          label: "Present",
          description: "Opening mobile mirror presentation",
          duration: 700,
        },
      },
      {
        id: "layers",
        icon: "Layers",
        label: "Layers",
        color: "#F43F5E",
        action: {
          id: "collapse-layers",
          label: "Layers",
          description: "Collapsing all artboard layer trees",
          duration: 450,
        },
      },
      {
        id: "styles",
        icon: "Sparkles",
        label: "Tokens",
        color: "#EC4899",
        action: {
          id: "sync-tokens",
          label: "Tokens",
          description: "Synchronizing design tokens with code",
          duration: 750,
        },
      },
    ],
  },

  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: "TerminalSquare",
    fileName: "zsh — tactile-core",
    fileTree: ["~/dev/", "  tactile-core/", "  tactile-web/", "  .config/", "  .ssh/"],
    codeLines: [
      { num: 1, content: "lakshit@mac ~ % cd tactile-core" },
      { num: 2, content: "lakshit@mac tactile-core % cargo build --release" },
      { num: 3, content: "   Compiling tactile-core v0.4.2" },
      { num: 4, content: "   Compiling dma-bridge v1.2.0" },
      { num: 5, content: "    Finished release [optimized] in 8.4s", highlight: true },
      { num: 6, content: "" },
      { num: 7, content: "lakshit@mac tactile-core % docker ps" },
      { num: 8, content: "CONTAINER ID  IMAGE          STATUS    PORTS" },
      { num: 9, content: "8f31b2c4a9e1  tactile-usb    Up 2h     :8080" },
      { num: 10, content: "a2c4e8f91b03  redis:alpine   Up 2h     :6379" },
      { num: 11, content: "" },
      { num: 12, content: "lakshit@mac tactile-core % _" },
    ],
    terminalContent: [],
    macros: [
      {
        id: "docker",
        icon: "Container",
        label: "Docker",
        color: "#00F0FF",
        action: {
          id: "docker-ps",
          label: "Docker PS",
          description: "Listing running containers...",
          duration: 650,
        },
      },
      {
        id: "cargo",
        icon: "Play",
        label: "Cargo",
        color: "#F59E0B",
        action: {
          id: "cargo-run",
          label: "Cargo Run",
          description: "Running cargo build && cargo run",
          duration: 800,
        },
      },
      {
        id: "top",
        icon: "Activity",
        label: "htop",
        color: "#10B981",
        action: {
          id: "htop-monitor",
          label: "System Top",
          description: "Opening CPU & DMA stream monitor",
          duration: 700,
        },
      },
      {
        id: "gitstatus",
        icon: "GitBranch",
        label: "Status",
        color: "#8B5CF6",
        action: {
          id: "git-status",
          label: "Git Status",
          description: "git status -sb (clean working tree)",
          duration: 500,
        },
      },
      {
        id: "ssh",
        icon: "Key",
        label: "SSH",
        color: "#3B82F6",
        action: {
          id: "ssh-connect",
          label: "SSH",
          description: "Connecting to staging server...",
          duration: 850,
        },
      },
      {
        id: "deploy",
        icon: "Cloud",
        label: "Deploy",
        color: "#F43F5E",
        action: {
          id: "quick-deploy",
          label: "Quick Deploy",
          description: "Deploying daemon container to local bus",
          duration: 900,
        },
      },
      {
        id: "history",
        icon: "History",
        label: "History",
        color: "#94A3B8",
        action: {
          id: "show-history",
          label: "History",
          description: "Loading shell history (142 entries)",
          duration: 500,
        },
      },
      {
        id: "clear",
        icon: "Trash2",
        label: "Clear",
        color: "#EF4444",
        action: {
          id: "clear-terminal",
          label: "Clear",
          description: "Terminal cleared",
          duration: 400,
        },
      },
    ],
  },

  finder: {
    id: "finder",
    name: "Desktop",
    icon: "Folder",
    fileName: "Macintosh HD",
    fileTree: [
      "Desktop/",
      "  firmware_v0.4.bin",
      "  render_spec.png",
      "Applications/",
      "  VS Code.app",
      "  Figma.app",
      "  Terminal.app",
    ],
    codeLines: [
      { num: 1, content: "Mac Studio · Apple M4 Max (16-core CPU, 40-core GPU)" },
      { num: 2, content: "macOS Sequoia 15.1 · Build 24B83" },
      { num: 3, content: "Display: Liquid Retina XDR 120Hz ProMotion" },
      { num: 4, content: "DMA Pipe: /dev/usb4180 (4.18ms latency, 984 MB/s)", highlight: true },
      { num: 5, content: "Companion: iPhone 16 Pro · Super Retina XDR OLED" },
      { num: 6, content: "HID Status: 1000Hz Sub-millimeter polling active" },
    ],
    terminalContent: [
      "Tactile DMA daemon active (PID 4180)",
      "Zero-copy buffer: 1080x2400 @ 60 FPS",
      "Bridge integrity: 100% (0 packets dropped)",
    ],
    macros: [
      {
        id: "finder-open",
        icon: "Folder",
        label: "Finder",
        color: "#3B82F6",
        action: {
          id: "open-finder",
          label: "Finder",
          description: "Viewing Macintosh HD root directory",
          duration: 500,
        },
      },
      {
        id: "mission",
        icon: "Maximize2",
        label: "Mission",
        color: "#8B5CF6",
        action: {
          id: "mission-control",
          label: "Mission Control",
          description: "Restoring and tiling open application spaces",
          duration: 600,
        },
      },
      {
        id: "launch-code",
        icon: "Code2",
        label: "VS Code",
        color: "#007ACC",
        action: {
          id: "launch-vscode",
          label: "VS Code",
          description: "Launching VS Code (tactile-core.rs)",
          duration: 550,
        },
      },
      {
        id: "launch-figma",
        icon: "Component",
        label: "Figma",
        color: "#F24E1E",
        action: {
          id: "launch-figma",
          label: "Figma",
          description: "Launching Figma (Tactile UI Kit)",
          duration: 550,
        },
      },
      {
        id: "launch-term",
        icon: "Terminal",
        label: "Terminal",
        color: "#00F0FF",
        action: {
          id: "launch-terminal",
          label: "Terminal",
          description: "Opening zsh shell on /dev/usb4180",
          duration: 550,
        },
      },
      {
        id: "airdrop-quick",
        icon: "Share2",
        label: "AirDrop",
        color: "#10B981",
        action: {
          id: "launch-airdrop",
          label: "AirDrop",
          description: "Activating zero-latency AirDrop receiver",
          duration: 500,
        },
      },
      {
        id: "organize",
        icon: "Sparkles",
        label: "Stacks",
        color: "#EC4899",
        action: {
          id: "clean-desktop",
          label: "Stacks",
          description: "Tidying desktop files with macOS Stacks",
          duration: 500,
        },
      },
      {
        id: "lock-mac",
        icon: "Key",
        label: "Lock",
        color: "#F59E0B",
        action: {
          id: "lock-mac",
          label: "Lock Mac",
          description: "Locking Mac workstation screen",
          duration: 450,
        },
      },
    ],
  },
};
