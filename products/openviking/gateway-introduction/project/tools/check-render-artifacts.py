#!/usr/bin/env python3
"""Check known gateway-film regressions in the full 1080p30 cut.

Usage: python3 tools/check-render-artifacts.py renders/OV-Gateway-preview-v8.mp4
The time windows/coordinates belong to this edit; update after editorial changes.
This checks specific rendering defects, not the quality of the entire video.
"""
import subprocess
import sys


def pixels(video, start, duration, crop):
    return subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(start), '-i', video,
        '-t', str(duration), '-vf', crop, '-pix_fmt', 'gray',
        '-f', 'rawvideo', '-',
    ])


def main(video):
    failures = []
    # The model stays left of this strip in both windows. A dark patch here
    # is a leaked texture tile, not the intended model node or subtitle.
    for start, duration in [(45.4, 34 / 30), (50.9, 66 / 30)]:
        data = pixels(video, start, duration, 'crop=24:250:1896:250')
        size = 24 * 250
        if len(data) != round(duration * 30) * size:
            failures.append(f'{start}s: unexpected frame count')
        bad = [i // size for i in range(0, len(data), size)
               if sum(value < 70 for value in data[i:i + size]) > 10]
        print(f'{start}s: {len(data) // size} frames, {len(bad)} with dark artifacts')
        if bad:
            failures.append(f'{start}s: leaked model texture')

    # The old 1500px-wide title scrim cut through the model at x=1500.
    # Smooth shading should not produce a large average jump across that line.
    # Crop an even-aligned 4px strip, then compare x=1499 and x=1500.
    data = pixels(video, 108, 1 / 30, 'crop=4:70:1498:90')
    if len(data) != 4 * 70:
        failures.append('108s: missing seam-check frame')
    else:
        delta = sum(abs(data[y * 4 + 1] - data[y * 4 + 2]) for y in range(70)) / 70
        print(f'108s: mean mask-edge luminance jump {delta:.2f} (limit 8)')
        if delta > 8:
            failures.append('108s: hard title-mask boundary')
    if failures:
        raise SystemExit('; '.join(failures))
    print('RENDER-ARTIFACT-CHECK-PASS')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
