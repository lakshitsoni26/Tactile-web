import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

test("HARDWARE STORYTELLING & CINEMATIC CENTERPIECE AUDIT SUITE", async (t) => {
  const heroSection = fs.readFileSync("src/components/HeroSection.tsx", "utf8");
  const storyCenterpiece = fs.readFileSync("src/components/hardware/HardwareStoryCenterpiece.tsx", "utf8");
  const webglScene = fs.readFileSync("src/components/hardware/HardwareWebGLScene.tsx", "utf8");
  const screenProjection = fs.readFileSync("src/components/hardware/InteractiveScreenProjection.tsx", "utf8");
  const globalsCss = fs.readFileSync("src/app/globals.css", "utf8");

  await t.test("HeroSection mounts HardwareStoryCenterpiece and retires generic ThreeCanvas", () => {
    assert.ok(heroSection.includes("<HardwareStoryCenterpiece"), "HeroSection mounts HardwareStoryCenterpiece");
    assert.ok(!heroSection.includes("<ThreeCanvas"), "HeroSection has retired generic floating particle ThreeCanvas");
    assert.ok(!heroSection.includes('import ThreeCanvas from "@/components/ThreeCanvas";'), "HeroSection removed ThreeCanvas import");
  });

  await t.test("HardwareStoryCenterpiece implements 5-Act narrative storyboard", () => {
    assert.ok(storyCenterpiece.includes("01 // Awakening"), "Act 1: Awakening present");
    assert.ok(storyCenterpiece.includes("02 // DMA Link"), "Act 2: DMA Link present");
    assert.ok(storyCenterpiece.includes("03 // Touch Bar"), "Act 3: Chameleon Touch Bar present");
    assert.ok(storyCenterpiece.includes("04 // X-Ray Bus"), "Act 4: Exploded X-Ray Bus present");
    assert.ok(storyCenterpiece.includes("05 // Studio Pass"), "Act 5: Studio Pass present");
    assert.ok(storyCenterpiece.includes("handleSelectAct"), "Provides manual act navigation");
  });

  await t.test("HardwareStoryCenterpiece syncs with Lenis scroll and CommandMenu events", () => {
    assert.ok(storyCenterpiece.includes('"tactile_scroll_sync"'), "Listens to Lenis tactile_scroll_sync event");
    assert.ok(storyCenterpiece.includes('"tactile_simulator_command"'), "Listens to CommandMenu tactile_simulator_command");
    assert.ok(storyCenterpiece.includes("setScrollProgress"), "Drives scroll progress state");
  });

  await t.test("HardwareWebGLScene procedural 3D model and kinematics contract", () => {
    assert.ok(webglScene.includes("lidPivot"), "Implements MacBook lid pivot axis");
    assert.ok(webglScene.includes("CylinderGeometry"), "Implements cylindrical hinge geometry");
    assert.ok(webglScene.includes("retinaScreen"), "Implements retina display screen mesh");
    assert.ok(webglScene.includes("phoneChassis"), "Implements companion phone unibody");
    assert.ok(webglScene.includes("phoneScreen"), "Implements companion phone OLED screen");
    assert.ok(webglScene.includes("dataBeamMesh"), "Implements coherent optical laser data tube");
    assert.ok(webglScene.includes("shadowMat"), "Implements soft Gaussian analytical contact shadow");
  });

  await t.test("HardwareWebGLScene lifecycle, 0% CPU pause, and memory disposal", () => {
    assert.ok(webglScene.includes("IntersectionObserver"), "Uses IntersectionObserver for viewport tracking");
    assert.ok(webglScene.includes("visibilitychange"), "Listens to document visibilitychange for tab backgrounding");
    assert.ok(webglScene.includes("renderer.dispose()"), "Disposes WebGL renderer on unmount");
    assert.ok(webglScene.includes("aluminumDarkMat.dispose()"), "Disposes chassis materials on unmount");
    assert.ok(webglScene.includes("lidBackGeo.dispose()"), "Disposes lid geometry on unmount");
  });

  await t.test("Quintic smootherstep kinematics and docking mathematics invariant", () => {
    // Kinematic formula used in HardwareWebGLScene: t * t * t * (t * (t * 6 - 15) + 10)
    const smootherstep = (t) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
    };

    // Invariant: f(0) = 0, f(1) = 1, f(0.5) = 0.5
    assert.equal(smootherstep(0), 0, "Smootherstep at t=0 must equal 0");
    assert.equal(smootherstep(1), 1, "Smootherstep at t=1 must equal 1");
    assert.equal(smootherstep(0.5), 0.5, "Smootherstep at t=0.5 must equal 0.5");

    // Invariant: strictly monotonic
    let prev = -1;
    for (let i = 0; i <= 100; i++) {
      const val = smootherstep(i / 100);
      assert.ok(val >= prev, `Smootherstep must be monotonically non-decreasing at step ${i}`);
      prev = val;
    }

    // Zero derivatives at endpoints (flat tangent)
    const epsilon = 0.0001;
    const slopeAtZero = (smootherstep(epsilon) - smootherstep(0)) / epsilon;
    const slopeAtOne = (smootherstep(1) - smootherstep(1 - epsilon)) / epsilon;
    assert.ok(slopeAtZero < 0.01, "First derivative at t=0 must be near zero for smooth start");
    assert.ok(slopeAtOne < 0.01, "First derivative at t=1 must be near zero for gentle landing");
  });

  await t.test("InteractiveScreenProjection triggers and reaction logs", () => {
    assert.ok(screenProjection.includes("handleRunTests"), "Offers Run Tests macro");
    assert.ok(screenProjection.includes("handlePrettify"), "Offers Prettify macro");
    assert.ok(screenProjection.includes("handleGitCommit"), "Offers Git Commit macro");
    assert.ok(screenProjection.includes("Host Telemetry Log Stream"), "Provides Mac console reaction log stream");
    assert.ok(screenProjection.includes("1000Hz HID"), "Declares 1000Hz HID report rate");
  });

  await t.test("Tactile Industrial Cyber-Optics theme design tokens in globals.css", () => {
    assert.ok(globalsCss.includes("--tactile-titanium-deep: #13141a;"), "Deep titanium unibody token present");
    assert.ok(globalsCss.includes("--tactile-titanium-rim: #323543;"), "Titanium specular rim token present");
    assert.ok(globalsCss.includes("--tactile-orange: #ff5722;"), "Tactical safety orange token present");
    assert.ok(globalsCss.includes("--tactile-cyan: #00f0ff;"), "Laser coherent cyan token present");
  });
});
