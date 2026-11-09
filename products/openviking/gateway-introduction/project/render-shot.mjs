// Frame-accurate render of a GSAP shot page.
//   node render-shot.mjs shot06 stills 1.2 4.5 ...   -> renders/shot06/stills/t1.20.png
//   node render-shot.mjs shot06 frames                 -> renders/shot06/frames/%04d.jpg at 30 fps
// Stills take timeline times. Frames follow the shot's edit spans in shots/edits.json, if it has any.
import { chromium } from 'playwright';
import { loadEdit, outToTl } from './editmap.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const [name, mode = 'stills', ...times] = process.argv.slice(2);
const FPS = 30;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(pathToFileURL(path.join(root, 'shots', `${name}.html`)).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
if (errors.length) { console.error('page errors:', errors); }
const duration = await page.evaluate(() => window.__duration);

if (mode === 'stills') {
  const out = path.join(root, 'renders', name, 'stills');
  mkdirSync(out, { recursive: true });
  for (const t of times.map(Number)) {
    await page.evaluate((t) => window.__seek(t), t);
    await page.screenshot({ path: path.join(out, `t${t.toFixed(2)}.png`) });
  }
  console.log('stills ->', out);
} else {
  const out = path.join(root, 'renders', name, 'frames');
  mkdirSync(out, { recursive: true });
  const edit = loadEdit(pathToFileURL(root + '/'), name);
  const total = Math.round((edit ? edit.outDur : duration) * FPS);
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => window.__seek(t), outToTl(edit, f / FPS));
    await page.screenshot({ path: path.join(out, `${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 93 });
    if (f % 150 === 0) console.log(`frame ${f}/${total} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log('frames ->', out, total);
}
if (errors.length) console.error('errors:', errors.slice(0, 5));
await browser.close();
