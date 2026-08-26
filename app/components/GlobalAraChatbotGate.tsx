'use client'
import { usePathname } from 'next/navigation'
import AraChatbot from './AraChatbot'

// ============================================================================
// AraChatbot.tsx are deja un guard intern (RUTE_ARA) care exclude /demo-bt-2026 —
// dar acel guard face `return null` ÎNAINTE de a apela hook-urile componentei
// (useState/useEffect etc. vin după), ceea ce încalcă regula React a hook-urilor
// (numărul de hook-uri apelate diferă între rute unde esteRutaARA e true vs false).
// Sub navigare client-side (Link) între o rută ARA și /demo-bt-2026, fără reload
// complet, această inconsistență poate produce randare imprevizibilă.
//
// Acest wrapper adaugă un AL DOILEA nivel de protecție, complet independent:
// componenta AraChatbot nu se montează DELOC pe /demo-bt-2026/* — nu doar că
// randează null, ci nici nu i se dă șansa să ruleze. Demo-ul BT (Nora) trebuie
// să rămână 100% izolat vizual și funcțional de widget-ul ARA/ARACIP.
//
// IMPORTANT: AraChatbot.tsx NU e modificat — rămâne intact, folosit normal pe
// toate celelalte rute (/aracip, /edu, /formare, /scoala, /gradinita, /demo/*).
// ============================================================================
export default function GlobalAraChatbotGate() {
  const pathname = usePathname()
  if (pathname?.startsWith('/demo-bt-2026')) return null
  return <AraChatbot />
}
