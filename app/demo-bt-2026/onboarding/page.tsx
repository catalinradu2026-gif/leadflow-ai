'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const PASI = [
  {
    nr: 1, emoji: '📲', titlu: 'Descarci aplicația BT Pay',
    text: 'Disponibilă pe Android și iOS. Este singura aplicație necesară pentru tot procesul.',
  },
  {
    nr: 2, emoji: '📝', titlu: 'Introduci câteva date despre tine',
    text: 'Informații de bază, direct în aplicație.',
  },
  {
    nr: 3, emoji: '🪪', titlu: 'Confirmi identitatea',
    text: 'Fotografiezi actul de identitate (CI sau carte electronică de identitate) și faci un selfie/o scurtă filmare pentru verificare facială — proces automat, la distanță, nu neapărat un apel video live cu un operator uman.',
  },
  {
    nr: 4, emoji: '💳', titlu: 'Alegi tipul de abonament pentru cont',
    text: 'Selectezi varianta de cont curent (NEOcont) potrivită nevoilor tale.',
  },
  {
    nr: 5, emoji: '✅', titlu: 'Gata — cont activ',
    text: 'Primești IBAN-ul prin SMS aproape imediat și poți folosi cardul digital direct din aplicație. Cardul fizic ajunge la domiciliu prin curier ulterior.',
  },
]

const CERINTE = [
  'Vârstă minimă 18 ani.',
  'Act de identitate românesc valid (CI sau carte electronică de identitate).',
  'Disponibil și pentru românii din diasporă — cu telefon din străinătate + act de identitate românesc, fără să fii fizic în România.',
]

export default function OnboardingPage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-2026" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>🚀</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Deschidere cont online — ghid pas cu pas</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px', maxWidth: '600px', lineHeight: 1.6 }}>
            Procesul real de deschidere a unui cont NEOcont prin aplicația BT Pay — 100% online, fără drum la bancă.
            Ana vă poate ghida pas cu pas direct în chat, sau puteți citi rezumatul de mai jos.
          </p>
          <div style={{ display: 'inline-flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ea89d', background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.3)', borderRadius: '20px', padding: '4px 12px' }}>⏱ ~7-10 minute</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ea89d', background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.3)', borderRadius: '20px', padding: '4px 12px' }}>🌍 Oricând, de oriunde</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ea89d', background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.3)', borderRadius: '20px', padding: '4px 12px' }}>💸 0 lei comision</span>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Cerințe</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {CERINTE.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <span style={{ color: '#2ea89d', flexShrink: 0 }}>✓</span>{c}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Pașii procesului</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PASI.map(p => (
              <div key={p.nr} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(46,168,157,0.15)', border: '1px solid rgba(46,168,157,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#2ea89d', flexShrink: 0 }}>
                  {p.nr}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{p.emoji} {p.titlu}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', lineHeight: 1.6 }}>
            ⚠️ Fluxul de mai sus e cel documentat public. Ecranele exacte din aplicație sau detalii tehnice foarte
            fine pot varia — pentru pași tehnici exacți, urmați instrucțiunile live din aplicația BT Pay.
          </div>
        </div>
      </div>
      <BTChatbot
        context="onboarding"
        salut="Bună ziua! Sunt Ana, asistentul AI virtual — nu sunt un consultant uman. Vă pot ghida pas cu pas prin procesul de deschidere a unui cont online, sau răspund direct dacă aveți o întrebare punctuală (ex. ce acte vă trebuie). Cum preferați să continuăm?"
      />
    </BTGate>
  )
}
