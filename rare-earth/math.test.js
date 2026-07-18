// Standalone test for the pure math functions embedded in index.html.
// Run with: node math.test.js
// No framework, no package.json — this repo has none. Same pattern as
// golden-ratio/math.test.js: extract the inline <script> and run it in a
// document-less vm sandbox, so only pure functions execute (DOM wiring is
// guarded by `if (typeof document !== 'undefined' ...)`) — the actual
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

const M = sandbox.RareEarthMath;
if (!M) throw new Error('RareEarthMath was not attached to the sandbox global');

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
function assertTrue(actual, label) {
  if (!actual) {
    failures++;
    console.error(`FAIL ${label}: expected truthy, got ${actual}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// ── projectPoint: equirectangular lat/lon -> SVG x/y ────────────────────
{
  const w = M.VIEWBOX_WIDTH, h = M.VIEWBOX_HEIGHT;
  const center = M.projectPoint(0, 0);
  assertClose(center.x, w / 2, 0.01, 'projectPoint(0,0) is horizontal center');
  assertClose(center.y, h / 2, 0.01, 'projectPoint(0,0) is vertical center');

  const topLeft = M.projectPoint(90, -180);
  assertClose(topLeft.x, 0, 0.01, 'projectPoint(90,-180) is left edge');
  assertClose(topLeft.y, 0, 0.01, 'projectPoint(90,-180) is top edge (north pole)');

  const bottomRight = M.projectPoint(-90, 180);
  assertClose(bottomRight.x, w, 0.01, 'projectPoint(-90,180) is right edge');
  assertClose(bottomRight.y, h, 0.01, 'projectPoint(-90,180) is bottom edge (south pole)');

  // Landmark sanity: known real-world wonders should land within a
  // plausible bounding region for their continent, not in an obviously
  // wrong hemisphere/ocean. (Verified against the actual simplified
  // outline via a Python point-in-polygon check before shipping — see
  // design doc Cross-Model Perspective / Tension 2.)
  const richat = M.projectPoint(21.1233, -11.3986); // Sahara, west Africa
  assertTrue(richat.x > 400 && richat.x < 520, 'Richat Structure lands in west-Africa longitude band');
  assertTrue(richat.y > 150 && richat.y < 250, 'Richat Structure lands in northern-hemisphere latitude band');

  const uluru = M.projectPoint(-25.3444, 131.0369); // central Australia
  assertTrue(uluru.x > 800 && uluru.x < 950, 'Uluru lands in Australia longitude band');
  assertTrue(uluru.y > 280 && uluru.y < 380, 'Uluru lands in southern-hemisphere latitude band');

  const grandCanyon = M.projectPoint(36.0544, -112.1401); // southwest USA
  assertTrue(grandCanyon.x > 100 && grandCanyon.x < 260, 'Grand Canyon lands in western-USA longitude band');
  assertTrue(grandCanyon.y > 100 && grandCanyon.y < 200, 'Grand Canyon lands in northern-hemisphere latitude band');
}

// ── validateLocations: lat/lon range + required fields ──────────────────
{
  const valid = [{ name: 'A', lat: 10, lon: 20, blurb: 'x', earthUrl: 'https://x', added: '2026-01-01' }];
  assertEqual(M.validateLocations(valid).length, 0, 'validateLocations: valid entry passes clean');

  const badLat = [{ name: 'A', lat: 95, lon: 20, blurb: 'x', earthUrl: 'https://x', added: '2026-01-01' }];
  assertEqual(M.validateLocations(badLat).length, 1, 'validateLocations: catches lat > 90');

  const badLatNeg = [{ name: 'A', lat: -91, lon: 20, blurb: 'x', earthUrl: 'https://x', added: '2026-01-01' }];
  assertEqual(M.validateLocations(badLatNeg).length, 1, 'validateLocations: catches lat < -90');

  const badLon = [{ name: 'A', lat: 10, lon: 181, blurb: 'x', earthUrl: 'https://x', added: '2026-01-01' }];
  assertEqual(M.validateLocations(badLon).length, 1, 'validateLocations: catches lon > 180');

  const missingAdded = [{ name: 'A', lat: 10, lon: 20, blurb: 'x', earthUrl: 'https://x' }];
  assertEqual(M.validateLocations(missingAdded).length, 1, 'validateLocations: catches missing added date');

  const badAdded = [{ name: 'A', lat: 10, lon: 20, blurb: 'x', earthUrl: 'https://x', added: '7/13/26' }];
  assertEqual(M.validateLocations(badAdded).length, 1, 'validateLocations: catches malformed added date');

  const missingFields = [{ lat: 10, lon: 20 }];
  assertTrue(M.validateLocations(missingFields).length >= 2, 'validateLocations: catches missing name/blurb/earthUrl');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} failure(s).`);
  process.exit(1);
} else {
  console.log('All checks passed.');
}
