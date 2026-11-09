// Render styleframes/K*.html to renders/styleframes/K*.png at 1920x1080.
import { chromium } from 'playwright';
import { readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'renders/styleframes');
mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);
const files = readdirSync(path.join(root, 'styleframes'))
  .filter((f) => /^K\d+\.html$/.test(f) && (!only.length || only.includes(f.replace('.html', ''))))
  .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (const f of files) {
  await page.goto(pathToFileURL(path.join(root, 'styleframes', f)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const fallback = await page.evaluate(() =>
    [...document.fonts].filter((ff) => ff.status === 'error').map((ff) => ff.family));
  await page.screenshot({ path: path.join(out, f.replace('.html', '.png')) });
  console.log(f, fallback.length ? 'font errors: ' + fallback.join(',') : 'ok');
}
await browser.close();
