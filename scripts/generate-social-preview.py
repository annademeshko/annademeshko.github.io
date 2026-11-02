"""Build 1200 × 630 social cards matching the current portfolio homepages.

Requires Pillow, fonttools and brotli. Uses the site's own handwritten font.
Run: python scripts/generate-social-preview.py
SOCIAL_FONT_DIR can override the directory with DejaVu Sans fonts.
"""
from io import BytesIO
from pathlib import Path
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
S = 2
FONT = Path(os.environ.get('SOCIAL_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
PINK = '#ed2e8e'
BLACK = '#090909'
BLUE = '#0d79ff'


def handwritten(size):
    font = TTFont(ROOT / 'assets/fonts/covered-by-your-grace.woff2')
    font.flavor = None
    stream = BytesIO()
    font.save(stream)
    stream.seek(0)
    return ImageFont.truetype(stream, size * S)


def render(lang, pink=False):
    bg = PINK if pink else '#fcfcfd'
    ink = BLACK if pink else '#202124'
    muted = BLACK if pink else '#666a73'
    accent = BLACK if pink else BLUE
    canvas = Image.new('RGB', (1200*S, 630*S), bg)
    d = ImageDraw.Draw(canvas)

    def rect(box, fill, radius=0):
        d.rounded_rectangle(tuple(int(v*S) for v in box), radius*S, fill)

    def text(x, y, value, size=24, color=ink, bold=False, hand=False):
        f = handwritten(size) if hand else ImageFont.truetype(
            str(FONT / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')), size*S)
        d.text((x*S, y*S), value, font=f, fill=color)
        return d.textlength(value, font=f)/S

    portrait = Image.open(ROOT/'assets/profile/anna-demeshko-400.webp').convert('RGB')
    if pink:
        portrait = ImageOps.grayscale(portrait).convert('RGB')
    portrait = portrait.resize((72*S, 72*S), Image.Resampling.LANCZOS)
    canvas.paste(portrait, (64*S, 54*S))
    text(154, 59, 'АННА ДЕМЕШКО' if lang == 'ru' else 'ANNA DEMESHKO', 17, bold=True)
    text(154, 89, 'Портфолио · 2026' if lang == 'ru' else 'Portfolio · 2026', 17, muted)

    if pink:
        text(60, 158, 'ANNA', 96, hand=True)
        text(60, 247, 'DEMESHKO', 96, hand=True)
        # The homepage's black selection highlight and white handles.
        rect((64, 368, 386, 413), BLACK)
        text(70, 372, 'Product Designer', 32, 'white')
        lines = ['I turn complex flows', 'into products that feel effortless.']
        # The three theme choices from the current English homepage.
        for label, x, selected in [('PINK', 880, True), ('WHITE', 973, False), ('BLACK', 1080, False)]:
            if selected:
                rect((x-9, 55, x+70, 95), BLACK)
            text(x, 52, label, 27, 'white' if selected else BLACK, hand=True)
    else:
        text(60, 177, 'Анна' if lang == 'ru' else 'Anna', 74, bold=True)
        text(60, 261, 'Демешко' if lang == 'ru' else 'Demeshko', 66, bold=True)
        rect((64, 368, 386, 413), '#d7e7ff')
        text(70, 372, 'Product Designer', 32)
        lines = (['Распутываю сложные сценарии.', 'Делаю продукты понятнее.'] if lang == 'ru'
                 else ['I untangle complex flows.', 'And make products feel simple.'])
    handle = 'white' if pink else BLUE
    for x, top, bottom in [(64, 360, 413), (386, 368, 421)]:
        d.line((x*S, top*S, x*S, bottom*S), fill=handle, width=2*S)
    for x, y in [(64, 360), (386, 421)]:
        d.ellipse(((x-4)*S, (y-4)*S, (x+4)*S, (y+4)*S), fill=handle)
    for i, line in enumerate(lines):
        text(64, 445+i*33, line, 23, muted)
    text(64, 557, 'B2B · B2C · Cybersecurity · AI', 19, muted)

    # Preserve the complete REMATE artwork, without an extra panel or crop.
    source = Image.open(ROOT/'assets/remate/cover-transparent-v6.png').convert('RGBA')
    source.thumbnail((710*S, 400*S), Image.Resampling.LANCZOS)
    canvas.paste(source, (470*S, 140*S), source)
    d = ImageDraw.Draw(canvas)
    d.polygon([(1030*S, 493*S), (1040*S, 524*S), (1048*S, 512*S), (1062*S, 508*S)], fill=accent)
    rect((1052, 519, 1138, 551), accent, radius=7)
    text(1063, 524, 'Аня' if lang == 'ru' else 'Anna', 17, 'white', True)
    filename = f'portfolio-{lang}-{"pink" if pink else "light"}-v6.png'
    canvas.resize((1200, 630), Image.Resampling.LANCZOS).save(ROOT/'assets/social'/filename, optimize=True)
    print(filename)


if __name__ == '__main__':
    render('en', pink=True)
    render('en')
    render('ru')
