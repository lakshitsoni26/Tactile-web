import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Story — Tactile",
  description: "Why we built Tactile: an essay on physical tactility, local-first tools, and reclaiming the Mac's missing half by founder Lakshit.",
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
