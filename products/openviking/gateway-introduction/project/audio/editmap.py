"""Timeline-time → output-time map for the edit spans in shots/edits.json (mirrors editmap.mjs)."""
import json
from pathlib import Path

EDITS = Path(__file__).resolve().parents[1] / 'shots' / 'edits.json'


def warp(u, r):
    return (-2 * u ** 3 + 3 * u ** 2) + r * (2 * u ** 3 - 3 * u ** 2 + u)


class EditMap:
    def __init__(self, name):
        e = json.loads(EDITS.read_text(encoding='utf-8')).get(name)
        self.spans = sorted(e['spans']) if e else []
        self.dur = e['dur'] if e else None
        self.out_dur = (self.dur - sum((b - a) - d for a, b, d in self.spans)) if e else None

    def tl_to_out(self, t):
        shift = 0.0
        for a, b, d in self.spans:
            if t < a:
                return t - shift
            if t < b:
                # invert the warp by bisection (it is monotonic for r <= 3)
                r, target = d / (b - a), (t - a) / (b - a)
                lo, hi = 0.0, 1.0
                for _ in range(40):
                    mid = (lo + hi) / 2
                    lo, hi = (mid, hi) if warp(mid, r) < target else (lo, mid)
                return a - shift + d * lo
            shift += (b - a) - d
        return t - shift
