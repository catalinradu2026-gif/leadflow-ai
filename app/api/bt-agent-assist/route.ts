import { NextRequest, NextResponse } from 'next/server'
import { loadLog, normalizePhone, detectObjections, extractAmount, extractMonths } from '@/app/api/bt-log/route'

const TOPIC_LABELS: Record<string, string> = {
  general: 'General / pagina principală',
  carduri: 'Carduri',
  credite: 'Credite',
  conturi: 'Conturi curente',
  imm: 'IMM / companii',
  onboarding: 'Deschidere cont online',
  suport: 'Triaj suport',
}

// ============================================================================
// Agent Assist Live — consultantul introduce telefonul unui lead deja colectat
// (din pre-calificare) și vede în timp real (polling simplu, nu WebSocket)
// transcriptul complet + un sumar: nevoie/subiecte, sumă & perioadă cerute,
// obiecții ridicate. Reconstruit din bt-conversations-log filtrând după
// conversationId — nu doar mesajul în care apare telefonul, ca să nu piardă
// restul discuției. Fallback pe leadPhone direct pentru intrări mai vechi
// (dinainte de conversationId) care nu au id de sesiune atașat.
// ============================================================================
export async function GET(req: NextRequest) {
  const phoneParam = req.nextUrl.searchParams.get('phone') || ''
  const target = normalizePhone(phoneParam)
  if (target.length < 9) {
    return NextResponse.json({ error: 'Introduceți un număr de telefon valid (min. 9 cifre).' }, { status: 400 })
  }

  const log = await loadLog()

  // 1) Găsește toate conversationId-urile care au măcar o intrare cu acest telefon.
  const matchingConvIds = new Set<string>()
  for (const e of log) {
    if (e.leadPhone && normalizePhone(e.leadPhone) === target && e.conversationId) {
      matchingConvIds.add(e.conversationId)
    }
  }

  // 2) Adună TOATE intrările acelor conversații (nu doar cea cu telefonul), + fallback
  // pe intrări vechi fără conversationId care au totuși telefonul exact pe ele.
  const entries = log.filter(e =>
    (e.conversationId && matchingConvIds.has(e.conversationId)) ||
    (!e.conversationId && e.leadPhone && normalizePhone(e.leadPhone) === target)
  ).sort((a, b) => a.ts.localeCompare(b.ts))

  if (entries.length === 0) {
    return NextResponse.json({ found: false, transcript: [], topics: [], objections: [], lastAmount: null, lastMonths: null, gapCount: 0 })
  }

  const topicsSet = new Set<string>()
  const objectionsSet = new Set<string>()
  let lastAmount: number | undefined
  let lastMonths: number | undefined
  let gapCount = 0

  for (const e of entries) {
    topicsSet.add(e.context)
    for (const o of detectObjections(e.userMessage)) objectionsSet.add(o)
    const amt = extractAmount(e.userMessage)
    if (amt) lastAmount = amt
    const mo = extractMonths(e.userMessage)
    if (mo) lastMonths = mo
    if (e.possibleGap) gapCount++
  }

  const transcript = entries.map(e => ({
    ts: e.ts,
    context: TOPIC_LABELS[e.context] || e.context,
    user: e.userMessage,
    ana: e.assistantReply || null, // poate lipsi la intrări logate înainte de acest feature
  }))

  return NextResponse.json({
    found: true,
    conversationCount: matchingConvIds.size || 1,
    topics: [...topicsSet].map(c => TOPIC_LABELS[c] || c),
    objections: [...objectionsSet],
    lastAmount: lastAmount ?? null,
    lastMonths: lastMonths ?? null,
    gapCount,
    transcript,
  })
}
