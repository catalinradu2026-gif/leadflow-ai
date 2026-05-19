'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

const PASI = [
  { id: 1, titlu: 'Date identificare', desc: 'Denumire, CUI, adresă, reprezentant legal' },
  { id: 2, titlu: 'Structura unității', desc: 'Nivel de învățământ, profil, capacitate' },
  { id: 3, titlu: 'Spații și dotări', desc: 'Săli de clasă, laboratoare, suprafețe' },
  { id: 4, titlu: 'Cadre didactice', desc: 'Lista profesorilor, grade didactice, specialități' },
  { id: 5, titlu: 'Documente anexe', desc: 'Avize ISU, sanitar, CF, acord proprietar' },
  { id: 6, titlu: 'Confirmare și trimitere', desc: 'Verificare finală și depunere dosar' },
]

export default function Autorizare() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [pasActiv, setPasActiv] = useState(1)
  const [trimis, setTrimis] = useState(false)

  const [form, setForm] = useState({
    denumire: '',
    cui: '',
    adresa: '',
    reprezentant: '',
    nivel: '',
    profil: '',
    capacitate: '',
    sali: '',
    suprafata: '',
  })

  if (trimis) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>Dosar Depus cu Succes</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
            Dosarul de autorizare pentru <strong style={{ color: '#f1f5f9' }}>{form.denumire || 'unitatea dvs.'}</strong> a fost înregistrat la ARACIP.
          </p>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', marginBottom: '24px', marginTop: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Număr de înregistrare</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6', letterSpacing: '2px' }}>AUT-2026-{Math.floor(Math.random() * 9000) + 1000}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>Veți fi contactat în termen de 30 de zile lucrătoare</div>
          </div>
          <button onClick={() => router.push('/acreditare')} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            ← Înapoi la Acreditare
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '18px' }}>📋</span>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Dosar Autorizare Funcționare</div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>Pasul {pasActiv} din {PASI.length}</div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', gap: '32px', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Steps sidebar / progress on mobile */}
        <div style={isMobile ? { display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '8px' } : { width: '220px', flexShrink: 0 }}>
          {PASI.map(p => (
            <div
              key={p.id}
              onClick={() => setPasActiv(p.id)}
              style={isMobile
                ? { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px', cursor: 'pointer', flexShrink: 0, minWidth: '60px', textAlign: 'center' }
                : { display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid #1e293b' }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700,
                background: p.id < pasActiv ? '#22c55e' : p.id === pasActiv ? '#3b82f6' : '#334155',
                color: p.id < pasActiv || p.id === pasActiv ? '#fff' : '#64748b',
              }}>
                {p.id < pasActiv ? '✓' : p.id}
              </div>
              {!isMobile && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: p.id === pasActiv ? '#f1f5f9' : '#64748b' }}>{p.titlu}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>{p.desc}</div>
                </div>
              )}
              {isMobile && (
                <div style={{ fontSize: '9px', color: p.id === pasActiv ? '#f1f5f9' : '#64748b', fontWeight: p.id === pasActiv ? 700 : 400 }}>{p.titlu}</div>
              )}
            </div>
          ))}
        </div>

        {/* Form area */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>
              {PASI[pasActiv - 1].titlu}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              {PASI[pasActiv - 1].desc}
            </p>

            {pasActiv === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Denumire completă a unității', key: 'denumire', placeholder: 'ex: Liceul Teoretic „Mihai Eminescu"' },
                  { label: 'CUI / CIF', key: 'cui', placeholder: 'ex: 12345678' },
                  { label: 'Adresa completă', key: 'adresa', placeholder: 'Str., Nr., Localitate, Județ' },
                  { label: 'Reprezentant legal', key: 'reprezentant', placeholder: 'Nume și prenume director' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {pasActiv === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Nivel de învățământ', key: 'nivel', placeholder: 'ex: Preșcolar / Primar / Gimnazial / Liceal' },
                  { label: 'Profil / Specializare', key: 'profil', placeholder: 'ex: Real, Uman, Tehnologic, Vocațional' },
                  { label: 'Capacitate maximă (elevi)', key: 'capacitate', placeholder: 'ex: 450' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {pasActiv === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Număr săli de clasă', key: 'sali', placeholder: 'ex: 18' },
                  { label: 'Suprafață totală (mp)', key: 'suprafata', placeholder: 'ex: 2400' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '10px', padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                  📎 Încărcare fotografii spații (drag & drop sau click)
                  <div style={{ fontSize: '11px', marginTop: '6px', color: '#334155' }}>JPG, PNG — max 10MB per fișier</div>
                </div>
              </div>
            )}

            {pasActiv === 4 && (
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Cadre didactice înregistrate: 0</div>
                  <button style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer' }}>
                    + Adaugă cadru didactic
                  </button>
                </div>
                <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '10px', padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                  📎 Sau importă lista din Excel (format standard ARACIP)
                </div>
              </div>
            )}

            {pasActiv === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Aviz ISU (securitate la incendiu)', 'Aviz sanitar (DSP)', 'Extras CF / Titlu proprietate', 'Acord proprietar (dacă e cazul)', 'Regulament intern', 'Oferta educațională'].map(doc => (
                  <div key={doc} style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>📄 {doc}</span>
                    <button style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '11px', cursor: 'pointer' }}>Încarcă</button>
                  </div>
                ))}
              </div>
            )}

            {pasActiv === 6 && (
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Sumar dosar</div>
                  {[
                    { label: 'Unitate', val: form.denumire || '—' },
                    { label: 'CUI', val: form.cui || '—' },
                    { label: 'Nivel', val: form.nivel || '—' },
                    { label: 'Capacitate', val: form.capacitate ? `${form.capacitate} elevi` : '—' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>{r.label}</span>
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid #3b82f644', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#93c5fd', lineHeight: 1.6 }}>
                  ℹ️ Prin trimiterea dosarului confirmați că toate informațiile sunt corecte și că acceptați procesarea datelor de către ARACIP conform GDPR.
                </div>
                <button
                  onClick={() => setTrimis(true)}
                  style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
                >
                  📤 Trimite Dosarul la ARACIP →
                </button>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button
                onClick={() => setPasActiv(Math.max(1, pasActiv - 1))}
                disabled={pasActiv === 1}
                style={{ background: '#334155', color: pasActiv === 1 ? '#475569' : '#e2e8f0', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: pasActiv === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Înapoi
              </button>
              {pasActiv < PASI.length && (
                <button
                  onClick={() => setPasActiv(Math.min(PASI.length, pasActiv + 1))}
                  style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Continuă →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
