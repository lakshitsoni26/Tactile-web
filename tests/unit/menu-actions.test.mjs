import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

test("MENU ACTIONS & NAVIGATION AUDIT SUITE", async (t) => {
  const cmdMenu = fs.readFileSync("src/components/CommandMenu.tsx", "utf8");
  const waitlistModal = fs.readFileSync("src/components/WaitlistModal.tsx", "utf8");
  const navbar = fs.readFileSync("src/components/Navbar.tsx", "utf8");
  const comparison = fs.readFileSync("src/components/ComparisonMatrix.tsx", "utf8");
  const showcase = fs.readFileSync("src/components/DeviceShowcase.tsx", "utf8");

  await t.test("CommandMenu deferred scroll to avoid modal-lock cancellation", () => {
    assert.ok(cmdMenu.includes("window.__lenis.scrollTo"), "CommandMenu calls window.__lenis.scrollTo");
    assert.ok(cmdMenu.includes("setTimeout"), "CommandMenu defers scrolling with setTimeout to release lock");
    assert.ok(cmdMenu.includes("offset: -72"), "CommandMenu passes -72px navbar clearance offset");
  });

  await t.test("WaitlistModal dual-mode rendering for unregistered and registered users", () => {
    assert.ok(!waitlistModal.includes("if (!isOpen || !entry) return null;"), "WaitlistModal does NOT return null when entry is missing");
    assert.ok(waitlistModal.includes("activeEntry = entry || claimedEntry"), "WaitlistModal checks both props and claimed state");
    assert.ok(waitlistModal.includes("handleInstantClaim"), "WaitlistModal contains instant VIP registration form");
    assert.ok(waitlistModal.includes("handlePreviewDemo"), "WaitlistModal provides 1-click preview pass");
  });

  await t.test("ComparisonMatrix and anchor consistency", () => {
    assert.ok(comparison.includes('id="matrix"'), "ComparisonMatrix has #matrix anchor for command menu");
    assert.ok(comparison.includes('id="comparison"'), "ComparisonMatrix has #comparison anchor for navbar");
  });

  await t.test("Navbar mobile menu parity with desktop", () => {
    assert.ok(navbar.includes("Founder Manifesto"), "Navbar mobile menu has Founder Manifesto entry");
    assert.ok(navbar.includes("Command Menu"), "Navbar mobile menu has Command Menu entry");
  });

  await t.test("CommandMenu and DeviceShowcase simulator synchronization", () => {
    assert.ok(cmdMenu.includes('"tactile_simulator_command"'), "CommandMenu dispatches tactile_simulator_command");
    assert.ok(showcase.includes('"tactile_simulator_command"'), "DeviceShowcase listens to tactile_simulator_command");
    assert.ok(showcase.includes("setActiveCompanionMode"), "DeviceShowcase updates companion mode");
    assert.ok(showcase.includes("setActiveTab"), "DeviceShowcase updates active tab");
  });
});
