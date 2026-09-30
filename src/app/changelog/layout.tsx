import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog & Updates — Tactile",
  description: "Track the evolution of Tactile: release notes, performance improvements, and newly added macOS companion features.",
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
