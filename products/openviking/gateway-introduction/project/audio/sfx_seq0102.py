#!/usr/bin/env python3
"""Effects bed for shots 01–02 (27 s). Event times follow shots/seq01-02.html."""
import sys
from sfxlib import Bed, tick, thump, whoosh, paper

b = Bed(27.0, edit='seq01-02')
b.room_tone()


def typing(t0, t1, every=0.07, level=-37):
    t = t0
    while t < t1:
        b.add(t, tick(3200, 0.03), level)
        t += every


# 01 · plugin constellation
b.add(0.10, thump(), -32)                    # OpenViking appears
b.add(0.12, tick(1320, 0.3), -34)
b.add(0.20, whoosh(2.2, 120, 700), -35)      # pull back as logos land
for i in range(10):
    b.add(0.35 + i * 0.14, tick(2400 + (i % 3) * 300, 0.05), -37)
b.add(3.00, whoosh(1.1, 150, 900), -34)      # push in on Claude Code
b.add(3.55, tick(1600), -31)                 # recall pulse
b.add(3.65, tick(2600, 0.05), -36)
b.add(4.25, tick(1300), -31)                 # capture pulse
b.add(4.30, tick(2600, 0.05), -36)
b.add(5.20, whoosh(1.0, 150, 800), -35)
b.add(5.45, whoosh(0.9, 600, 2600), -35)     # memory travels to Codex
b.add(6.45, tick(2000), -28)                 # Codex recalls it
b.add(7.00, whoosh(1.4, 150, 900), -34)      # pull back
t, step = 7.45, 0.03
for k in range(14):                          # counter 0 → 14, slowing down
    b.add(t, tick(3000, 0.03), -40)
    t += step
    step *= 1.12
b.add(7.60, thump(), -33)
# 02 · apps no plugin can reach
b.add(9.80, whoosh(1.7, 150, 900), -33)      # slide past the constellation's edge
b.add(10.90, thump(), -34)                   # in-house agent lands
b.add(11.10, thump(), -34)                   # workflow bot lands
typing(12.6, 13.4)
b.add(13.50, tick(900, 0.1), -29)            # send
typing(13.85, 14.4, 0.13, -41)
b.add(14.85, tick(2000, 0.06), -34)          # workflow model nodes
b.add(15.90, tick(500, 0.12), -30)           # "plugins not supported"
b.add(16.10, tick(500, 0.12), -31)
for t in (17.35, 18.30):                     # Wednesday, Friday: blank again
    b.add(t, tick(1800, 0.06), -33)
    b.add(t + 0.30, tick(900, 0.1), -31)
b.add(19.40, whoosh(1.5, 150, 900), -34)     # pull back
for t in (21.55, 22.50, 22.95, 23.35, 23.70):  # integration work piles up
    b.add(t, thump(), -33)
    b.add(t, paper(), -37)
b.add(24.00, whoosh(0.5, 300, 1400), -37)    # more apps
b.add(24.25, whoosh(0.5, 300, 1400), -37)
for t in (24.30, 24.45, 24.60, 24.75):
    b.add(t, paper(), -37)
b.add(25.30, tick(2200, 0.06), -33)          # MCP: tools slot fills
b.add(25.80, tick(700, 0.1), -33)            # auto recall / save stay empty
b.add(26.30, tick(700, 0.1), -34)
print('peak', round(b.write(sys.argv[1] if len(sys.argv) > 1 else 'sfx_seq0102.wav'), 3))
