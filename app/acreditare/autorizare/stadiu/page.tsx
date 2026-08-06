'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { genereazaAutorizatie } from '../../../../lib/autorizatie'

type Cerere = {
  nr_inregistrare: string; denumire: string; cui: string | null; judet: string | null
  nivel: string | null; status: string; motiv: string | null; decizie_at: string | null; created_at: string
}

const STATUS_INFO: Record<string, { label: string; culoare: string; bg: string; icon: string; mesaj: string }> = {
  depusa:     { label: 'Depusă — în așteptare', culoare: '#cbd5e1', bg: 'rgba(148,163,184,0.15)', icon: '📥', mesaj: 'Dosarul a fost înregistrat și așteaptă analiza ARACIP.' },
  in_analiza: { label: 'În analiză',            culoare: '#fbbf24', bg: 'rgba(245,158,11,0.15)', icon: '🔎', mesaj: 'Comisia ARACIP evaluează dosarul dumneavoastră.' },
  autorizat:  { label: 'AUTORIZAT ✓',           culoare: '#4ade80', bg: 'rgba(34,197,94,0.15)',  icon: '✅', mesaj: 'Felicitări! Cererea a fost aprobată. Puteți descărca autorizația de funcționare.' },
  respinsa:   { label: 'Respinsă',              culoare: '#f87171', bg: 'rgba(239,68,68,0.15)',  icon: '❌', mesaj: 'Cererea a fost respinsă. Vedeți motivul mai jos.' },
}

export default function StadiuCererePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
      <StadiuCerere />
    </Suspense>
  )
}

function StadiuCerere() {
  const router = useRouter()
  const sp = useSearchParams()
  const [nr, setNr] = useState(sp.get('nr') || '')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [cerere, setCerere] = useState<Cerere | null>(null)

  async function verifica(e: React.FormEvent) {
    e.preventDefault()
    if (!nr.trim() || !email.trim()) { setErr('Completați numărul cererii și emailul.'); return }
    setLoading(true); setErr(''); setCerere(null)
    try {
      const r = await fetch(`/api/autorizare/status?nr=${encodeURIComponent(nr.trim())}&email=${encodeURIComponent(email.trim())}`)
      const d = await r.json()
      if (d?.ok) setCerere(d.cerere)
      else setErr(d?.error || 'Nu am găsit cererea.')
    } catch { setErr('Eroare de conexiune.') }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }
  const info = cerere ? (STATUS_INFO[cerere.status] || STATUS_INFO.depusa) : null

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '18px' }}>🔎</span>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Stadiul cererii de autorizare</div>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* Instrucțiuni — cum se autentifică */}
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '18px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#93c5fd', marginBottom: '10px' }}>ℹ️ Cum verificați stadiul dosarului</div>
          <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.8 }}>
            <li>Nu aveți nevoie de cont sau parolă.</li>
            <li>Introduceți <strong style={{ color: '#f1f5f9' }}>numărul de înregistrare</strong> primit la depunere (ex. <code style={{ color: '#93c5fd' }}>AUT-2026-3837</code>).</li>
            <li>Introduceți <strong style={{ color: '#f1f5f9' }}>emailul</strong> cu care ați depus dosarul — acesta confirmă că sunteți solicitantul.</li>
            <li>Vedeți starea: <em>Depusă → În analiză → Autorizat / Respinsă</em>. Dacă e autorizat, descărcați autorizația direct de aici.</li>
          </ol>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(59,130,246,0.2)', fontSize: 12.5, color: '#93c5fd' }}>
            💬 Nu găsiți ceva? Apasă <strong>ARA</strong>, asistentul AI (butonul 🏛️ din dreapta-jos).
          </div>
        </div>

        {/* Formular „autentificare” */}
        <form onSubmit={verifica} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Număr de înregistrare</label>
            <input value={nr} onChange={e => setNr(e.target.value)} placeholder="AUT-2026-XXXX" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email folosit la depunere</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplu.ro" style={inputStyle} />
          </div>
          {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#1e40af' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Se verifică...' : '🔎 Verifică stadiul'}
          </button>
        </form>

        {/* Rezultat */}
        {cerere && info && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Cererea</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6', letterSpacing: '1px', marginBottom: '4px' }}>{cerere.nr_inregistrare}</div>
            <div style={{ fontSize: '15px', color: '#f1f5f9', fontWeight: 600, marginBottom: '20px' }}>{cerere.denumire}</div>

            <div style={{ background: info.bg, border: `1px solid ${info.culoare}44`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{info.icon}</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: info.culoare }}>{info.label}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>{info.mesaj}</div>
              {cerere.motiv && cerere.status === 'respinsa' && (
                <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', fontSize: '13px', color: '#fca5a5' }}>
                  <strong>Motiv:</strong> {cerere.motiv}
                </div>
              )}
              {cerere.decizie_at && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>Decizie ARACIP: {new Date(cerere.decizie_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              )}
            </div>

            {/* Timeline simplu — 3 pași: Depusă → În analiză → Decizie (Autorizat/Respinsă) */}
            {(() => {
              const respinsa = cerere.status === 'respinsa'
              const decizieLuata = respinsa || cerere.status === 'autorizat'
              const inAnaliza = decizieLuata || cerere.status === 'in_analiza'
              const pasi = [
                { eticheta: 'Depusă', atins: true, culoare: STATUS_INFO.depusa.culoare },
                { eticheta: 'În analiză', atins: inAnaliza, culoare: STATUS_INFO.in_analiza.culoare },
                { eticheta: respinsa ? 'Respinsă' : 'Autorizat', atins: decizieLuata, culoare: respinsa ? STATUS_INFO.respinsa.culoare : STATUS_INFO.autorizat.culoare },
              ]
              return (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {pasi.map((p, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ height: 4, borderRadius: 2, background: p.atins ? p.culoare : '#334155', marginBottom: 6 }} />
                      <div style={{ fontSize: 10, color: p.atins ? p.culoare : '#475569' }}>{p.eticheta}</div>
                    </div>
                  ))}
                </div>
              )
            })()}

            {cerere.status === 'autorizat' && (
              <button
                onClick={() => genereazaAutorizatie({ denumire: cerere.denumire, cui: cerere.cui || undefined, judet: cerere.judet || undefined, nivel: cerere.nivel || undefined, nrInregistrare: cerere.nr_inregistrare })}
                style={{ width: '100%', background: '#166534', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                📄 Descarcă Autorizația de Funcționare (PDF)
              </button>
            )}
            {(cerere.status === 'depusa' || cerere.status === 'in_analiza') && (
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Reveniți pentru a verifica evoluția. Veți fi contactat în termen de 30 de zile lucrătoare.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
