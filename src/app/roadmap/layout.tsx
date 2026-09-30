import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap — Tactile Engineering & Release Timeline",
  description: "Explore what we have shipped, what we are actively engineering in Swift and Rust, and what is next for Tactile.",
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
