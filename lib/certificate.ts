// Generator certificate PDF nominale pentru aria Formare ARACIP.
// Client-side (jsPDF). Certificatul se generează on-demand, NU se stochează.
// Conținut strict oficial: Activitatea A.2 (formarea formabililor) / A.3 (formarea
// experților evaluatori externi), cadru HG 994/2020 modif. HG 631/2022 + metodologie ARACIP.
// Nu se folosesc nume de persoane reale, numere de acreditare false sau logo-uri oficiale.
import { jsPDF } from 'jspdf'
import { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } from './certFont'

export type CertRol = 'formabil' | 'evaluator'

/** Înregistrează fontul Roboto (suport diacritice românești ă/â/î/ș/ț) în documentul jsPDF. */
function registerRoboto(doc: jsPDF) {
  doc.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_B64)
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
  doc.addFileToVFS('Roboto-Bold.ttf', ROBOTO_BOLD_B64)
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')
}

export interface CertificatData {
  nume: string
  rol: CertRol
  unitate?: string
  judet?: string
  /** Data emiterii (implicit: acum). */
  data?: Date
}

/** Cod certificat determinist-ish pe bază de timestamp (ex: ARACIP-A2-1720000000000). */
export function codCertificat(rol: CertRol, data: Date): string {
  const activitate = rol === 'evaluator' ? 'A3' : 'A2'
  return `ARACIP-${activitate}-${data.getTime()}`
}

function ro(txt: string) {
  // Fontul Roboto încorporat suportă complet diacriticele românești (ă â î ș ț).
  return txt
}

/** Generează și descarcă un certificat A4 landscape. */
export function genereazaCertificat(input: CertificatData): void {
  const data = input.data ?? new Date()
  const rol = input.rol
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  registerRoboto(doc)

  const W = doc.internal.pageSize.getWidth()   // 297
  const H = doc.internal.pageSize.getHeight()  // 210
  const cx = W / 2

  // Fundal sobru
  doc.setFillColor(252, 252, 253)
  doc.rect(0, 0, W, H, 'F')

  // Chenar dublu
  doc.setDrawColor(124, 58, 237) // violet ARACIP
  doc.setLineWidth(1.2)
  doc.rect(10, 10, W - 20, H - 20)
  doc.setDrawColor(20, 184, 166) // teal accent
  doc.setLineWidth(0.4)
  doc.rect(14, 14, W - 28, H - 28)

  // Antet
  doc.setTextColor(124, 58, 237)
  doc.setFont('Roboto', 'bold')
  doc.setFontSize(15)
  doc.text(ro('ARACIP'), cx, 32, { align: 'center' })
  doc.setTextColor(60, 60, 70)
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(10.5)
  doc.text(ro('Agenția Română de Asigurare a Calității în Învățământul Preuniversitar'), cx, 39, { align: 'center' })

  // Titlu
  doc.setTextColor(15, 23, 42)
  doc.setFont('Roboto', 'bold')
  doc.setFontSize(30)
  doc.text(ro('CERTIFICAT DE PARTICIPARE'), cx, 62, { align: 'center' })

  // Linie separatoare
  doc.setDrawColor(124, 58, 237)
  doc.setLineWidth(0.6)
  doc.line(cx - 45, 68, cx + 45, 68)

  // Corp
  doc.setTextColor(70, 70, 80)
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(12)
  doc.text(ro('Se certifică prin prezentul că'), cx, 84, { align: 'center' })

  // Nume
  doc.setTextColor(124, 58, 237)
  doc.setFont('Roboto', 'bold')
  doc.setFontSize(22)
  doc.text(ro(input.nume || '—'), cx, 96, { align: 'center' })

  // Activitate (A.2 / A.3)
  const activitateText = rol === 'evaluator'
    ? 'a parcurs și finalizat programul de formare din cadrul Activității A.3 — Formarea experților evaluatori externi'
    : 'a parcurs și finalizat programul de formare din cadrul Activității A.2 — Formarea formabililor'

  doc.setTextColor(70, 70, 80)
  doc.setFont('Roboto', 'normal')
  doc.setFontSize(12)
  const bodyLines = doc.splitTextToSize(ro(activitateText), W - 90)
  doc.text(bodyLines, cx, 108, { align: 'center' })

  // Cadru legal
  doc.setFontSize(9.5)
  doc.setTextColor(110, 110, 120)
  const cadru = 'program derulat conform standardelor de acreditare și evaluare externă a calității (HG 994/2020, modificată prin HG 631/2022) și a metodologiei ARACIP.'
  const cadruLines = doc.splitTextToSize(ro(cadru), W - 100)
  const cadruY = 108 + bodyLines.length * 6 + 4
  doc.text(cadruLines, cx, cadruY, { align: 'center' })

  // Unitate / județ (opțional)
  let infoY = cadruY + cadruLines.length * 5 + 6
  const infoParts: string[] = []
  if (input.unitate && input.unitate.trim()) infoParts.push(`Unitatea de învățământ: ${input.unitate.trim()}`)
  if (input.judet && input.judet.trim()) infoParts.push(`Județul: ${input.judet.trim()}`)
  if (infoParts.length) {
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 90)
    doc.text(ro(infoParts.join('   ·   ')), cx, infoY, { align: 'center' })
    infoY += 8
  }

  // Footer: data + cod + semnătură
  const footerY = H - 32
  const dataStr = data.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })
  const cod = codCertificat(rol, data)

  doc.setFontSize(9.5)
  doc.setTextColor(90, 90, 100)
  doc.text(ro(`Data emiterii: ${dataStr}`), 30, footerY)
  doc.text(ro(`Cod certificat: ${cod}`), 30, footerY + 6)

  // Semnătură
  doc.setDrawColor(120, 120, 130)
  doc.setLineWidth(0.3)
  doc.line(W - 90, footerY, W - 30, footerY)
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 70)
  doc.text(ro('Director ARACIP'), W - 60, footerY + 6, { align: 'center' })

  const safeNume = (input.nume || 'participant').replace(/[^\wÀ-ɏ]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()
  doc.save(`certificat-${rol === 'evaluator' ? 'a3' : 'a2'}-${safeNume || 'participant'}.pdf`)
}
