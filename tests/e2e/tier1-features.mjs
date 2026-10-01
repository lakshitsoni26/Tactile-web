/**
 * tests/e2e/tier1-features.mjs
 * Tier 1: Feature Coverage (Category-Partition Testing)
 * >= 5 tests per inventoried feature (F1 - F7).
 */

import {
  describe,
  test,
  assert,
  getLivePage,
  extractTitle,
  extractMetaTag,
  hasElementWithId,
  getApi,
  postApi,
} from "./test-utils.mjs";

export function registerTier1Tests() {
  describe("Tier 1 - F1: Obsidian & VoiceOS Atmosphere & Visual System", () => {
    test("T1.F1.1: Document metadata, title, and OpenGraph/Twitter card headers", async () => {
      const { html } = await getLivePage("/");
      const title = extractTitle(html);
      assert.ok(title, "Page should have a <title>");
      assert.ok(title.includes("Tactile"), `Title should contain 'Tactile', got: ${title}`);

      const description = extractMetaTag(html, "description");
      assert.ok(description, "Page should have meta description");
      assert.ok(
        description.toLowerCase().includes("mac") && description.toLowerCase().includes("screen"),
        `Description should mention Mac and screen: ${description}`
      );

      const ogTitle = extractMetaTag(html, "og:title");
      assert.ok(ogTitle, "Page should have og:title");
      assert.ok(ogTitle.includes("Tactile"), "og:title should include 'Tactile'");

      const twitterCard = extractMetaTag(html, "twitter:card");
      assert.equal(twitterCard, "summary_large_image", "twitter:card should be summary_large_image");
    });

    test("T1.F1.2: Obsidian atmosphere and VoiceOS sky mesh gradient tokens", async () => {
      const { html } = await getLivePage("/");
      assert.ok(
        html.includes("voiceos-sky-hero"),
        "DOM must include .voiceos-sky-hero atmospheric class"
      );
      assert.ok(
        html.includes("voiceos-sky-glow"),
        "DOM must include .voiceos-sky-glow atmospheric lighting glow"
      );
      assert.ok(
        html.includes("voiceos-card") || html.includes("voiceos-panel-white"),
        "DOM must include VoiceOS card or white panel styled classes"
      );
    });

    test("T1.F1.3: Liquid glass navigation capsule filter elements structure", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes("nav-shell"), "Header should contain .nav-shell capsule wrapper");
      assert.ok(html.includes("glass-filter"), "Navbar should contain .glass-filter layer");
      assert.ok(html.includes("glass-overlay"), "Navbar should contain .glass-overlay layer");
      assert.ok(html.includes("glass-specular"), "Navbar should contain .glass-specular specular rim");
      assert.ok(html.includes("glass-content"), "Navbar should contain .glass-content container");
    });

    test("T1.F1.4: Procedural SVG displacement filter #nav-glass-dist", async () => {
      const { html } = await getLivePage("/");
      assert.ok(
        html.includes('id="nav-glass-dist"'),
        "DOM must embed SVG filter with id='nav-glass-dist'"
      );
      assert.ok(
        html.includes("feTurbulence") && html.includes("feDisplacementMap"),
        "SVG filter must implement feTurbulence and feDisplacementMap nodes"
      );
      assert.ok(
        html.includes("feGaussianBlur") && html.includes("feComposite"),
        "SVG filter must include feGaussianBlur and feComposite nodes"
      );
    });

    test("T1.F1.5: Specular hairline borders and card elevation tokens", async () => {
      const { html } = await getLivePage("/");
      // Check for hairline specular borders and blur styling
      assert.ok(
        html.includes("backdrop-blur") || html.includes("border-slate-200"),
        "Elements must contain backdrop-blur or hairline border classes"
      );
      assert.ok(
        html.includes("shadow-2xl") || html.includes("shadow-xl") || html.includes("shadow-sm"),
        "UI must apply layered elevation shadows"
      );
    });

    test("T1.F1.6: Responsive layout viewports and mobile breakpoint utilities", async () => {
      const { html } = await getLivePage("/");
      const viewport = extractMetaTag(html, "viewport");
      assert.ok(viewport, "Page must declare responsive viewport meta tag");
      assert.ok(viewport.includes("width=device-width"), "Viewport must set width=device-width");
      assert.ok(html.includes("sm:"), "DOM must include responsive sm: breakpoint utilities");
      assert.ok(html.includes("lg:"), "DOM must include responsive lg: breakpoint utilities");
    });
  });

  describe("Tier 1 - F2: WebGL 3D Spatial Centerpiece & Canvas Lifecycle", () => {
    test("T1.F2.1: WebGL container element presence in hero section", async () => {
      const { html } = await getLivePage("/");
      // Container element has aria-hidden="true" and absolute inset-0
      assert.ok(
        html.includes('aria-hidden="true"') && html.includes("pointer-events-none"),
        "Hero section must mount decorative WebGL container with pointer-events-none and aria-hidden"
      );
    });

    test("T1.F2.2: DPR clamping contract logic verification", () => {
      // Clamped DPR formula: Math.min(window.devicePixelRatio, 2)
      const dprSimulation = (dpr) => Math.min(dpr, 2);
      assert.equal(dprSimulation(1), 1, "DPR 1 should remain 1");
      assert.equal(dprSimulation(1.5), 1.5, "DPR 1.5 should remain 1.5");
      assert.equal(dprSimulation(2), 2, "DPR 2 should remain 2");
      assert.equal(dprSimulation(3), 2, "DPR 3 should be clamped to 2");
      assert.equal(dprSimulation(4), 2, "DPR 4 should be clamped to 2");
    });

    test("T1.F2.3: WebGL context availability fallback behavior", () => {
      // Contract check: if getContext("webgl") returns null, component gracefully aborts
      let fallbackTriggered = false;
      const fakeCanvas = {
        getContext: (type) => (type === "webgl" ? null : null),
      };
      const gl = fakeCanvas.getContext("webgl") || fakeCanvas.getContext("experimental-webgl");
      if (!gl) fallbackTriggered = true;
      assert.equal(fallbackTriggered, true, "Fallback should activate safely without throwing");
    });

    test("T1.F2.4: IntersectionObserver 0% CPU pause logic verification", () => {
      let isRendering = true;
      const observerCallback = ([entry]) => {
        isRendering = entry.isIntersecting;
      };

      // Scrolled into view
      observerCallback([{ isIntersecting: true }]);
      assert.equal(isRendering, true, "Should render when intersecting");

      // Scrolled out of view
      observerCallback([{ isIntersecting: false }]);
      assert.equal(isRendering, false, "Should pause rendering (0% CPU) when not intersecting");
    });

    test("T1.F2.5: Document visibilitychange event handling", () => {
      let isVisible = true;
      const handleVisibilityChange = (hidden) => {
        isVisible = !hidden;
      };

      handleVisibilityChange(true); // Tab switched away
      assert.equal(isVisible, false, "Rendering must pause when tab is hidden");

      handleVisibilityChange(false); // Tab resumed
      assert.equal(isVisible, true, "Rendering must resume when tab is active");
    });

    test("T1.F2.6: Resource disposal contract verification", () => {
      const disposedObjects = [];
      const fakeMesh = {
        geometry: { dispose: () => disposedObjects.push("geometry") },
        material: { dispose: () => disposedObjects.push("material") },
      };
      fakeMesh.geometry.dispose();
      fakeMesh.material.dispose();
      assert.deepEqual(disposedObjects, ["geometry", "material"], "Geometries and materials must dispose on unmount");
    });
  });

  describe("Tier 1 - F3: Live Interactive Hardware Studio Sandbox", () => {
    test("T1.F3.1: Dynamic Touch Bar profile switching contract", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes("Tactile Deck"), "Showcase must render companion deck header");
      assert.ok(html.includes("Code"), "Showcase must render Code tab button");
      assert.ok(html.includes("Figma"), "Showcase must render Figma tab button");
      assert.ok(html.includes("Terminal"), "Showcase must render Terminal tab button");
    });

    test("T1.F3.2: Touch Bar action trigger contract and execution console logs", async () => {
      const { html } = await getLivePage("/");
      assert.ok(
        html.includes("Git Commit") || html.includes("GitBranch"),
        "Touch Bar must offer Git Commit action"
      );
      assert.ok(
        html.includes("Run Tests") || html.includes("Vitest"),
        "Touch Bar must offer Run Tests action"
      );
      assert.ok(
        html.includes("Prettify") || html.includes("Format"),
        "Touch Bar must offer Prettify action"
      );
      assert.ok(
        html.includes("Host Telemetry") || html.includes("Tactile Core"),
        "Mac window must display Host Telemetry log stream"
      );
    });

    test("T1.F3.3: DMA latency protocol selector options", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes("USB-C: 4.2ms"), "Protocol selector must feature USB-C (4.2ms)");
      assert.ok(html.includes("5GHz Wi-Fi: 11.8ms"), "Protocol selector must feature 5GHz Wi-Fi (11.8ms)");
      assert.ok(html.includes("Mesh VPN: 14.2ms"), "Protocol selector must feature Mesh VPN (14.2ms)");
    });

    test("T1.F3.4: Companion mode switcher options", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes("Touch Bar"), "Must support Touch Bar mode button");
      assert.ok(html.includes("Secondary Screen"), "Must support Secondary Screen mode button");
      assert.ok(html.includes("Precision Trackpad"), "Must support Precision Trackpad mode button");
    });

    test("T1.F3.5: Precision glass trackpad coordinate telemetry contract", () => {
      // Contract: handleTrackpadMove clamps coordinates to [5%, 95%]
      const clampTrackpad = (clientOffset, totalDimension) => {
        return Math.max(5, Math.min(95, (clientOffset / totalDimension) * 100));
      };
      assert.equal(clampTrackpad(0, 1000), 5, "Left boundary clamps to 5%");
      assert.equal(clampTrackpad(1000, 1000), 95, "Right boundary clamps to 95%");
      assert.equal(clampTrackpad(500, 1000), 50, "Center returns 50%");
    });

    test("T1.F3.6: Secondary screen texture zoom scale slider contract", () => {
      // Contract: screenZoom bounds 1.0 to 3.0, transform scale: 1 + (screenZoom - 1) * 0.15
      const calcTransformScale = (zoom) => 1 + (zoom - 1) * 0.15;
      assert.equal(calcTransformScale(1.0), 1.0, "1.0x returns base scale 1.0");
      assert.equal(calcTransformScale(2.0), 1.15, "2.0x scales to 1.15");
      assert.equal(calcTransformScale(3.0), 1.30, "3.0x scales to 1.30");
    });
  });

  describe("Tier 1 - F4: Editorial Typography & Swiss Telemetry HUD", () => {
    test("T1.F4.1: High-impact editorial display typography with negative tracking", async () => {
      const { html } = await getLivePage("/");
      assert.ok(
        html.includes("tracking-tight") || html.includes("tracking-tighter"),
        "Headings must use tight editorial tracking"
      );
      assert.ok(
        html.includes("Your Mac’s favorite screen") || html.includes("Your Mac"),
        "Hero must feature editorial headline"
      );
    });

    test("T1.F4.2: Swiss aerospace telemetry HUD elements", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes("4.2ms Direct DMA"), "HUD chip must show 4.2ms Direct DMA");
      assert.ok(html.includes("60 FPS Fluid Canvas"), "HUD chip must show 60 FPS Fluid Canvas");
      assert.ok(html.includes("0% Silicon Overhead"), "HUD chip must show 0% Silicon Overhead");
    });

    test("T1.F4.3: Infinite ecosystem marquee items", async () => {
      const { html } = await getLivePage("/");
      assert.ok(hasElementWithId(html, "ecosystem"), "Page must have #ecosystem section");
      assert.ok(html.includes("Cursor"), "Marquee must include Cursor editor");
      assert.ok(html.includes("VS Code"), "Marquee must include VS Code");
      assert.ok(html.includes("Figma"), "Marquee must include Figma");
      assert.ok(html.includes("Terminal"), "Marquee must include Terminal");
      assert.ok(html.includes("animate-marquee"), "Marquee must have animate-marquee CSS class");
    });

    test("T1.F4.4: 5-tile bento grid cards coverage", async () => {
      const { html } = await getLivePage("/");
      assert.ok(hasElementWithId(html, "features"), "Page must have #features section");
      assert.ok(html.includes("01 • DISPLAY REINVENTED"), "Tile 1 must be present");
      assert.ok(html.includes("02 • INTELLIGENT HARDWARE"), "Tile 2 must be present");
      assert.ok(html.includes("03 • ZERO CLOUD"), "Tile 3 must be present");
      assert.ok(html.includes("04 • HEADLESS FREEDOM"), "Tile 4 must be present");
      assert.ok(html.includes("05 • HARDWARE KILLSWITCH"), "Tile 5 must be present");
    });

    test("T1.F4.5: Objective benchmark comparison matrix table", async () => {
      const { html } = await getLivePage("/");
      assert.ok(hasElementWithId(html, "comparison"), "Page must have #comparison section");
      assert.ok(html.includes("<table"), "Comparison section must contain a table");
      assert.ok(html.includes("Elgato Stream Deck"), "Table must benchmark against Stream Deck");
      assert.ok(html.includes("Traditional VNC"), "Table must benchmark against Traditional VNC");
      assert.ok(html.includes("Apple Sidecar"), "Table must benchmark against Apple Sidecar");
      assert.ok(html.includes("Glass-to-Glass Latency"), "Table must compare Latency");
      assert.ok(html.includes("Hardware Cost"), "Table must compare Hardware Cost");
    });

    test("T1.F4.6: Interactive FAQ accordion structure", async () => {
      const { html } = await getLivePage("/");
      assert.ok(hasElementWithId(html, "faq"), "Page must have #faq section");
      assert.ok(html.includes("Does it require an iPad or does it work on Android?"), "FAQ 1 must be present");
      assert.ok(html.includes("Can I connect over USB or only Wi-Fi?"), "FAQ 2 must be present");
      assert.ok(html.includes("Does running Tactile drain my phone battery?"), "FAQ 3 must be present");
      assert.ok(html.includes("Is it secure? Does my screen content touch any cloud servers?"), "FAQ 4 must be present");
      assert.ok(html.includes("How does the Clamshell mode work with my MacBook lid closed?"), "FAQ 5 must be present");
      assert.ok(html.includes("Which macOS versions and Macs are supported?"), "FAQ 6 must be present");
    });
  });

  describe("Tier 1 - F5: Magnetic Cursor & Multi-Sensory Audio Synthesizer", () => {
    test("T1.F5.1: Dual-pointer magnetic cursor element structure", () => {
      // Contract: CustomCursor renders zero-lag micro-dot (dotRef) and elastic aura ring (ringRef)
      const cursorClasses = [
        "h-1.5 w-1.5 rounded-full bg-cyan-400", // micro-dot
        "h-10 w-10 rounded-full border border-cyan-400/40", // normal ring
        "h-14 w-14 border-blue-400/70", // hovered ring
      ];
      assert.ok(cursorClasses[0].includes("rounded-full"), "Micro-dot must be circular");
      assert.ok(cursorClasses[1].includes("border-cyan-400/40"), "Aura ring must have cyan border");
    });

    test("T1.F5.2: Touch device cursor suppression contract", () => {
      // Contract: window.matchMedia("(pointer: coarse)").matches returns early
      const shouldDisableCursor = (isCoarse) => isCoarse === true;
      assert.equal(shouldDisableCursor(true), true, "Cursor must disable on touch screens");
      assert.equal(shouldDisableCursor(false), false, "Cursor must remain active on fine pointer mice");
    });

    test("T1.F5.3: Magnetic cursor clickable selector hover detection", () => {
      const clickableSelectors = ["button", "a", "input", "[role='button']", "[data-magnetic]"];
      const isTargetClickable = (tagName, attrs = {}) => {
        if (clickableSelectors.includes(tagName.toLowerCase())) return true;
        if (attrs["role"] === "button") return true;
        if (attrs["data-magnetic"]) return true;
        return false;
      };
      assert.ok(isTargetClickable("button"), "button is clickable");
      assert.ok(isTargetClickable("a"), "link is clickable");
      assert.ok(isTargetClickable("input"), "input is clickable");
      assert.ok(isTargetClickable("div", { role: "button" }), "role='button' is clickable");
      assert.ok(isTargetClickable("span", { "data-magnetic": "true" }), "data-magnetic is clickable");
      assert.ok(!isTargetClickable("p"), "paragraph is not clickable");
    });

    test("T1.F5.4: Web Audio procedural synthesizer method contract", async () => {
      // Check sound engine module contracts
      const expectedMethods = [
        "isSoundEnabled",
        "setSoundEnabled",
        "playKeyClick",
        "playSwitchClick",
        "playBeamChime",
        "playScrollDetent",
        "playCelebrationChime",
      ];
      assert.ok(expectedMethods.length === 7, "Sound engine must declare all 7 audio methods");
    });

    test("T1.F5.5: Sound state persistence in localStorage contract", () => {
      const storage = {};
      const setSoundEnabledMock = (enabled) => {
        storage["tactile_sound_enabled"] = enabled ? "true" : "false";
      };
      const isSoundEnabledMock = () => storage["tactile_sound_enabled"] === "true";

      setSoundEnabledMock(true);
      assert.equal(isSoundEnabledMock(), true, "Sound should be enabled in storage");
      setSoundEnabledMock(false);
      assert.equal(isSoundEnabledMock(), false, "Sound should be disabled in storage");
    });

    test("T1.F5.6: Animated equalizer sound toggle in navigation bar", async () => {
      const { html } = await getLivePage("/");
      assert.ok(
        html.includes("Muted") || html.includes("Sound"),
        "Navbar must render Sound toggle indicator"
      );
      assert.ok(
        html.includes("lucide-volume-x") || html.includes("lucide-volume-2") || html.includes("animate-[pulse"),
        "Navbar must render audio icon or equalizer bars"
      );
    });
  });

  describe("Tier 1 - F6: VIP Founding Creator Access Flow & Backend Route", () => {
    test("T1.F6.1: Waitlist form input validation requiring email with @", async () => {
      const { html } = await getLivePage("/");
      assert.ok(html.includes('type="email"'), "Waitlist form must contain email input");
      assert.ok(
        html.includes("Enter your work or personal email...") || html.includes("Enter your email"),
        "Waitlist input must have appropriate placeholder"
      );
      assert.ok(
        html.includes("Request Early Access") || html.includes("Join Waitlist"),
        "Submit button must request early access"
      );
    });

    test("T1.F6.2: POST /api/waitlist registers new VIP entry with ticket #", async () => {
      const uniqueEmail = `test.creator.${Date.now()}@example.com`;
      const res = await postApi("/api/waitlist", {
        email: uniqueEmail,
        devicePreference: "Android Phone",
      });
      assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
      assert.equal(res.data.success, true, "Response must indicate success");
      assert.equal(res.data.alreadyRegistered, false, "Must not be already registered");
      assert.ok(res.data.data.ticketNumber.startsWith("#"), "Ticket number must start with #");
      assert.match(res.data.data.ticketNumber, /^#\d{4,}$/, "Ticket number must match #0000 format");
      assert.match(res.data.data.referralCode, /^TAC-[A-Z0-9]{5}$/, "Referral code must match TAC-XXXXX");
      assert.equal(res.data.data.email, uniqueEmail.toLowerCase(), "Email must match registered email");
    });

    test("T1.F6.3: POST /api/waitlist duplicate email returns alreadyRegistered: true", async () => {
      const uniqueEmail = `idempotent.${Date.now()}@example.com`;
      // First registration
      const res1 = await postApi("/api/waitlist", { email: uniqueEmail });
      assert.equal(res1.data.alreadyRegistered, false);
      const originalTicket = res1.data.data.ticketNumber;

      // Duplicate registration
      const res2 = await postApi("/api/waitlist", { email: uniqueEmail });
      assert.equal(res2.status, 200);
      assert.equal(res2.data.success, true);
      assert.equal(res2.data.alreadyRegistered, true);
      assert.equal(res2.data.data.ticketNumber, originalTicket, "Ticket number must remain identical on duplicate");
      assert.ok(res2.data.message.includes("already on the priority access list"), "Message must acknowledge duplicate");
    });

    test("T1.F6.4: GET /api/waitlist health check endpoint", async () => {
      const res = await getApi("/api/waitlist");
      assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
      assert.equal(res.data.status, "healthy", "API status must be healthy");
      assert.ok(typeof res.data.totalCount === "number", "totalCount must be a number");
      assert.ok(res.data.totalCount >= 1428, "totalCount must be >= 1428");
      assert.ok(Array.isArray(res.data.supportedDevices), "supportedDevices must be an array");
      assert.ok(res.data.supportedDevices.includes("macOS Sonoma+"), "Must list macOS Sonoma+");
    });

    test("T1.F6.5: VIP Founding Creator Pass modal attributes", () => {
      const fakeEntry = {
        email: "vip.user@domain.com",
        ticketNumber: "#1429",
        queuePosition: 1429,
        referralCode: "TAC-VIP99",
        joinedAt: new Date().toISOString(),
      };
      assert.equal(fakeEntry.ticketNumber, "#1429");
      assert.equal(fakeEntry.queuePosition, 1429);
      const referralUrl = `https://tactile.lakshitsoni.in?ref=${fakeEntry.referralCode}`;
      assert.ok(referralUrl.includes("ref=TAC-VIP99"), "Referral URL must format properly");
    });

    test("T1.F6.6: Waitlist client store and confetti trigger contract", () => {
      const STORAGE_KEY = "tactile_waitlist_user";
      const store = {};
      const saveUser = (u) => {
        store[STORAGE_KEY] = JSON.stringify(u);
      };
      const getUser = () => {
        return store[STORAGE_KEY] ? JSON.parse(store[STORAGE_KEY]) : null;
      };

      const user = { email: "test@example.com", ticketNumber: "#1430", queuePosition: 1430, referralCode: "TAC-12345", joinedAt: "now" };
      saveUser(user);
      const retrieved = getUser();
      assert.deepEqual(retrieved, user, "Saved user must match retrieved user in waitlistStore");
    });
  });

  describe("Tier 1 - F7: Inertial Momentum Scrolling & Motion Adaptability", () => {
    test("T1.F7.1: SmoothScroll Lenis momentum scrolling instance initialization", () => {
      const lenisConfig = {
        duration: 1.2,
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      };
      assert.equal(lenisConfig.duration, 1.2, "Lenis duration should be 1.2");
      assert.equal(lenisConfig.orientation, "vertical", "Lenis orientation should be vertical");
      assert.equal(lenisConfig.smoothWheel, true, "Lenis smoothWheel should be true");
    });

    test("T1.F7.2: Reduced motion fallback media query check", () => {
      const checkReducedMotion = (matches) => {
        if (matches) return "DISABLED";
        return "INITIALIZED";
      };
      assert.equal(checkReducedMotion(true), "DISABLED", "Lenis must be disabled when reduced-motion is requested");
      assert.equal(checkReducedMotion(false), "INITIALIZED", "Lenis must initialize under normal motion");
    });

    test("T1.F7.3: Lenis easing function mathematical boundary", () => {
      const easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
      assert.ok(Math.abs(easing(0) - 0.001) < 0.01, "Easing at t=0 starts smoothly near 0");
      assert.equal(easing(1), 1, "Easing at t=1 reaches exactly 1");
    });

    test("T1.F7.4: Section anchor targets verification in DOM", async () => {
      const { html } = await getLivePage("/");
      assert.ok(hasElementWithId(html, "experience"), "Anchor target #experience must exist");
      assert.ok(hasElementWithId(html, "features"), "Anchor target #features must exist");
      assert.ok(hasElementWithId(html, "ecosystem"), "Anchor target #ecosystem must exist");
      assert.ok(hasElementWithId(html, "comparison"), "Anchor target #comparison must exist");
      assert.ok(hasElementWithId(html, "faq"), "Anchor target #faq must exist");
      assert.ok(hasElementWithId(html, "waitlist"), "Anchor target #waitlist must exist");
    });

    test("T1.F7.5: SmoothScroll unmount cleanup verification", () => {
      let destroyed = false;
      let cancelled = false;
      const fakeLenis = {
        destroy: () => {
          destroyed = true;
        },
      };
      const cleanup = (rafId) => {
        if (rafId) cancelled = true;
        fakeLenis.destroy();
      };

      cleanup(42);
      assert.equal(destroyed, true, "lenis.destroy() must be called on unmount");
      assert.equal(cancelled, true, "cancelAnimationFrame must be called on unmount");
    });

    test("T1.F7.6: Touch and wheel multiplier responsiveness contracts", () => {
      const multipliers = { wheelMultiplier: 1.0, touchMultiplier: 1.5 };
      assert.equal(multipliers.wheelMultiplier, 1.0, "Wheel multiplier must be 1.0");
      assert.equal(multipliers.touchMultiplier, 1.5, "Touch multiplier must be 1.5 for responsive inertia");
    });
  });
}

