"""Shared synth helpers for the effects beds (stdlib only). Palette: 动效与界面指导 §8."""
import math
import random
import struct
import sys
import wave

SR = 48000
DUR = 26.0
N = int(SR * DUR)
buf = [0.0] * N
rng = random.Random(6)


def db(x):
    return 10 ** (x / 20)


class Bed:
    """An effects bed. With `edit`, event times are given on the shot timeline and land on the edited output
    (see shots/edits.json), and the bed is as long as the edited shot."""

    def __init__(self, dur, edit=None):
        self.map = lambda t: t
        if edit:
            from editmap import EditMap
            m = EditMap(edit)
            if m.spans:
                self.map, dur = m.tl_to_out, m.out_dur
        self.n = int(SR * dur)
        self.buf = [0.0] * self.n

    def add(self, t, samples, level_db):
        g = db(level_db)
        i0 = int(self.map(t) * SR)
        for k, s in enumerate(samples):
            i = i0 + k
            if 0 <= i < self.n:
                self.buf[i] += s * g

    def room_tone(self, level_db=-44):
        y, a = 0.0, 1 - math.exp(-2 * math.pi * 400 / SR)
        for i in range(self.n):
            y += a * (rng.uniform(-1, 1) - y)
            self.buf[i] += y * db(level_db)

    def write(self, path):
        peak = max(abs(s) for s in self.buf)
        scale = min(1.0, 0.89 / peak)
        with wave.open(path, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s * scale)) * 32767)) for s in self.buf))
        return peak


def reverb(samples, taps=((0.031, .35), (0.053, .22), (0.089, .14), (0.137, .08))):
    out = samples + [0.0] * int(0.2 * SR)
    for d, g in taps:
        off = int(d * SR)
        for k, s in enumerate(samples):
            out[k + off] += s * g
    return out


def tone(freq, dur, decay=18.0, attack=0.003):
    n = int(dur * SR)
    return [math.sin(2 * math.pi * freq * k / SR) * min(1, k / (attack * SR)) * math.exp(-decay * k / SR) for k in range(n)]


def tick(freq=2000, dur=0.12):
    return reverb(tone(freq, dur, decay=40))


def thump():
    n = int(0.22 * SR)
    out, ph = [], 0.0
    for k in range(n):
        f = 140 - 70 * (k / n)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-16 * k / SR) * min(1, k / (0.002 * SR)))
    return out


def whoosh(dur, lo=300, hi=2400):
    """Noise through a one-pole low-pass whose cutoff rises then falls; raised-cosine envelope."""
    n = int(dur * SR)
    out, y = [], 0.0
    for k in range(n):
        p = k / n
        env = math.sin(math.pi * p) ** 2
        fc = lo + (hi - lo) * math.sin(math.pi * p)
        a = 1 - math.exp(-2 * math.pi * fc / SR)
        y += a * (rng.uniform(-1, 1) - y)
        out.append(y * env * 2.2)
    return out


def paper():
    n = int(0.18 * SR)
    out, prev = [], 0.0
    for k in range(n):
        x = rng.uniform(-1, 1)
        out.append((x - prev) * math.exp(-22 * k / SR))  # crude high-pass
        prev = x
    return out


def double_tone():
    a = tone(1000, 0.14, decay=30)
    b = tone(1500, 0.18, decay=26)
    gap = int(0.09 * SR)
    out = a + [0.0] * (gap + len(b))
    for k, s in enumerate(b):
        out[gap + k] += s
    return reverb(out)


def arpeggio():
    notes = (880.0, 1108.7, 1318.5)
    out = [0.0] * int(0.7 * SR)
    for i, f in enumerate(notes):
        t = tone(f, 0.4, decay=10)
        off = int(i * 0.11 * SR)
        for k, s in enumerate(t):
            out[off + k] += s * 0.8
    return reverb(out)
