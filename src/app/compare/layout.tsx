import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare — Tactile vs Stream Deck, VNC & Sidecar",
  description: "See how Tactile compares to hardware macro decks, remote VNC apps, and Apple Sidecar.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
