import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #121424 0%, #06070C 100%)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          {/* Horizontal Touch Bar */}
          <rect x="5" y="6" width="22" height="6" rx="3" fill="#00F0FF" />
          {/* Vertical Companion Phone */}
          <rect x="12.5" y="10.5" width="7" height="15.5" rx="3.5" fill="#A855F7" />
          {/* Hardware Connection Node */}
          <circle cx="16" cy="9" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
