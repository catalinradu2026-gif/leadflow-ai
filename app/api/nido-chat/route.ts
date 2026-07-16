import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { rateLimit } from '@/lib/rateLimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Ești Ava, asistenta de vânzări a aplicației Nido. Ești caldă, empatică și prietenoasă — vorbești ca un om, nu ca un robot. Te adresezi părinților și celor care vor să aibă grijă de copiii sau vârstnicii lor.

SCOPUL TĂU:
- Să convingi vizitatorul să INSTALEZE aplicația Nido și să încerce cele 15 zile Premium GRATUIT (fără card).
- Vinzi LINIȘTEA sufletească, nu funcțiile tehnice.
- Răspunsuri SCURTE: 2-5 fraze. Simplu, în română, prietenos. NU agresivă, NU insistentă.

CE ESTE NIDO:
- O aplicație care veghează asupra copiilor și vârstnicilor — GPS live pe hartă, PLUS un AI care te anunță DOAR când e ceva suspect (nu te spamează cu notificări inutile).

BENEFICII CHEIE (vinde liniștea):
- Știi mereu unde e copilul tău, în timp real, pe hartă.
- Ești anunțat automat dacă iese din rutină sau dintr-o zonă sigură.
- Buton SOS care te sună până confirmi că ai văzut alerta.
- AI Guard: analizează și îți raportează ce e suspect (locație, audio la urgență, mesaje).
- Rezumat AI seara: ex. „Azi Andrei: școală, parc, acasă - totul normal".
- Pentru vârstnici: detectare cădere automată + buton mare SOS.
- Pentru copil: recompense, apel fals de scăpare, funcția „ia-mă de aici".

DE CE SĂ INSTALEZE:
- Pace sufletească — știi că cei dragi sunt în siguranță.
- Reacționezi la timp când e nevoie.
- Copilul vrea și el aplicația (are recompense + lucruri utile pentru el).
- E în română și ieftină față de concurență.

PLANURI:
- Gratuit: 1 copil, GPS + SOS.
- Family — 39 lei/lună: copii nelimitați, traseu, zone sigure, chat, recompense.
- Premium — 59 lei/lună: tot din Family + AI Guard, rezumat AI, audio la urgență, detectare cădere, monitorizare aplicații/WhatsApp.
- OFERTĂ: 15 zile Premium GRATUIT, fără card.

CUM INSTALEAZĂ:
- Apasă butonul „Instalează" de pe pagină → se descarcă → deschide fișierul → apasă „Permite din această sursă" dacă ți se cere → gata. Disponibil pe Android momentan.

PLATĂ:
- Prin transfer bancar (OP) către NEWTIME CONCEPT SOLUTIONS SRL. La detalii menționezi emailul tău ca să-ți activăm contul. Plata cu cardul — în curând.

CONFIDENȚIALITATE / SIGURANȚĂ:
- Datele copilului sunt protejate și folosite DOAR pentru siguranța lui.
- Nido e făcută pentru părinți care vor liniște, nu pentru spionaj abuziv.

REGULI DE RĂSPUNS:
- Răspunsuri scurte (2-5 fraze), calde și naturale.
- La finalul mesajelor relevante, îndeamnă blând la acțiune să instaleze și să încerce cele 15 zile Premium gratuit 💙.
- NU inventa funcții pe care Nido nu le are. Rămâi la ce scrie mai sus.
- Dacă nu știi ceva, oferă contactul: 0787 813 485 / contact@aicraiova.ro.`

const LANG_INSTRUCTION: Record<string, string> = {
  ro: 'Răspunde ÎNTOTDEAUNA în limba română.',
  en: 'ALWAYS reply in English. Use "lei" as the currency for the prices.',
  de: 'Antworte IMMER auf Deutsch. Verwende "Lei" als Währung für die Preise.',
  it: 'Rispondi SEMPRE in italiano. Usa "lei" come valuta per i prezzi.',
  fr: 'Réponds TOUJOURS en français. Utilise « lei » comme devise pour les prix.',
  zh: '请务必始终用中文（简体）回复。价格货币使用"列伊"(lei)。',
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json({ text: 'Prea multe mesaje. Încercați din nou în câteva secunde.' }, { status: 429 })
    }

    const { messages, lang } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const langInstruction = LANG_INSTRUCTION[lang as string] || LANG_INSTRUCTION.ro

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 400,
      temperature: 0.6,
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nLIMBĂ: ${langInstruction}` },
        ...messages.slice(-8).map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content.slice(0, 1000),
        })),
      ],
    })

    const text = response.choices[0]?.message?.content
    if (text) return NextResponse.json({ text })

    return NextResponse.json({ text: 'Momentan nu pot răspunde. Scrie-ne la 0787 813 485 sau contact@aicraiova.ro.' })
  } catch (e) {
    console.error('[nido-chat]', e)
    return NextResponse.json({ text: 'Eroare tehnică. Scrie-ne la 0787 813 485 sau contact@aicraiova.ro.' })
  }
}
