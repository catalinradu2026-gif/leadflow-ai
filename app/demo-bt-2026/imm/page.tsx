'use client'
import Link from 'next/link'
import BTGate from '../BTGate'
import BTChatbot from '../../components/BTChatbot'

const PRODUSE = [
  {
    nume: 'BT Mic', tip: 'Microîntreprinderi',
    detalii: 'Credit pentru capital de lucru/investiții mici, orientativ până la 150.000 lei, în anumite condiții fără garanții materiale.',
  },
  {
    nume: 'BT Profi', tip: 'Capital de lucru',
    detalii: 'Finanțare pentru capitalul de lucru al IMM-urilor.',
  },
  {
    nume: 'BT Invest', tip: 'Investiții',
    detalii: 'Finanțare dedicată investițiilor companiilor.',
  },
  {
    nume: 'Programe de garantare FNGCIMM / FEI', tip: 'Fără garanții proprii suficiente',
    detalii: 'BT colaborează cu Fondul Național de Garantare a Creditelor pentru IMM și Fondul European de Investiții. Garanții de până la 70% din valoarea finanțării, plafon până la 10 milioane lei/credit, perioadă maximă a garanției 10 ani.',
  },
  {
    nume: 'Finanțări mari', tip: 'IMM & MidCap',
    detalii: 'Până la 12,5 milioane EUR pentru IMM (definiție europeană) și până la 25 milioane EUR pentru companii MidCap (sub 3.000 angajați).',
  },
  {
    nume: 'Finanțări verzi', tip: 'Sustenabilitate',
    detalii: 'Energie regenerabilă, vehicule electrice, proiecte de eficiență energetică cu reducere de consum de minim 30%.',
  },
]

export default function ImmPage() {
  return (
    <BTGate>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1a2a, #0f2942)', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 100px' }}>
          <Link href="/demo-bt-2026" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>← Înapoi</Link>
          <div style={{ fontSize: '38px', marginTop: '18px', marginBottom: '6px' }}>📈</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>IMM &amp; companii</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.6 }}>
            Cea mai extinsă rețea de suport pentru IMM din România — peste 500.000 clienți IMM și micro.
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
        context="imm"
        salut="Bună ziua! Sunt Ana, asistentul AI virtual — nu sunt un consultant uman. Spuneți-mi puțin despre firma dumneavoastră — ce domeniu, și aveți nevoie de capital de lucru, de o investiție, sau de o garanție pentru un credit fără garanții proprii suficiente?"
      />
    </BTGate>
  )
}
