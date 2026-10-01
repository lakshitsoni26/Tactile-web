import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

test("TACTILE MASTER BRANDMARK AUDIT SUITE", async (t) => {
  const logoSrc = fs.readFileSync("src/components/TactileLogo.tsx", "utf8");
  const navbar = fs.readFileSync("src/components/Navbar.tsx", "utf8");
  const footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
  const manifesto = fs.readFileSync("src/components/FounderManifesto.tsx", "utf8");
  const cmdMenu = fs.readFileSync("src/components/CommandMenu.tsx", "utf8");
  const waitlist = fs.readFileSync("src/components/WaitlistModal.tsx", "utf8");
  const ogImage = fs.readFileSync("src/app/opengraph-image.tsx", "utf8");
  const icon = fs.readFileSync("src/app/icon.tsx", "utf8");
  const appleIcon = fs.readFileSync("src/app/apple-icon.tsx", "utf8");

  await t.test("TactileLogo exports required brand components", () => {
    assert.ok(logoSrc.includes("export function TactileMark"), "Exports TactileMark");
    assert.ok(logoSrc.includes("export default function TactileLogo"), "Exports TactileLogo");
    assert.ok(logoSrc.includes("export function TactileBrandLockup"), "Exports TactileBrandLockup");
    assert.ok(logoSrc.includes("#00F0FF"), "Includes electric cyan colorway");
    assert.ok(logoSrc.includes("#A855F7"), "Includes deep neon violet colorway");
  });

  await t.test("Navbar integrates TactileLogo", () => {
    assert.ok(navbar.includes("<TactileLogo"), "Navbar mounts TactileLogo");
    assert.ok(!navbar.includes('<Laptop className="w-3.5 h-3.5'), "Navbar eliminated old generic Laptop icon");
  });

  await t.test("Footer integrates TactileLogo", () => {
    assert.ok(footer.includes("<TactileLogo"), "Footer mounts TactileLogo");
    assert.ok(!footer.includes('<Laptop className="w-4 h-4'), "Footer eliminated old generic Laptop icon");
  });

  await t.test("FounderManifesto and CommandMenu integrate TactileMark", () => {
    assert.ok(manifesto.includes("<TactileMark"), "Manifesto uses illuminated TactileMark");
    assert.ok(cmdMenu.includes("<TactileMark"), "CommandMenu search bar displays TactileMark");
  });

  await t.test("Waitlist VIP Pass integrates TactileLogo", () => {
    assert.ok(waitlist.includes("<TactileLogo"), "VIP Pass features TactileLogo");
    assert.ok(!waitlist.includes("Cyber Contact Chip Graphic"), "Eliminated fake amber chip placeholder");
  });

  await t.test("OpenGraph Image and Dynamic App Icons generate brand mark", () => {
    assert.ok(ogImage.includes('rect x="5" y="6" width="22"'), "OG Image embeds vector geometry");
    assert.ok(icon.includes("new ImageResponse"), "icon.tsx returns dynamic ImageResponse");
    assert.ok(appleIcon.includes("new ImageResponse"), "apple-icon.tsx returns dynamic ImageResponse");
  });
});
