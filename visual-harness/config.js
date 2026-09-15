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
 *
 * `interact(page)` is an optional async hook run after the initial load has
 * settled but before the screenshot. It drives the *reimplemented drawer's
 * runtime behaviour* — dragging the sheet between snap points, tapping tabs —
 * rather than deep-linking to a state via URL params. The same interaction
 * runs against both targets, so the diff reflects the post-interaction render.
 * `interactSettleMs` is the wait after the interaction (defaults to 600ms).
 */

// --- Interaction helpers -------------------------------------------------
//
// The sheet listens for both mouse and touch drags (see LocationSheet). The
// harness runs desktop Chromium with a mobile viewport, so we drive it with
// mouse events, which the sheet's mousedown/mousemove/mouseup handlers accept.
// Transitions are frozen during capture, so the sheet snaps to its resting
// position on release without an animation to wait out.
//
// Grab points are computed purely from the fixed viewport and the drawer's
// known snap geometry — NOT from an app-specific selector — so the exact same
// gesture is issued to both the local and reference targets. (The reference is
// the deployed main branch and may not share local-only test ids.)

const MIDDLE_SCREEN_RATIO = 0.7 // mirrors EntryMobile
const LOW_PEEK_HEIGHT_PX = 80 // mirrors EntryMobile (safe-area inset ~0 in headless)

// Sheet top (translateY) at each resting snap point, in CSS pixels.
const SNAP_TOP = {
  middle: Math.round(viewport.height * MIDDLE_SCREEN_RATIO), // ~591
  low: viewport.height - LOW_PEEK_HEIGHT_PX, // ~764
}
// The grab handle sits ~15px below the sheet top (margin 10 + ~half of 5px).
const HANDLE_OFFSET = 15

/**
 * Drag the sheet grab-handle by `dy` CSS pixels (negative = up towards full,
 * positive = down towards the low peek / dismiss), starting from the resting
 * position `from` ('middle' | 'low').
 */
const dragSheet = async (page, from, dy) => {
  const startX = viewport.width / 2
  const startY = SNAP_TOP[from] + HANDLE_OFFSET
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  // Move in a few steps so the drag registers as a gesture, not a teleport.
  const steps = 8
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(startX, startY + (dy * i) / steps)
  }
  await page.mouse.up()
}

/** Click a tab in the full-page tab list by its accessible role/index. */
const clickTab = async (page, index) => {
  const tabs = await page.$$('[role="tab"]')
  if (tabs[index]) {
    await tabs[index].click()
  }
}

const scenarios = [
  {
    id: 'sheet-middle-with-images',
    label: 'Bottom sheet — middle — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}`,
    // At middle the sheet top rests ~591px; the image is revealed up to ~484px.
    // Mask only the pure map region above the highest sheet content.
    mask: [{ x: 0, y: 0, width: viewport.width, height: 480 }],
    settleMs: 2200,
  },
  {
    id: 'sheet-low-with-images',
    label: 'Bottom sheet — low peek — location with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=low`,
    // At low the sheet top rests ~764px; revealed image starts higher. Mask the
    // map above the visible sheet content only.
    mask: [{ x: 0, y: 0, width: viewport.width, height: 620 }],
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

  // --- Load-then-interact scenarios --------------------------------------
  //
  // These load at one drawer state and then drive the sheet at runtime to
  // reach another, exercising the reimplemented drag/snap and tab-switch
  // paths rather than the deep-linked initial render. Each should land on the
  // same pixels as its equivalent deep-linked scenario above; a divergence
  // means the runtime transition settles differently from a fresh load.
  {
    id: 'interact-middle-drag-to-full',
    label: 'Interaction — load middle, drag up to full page — with images',
    path: `/locations/${LOCATION_WITH_IMAGES}`,
    // Ends full page; nothing to mask.
    mask: [],
    settleMs: 2200,
    // Drag well past the middle→top threshold to trigger the full-page handoff.
    interact: (page) => dragSheet(page, 'middle', -700),
    interactSettleMs: 800,
  },
  {
    id: 'interact-middle-drag-to-low',
    label: 'Interaction — load middle, drag down to low peek — with images',
    path: `/locations/${LOCATION_WITH_IMAGES}`,
    // Lands at low peek; mask the map above the visible sheet content.
    mask: [{ x: 0, y: 0, width: viewport.width, height: 620 }],
    settleMs: 2200,
    interact: (page) => dragSheet(page, 'middle', 200),
    interactSettleMs: 800,
  },
  {
    id: 'interact-low-drag-to-middle',
    label: 'Interaction — load low, drag up to middle — with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=low`,
    // Lands at middle. The revealed carousel photo is non-deterministic between
    // two independent loads (each settles the responsive carousel on a slightly
    // different scroll/scale), so mask the whole image band and diff only the
    // drawer chrome below it — the point of this scenario is that the drag
    // lands the sheet at the same middle position, not the photo pixels.
    mask: [{ x: 0, y: 0, width: viewport.width, height: 700 }],
    settleMs: 1500,
    interact: (page) => dragSheet(page, 'low', -260),
    interactSettleMs: 800,
  },
  {
    id: 'interact-full-tap-reviews',
    label: 'Interaction — load full page, tap reviews tab — with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=full`,
    mask: [],
    settleMs: 1800,
    interact: (page) => clickTab(page, 1),
    interactSettleMs: 700,
  },
  {
    id: 'interact-full-reviews-tap-overview',
    label: 'Interaction — load reviews tab, tap back to overview — with images',
    path: `/locations/${LOCATION_WITH_IMAGES}?pane=full&tab=1`,
    mask: [],
    settleMs: 1800,
    interact: (page) => clickTab(page, 0),
    interactSettleMs: 700,
  },
  {
    id: 'interact-middle-drag-to-full-no-images',
    label: 'Interaction — load middle, drag up to full page — without images',
    path: `/locations/${LOCATION_WITHOUT_IMAGES}`,
    mask: [],
    settleMs: 1500,
    interact: (page) => dragSheet(page, 'middle', -700),
    interactSettleMs: 800,
  },

  // --- Peek-at-full-height vs full page ----------------------------------
  //
  // These compare the debug "peek at full height" (`?peekFull=1`, which pins
  // the bottom-sheet/peek content to translateY 0 with drag progress locked
  // at 1 — the peek exactly as it looks the instant it hands off) against the
  // real full page (`?pane=full`). BOTH sides render on the LOCAL target
  // (referenceTarget = local), so this is a local-vs-local structural check,
  // not a local-vs-deployed check.
  //
  // Intended result: the peek's drag-handle band sits where the full page's
  // tab ribbon sits, and everything else lines up. The `-band` variant masks
  // the top band (drag handle ↔ tab ribbon), so its diff should be ~0% if the
  // rest matches; the un-masked variant is kept so the report visually shows
  // the handle↔ribbon swap. `TAB_RIBBON_TOP` is where the ribbon/handle band
  // begins: at the top for no-image locations, below the 250px image for
  // image locations.
  ...(() => {
    const IMAGE_TOP = 250 // ENTRY_IMAGE_HEIGHT — image band on the full page
    const RIBBON_BAND = 50 // TABS_HEIGHT_PX — the tab ribbon / handle band
    const peekFull = (id) => `/locations/${id}?peekFull=1`
    const full = (id) => `/locations/${id}?pane=full`

    // Locations to sweep. With-images cases exercise the image + ribbon
    // geometry; the without-images case exercises the bare ribbon-at-top case.
    const withImageIds = [
      LOCATION_WITH_IMAGES, // 2402673
      '2294274',
      '2292274',
    ]

    const scns = []
    for (const id of withImageIds) {
      // Mask the top image band (non-deterministic carousel photo) AND the
      // ribbon band (drag handle vs tab ribbon — expected to differ by design),
      // so this variant checks that the overview content BELOW lines up.
      scns.push({
        id: `peekfull-vs-full-${id}-band`,
        label: `Peek@full vs full page — ${id} — body aligned (handle/ribbon band masked)`,
        localPath: peekFull(id),
        referencePath: full(id),
        referenceTarget: LOCAL,
        mask: [{ x: 0, y: 0, width: viewport.width, height: IMAGE_TOP + RIBBON_BAND }],
        settleMs: 2000,
      })
      // Un-masked companion: shows the full frame so the report reveals the
      // handle↔ribbon swap and any image-band difference visually.
      scns.push({
        id: `peekfull-vs-full-${id}-raw`,
        label: `Peek@full vs full page — ${id} — full frame (visual)`,
        localPath: peekFull(id),
        referencePath: full(id),
        referenceTarget: LOCAL,
        mask: [],
        settleMs: 2000,
      })
    }

    // Without images: no image band, so the ribbon band is at the very top.
    scns.push({
      id: `peekfull-vs-full-${LOCATION_WITHOUT_IMAGES}-band`,
      label: `Peek@full vs full page — ${LOCATION_WITHOUT_IMAGES} (no images) — body aligned (ribbon band masked)`,
      localPath: peekFull(LOCATION_WITHOUT_IMAGES),
      referencePath: full(LOCATION_WITHOUT_IMAGES),
      referenceTarget: LOCAL,
      mask: [{ x: 0, y: 0, width: viewport.width, height: RIBBON_BAND }],
      settleMs: 1800,
    })
    scns.push({
      id: `peekfull-vs-full-${LOCATION_WITHOUT_IMAGES}-raw`,
      label: `Peek@full vs full page — ${LOCATION_WITHOUT_IMAGES} (no images) — full frame (visual)`,
      localPath: peekFull(LOCATION_WITHOUT_IMAGES),
      referencePath: full(LOCATION_WITHOUT_IMAGES),
      referenceTarget: LOCAL,
      mask: [],
      settleMs: 1800,
    })
    return scns
  })(),
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
  // flagged. A small tolerance absorbs residual text anti-aliasing between two
  // independent page loads; structural regressions produce far larger,
  // spatially-coherent diffs.
  failFraction: 0.005,
  outDir: __dirname + '/output',
}
