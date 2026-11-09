#!/usr/bin/env python3
"""Mix narration + effects bed for one sequence, following its edit spans (shots/edits.json).

    python3 mix.py seq01-02        -> seq01-02_mix.wav

Narration segments are placed on the shot timeline (as listed below) and moved to the edited output time;
no segment starts inside an edit span, so speech is never sped up. Effects are ducked under the voice.
"""
import subprocess
import sys
from pathlib import Path

from editmap import EditMap

HERE = Path(__file__).resolve().parent
VO = HERE.parents[1] / 'voiceover-v2.1'

# (file, source start, source end or None, placement on the shot timeline)
SEGMENTS = {
    'seq01-02': [('S01', 0, None, 1.2), ('S02', 0, 6.1, 11.0), ('S02', 6.1, 8.3, 16.98), ('S02', 8.3, None, 19.21)],
    'seq03-05': [('S03b', 0, None, 0.5), ('S04', 0, 3.6, 11.6), ('S04', 3.6, None, 15.11),
                 ('S05', 0, 4.3, 19.9), ('S05', 4.3, 6.5, 24.12), ('S05', 6.5, None, 26.62)],
    'shot06':   [('S06', 0, 3.85, 0.8), ('S06', 3.85, 7.1, 5.27), ('S06', 7.1, 12.3, 9.21),
                 ('S06', 12.3, 15.6, 16.75), ('S06', 15.6, None, 19.71)],
    'seq07-09': [('S07', 0, None, 0.5), ('S08c', 0, None, 11.3), ('S09b', 0, None, 30.0)],
}
SFX = {'seq01-02': 'sfx_seq0102.wav', 'seq03-05': 'sfx_seq0305.wav', 'shot06': 'sfx_shot06.wav', 'seq07-09': 'sfx_seq0709.wav'}


def main(name):
    m = EditMap(name)
    segs = SEGMENTS[name]
    files = sorted({f for f, *_ in segs})
    inputs = sum((['-i', str(VO / f'{f}.mp3')] for f in files), []) + ['-i', str(HERE / SFX[name])]
    chains, labels = [], []
    for k, (f, a, b, place) in enumerate(segs):
        trim = f'atrim={a}' + (f':{b}' if b is not None else '')
        delay = int(round(m.tl_to_out(place) * 1000))
        chains.append(f'[{files.index(f)}]{trim},asetpts=PTS-STARTPTS,adelay={delay}:all=1[v{k}]')
        labels.append(f'[v{k}]')
    fx = len(files)
    graph = ';'.join(chains + [
        ''.join(labels) + f'amix=inputs={len(segs)}:normalize=0,apad=whole_dur={m.out_dur:.3f},aresample=48000[vo]',
        '[vo]asplit=2[vo1][vokey]',
        f'[{fx}]aresample=48000,volume=5dB[fx]',
        '[fx][vokey]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=250[fxd]',
        '[vo1][fxd]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[o]',
    ])
    out = HERE / f'{name}_mix.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[o]',
                    '-t', f'{m.out_dur:.3f}', '-ar', '48000', '-c:a', 'pcm_s16le', str(out)], check=True)
    print(f'mix -> {out.name} ({m.out_dur:.2f} s)')


if __name__ == '__main__':
    main(sys.argv[1])
