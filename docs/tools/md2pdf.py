import os, re, html
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                ListFlowable, ListItem, HRFlowable, Image as RLImage, KeepTogether)
from reportlab.lib.utils import ImageReader
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT

F='C:/Windows/Fonts/'
pdfmetrics.registerFont(TTFont('Ar', F+'arial.ttf'))
pdfmetrics.registerFont(TTFont('ArB', F+'arialbd.ttf'))
pdfmetrics.registerFont(TTFont('ArI', F+'ariali.ttf'))
pdfmetrics.registerFont(TTFont('Mono', F+'consola.ttf'))

NAVY=colors.HexColor('#0f172a'); BLUE=colors.HexColor('#2563eb'); GREY=colors.HexColor('#64748b')
LINE=colors.HexColor('#cbd5e1'); LIGHT=colors.HexColor('#f1f5f9')

KEEP={0x2013,0x2014,0x2018,0x2019,0x201C,0x201D,0x201E,0x2026}
def clean(s):
    return ''.join(c for c in s if ord(c)<0x2190 or ord(c) in KEEP)

def inline(s):
    s=clean(s)
    s=html.escape(s)
    s=re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s=re.sub(r'`(.+?)`', r'<font name="Mono" size=8>\1</font>', s)
    s=re.sub(r'\[(.+?)\]\((.+?)\)', r'<b>\1</b>', s)  # links -> bold text
    return s

styles=getSampleStyleSheet()
def st(name,**kw):
    kw.setdefault('fontName','Ar'); kw.setdefault('fontSize',10); kw.setdefault('leading',14); kw.setdefault('textColor',NAVY)
    return ParagraphStyle(name, **kw)
BODY=st('body', spaceAfter=6)
H1=st('h1', fontName='ArB', fontSize=18, leading=22, textColor=NAVY, spaceBefore=4, spaceAfter=10)
H2=st('h2', fontName='ArB', fontSize=13.5, leading=17, textColor=BLUE, spaceBefore=12, spaceAfter=6)
H3=st('h3', fontName='ArB', fontSize=11.5, leading=15, textColor=NAVY, spaceBefore=8, spaceAfter=4)
QUOTE=st('q', fontName='ArI', fontSize=9, leading=13, textColor=GREY, leftIndent=10, spaceAfter=6)
CELL=st('cell', fontSize=8.5, leading=11)
CELLH=st('cellh', fontName='ArB', fontSize=8.5, leading=11, textColor=colors.white)

def make(mdfile, outfile):
    lines=open(mdfile, encoding='utf-8').read().split('\n')
    flow=[]; i=0
    def cellpara(txt, header=False):
        return Paragraph(inline(txt), CELLH if header else CELL)
    while i < len(lines):
        ln=lines[i].rstrip()
        if not ln.strip():
            i+=1; continue
        if ln.startswith('# '):
            flow.append(Paragraph(inline(ln[2:]), H1))
            flow.append(HRFlowable(width='100%', color=BLUE, thickness=1.4, spaceAfter=8))
        elif ln.startswith('## '):
            flow.append(Paragraph(inline(ln[3:]), H2))
        elif ln.startswith('### '):
            flow.append(Paragraph(inline(ln[4:]), H3))
        elif ln.startswith('> '):
            flow.append(Paragraph(inline(ln[2:]), QUOTE))
        elif ln.strip()=='---':
            flow.append(HRFlowable(width='100%', color=LINE, thickness=0.6, spaceBefore=4, spaceAfter=8))
        elif ln.lstrip().startswith(('- ','* ')):
            items=[]
            while i < len(lines) and lines[i].lstrip().startswith(('- ','* ')):
                items.append(ListItem(Paragraph(inline(lines[i].lstrip()[2:]), BODY), leftIndent=12))
                i+=1
            flow.append(ListFlowable(items, bulletType='bullet', bulletFontSize=6, bulletColor=BLUE, start='square')); continue
        elif re.match(r'^\d+\. ', ln.strip()):
            items=[]
            while i < len(lines) and re.match(r'^\d+\. ', lines[i].strip()):
                items.append(ListItem(Paragraph(inline(re.sub(r'^\d+\. ','',lines[i].strip())), BODY), leftIndent=12))
                i+=1
            flow.append(ListFlowable(items, bulletType='1', bulletFontName='ArB', bulletColor=BLUE)); continue
        elif ln.strip().startswith('|'):
            rows=[]
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i+=1
            rows=[r for r in rows if not all(set(c) <= set('-: ') for c in r)]
            if rows:
                ncol=max(len(r) for r in rows)
                data=[]
                for ri,r in enumerate(rows):
                    r=r+['']*(ncol-len(r))
                    data.append([cellpara(c, header=(ri==0)) for c in r])
                t=Table(data, repeatRows=1, colWidths=[(17*cm)/ncol]*ncol)
                t.setStyle(TableStyle([
                    ('BACKGROUND',(0,0),(-1,0),NAVY),
                    ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),
                    ('GRID',(0,0),(-1,-1),0.4,LINE),
                    ('VALIGN',(0,0),(-1,-1),'TOP'),
                    ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),
                    ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
                ]))
                flow.append(t); flow.append(Spacer(1,8)); continue
        elif ln.strip().startswith('!['):
            m=re.match(r'!\[(.*?)\]\((.+?)\)', ln.strip())
            if m:
                cap, path = m.group(1), m.group(2)
                imgpath = path if os.path.isabs(path) else os.path.normpath(os.path.join(os.path.dirname(mdfile), path))
                iw, ih = ImageReader(imgpath).getSize()
                maxW, maxH = 16.5*cm, 20*cm
                scale=min(maxW/iw, maxH/ih)
                img=RLImage(imgpath, width=iw*scale, height=ih*scale)
                img.hAlign='CENTER'
                parts=[Spacer(1,4), img]
                if cap:
                    capst=ParagraphStyle('imgcap', fontName='ArI', fontSize=8.5, leading=11, textColor=GREY, alignment=1, spaceBefore=3, spaceAfter=10)
                    parts.append(Paragraph(inline(cap), capst))
                else:
                    parts.append(Spacer(1,8))
                flow.append(KeepTogether(parts))
            i+=1; continue
        elif '[[MODEL-CERTIFICAT]]' in ln:
            cap=ParagraphStyle('cc',fontName='ArB',fontSize=11,leading=14,textColor=NAVY,alignment=1)
            sub=ParagraphStyle('cs',fontName='ArI',fontSize=8.5,leading=12,textColor=GREY,alignment=1)
            body=ParagraphStyle('cb',fontName='Ar',fontSize=9,leading=13,textColor=NAVY,alignment=1)
            inner=[[Paragraph('ARACIP', cap)],
                   [Paragraph('CERTIFICAT DE PARTICIPARE', cap)],
                   [Paragraph('se acorda doamnei/domnului <b>[Nume Prenume]</b>', body)],
                   [Paragraph('pentru finalizarea programului de formare<br/>Activitatea A.2 / A.3', body)],
                   [Paragraph('Unitatea [.....] &#183; Judetul [.....] &#183; Cod certificat: [.....]', sub)],
                   [Paragraph('emis in temeiul H.G. nr. 994/2020, modificata prin H.G. nr. 631/2022', sub)]]
            ct=Table(inner, colWidths=[15*cm])
            ct.setStyle(TableStyle([('BOX',(0,0),(-1,-1),1.2,BLUE),('INNERGRID',(0,0),(-1,-1),0,colors.white),
                ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
                ('BACKGROUND',(0,0),(-1,-1),colors.HexColor("#f8fafc"))]))
            flow.append(Spacer(1,4)); flow.append(ct); flow.append(Spacer(1,4))
        else:
            flow.append(Paragraph(inline(ln), BODY))
        i+=1

    def footer(cnv, doc):
        cnv.saveState()
        cnv.setFont('Ar',7); cnv.setFillColor(GREY)
        cnv.drawString(2*cm, 1.1*cm, 'NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627 · Platforma ARACIP')
        cnv.drawRightString(19*cm, 1.1*cm, f'Pag. {doc.page}')
        cnv.restoreState()

    doc=SimpleDocTemplate(outfile, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm,
                          topMargin=1.6*cm, bottomMargin=1.8*cm)
    doc.build(flow, onFirstPage=footer, onLaterPages=footer)
    print('OK ->', outfile)

SRC='C:/Users/catal/Desktop/Proiecte/LeadFlow AI/leadflow-ai/docs/'
OUT='C:/Users/catal/Desktop/ARACIP - Documente Licitatie/'
os.makedirs(OUT, exist_ok=True)
FILES={
 '5-GDPR-CONFORMITATE.md':'5 - Conformitate GDPR.pdf',
 '6-CONFRUNTARE-CONTINUT-OFICIAL.md':'6 - Confruntare continut oficial.pdf',
 '7-GAZDUIRE-DOMENIU.md':'7 - Gazduire si domeniu.pdf',
 '8-MANUALE-SI-DOCUMENTATIE-TEHNICA.md':'8 - Manuale si documentatie tehnica.pdf',
}
for md,out in FILES.items():
    make(SRC+md, OUT+out)
print('\nToate in:', OUT)
