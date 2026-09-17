import { ImageResponse } from "next/og";

export const alt = "Tactile — The Missing Hardware Companion for Your Mac";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050508",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "250px",
            width: "700px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Top Header & Telemetry */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#0d0e1b",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <rect x="5" y="6" width="22" height="6" rx="3" fill="#00F0FF" />
                <rect x="6" y="6.5" width="20" height="1.8" rx="0.9" fill="#FFFFFF" opacity="0.6" />
                <rect x="12.5" y="10.5" width="7" height="15.5" rx="3.5" fill="#A855F7" />
                <rect x="13.75" y="12.5" width="4.5" height="11" rx="2" fill="#090a16" opacity="0.5" />
                <circle cx="16" cy="18" r="1.2" fill="#00F0FF" />
                <circle cx="16" cy="9" r="1.8" fill="#FFFFFF" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "-0.03em",
              }}
            >
              Tactile
            </span>
          </div>

          {/* Telemetry Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(10,12,24,0.9)",
              border: "1px solid rgba(57,255,20,0.35)",
              color: "#39FF14",
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#39FF14",
              }}
            />
            <span>ULTRA-LOW LATENCY // 60-120 FPS // 100% LOCAL-FIRST</span>
          </div>
        </div>

        {/* Main Value Proposition */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.045em",
              margin: 0,
            }}
          >
            Your Mac’s favorite screen{" "}
            <span
              style={{
                color: "#00f0ff",
              }}
            >
              is in your pocket.
            </span>
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "840px",
            }}
          >
            Turn your phone into an ultra-low-latency 4.2ms auxiliary display,
            dynamic contextual Touch Bar, and macro deck for Mac. Zero extra hardware required.
          </p>
        </div>

        {/* Bottom Feature Badges & Social Proof */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "16px",
              color: "#71717a",
              fontFamily: "monospace",
            }}
          >
            <span>• Direct USB-C 3.2</span>
            <span>• Wi-Fi 6 P2P</span>
            <span>• macOS 14+ & Android 10+</span>
            <span>• 1000Hz HID</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e4e4e7",
              fontSize: "15px",
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#00f0ff", fontWeight: "bold" }}>tactile.lakshitsoni.in</span>
            <span style={{ color: "#52525b" }}>|</span>
            <span>Founding Creator Access</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
