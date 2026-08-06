// Generator PDF pentru decizia ARACIP: Decizie de acreditare / Atestat evaluare periodică.
// Conform procedurii: acreditarea prin ordin de ministru la propunerea ARACIP; evaluarea
// periodică se finalizează cu atestatul privind nivelul calității (HG 993/2020, HG 994/2020 mod. 631/2022).
import { jsPDF } from 'jspdf'
import { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } from './certFont'

export interface DecizieData {
  tip: 'acreditare' | 'evaluare_periodica'
  denumire: string
  cui?: string
  judet?: string
  nivel?: string
  calificativ?: string
  nrInregistrare: string
  data?: Date
}

export function genereazaDecizie(input: DecizieData): void {
  const data = input.data ?? new Date()
  const esteAcreditare = input.tip !== 'evaluare_periodica'
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_B64); doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
  doc.addFileToVFS('Roboto-Bold.ttf', ROBOTO_BOLD_B64); doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), cx = W / 2

  doc.setDrawColor(30, 64, 110); doc.setLineWidth(1); doc.rect(12, 12, W - 24, H - 24)
  doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.3); doc.rect(15, 15, W - 30, H - 30)

  doc.setTextColor(30, 64, 110); doc.setFont('Roboto', 'bold'); doc.setFontSize(15)
  doc.text('MINISTERUL EDUCAȚIEI', cx, 34, { align: 'center' })
  doc.setFontSize(12); doc.setTextColor(60, 60, 70)
  doc.text('Agenția Română de Asigurare a Calității în Învățământul Preuniversitar', cx, 42, { align: 'center' })
  doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.5); doc.line(cx - 40, 48, cx + 40, 48)

  doc.setTextColor(15, 23, 42); doc.setFont('Roboto', 'bold'); doc.setFontSize(19)
  if (esteAcreditare) {
    doc.text('DECIZIE DE ACREDITARE', cx, 72, { align: 'center' })
    doc.text('INSTITUȚIONALĂ', cx, 82, { align: 'center' })
  } else {
    doc.setFontSize(16)
    doc.text('ATESTAT', cx, 70, { align: 'center' })
    doc.setFontSize(12); doc.setTextColor(60, 60, 70)
    doc.text('privind nivelul calității educației furnizate', cx, 80, { align: 'center' })
  }

  doc.setTextColor(50, 50, 60); doc.setFont('Roboto', 'normal'); doc.setFontSize(12)
  const introTxt = esteAcreditare ? 'Se acordă acreditarea unității de învățământ:' : 'Se atestă nivelul calității educației furnizate de unitatea de învățământ:'
  doc.text(introTxt, cx, 104, { align: 'center' })

  doc.setTextColor(30, 64, 110); doc.setFont('Roboto', 'bold'); doc.setFontSize(17)
  doc.splitTextToSize((input.denumire || '—').toUpperCase(), W - 60).forEach((ln: string, i: number) => doc.text(ln, cx, 118 + i * 8, { align: 'center' }))

  let y = 140
  doc.setFont('Roboto', 'normal'); doc.setFontSize(11)
  const rows: [string, string][] = []
  if (input.cui) rows.push(['CUI / CIF', input.cui])
  if (input.judet) rows.push(['Județ', input.judet])
  if (input.nivel) rows.push(['Nivel de învățământ', input.nivel])
  if (!esteAcreditare && input.calificativ) rows.push(['Calificativ', input.calificativ])
  rows.push(['Număr de înregistrare', input.nrInregistrare])
  for (const [k, v] of rows) {
    doc.setFont('Roboto', 'normal'); doc.setTextColor(110, 110, 120); doc.text(`${k}:`, cx - 55, y)
    doc.setFont('Roboto', 'bold'); doc.setTextColor(40, 40, 50); doc.text(v, cx - 5, y); y += 8
  }

  y += 8
  doc.setFont('Roboto', 'normal'); doc.setFontSize(10); doc.setTextColor(90, 90, 100)
  const temei = esteAcreditare
    ? 'Acordată prin ordin al ministrului educației, la propunerea Consiliului ARACIP, în urma evaluării externe, conform standardelor de acreditare (H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022) și metodologiei de evaluare instituțională (H.G. nr. 993/2020).'
    : 'Emis în urma evaluării externe periodice realizate de ARACIP, conform standardelor de evaluare externă periodică (H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022) și metodologiei de evaluare instituțională (H.G. nr. 993/2020).'
  doc.splitTextToSize(temei, W - 60).forEach((ln: string) => { doc.text(ln, cx, y, { align: 'center' }); y += 5.5 })

  const fy = H - 46
  const ds = data.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFontSize(10); doc.setTextColor(90, 90, 100); doc.text(`Data emiterii: ${ds}`, 28, fy)
  doc.setDrawColor(120, 120, 130); doc.setLineWidth(0.3); doc.line(W - 78, fy, W - 28, fy)
  doc.setFontSize(10); doc.setTextColor(60, 60, 70)
  doc.text(esteAcreditare ? 'Ministrul Educației' : 'Director ARACIP', W - 53, fy + 6, { align: 'center' })

  doc.setFontSize(8.5); doc.setTextColor(140, 140, 150)
  doc.text('Model orientativ generat de platformă. Documentul oficial se emite conform procedurii ARACIP.', cx, H - 22, { align: 'center' })

  const safe = (input.denumire || 'unitate').replace(/[^\wÀ-ɏ]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()
  const pre = esteAcreditare ? 'decizie-acreditare' : 'atestat-evaluare'
  doc.save(`${pre}-${safe || 'unitate'}.pdf`)
}
