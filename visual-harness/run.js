#!/usr/bin/env node
/**
 * Capture + diff runner.
 *
 * For each scenario, loads the path on both targets in an identical mobile
 * context, freezes animations, waits for the drawer to settle, screenshots,
 * masks the non-deterministic map region, and pixel-diffs local vs reference.
 * Writes PNGs and a results.json, then invokes the HTML report generator.
 */
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch')

const config = require('./config')
const { generateReport } = require('./report')

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true })

/**
 * Freeze CSS animations/transitions and hide caret so screenshots are stable,
 * without relying on prefers-reduced-motion handling in the app.
 */
const FREEZE_CSS = `
  *, *::before, *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`

const captureScreenshot = async (context, url, scenario) => {
  const page = await context.newPage()
  const result = { ok: false, error: null, buffer: null }
  try {
    await page.addInitScript(() => {
      // Reduce motion at the source too.
      window.matchMedia = ((orig) => (q) =>
        /prefers-reduced-motion/.test(q)
          ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
          : orig(q))(window.matchMedia.bind(window))
    })
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    await page.addStyleTag({ content: FREEZE_CSS })
    // Wait for all images to finish decoding so the carousel is not captured
    // mid-load (a common source of false diffs).
    await page
      .evaluate(async () => {
        const imgs = Array.from(document.images)
        await Promise.all(
          imgs.map((img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise((res) => {
                  img.addEventListener('load', res, { once: true })
                  img.addEventListener('error', res, { once: true })
                }),
          ),
        )
      })
      .catch(() => {})
    await page.waitForTimeout(scenario.settleMs || 1000)
    // Optional runtime interaction: drag the sheet, tap a tab, click the
    // carousel, etc. Runs identically against both targets after the initial
    // load has settled, so the diff reflects the *post-interaction* state.
    // Transitions are frozen (see FREEZE_CSS), so the sheet snaps to its
    // resting position immediately; `interactSettleMs` gives React a beat to
    // commit the resulting re-render before we screenshot.
    if (typeof scenario.interact === 'function') {
      await scenario.interact(page)
      await page.waitForTimeout(scenario.interactSettleMs || 600)
    }
    result.buffer = await page.screenshot({ type: 'png' })
    result.ok = true
  } catch (err) {
    result.error = err.message
  } finally {
    await page.close()
  }
  return result
}

/** Paint mask regions with opaque black on both images before diffing. */
const applyMasks = (png, masks, scale) => {
  for (const m of masks) {
    const x0 = Math.round(m.x * scale)
    const y0 = Math.round(m.y * scale)
    const x1 = Math.min(png.width, Math.round((m.x + m.width) * scale))
    const y1 = Math.min(png.height, Math.round((m.y + m.height) * scale))
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const idx = (png.width * y + x) << 2
        png.data[idx] = 0
        png.data[idx + 1] = 0
        png.data[idx + 2] = 0
        png.data[idx + 3] = 255
      }
    }
  }
  return masks.reduce(
    (sum, m) =>
      sum +
      Math.round(m.width * scale) * Math.round(m.height * scale),
    0,
  )
}

const run = async () => {
  const { targets, viewport, deviceScaleFactor, scenarios, matchThreshold, failFraction, outDir } = config
  const shotsDir = path.join(outDir, 'shots')
  ensureDir(shotsDir)

  const browser = await chromium.launch()
  const makeContext = () =>
    browser.newContext({
      viewport,
      deviceScaleFactor,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    })

  const localCtx = await makeContext()
  const refCtx = await makeContext()

  const results = []

  for (const scenario of scenarios) {
    const localUrl = targets.local + scenario.path
    const refUrl = targets.reference + scenario.path
    process.stdout.write(`• ${scenario.id} ... `)

    const [local, reference] = await Promise.all([
      captureScreenshot(localCtx, localUrl, scenario),
      captureScreenshot(refCtx, refUrl, scenario),
    ])

    const entry = {
      id: scenario.id,
      label: scenario.label,
      path: scenario.path,
      localError: local.error,
      referenceError: reference.error,
      localShot: null,
      referenceShot: null,
      diffShot: null,
      mismatch: null,
      comparablePixels: null,
      regression: false,
    }

    if (local.ok) {
      const p = `shots/${scenario.id}.local.png`
      fs.writeFileSync(path.join(outDir, p), local.buffer)
      entry.localShot = p
    }
    if (reference.ok) {
      const p = `shots/${scenario.id}.reference.png`
      fs.writeFileSync(path.join(outDir, p), reference.buffer)
      entry.referenceShot = p
    }

    if (local.ok && reference.ok) {
      const a = PNG.sync.read(local.buffer)
      const b = PNG.sync.read(reference.buffer)
      const width = Math.min(a.width, b.width)
      const height = Math.min(a.height, b.height)

      // Crop both to the common size (targets can differ by a pixel row).
      const crop = (src) => {
        if (src.width === width && src.height === height) return src
        const out = new PNG({ width, height })
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const si = (src.width * y + x) << 2
            const di = (width * y + x) << 2
            out.data[di] = src.data[si]
            out.data[di + 1] = src.data[si + 1]
            out.data[di + 2] = src.data[si + 2]
            out.data[di + 3] = src.data[si + 3]
          }
        }
        return out
      }
      const ca = crop(a)
      const cb = crop(b)

      const maskedPixels = applyMasks(ca, scenario.mask || [], deviceScaleFactor)
      applyMasks(cb, scenario.mask || [], deviceScaleFactor)

      const diff = new PNG({ width, height })
      const numDiff = pixelmatch(ca.data, cb.data, diff.data, width, height, {
        threshold: matchThreshold,
        includeAA: false,
      })

      const totalPixels = width * height
      const comparable = Math.max(1, totalPixels - maskedPixels)
      const mismatch = numDiff / comparable

      const diffPath = `shots/${scenario.id}.diff.png`
      fs.writeFileSync(path.join(outDir, diffPath), PNG.sync.write(diff))
      entry.diffShot = diffPath
      entry.mismatch = mismatch
      entry.comparablePixels = comparable
      entry.regression = mismatch > failFraction
      process.stdout.write(
        `${(mismatch * 100).toFixed(3)}% ${entry.regression ? 'REGRESSION' : 'ok'}\n`,
      )
    } else {
      entry.regression = true
      process.stdout.write(
        `capture failed (local:${local.ok ? 'ok' : local.error}) (ref:${reference.ok ? 'ok' : reference.error})\n`,
      )
    }

    results.push(entry)
  }

  await browser.close()

  const meta = {
    generatedAt: new Date().toISOString(),
    targets,
    viewport,
    deviceScaleFactor,
    failFraction,
    matchThreshold,
  }
  fs.writeFileSync(
    path.join(outDir, 'results.json'),
    JSON.stringify({ meta, results }, null, 2),
  )

  generateReport(outDir, meta, results)

  const regressions = results.filter((r) => r.regression)
  console.log(
    `\n${results.length} scenarios, ${regressions.length} flagged. Report: ${path.join(outDir, 'report.html')}`,
  )
  process.exitCode = regressions.length > 0 ? 1 : 0
}

run().catch((err) => {
  console.error(err)
  process.exit(2)
})
