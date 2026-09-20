import { NextResponse } from "next/server";
import { after } from "next/server";
import fs from "fs";
import path from "path";
import { type WaitlistEntry } from "@/lib/waitlistStore";
import { sendWaitlistEmail, sendFounderWaitlistAlert } from "@/lib/resend";
import { readCounters, incrementWaitlistCounter } from "@/lib/serverCounter";

// RFC 5322 simplified regex for robust email validation
const RFC_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Persistence file for waitlist registrations
const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRY_FILE = path.join(DATA_DIR, "waitlist.json");

function getRegistry(): Map<string, WaitlistEntry> {
  const map = new Map<string, WaitlistEntry>();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(REGISTRY_FILE)) {
      const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
      const list: WaitlistEntry[] = JSON.parse(raw);
      list.forEach((item) => map.set(item.email.toLowerCase(), item));
    }
  } catch (err) {
    console.error("[waitlist] Error reading waitlist registry:", err);
  }
  return map;
}

function saveRegistry(map: Map<string, WaitlistEntry>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(map.values());
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[waitlist] Error saving waitlist registry:", err);
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request payload must be a JSON object." },
        { status: 400 }
      );
    }

    const { email, devicePreference, role, referralCode } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail.length > 254) {
      return NextResponse.json(
        { error: "Email address exceeds maximum permitted length (254 characters)." },
        { status: 400 }
      );
    }

    if (!cleanEmail.includes("@") || !RFC_EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate & normalize device preference
    const cleanDevice =
      typeof devicePreference === "string" && devicePreference.trim()
        ? devicePreference.trim().slice(0, 100)
        : "iPhone 16 Pro";

    // Validate & normalize role
    const cleanRole =
      typeof role === "string" && role.trim()
        ? role.trim().slice(0, 100)
        : "Full-Stack Engineer";

    // Validate & normalize referral code
    const cleanReferral =
      typeof referralCode === "string" && referralCode.trim()
        ? referralCode.trim().slice(0, 50)
        : undefined;

    // Check registry for existing registrations (Idempotent response)
    const registry = getRegistry();
    if (registry.has(cleanEmail)) {
      const existing = registry.get(cleanEmail)!;
      return NextResponse.json(
        {
          success: true,
          alreadyRegistered: true,
          data: existing,
          entry: existing,
          message: "Welcome back! You're already on the priority access list.",
        },
        { status: 200 }
      );
    }

    // Atomically increment counter starting from 239 -> 240+
    const currentCounter = incrementWaitlistCounter();
    const ticketNumber = `#${currentCounter}`;
    const generatedReferralCode = `TAC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const joinedAt = new Date().toISOString();

    const entry: WaitlistEntry = {
      id: `tac_${currentCounter}_${Date.now()}`,
      email: cleanEmail,
      ticketNumber,
      queuePosition: currentCounter,
      referralCode: generatedReferralCode,
      referredBy: cleanReferral,
      role: cleanRole,
      devicePreference: cleanDevice,
      tier: "Founding Creator",
      accessWave: "Wave 01 (Direct DMA Access)",
      joinedAt,
      perks: [
        "Sub-15ms 60 FPS low-latency display engine unlock",
        "Dynamic Touch Bar profiles (VS Code, Cursor, Figma, Terminal)",
        "Universal 2-Way zero-cloud local clipboard bridge",
        "Lifetime VIP badge & direct engineering team access",
      ],
    };

    registry.set(cleanEmail, entry);
    saveRegistry(registry);

    // Fire dual notification emails non-blocking (doesn't delay API response)
    after(async () => {
      const firstName = cleanEmail.split("@")[0].split(".")[0];
      const displayName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);

      // 1. Send receipt to applicant
      await sendWaitlistEmail({
        to: cleanEmail,
        name: displayName,
        ticketNumber: currentCounter,
        position: currentCounter,
        role: cleanRole,
        devicePreference: cleanDevice,
      });

      // 2. Send instant founder alert to lakshitsoni26@gmail.com
      await sendFounderWaitlistAlert({
        to: cleanEmail,
        name: displayName,
        ticketNumber: currentCounter,
        position: currentCounter,
        role: cleanRole,
        devicePreference: cleanDevice,
      });
    });

    return NextResponse.json(
      {
        success: true,
        alreadyRegistered: false,
        data: entry,
        entry: entry,
        message: "Priority reservation confirmed! Your VIP ticket is ready.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again shortly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const counters = readCounters();
  return NextResponse.json({
    status: "healthy",
    totalCount: counters.waitlistCount,
    supportedDevices: ["macOS Sequoia 14.3+", "iPhone & iPad", "Android 10+"],
  });
}
