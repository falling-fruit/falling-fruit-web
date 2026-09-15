/**
 * Visual diff harness config.
 *
 * Compares the location drawer as rendered by a LOCAL target (usually your
 * dev server on :3000) against a REFERENCE target (the deployed main branch).
 * The goal is to confirm the drawer refactor renders the same pixels as the
 * currently-deployed version, and to surface any divergences to fix.
 *
 * Everything here is overridable via env vars so it is easy to point at a
 * different location id, port, or reference URL without editing the file.
 */

const LOCAL = process.env.HARNESS_LOCAL_URL || 'http://localhost:3000'
const REFERENCE =
  process.env.HARNESS_REFERENCE_URL || 'https://falling-fruit-web.pages.dev'

// Real location ids on the shared production API (see harness README).
const LOCATION_WITH_IMAGES = process.env.HARNESS_LOCATION_WITH_IMAGES || '2402673'
const LOCATION_WITHOUT_IMAGES =
  process.env.HARNESS_LOCATION_WITHOUT_IMAGES || '2295444'

// iPhone-ish mobile viewport. deviceScaleFactor 2 to match retina rendering
// on both targets; both must use the same factor for a valid pixel diff.
const viewport = { width: 390, height: 844 }
const deviceScaleFactor = 2

/**
 * A scenario is one drawer state on one location. `path` is appended to each
 * base URL. `settleMs` is an extra wait after network idle so drawer
 * transitions (0.3s) and image decode finish before the screenshot.
 *
 * `mask` regions (in CSS pixels, pre-scale) are painted over before diffing
 * so non-deterministic content (the Google map tiles behind the sheet) does
 * not create noise. The drawer chrome itself is never masked.
 */
const scenarios = [
  {
    id: 'sheet-middle-with-images',
    label: 'Bottom sheet — middle — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}`,
    // Middle sheet peeks ~30% of the screen; the map fills the top ~70%.
    mask: [{ x: 0, y: 0, width: viewport.width, height: 590 }],
    settleMs: 1500,
  },
  {
    id: 'sheet-low-with-images',
    label: 'Bottom sheet — low peek — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=low`,
    mask: [{ x: 0, y: 0, width: viewport.width, height: 760 }],
    settleMs: 1500,
  },
  {
    id: 'full-with-images',
    label: 'Full page — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=full`,
    // Full page covers the whole viewport; nothing to mask.
    mask: [],
    settleMs: 1800,
  },
  {
    id: 'full-with-images-reviews',
    label: 'Full page — reviews tab — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=full&tab=1`,
    mask: [],
    settleMs: 1800,
  },
  {
    id: 'sheet-middle-no-images',
    label: 'Bottom sheet — middle — location without images',
    path: `/locations/${LOCATION_WITHOUT_IMAGES}`,
    mask: [{ x: 0, y: 0, width: viewport.width, height: 590 }],
    settleMs: 1500,
  },
  {
    id: 'full-no-images',
    label: 'Full page — location without images',
    path: `/locations/${LOCATION_WITHOUT_IMAGES}?pane=full`,
    mask: [],
    settleMs: 1500,
  },
]

module.exports = {
  targets: { local: LOCAL, reference: REFERENCE },
  viewport,
  deviceScaleFactor,
  scenarios,
  // pixelmatch per-pixel color threshold (0..1). Higher = more tolerant of
  // anti-aliasing / subpixel differences.
  matchThreshold: 0.1,
  // Fraction of non-masked pixels allowed to differ before a scenario is
  // flagged as a regression in the report.
  failFraction: 0.005,
  outDir: __dirname + '/output',
}
