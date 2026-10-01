import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

test("MODAL SCROLL & CURSOR UX TEST SUITE", async (t) => {
  await t.test("useLenisLock Hook Contract", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/hooks/useLenisLock.ts"), "utf-8");
    assert.ok(file.includes("window.__lenis?.stop()"), "Must call lenis.stop() on first lock");
    assert.ok(file.includes("window.__lenis?.start()"), "Must call lenis.start() on release");
    assert.ok(file.includes("activeModalLocks"), "Must implement reference counting for nested dialogs");
    assert.ok(file.includes("document.body.style.overflow = \"hidden\""), "Must lock document body overflow");
  });

  await t.test("CommandMenu Modal Scroll & Cursor Safeguards", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/components/CommandMenu.tsx"), "utf-8");
    assert.ok(file.includes("useLenisLock(isOpen)"), "Must invoke useLenisLock with isOpen state");
    assert.ok(file.includes('data-lenis-prevent="true"'), "Must declare data-lenis-prevent on scroll containers");
    assert.ok(file.includes('data-no-cursor-snap="true"'), "Must prevent magnetic cursor snap inside menu");
    assert.ok(file.includes("e.stopPropagation()"), "Must stop wheel event propagation on listRef");
    assert.ok(file.includes("overscroll-contain"), "Must contain overscroll chaining");
  });

  await t.test("FounderManifesto Modal Scroll & Cursor Safeguards", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/components/FounderManifesto.tsx"), "utf-8");
    assert.ok(file.includes("useLenisLock(isOpen)"), "Must invoke useLenisLock with isOpen state");
    assert.ok(file.includes('data-lenis-prevent="true"'), "Must declare data-lenis-prevent on essay container");
    assert.ok(file.includes('data-no-cursor-snap="true"'), "Must declare data-no-cursor-snap on modal chassis");
    assert.ok(file.includes("e.stopPropagation()"), "Must stop wheel event propagation");
    assert.ok(file.includes("overscroll-contain"), "Must contain overscroll chaining");
  });

  await t.test("WaitlistModal Scroll & Cursor Safeguards", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/components/WaitlistModal.tsx"), "utf-8");
    assert.ok(file.includes("useLenisLock(isOpen)"), "Must invoke useLenisLock with isOpen state");
    assert.ok(file.includes('data-lenis-prevent="true"'), "Must declare data-lenis-prevent on overlay");
    assert.ok(file.includes('data-no-cursor-snap="true"'), "Must declare data-no-cursor-snap");
    assert.ok(file.includes("e.stopPropagation()"), "Must stop wheel event propagation");
  });

  await t.test("CustomCursor Geometric Gate & Text Caret Disarming", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/components/CustomCursor.tsx"), "utf-8");
    assert.ok(file.includes("input, textarea, select"), "Must inspect input and textarea elements");
    assert.ok(file.includes("isTextTarget"), "Must track text target state");
    assert.ok(file.includes("opacity-0"), "Must fade out follower ring over text inputs");
    assert.ok(file.includes("rect.width <= 180"), "Must gate magnetic snap to elements <= 180px width");
    assert.ok(file.includes("rect.height <= 60"), "Must gate magnetic snap to elements <= 60px height");
    assert.ok(file.includes("pullFactor = 0.28"), "Must apply vector pull physics instead of hard center-lock");
    assert.ok(file.includes("data-no-cursor-snap"), "Must respect data-no-cursor-snap to prevent morphs inside modals");
  });

  await t.test("globals.css Lenis Compatibility", () => {
    const file = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8");
    assert.ok(!file.includes("scroll-behavior: smooth;"), "Must remove conflicting native scroll-behavior smooth");
    assert.ok(file.includes(".lenis.lenis-smooth"), "Must define lenis-smooth class override");
    assert.ok(file.includes("scroll-behavior: auto !important;"), "Must force scroll-behavior: auto on Lenis container");
    assert.ok(file.includes("[data-lenis-prevent]"), "Must set overscroll-behavior: contain for data-lenis-prevent elements");
  });
});
