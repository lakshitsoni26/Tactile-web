"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DualDeviceDemo from "@/components/DualDeviceDemo";
import WorkflowPillars from "@/components/WorkflowPillars";
import SurfacesShowcase from "@/components/SurfacesShowcase";
import AppEcosystemGrid from "@/components/AppEcosystemGrid";
import MultiDeviceStage from "@/components/MultiDeviceStage";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";
import SmoothScroll from "@/components/SmoothScroll";
import { getStoredWaitlistUser, isValidWaitlistEntry, type WaitlistEntry } from "@/lib/waitlistStore";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<WaitlistEntry | null>(() =>
    getStoredWaitlistUser()
  );

  // Sync waitlist user from storage events
  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredWaitlistUser();
      setCurrentUser(isValidWaitlistEntry(stored) ? stored : null);
    };
    window.addEventListener("tactile_waitlist_updated", handleUpdate);
    return () => window.removeEventListener("tactile_waitlist_updated", handleUpdate);
  }, []);

  const handleWaitlistSuccess = (entry: WaitlistEntry) => {
    setCurrentUser(entry);
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    const stored = getStoredWaitlistUser();
    setCurrentUser(isValidWaitlistEntry(stored) ? stored : null);
    setModalOpen(true);
  };

  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-[#FAFAFA] text-[#111111] overflow-x-hidden">
        {/* Minimal Floating Capsule Navigation — Resurf 1:1 masked progressive blur */}
        <Navbar onOpenWaitlist={() => handleOpenModal()} />

        {/* Section 01: Hero Section */}
        <div id="hero">
          <HeroSection
            onSuccessWaitlist={handleWaitlistSuccess}
            onOpenWaitlist={() => handleOpenModal()}
          />
        </div>

        {/* Section 02: Hero Interface Preview — Primary Interactive Workstation Stage */}
        <section
          id="experience"
          className="relative pt-2 pb-24 px-4 sm:px-6 lg:px-8 scroll-mt-24"
          aria-label="Interactive product demo"
        >
          <div className="max-w-6xl mx-auto">
            {/* Stage Control Eyebrow Bar — Seamless bridge connecting hero value proposition directly to workstation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 px-2">
              <div className="inline-flex items-center gap-2 text-[13px] text-[#52525B] font-medium select-none">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                <span className="font-semibold text-[#18181B]">Live Dual-Device Sandbox</span>
                <span className="text-black/20">·</span>
                <span className="hidden sm:inline text-[#71717A]">
                  Tap any phone macro or swipe trackpad to test real-time Mac reaction
                </span>
              </div>

              <div className="inline-flex items-center gap-3 text-[11.5px] font-mono text-[#71717A] select-none">
                <span className="px-2.5 py-0.5 rounded-md bg-[#F4F4F5] border border-black/[0.05]">
                  Bus: USB-C Bulk (1000Hz)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#F4F4F5] border border-black/[0.05] hidden md:inline">
                  P2P Wi-Fi: Ready
                </span>
              </div>
            </div>

            {/* Resurf 1:1 Light Floating Showcase Frame — Multi-tier shadow, NO dark void */}
            <div className="relative w-full overflow-hidden rounded-2xl ring-[0.5px] ring-black/10 bg-white/80 backdrop-blur-md resurf-window-shadow p-3 sm:p-6 border border-black/[0.06]">
              <DualDeviceDemo />
            </div>
          </div>
        </section>

        {/* Section 03: 12-Card Feature Deck ("A companion that gets more useful every time you work") */}
        <div id="capabilities">
          <WorkflowPillars />
        </div>

        {/* Section 04: Second Interactive Showcase ("Four surfaces, one companion") */}
        <SurfacesShowcase />

        {/* Section 05: Ecosystem Deck ("Control every Mac workflow") */}
        <AppEcosystemGrid />

        {/* Section 06: Multi-Device Hardware Cluster ("Native on every screen") */}
        <MultiDeviceStage />

        {/* Section 07: Final 1-Button Download CTA */}
        <FinalCtaSection
          onSuccessWaitlist={handleWaitlistSuccess}
          onOpenWaitlist={() => handleOpenModal()}
        />

        {/* Section 08: Minimalist Footer with Lakshit Cursive Signature */}
        <Footer />

        {/* Waitlist Modal */}
        <WaitlistModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          entry={currentUser}
          onSuccess={(entry) => setCurrentUser(entry)}
          onReset={() => setCurrentUser(null)}
        />
      </main>
    </SmoothScroll>
  );
}
