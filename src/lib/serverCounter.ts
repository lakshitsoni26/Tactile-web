import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const COUNTER_FILE = path.join(DATA_DIR, "counter.json");

interface CounterData {
  waitlistCount: number;
  featureRequestCount: number;
  lastUpdated: string;
}

const DEFAULT_DATA: CounterData = {
  waitlistCount: 239, // Initialized at 239 so the first new applicant gets #240
  featureRequestCount: 17, // Initialized baseline for feature requests
  lastUpdated: new Date().toISOString(),
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readCounters(): CounterData {
  try {
    ensureDataDir();
    if (!fs.existsSync(COUNTER_FILE)) {
      fs.writeFileSync(COUNTER_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(COUNTER_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      waitlistCount: typeof parsed.waitlistCount === "number" ? parsed.waitlistCount : 239,
      featureRequestCount: typeof parsed.featureRequestCount === "number" ? parsed.featureRequestCount : 17,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (error) {
    console.error("[serverCounter] Failed to read counter file, using memory baseline:", error);
    return DEFAULT_DATA;
  }
}

export function incrementWaitlistCounter(): number {
  try {
    ensureDataDir();
    const data = readCounters();
    data.waitlistCount += 1;
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data.waitlistCount;
  } catch (error) {
    console.error("[serverCounter] Failed to increment waitlist counter:", error);
    DEFAULT_DATA.waitlistCount += 1;
    return DEFAULT_DATA.waitlistCount;
  }
}

export function incrementFeatureRequestCounter(): number {
  try {
    ensureDataDir();
    const data = readCounters();
    data.featureRequestCount += 1;
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data.featureRequestCount;
  } catch (error) {
    console.error("[serverCounter] Failed to increment feature request counter:", error);
    DEFAULT_DATA.featureRequestCount += 1;
    return DEFAULT_DATA.featureRequestCount;
  }
}
