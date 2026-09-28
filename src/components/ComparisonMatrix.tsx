"use client";

import { Check, X } from "lucide-react";

interface ComparisonRow {
  feature: string;
  tactile: string | boolean;
  streamDeck: string | boolean;
  traditionalVnc: string | boolean;
  appleSidecar: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Hardware Cost",
    tactile: "Free / Existing Phone",
    streamDeck: "$150 — $250",
    traditionalVnc: "Free to $20/mo",
    appleSidecar: "$499+ (Requires iPad)",
  },
  {
    feature: "Responsiveness",
    tactile: "Real-time 60-120 FPS",
    streamDeck: "Static LCD buttons",
    traditionalVnc: "Noticeable cloud lag",
    appleSidecar: "Standard refresh",
  },
  {
    feature: "Android & iPhone Universal",
    tactile: true,
    streamDeck: false,
    traditionalVnc: true,
    appleSidecar: false,
  },
  {
    feature: "Contextual App Macros",
    tactile: true,
    streamDeck: "Manual Profiles Only",
    traditionalVnc: false,
    appleSidecar: false,
  },
  {
    feature: "Model Context Protocol (MCP)",
    tactile: true,
    streamDeck: false,
    traditionalVnc: false,
    appleSidecar: false,
  },
  {
    feature: "Universal 2-Way Clipboard",
    tactile: true,
    streamDeck: false,
    traditionalVnc: "Unreliable",
    appleSidecar: "Apple ID only",
  },
  {
    feature: "Extra Hardware on Desk",
    tactile: "0g (Pocket device)",
    streamDeck: "Bulky hardware box",
    traditionalVnc: "0g",
    appleSidecar: "Large iPad footprint",
  },
];

function CellValue({ value, winner }: { value: string | boolean; winner?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center gap-1.5 font-medium text-[#15803D]">
        <Check className="w-4 h-4 stroke-[2.2]" />
        <span className="text-xs">Yes</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 font-medium text-[#A1A1AA]">
        <X className="w-4 h-4 stroke-[1.8]" />
        <span className="text-xs">No</span>
      </span>
    );
  }
  return (
    <span className={`text-[13.5px] ${winner ? "font-semibold text-[#111111]" : "text-[#71717A]"}`}>
      {value}
    </span>
  );
}

export default function ComparisonMatrix() {
  return (
    <section id="comparison" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="tag-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>Transparent Comparison</span>
        </div>
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#111111] leading-[1.08]">
          Engineered for simplicity. <span className="italic font-serif">How Tactile compares.</span>
        </h2>
        <p className="mt-3 text-[15px] text-[#666666] max-w-md mx-auto font-[family-name:var(--font-inter)]">
          Why buy a separate $150 plastic macro pad when the most advanced OLED display is already in your pocket?
        </p>
      </div>

      {/* Comparison Table */}
      <div className="resurf-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#FBFBFA]">
                <th className="py-4 px-5 text-[13px] font-medium text-[#71717A]">Feature</th>
                <th className="py-4 px-5 text-[13px] font-semibold text-[#111111] bg-[#FEF3C7]/40 border-x border-[#FDE68A]/60">
                  <div className="flex items-center gap-1.5">
                    <span>Tactile</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#D97706] text-white">
                      Best Value
                    </span>
                  </div>
                </th>
                <th className="py-4 px-5 text-[13px] font-medium text-[#71717A]">Hardware Deck</th>
                <th className="py-4 px-5 text-[13px] font-medium text-[#71717A]">VNC / Remote</th>
                <th className="py-4 px-5 text-[13px] font-medium text-[#71717A]">Apple Sidecar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[13.5px]">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-black/[0.015] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-[#333333]">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-5 bg-[#FEF3C7]/20 border-x border-[#FDE68A]/40 font-medium">
                    <CellValue value={row.tactile} winner />
                  </td>
                  <td className="py-3.5 px-5">
                    <CellValue value={row.streamDeck} />
                  </td>
                  <td className="py-3.5 px-5">
                    <CellValue value={row.traditionalVnc} />
                  </td>
                  <td className="py-3.5 px-5">
                    <CellValue value={row.appleSidecar} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
