'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const PRODUSE = [
  {
    nume: 'Credit de Nevoi Personale', tip: 'Standard',
    detalii: 'Fără plafon minim obligatoriu de venit (venitul influențează suma). Dobândă fixă orientativă ~6,49%–18,50%/an (de la ~8,4%/an cu venitul la BT). Sumă până la 250.000 lei (până la 120.000 lei direct din BT Pay), minim 5.000 lei. Perioadă 1 lună – 5 ani. Include de regulă asigurare de viață și șomaj.',
  },
  {
    nume: 'Credit Imobiliar / Ipotecar', tip: 'RON sau EUR',
    detalii: 'Sumă între 1.500 și 250.000 EUR (sau echivalent). Dobândă fixă introductivă orientativă ~6,70%/an primii 3 ani (variabilă ulterior), sau ~5,15%/an fix primii 3 ani pentru clienți cu salariul la BT + imobil verde (clasă energetică A).',
  },
  {
    nume: 'Prima Casă', tip: 'Prin credit imobiliar',
    detalii: 'Finanțare de până la 80% din valoarea imobilului, cu condiții similare creditului imobiliar/ipotecar.',
  },
]

export default function CreditePage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-2026" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>🏠</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Credite</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '18px', maxWidth: '600px', lineHeight: 1.6 }}>
            Nevoi personale, locuință (imobiliar/Prima Casă) — cifrele de mai jos sunt orientative, din oferte
            publice de campanie, și se pot schimba.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {PRODUSE.map(p => (
              <div key={p.nume} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{p.nume}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2ea89d', background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.3)', borderRadius: '20px', padding: '2px 10px' }}>{p.tip}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{p.detalii}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#64748b', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px' }}>
            ⚠️ Dobânzile și sumele afișate sunt orientative, din oferte publice de campanie — pot varia. O ofertă
            fermă se obține doar printr-o simulare reală.
          </div>
        </div>
      </div>
      <BTChatbot
        context="credite"
        salut="Bună ziua! Sunt Ana, asistentul AI virtual — nu sunt un consultant uman. Pentru ce anume aveți nevoie de finanțare — nevoi personale, cumpărarea unei locuințe, sau altceva? Și, dacă vreți, spuneți-mi suma aproximativă la care vă gândiți."
        intrebari={['Credit nevoi personale', 'Credit pentru locuință', 'Prima Casă']}
      />
    </BTGate>
  )
}
