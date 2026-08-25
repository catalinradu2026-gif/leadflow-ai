import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

// Aceeași parolă de admin ca /api/bt-admin-auth și /api/bt-knowledge.
const ADMIN_PASSWORD = process.env.DEMO_BT_ADMIN_PASSWORD || 'BTadmin2026x9'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_EXTRACTED_CHARS = 20000 // suficient pentru o intrare de cunoștințe, nu pentru romane

// ============================================================================
// Upload de documente pentru panoul admin BT (Cunoștințe Ana). Extrage text din
// PDF/DOCX/XLSX și îl întoarce clientului, care îl adaugă ca intrare editabilă
// în lista de cunoștințe (admin revede/editează înainte de „Salvează tot").
//
// Librării — TOATE deja instalate în proiect (verificat în package.json), nu
// s-a adăugat nimic nou pentru text:
//   - PDF  → unpdf (deja folosit în app/api/upload-pdf/route.ts pentru ARACIP)
//   - DOCX → mammoth (idem)
//   - XLSX → xlsx (SheetJS) — instalată ca dependință, dar nefolosită încă
//     nicăieri în cod; adăugat aici primul ei loc de utilizare real.
//
// JPEG — NU e suportat. Verificat direct contra Groq (GET /v1/models + teste
// cu modele vision cunoscute: llama-3.2-11b-vision-preview, llama-4-scout,
// llama-4-maverick, llava) — niciun model cu capacitate de vision/OCR nu e
// disponibil pe acest cont Groq (toate au întors 400/404). Fără un serviciu
// extern de OCR (ex. Google Vision, AWS Textract, Tesseract auto-hostat),
// extragerea de text din JPEG nu e fezabilă cu stack-ul actual — endpoint-ul
// respinge JPEG explicit, cu mesaj clar, în loc să pretindă că funcționează.
// ============================================================================

async function extractText(name: string, mime: string, bytes: ArrayBuffer): Promise<{ text: string; error?: string }> {
  const lower = (name || '').toLowerCase()
  try {
    if (lower.endsWith('.pdf') || mime === 'application/pdf') {
      const { extractText: pdfExtract, getDocumentProxy } = await import('unpdf')
      const pdf = await getDocumentProxy(new Uint8Array(bytes))
      const { text } = await pdfExtract(pdf, { mergePages: true })
      return { text: Array.isArray(text) ? text.join('\n') : String(text || '') }
    }
    if (lower.endsWith('.docx') || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) })
      return { text: result.value || '' }
    }
    if (lower.endsWith('.xlsx') || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const XLSX = await import('xlsx')
      const wb = XLSX.read(Buffer.from(bytes), { type: 'buffer' })
      const parts: string[] = []
      for (const sheetName of wb.SheetNames) {
        const sheet = wb.Sheets[sheetName]
        const csv = XLSX.utils.sheet_to_csv(sheet)
        if (csv.trim()) parts.push(`[Foaie: ${sheetName}]\n${csv.trim()}`)
      }
      return { text: parts.join('\n\n') }
    }
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || mime === 'image/jpeg') {
      return {
        text: '',
        error: 'Extragere text din JPEG nu e disponibilă — contul Groq folosit nu are acces la niciun model cu ' +
          'capacitate de vision/OCR (verificat direct: nu apare în lista de modele disponibile, iar modelele ' +
          'vision cunoscute — llama-3.2-11b-vision, llama-4-scout, llama-4-maverick, llava — au fost respinse). ' +
          'Ar fi nevoie de un serviciu extern de OCR (Google Vision, AWS Textract etc.) neconfigurat momentan. ' +
          'Introduceți conținutul manual în câmpul de text, sau atașați documentul ca PDF/DOCX dacă e disponibil așa.',
      }
    }
    return { text: '', error: 'Format neacceptat. Sunt suportate: PDF, Word (.docx), Excel (.xlsx).' }
  } catch (e) {
    console.error('[bt-upload extractText]', e)
    return { text: '', error: 'Nu am putut extrage textul din acest fișier — verificați că nu e corupt sau protejat prin parolă.' }
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(`bt-upload:${ip}`, 15, 60_000)) {
      return NextResponse.json({ error: 'Prea multe cereri. Reveniți într-un minut.' }, { status: 429 })
    }

    const formData = await req.formData()
    const password = formData.get('password') as string | null
    const file = formData.get('file') as File | null

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Parolă incorectă.' }, { status: 401 })
    }
    if (!file) {
      return NextResponse.json({ error: 'Niciun fișier selectat.' }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Fișierul este gol.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `Fișier prea mare. Limita este ${MAX_BYTES / (1024 * 1024)} MB.` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const { text, error } = await extractText(file.name || '', file.type || '', bytes)
    if (error) {
      return NextResponse.json({ error, name: file.name }, { status: 422 })
    }

    const cleaned = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, MAX_EXTRACTED_CHARS)

    if (!cleaned) {
      return NextResponse.json({ error: 'Nu s-a găsit text în document (posibil scanat ca imagine, fără strat de text).' }, { status: 422 })
    }

    return NextResponse.json({ ok: true, name: file.name, extractedText: cleaned })
  } catch (e) {
    console.error('[POST /api/bt-upload]', e)
    return NextResponse.json({ error: 'Eroare la procesarea fișierului.' }, { status: 500 })
  }
}
