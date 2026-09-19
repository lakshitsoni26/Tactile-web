/**
 * Unified Desktop & Continuity State Machine
 *
 * Simulates a living multi-window macOS desktop environment
 * and a 4-superpower companion smartphone connected via zero-copy DMA.
 */

import type { AppId, ProtocolId, DeviceOS, DemoAction } from "./demoState";

export type WindowId = "vscode" | "figma" | "terminal";
export type FocusedAppId = WindowId | "finder";
export type WindowDisplayTarget = "mac" | "phone" | "dragging_bridge";
export type CompanionMode = "touchbar" | "trackpad" | "sidecar" | "airdrop";

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

export interface WindowState {
  id: WindowId;
  title: string;
  appType: WindowId;
  rect: WindowRect;
  prevRect?: WindowRect;
  zIndex: number;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  snap?: "left" | "right" | "top" | "max" | null;
  displayTarget: WindowDisplayTarget;
}

export interface AirDropFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "idle" | "dragging" | "transferring" | "received";
  progress: number;
}

export interface FigmaSharedState {
  isLinked: boolean;
  toggleActive: boolean;
  selectedLayer: string;
}

export interface VSCodeSharedState {
  activeTab: string;
  isTerminalOpen: boolean;
  hasBreakpoint: boolean;
  currentBranch: string;
  toastMessage: string | null;
  showPalette: boolean;
  buildProgress: number | null;
  isShimmering: boolean;
}

export interface CommandHistoryItem {
  id: string;
  command: string;
  output: string[];
  type?: "success" | "warning" | "info" | "table";
}

export interface TerminalSharedState {
  history: CommandHistoryItem[];
}

export interface HudNotification {
  type: "volume" | "brightness" | null;
  value: number;
  timestamp: number;
}

export interface DesktopState {
  windows: Record<WindowId, WindowState>;
  windowStack: WindowId[];
  focusedWindowId: FocusedAppId;

  // Shared synchronized application states
  figmaState: FigmaSharedState;
  vscodeState: VSCodeSharedState;
  terminalState: TerminalSharedState;
  hudState: HudNotification;

  // Companion phone mode
  companionMode: CompanionMode;
  deviceOS: DeviceOS;
  protocol: ProtocolId;

  // Trackpad mode live pointer
  trackpadCursor: {
    x: number;
    y: number;
    isDown: boolean;
    isVisible: boolean;
  };

  // Rotary knobs state
  rotaryControls: {
    volume: number; // 0..100
    brightness: number; // 0..100
    radius: number; // 0..32
  };

  // AirDrop & Clipboard bridge
  airdropFiles: AirDropFile[];
  clipboardContent: string;
  clipboardPushed: boolean;

  // Cross-bezel drag bridge
  isCrossDragging: boolean;
  draggedWindowId: WindowId | null;

  // Telemetry & Macro execution state
  status: "idle" | "executing" | "resolved";
  lastAction: DemoAction | null;
  lastActionTimestamp: number;
  latencyMs: number;
  latencyJitter: number;

  // macOS Overlays & Modals
  isSpotlightOpen: boolean;
  isControlCenterOpen: boolean;
  isAboutThisMacOpen: boolean;

  // 10 Tactile Core Superpowers Hub
  activeSuperpower: SuperpowerId;
  superpowerTelemetry: SuperpowerTelemetry;
}

export type SuperpowerId =
  | "streaming"
  | "trackpad"
  | "zoom"
  | "spaces"
  | "touchbar"
  | "clipboard"
  | "clamshell"
  | "meeting"
  | "transport"
  | "menubar";

export interface SuperpowerTelemetry {
  streaming: {
    fps: 60 | 120;
    isKeyframeSyncing: boolean;
    bitrateMbps: number;
    latencyBreakdown: { capture: number; encode: number; transport: number; decode: number; render: number };
  };
  trackpad: {
    axisLock: "none" | "horizontal" | "vertical";
    isRightClickOpen: boolean;
    lastGesture: string | null;
  };
  zoom: {
    scale: number; // 1.0 - 5.0
    isZoomLocked: boolean;
    isMouseMuted: boolean;
    focal: { x: number; y: number };
  };
  spaces: {
    activeSpace: number; // 0, 1, 2
    isMissionControl: boolean;
    isAppExpose: boolean;
    activeSnap: "left" | "right" | "top" | "max" | null;
  };
  touchbar: {
    zeroVideoMode: boolean;
    batteryRate: string;
    port9347Packets: number;
  };
  clipboard: {
    macClipboard: string;
    phoneClipboard: string;
    lastSha256: string;
    syncLatencyMs: number;
    isEchoSuppressed: boolean;
  };
  clamshell: {
    isLidClosed: boolean;
    virtualDisplayRes: string;
    cvDisplayLinkActive: boolean;
    powerAssertionHeld: boolean;
  };
  meeting: {
    isHardwareMicMuted: boolean;
    isCameraMuted: boolean;
  };
  transport: {
    controlPort: 9347;
    streamPort: 9348;
    adbReverseActive: boolean;
    tokenPaired: boolean;
  };
  menubar: {
    isTactileAppPopoverOpen: boolean;
    masterSwitches: {
      clipboard: boolean;
      touchbar: boolean;
      zeroVideo: boolean;
      clamshell: boolean;
    };
  };
}

export type DesktopEvent =
  | { type: "FOCUS_WINDOW"; windowId: WindowId }
  | { type: "FOCUS_DESKTOP" }
  | { type: "RESTORE_ALL_WINDOWS" }
  | { type: "MINIMIZE_ALL_WINDOWS" }
  | { type: "MOVE_WINDOW"; windowId: WindowId; x: number; y: number }
  | { type: "RESIZE_WINDOW"; windowId: WindowId; width: number; height: number }
  | { type: "MINIMIZE_WINDOW"; windowId: WindowId }
  | { type: "MAXIMIZE_WINDOW"; windowId: WindowId }
  | { type: "RESTORE_WINDOW"; windowId: WindowId }
  | { type: "MIGRATE_WINDOW"; windowId: WindowId; target: WindowDisplayTarget }
  | { type: "SET_COMPANION_MODE"; mode: CompanionMode }
  | { type: "SET_TRACKPAD_CURSOR"; x: number; y: number; isDown?: boolean; isVisible?: boolean }
  | { type: "TRACKPAD_CLICK"; x: number; y: number }
  | { type: "TOGGLE_SPOTLIGHT" }
  | { type: "TOGGLE_CONTROL_CENTER" }
  | { type: "TOGGLE_ABOUT_THIS_MAC" }
  | { type: "CLOSE_ALL_OVERLAYS" }
  | { type: "SET_ROTARY_VALUE"; control: "volume" | "brightness" | "radius"; value: number }
  | { type: "DISMISS_HUD" }
  | { type: "START_AIRDROP"; fileId: string }
  | { type: "PROGRESS_AIRDROP"; fileId: string; progress: number }
  | { type: "COMPLETE_AIRDROP"; fileId: string }
  | { type: "COPY_CLIPBOARD"; content: string }
  | { type: "SET_DEVICE"; os: DeviceOS }
  | { type: "SET_PROTOCOL"; protocol: ProtocolId }
  | { type: "EXECUTE_ACTION"; action: DemoAction }
  | { type: "RESOLVE_ACTION" }
  | { type: "RESET" }
  | { type: "FIGMA_TOGGLE_LINK" }
  | { type: "FIGMA_SET_LINK"; isLinked: boolean }
  | { type: "FIGMA_TOGGLE_SWITCH" }
  | { type: "FIGMA_SELECT_LAYER"; layer: string }
  | { type: "VSCODE_SET_TAB"; tabId: string }
  | { type: "VSCODE_TOGGLE_TERMINAL" }
  | { type: "VSCODE_TOGGLE_BREAKPOINT" }
  | { type: "VSCODE_SET_BRANCH"; branch: string }
  | { type: "VSCODE_SET_TOAST"; message: string | null }
  | { type: "TERMINAL_ADD_COMMAND"; item: CommandHistoryItem }
  | { type: "TERMINAL_CLEAR" }
  | { type: "SET_SUPERPOWER"; powerId: SuperpowerId }
  | { type: "TRIGGER_KEYFRAME_SYNC" }
  | { type: "SET_STREAM_FPS"; fps: 60 | 120 }
  | { type: "SET_ZOOM_SCALE"; scale: number; focalX?: number; focalY?: number }
  | { type: "TOGGLE_ZOOM_LOCK" }
  | { type: "TOGGLE_MOUSE_MUTE" }
  | { type: "SWITCH_SPACE"; spaceIndex: number }
  | { type: "TOGGLE_MISSION_CONTROL" }
  | { type: "TOGGLE_EXPOSE" }
  | { type: "SNAP_WINDOW"; snap: "left" | "right" | "top" | "max" | null }
  | { type: "TOGGLE_ZERO_VIDEO_MODE" }
  | { type: "SYNC_CLIPBOARD"; source: "mac" | "phone"; text: string }
  | { type: "TOGGLE_CLAMSHELL" }
  | { type: "TOGGLE_HARDWARE_MIC" }
  | { type: "TOGGLE_TACTILE_MENU_APP" }
  | { type: "TOGGLE_MASTER_SWITCH"; switchKey: "clipboard" | "touchbar" | "zeroVideo" | "clamshell" };

export const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  vscode: {
    id: "vscode",
    title: "tactile-core.rs — VS Code",
    appType: "vscode",
    rect: { x: 30, y: 34, width: 500, height: 325, minWidth: 320, minHeight: 220 },
    zIndex: 30,
    isFocused: true,
    isMinimized: false,
    isMaximized: false,
    displayTarget: "mac",
  },
  figma: {
    id: "figma",
    title: "Tactile UI Kit — Figma",
    appType: "figma",
    rect: { x: 40, y: 34, width: 510, height: 325, minWidth: 320, minHeight: 220 },
    zIndex: 20,
    isFocused: false,
    isMinimized: true,
    isMaximized: false,
    displayTarget: "mac",
  },
  terminal: {
    id: "terminal",
    title: "zsh — tactile-core",
    appType: "terminal",
    rect: { x: 50, y: 34, width: 480, height: 310, minWidth: 300, minHeight: 200 },
    zIndex: 10,
    isFocused: false,
    isMinimized: true,
    isMaximized: false,
    displayTarget: "mac",
  },
};

export const INITIAL_AIRDROP_FILES: AirDropFile[] = [
  {
    id: "file-firmware",
    name: "firmware_v0.4.bin",
    size: "4.2 MB",
    type: "bin",
    status: "idle",
    progress: 0,
  },
  {
    id: "file-spec",
    name: "render_spec.png",
    size: "1.8 MB",
    type: "png",
    status: "idle",
    progress: 0,
  },
];

export const INITIAL_TERMINAL_HISTORY: CommandHistoryItem[] = [
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

export const INITIAL_DESKTOP_STATE: DesktopState = {
  windows: INITIAL_WINDOWS,
  windowStack: ["terminal", "figma", "vscode"],
  focusedWindowId: "vscode",

  figmaState: {
    isLinked: false,
    toggleActive: true,
    selectedLayer: "card",
  },

  vscodeState: {
    activeTab: "core",
    isTerminalOpen: false,
    hasBreakpoint: true,
    currentBranch: "feat/dma",
    toastMessage: null,
    showPalette: false,
    buildProgress: null,
    isShimmering: false,
  },

  terminalState: {
    history: INITIAL_TERMINAL_HISTORY,
  },

  hudState: {
    type: null,
    value: 0,
    timestamp: 0,
  },

  companionMode: "touchbar",
  deviceOS: "ios",
  protocol: "usbc",
  trackpadCursor: {
    x: 280,
    y: 160,
    isDown: false,
    isVisible: false,
  },
  rotaryControls: {
    volume: 68,
    brightness: 84,
    radius: 16,
  },
  airdropFiles: INITIAL_AIRDROP_FILES,
  clipboardContent: "cargo test --package tactile-core",
  clipboardPushed: false,
  isCrossDragging: false,
  draggedWindowId: null,
  status: "idle",
  lastAction: null,
  lastActionTimestamp: 0,
  latencyMs: 4.18,
  latencyJitter: 0.06,

  isSpotlightOpen: false,
  isControlCenterOpen: false,
  isAboutThisMacOpen: false,

  // 10 Tactile Core Superpowers Hub
  activeSuperpower: "touchbar",
  superpowerTelemetry: {
    streaming: {
      fps: 60,
      isKeyframeSyncing: false,
      bitrateMbps: 28.4,
      latencyBreakdown: { capture: 2.1, encode: 3.2, transport: 4.2, decode: 3.1, render: 1.8 },
    },
    trackpad: {
      axisLock: "none",
      isRightClickOpen: false,
      lastGesture: null,
    },
    zoom: {
      scale: 1.0,
      isZoomLocked: false,
      isMouseMuted: false,
      focal: { x: 355, y: 222 },
    },
    spaces: {
      activeSpace: 0,
      isMissionControl: false,
      isAppExpose: false,
      activeSnap: null,
    },
    touchbar: {
      zeroVideoMode: true,
      batteryRate: "0.42%/hr",
      port9347Packets: 1842,
    },
    clipboard: {
      macClipboard: "cargo test --package tactile-core",
      phoneClipboard: "cargo test --package tactile-core",
      lastSha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      syncLatencyMs: 14.8,
      isEchoSuppressed: true,
    },
    clamshell: {
      isLidClosed: false,
      virtualDisplayRes: "2940x1912",
      cvDisplayLinkActive: true,
      powerAssertionHeld: true,
    },
    meeting: {
      isHardwareMicMuted: false,
      isCameraMuted: false,
    },
    transport: {
      controlPort: 9347,
      streamPort: 9348,
      adbReverseActive: true,
      tokenPaired: true,
    },
    menubar: {
      isTactileAppPopoverOpen: false,
      masterSwitches: {
        clipboard: true,
        touchbar: true,
        zeroVideo: true,
        clamshell: true,
      },
    },
  },
};

export function desktopReducer(state: DesktopState, event: DesktopEvent): DesktopState {
  switch (event.type) {
    case "FOCUS_DESKTOP": {
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };
      Object.keys(updatedWindows).forEach((k) => {
        const id = k as WindowId;
        updatedWindows[id] = { ...updatedWindows[id], isMinimized: true, isFocused: false };
      });
      return {
        ...state,
        focusedWindowId: "finder",
        windows: updatedWindows,
      };
    }

    case "FOCUS_WINDOW": {
      const { windowId } = event;
      const targetWindow = state.windows[windowId];
      if (!targetWindow) return state;

      const newStack = state.windowStack.filter((id) => id !== windowId).concat(windowId);
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };

      newStack.forEach((id, index) => {
        updatedWindows[id] = {
          ...updatedWindows[id],
          zIndex: (index + 1) * 10,
          isFocused: id === windowId,
          isMinimized: id === windowId ? false : updatedWindows[id].isMinimized,
        };
      });

      const spaceMap: Record<WindowId, number> = { vscode: 0, figma: 1, terminal: 2 };
      const nextSpace = spaceMap[windowId] ?? state.superpowerTelemetry.spaces.activeSpace;

      return {
        ...state,
        windowStack: newStack,
        focusedWindowId: windowId,
        windows: updatedWindows,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            activeSpace: nextSpace,
            activeSnap: updatedWindows[windowId]?.snap || null,
          },
        },
      };
    }

    case "RESTORE_ALL_WINDOWS": {
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };
      state.windowStack.forEach((id, index) => {
        updatedWindows[id] = {
          ...updatedWindows[id],
          zIndex: (index + 1) * 10,
          isMinimized: false,
          isFocused: index === state.windowStack.length - 1,
        };
      });
      const topId = state.windowStack[state.windowStack.length - 1] || "vscode";
      return {
        ...state,
        focusedWindowId: topId,
        windows: updatedWindows,
      };
    }

    case "MINIMIZE_ALL_WINDOWS": {
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };
      Object.keys(updatedWindows).forEach((k) => {
        const id = k as WindowId;
        updatedWindows[id] = { ...updatedWindows[id], isMinimized: true, isFocused: false };
      });
      return {
        ...state,
        focusedWindowId: "finder",
        windows: updatedWindows,
      };
    }

    case "MOVE_WINDOW": {
      const { windowId, x, y } = event;
      const win = state.windows[windowId];
      if (!win) return state;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            snap: null,
            isMaximized: false,
            rect: { ...win.rect, x, y },
          },
        },
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            activeSnap: state.focusedWindowId === windowId ? null : state.superpowerTelemetry.spaces.activeSnap,
          },
        },
      };
    }

    case "MINIMIZE_WINDOW": {
      const { windowId } = event;
      const win = state.windows[windowId];
      if (!win) return state;

      const remainingOpen = state.windowStack.filter(
        (id) => id !== windowId && !state.windows[id].isMinimized
      );
      const nextFocus: FocusedAppId = remainingOpen.length > 0
        ? remainingOpen[remainingOpen.length - 1]
        : "finder";

      return {
        ...state,
        focusedWindowId: nextFocus,
        windows: {
          ...state.windows,
          [windowId]: { ...win, isMinimized: true, isFocused: false },
          ...(nextFocus !== "finder" && state.windows[nextFocus] ? {
            [nextFocus]: { ...state.windows[nextFocus], isFocused: true },
          } : {}),
        },
      };
    }

    case "MAXIMIZE_WINDOW": {
      const { windowId } = event;
      const win = state.windows[windowId];
      if (!win) return state;

      const isCurrentlyMax = win.isMaximized || win.snap === "max";
      const nextSnap = isCurrentlyMax ? null : "max";
      const cWidth = 704;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            isMaximized: !isCurrentlyMax,
            snap: nextSnap,
            prevRect: win.prevRect || { ...win.rect },
            rect: isCurrentlyMax
              ? win.prevRect || { x: 30, y: 34, width: 480, height: 310, minWidth: 280, minHeight: 180 }
              : { x: 8, y: 6, width: cWidth - 16, height: 358, minWidth: 280, minHeight: 180 },
          },
        },
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            activeSnap: nextSnap,
          },
        },
      };
    }

    case "RESTORE_WINDOW": {
      const { windowId } = event;
      const win = state.windows[windowId];
      if (!win) return state;

      return desktopReducer(
        {
          ...state,
          windows: {
            ...state.windows,
            [windowId]: { ...win, isMinimized: false },
          },
        },
        { type: "FOCUS_WINDOW", windowId }
      );
    }

    case "MIGRATE_WINDOW": {
      const { windowId, target } = event;
      const win = state.windows[windowId];
      if (!win) return state;

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            displayTarget: target,
          },
        },
      };
    }

    case "SET_COMPANION_MODE": {
      return {
        ...state,
        companionMode: event.mode,
        trackpadCursor: {
          ...state.trackpadCursor,
          isVisible: event.mode === "trackpad",
        },
      };
    }

    case "TOGGLE_SPOTLIGHT": {
      return {
        ...state,
        isSpotlightOpen: !state.isSpotlightOpen,
        isControlCenterOpen: false,
        isAboutThisMacOpen: false,
      };
    }

    case "TOGGLE_CONTROL_CENTER": {
      return {
        ...state,
        isControlCenterOpen: !state.isControlCenterOpen,
        isSpotlightOpen: false,
      };
    }

    case "TOGGLE_ABOUT_THIS_MAC": {
      return {
        ...state,
        isAboutThisMacOpen: !state.isAboutThisMacOpen,
        isSpotlightOpen: false,
      };
    }

    case "CLOSE_ALL_OVERLAYS": {
      return {
        ...state,
        isSpotlightOpen: false,
        isControlCenterOpen: false,
        isAboutThisMacOpen: false,
      };
    }

    case "TRACKPAD_CLICK": {
      const { x, y } = event;

      // 0. Check if overlays are currently active
      if (state.isSpotlightOpen) {
        // Spotlight overlay box: x: 160 to 550, y: 48 to 220
        if (x >= 160 && x <= 550 && y >= 90 && y <= 125) {
          return desktopReducer({ ...state, isSpotlightOpen: false }, { type: "RESTORE_WINDOW", windowId: "vscode" });
        } else if (x >= 160 && x <= 550 && y > 125 && y <= 160) {
          return desktopReducer({ ...state, isSpotlightOpen: false }, { type: "RESTORE_WINDOW", windowId: "figma" });
        } else if (x >= 160 && x <= 550 && y > 160 && y <= 195) {
          return desktopReducer({ ...state, isSpotlightOpen: false }, { type: "RESTORE_WINDOW", windowId: "terminal" });
        }
        return { ...state, isSpotlightOpen: false };
      }

      if (state.isAboutThisMacOpen) {
        return { ...state, isAboutThisMacOpen: false };
      }

      if (state.isControlCenterOpen) {
        if (x < 440 || y > 290) {
          return { ...state, isControlCenterOpen: false };
        }
      }

      // 1. Check if clicking on the macOS Dock (y between 394 and 444)
      if (y >= 394 && y <= 444) {
        // Dock icons horizontally centered around x: 240 to 480
        if (x >= 240 && x < 280) {
          // Finder icon
          return desktopReducer(state, { type: "FOCUS_DESKTOP" });
        } else if (x >= 280 && x < 325) {
          // VS Code icon
          return desktopReducer(state, { type: "RESTORE_WINDOW", windowId: "vscode" });
        } else if (x >= 325 && x < 370) {
          // Figma icon
          return desktopReducer(state, { type: "RESTORE_WINDOW", windowId: "figma" });
        } else if (x >= 370 && x < 415) {
          // Terminal icon
          return desktopReducer(state, { type: "RESTORE_WINDOW", windowId: "terminal" });
        } else if (x >= 415 && x < 455) {
          // Settings icon
          return { ...state, isControlCenterOpen: !state.isControlCenterOpen };
        } else if (x >= 455 && x <= 495) {
          // Trash icon
          return state;
        }
      }

      // 2. Check if clicking on the Top Menu Bar (y <= 24)
      if (y <= 24) {
        if (x <= 35) {
          // Apple logo
          return { ...state, isAboutThisMacOpen: !state.isAboutThisMacOpen };
        }
        if (x >= 580 && x <= 612) {
          // Spotlight 🔍
          return { ...state, isSpotlightOpen: !state.isSpotlightOpen };
        }
        if (x >= 615 && x <= 645) {
          // Control Center
          return { ...state, isControlCenterOpen: !state.isControlCenterOpen };
        }
      }

      // 3. Check if clicking inside open windows (sorted by zIndex descending)
      const openWindows = state.windowStack
        .filter((id) => !state.windows[id].isMinimized)
        .reverse();

      for (const winId of openWindows) {
        const win = state.windows[winId];
        const inWindow =
          x >= win.rect.x &&
          x <= win.rect.x + win.rect.width &&
          y >= win.rect.y &&
          y <= win.rect.y + win.rect.height;

        if (inWindow) {
          // Check title bar traffic lights
          const inTitleBar = y >= win.rect.y && y <= win.rect.y + 28;
          if (inTitleBar && x >= win.rect.x + 8 && x <= win.rect.x + 58) {
            if (x <= win.rect.x + 22) {
              return desktopReducer(state, { type: "MINIMIZE_WINDOW", windowId: winId });
            } else if (x <= win.rect.x + 36) {
              return desktopReducer(state, { type: "MINIMIZE_WINDOW", windowId: winId });
            } else {
              return desktopReducer(state, { type: "MAXIMIZE_WINDOW", windowId: winId });
            }
          }

          // If inactive window -> focus and bring to front
          if (state.focusedWindowId !== winId) {
            return desktopReducer(state, { type: "FOCUS_WINDOW", windowId: winId });
          }

          // If active Figma window
          if (winId === "figma") {
            return desktopReducer(state, { type: "FIGMA_TOGGLE_LINK" });
          }

          // If active VS Code window
          if (winId === "vscode") {
            return desktopReducer(state, { type: "VSCODE_TOGGLE_BREAKPOINT" });
          }

          return state;
        }
      }

      // 4. Clicked on wallpaper -> Focus Desktop
      return desktopReducer(state, { type: "FOCUS_DESKTOP" });
    }

    case "SET_TRACKPAD_CURSOR": {
      return {
        ...state,
        trackpadCursor: {
          x: event.x,
          y: event.y,
          isDown: event.isDown ?? state.trackpadCursor.isDown,
          isVisible: event.isVisible ?? true,
        },
      };
    }

    case "SET_ROTARY_VALUE": {
      const isHud = event.control === "volume" || event.control === "brightness";
      return {
        ...state,
        rotaryControls: {
          ...state.rotaryControls,
          [event.control]: event.value,
        },
        hudState: isHud ? {
          type: event.control as "volume" | "brightness",
          value: event.value,
          timestamp: Date.now(),
        } : state.hudState,
      };
    }

    case "DISMISS_HUD": {
      return {
        ...state,
        hudState: { type: null, value: 0, timestamp: 0 },
      };
    }

    case "START_AIRDROP": {
      return {
        ...state,
        airdropFiles: state.airdropFiles.map((f) =>
          f.id === event.fileId ? { ...f, status: "transferring", progress: 15 } : f
        ),
      };
    }

    case "PROGRESS_AIRDROP": {
      return {
        ...state,
        airdropFiles: state.airdropFiles.map((f) =>
          f.id === event.fileId ? { ...f, progress: event.progress } : f
        ),
      };
    }

    case "COMPLETE_AIRDROP": {
      return {
        ...state,
        airdropFiles: state.airdropFiles.map((f) =>
          f.id === event.fileId ? { ...f, status: "received", progress: 100 } : f
        ),
      };
    }

    case "COPY_CLIPBOARD": {
      return {
        ...state,
        clipboardContent: event.content,
        clipboardPushed: true,
      };
    }

    case "SET_DEVICE":
      return { ...state, deviceOS: event.os };

    case "SET_PROTOCOL": {
      const latencies = {
        usbc: { base: 4.18, jitter: 0.06 },
        wifi: { base: 11.8, jitter: 1.2 },
        mesh: { base: 14.2, jitter: 2.1 },
      };
      const l = latencies[event.protocol];
      return {
        ...state,
        protocol: event.protocol,
        latencyMs: l.base,
        latencyJitter: l.jitter,
      };
    }

    // ── TWO-WAY FIGMA SYNCHRONIZATION ──
    case "FIGMA_TOGGLE_LINK": {
      return {
        ...state,
        figmaState: {
          ...state.figmaState,
          isLinked: !state.figmaState.isLinked,
        },
      };
    }

    case "FIGMA_SET_LINK": {
      return {
        ...state,
        figmaState: {
          ...state.figmaState,
          isLinked: event.isLinked,
        },
      };
    }

    case "FIGMA_TOGGLE_SWITCH": {
      return {
        ...state,
        figmaState: {
          ...state.figmaState,
          toggleActive: !state.figmaState.toggleActive,
        },
      };
    }

    case "FIGMA_SELECT_LAYER": {
      return {
        ...state,
        figmaState: {
          ...state.figmaState,
          selectedLayer: event.layer,
        },
      };
    }

    // ── TWO-WAY VS CODE SYNCHRONIZATION ──
    case "VSCODE_SET_TAB": {
      return {
        ...state,
        vscodeState: {
          ...state.vscodeState,
          activeTab: event.tabId,
        },
      };
    }

    case "VSCODE_TOGGLE_TERMINAL": {
      return {
        ...state,
        vscodeState: {
          ...state.vscodeState,
          isTerminalOpen: !state.vscodeState.isTerminalOpen,
        },
      };
    }

    case "VSCODE_TOGGLE_BREAKPOINT": {
      return {
        ...state,
        vscodeState: {
          ...state.vscodeState,
          hasBreakpoint: !state.vscodeState.hasBreakpoint,
        },
      };
    }

    case "VSCODE_SET_BRANCH": {
      return {
        ...state,
        vscodeState: {
          ...state.vscodeState,
          currentBranch: event.branch,
        },
      };
    }

    case "VSCODE_SET_TOAST": {
      return {
        ...state,
        vscodeState: {
          ...state.vscodeState,
          toastMessage: event.message,
        },
      };
    }

    // ── TERMINAL SYNCHRONIZATION ──
    case "TERMINAL_ADD_COMMAND": {
      return {
        ...state,
        terminalState: {
          ...state.terminalState,
          history: [...state.terminalState.history.slice(-4), event.item],
        },
      };
    }

    case "TERMINAL_CLEAR": {
      return {
        ...state,
        terminalState: {
          ...state.terminalState,
          history: [],
        },
      };
    }

    case "EXECUTE_ACTION": {
      const action = event.action;
      let nextState = {
        ...state,
        status: "executing" as const,
        lastAction: action,
        lastActionTimestamp: Date.now(),
      };

      // Desktop & System macro dispatches
      if (action.id === "launch-vscode") {
        return desktopReducer(nextState, { type: "FOCUS_WINDOW", windowId: "vscode" });
      }
      if (action.id === "launch-figma") {
        return desktopReducer(nextState, { type: "FOCUS_WINDOW", windowId: "figma" });
      }
      if (action.id === "launch-terminal") {
        return desktopReducer(nextState, { type: "FOCUS_WINDOW", windowId: "terminal" });
      }
      if (action.id === "open-finder") {
        return desktopReducer(nextState, { type: "FOCUS_DESKTOP" });
      }
      if (action.id === "mission-control") {
        return desktopReducer(nextState, { type: "RESTORE_ALL_WINDOWS" });
      }

      // VS Code macro updates
      if (action.id === "run-tests") {
        nextState = {
          ...nextState,
          vscodeState: { ...nextState.vscodeState, isTerminalOpen: true },
        };
      } else if (action.id === "open-terminal") {
        nextState = {
          ...nextState,
          vscodeState: { ...nextState.vscodeState, isTerminalOpen: !nextState.vscodeState.isTerminalOpen },
        };
      } else if (action.id === "toggle-breakpoint") {
        nextState = {
          ...nextState,
          vscodeState: { ...nextState.vscodeState, hasBreakpoint: !nextState.vscodeState.hasBreakpoint },
        };
      } else if (action.id === "checkout-main") {
        const nextBranch = nextState.vscodeState.currentBranch === "main" ? "feat/dma" : "main";
        nextState = {
          ...nextState,
          vscodeState: {
            ...nextState.vscodeState,
            currentBranch: nextBranch,
            toastMessage: `Switched branch to ${nextBranch}`,
          },
        };
      } else if (action.id === "format-code") {
        nextState = {
          ...nextState,
          vscodeState: {
            ...nextState.vscodeState,
            isShimmering: true,
            toastMessage: "rustfmt: 3 files formatted cleanly",
          },
        };
      } else if (action.id === "git-commit") {
        nextState = {
          ...nextState,
          vscodeState: {
            ...nextState.vscodeState,
            toastMessage: "✓ Committed changes to feat/dma [8a19f0]",
          },
        };
      }

      // Terminal macro updates
      if (action.id === "docker-ps") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "cargo-run") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "htop-monitor") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "git-status") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "ssh-connect") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "quick-deploy") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "show-history") {
        nextState = {
          ...nextState,
          terminalState: {
            history: [
              ...nextState.terminalState.history.slice(-3),
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
            ],
          },
        };
      } else if (action.id === "clear-terminal") {
        nextState = {
          ...nextState,
          terminalState: { history: [] },
        };
      }

      return nextState;
    }

    case "RESOLVE_ACTION": {
      return {
        ...state,
        status: "resolved",
      };
    }

    case "SET_SUPERPOWER": {
      const pId = event.powerId;
      let nextMode: CompanionMode = state.companionMode;
      const nextCursor = { ...state.trackpadCursor };
      const nextClamshell = { ...state.superpowerTelemetry.clamshell };

      if (pId === "streaming" || pId === "zoom" || pId === "spaces" || pId === "clipboard" || pId === "clamshell") {
        nextMode = "sidecar";
        if (pId === "clamshell") {
          nextClamshell.isLidClosed = true;
        }
      } else if (pId === "trackpad") {
        nextMode = "trackpad";
        nextCursor.isVisible = true;
      } else if (pId === "touchbar" || pId === "meeting" || pId === "transport") {
        nextMode = "touchbar";
      }

      return {
        ...state,
        activeSuperpower: pId,
        companionMode: nextMode,
        trackpadCursor: nextCursor,
        isSpotlightOpen: false,
        isControlCenterOpen: false,
        isAboutThisMacOpen: false,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          clamshell: nextClamshell,
          menubar: {
            ...state.superpowerTelemetry.menubar,
            isTactileAppPopoverOpen: pId === "menubar" ? !state.superpowerTelemetry.menubar.isTactileAppPopoverOpen : state.superpowerTelemetry.menubar.isTactileAppPopoverOpen,
          },
        },
      };
    }

    case "TRIGGER_KEYFRAME_SYNC": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          streaming: {
            ...state.superpowerTelemetry.streaming,
            isKeyframeSyncing: true,
          },
        },
      };
    }

    case "SET_STREAM_FPS": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          streaming: {
            ...state.superpowerTelemetry.streaming,
            fps: event.fps,
            bitrateMbps: event.fps === 120 ? 42.6 : 28.4,
          },
        },
      };
    }

    case "SET_ZOOM_SCALE": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          zoom: {
            ...state.superpowerTelemetry.zoom,
            scale: event.scale,
            focal: event.focalX !== undefined && event.focalY !== undefined ? { x: event.focalX, y: event.focalY } : state.superpowerTelemetry.zoom.focal,
          },
        },
      };
    }

    case "TOGGLE_ZOOM_LOCK": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          zoom: {
            ...state.superpowerTelemetry.zoom,
            isZoomLocked: !state.superpowerTelemetry.zoom.isZoomLocked,
          },
        },
      };
    }

    case "TOGGLE_MOUSE_MUTE": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          zoom: {
            ...state.superpowerTelemetry.zoom,
            isMouseMuted: !state.superpowerTelemetry.zoom.isMouseMuted,
          },
        },
      };
    }

    case "SWITCH_SPACE": {
      const spaceAppMap: Record<number, WindowId> = {
        0: "vscode",
        1: "figma",
        2: "terminal",
      };
      const targetApp = spaceAppMap[event.spaceIndex] || "vscode";
      const newStack = state.windowStack.filter((id) => id !== targetApp).concat(targetApp);
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };

      newStack.forEach((id, index) => {
        if (updatedWindows[id]) {
          updatedWindows[id] = {
            ...updatedWindows[id],
            zIndex: 10 + index * 2,
            isFocused: id === targetApp,
            isMinimized: id !== targetApp,
          };
        }
      });
      if (updatedWindows[targetApp]) {
        updatedWindows[targetApp] = {
          ...updatedWindows[targetApp],
          isMinimized: false,
          isFocused: true,
        };
      }

      return {
        ...state,
        focusedWindowId: targetApp,
        windowStack: newStack,
        windows: updatedWindows,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            activeSpace: event.spaceIndex,
            activeSnap: updatedWindows[targetApp]?.snap || null,
            isMissionControl: false,
            isAppExpose: false,
          },
        },
      };
    }

    case "TOGGLE_MISSION_CONTROL": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            isMissionControl: !state.superpowerTelemetry.spaces.isMissionControl,
            isAppExpose: false,
          },
        },
      };
    }

    case "TOGGLE_EXPOSE": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            isAppExpose: !state.superpowerTelemetry.spaces.isAppExpose,
            isMissionControl: false,
          },
        },
      };
    }

    case "SNAP_WINDOW": {
      let targetId: WindowId = state.focusedWindowId === "finder" ? "vscode" : state.focusedWindowId;

      if (state.windows[targetId]?.isMinimized) {
        const spaceAppMap: Record<number, WindowId> = { 0: "vscode", 1: "figma", 2: "terminal" };
        const spaceApp = spaceAppMap[state.superpowerTelemetry.spaces.activeSpace];
        if (spaceApp && !state.windows[spaceApp]?.isMinimized) {
          targetId = spaceApp;
        } else {
          const unminimized = [...state.windowStack].reverse().find((id) => !state.windows[id]?.isMinimized);
          if (unminimized) targetId = unminimized;
        }
      }

      const win = state.windows[targetId];
      if (!win) return state;

      const isSameSnap = win.snap === event.snap || (event.snap === "max" && win.isMaximized);
      const nextSnap = isSameSnap ? null : event.snap;

      let newRect = { ...win.rect };
      let newPrevRect = win.prevRect;

      const cWidth = 704;
      const halfW = Math.floor((cWidth - 24) / 2);

      if (nextSnap === null) {
        newRect = win.prevRect || { x: 30, y: 34, width: 480, height: 310, minWidth: 280, minHeight: 180 };
      } else {
        if (!win.snap && !win.isMaximized) {
          newPrevRect = { ...win.rect };
        }
        if (nextSnap === "left") {
          newRect = { ...win.rect, x: 8, y: 6, width: halfW, height: 358 };
        } else if (nextSnap === "right") {
          newRect = { ...win.rect, x: 8 + halfW + 8, y: 6, width: halfW, height: 358 };
        } else if (nextSnap === "max") {
          newRect = { ...win.rect, x: 8, y: 6, width: cWidth - 16, height: 358 };
        }
      }

      const newStack = state.windowStack.filter((id) => id !== targetId).concat(targetId);
      const updatedWindows: Record<WindowId, WindowState> = { ...state.windows };

      newStack.forEach((id, index) => {
        if (updatedWindows[id]) {
          updatedWindows[id] = {
            ...updatedWindows[id],
            zIndex: 10 + index * 2,
            isFocused: id === targetId,
          };
        }
      });

      updatedWindows[targetId] = {
        ...updatedWindows[targetId],
        rect: newRect,
        prevRect: newPrevRect,
        isMinimized: false,
        isFocused: true,
        isMaximized: nextSnap === "max",
        snap: nextSnap,
      };

      const spaceMap: Record<WindowId, number> = { vscode: 0, figma: 1, terminal: 2 };

      return {
        ...state,
        focusedWindowId: targetId,
        windowStack: newStack,
        windows: updatedWindows,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          spaces: {
            ...state.superpowerTelemetry.spaces,
            activeSpace: spaceMap[targetId] ?? state.superpowerTelemetry.spaces.activeSpace,
            activeSnap: nextSnap,
          },
        },
      };
    }

    case "TOGGLE_ZERO_VIDEO_MODE": {
      const nextZero = !state.superpowerTelemetry.touchbar.zeroVideoMode;
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          touchbar: {
            ...state.superpowerTelemetry.touchbar,
            zeroVideoMode: nextZero,
            batteryRate: nextZero ? "0.42%/hr" : "4.8%/hr",
          },
        },
      };
    }

    case "SYNC_CLIPBOARD": {
      const hash = "sha256_" + Math.random().toString(36).substring(2, 10);
      return {
        ...state,
        clipboardContent: event.text,
        clipboardPushed: true,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          clipboard: {
            ...state.superpowerTelemetry.clipboard,
            macClipboard: event.text,
            phoneClipboard: event.text,
            lastSha256: hash,
            syncLatencyMs: 14.8,
            isEchoSuppressed: true,
          },
        },
      };
    }

    case "TOGGLE_CLAMSHELL": {
      const nextClosed = !state.superpowerTelemetry.clamshell.isLidClosed;
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          clamshell: {
            ...state.superpowerTelemetry.clamshell,
            isLidClosed: nextClosed,
          },
        },
      };
    }

    case "TOGGLE_HARDWARE_MIC": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          meeting: {
            ...state.superpowerTelemetry.meeting,
            isHardwareMicMuted: !state.superpowerTelemetry.meeting.isHardwareMicMuted,
          },
        },
      };
    }

    case "TOGGLE_TACTILE_MENU_APP": {
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          menubar: {
            ...state.superpowerTelemetry.menubar,
            isTactileAppPopoverOpen: !state.superpowerTelemetry.menubar.isTactileAppPopoverOpen,
          },
        },
      };
    }

    case "TOGGLE_MASTER_SWITCH": {
      const current = state.superpowerTelemetry.menubar.masterSwitches[event.switchKey];
      return {
        ...state,
        superpowerTelemetry: {
          ...state.superpowerTelemetry,
          menubar: {
            ...state.superpowerTelemetry.menubar,
            masterSwitches: {
              ...state.superpowerTelemetry.menubar.masterSwitches,
              [event.switchKey]: !current,
            },
          },
        },
      };
    }

    case "RESET":
      return INITIAL_DESKTOP_STATE;

    default:
      return state;
  }
}
