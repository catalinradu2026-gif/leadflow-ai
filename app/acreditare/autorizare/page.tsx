'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'
import { JUDETE } from '../../../lib/judete'

const PASI = [
  { id: 1, titlu: 'Date identificare', desc: 'Denumire, CUI, adresă, reprezentant legal' },
  { id: 2, titlu: 'Structura unității', desc: 'Nivel de învățământ, profil, capacitate' },
  { id: 3, titlu: 'Spații și dotări', desc: 'Săli de clasă, laboratoare, suprafețe' },
  { id: 4, titlu: 'Cadre didactice', desc: 'Lista profesorilor, grade didactice, specialități' },
  { id: 5, titlu: 'Documente anexe', desc: 'Proiect dezvoltare, avize ISU/DSP, acte spații' },
  { id: 6, titlu: 'Confirmare și trimitere', desc: 'Verificare finală și depunere dosar' },
]

// Documentele oficiale pentru autorizarea de funcționare provizorie (HG 994/2020 + procedura ARACIP)
const DOCUMENTE = [
  'Proiect de dezvoltare instituțională (3–5 ani)',
  'Oferta educațională',
  'Acte privind spațiile / regimul de proprietate (extras CF, titlu, acord proprietar)',
  'Lista dotărilor și a echipamentelor',
  'Aviz ISU (securitate la incendiu)',
  'Aviz sanitar (DSP / Ministerul Sănătății)',
  'Proiect de regulament intern',
]

export default function Autorizare() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [pasActiv, setPasActiv] = useState(1)
  const [trimis, setTrimis] = useState(false)
  const [nrInreg, setNrInreg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    denumire: '', cui: '', adresa: '', reprezentant: '', email: '', telefon: '',
    nivel: '', profil: '', capacitate: '', sali: '', suprafata: '',
  })
  const [judet, setJudet] = useState('')
  const [tipSolicitant, setTipSolicitant] = useState<'noua' | 'existenta'>('noua')

  // Documente încărcate: { [nume document]: { name, url } }
  const [docs, setDocs] = useState<Record<string, { name: string; url: string }>>({})
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingDocRef = useRef<string | null>(null)

  function alegeFisier(doc: string) {
    pendingDocRef.current = doc
    fileInputRef.current?.click()
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const doc = pendingDocRef.current
    e.target.value = '' // permite re-selectarea aceluiași fișier
    if (!file || !doc) return
    setUploadingDoc(doc); setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/autorizare-upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data?.ok && data.url) {
        setDocs(prev => ({ ...prev, [doc]: { name: data.name || file.name, url: data.url } }))
      } else {
        setErr(data?.error || 'Încărcare eșuată.')
      }
    } catch {
      setErr('Eroare de conexiune la încărcare.')
    } finally {
      setUploadingDoc(null)
    }
  }

  async function trimiteDosar() {
    if (submitting) return
    if (!form.denumire.trim()) { setErr('Completați denumirea unității (Pasul 1).'); setPasActiv(1); return }
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) { setErr('Introduceți un email valid (Pasul 1) — acolo primiți rezultatul.'); setPasActiv(1); return }
    setSubmitting(true); setErr('')
    try {
      const res = await fetch('/api/autorizare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tip_solicitant: tipSolicitant,
          denumire: form.denumire, cui: form.cui, judet, adresa: form.adresa, reprezentant: form.reprezentant,
          email: form.email, telefon: form.telefon,
          nivel: form.nivel, profil: form.profil, capacitate: form.capacitate, sali: form.sali, suprafata: form.suprafata,
          documente: Object.entries(docs).map(([tip, d]) => ({ tip, nume: d.name, url: d.url })),
        }),
      })
      const data = await res.json()
      setNrInreg(data?.nr_inregistrare || `AUT-${new Date().getFullYear()}-0000`)
      setTrimis(true)
    } catch {
      setErr('Eroare la trimitere. Încercați din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  if (trimis) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>Dosar Depus cu Succes</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
            Dosarul de autorizare pentru <strong style={{ color: '#f1f5f9' }}>{form.denumire || 'unitatea dvs.'}</strong> a fost înregistrat la ARACIP.
          </p>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', marginBottom: '16px', marginTop: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Număr de înregistrare — păstrați-l</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6', letterSpacing: '2px' }}>{nrInreg}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>Veți fi contactat în termen de 30 de zile lucrătoare</div>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd', marginBottom: '8px' }}>📧 Ce urmează</div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.7 }}>
              <li>Ați primit pe <strong style={{ color: '#f1f5f9' }}>{form.email || 'emailul dvs.'}</strong> confirmarea depunerii.</li>
              <li>Când ARACIP decide (admis/respins), primiți din nou email cu rezultatul.</li>
              <li>Puteți verifica oricând stadiul cu <strong style={{ color: '#f1f5f9' }}>numărul de mai sus + emailul</strong>, fără cont.</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push(`/acreditare/autorizare/stadiu?nr=${encodeURIComponent(nrInreg)}`)} style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              🔎 Verifică stadiul cererii
            </button>
            <button onClick={() => router.push('/acreditare')} style={{ background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              ← Înapoi la Acreditare
            </button>
          </div>
        </div>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      {/* input file ascuns, refolosit pentru toate documentele */}
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" onChange={onFileSelected} style={{ display: 'none' }} />

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '18px' }}>📋</span>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Dosar Autorizare Funcționare</div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>Pasul {pasActiv} din {PASI.length}</div>
      </div>

      {/* Îndemn către asistentul ARA */}
      <div style={{ background: 'rgba(59,130,246,0.08)', borderBottom: '1px solid rgba(59,130,246,0.15)', padding: '10px 24px', fontSize: '12.5px', color: '#93c5fd', textAlign: 'center' }}>
        💬 Ai o întrebare despre dosar? Apasă <strong>ARA</strong>, asistentul AI (butonul 🏛️ din dreapta-jos) — îți explică pașii și ce documente ai nevoie.
      </div>

      <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', gap: '32px', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Steps sidebar / progress on mobile */}
        <div style={isMobile ? { display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '8px' } : { width: '220px', flexShrink: 0 }}>
          {PASI.map(p => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={`Pasul ${p.id}: ${p.titlu}`}
              aria-current={p.id === pasActiv}
              onClick={() => setPasActiv(p.id)}
              onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setPasActiv(p.id) } }}
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
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>{PASI[pasActiv - 1].titlu}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>{PASI[pasActiv - 1].desc}</p>

            {pasActiv === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Tip solicitant</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {([['noua', '🆕 Unitate nouă'], ['existenta', '🏫 Unitate existentă (nivel/specializare nouă)']] as const).map(([val, lab]) => (
                      <button key={val} type="button" onClick={() => setTipSolicitant(val)} style={{ flex: 1, minWidth: '160px', background: tipSolicitant === val ? 'rgba(59,130,246,0.18)' : '#0f172a', border: `1.5px solid ${tipSolicitant === val ? '#3b82f6' : '#334155'}`, color: tipSolicitant === val ? '#93c5fd' : '#94a3b8', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{lab}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                    {tipSolicitant === 'noua' ? 'Persoană fizică/juridică ce înființează o unitate nouă.' : 'Unitate deja autorizată/acreditată care solicită autorizare pentru un nivel sau o specializare nouă.'}
                  </div>
                </div>
                {[
                  { label: 'Denumire completă a unității', key: 'denumire', placeholder: 'ex: Grădinița „Prichindel"' },
                  { label: 'CUI / CIF', key: 'cui', placeholder: 'ex: 12345678' },
                  { label: 'Adresa completă', key: 'adresa', placeholder: 'Str., Nr., Localitate' },
                  { label: 'Reprezentant legal', key: 'reprezentant', placeholder: 'Nume și prenume' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Județ</label>
                  <select value={judet} onChange={e => setJudet(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">— alege județul —</option>
                    {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#93c5fd', marginBottom: '10px' }}>📧 Date de contact — aici primiți rezultatul</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplu.ro" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefon</label>
                      <input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="07xx xxx xxx" style={inputStyle} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                      Pe email primiți confirmarea depunerii și, ulterior, decizia ARACIP (admis/respins). Cu <strong>numărul cererii + acest email</strong> puteți verifica oricând stadiul dosarului — fără cont sau parolă.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pasActiv === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Nivel de învățământ', key: 'nivel', placeholder: 'ex: Preșcolar / Primar / Gimnazial / Liceal' },
                  { label: 'Profil / Specializare', key: 'profil', placeholder: 'ex: Real, Uman, Tehnologic, Vocațional' },
                  { label: 'Capacitate maximă (copii/elevi)', key: 'capacitate', placeholder: 'ex: 120' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
            )}

            {pasActiv === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Număr săli de clasă / grupă', key: 'sali', placeholder: 'ex: 6' },
                  { label: 'Suprafață totală (mp)', key: 'suprafata', placeholder: 'ex: 480' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '10px', padding: '18px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                  📎 Fotografiile spațiilor se pot atașa la Pasul 5 (Documente anexe).
                </div>
              </div>
            )}

            {pasActiv === 4 && (
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '12px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                  Lista cadrelor didactice (nume, grad didactic, specialitate) se atașează ca document la Pasul 5 (ex. în format Excel/PDF), conform cerințelor ARACIP.
                </div>
              </div>
            )}

            {pasActiv === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Încărcați documentele (PDF, Word, Excel sau imagini — max 10 MB/fișier):</div>
                {DOCUMENTE.map(doc => {
                  const incarcat = docs[doc]
                  const inProgres = uploadingDoc === doc
                  return (
                    <div key={doc} style={{ background: '#0f172a', border: `1px ${incarcat ? 'solid #22c55e55' : 'dashed #334155'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: incarcat ? '#86efac' : '#94a3b8', flex: 1 }}>
                        {incarcat ? '✅' : '📄'} {doc}
                        {incarcat && <span style={{ display: 'block', fontSize: '11px', color: '#475569', marginTop: '2px' }}>{incarcat.name}</span>}
                      </span>
                      <button
                        onClick={() => alegeFisier(doc)}
                        disabled={inProgres}
                        style={{ background: incarcat ? '#166534' : '#334155', color: incarcat ? '#bbf7d0' : '#94a3b8', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, cursor: inProgres ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {inProgres ? 'Se încarcă...' : incarcat ? 'Înlocuiește' : 'Încarcă'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {pasActiv === 6 && (
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Sumar dosar</div>
                  {[
                    { label: 'Unitate', val: form.denumire || '—' },
                    { label: 'CUI', val: form.cui || '—' },
                    { label: 'Județ', val: judet || '—' },
                    { label: 'Nivel', val: form.nivel || '—' },
                    { label: 'Capacitate', val: form.capacitate ? `${form.capacitate} copii/elevi` : '—' },
                    { label: 'Documente atașate', val: `${Object.keys(docs).length} din ${DOCUMENTE.length}` },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>{r.label}</span>
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid #3b82f644', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#93c5fd', lineHeight: 1.6 }}>
                  ℹ️ Prin trimiterea dosarului confirmați că informațiile sunt corecte și acceptați prelucrarea datelor de către ARACIP conform GDPR.
                </div>
                {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>{err}</div>}
                <button
                  onClick={trimiteDosar}
                  disabled={submitting}
                  style={{ width: '100%', background: submitting ? '#1e40af' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'wait' : 'pointer' }}
                >
                  {submitting ? 'Se trimite...' : '📤 Trimite Dosarul la ARACIP →'}
                </button>
              </div>
            )}

            {err && pasActiv === 5 && <div style={{ marginTop: '12px', fontSize: '12px', color: '#f87171' }}>{err}</div>}

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button onClick={() => setPasActiv(Math.max(1, pasActiv - 1))} disabled={pasActiv === 1} style={{ background: '#334155', color: pasActiv === 1 ? '#475569' : '#e2e8f0', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: pasActiv === 1 ? 'not-allowed' : 'pointer' }}>← Înapoi</button>
              {pasActiv < PASI.length && (
                <button onClick={() => setPasActiv(Math.min(PASI.length, pasActiv + 1))} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Continuă →</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
