'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const PRODUSE = [
  {
    nume: 'Star Card', tip: 'Card de credit',
    detalii: 'Cardul de credit/cumpărături. Plată în rate FĂRĂ dobândă la o rețea extinsă de comercianți parteneri, sau acumulare de puncte STAR (similar unui cashback) la plata integrală.',
  },
  {
    nume: 'Visa Classic', tip: 'Card de debit · lei',
    detalii: 'Cardul zilnic în lei, pentru plăți simple online și offline oriunde.',
  },
  {
    nume: 'MasterCard Gold Debit / Mondo / Visa Electron', tip: 'Carduri de debit · lei/valută',
    detalii: 'Variante de debit emise în lei sau valută (EUR/USD), cu niveluri diferite de beneficii (asigurări de călătorie, asistență).',
  },
  {
    nume: 'BT Flying Blue', tip: 'Card de credit co-branded',
    detalii: 'Acumulează mile în programul Air France-KLM Flying Blue la fiecare cumpărătură.',
  },
  {
    nume: 'FORTE Medici', tip: 'Card dedicat',
    detalii: 'Card cu beneficii adaptate special pentru cadrele medicale.',
  },
  {
    nume: 'BT Visa Business Silver / Gold', tip: 'Carduri business',
    detalii: 'Carduri de debit pentru firme, în lei, plus variante valutare pentru companii.',
  },
]

export default function CarduriPage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-2026" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>💳</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Carduri</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '30px', maxWidth: '600px', lineHeight: 1.6 }}>
            Debit pentru uz zilnic, credit cu rate fără dobândă sau puncte, carduri co-branded și carduri business.
            Plus <strong style={{ color: '#e2e8f0' }}>BT Pay</strong> — plăți contactless cu telefonul, carduri
            virtuale în lei/EUR/USD, deschidere cont 100% online.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        </div>
      </div>
      <BTChatbot
        context="carduri"
        salut="Bună ziua! Sunt Nora, asistentul AI virtual — nu sunt un consultant uman. Văd că vă interesează cardurile. Ca să vă recomand exact ce trebuie — căutați un card de zi cu zi (debit), unul de credit cu rate sau puncte, sau ceva pentru firmă? Și în lei sau valută?"
      />
    </BTGate>
  )
}
