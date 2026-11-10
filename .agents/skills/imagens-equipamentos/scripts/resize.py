"""Normalize an already selected Pixabay download locally. Pillow approved by owner."""
import argparse
from pathlib import Path

from PIL import Image, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
with Image.open(args.source) as original:
    image = ImageOps.exif_transpose(original).convert('RGB')
    image = ImageOps.pad(image, (800, 600), color='white')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp')
    image.save(temporary, format='PNG')
    with Image.open(temporary) as check:
        check.verify()
    temporary.replace(args.output)
