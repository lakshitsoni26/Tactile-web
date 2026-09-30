import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Licensing — Tactile",
  description: "Transparent pricing for Tactile. Free during beta, simple one-time lifetime license. Zero subscriptions.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
