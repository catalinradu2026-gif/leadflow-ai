import { NextResponse } from 'next/server'
import { loadLog, detectObjections, extractAmount, extractMonths, amountBucket, monthsBucket } from '@/app/api/bt-log/route'

// ============================================================================
// Raport de piață AGREGAT pentru bancă — separat de tab-ul de leaduri individuale.
// Conține DOAR statistici agregate/anonimizate din bt-conversations-log — NICIUN
// nume, telefon sau email individual. Reutilizează același log ca /api/bt-log
// (aceeași sursă de date), doar agregă diferit.
// NU conține niciun mecanism de recontactare/CTA telefonic — doar statistici.
// ============================================================================

const TOPIC_LABELS: Record<string, string> = {
  general: 'General / pagina principală',
  carduri: 'Carduri',
  credite: 'Credite',
  conturi: 'Conturi curente',
  imm: 'IMM / companii',
  onboarding: 'Deschidere cont online',
  suport: 'Triaj suport',
}

export async function GET() {
  const log = await loadLog()

  // Top subiecte/produse — pe baza contextului paginii unde a avut loc mesajul
  // (dimensiune deja curată, fără nevoie de clasificare pe cuvinte-cheie).
  const topicFreq: Record<string, number> = {}
  for (const e of log) topicFreq[e.context] = (topicFreq[e.context] || 0) + 1
  const topTopics = Object.entries(topicFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([context, count]) => ({ context, label: TOPIC_LABELS[context] || context, count }))

  // Top obiecții — pattern-matching pe fraze indicator, agregat pe etichetă, fără text brut individual.
  const objectionFreq: Record<string, number> = {}
  for (const e of log) {
    for (const label of detectObjections(e.userMessage)) objectionFreq[label] = (objectionFreq[label] || 0) + 1
  }
  const topObjections = Object.entries(objectionFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }))

  // Distribuția sumelor și perioadelor cerute — bucket-uri agregate, NU cifre individuale
  // legate de o persoană anume (nu păstrăm nicio legătură mesaj↔telefon aici).
  const amountFreq: Record<string, number> = {}
  const monthsFreq: Record<string, number> = {}
  for (const e of log) {
    const amount = extractAmount(e.userMessage)
    if (amount) amountFreq[amountBucket(amount)] = (amountFreq[amountBucket(amount)] || 0) + 1
    const months = extractMonths(e.userMessage)
    if (months) monthsFreq[monthsBucket(months)] = (monthsFreq[monthsBucket(months)] || 0) + 1
  }
  const AMOUNT_ORDER = ['< 10.000 lei', '10.000–25.000 lei', '25.000–50.000 lei', '50.000–100.000 lei', '100.000+ lei']
  const MONTHS_ORDER = ['≤ 12 luni', '13–36 luni', '37–60 luni', '60+ luni']
  const amountDistribution = AMOUNT_ORDER.map(bucket => ({ bucket, count: amountFreq[bucket] || 0 })).filter(b => b.count > 0)
  const periodDistribution = MONTHS_ORDER.map(bucket => ({ bucket, count: monthsFreq[bucket] || 0 })).filter(b => b.count > 0)

  // Gap-uri de informație — întrebările userului imediat urmate de un răspuns al Anei care
  // a semnalat că nu are informația exactă (possibleGap, setat în /api/bt-chat).
  const gapQuestions = log
    .filter(e => e.possibleGap)
    .map(e => ({ intrebare: e.userMessage, context: e.context, data: e.ts }))
    .slice(-50)

  return NextResponse.json({
    totalMesaje: log.length,
    topTopics,
    topObjections,
    amountDistribution,
    periodDistribution,
    gapQuestions,
    gapCount: gapQuestions.length,
  })
}
