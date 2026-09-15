# Location drawer visual diff harness

Compares the location drawer as rendered by your **local** dev server against
the **deployed** main branch, to confirm the drawer refactor renders the same
pixels — and to surface anything that diverges so we can fix it iteratively.

## What it does

For each drawer state (bottom sheet at middle/low, full page with and without
images, reviews tab) it:

1. loads the same URL on both targets in an identical mobile viewport,
2. freezes CSS animations and waits for the drawer transition + images to settle,
3. optionally performs a runtime **interaction** (see below),
4. screenshots both,
5. masks the Google map area (non-deterministic external tiles) so the diff
   focuses on the drawer chrome,
6. pixel-diffs local vs reference with `pixelmatch`,
7. writes an HTML report with local / reference / diff side by side, worst first.

## Interaction scenarios

Beyond deep-linking to a drawer state via URL params, some scenarios (ids
prefixed `interact-`) load at one state and then drive the sheet at runtime —
dragging between snap points or tapping tabs — before the screenshot. This
exercises the reimplemented drawer's drag/snap and tab-switch behaviour, not
just its initial render.

A scenario declares this with an optional async `interact(page)` hook and an
`interactSettleMs` wait. Interactions are driven purely by the fixed viewport
and the drawer's known snap geometry (no app-specific selectors), so the exact
same gesture runs against both the local and deployed targets. Each interaction
scenario should land on the same pixels as its equivalent deep-linked scenario;
a divergence means the runtime transition settles differently from a fresh load.

Covered interactions: middle → drag up to full page (the release-then-animate
handoff), middle → drag down to low peek, low → drag up to middle, full page →
tap the reviews tab, reviews tab → tap back to overview, plus the
drag-up-to-full case without images.

## Prerequisites

- Local dev server running: `yarn start` (defaults to `http://localhost:3000`).
- Network access to `https://falling-fruit-web.pages.dev`.
- Playwright Chromium installed: `yarn playwright install chromium` (done once).

## Run

```bash
yarn visual-diff
```

Open the report:

```
visual-harness/output/report.html
```

Exit code is non-zero if any scenario exceeds `failFraction` (see config), so it
can gate CI later if desired.

## Configuration (env overrides)

| Var | Default | Meaning |
|---|---|---|
| `HARNESS_LOCAL_URL` | `http://localhost:3000` | local target |
| `HARNESS_REFERENCE_URL` | `https://falling-fruit-web.pages.dev` | reference target |
| `HARNESS_LOCATION_WITH_IMAGES` | `2402673` | a real location id with review photos |
| `HARNESS_LOCATION_WITHOUT_IMAGES` | `2295444` | a real location id with no photos |

Both targets use the shared production API (`fallingfruit.org`), so the same
location id renders equivalently on each. Other known photographed ids:
`2294274`, `2292274`.

## Notes / limitations

- The map region is masked, so map tile differences do not count. Everything
  else — sheet, image carousel, tabs, overview, buttons — is compared.
- A valid diff requires both captures at the same viewport and
  `deviceScaleFactor`; do not change one target's settings only.
- Reference and local must be on comparable data. If the deployed branch and
  local point at different API data for an id, expect content-level diffs that
  are not layout regressions.
