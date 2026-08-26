'use client'
import Link from 'next/link'
import BTGate from './BTGate'
import BTChatbot from '../components/BTChatbot'

const CARDS = [
  { href: '/demo-bt-2026/carduri', emoji: '💳', title: 'Carduri', desc: 'Debit, credit, business — Star Card, Visa Classic, BT Flying Blue și altele.' },
  { href: '/demo-bt-2026/credite', emoji: '🏠', title: 'Credite', desc: 'Nevoi personale, imobiliar/ipotecar, Prima Casă.' },
  { href: '/demo-bt-2026/conturi', emoji: '🏦', title: 'Conturi curente', desc: 'Deschidere 100% online, fără comision de administrare.' },
  { href: '/demo-bt-2026/imm', emoji: '📈', title: 'IMM & companii', desc: 'BT Mic, BT Profi, BT Invest, garanții FNGCIMM/FEI.' },
  { href: '/demo-bt-2026/onboarding', emoji: '🚀', title: 'Deschidere cont online', desc: 'Ghid pas cu pas prin procesul real NEOcont, prin BT Pay.' },
  { href: '/demo-bt-2026/suport', emoji: '🧭', title: 'Triaj suport (concept)', desc: 'Demonstrație conceptuală — cum ar clasifica Nora o problemă de suport.' },
]

export default function DemoBtHub() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 100px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.35)', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', fontWeight: 700, color: '#2ea89d', letterSpacing: '0.5px', marginBottom: '18px' }}>
            DEMO PRIVAT · CONCEPT NEOFICIAL
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px', lineHeight: 1.25 }}>
            Consultant bancar AI — prototip
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '620px', marginBottom: '36px' }}>
            Un asistent conversațional care nu doar răspunde la întrebări — pune întrebările potrivite ca să
            înțeleagă nevoia reală, apoi recomandă exact ce se potrivește. Alegeți o categorie de produse mai jos
            sau deschideți direct chat-ul din dreapta jos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {CARDS.map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px', height: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{c.emoji}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>{c.title}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{c.desc}</div>
                  <div style={{ fontSize: '12px', color: '#2ea89d', fontWeight: 700, marginTop: '14px' }}>Vezi detalii →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BTChatbot
        context="general"
        salut="Bună ziua! Sunt Nora, asistentul AI virtual pentru acest demo — nu sunt un consultant uman. Sunt aici să vă ajut să găsiți exact ce vă trebuie. Ce căutați astăzi — un card, un credit, un cont curent, sau soluții pentru firma dumneavoastră?"
      />
    </BTGate>
  )
}
