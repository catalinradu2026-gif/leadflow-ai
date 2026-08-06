// Generator PDF pentru Autorizația de funcționare provizorie (client-side, jsPDF).
// Conținut conform procedurii: se acordă prin ordin al ministrului educației, la propunerea
// Consiliului ARACIP (HG 993/2020, HG 994/2020 mod. HG 631/2022). Model orientativ.
import { jsPDF } from 'jspdf'
import { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } from './certFont'

export interface AutorizatieData {
  denumire: string
  cui?: string
  judet?: string
  nivel?: string
  nrInregistrare: string
  data?: Date
}

export function genereazaAutorizatie(input: AutorizatieData): void {
  const data = input.data ?? new Date()
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_B64); doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
  doc.addFileToVFS('Roboto-Bold.ttf', ROBOTO_BOLD_B64); doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')

  const W = doc.internal.pageSize.getWidth()   // 210
  const H = doc.internal.pageSize.getHeight()  // 297
  const cx = W / 2

  // Chenar
  doc.setDrawColor(30, 64, 110); doc.setLineWidth(1); doc.rect(12, 12, W - 24, H - 24)
  doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.3); doc.rect(15, 15, W - 30, H - 30)

  // Antet
  doc.setTextColor(30, 64, 110); doc.setFont('Roboto', 'bold'); doc.setFontSize(15)
  doc.text('MINISTERUL EDUCAȚIEI', cx, 34, { align: 'center' })
  doc.setFontSize(12); doc.setTextColor(60, 60, 70)
  doc.text('Agenția Română de Asigurare a Calității în Învățământul Preuniversitar', cx, 42, { align: 'center' })
  doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.5); doc.line(cx - 40, 48, cx + 40, 48)

  // Titlu
  doc.setTextColor(15, 23, 42); doc.setFont('Roboto', 'bold'); doc.setFontSize(20)
  doc.text('AUTORIZAȚIE', cx, 72, { align: 'center' })
  doc.text('DE FUNCȚIONARE PROVIZORIE', cx, 82, { align: 'center' })

  // Corp
  doc.setTextColor(50, 50, 60); doc.setFont('Roboto', 'normal'); doc.setFontSize(12)
  doc.text('Se autorizează provizoriu funcționarea unității de învățământ:', cx, 104, { align: 'center' })

  doc.setTextColor(30, 64, 110); doc.setFont('Roboto', 'bold'); doc.setFontSize(17)
  doc.splitTextToSize((input.denumire || '—').toUpperCase(), W - 60).forEach((ln: string, i: number) =>
    doc.text(ln, cx, 118 + i * 8, { align: 'center' }))

  // Detalii unitate
  let y = 140
  doc.setFont('Roboto', 'normal'); doc.setFontSize(11); doc.setTextColor(70, 70, 80)
  const rows: [string, string][] = []
  if (input.cui) rows.push(['CUI / CIF', input.cui])
  if (input.judet) rows.push(['Județ', input.judet])
  if (input.nivel) rows.push(['Nivel de învățământ', input.nivel])
  rows.push(['Număr de înregistrare', input.nrInregistrare])
  for (const [k, v] of rows) {
    doc.setFont('Roboto', 'normal'); doc.setTextColor(110, 110, 120); doc.text(`${k}:`, cx - 55, y)
    doc.setFont('Roboto', 'bold'); doc.setTextColor(40, 40, 50); doc.text(v, cx - 5, y)
    y += 8
  }

  // Temei legal
  y += 8
  doc.setFont('Roboto', 'normal'); doc.setFontSize(10); doc.setTextColor(90, 90, 100)
  const temei = 'Acordată prin ordin al ministrului educației, la propunerea Consiliului ARACIP, în urma evaluării externe, conform standardelor de autorizare de funcționare provizorie (H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022) și metodologiei de evaluare instituțională (H.G. nr. 993/2020).'
  doc.splitTextToSize(temei, W - 60).forEach((ln: string) => { doc.text(ln, cx, y, { align: 'center' }); y += 5.5 })

  // Footer: data + semnătură
  const fy = H - 46
  const dataStr = data.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFontSize(10); doc.setTextColor(90, 90, 100)
  doc.text(`Data emiterii: ${dataStr}`, 28, fy)
  doc.setDrawColor(120, 120, 130); doc.setLineWidth(0.3); doc.line(W - 78, fy, W - 28, fy)
  doc.setFontSize(10); doc.setTextColor(60, 60, 70); doc.text('Ministrul Educației', W - 53, fy + 6, { align: 'center' })

  doc.setFontSize(8.5); doc.setTextColor(140, 140, 150)
  doc.text('Model orientativ generat de platformă. Documentul oficial se emite prin ordin al ministrului educației.', cx, H - 22, { align: 'center' })

  const safe = (input.denumire || 'unitate').replace(/[^\wÀ-ɏ]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()
  doc.save(`autorizatie-${safe || 'unitate'}.pdf`)
}
