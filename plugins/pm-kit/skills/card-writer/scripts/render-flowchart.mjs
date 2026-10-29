// Render a Mermaid flowchart to a PNG for a card.
// Usage: node render-flowchart.mjs <input.mmd> <output.png> [WIDTHxHEIGHT]
// Needs Chrome, Chromium or Edge (headless) and network access to cdn.jsdelivr.net for Mermaid.
// Set CHROME_PATH to use a browser this script does not find on its own.
// The diagram is scaled to fill the frame, so pick a frame shaped like the chart:
// wide (1400x600, the default) for `flowchart LR`, tall (900x1100) for `flowchart TD`.
//
// Exit codes: 0 rendered (prints the PNG path) · 1 render failed · 2 bad usage.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix, resolve, win32 } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** `1400x600` → [1400, 600]; anything else → null. */
export function parseSize(size) {
  const m = /^(\d{2,5})x(\d{2,5})$/.exec(String(size).trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/** Mermaid source as text inside a <pre>: `&` first, or `&lt;` in a label decodes back to `<`. */
export function escapeForPre(src) {
  return src.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** Where a browser usually lives, per platform. PATH and CHROME_PATH are searched as well. */
export function candidateBrowsers(env = process.env, platform = process.platform) {
  // Path rules follow the platform asked about, not the one running this (tests ask for all three).
  const path = platform === 'win32' ? win32 : posix;
  const out = [];
  if (env.CHROME_PATH) out.push(env.CHROME_PATH);
  if (platform === 'win32') {
    const roots = [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA].filter(Boolean);
    for (const r of roots) {
      out.push(path.join(r, 'Google', 'Chrome', 'Application', 'chrome.exe'));
      out.push(path.join(r, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
      out.push(path.join(r, 'Chromium', 'Application', 'chrome.exe'));
    }
  } else if (platform === 'darwin') {
    for (const app of [
      'Google Chrome.app/Contents/MacOS/Google Chrome',
      'Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      'Chromium.app/Contents/MacOS/Chromium',
    ]) {
      out.push(`/Applications/${app}`);
      if (env.HOME) out.push(path.join(env.HOME, 'Applications', app));
    }
  }
  const names =
    platform === 'win32'
      ? ['chrome.exe', 'msedge.exe']
      : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'];
  for (const dir of (env.PATH ?? '').split(path.delimiter).filter(Boolean)) {
    for (const n of names) out.push(path.join(dir, n));
  }
  if (platform === 'linux') {
    out.push('/snap/bin/chromium');
    // WSL: no Linux browser is common, but the Windows one is reachable through /mnt/c.
    for (const p of [
      '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
      '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
    ]) {
      out.push(p);
    }
  }
  return [...new Set(out)];
}

/** A Windows browser run from WSL needs Windows paths for its page, profile and output. */
export function isWindowsExeFromWsl(browser, platform = process.platform) {
  return platform === 'linux' && /\.exe$/i.test(browser);
}

function winPath(p) {
  return execFileSync('wslpath', ['-w', p], { encoding: 'utf8' }).trim();
}

export function findBrowser(candidates, exists = existsSync) {
  return candidates.find((p) => exists(p));
}

function page(src) {
  // The page reports its own outcome in data-render, read back with --dump-dom: a syntax
  // error and a Mermaid that never loaded both still screenshot as a plausible PNG.
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%;background:#fff}
#c{box-sizing:border-box;width:100vw;height:100vh;padding:24px;display:flex;align-items:center;justify-content:center}
#c pre{width:100%;height:100%;margin:0}
#c svg{width:100%!important;height:100%!important;max-width:none!important}
</style></head><body data-render="pending"><div id="c"><pre class="mermaid">${escapeForPre(src)}</pre></div>
<div id="err" hidden></div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"></script>
<script>
(async () => {
  const b = document.body, err = document.getElementById('err');
  if (typeof mermaid === 'undefined') { b.dataset.render = 'no-mermaid'; return; }
  try {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'Segoe UI, Arial, sans-serif', flowchart: { useMaxWidth: true } });
    const pre = document.querySelector('pre.mermaid');
    await mermaid.parse(pre.textContent);
    await mermaid.run({ nodes: [pre] });
    b.dataset.render = document.querySelector('#c svg') ? 'ok' : 'no-svg';
  } catch (e) {
    b.dataset.render = 'error';
    err.textContent = String((e && e.message) || e);
  }
})();
</script>
</body></html>`;
}

function runBrowser(browser, args) {
  try {
    return execFileSync(browser, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    });
  } catch (e) {
    const detail = String(e.stderr || e.message || e)
      .trim()
      .split('\n')
      .slice(-5)
      .join('\n');
    throw new Error(`${browser} failed:\n${detail}`);
  }
}

export function main(argv) {
  const [input, output, size = '1400x600'] = argv;
  if (!input || !output) {
    console.error('usage: node render-flowchart.mjs <input.mmd> <output.png> [WIDTHxHEIGHT]');
    return 2;
  }
  const dims = parseSize(size);
  if (!dims) {
    console.error(`size must be WIDTHxHEIGHT in pixels, e.g. 1400x600 (got "${size}")`);
    return 2;
  }
  const candidates = candidateBrowsers();
  const browser = findBrowser(candidates);
  if (!browser) {
    const fixed = candidateBrowsers({ ...process.env, PATH: '' });
    console.error(
      'No Chrome, Chromium or Edge found. Set CHROME_PATH to one, or install one.\n' +
        `Looked on PATH and in:\n${fixed.join('\n')}`,
    );
    return 1;
  }

  const dir = mkdtempSync(join(tmpdir(), 'flowchart-'));
  // Set once we pre-create the output (WSL + Windows browser), so a failure
  // removes the empty placeholder instead of leaving a 0-byte PNG behind.
  let placeholder = null;
  try {
    const html = join(dir, 'flow.html');
    writeFileSync(html, page(readFileSync(input, 'utf8')));
    const win = isWindowsExeFromWsl(browser);
    const host = (p) => (win ? winPath(p) : p);
    const url = win ? `file:///${host(html).replace(/\\/g, '/')}` : pathToFileURL(html).href;
    const common = [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=8000',
      `--user-data-dir=${host(join(dir, 'profile'))}`,
    ];

    const dom = runBrowser(browser, [...common, '--dump-dom', url]);
    const state = /data-render="([^"]+)"/.exec(dom)?.[1] ?? 'unknown';
    if (state !== 'ok') {
      const why = /<div id="err"[^>]*>([\s\S]*?)<\/div>/.exec(dom)?.[1]?.trim();
      const reason =
        state === 'error'
          ? `Mermaid could not render the chart: ${why || 'syntax error'}`
          : state === 'no-mermaid'
            ? 'Mermaid did not load. Is cdn.jsdelivr.net reachable?'
            : `the chart did not render (state: ${state})`;
      console.error(`Render failed: ${reason}`);
      return 1;
    }

    const out = resolve(output);
    if (win) {
      writeFileSync(out, ''); // wslpath -w needs the file to exist
      placeholder = out;
    }
    runBrowser(browser, [
      ...common,
      '--hide-scrollbars',
      `--window-size=${dims[0]},${dims[1]}`,
      '--force-device-scale-factor=2',
      `--screenshot=${host(out)}`,
      url,
    ]);
    if (!existsSync(out) || statSync(out).size === 0) {
      console.error(`Render failed: no image written to ${out}`);
      if (placeholder) rmSync(placeholder, { force: true });
      return 1;
    }
    console.log(out);
    return 0;
  } catch (e) {
    console.error(`Render failed: ${e.message}`);
    if (placeholder) rmSync(placeholder, { force: true });
    return 1;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
