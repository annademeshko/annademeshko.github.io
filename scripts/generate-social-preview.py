"""Build localized 1200 × 630 link previews from existing portfolio assets.

Requires Pillow. Set SOCIAL_FONT_DIR to a directory containing
DejaVuSans.ttf and DejaVuSans-Bold.ttf if they are not installed system-wide.
Run from any directory: python scripts/generate-social-preview.py
"""
from pathlib import Path
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
S = 2
FONT = Path(os.environ.get('SOCIAL_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
BLUE = '#0d79ff'

def render(lang):
    canvas = Image.new('RGB', (1200*S, 630*S), '#fcfcfd')
    d = ImageDraw.Draw(canvas)
    def rect(box, fill, outline=None, radius=0, width=1):
        d.rounded_rectangle(tuple(int(v*S) for v in box), radius*S, fill, outline, width*S)
    def text(x,y,value,size=24,color='#202124',bold=False):
        font=ImageFont.truetype(str(FONT / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size*S)
        d.text((x*S,y*S),value,font=font,fill=color,stroke_width=0)
        return d.textlength(value,font=font)/S
    # The site's dotted canvas and softly blurred editor fragments.
    for x in range(650,1200,18):
        for y in range(0,630,18):
            d.ellipse((x*S,y*S,x*S+2,y*S+2),fill='#e0e4eb')
    haze=Image.new('RGBA',canvas.size,(252,252,253,0))
    h=ImageDraw.Draw(haze)
    h.rounded_rectangle((1000*S,-30*S,1120*S,55*S),8*S,fill='#c7efda')
    h.rounded_rectangle((565*S,85*S,625*S,142*S),6*S,fill='#f4d2f4')
    h.rounded_rectangle((1140*S,505*S,1220*S,590*S),8*S,fill='#c4e7ff')
    canvas.paste(haze.filter(ImageFilter.GaussianBlur(13*S)),(0,0),haze.filter(ImageFilter.GaussianBlur(13*S)))
    d=ImageDraw.Draw(canvas)
    # Compact identity block, echoing the portrait on the homepage.
    portrait=Image.open(ROOT/'assets/profile/anna-demeshko-400.webp').convert('RGB').resize((72*S,72*S),Image.Resampling.LANCZOS)
    canvas.paste(portrait,(64*S,58*S))
    text(154,63,'АННА ДЕМЕШКО' if lang=='ru' else 'ANNA DEMESHKO',17,bold=True)
    text(154,93,'Портфолио · 2026' if lang=='ru' else 'Portfolio · 2026',17,'#7a7d85')
    text(60,177,'Анна' if lang=='ru' else 'Anna',74,bold=True)
    text(60,261,'Демешко' if lang=='ru' else 'Demeshko',74,bold=True)
    # Familiar Figma text selection, made large enough for a chat preview.
    role='Product Designer'
    rect((64,368,386,413),'#d7e7ff')
    text(70,372,role,32)
    d.line((64*S,360*S,64*S,413*S),fill=BLUE,width=2*S)
    d.line((386*S,368*S,386*S,421*S),fill=BLUE,width=2*S)
    for x,y in [(64,360),(386,421)]:
        d.ellipse(((x-4)*S,(y-4)*S,(x+4)*S,(y+4)*S),fill=BLUE)
    lines=['Распутываю сложные сценарии.','Делаю продукты понятнее.'] if lang=='ru' else ['I untangle complex flows.','And make products feel simple.']
    for i,line in enumerate(lines): text(64,445+i*33,line,23,'#666a73')
    text(64,557,'B2B · B2C · Cybersecurity · AI',19,'#646973')
    # Real work, in floating rounded cards like the site's concept gallery.
    def card(path,x,y,w,h,angle,label):
        pad=12; extra=28
        layer=Image.new('RGBA',((w+60)*S,(h+extra+60)*S))
        shadow=Image.new('RGBA',layer.size)
        sd=ImageDraw.Draw(shadow)
        sd.rounded_rectangle((22*S,28*S,(w+22)*S,(h+extra+28)*S),20*S,fill=(41,52,82,35))
        layer.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(12*S)))
        ld=ImageDraw.Draw(layer)
        ld.rounded_rectangle((20*S,15*S,(w+20)*S,(h+extra+15)*S),18*S,fill='white',outline='#e5e7ed',width=S)
        source=Image.open(ROOT/path).convert('RGB')
        source=ImageOps.fit(source,((w-2*pad)*S,h*S),method=Image.Resampling.LANCZOS)
        mask=Image.new('L',source.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,*source.size),10*S,fill=255)
        layer.paste(source,((20+pad)*S,(15+pad)*S),mask)
        font=ImageFont.truetype(str(FONT/'DejaVuSans.ttf'),12*S)
        ld.text(((20+pad)*S,(h+30)*S),label,fill='#838895',font=font)
        layer=layer.rotate(angle,Image.Resampling.BICUBIC,expand=True)
        canvas.paste(layer,(x*S,y*S),layer)
    card('assets/remate/cover-light-dots-poster.webp',685,57,424,239,-5,'')
    card('assets/copilot-case/split-workspace.webp',658,297,438,247,4,'COPILOT / Cybersecurity · AI')
    d=ImageDraw.Draw(canvas)
    # Blue collaborator cursor and label, matching the homepage's pointer.
    d.polygon([(1030*S,325*S),(1040*S,356*S),(1048*S,344*S),(1062*S,340*S)],fill=BLUE)
    rect((1052,351,1138,383),BLUE,radius=7)
    text(1063,356,'Аня' if lang=='ru' else 'Anna',17,'white',True)
    canvas.resize((1200,630),Image.Resampling.LANCZOS).save(ROOT/f'assets/social/portfolio-{lang}.png',optimize=True)

for language in ('ru','en'): render(language)
