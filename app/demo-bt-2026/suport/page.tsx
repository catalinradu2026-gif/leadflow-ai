'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const CATEGORII = [
  { emoji: '🔑', titlu: 'Parolă / PIN uitat', text: 'De regulă rezolvată prin self-service instant, direct din aplicație — fără intervenție umană.' },
  { emoji: '🚫', titlu: 'Card pierdut, furat sau blocat', text: 'De regulă direcționat către o linie telefonică prioritară, pentru blocare imediată.' },
  { emoji: '⚠️', titlu: 'Tranzacție suspectă / fraudă', text: 'De regulă direcționat către o linie dedicată de securitate, cu prioritate maximă.' },
  { emoji: '📋', titlu: 'Reclamație complexă', text: 'De regulă direcționat către un consultant dedicat sau departamentul de relații cu clienții.' },
]

export default function SuportPage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-2026" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>🧭</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Triaj suport — demonstrație conceptuală</h1>

          <div style={{ background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.3)', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: '#fcd34d', lineHeight: 1.7, maxWidth: '640px' }}>
            ⚠️ Aceasta este o <strong>demonstrație conceptuală</strong> a logicii de triaj — Nora <strong>nu are acces
            real</strong> la conturi sau sisteme BT și <strong>nu poate debloca sau rezolva</strong> nimic efectiv.
            Scopul e să arate CUM ar putea funcționa clasificarea automată a unei probleme, nu să ofere suport real.
          </div>

          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.6 }}>
            Descrieți în chat o problemă (ex. &bdquo;am uitat parola&rdquo;, &bdquo;mi s-a blocat cardul&rdquo;, &bdquo;am o
            reclamație&rdquo;) și Nora o clasifică într-o categorie, explicând conceptual către ce canal ar fi
            direcționată în mod normal.
          </p>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Exemple de categorii de triaj</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CATEGORII.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>{c.titlu}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BTChatbot
        context="suport"
        salut="Bună ziua! Sunt Nora, asistentul AI virtual — nu sunt un consultant uman. Această pagină e o demonstrație conceptuală a logicii de triaj: descrieți-mi o problemă (ex. parolă uitată, card blocat, o reclamație) și vă arăt cum ar fi clasificată și direcționată în mod normal — nu am acces real la conturi sau sisteme BT și nu pot rezolva nimic efectiv, doar arăt logica."
      />
    </BTGate>
  )
}
