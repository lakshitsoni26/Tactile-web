import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: "tactile-web",
      version: "2.4.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      protocols: {
        usbcDma: { status: "nominal", latencyMs: 4.18, targetFps: 60 },
        wifiP2p: { status: "nominal", latencyMs: 11.8, targetFps: 60 },
        meshVpn: { status: "nominal", latencyMs: 14.2, targetFps: 60 },
      },
      environment: process.env.NODE_ENV || "production",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
