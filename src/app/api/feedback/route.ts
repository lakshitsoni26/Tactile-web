import { NextResponse } from "next/server";
import { after } from "next/server";
import fs from "fs";
import path from "path";
import { sendFeatureRequestEmail, sendFounderFeatureAlert } from "@/lib/resend";
import { incrementFeatureRequestCounter, readCounters } from "@/lib/serverCounter";

const DATA_DIR = path.join(process.cwd(), "data");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

interface FeatureRequestItem {
  id: string;
  requestId: string;
  appName: string;
  title: string;
  description: string;
  category: string;
  email?: string;
  createdAt: string;
  status: "triaged" | "planned" | "in_development" | "shipped";
}

function getFeedbackList(): FeatureRequestItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FEEDBACK_FILE)) {
      const raw = fs.readFileSync(FEEDBACK_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[feedback] Error reading feedback file:", err);
  }
  return [];
}

function saveFeedbackList(list: FeatureRequestItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[feedback] Error saving feedback file:", err);
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { appName, title, description, category, email } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Feature title is required." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Please provide a brief description of the workflow." },
        { status: 400 }
      );
    }

    const cleanApp =
      typeof appName === "string" && appName.trim()
        ? appName.trim().slice(0, 80)
        : "Custom Workflow";

    const cleanTitle = title.trim().slice(0, 150);
    const cleanDescription = description.trim().slice(0, 2000);
    const cleanCategory =
      typeof category === "string" && category.trim()
        ? category.trim().slice(0, 80)
        : "Application Macro Deck";

    const cleanEmail =
      typeof email === "string" && email.trim() && email.includes("@")
        ? email.trim().toLowerCase().slice(0, 254)
        : undefined;

    // Randomly generated tracking ID (e.g. REQ-8F42A)
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const requestId = `REQ-${randomCode}`;
    const createdAt = new Date().toISOString();

    const item: FeatureRequestItem = {
      id: `feat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      requestId,
      appName: cleanApp,
      title: cleanTitle,
      description: cleanDescription,
      category: cleanCategory,
      email: cleanEmail,
      createdAt,
      status: "triaged",
    };

    const feedbackList = getFeedbackList();
    feedbackList.unshift(item);
    saveFeedbackList(feedbackList);

    // Non-blocking background email dispatch
    after(async () => {
      // 1. Send receipt to developer if email was provided
      if (cleanEmail) {
        await sendFeatureRequestEmail({
          to: cleanEmail,
          requestId,
          appName: cleanApp,
          title: cleanTitle,
          description: cleanDescription,
          category: cleanCategory,
        });
      }

      // 2. Send instant alert to founder (lakshitsoni26@gmail.com)
      await sendFounderFeatureAlert({
        to: cleanEmail,
        requestId,
        appName: cleanApp,
        title: cleanTitle,
        description: cleanDescription,
        category: cleanCategory,
      });
    });

    return NextResponse.json(
      {
        success: true,
        requestId,
        data: item,
        message: "Your workflow request has been logged and queued for engineering review.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[feedback] API error:", error);
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
    totalFeatureRequests: counters.featureRequestCount,
  });
}
