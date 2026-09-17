import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #14172a 0%, #05060b 100%)",
          borderRadius: "44px",
          border: "3px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 32 32" fill="none">
          {/* Horizontal Touch Bar */}
          <rect x="5" y="6" width="22" height="6" rx="3" fill="#00F0FF" />
          {/* Specular Sheen */}
          <rect x="6" y="6.5" width="20" height="1.8" rx="0.9" fill="#FFFFFF" opacity="0.6" />
          {/* Vertical Companion Phone */}
          <rect x="12.5" y="10.5" width="7" height="15.5" rx="3.5" fill="#A855F7" />
          {/* Inner Display Bezel */}
          <rect x="13.75" y="12.5" width="4.5" height="11" rx="2" fill="#090a16" opacity="0.5" />
          {/* Haptic Pressure Node */}
          <circle cx="16" cy="18" r="1.2" fill="#00F0FF" />
          {/* Hardware Connection Core */}
          <circle cx="16" cy="9" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
