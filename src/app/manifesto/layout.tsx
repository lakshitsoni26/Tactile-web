import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto — Tactile | The Local-First Hardware Companion",
  description:
    "Why we built Tactile: Turning the dormant OLED display in your pocket into an ultra-low latency auxiliary screen, contextual Touch Bar, and precision trackpad for Mac. 100% local-first, zero cloud relays.",
  openGraph: {
    title: "Manifesto — Tactile | The Local-First Hardware Companion",
    description:
      "Why we built Tactile: Turning the dormant OLED display in your pocket into an ultra-low latency auxiliary screen, contextual Touch Bar, and precision trackpad for Mac.",
    url: "https://tactile.lakshitsoni.in/manifesto",
    siteName: "Tactile",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manifesto — Tactile | The Local-First Hardware Companion",
    description:
      "Why we built Tactile: Turning the dormant OLED display in your pocket into an ultra-low latency auxiliary screen, contextual Touch Bar, and precision trackpad for Mac.",
  },
};

export default function ManifestoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
