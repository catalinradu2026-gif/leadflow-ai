'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type ContElev = {
  nr: string; nume: string; user: string; parola: string
  minutePlatforma: number; ultimaConectare: string | null
  activitateModul?: Record<string, number>
  riscNivel: 'ridicat' | 'mediu' | 'ok'; riscCategorie: string[]
  coins: number; nivel: number; streak: number; badges: string[]
}
type ProfEntry = { nota: string; absMot: number; absNemot: number; observatii: string }
type ProfCatalogs = Record<string, Record<string, ProfEntry>>

const MATERII_LISTA = [
  'Matematică','Limba Română','Limba Engleză','Limba Franceză','Limba Germană',
  'Fizică','Chimie','Biologie','Informatică','TIC',
  'Istorie','Geografie','Educație Civică','Economie','Filosofie',
  'Psihologie','Sociologie','Logică','Religie',
  'Educație Fizică','Arte Vizuale','Muzică','Tehnologie',
]

export default function ProfesoriPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [view, setView] = useState<'login' | 'catalog'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)

  // Login — selectie materii multiple
  const [materiiSelectate, setMateriiSelectate] = useState<string[]>([])
  const [altaMaterie, setAltaMaterie] = useState('')

  // Catalog
  const [materie, setMaterie] = useState('')           // materia activa in catalog
  const [materiiProf, setMateriiProf] = useState<string[]>([])  // toate materiile profesorului
  const [elevi, setElevi] = useState<ContElev[]>([])
  const [nrClasa, setNrClasa] = useState('')
  const [idx, setIdx] = useState(0)

  const [profCatalogs, setProfCatalogs] = useState<ProfCatalogs>({})
  const [hydrated, setHydrated] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    try {
      const pc = localStorage.getItem('prof_catalogs')
      if (pc) setProfCatalogs(JSON.parse(pc))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('prof_catalogs', JSON.stringify(profCatalogs))
  }, [profCatalogs, hydrated])

  function toggleMaterie(m: string) {
    setMateriiSelectate(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )
  }

  function adaugaAltaMaterie() {
    const m = altaMaterie.trim()
    if (!m || materiiSelectate.includes(m)) return
    setMateriiSelectate(prev => [...prev, m])
    setAltaMaterie('')
  }

  function getEntry(elevNr: string): ProfEntry {
    return profCatalogs[materie]?.[elevNr] || { nota: '', absMot: 0, absNemot: 0, observatii: '' }
  }

  function updateEntry(elevNr: string, patch: Partial<ProfEntry>) {
    setProfCatalogs(prev => ({
      ...prev,
      [materie]: {
        ...(prev[materie] || {}),
        [elevNr]: { ...getEntry(elevNr), ...patch },
      },
    }))
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setLoginErr('Completați email și parolă.'); return }
    if (materiiSelectate.length === 0) { setLoginErr('Selectați cel puțin o materie predată.'); return }
    setLogging(true); setLoginErr('')
    await new Promise(r => setTimeout(r, 800))
    setLogging(false)
    if (email.trim().toLowerCase() !== 'contact@aicraiova.ro' || password !== 'ARACIP') {
      setLoginErr('Email sau parolă incorectă.')
      return
    }
    try {
      const conturi: ContElev[] = JSON.parse(localStorage.getItem('dir_conturi') || '[]')
      const clasa = localStorage.getItem('dir_clasa') || ''
      setElevi(conturi)
      setNrClasa(clasa)
    } catch {}
    setMateriiProf(materiiSelectate)
    setMaterie(materiiSelectate[0])
    setView('catalog')
  }

  const elev = elevi[idx]
  const entry = elev ? getEntry(elev.nr) : null
  const totalAbsElev = entry ? entry.absMot + entry.absNemot : 0

  // ---- LOGIN ----
  if (view === 'login') return (
    <div style={pageWrap(isMobile)}>
      <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #c2410c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>🧑‍💻</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Profesor</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare Profesor</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
          Accesați catalogul clasei și introduceți situația elevilor
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="Email școlar" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />

          {/* Selector materii — multi-select */}
          <div>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Materiile predate</span>
              {materiiSelectate.length > 0 && (
                <span style={{ color: '#f97316', fontWeight: 700 }}>{materiiSelectate.length} selectate</span>
              )}
            </div>

            {/* Chipuri selectate */}
            {materiiSelectate.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                {materiiSelectate.map(m => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.5)', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, color: '#fb923c' }}>
                    {m}
                    <button type="button" onClick={() => toggleMaterie(m)}
                      style={{ background: 'none', border: 'none', color: '#fb923c', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0, fontFamily: 'inherit' }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Lista scroll */}
            <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '2px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px' }}>
              {MATERII_LISTA.map(m => {
                const sel = materiiSelectate.includes(m)
                return (
                  <button key={m} type="button" onClick={() => toggleMaterie(m)}
                    style={{ background: sel ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${sel ? 'rgba(249,115,22,0.55)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '8px', padding: '5px 11px', fontSize: '12px', fontWeight: sel ? 700 : 400, color: sel ? '#fb923c' : '#475569', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {sel ? '✓ ' : ''}{m}
                  </button>
                )
              })}
            </div>

            {/* Alta materie custom */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Altă materie (ex: Latină, Spaniolă...)"
                value={altaMaterie}
                onChange={e => setAltaMaterie(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adaugaAltaMaterie() } }}
                style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '12px' }}
              />
              <button type="button" onClick={adaugaAltaMaterie}
                style={{ background: altaMaterie.trim() ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${altaMaterie.trim() ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '0 14px', fontSize: '18px', cursor: altaMaterie.trim() ? 'pointer' : 'default', color: altaMaterie.trim() ? '#fb923c' : '#334155', fontFamily: 'inherit', flexShrink: 0 }}>+</button>
            </div>
          </div>

          {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
          <button type="submit" disabled={logging} style={btnOrange}>{logging ? 'Se verifică...' : 'Intră în cont →'}</button>
        </form>

        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '10px', fontSize: '11px', color: '#fb923c', textAlign: 'center' }}>
          Acces restricționat · Contactați AIcraiova pentru credențiale
        </div>
      </div>
      <style>{`input::placeholder { color: #334155; }`}</style>
    </div>
  )

  // ---- CATALOG ----
  return (
    <div style={pageWrap(isMobile)}>
      <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>

      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '13px', background: 'linear-gradient(135deg, #c2410c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 10px', boxShadow: '0 6px 20px rgba(249,115,22,0.3)' }}>🧑‍💻</div>
        <div style={{ fontSize: '17px', fontWeight: 800 }}>Catalog Profesor</div>
        {nrClasa && <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>Clasa {nrClasa} · EDU DIGITAL</div>}
      </div>

      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Tab-uri materii */}
        {materiiProf.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {materiiProf.map(m => (
                <button key={m} onClick={() => { setMaterie(m); setIdx(0) }}
                  style={{ flex: '0 0 auto', background: 'none', border: 'none', borderBottom: `2px solid ${m === materie ? '#f97316' : 'transparent'}`, padding: '12px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: m === materie ? 700 : 400, color: m === materie ? '#fb923c' : '#475569', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {m}
                </button>
              ))}
            </div>
            <div style={{ padding: '10px 16px', fontSize: '12px', color: '#475569' }}>
              Introduceți situația elevilor pentru <span style={{ color: '#fb923c', fontWeight: 700 }}>{materie}</span>
            </div>
          </div>
        )}

        {/* Catalog elevi */}
        {elevi.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            Nicio clasă configurată.<br />
            <span style={{ fontSize: '11px' }}>Dirigintele trebuie să genereze conturile elevilor mai întâi.</span>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
              {/* Navigare */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
                  style={{ background: idx === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(249,115,22,0.15)', border: `1px solid ${idx === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(249,115,22,0.4)'}`, borderRadius: '10px', width: 40, height: 40, cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#334155' : '#fb923c', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }}>←</button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#f1f5f9' }}>{elev?.nr}. {elev?.nume}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>Elev {idx + 1} din {elevi.length}</div>
                </div>
                <button onClick={() => setIdx(Math.min(elevi.length - 1, idx + 1))} disabled={idx === elevi.length - 1}
                  style={{ background: idx === elevi.length - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(249,115,22,0.15)', border: `1px solid ${idx === elevi.length - 1 ? 'rgba(255,255,255,0.06)' : 'rgba(249,115,22,0.4)'}`, borderRadius: '10px', width: 40, height: 40, cursor: idx === elevi.length - 1 ? 'not-allowed' : 'pointer', color: idx === elevi.length - 1 ? '#334155' : '#fb923c', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }}>→</button>
              </div>

              {elev && entry && (
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Nota */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Notă · {materie}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="number" min="1" max="10" placeholder="—"
                        value={entry.nota}
                        onChange={e => {
                          const v = e.target.value
                          if (v === '' || (parseFloat(v) >= 1 && parseFloat(v) <= 10)) updateEntry(elev.nr, { nota: v })
                        }}
                        style={{ ...inputStyle, width: '90px', fontSize: '36px', fontWeight: 900, textAlign: 'center', padding: '12px', color: entry.nota ? (parseFloat(entry.nota) < 5 ? '#f87171' : parseFloat(entry.nota) < 7 ? '#fbbf24' : '#4ade80') : '#334155' }}
                      />
                      <div style={{ flex: 1 }}>
                        {entry.nota && (
                          <div style={{ fontSize: '13px', fontWeight: 700, color: parseFloat(entry.nota) < 5 ? '#f87171' : parseFloat(entry.nota) < 7 ? '#fbbf24' : '#4ade80' }}>
                            {parseFloat(entry.nota) < 5 ? '⚠️ Sub medie' : parseFloat(entry.nota) < 7 ? '📈 Satisfăcător' : parseFloat(entry.nota) < 9 ? '✅ Bine' : '⭐ Excelent'}
                          </div>
                        )}
                        <div style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Notă 1–10</div>
                      </div>
                      {savedFlash && <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>✓ Salvat</div>}
                    </div>
                  </div>

                  {/* Absente */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Absențe · {materie}</div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {([['absMot','Motivate','#4ade80','rgba(34,197,94,0.15)','rgba(34,197,94,0.3)'],
                        ['absNemot','Nemotivate','#f87171','rgba(239,68,68,0.15)','rgba(239,68,68,0.3)']] as const).map(([field, label, color, bg, border]) => (
                        <div key={field} style={{ flex: 1, minWidth: '100px', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', marginBottom: '8px', color }}>{label}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button onClick={() => updateEntry(elev.nr, { [field]: Math.max(0, entry[field] - 1) })}
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color: '#94a3b8', fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                            <span style={{ fontSize: '28px', fontWeight: 800, color, minWidth: '40px', textAlign: 'center' }}>{entry[field]}</span>
                            <button onClick={() => updateEntry(elev.nr, { [field]: entry[field] + 1 })}
                              style={{ background: bg, border: `1px solid ${border}`, borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color, fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {totalAbsElev > 0 && <div style={{ marginTop: '10px', fontSize: '12px', color: '#475569', textAlign: 'center' }}>Total: {totalAbsElev} absențe</div>}
                  </div>

                  {/* Observatii */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Observații</div>
                    <textarea
                      placeholder="Comportament, participare, observații speciale..."
                      value={entry.observatii}
                      onChange={e => updateEntry(elev.nr, { observatii: e.target.value })}
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontSize: '13px' }}
                    />
                  </div>
                </div>
              )}

              {/* Puncte navigare */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '16px' }}>
                {elevi.map((_, i) => {
                  const e = getEntry(elevi[i].nr)
                  const areDate = e.nota || e.absMot > 0 || e.absNemot > 0 || e.observatii
                  return (
                    <button key={i} onClick={() => setIdx(i)}
                      style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: '4px', background: i === idx ? '#f97316' : areDate ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                  )
                })}
              </div>
            </div>

            {/* Sumar clasă */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>Sumar clasă · {materie}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(() => {
                  const cuNote = elevi.filter(e => getEntry(e.nr).nota)
                  const medieGen = cuNote.length
                    ? cuNote.reduce((s, e) => s + parseFloat(getEntry(e.nr).nota || '0'), 0) / cuNote.length
                    : null
                  const subMedie = cuNote.filter(e => parseFloat(getEntry(e.nr).nota || '0') < 5).length
                  const totalAbs = elevi.reduce((s, e) => s + getEntry(e.nr).absNemot, 0)
                  return (
                    <>
                      <div style={statCard('#6366f1')}><div style={{ fontSize: '18px', fontWeight: 800 }}>{cuNote.length}/{elevi.length}</div><div style={{ fontSize: '10px' }}>note introduse</div></div>
                      {medieGen !== null && <div style={statCard('#4ade80')}><div style={{ fontSize: '18px', fontWeight: 800 }}>{medieGen.toFixed(2)}</div><div style={{ fontSize: '10px' }}>medie clasă</div></div>}
                      {subMedie > 0 && <div style={statCard('#f87171')}><div style={{ fontSize: '18px', fontWeight: 800 }}>{subMedie}</div><div style={{ fontSize: '10px' }}>sub medie</div></div>}
                      {totalAbs > 0 && <div style={statCard('#fbbf24')}><div style={{ fontSize: '18px', fontWeight: 800 }}>{totalAbs}</div><div style={{ fontSize: '10px' }}>abs. nemot.</div></div>}
                    </>
                  )
                })()}
              </div>
            </div>
          </>
        )}

        <button onClick={() => { setView('login'); setEmail(''); setPassword(''); setMateriiSelectate([]); setAltaMaterie('') }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
          Deconectare
        </button>
      </div>

      <style>{`input::placeholder { color: #334155; } textarea::placeholder { color: #334155; }`}</style>
    </div>
  )
}

function statCard(color: string): React.CSSProperties {
  return { flex: 1, minWidth: '70px', background: `${color}14`, border: `1px solid ${color}33`, borderRadius: '10px', padding: '10px', textAlign: 'center', color }
}

function pageWrap(isMobile: boolean): React.CSSProperties {
  return {
    minHeight: '100vh', background: '#060b14',
    fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: isMobile ? '20px 16px 60px' : '40px 20px 60px',
  }
}

const backBtn: React.CSSProperties = {
  position: 'fixed', top: 20, left: 20,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '8px 16px', color: '#94a3b8',
  cursor: 'pointer', fontSize: '13px', fontFamily: "'Segoe UI', Arial, sans-serif",
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9',
  outline: 'none', fontFamily: "'Segoe UI', Arial, sans-serif",
  width: '100%', boxSizing: 'border-box',
}

const btnOrange: React.CSSProperties = {
  background: 'linear-gradient(135deg, #c2410c, #f97316)', border: 'none',
  borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700,
  color: '#fff', cursor: 'pointer', fontFamily: "'Segoe UI', Arial, sans-serif",
  boxShadow: '0 4px 16px rgba(249,115,22,0.35)', transition: 'opacity 0.2s',
}
