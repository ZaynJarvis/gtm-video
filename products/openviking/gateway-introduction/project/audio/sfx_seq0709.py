#!/usr/bin/env python3
"""Effects bed for shots 07–09 (39 s). Event times follow shots/seq07-09.html (local time)."""
import sys
from sfxlib import Bed, tick, thump, whoosh, paper, arpeggio

b = Bed(39.0, edit='seq07-09')
b.room_tone()


def typing(t0, t1, every=0.07, level=-37):
    t = t0
    while t < t1:
        b.add(t, tick(3200, 0.03), level)
        t += every


# 07 · memory follows the person
b.add(0.15, whoosh(0.8, 120, 700), -34)      # reasoning panel folds back
b.add(0.50, thump(), -34)                    # headline
b.add(1.00, whoosh(1.6, 150, 800), -35)
b.add(2.60, tick(900, 0.1), -29)             # Monday message sent
typing(3.05, 3.6, 0.13, -41)
b.add(3.70, whoosh(1.3, 150, 900), -35)
b.add(4.00, whoosh(1.0, 300, 1600), -36)     # the turn heads into the gateway
b.add(4.45, tick(1600, 0.08), -33)           # conduit, down
b.add(5.00, tick(1200, 0.12), -33)           # hub
b.add(5.40, arpeggio(), -26)                 # preference memory forms
b.add(5.50, whoosh(1.3, 150, 900), -35)      # over to the ops bot
b.add(6.30, tick(900, 0.1), -29)             # Wednesday question
b.add(6.50, whoosh(0.8, 500, 2200), -36)
b.add(7.25, tick(1600, 0.08), -32)           # recall pulse
b.add(7.65, tick(1200, 0.12), -33)
b.add(7.70, whoosh(0.8, 400, 2200), -34)     # the same memory rides up
b.add(8.45, tick(2000), -30)
b.add(8.50, whoosh(0.7, 500, 2000), -36)     # reply back
b.add(9.10, tick(2400, 0.06), -32)           # "已从记忆补充"
typing(9.2, 10.2, 0.13, -41)
# 08 · for the team
b.add(10.60, whoosh(1.9, 100, 700), -32)     # rise to the console
b.add(11.70, tick(2200, 0.06), -34)
b.add(13.30, tick(1800), -31)                # running
b.add(14.60, tick(1320, 0.3), -33)           # no deployment
b.add(15.90, tick(2000), -32)                # one address
b.add(15.95, thump(), -33)
b.add(17.40, tick(3000, 0.04), -34)          # tab
b.add(17.90, tick(2400, 0.05), -35)
b.add(18.05, tick(2400, 0.05), -35)
b.add(19.15, tick(3000, 0.04), -34)          # tab
b.add(19.85, tick(1000, 0.08), -30)          # click: issue key
b.add(19.95, whoosh(0.25, 600, 2400), -38)
typing(20.05, 20.7, 0.05, -37)
b.add(20.70, tick(1000, 0.08), -30)
b.add(20.85, whoosh(0.4, 500, 2000), -36)    # new key row
b.add(20.90, tick(2200, 0.06), -33)
b.add(21.40, tick(600, 0.1), -33)            # revoke
b.add(21.90, whoosh(1.3, 150, 900), -32)     # tilt down to the store
b.add(22.60, thump(), -33)                   # lanes
b.add(22.75, thump(), -34)
for k in range(6):
    b.add(22.75 + 0.02 * k, paper(), -40)
b.add(23.80, whoosh(1.1, 150, 900), -35)
b.add(23.95, tick(2000), -31)                # request log
b.add(24.60, tick(700, 0.1), -32)            # content redacted
b.add(25.50, thump(), -32)                   # security & privacy line
# 09 · close
b.add(28.60, whoosh(2.0, 100, 600), -31)     # pull back to the whole stage
b.add(29.40, whoosh(0.8, 400, 1600), -37)    # plugins' road
b.add(30.00, whoosh(0.7, 500, 2200), -36)
b.add(30.70, tick(1600, 0.08), -33)
b.add(30.90, whoosh(0.6, 500, 2000), -36)
b.add(31.10, tick(1200, 0.12), -33)
b.add(31.70, whoosh(1.0, 500, 2000), -36)
b.add(32.10, tick(1500, 0.08), -34)
b.add(32.55, tick(1200, 0.12), -34)
b.add(32.60, whoosh(1.0, 100, 500), -33)     # to paper white
b.add(32.95, thump(), -28)                   # product name
b.add(32.97, tick(1320, 0.4), -31)
b.add(33.30, tick(2200, 0.06), -36)
b.add(34.00, arpeggio(), -28)                # tagline
print('peak', round(b.write(sys.argv[1] if len(sys.argv) > 1 else 'sfx_seq0709.wav'), 3))
