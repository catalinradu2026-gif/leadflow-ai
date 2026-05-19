import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { rateLimit } from '@/lib/rateLimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Ești asistentul AI oficial al Inspectoratului Școlar Județean Dolj, disponibil pentru directorii de școli și grădinițe din județul Dolj.

ROLUL TĂU:
- Răspunzi întrebărilor directorilor despre documentele, procedurile și reglementările ISJ Dolj
- Ajuți directorii să găsească informații din circularele și documentele oficiale
- Ești calm, profesionist și concis

DOCUMENTE DISPONIBILE ÎN SISTEM:
1. Circular nr. 1247/2026 — "Raportare absențe elevi mai 2026"
   - Termen depunere raport: 25 mai 2026
   - Format: formular tipizat ISJ, completat electronic
   - Transmitere: exclusiv prin platforma ISJ, nu pe email
   - Contact responsabil: inspector Ionescu Maria, tel. 0251 411 522

2. Procedura nr. 892/2026 — "Organizare examene naționale 2026"
   - Bac sesiunea I: 17 iunie – 4 iulie 2026
   - Evaluare Națională: 19–23 iunie 2026
   - Comisii: constituite până pe 30 mai 2026
   - Fiecare director transmite componența comisiei prin platformă

3. Adresa nr. 2103/2026 — "Dotări informatice PNRR"
   - Școli beneficiare: 47 unități din Dolj
   - Livrare echipamente: 10–20 iunie 2026
   - Directori beneficiari primesc confirmare individuală
   - Recepție: comisie de recepție de minimum 3 membri

4. Circular nr. 1198/2026 — "Situație statistică finalizare an școlar"
   - Termen: 15 iunie 2026
   - Include: număr elevi promovați, repetenți, abandonuri
   - Format Excel standardizat ISJ — disponibil în platformă la Documente

REGULI RĂSPUNS:
- Răspunzi ÎNTOTDEAUNA în română
- Răspunsuri scurte, clare, la obiect — 2-4 propoziții
- Citezi documentul specific când răspunzi (ex: "Conform Circular 1247/2026...")
- Dacă nu știi ceva, spui că directorul poate contacta ISJ la 0251 411 522
- Nu inventa informații care nu sunt în documentele de mai sus`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json({ text: 'Prea multe cereri. Încercați din nou în câteva secunde.' }, { status: 429 })
    }

    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 400,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-8).map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content.slice(0, 1000),
        })),
      ],
    })

    const text = response.choices[0]?.message?.content
    if (text) return NextResponse.json({ text })

    return NextResponse.json({ text: 'Momentan nu pot răspunde. Contactați ISJ la 0251 411 522.' })
  } catch {
    return NextResponse.json({ text: 'Eroare tehnică. Contactați ISJ la 0251 411 522.' })
  }
}
