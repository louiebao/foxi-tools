// Standalone test for the pure math functions embedded in index.html.
// Run with: node math.test.js
// No framework, no package.json — this repo has none, and this tool's
// math (ratio normalization, temperature tier thresholds) is the one part
// a person can't verify just by eyeballing a rendered photo.
//
// This extracts the inline <script> from index.html and runs it in a
// sandbox with no `document`, so only the pure-math section (guarded by
// `if (typeof document !== 'undefined' ...)`) executes — the actual
// shipped code is tested, not a duplicated copy.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error('Could not find inline <script> in index.html');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(match[1], sandbox);

const M = sandbox.GoldenRatioMath;
if (!M) throw new Error('GoldenRatioMath was not attached to the sandbox global');

let failures = 0;
function assertClose(actual, expected, tolerance, label) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) {
    failures++;
    console.error(`FAIL ${label}: expected ~${expected}, got ${actual}`);
  } else {
    console.log(`ok   ${label}`);
  }
}
function assertEqual(actual, expected, label) {
  const ok = actual === expected;
  if (!ok) {
    failures++;
    console.error(`FAIL ${label}: expected ${expected}, got ${actual}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// ── computeRatio: always max/min, regardless of orientation ──────────────
assertClose(M.computeRatio(1618, 1000), 1.618, 0.001, 'computeRatio landscape golden');
assertClose(M.computeRatio(1000, 1618), 1.618, 0.001, 'computeRatio portrait golden (normalized)');
assertClose(M.computeRatio(100, 100), 1, 0.001, 'computeRatio square');
assertEqual(M.computeRatio(0, 100), null, 'computeRatio zero-width guarded');
assertEqual(M.computeRatio(100, 0), null, 'computeRatio zero-height guarded');

// ── temperatureTier: hot ≤3%, warm ≤12%, else cold ─────────────────────
assertEqual(M.temperatureTier(M.PHI), 'hot', 'temperatureTier exact phi is hot');
assertEqual(M.temperatureTier(M.PHI * 1.02), 'hot', 'temperatureTier +2% is hot');
assertEqual(M.temperatureTier(M.PHI * 1.04), 'warm', 'temperatureTier +4% is warm');
assertEqual(M.temperatureTier(M.PHI * 0.96), 'warm', 'temperatureTier -4% is warm (boundary check)');
assertEqual(M.temperatureTier(M.PHI * 1.10), 'warm', 'temperatureTier +10% is still warm');
assertEqual(M.temperatureTier(M.PHI * 1.15), 'cold', 'temperatureTier +15% is cold');
assertEqual(M.temperatureTier(1.42), 'cold', 'temperatureTier known cold case (1.42)');
assertEqual(M.temperatureTier(1.0), 'cold', 'temperatureTier square (1.0) is cold');

// ── percentGolden / percentDeviation ──────────────────────────────────
assertClose(M.percentGolden(M.PHI), 100, 0.01, 'percentGolden exact phi = 100%');
assertClose(M.percentDeviation(M.PHI), 0, 0.01, 'percentDeviation exact phi = 0%');
assertClose(M.percentDeviation(M.PHI * 1.1), 10, 0.1, 'percentDeviation +10%');

console.log('');
if (failures > 0) {
  console.error(`${failures} failure(s).`);
  process.exit(1);
} else {
  console.log('All checks passed.');
}
