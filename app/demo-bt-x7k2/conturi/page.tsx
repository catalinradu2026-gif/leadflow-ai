'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const PUNCTE = [
  { emoji: '✅', text: 'Fără comision de deschidere și fără comision lunar de administrare (0 lei) în oferta standard.' },
  { emoji: '📱', text: 'Deschidere 100% online prin aplicația BT Pay, în câteva minute, fără drum la bancă.' },
  { emoji: '💱', text: 'Disponibil în lei sau valută.' },
  { emoji: '🔁', text: 'Transferuri BT→BT gratuite.' },
  { emoji: '💵', text: 'Depunere numerar interbancară în cont lei ~5 lei/operațiune (orientativ).' },
  { emoji: '⚡', text: 'Plăți interbancare urgente/externe prin internet/mobile banking ~10 lei + comision BNR unde e cazul (orientativ).' },
]

export default function ConturiPage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-x7k2" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>🏦</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Conturi curente</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.6 }}>
            Deschidere rapidă, fără costuri de administrare în oferta standard. Comisioanele complete și
            actualizate sunt publicate de bancă în broșura oficială de taxe și comisioane.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PUNCTE.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{p.emoji}</span>
                <span style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BTChatbot
        context="conturi"
        salut="Bună ziua! Sunt Ana, asistentul AI virtual — nu sunt un consultant uman. Pentru contul curent — vreți în lei sau valută, și preferați să faceți totul 100% online? Spuneți-mi ce folosiți cel mai des (plăți curente, transferuri, economii) ca să vă recomand corect."
        intrebari={['Cont în lei', 'Cont în valută', 'Deschidere 100% online']}
      />
    </BTGate>
  )
}
