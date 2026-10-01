#!/usr/bin/env node

/**
 * tests/e2e/run-tests.mjs
 * Master Executable Test Runner for Tactile Web Platform.
 * Runs Tiers 1-4 opaque-box E2E tests against live endpoints and static contracts.
 */

import { runner } from "./test-utils.mjs";
import { registerTier1Tests } from "./tier1-features.mjs";
import { registerTier2Tests } from "./tier2-boundaries.mjs";
import { registerTier3Tests } from "./tier3-combinations.mjs";
import { registerTier4Tests } from "./tier4-scenarios.mjs";

async function main() {
  // Register all tiers
  registerTier1Tests();
  registerTier2Tests();
  registerTier3Tests();
  registerTier4Tests();

  // Execute runner
  const success = await runner.run();
  process.exit(success ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error during test run:", err);
  process.exit(1);
});
