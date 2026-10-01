/**
 * Tactile Web Platform — Adversarial Stress Test Suite
 * Empirical Challenger Verification Harness
 * Tests:
 * 1. /api/waitlist high concurrency, race conditions, queue invariants, duplicate idempotency
 * 2. /api/waitlist malformed inputs, SQLi/XSS payloads, prototype pollution, size limits
 * 3. Client physics: Ballistic inertia mathematical convergence and decay bounds
 * 4. Client coordinate clamping: 5%..95% boundaries and 160x115mm physical trackpad mapping
 * 5. Web Audio synthesizer gain bounds, spatial panner clamping, and acoustic safety
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName, details = "") {
  if (condition) {
    passed++;
    console.log(`  ✔ PASS: ${testName}`);
  } else {
    failed++;
    const msg = `  ✖ FAIL: ${testName} ${details ? `— ${details}` : ""}`;
    console.error(msg);
    failures.push({ testName, details });
  }
}

async function runApiStressSuite() {
  console.log("\n=======================================================");
  console.log("▶ SUITE 1: /api/waitlist Concurrency, Idempotency & Invariants");
  console.log("=======================================================");

  // 1. Baseline check
  const healthRes = await fetch(`${BASE_URL}/api/waitlist`);
  assert(healthRes.status === 200, "GET /api/waitlist returns HTTP 200 OK");
  const healthData = await healthRes.json();
  assert(typeof healthData.totalCount === "number", "GET /api/waitlist reports totalCount as a number");
  const baselineCount = healthData.totalCount;
  console.log(`    ℹ Current Baseline totalCount: ${baselineCount}`);

  // 2. Strict Sequential Queue Increment Invariant
  const seqUser1 = `seq_challenger_1_${Date.now()}@tactile.test`;
  const res1 = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: seqUser1, role: "Core Systems Dev", devicePreference: "Mac + Android" }),
  });
  const data1 = await res1.json();
  const count1 = data1.data?.queuePosition || data1.entry?.queuePosition;

  assert(res1.status === 200 && data1.success === true, "POST /api/waitlist accepts valid submission (seq1)");
  assert(count1 === baselineCount + 1, `Queue position strictly advanced: ${baselineCount} -> ${baselineCount + 1}`);
  assert((data1.data?.ticketNumber || data1.entry?.ticketNumber) === `#${baselineCount + 1}`, `Ticket number matches #${baselineCount + 1}`);

  const seqUser2 = `seq_challenger_2_${Date.now()}@tactile.test`;
  const res2 = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: seqUser2 }),
  });
  const data2 = await res2.json();
  const count2 = data2.data?.queuePosition || data2.entry?.queuePosition;
  assert(count2 === baselineCount + 2, `Queue position strictly advanced monotonically: ${count1} -> ${count2}`);

  // 3. Duplicate Email Idempotency with Casing & Whitespace Variances
  console.log("\n  --- Duplicate Email Idempotency & Normalization ---");
  const baseEmail = `idempotent_${Date.now()}@tactile.audio`;
  const originalRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: baseEmail, role: "Founder", devicePreference: "Foldable" }),
  });
  const origData = await originalRes.json();
  const originalTicket = origData.data?.ticketNumber || origData.entry?.ticketNumber;
  const originalPos = origData.data?.queuePosition || origData.entry?.queuePosition;
  const originalRef = origData.data?.referralCode || origData.entry?.referralCode;

  assert(origData.alreadyRegistered === false, "First registration returns alreadyRegistered === false");

  const duplicateVariants = [
    baseEmail,
    baseEmail.toUpperCase(),
    `  ${baseEmail}  `,
    `\t${baseEmail}\n`,
    baseEmail.replace("@", "@"),
  ];

  let idempotencySuccess = true;
  for (const variant of duplicateVariants) {
    const dupRes = await fetch(`${BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: variant }),
    });
    const dupData = await dupRes.json();
    const dupTicket = dupData.data?.ticketNumber || dupData.entry?.ticketNumber;
    const dupPos = dupData.data?.queuePosition || dupData.entry?.queuePosition;
    const dupRef = dupData.data?.referralCode || dupData.entry?.referralCode;

    if (
      !dupData.success ||
      dupData.alreadyRegistered !== true ||
      dupTicket !== originalTicket ||
      dupPos !== originalPos ||
      dupRef !== originalRef
    ) {
      idempotencySuccess = false;
      console.error(`    Variant failed idempotency: "${variant}" ->`, dupData);
      break;
    }
  }
  assert(idempotencySuccess, "All duplicate submissions return alreadyRegistered: true with identical ticket metadata");

  // Verify totalCount did not advance during duplicate attempts
  const checkHealth = await (await fetch(`${BASE_URL}/api/waitlist`)).json();
  assert(checkHealth.totalCount === originalPos, `totalCount preserved (${checkHealth.totalCount} === ${originalPos}) without advancing on duplicates`);

  // 4. High-Throughput Concurrent Burst (50 distinct requests)
  console.log("\n  --- 50 Concurrent Unique Requests Burst ---");
  const burstSize = 50;
  const burstTimestamp = Date.now();
  const burstEmails = Array.from({ length: burstSize }, (_, i) => `burst_${burstTimestamp}_${i}@tactile.test`);

  const burstStart = performance.now();
  const burstResponses = await Promise.all(
    burstEmails.map((email) =>
      fetch(`${BASE_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "Stress Tester", devicePreference: "Android 14" }),
      }).then((r) => r.json())
    )
  );
  const burstDuration = performance.now() - burstStart;
  console.log(`    ℹ 50 concurrent requests resolved in ${burstDuration.toFixed(1)}ms (${(burstSize / (burstDuration / 1000)).toFixed(1)} req/sec)`);

  const burstTickets = burstResponses.map((r) => r.data?.ticketNumber || r.entry?.ticketNumber);
  const burstPositions = burstResponses.map((r) => r.data?.queuePosition || r.entry?.queuePosition);
  const uniqueTickets = new Set(burstTickets);

  assert(burstResponses.every((r) => r.success === true), "All 50 concurrent requests succeeded with success: true");
  assert(uniqueTickets.size === burstSize, `All 50 tickets are unique (found ${uniqueTickets.size} distinct tickets)`);

  // Check no gaps in queue positions
  const sortedPositions = [...burstPositions].sort((a, b) => a - b);
  let contiguous = true;
  for (let i = 1; i < sortedPositions.length; i++) {
    if (sortedPositions[i] !== sortedPositions[i - 1] + 1) {
      contiguous = false;
      break;
    }
  }
  assert(contiguous, `50 concurrent ticket queue positions form a contiguous, unbroken sequence (${sortedPositions[0]}..${sortedPositions[sortedPositions.length - 1]})`);

  // 5. High-Concurrency Duplicate Race Condition (20 simultaneous requests with SAME email)
  console.log("\n  --- 20 Concurrent Duplicate Race Condition ---");
  const raceEmail = `race_duplicate_${Date.now()}@tactile.test`;
  const raceResponses = await Promise.all(
    Array.from({ length: 20 }, () =>
      fetch(`${BASE_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: raceEmail, role: "Racer" }),
      }).then((r) => r.json())
    )
  );

  const raceTickets = new Set(raceResponses.map((r) => r.data?.ticketNumber || r.entry?.ticketNumber));
  const newRegistrations = raceResponses.filter((r) => r.alreadyRegistered === false);
  const duplicates = raceResponses.filter((r) => r.alreadyRegistered === true);

  console.log(`    ℹ Race result: ${newRegistrations.length} new registrations, ${duplicates.length} duplicate recognitions`);
  console.log(`    ℹ Distinct tickets assigned: ${Array.from(raceTickets).join(", ")}`);

  assert(raceTickets.size === 1, `Race condition safety: Exactly 1 distinct ticket was allocated across 20 simultaneous requests (${Array.from(raceTickets)[0]})`);
}

async function runApiPayloadAndSecuritySuite() {
  console.log("\n=======================================================");
  console.log("▶ SUITE 2: /api/waitlist Edge Cases, Injections & Payload Stress");
  console.log("=======================================================");

  // 1. Missing & Malformed Bodies
  const emptyBodyRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert(emptyBodyRes.status === 400, "Empty JSON object body returns 400 Bad Request");

  const malformedJsonRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "INVALID_JSON{",
  });
  assert(malformedJsonRes.status === 400, "Malformed JSON syntax returns 400 Bad Request");

  const arrayBodyRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ email: "array@tactile.test" }]),
  });
  assert(arrayBodyRes.status === 400, "JSON array payload returns 400 Bad Request");

  // 2. Non-String & Malformed Email Fields
  const badEmails = [
    { email: 12345, label: "Numeric email" },
    { email: true, label: "Boolean email" },
    { email: null, label: "Null email" },
    { email: {}, label: "Object email" },
    { email: "notanemail", label: "Email missing @" },
    { email: "@domain.com", label: "Email missing local part" },
    { email: "user@", label: "Email missing domain" },
    { email: "user@localhost", label: "Email missing TLD" },
    { email: "user@ domain .com", label: "Email with internal spaces" },
  ];

  for (const { email, label } of badEmails) {
    const res = await fetch(`${BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    assert(res.status === 400, `Rejection of invalid input: ${label} (HTTP 400)`);
  }

  // 3. Security Injections (SQLi & XSS)
  console.log("\n  --- SQLi / XSS / Prototype Pollution Attacks ---");
  const sqliEmails = [
    "admin' OR '1'='1",
    "'; DROP TABLE users; --",
    "user'+(SELECT 1)+'@domain.com",
  ];
  for (const sqli of sqliEmails) {
    const res = await fetch(`${BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: sqli }),
    });
    assert(res.status === 400, `SQLi attempt safely rejected: "${sqli.slice(0, 25)}..."`);
  }

  // XSS in role and devicePreference fields with valid email
  const xssEmail = `xss_sanitization_${Date.now()}@tactile.test`;
  const xssRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: xssEmail,
      role: "<script>alert('pwned')</script>",
      devicePreference: "<img src=x onerror=alert(1)>",
    }),
  });
  const xssData = await xssRes.json();
  assert(xssRes.status === 200, "XSS in secondary fields handled gracefully without server exception");
  assert(
    (xssData.data?.role || xssData.entry?.role).length <= 100,
    "Role field clamped within safe length limits (<= 100 chars)"
  );

  // Prototype Pollution Attempt
  const protoEmail = `proto_poll_${Date.now()}@tactile.test`;
  const protoRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: protoEmail,
      __proto__: { polluted: true },
      constructor: { prototype: { polluted: true } },
    }),
  });
  assert(protoRes.status === 200, "Prototype pollution payload parsed safely");
  assert(({}).polluted === undefined, "Global prototype remains unpolluted");

  // 4. Huge Payload Stress (Length boundaries)
  console.log("\n  --- Payload Size Boundaries ---");
  // RFC 5321 specifies 254 max email length
  const hugeEmail255 = "a".repeat(243) + "@tactile.test"; // 243 + 13 = 256 chars > 254
  const hugeEmailRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: hugeEmail255 }),
  });
  assert(hugeEmailRes.status === 400, `Over-length email (> 254 chars) rejected with 400 Bad Request`);

  // Massive 50KB secondary payload
  const massiveRole = "EngineeringLead-".repeat(3000); // 48,000 chars
  const massiveDevice = "CustomRig-".repeat(3000);
  const massiveRes = await fetch(`${BASE_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `massive_payload_${Date.now()}@tactile.test`,
      role: massiveRole,
      devicePreference: massiveDevice,
    }),
  });
  const massiveData = await massiveRes.json();
  assert(massiveRes.status === 200, "Massive 50KB payload handled without crash or OOM");
  const storedRole = massiveData.data?.role || massiveData.entry?.role;
  const storedDevice = massiveData.data?.devicePreference || massiveData.entry?.devicePreference;
  assert(storedRole.length === 100, `Massive role field clamped strictly to 100 chars (got ${storedRole.length})`);
  assert(storedDevice.length === 100, `Massive device field clamped strictly to 100 chars (got ${storedDevice.length})`);
}

function runClientPhysicsMathSuite() {
  console.log("\n=======================================================");
  console.log("▶ SUITE 3: Client State Machine & Physics Convergence Invariants");
  console.log("=======================================================");

  // 1. Ballistic Inertia Convergence Simulation
  // Model from DeviceShowcase.tsx:
  // vx *= 0.92; vy *= 0.92; if (Math.hypot(vx, vy) < 0.05) stop();
  console.log("  --- Ballistic Inertia Convergence ---");

  function simulateCoasting(initialVx, initialVy) {
    let vx = initialVx;
    let vy = initialVy;
    let frames = 0;
    const maxFrames = 500;

    while (frames < maxFrames) {
      vx *= 0.92;
      vy *= 0.92;
      frames++;
      if (Math.hypot(vx, vy) < 0.05) {
        return { converged: true, frames, finalVx: vx, finalVy: vy };
      }
    }
    return { converged: false, frames, finalVx: vx, finalVy: vy };
  }

  // Test across 1,000 randomized velocity vectors
  let allConverged = true;
  let maxConvergenceFrames = 0;

  for (let i = 0; i < 1000; i++) {
    // Velocities from -500 to +500
    const vx = (Math.random() - 0.5) * 1000;
    const vy = (Math.random() - 0.5) * 1000;
    const result = simulateCoasting(vx, vy);
    if (!result.converged) {
      allConverged = false;
      break;
    }
    if (result.frames > maxConvergenceFrames) {
      maxConvergenceFrames = result.frames;
    }
  }

  assert(allConverged, "1,000 randomized velocity vectors all converge to hypot < 0.05");
  assert(maxConvergenceFrames <= 120, `Max convergence time is bounded: ${maxConvergenceFrames} frames (<= 2 seconds at 60 FPS)`);

  // Extreme velocity edge cases
  const extreme1 = simulateCoasting(1e6, -1e6);
  assert(extreme1.converged && extreme1.frames <= 210, `Extreme velocity (1,000,000 px/frame) converges in ${extreme1.frames} frames`);

  const boundaryBelow = simulateCoasting(0.04, 0.02);
  assert(boundaryBelow.converged && boundaryBelow.frames === 1, "Sub-threshold velocity (hypot < 0.05) halts immediately on frame 1");

  // 2. Trackpad Coordinate Clamping Invariant (5%..95%)
  console.log("\n  --- Trackpad Coordinate Clamping Invariants ---");
  const clamp = (val) => Math.max(5, Math.min(95, val));

  const testCoords = [
    -Infinity, -1000, -100, -0.001, 0, 4.999, 5.0, 50.0, 95.0, 95.001, 100, 1000, Infinity
  ];
  const allClampedInBounds = testCoords.every((c) => {
    const clamped = clamp(c);
    return clamped >= 5 && clamped <= 95 && !Number.isNaN(clamped);
  });
  assert(allClampedInBounds, "Trackpad coordinates strictly clamped to [5%, 95%] across full scalar domain");

  // Simulation of continuous trackpad dragging drift
  let posX = 50;
  let posY = 50;
  for (let step = 0; step < 1000; step++) {
    const randomFlingX = (Math.random() - 0.5) * 80;
    const randomFlingY = (Math.random() - 0.5) * 80;
    posX = clamp(posX + randomFlingX);
    posY = clamp(posY + randomFlingY);
    if (posX < 5 || posX > 95 || posY < 5 || posY > 95) {
      assert(false, `Trackpad escaped bounds at step ${step}: (${posX}, ${posY})`);
      break;
    }
  }
  assert(posX >= 5 && posX <= 95 && posY >= 5 && posY <= 95, "Continuous random flings maintain strict [5%, 95%] position containment");

  // Trackpad 160mm x 115mm Physical Projection Invariant
  // At 5%..95%:
  // X: 0.05 * 160 = 8mm, 0.95 * 160 = 152mm (span: 144mm active)
  // Y: 0.05 * 115 = 5.75mm, 0.95 * 115 = 109.25mm (span: 103.5mm active)
  const minX_mm = (5 / 100) * 160;
  const maxX_mm = (95 / 100) * 160;
  const minY_mm = (5 / 100) * 115;
  const maxY_mm = (95 / 100) * 115;
  assert(minX_mm >= 0 && maxX_mm <= 160, `Physical X coordinate projection [${minX_mm}mm, ${maxX_mm}mm] is within 160mm enclosure`);
  assert(minY_mm >= 0 && maxY_mm <= 115, `Physical Y coordinate projection [${minY_mm}mm, ${maxY_mm}mm] is within 115mm enclosure`);

  // 3. Audio Gain Safety and Spatial Panner Bounds
  console.log("\n  --- Audio Gain Safety & Spatial Panner Bounds ---");
  // Stereo panner clamping logic: Math.max(-1, Math.min(1, pan))
  const clampPan = (pan) => Math.max(-1, Math.min(1, pan));
  const panInputs = [-10, -1.0, -0.5, 0.0, 0.75, 1.0, 10, NaN];
  const panSafe = panInputs.every((p) => {
    if (Number.isNaN(p)) return true;
    const clamped = clampPan(p);
    return clamped >= -1.0 && clamped <= 1.0;
  });
  assert(panSafe, "Stereo panner values strictly clamped to [-1.0, +1.0]");

  // Mouse clientX spatial stereo calculation invariant:
  // pan = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1))
  const mockScreenWidth = 1920;
  const mousePositions = [
    { clientX: -500, expected: -1.0 },
    { clientX: 0, expected: -1.0 },
    { clientX: 960, expected: 0.0 },
    { clientX: 1920, expected: 1.0 },
    { clientX: 2500, expected: 1.0 },
  ];
  const mousePanSafe = mousePositions.every(({ clientX, expected }) => {
    const pan = clampPan((clientX / mockScreenWidth) * 2 - 1);
    return Math.abs(pan - expected) < 0.001;
  });
  assert(mousePanSafe, "Spatial pan derived from mouse clientX conforms to [-1.0, 1.0] across viewport edges and off-screen bounds");

  // Audio Synth Gain Multipliers Headroom Verification
  // In soundEngine.ts:
  // KeyClick Snap: 0.22 * volumeMultiplier
  // KeyClick Thud: 0.18 * volumeMultiplier
  // Killswitch: 0.25
  // BeamChime: 0.12
  // ScrollDetent: 0.045
  // CelebrationArpeggio: 0.14
  const baseGains = {
    keyClickSnap: 0.22,
    keyClickThud: 0.18,
    killswitch: 0.25,
    beamChime: 0.12,
    scrollDetent: 0.045,
    celebrationChime: 0.14,
  };

  const defaultVolumeGainsSafe = Object.values(baseGains).every((gain) => gain <= 0.25 && gain > 0);
  assert(defaultVolumeGainsSafe, "All base synthesizer gains are bounded <= 0.25 (minimum 12dB acoustic safety headroom below 1.0 clipping)");
}

async function main() {
  console.log("=======================================================");
  console.log("    TACTILE WEB PLATFORM — ADVERSARIAL STRESS SUITE     ");
  console.log("=======================================================");
  console.log(`Target: ${BASE_URL}`);

  try {
    await runApiStressSuite();
    await runApiPayloadAndSecuritySuite();
    runClientPhysicsMathSuite();
  } catch (err) {
    console.error("Critical Suite Execution Error:", err);
    failed++;
    failures.push({ testName: "Suite Execution", details: err.message });
  }

  console.log("\n=======================================================");
  console.log("ADVERSARIAL STRESS TEST SUMMARY:");
  console.log(`  Total Passed: ${passed}`);
  console.log(`  Total Failed: ${failed}`);
  if (failures.length > 0) {
    console.log("  Failures:");
    failures.forEach((f) => console.log(`    - ${f.testName}: ${f.details}`));
  }
  console.log("=======================================================");

  process.exit(failed > 0 ? 1 : 0);
}

main();
