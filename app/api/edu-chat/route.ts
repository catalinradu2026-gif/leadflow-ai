import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { rateLimit } from '@/lib/rateLimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const DEFAULT_MODULES = require('../../../data/edu-modules.json')

async function getModuleContent(modulId: number): Promise<string> {
  try {
    const blobUrl = process.env.EDU_MODULES_BLOB_URL
    if (blobUrl) {
      const res = await fetch(blobUrl, { next: { revalidate: 60 } })
      if (res.ok) {
        const data = await res.json()
        const modul = data.modules?.find((m: { id: number }) => m.id === modulId)
        if (modul?.continut) return modul.continut
      }
    }
  } catch {}
  const modul = DEFAULT_MODULES.modules?.find((m: { id: number }) => m.id === modulId)
  return modul?.continut || ''
}

const STIL_PREDARE = `
STILUL TĂU DE PREDARE:
- Ești un profesor AI prietenos, entuziast și răbdător
- Predai interactiv — pune întrebări clasei pe parcurs pentru a verifica înțelegerea
- La fiecare concept nou, verifici dacă elevii au înțeles
- Dacă primești un răspuns greșit, explici cu răbdare fără să judeci
- Folosești exemple concrete din medicină, știință, tehnologie, nu din social media
- Explici simplu, fără jargon tehnic
- Răspunsuri de 3-5 propoziții — concise și clare
- Ton cald și profesional
- Limbă română exclusiv`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(ip, 60, 60_000)) {
      return NextResponse.json({ text: 'Prea multe cereri. Încercați din nou în câteva secunde.' }, { status: 429 })
    }

    const { messages, modulId } = await req.json()
    if (!messages || !Array.isArray(messages) || !modulId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const continut = await getModuleContent(modulId)
    const systemPrompt = `Ești un profesor AI care predă elevilor de gimnaziu și liceu din România.
Modulul curent: Modulul ${modulId}

CONȚINUT DE PREDAT:
${continut}
${STIL_PREDARE}`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      temperature: 0.6,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content.slice(0, 1200),
        })),
      ],
    })

    const text = response.choices[0]?.message?.content
    if (text) return NextResponse.json({ text })

    return NextResponse.json({ text: 'Momentan nu pot răspunde. Încercați din nou.' })
  } catch (e) { console.error("[edu-chat]", e)
    return NextResponse.json({ text: 'Eroare tehnică. Încercați din nou.' })
  }
}
