// Output-time ↔ timeline-time map for the edit spans in shots/edits.json.
// Inside a span the timeline runs faster along a cubic Hermite curve whose slope is 1 at both ends,
// so a camera move entering or leaving a squeezed stretch keeps its speed. Mirrors audio/editmap.py.
import { readFileSync } from 'node:fs';

export function loadEdit(root, name) {
  const all = JSON.parse(readFileSync(new URL('shots/edits.json', root), 'utf8'));
  const e = all[name];
  if (!e) return null;
  const spans = [...e.spans].sort((p, q) => p[0] - q[0]);
  const outDur = e.dur - spans.reduce((s, [a, b, d]) => s + (b - a) - d, 0);
  return { dur: e.dur, spans, outDur };
}

const warp = (u, r) => (-2 * u ** 3 + 3 * u ** 2) + r * (2 * u ** 3 - 3 * u ** 2 + u);

export function outToTl(edit, t) {
  if (!edit) return t;
  let shift = 0;                              // timeline seconds removed so far
  for (const [a, b, d] of edit.spans) {
    const oa = a - shift;                     // output time where this span starts
    if (t < oa) return t + shift;
    if (t < oa + d) return a + (b - a) * warp((t - oa) / d, d / (b - a));
    shift += (b - a) - d;
  }
  return t + shift;
}
