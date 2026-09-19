/**
 * Demo State Machine & Shared Types for the Dual-Device Interactive Demo
 *
 * Architecture: React context + useReducer for predictable state transitions.
 * Both MacScreenContent and PhoneScreenContent subscribe to the same state.
 */

export type AppId = "vscode" | "figma" | "terminal" | "finder";
export type ProtocolId = "usbc" | "wifi" | "mesh";
export type DeviceOS = "ios" | "android";

export interface DemoAction {
  id: string;
  label: string;
  description: string; // Activity feed description
  duration: number; // Simulated compute latency (ms)
}

export interface DemoState {
  activeApp: AppId;
  activeProtocol: ProtocolId;
  deviceOS: DeviceOS;

  // Interaction state machine
  status: "idle" | "executing" | "resolved";
  lastAction: DemoAction | null;
  lastActionTimestamp: number;

  // Activity feed (phone shows this instead of mirror)
  activityLog: ActivityEntry[];

  // Telemetry
  latencyMs: number;
  latencyJitter: number;
}

export interface ActivityEntry {
  id: string;
  timestamp: number;
  icon: string; // Lucide icon name
  text: string;
  type: "action" | "result" | "system";
}

export type DemoEvent =
  | { type: "SET_APP"; app: AppId }
  | { type: "SET_PROTOCOL"; protocol: ProtocolId }
  | { type: "SET_DEVICE"; os: DeviceOS }
  | { type: "EXECUTE_ACTION"; action: DemoAction }
  | { type: "RESOLVE_ACTION" }
  | { type: "RESET" }
  | { type: "ADD_ACTIVITY"; entry: ActivityEntry };

const PROTOCOL_LATENCY: Record<ProtocolId, { base: number; jitter: number }> = {
  usbc: { base: 4.18, jitter: 0.06 },
  wifi: { base: 11.8, jitter: 1.2 },
  mesh: { base: 14.2, jitter: 2.1 },
};

export const INITIAL_DEMO_STATE: DemoState = {
  activeApp: "vscode",
  activeProtocol: "usbc",
  deviceOS: "ios",
  status: "idle",
  lastAction: null,
  lastActionTimestamp: 0,
  activityLog: [
    {
      id: "init-1",
      timestamp: Date.now(),
      icon: "Zap",
      text: "DMA bridge connected via USB-C",
      type: "system",
    },
    {
      id: "init-2",
      timestamp: Date.now() - 1200,
      icon: "Monitor",
      text: "VS Code detected — loading profile",
      type: "system",
    },
    {
      id: "init-3",
      timestamp: Date.now() - 2400,
      icon: "CheckCircle",
      text: "Touch Bar macros synced (4 actions)",
      type: "system",
    },
  ],
  latencyMs: 4.18,
  latencyJitter: 0.06,
};

export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case "SET_APP": {
      const newEntry: ActivityEntry = {
        id: `app-${Date.now()}`,
        timestamp: Date.now(),
        icon: "ArrowRightLeft",
        text: `Switched to ${event.app === "vscode" ? "VS Code" : event.app === "figma" ? "Figma" : "Terminal"}`,
        type: "system",
      };
      return {
        ...state,
        activeApp: event.app,
        status: "idle",
        lastAction: null,
        activityLog: [newEntry, ...state.activityLog].slice(0, 12),
      };
    }

    case "SET_PROTOCOL": {
      const latency = PROTOCOL_LATENCY[event.protocol];
      const newEntry: ActivityEntry = {
        id: `proto-${Date.now()}`,
        timestamp: Date.now(),
        icon: "Cable",
        text: `Protocol: ${event.protocol === "usbc" ? "USB-C" : event.protocol === "wifi" ? "Wi-Fi" : "Mesh VPN"} (${latency.base}ms)`,
        type: "system",
      };
      return {
        ...state,
        activeProtocol: event.protocol,
        latencyMs: latency.base,
        latencyJitter: latency.jitter,
        activityLog: [newEntry, ...state.activityLog].slice(0, 12),
      };
    }

    case "SET_DEVICE":
      return { ...state, deviceOS: event.os };

    case "EXECUTE_ACTION": {
      const actionEntry: ActivityEntry = {
        id: `exec-${Date.now()}`,
        timestamp: Date.now(),
        icon: "Loader",
        text: event.action.description,
        type: "action",
      };
      return {
        ...state,
        status: "executing",
        lastAction: event.action,
        lastActionTimestamp: Date.now(),
        activityLog: [actionEntry, ...state.activityLog].slice(0, 12),
      };
    }

    case "RESOLVE_ACTION": {
      const resultEntry: ActivityEntry = {
        id: `result-${Date.now()}`,
        timestamp: Date.now(),
        icon: "CheckCircle",
        text: state.lastAction
          ? `✓ ${state.lastAction.label} completed`
          : "Action completed",
        type: "result",
      };
      return {
        ...state,
        status: "resolved",
        activityLog: [resultEntry, ...state.activityLog].slice(0, 12),
      };
    }

    case "ADD_ACTIVITY":
      return {
        ...state,
        activityLog: [event.entry, ...state.activityLog].slice(0, 12),
      };

    case "RESET":
      return INITIAL_DEMO_STATE;

    default:
      return state;
  }
}

/** Auto-reset timeout in ms (30 seconds of inactivity) */
export const DEMO_RESET_TIMEOUT = 30_000;
