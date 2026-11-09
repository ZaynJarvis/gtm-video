#!/usr/bin/env python3
"""Effects bed for shot 06 (26 s timeline). Event times follow shots/tl06.js; the bed follows shots/edits.json."""
import sys
from sfxlib import Bed, tick, thump, whoosh, paper, double_tone, arpeggio

b = Bed(26.0, edit='shot06')
b.room_tone()

# --- events (seconds, matching the GSAP timeline in shots/shot06.html, V2) ---
b.add(0.35, tick(900, 0.1), -30)          # bubble folds into a capsule
b.add(0.90, whoosh(1.4), -31)             # capsule travels to the gate
b.add(2.40, whoosh(1.4, 150, 900), -33)   # camera drops toward the store
b.add(2.75, tick(1600), -31)              # query leaves down the conduit
b.add(2.75, whoosh(0.7, 600, 2600), -36)
b.add(3.40, tick(1200, 0.15), -30)        # hub pulse
b.add(4.10, tick(2000), -23)              # memory hit
b.add(4.35, whoosh(0.5, 400, 1800), -34)  # card lifts
b.add(5.00, whoosh(1.2, 400, 2200), -32)  # card rides the conduit up
b.add(6.15, thump(), -24)                 # memory attaches to the message
b.add(6.60, whoosh(0.8, 120, 700), -32)   # model opens into the panel
for k, t in enumerate((7.80, 7.98, 8.16)):
    b.add(t, tick(2200 + 200 * k, 0.07), -33)  # input rows unpack
b.add(8.50, tick(1000, 0.08), -33)        # timeline starts
b.add(10.00, tick(1800), -31)             # model decides to read the source
b.add(10.85, double_tone(), -27)          # tool call
b.add(11.20, whoosh(1.0), -33)
b.add(12.15, tick(1400), -29)             # gateway's tool port lights
b.add(12.40, whoosh(0.55, 500, 2200), -35)  # conduit, down
b.add(12.95, paper(), -30)                # document opens
b.add(13.65, tick(2000), -30)             # source line highlighted
b.add(14.10, whoosh(1.1), -33)            # result back up to the model
b.add(15.15, thump(), -26)                # tool result row lands
t = 16.05
while t < 17.0:                         # reply forms in the panel
    b.add(t, tick(2600, 0.04), -42)
    t += 0.13
b.add(17.10, whoosh(1.35), -31)           # reply travels back to the app
t = 18.45
while t < 19.6:                         # answer streams in the app
    b.add(t, tick(2600, 0.04), -41)
    t += 0.13
b.add(19.80, whoosh(1.5, 150, 800), -35)  # camera pulls back
b.add(20.40, whoosh(1.4, 300, 1600), -33) # turn heads into the gate
b.add(21.00, whoosh(0.8, 500, 2200), -35) # conduit, down
b.add(21.85, tick(1200, 0.15), -31)       # hub pulse
b.add(23.05, arpeggio(), -25)             # new memory crystallizes
b.add(23.45, whoosh(0.8, 400, 1500), -35)
b.add(23.90, thump(), -31)                # memory settles

print('peak', round(b.write(sys.argv[1] if len(sys.argv) > 1 else 'sfx_shot06.wav'), 3))
