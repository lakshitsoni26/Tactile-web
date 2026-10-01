/**
 * tests/e2e/test-utils.mjs
 * Utilities, test harness, DOM inspection, and API client for Tactile E2E tests.
 */

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

export const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
export const PROJECT_ROOT = process.cwd();

// Terminal ANSI colors
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Test Suite Harness
class TestRunner {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.failures = [];
    this.startTime = 0;
  }

  describe(name, fn) {
    const suite = { name, tests: [] };
    this.suites.push(suite);
    const prev = this.currentSuite;
    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = prev;
    }
  }

  test(name, fn) {
    if (!this.currentSuite) {
      this.describe("Default Suite", () => {
        this.currentSuite.tests.push({ name, fn });
      });
    } else {
      this.currentSuite.tests.push({ name, fn });
    }
  }

  async run() {
    this.startTime = Date.now();
    this.passed = 0;
    this.failed = 0;
    this.failures = [];

    console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  TACTILE WEB PLATFORM — 4-TIER E2E TEST SUITE     ${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
    console.log(`${colors.dim}Target Server: ${BASE_URL}${colors.reset}`);
    console.log(`${colors.dim}Node Engine: ${process.version}${colors.reset}\n`);

    for (const suite of this.suites) {
      console.log(`\n${colors.bold}${colors.blue}▶ ${suite.name}${colors.reset}`);
      for (const t of suite.tests) {
        const start = Date.now();
        try {
          await t.fn();
          const duration = Date.now() - start;
          this.passed++;
          console.log(`  ${colors.green}✔ PASS${colors.reset} ${t.name} ${colors.dim}(${duration}ms)${colors.reset}`);
        } catch (err) {
          const duration = Date.now() - start;
          this.failed++;
          this.failures.push({ suite: suite.name, test: t.name, error: err });
          console.log(`  ${colors.red}✖ FAIL${colors.reset} ${t.name} ${colors.dim}(${duration}ms)${colors.reset}`);
          console.log(`    ${colors.red}${err.message}${colors.reset}`);
        }
      }
    }

    const total = this.passed + this.failed;
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
    console.log(`${colors.bold}TEST EXECUTION SUMMARY:${colors.reset}`);
    console.log(`  Total Tests: ${colors.bold}${total}${colors.reset}`);
    console.log(`  Passed:      ${colors.green}${colors.bold}${this.passed}${colors.reset}`);
    console.log(`  Failed:      ${this.failed > 0 ? colors.red : colors.green}${colors.bold}${this.failed}${colors.reset}`);
    console.log(`  Duration:    ${colors.dim}${totalDuration}s${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

    if (this.failures.length > 0) {
      console.log(`${colors.bold}${colors.red}FAILURES BREAKDOWN:${colors.reset}`);
      this.failures.forEach((f, idx) => {
        console.log(`\n${idx + 1}) [${f.suite}] ${f.test}`);
        console.log(`   ${colors.red}${f.error.stack || f.error.message}${colors.reset}`);
      });
      return false;
    }
    return true;
  }
}

export const runner = new TestRunner();
export const describe = runner.describe.bind(runner);
export const test = runner.test.bind(runner);

// HTTP Helpers
export async function getLivePage(path = "/") {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url);
  const text = await res.text();
  return {
    status: res.status,
    headers: res.headers,
    html: text,
  };
}

export async function postApi(path, body) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  let json = null;
  let text = "";
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch {
    // Non-JSON response
  }
  return {
    status: res.status,
    headers: res.headers,
    data: json,
    text,
  };
}

export async function getApi(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { method: "GET" });
  let json = null;
  let text = "";
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch {
    // Non-JSON response
  }
  return {
    status: res.status,
    headers: res.headers,
    data: json,
    text,
  };
}

// Local Prerendered HTML Reader
export function getPrerenderedHtml() {
  const staticHtmlPath = path.join(PROJECT_ROOT, ".next/server/app/index.html");
  if (fs.existsSync(staticHtmlPath)) {
    return fs.readFileSync(staticHtmlPath, "utf-8");
  }
  return null;
}

// DOM Inspection Helpers
export function extractMetaTag(html, nameOrProp) {
  const re = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const match = html.match(re);
  if (match) return match[1];
  const reReverse = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["'][^>]*>`, "i");
  const matchReverse = html.match(reReverse);
  return matchReverse ? matchReverse[1] : null;
}

export function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

export function hasElementWithId(html, id) {
  const re = new RegExp(`id=["']${id}["']`, "i");
  return re.test(html);
}

export function hasElementWithClass(html, className) {
  const re = new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, "i");
  return re.test(html);
}

export function countMatches(html, pattern) {
  const re = typeof pattern === "string" ? new RegExp(pattern, "gi") : new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  const matches = html.match(re);
  return matches ? matches.length : 0;
}

export { assert };
