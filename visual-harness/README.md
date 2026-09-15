# Location drawer visual diff harness

Compares the location drawer as rendered by your **local** dev server against
the **deployed** main branch, to confirm the drawer refactor renders the same
pixels — and to surface anything that diverges so we can fix it iteratively.

## What it does

For each drawer state (bottom sheet at middle/low, full page with and without
images, reviews tab) it:

1. loads the same URL on both targets in an identical mobile viewport,
2. freezes CSS animations and waits for the drawer transition + images to settle,
3. screenshots both,
4. masks the Google map area (non-deterministic external tiles) so the diff
   focuses on the drawer chrome,
5. pixel-diffs local vs reference with `pixelmatch`,
6. writes an HTML report with local / reference / diff side by side, worst first.

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
