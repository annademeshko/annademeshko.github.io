"""Render the brand-pink AD favicon using the homepage's handwritten font.
Requires Pillow, fonttools and brotli. Run from any directory.
"""
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
S = 4
SIZE = 256
font = TTFont(ROOT / 'assets/fonts/covered-by-your-grace.woff2')
font.flavor = None
stream = BytesIO()
font.save(stream)
stream.seek(0)
face = ImageFont.truetype(stream, 230*S)
im = Image.new('RGB', (SIZE*S, SIZE*S), '#ED2E8E')
draw = ImageDraw.Draw(im)
box = draw.textbbox((0, 0), 'AD', font=face)
x = (SIZE*S - (box[2]-box[0]))/2-box[0]
y = (SIZE*S - (box[3]-box[1]))/2-box[1]
assert box[2]-box[0] < 232*S
assert box[3]-box[1] < 232*S
draw.text((x, y), 'AD', font=face, fill='#090909')
im = im.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
im.save(ROOT/'assets/favicon-ad.png', optimize=True)
im.save(ROOT/'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(256,256)])
print('Rendered AD favicon: Covered By Your Grace, #090909 on #ED2E8E.')
