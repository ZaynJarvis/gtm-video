#!/usr/bin/env python3
"""Effects bed for shots 03–05 (35 s). Event times follow shots/seq03-05.html."""
import sys
from sfxlib import Bed, tick, thump, whoosh, arpeggio

b = Bed(35.0, edit='seq03-05')
b.room_tone()


def typing(t0, t1, every=0.07, level=-37):
    t = t0
    while t < t1:
        b.add(t, tick(3200, 0.03), level)
        t += every


# 03 · change two settings
b.add(0.00, whoosh(0.6, 150, 700), -34)      # shot 02 falls out of focus
b.add(0.55, whoosh(0.7, 300, 1400), -35)     # editor comes forward
b.add(2.95, tick(2400, 0.05), -33)           # select old base_url
b.add(3.25, tick(700, 0.08), -30)            # delete
typing(3.30, 4.55)
b.add(4.55, tick(1800), -32)                 # line 2 done
b.add(5.00, tick(2400, 0.05), -33)
b.add(5.25, tick(700, 0.08), -30)
typing(5.30, 6.50)
b.add(6.55, tick(1800), -32)                 # line 3 done
b.add(7.46, whoosh(1.6, 150, 900), -33)      # pull back
b.add(7.96, thump(), -30)                    # product name lands
b.add(8.01, tick(1320, 0.3), -33)
b.add(8.21, tick(2000), -33)                 # workflow nodes switch address
# 04 · same question
b.add(10.70, whoosh(0.8, 200, 1200), -33)    # editor folds into the app
typing(12.0, 13.0, 0.08, -37)
b.add(13.25, tick(900, 0.1), -28)            # both send
b.add(13.28, tick(950, 0.1), -32)
typing(13.70, 14.70, 0.13, -42)              # left answer streams
typing(13.90, 15.10, 0.13, -41)              # right answer streams
b.add(15.00, whoosh(1.6, 150, 800), -35)     # push in on the right answer
# 05 · what the gateway is
b.add(18.90, whoosh(2.4, 100, 600), -31)     # rise into the first full view of the stage
b.add(20.90, tick(1600), -30)                # gate glows
b.add(22.35, whoosh(0.9, 500, 2000), -35)    # routes draw
b.add(23.00, tick(2000, 0.06), -34)
b.add(23.90, whoosh(1.4, 150, 900), -34)     # pan to the plugin cluster
for k in range(8):
    b.add(24.60 + 0.09 * k, tick(2600, 0.05), -36)   # OV badges
b.add(25.30, whoosh(0.8, 400, 1600), -37)    # plugins' own road
b.add(26.30, whoosh(1.6, 150, 900), -34)
for i in range(3):
    t0 = 29.3 + i * 0.3
    b.add(t0, whoosh(0.8, 500, 2200), -37)   # request into the gate
    b.add(t0 + 0.8, tick(1600, 0.08), -34)   # recall pulse
    b.add(t0 + 1.25, tick(1200, 0.12), -34)  # hub
    t1 = 31.7 + i * 0.3
    b.add(t1, whoosh(0.6, 500, 2000), -37)   # reply back
    b.add(t1 + 0.55, tick(1500, 0.08), -35)  # save pulse
b.add(33.30, whoosh(1.7, 150, 1100), -31)    # dive into the in-house agent
print('peak', round(b.write(sys.argv[1] if len(sys.argv) > 1 else 'sfx_seq0305.wav'), 3))
