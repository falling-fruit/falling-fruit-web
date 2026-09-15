/**
 * Generates a self-contained HTML report showing, per scenario, the local
 * capture, the reference capture, and the pixel diff side by side, sorted
 * worst-mismatch first so regressions surface at the top.
 */
const fs = require('fs')
const path = require('path')

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const pct = (v) => (v == null ? '—' : `${(v * 100).toFixed(3)}%`)

const generateReport = (outDir, meta, results) => {
  const sorted = [...results].sort((a, b) => {
    const am = a.mismatch == null ? Infinity : a.mismatch
    const bm = b.mismatch == null ? Infinity : b.mismatch
    return bm - am
  })

  const cell = (label, src) =>
    src
      ? `<figure><figcaption>${label}</figcaption><a href="${esc(src)}" target="_blank"><img src="${esc(src)}" loading="lazy"/></a></figure>`
      : `<figure class="missing"><figcaption>${label}</figcaption><div class="nofile">no capture</div></figure>`

  const rows = sorted
    .map((r) => {
      const status = r.localError || r.referenceError
        ? 'error'
        : r.regression
          ? 'regression'
          : 'ok'
      const errNote = [
        r.localError ? `local: ${esc(r.localError)}` : '',
        r.referenceError ? `reference: ${esc(r.referenceError)}` : '',
      ]
        .filter(Boolean)
        .join(' · ')
      return `
      <section class="scenario ${status}">
        <header>
          <h2>${esc(r.label)}</h2>
          <div class="meta">
            <code>${esc(r.path)}</code>
            <span class="badge ${status}">${status.toUpperCase()}</span>
            <span class="mismatch">mismatch: <strong>${pct(r.mismatch)}</strong></span>
          </div>
          ${errNote ? `<div class="error-note">${errNote}</div>` : ''}
        </header>
        <div class="triptych">
          ${cell('local', r.localShot)}
          ${cell('reference', r.referenceShot)}
          ${cell('diff', r.diffShot)}
        </div>
      </section>`
    })
    .join('\n')

  const regressions = results.filter((r) => r.regression).length

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Location drawer visual diff</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, system-ui, sans-serif; margin: 0; background: #14161a; color: #e7e9ee; }
  .top { padding: 20px 24px; border-bottom: 1px solid #2a2e36; position: sticky; top: 0; background: #14161a; z-index: 2; }
  .top h1 { margin: 0 0 6px; font-size: 18px; }
  .top .sub { color: #9aa0ab; font-size: 13px; }
  .summary { margin-top: 8px; font-size: 13px; }
  .summary .pill { display: inline-block; padding: 2px 8px; border-radius: 10px; margin-right: 8px; }
  .pill.pass { background: #16351f; color: #7ee29a; }
  .pill.fail { background: #3a1b1b; color: #ff9a9a; }
  .scenario { padding: 18px 24px; border-bottom: 1px solid #23272f; }
  .scenario header { margin-bottom: 12px; }
  .scenario h2 { margin: 0 0 4px; font-size: 15px; }
  .meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #9aa0ab; flex-wrap: wrap; }
  .meta code { background: #1d2027; padding: 2px 6px; border-radius: 4px; color: #c7ccd6; }
  .badge { padding: 1px 8px; border-radius: 9px; font-weight: 600; }
  .badge.ok { background: #16351f; color: #7ee29a; }
  .badge.regression { background: #3a1b1b; color: #ff9a9a; }
  .badge.error { background: #3a2f14; color: #ffcf7a; }
  .error-note { margin-top: 6px; color: #ffcf7a; font-size: 12px; }
  .triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  figure { margin: 0; background: #1b1e24; border: 1px solid #2a2e36; border-radius: 8px; overflow: hidden; }
  figcaption { padding: 6px 10px; font-size: 11px; color: #9aa0ab; border-bottom: 1px solid #2a2e36; text-transform: uppercase; letter-spacing: .05em; }
  figure img { display: block; width: 100%; height: auto; background: #000; }
  figure.missing .nofile { padding: 40px; text-align: center; color: #6b7180; font-size: 12px; }
  .scenario.regression { background: #1c1416; }
  .scenario.error { background: #1c1a12; }
</style>
</head>
<body>
  <div class="top">
    <h1>Location drawer visual diff</h1>
    <div class="sub">local <code>${esc(meta.targets.local)}</code> vs reference <code>${esc(meta.targets.reference)}</code></div>
    <div class="sub">viewport ${meta.viewport.width}×${meta.viewport.height} @${meta.deviceScaleFactor}x · fail &gt; ${(meta.failFraction * 100).toFixed(3)}% · generated ${esc(meta.generatedAt)}</div>
    <div class="summary">
      <span class="pill ${regressions ? 'fail' : 'pass'}">${regressions} flagged</span>
      <span class="pill pass">${results.length - regressions} ok</span>
    </div>
  </div>
  ${rows}
</body>
</html>`

  fs.writeFileSync(path.join(outDir, 'report.html'), html)
}

module.exports = { generateReport }
