'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type ProfEntry = { nota: string; absMot: number; absNemot: number; observatii: string }
// [clasa][materie][elevNr] = ProfEntry
type ProfCatalogs = Record<string, Record<string, Record<string, ProfEntry>>>
type ClasaConf = { nume: string; nrElevi: number }

const MATERII_LISTA = [
  'Matematică','Limba Română','Limba Engleză','Limba Franceză','Limba Germană',
  'Fizică','Chimie','Biologie','Informatică','TIC',
  'Istorie','Geografie','Educație Civică','Economie','Filosofie',
  'Psihologie','Sociologie','Logică','Religie',
  'Educație Fizică','Arte Vizuale','Muzică','Tehnologie','Desen',
]
const GRADE = ['4','5','6','7','8','9','10','11','12']
const LITERE = ['A','B','C','D','E','F']

export default function ProfesoriPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [view, setView] = useState<'login' | 'catalog'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)

  // Login — materii
  const [materiiSelectate, setMateriiSelectate] = useState<string[]>([])
  const [altaMaterie, setAltaMaterie] = useState('')

  // Catalog
  const [materiiProf, setMateriiProf] = useState<string[]>([])
  const [materie, setMaterie] = useState('')
  // Per-subject class lists and active class
  const [clasePerMaterie, setClasePerMaterie] = useState<Record<string, ClasaConf[]>>({})
  const [clasaPerMaterie, setClasaPerMaterie] = useState<Record<string, string>>({})
  const [idx, setIdx] = useState(0)

  // Derived: current subject's classes and active class
  const clase = clasePerMaterie[materie] || []
  const clasa = clasaPerMaterie[materie] || ''

  // Add class panel
  const [adaugaClasaOpen, setAdaugaClasaOpen] = useState(false)
  const [nouaGrada, setNouaGrada] = useState('10')
  const [nouaLitera, setNouaLitera] = useState('A')
  const [nouaLiteraCustom, setNouaLiteraCustom] = useState('')
  const [nrEleviNou, setNrEleviNou] = useState(30)

  // Add subject panel
  const [adaugaMaterieOpen, setAdaugaMaterieOpen] = useState(false)
  const [nouaMaterie, setNouaMaterie] = useState('')

  const [profCatalogs, setProfCatalogs] = useState<ProfCatalogs>({})
  const [hydrated, setHydrated] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  // Students from diriginte, keyed by class name
  const [dirStudentsMap, setDirStudentsMap] = useState<Record<string, {nr:string;nume:string}[]>>({})

  useEffect(() => {
    try {
      const pc = localStorage.getItem('prof_catalogs')
      if (pc) setProfCatalogs(JSON.parse(pc))
      const pm = localStorage.getItem('prof_materii')
      if (pm) setMateriiSelectate(JSON.parse(pm))
      const pcl = localStorage.getItem('prof_clase')
      if (pcl) {
        const parsed = JSON.parse(pcl)
        // New format: Record<materie, ClasaConf[]>; legacy: ClasaConf[]
        if (Array.isArray(parsed)) {
          // Legacy: migrate to first subject if possible
          const materii: string[] = pm ? JSON.parse(pm) : []
          if (materii.length > 0) setClasePerMaterie({ [materii[0]]: parsed })
        } else {
          setClasePerMaterie(parsed)
        }
      }
      const pca = localStorage.getItem('prof_clasa_activa')
      if (pca) setClasaPerMaterie(JSON.parse(pca))
      // Build map of all diriginte classes → student lists
      const dirClaseRaw = localStorage.getItem('dir_clase')
      const map: Record<string, {nr:string;nume:string}[]> = {}
      if (dirClaseRaw) {
        const dirClase: string[] = JSON.parse(dirClaseRaw)
        dirClase.forEach(cl => {
          try {
            const raw = localStorage.getItem(`dir_data_${cl}`)
            if (raw) {
              const d = JSON.parse(raw)
              if (Array.isArray(d.conturi) && d.conturi.length > 0)
                map[cl] = d.conturi.map((c: any) => ({ nr: c.nr, nume: c.nume }))
              else if (Array.isArray(d.elevi) && d.elevi.some((e: any) => e.nume?.trim()))
                map[cl] = d.elevi.filter((e: any) => e.nume?.trim()).map((e: any, i: number) => ({ nr: e.nr || String(i+1), nume: e.nume.trim() }))
            }
          } catch {}
        })
      }
      // Also check legacy single-class key
      const dc = localStorage.getItem('dir_clasa')
      const dco = localStorage.getItem('dir_conturi')
      if (dc && dco) {
        try {
          const conturi = JSON.parse(dco)
          if (Array.isArray(conturi) && conturi.length > 0 && !map[dc])
            map[dc] = conturi.map((c: any) => ({ nr: c.nr, nume: c.nume }))
        } catch {}
      }
      setDirStudentsMap(map)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) localStorage.setItem('prof_catalogs', JSON.stringify(profCatalogs)) }, [profCatalogs, hydrated])

  function saveClase(mat: string, cl: ClasaConf[]) {
    setClasePerMaterie(prev => {
      const updated = { ...prev, [mat]: cl }
      try { localStorage.setItem('prof_clase', JSON.stringify(updated)) } catch {}
      return updated
    })
  }
  function setClasa(nouaClasa: string) {
    setClasaPerMaterie(prev => {
      const updated = { ...prev, [materie]: nouaClasa }
      try { localStorage.setItem('prof_clasa_activa', JSON.stringify(updated)) } catch {}
      return updated
    })
  }
  function saveMaterii(m: string[]) {
    setMateriiProf(m)
    localStorage.setItem('prof_materii', JSON.stringify(m))
  }

  function toggleMaterie(m: string) {
    setMateriiSelectate(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  function adaugaAltaMaterie() {
    const m = altaMaterie.trim()
    if (!m || materiiSelectate.includes(m)) return
    setMateriiSelectate(prev => [...prev, m])
    setAltaMaterie('')
  }

  function getEntry(elevNr: string): ProfEntry {
    return profCatalogs[clasa]?.[materie]?.[elevNr] || { nota: '', absMot: 0, absNemot: 0, observatii: '' }
  }
  function updateEntry(elevNr: string, patch: Partial<ProfEntry>) {
    setProfCatalogs(prev => ({
      ...prev,
      [clasa]: {
        ...(prev[clasa] || {}),
        [materie]: {
          ...(prev[clasa]?.[materie] || {}),
          [elevNr]: { ...getEntry(elevNr), ...patch },
        },
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
      setLoginErr('Email sau parolă incorectă.'); return
    }
    saveMaterii(materiiSelectate)
    const primaMaterie = materiiSelectate[0]
    setMaterie(primaMaterie)
    setIdx(0)
    setView('catalog')
  }

  function adaugaClasa() {
    const litera = nouaLiteraCustom.trim() || nouaLitera
    const numeClasa = `${nouaGrada}${litera}`
    if (clase.find(c => c.nume === numeClasa)) { setClasa(numeClasa); setIdx(0); setAdaugaClasaOpen(false); return }
    const dirCount = dirStudentsMap[numeClasa]?.length || nrEleviNou
    const updated = [...clase, { nume: numeClasa, nrElevi: dirCount }]
    saveClase(materie, updated)
    setClasa(numeClasa)
    setIdx(0)
    setAdaugaClasaOpen(false)
    setNouaLiteraCustom('')
  }

  // Students for current class: from diriginte map if available, else numbered by clasaConf
  const clasaConf = clase.find(c => c.nume === clasa)
  const dirStudents = dirStudentsMap[clasa]
  const studentsFromDir = !!dirStudents && dirStudents.length > 0
  const students: { nr: string; nume: string }[] = studentsFromDir
    ? dirStudents
    : Array.from({ length: clasaConf?.nrElevi || 0 }, (_, i) => ({ nr: String(i + 1), nume: '' }))

  const elev = students[idx]
  const entry = elev ? getEntry(elev.nr) : null
  const totalAbs = entry ? entry.absMot + entry.absNemot : 0

  // ---- LOGIN ----
  if (view === 'login') return (
    <div style={pageWrap(isMobile)}>
      <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #c2410c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>🧑‍💻</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Profesor</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare Profesor</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>Accesați catalogul clasei și introduceți situația elevilor</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="Email școlar" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />

          <div>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Materiile predate</span>
              {materiiSelectate.length > 0 && <span style={{ color: '#f97316' }}>{materiiSelectate.length} selectate</span>}
            </div>
            {materiiSelectate.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                {materiiSelectate.map(m => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.5)', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, color: '#fb923c' }}>
                    {m}
                    <button type="button" onClick={() => toggleMaterie(m)} style={{ background: 'none', border: 'none', color: '#fb923c', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px' }}>
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input type="text" placeholder="Altă materie..." value={altaMaterie} onChange={e => setAltaMaterie(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adaugaAltaMaterie() } }}
                style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '12px' }} />
              <button type="button" onClick={adaugaAltaMaterie}
                style={{ background: altaMaterie.trim() ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${altaMaterie.trim() ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '0 14px', fontSize: '18px', cursor: 'pointer', color: altaMaterie.trim() ? '#fb923c' : '#334155', fontFamily: 'inherit' }}>+</button>
            </div>
          </div>

          {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
          <button type="submit" disabled={logging} style={btnOrange}>{logging ? 'Se verifică...' : 'Intră în cont →'}</button>
        </form>
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '10px', fontSize: '11px', color: '#fb923c', textAlign: 'center' }}>
          Acces restricționat · Contactați AIcraiova pentru credențiale
        </div>
      </div>
      <style>{`input::placeholder{color:#334155;}`}</style>
    </div>
  )

  // ---- CATALOG ----
  return (
    <div style={pageWrap(isMobile)}>
      <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '13px', background: 'linear-gradient(135deg, #c2410c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 8px', boxShadow: '0 6px 20px rgba(249,115,22,0.3)' }}>🧑‍💻</div>
        <div style={{ fontSize: '16px', fontWeight: 800 }}>Catalog Profesor</div>
        <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── Tabs materii ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'stretch' }}>
            {materiiProf.map(m => (
              <button key={m} onClick={() => { setMaterie(m); setIdx(0); setAdaugaClasaOpen(false) }}
                style={{ flex: '0 0 auto', background: 'none', border: 'none', borderBottom: `2px solid ${m === materie ? '#f97316' : 'transparent'}`, padding: '11px 15px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: m === materie ? 700 : 400, color: m === materie ? '#fb923c' : '#475569', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {m}
              </button>
            ))}
            <button onClick={() => setAdaugaMaterieOpen(v => !v)}
              style={{ flex: '0 0 auto', background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '11px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '18px', color: '#334155', title: 'Adaugă materie' }}>+</button>
          </div>

          {/* Panou adauga materie */}
          {adaugaMaterieOpen && (
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>Adaugă materie nouă:</div>
              <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                {MATERII_LISTA.filter(m => !materiiProf.includes(m)).map(m => (
                  <button key={m} type="button"
                    onClick={() => { const u = [...materiiProf, m]; saveMaterii(u); setMaterie(m); setIdx(0); setAdaugaMaterieOpen(false) }}
                    style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#fb923c', cursor: 'pointer', fontFamily: 'inherit' }}>{m}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Altă materie..." value={nouaMaterie} onChange={e => setNouaMaterie(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && nouaMaterie.trim()) { const u=[...materiiProf,nouaMaterie.trim()]; saveMaterii(u); setMaterie(nouaMaterie.trim()); setIdx(0); setAdaugaMaterieOpen(false); setNouaMaterie('') } }}
                  autoFocus style={{ ...inputStyle, flex: 1, padding: '7px 12px', fontSize: '12px' }} />
                <button onClick={() => { if (!nouaMaterie.trim()) return; const u=[...materiiProf,nouaMaterie.trim()]; saveMaterii(u); setMaterie(nouaMaterie.trim()); setIdx(0); setAdaugaMaterieOpen(false); setNouaMaterie('') }}
                  style={{ ...btnOrange, padding: '0 14px', fontSize: '13px', boxShadow: 'none' }}>✓</button>
              </div>
            </div>
          )}

          {/* ── Scroll clase (per materie) ── */}
          <div style={{ padding: '10px 14px', borderBottom: clase.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: '10px', color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Clasele la {materie}</div>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
              {clase.map(c => (
                <button key={c.nume} onClick={() => { setClasa(c.nume); setIdx(0) }}
                  style={{ flex: '0 0 auto', background: c.nume === clasa ? 'rgba(249,115,22,0.22)' : 'rgba(255,255,255,0.04)', border: `1px solid ${c.nume === clasa ? 'rgba(249,115,22,0.55)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '10px', padding: '7px 14px', fontSize: '13px', fontWeight: c.nume === clasa ? 800 : 400, color: c.nume === clasa ? '#fb923c' : '#475569', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {c.nume}
                  <span style={{ fontSize: '10px', color: c.nume === clasa ? '#f97316' : '#334155', marginLeft: '5px' }}>{c.nrElevi}el</span>
                </button>
              ))}
              <button onClick={() => setAdaugaClasaOpen(v => !v)}
                style={{ flex: '0 0 auto', background: adaugaClasaOpen ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${adaugaClasaOpen ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '10px', padding: '7px 14px', fontSize: '12px', color: adaugaClasaOpen ? '#fb923c' : '#475569', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                + Clasă
              </button>
            </div>
          </div>

          {/* Panou adauga clasa */}
          {adaugaClasaOpen && (() => {
            const previewNume = `${nouaGrada}${nouaLiteraCustom || nouaLitera}`
            const dirPentruClasa = dirStudentsMap[previewNume]
            return (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(249,115,22,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#fb923c', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Adaugă clasă nouă</div>

              {/* Scroll grade */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>Anul de studiu</div>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                  {GRADE.map(g => (
                    <button key={g} type="button" onClick={() => setNouaGrada(g)}
                      style={{ flex: '0 0 auto', background: g === nouaGrada ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${g === nouaGrada ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '7px 14px', fontSize: '14px', fontWeight: g === nouaGrada ? 800 : 400, color: g === nouaGrada ? '#fb923c' : '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Litera */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>Litera clasei</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {LITERE.map(l => (
                    <button key={l} type="button" onClick={() => { setNouaLitera(l); setNouaLiteraCustom('') }}
                      style={{ background: l === nouaLitera && !nouaLiteraCustom ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${l === nouaLitera && !nouaLiteraCustom ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '6px 14px', fontSize: '14px', fontWeight: l === nouaLitera && !nouaLiteraCustom ? 800 : 400, color: l === nouaLitera && !nouaLiteraCustom ? '#fb923c' : '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {l}
                    </button>
                  ))}
                  <input type="text" placeholder="Alta..." value={nouaLiteraCustom} onChange={e => setNouaLiteraCustom(e.target.value.toUpperCase().slice(0,3))}
                    style={{ ...inputStyle, width: '70px', padding: '6px 10px', fontSize: '14px', fontWeight: 700, textAlign: 'center', border: `1px solid ${nouaLiteraCustom ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.1)'}`, color: nouaLiteraCustom ? '#fb923c' : '#f1f5f9' }} />
                </div>
              </div>

              {/* Diriginte badge sau nr elevi manual */}
              {dirPentruClasa ? (
                <div style={{ marginBottom: '14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>Listă preluată din diriginte</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{dirPentruClasa.length} elevi cu nume — {dirPentruClasa.slice(0,3).map(s => s.nume).join(', ')}{dirPentruClasa.length > 3 ? '...' : ''}</div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>Număr de elevi</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button type="button" onClick={() => setNrEleviNou(v => Math.max(1, v - 1))}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color: '#94a3b8', fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', minWidth: '40px', textAlign: 'center' }}>{nrEleviNou}</span>
                    <button type="button" onClick={() => setNrEleviNou(v => Math.min(40, v + 1))}
                      style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color: '#fb923c', fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    <span style={{ fontSize: '12px', color: '#475569' }}>elevi</span>
                  </div>
                </div>
              )}

              {/* Preview + confirma */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#475569' }}>Clasă: </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#fb923c' }}>{previewNume}</span>
                  <span style={{ fontSize: '11px', color: '#475569', marginLeft: '8px' }}>
                    — {dirPentruClasa ? `${dirPentruClasa.length} elevi din diriginte` : `${nrEleviNou} elevi`}
                  </span>
                </div>
                <button onClick={adaugaClasa} style={{ ...btnOrange, padding: '10px 20px', fontSize: '13px', boxShadow: 'none', whiteSpace: 'nowrap' }}>
                  Adaugă ✓
                </button>
              </div>
            </div>
            )
          })()}

          {clasa && <div style={{ padding: '8px 16px', fontSize: '11px', color: '#475569' }}>
            Catalog: <span style={{ color: '#fb923c', fontWeight: 700 }}>{materie}</span> · Clasa <span style={{ color: '#fb923c', fontWeight: 700 }}>{clasa}</span>
            {studentsFromDir && <span style={{ color: '#4ade80', marginLeft: '8px' }}>· liste din diriginte</span>}
          </div>}
        </div>

        {/* ── Catalog elevi ── */}
        {!clasa ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏫</div>
            Adaugă o clasă din bara de mai sus pentru a începe catalogul.
          </div>
        ) : students.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            Niciun elev configurat pentru clasa {clasa}.
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
              {/* Navigare */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
                  style={navBtn(idx === 0, false)}>←</button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#f1f5f9' }}>
                    {elev.nr}. {elev.nume || `Elevul ${elev.nr}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>Elev {idx + 1} din {students.length} · {clasa}</div>
                </div>
                <button onClick={() => setIdx(Math.min(students.length - 1, idx + 1))} disabled={idx === students.length - 1}
                  style={navBtn(idx === students.length - 1, false)}>→</button>
              </div>

              {elev && entry && (
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Nota */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Notă · {materie}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="number" min="1" max="10" placeholder="—" value={entry.nota}
                        onChange={e => { const v = e.target.value; if (v === '' || (parseFloat(v) >= 1 && parseFloat(v) <= 10)) updateEntry(elev.nr, { nota: v }) }}
                        style={{ ...inputStyle, width: '90px', fontSize: '36px', fontWeight: 900, textAlign: 'center', padding: '12px', color: entry.nota ? (parseFloat(entry.nota) < 5 ? '#f87171' : parseFloat(entry.nota) < 7 ? '#fbbf24' : '#4ade80') : '#334155' }} />
                      <div style={{ flex: 1 }}>
                        {entry.nota && <div style={{ fontSize: '13px', fontWeight: 700, color: parseFloat(entry.nota) < 5 ? '#f87171' : parseFloat(entry.nota) < 7 ? '#fbbf24' : '#4ade80' }}>
                          {parseFloat(entry.nota) < 5 ? '⚠️ Sub medie' : parseFloat(entry.nota) < 7 ? '📈 Satisfăcător' : parseFloat(entry.nota) < 9 ? '✅ Bine' : '⭐ Excelent'}
                        </div>}
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
                    {totalAbs > 0 && <div style={{ marginTop: '10px', fontSize: '12px', color: '#475569', textAlign: 'center' }}>Total: {totalAbs} absențe</div>}
                  </div>

                  {/* Observatii */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Observații</div>
                    <textarea placeholder="Comportament, participare, observații speciale..." value={entry.observatii}
                      onChange={e => updateEntry(elev.nr, { observatii: e.target.value })} rows={3}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontSize: '13px' }} />
                  </div>
                </div>
              )}

              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', paddingBottom: '14px', flexWrap: 'wrap', padding: '0 16px 14px' }}>
                {students.map((_, i) => {
                  const e = getEntry(students[i].nr)
                  const areDate = e.nota || e.absMot > 0 || e.absNemot > 0 || e.observatii
                  return <button key={i} onClick={() => setIdx(i)}
                    style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: '4px', background: i === idx ? '#f97316' : areDate ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0, flexShrink: 0 }} />
                })}
              </div>
            </div>

            {/* Sumar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '14px 16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>Sumar · {materie} · {clasa}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(() => {
                  const cuNote = students.filter(s => getEntry(s.nr).nota)
                  const medie = cuNote.length ? cuNote.reduce((s, e) => s + parseFloat(getEntry(e.nr).nota), 0) / cuNote.length : null
                  const sub = cuNote.filter(s => parseFloat(getEntry(s.nr).nota) < 5).length
                  const abs = students.reduce((s, e) => s + getEntry(e.nr).absNemot, 0)
                  return (<>
                    <div style={statCard('#6366f1')}><div style={{ fontSize: '17px', fontWeight: 800 }}>{cuNote.length}/{students.length}</div><div style={{ fontSize: '10px' }}>note introduse</div></div>
                    {medie !== null && <div style={statCard('#4ade80')}><div style={{ fontSize: '17px', fontWeight: 800 }}>{medie.toFixed(2)}</div><div style={{ fontSize: '10px' }}>medie clasă</div></div>}
                    {sub > 0 && <div style={statCard('#f87171')}><div style={{ fontSize: '17px', fontWeight: 800 }}>{sub}</div><div style={{ fontSize: '10px' }}>sub medie</div></div>}
                    {abs > 0 && <div style={statCard('#fbbf24')}><div style={{ fontSize: '17px', fontWeight: 800 }}>{abs}</div><div style={{ fontSize: '10px' }}>abs. nemot.</div></div>}
                  </>)
                })()}
              </div>
            </div>
          </>
        )}

        <button onClick={() => { setView('login'); setEmail(''); setPassword('') }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
          Deconectare
        </button>
      </div>
      <style>{`input::placeholder{color:#334155;}textarea::placeholder{color:#334155;}`}</style>
    </div>
  )
}

function navBtn(disabled: boolean, _: boolean): React.CSSProperties {
  return { background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(249,115,22,0.15)', border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : 'rgba(249,115,22,0.4)'}`, borderRadius: '10px', width: 40, height: 40, cursor: disabled ? 'not-allowed' : 'pointer', color: disabled ? '#334155' : '#fb923c', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }
}
function statCard(color: string): React.CSSProperties {
  return { flex: 1, minWidth: '70px', background: `${color}14`, border: `1px solid ${color}33`, borderRadius: '10px', padding: '10px', textAlign: 'center', color }
}
function pageWrap(isMobile: boolean): React.CSSProperties {
  return { minHeight: '100vh', background: '#060b14', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '20px 16px 60px' : '40px 20px 60px' }
}
const backBtn: React.CSSProperties = { position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: "'Segoe UI', Arial, sans-serif" }
const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: "'Segoe UI', Arial, sans-serif", width: '100%', boxSizing: 'border-box' }
const btnOrange: React.CSSProperties = { background: 'linear-gradient(135deg, #c2410c, #f97316)', border: 'none', borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Segoe UI', Arial, sans-serif", boxShadow: '0 4px 16px rgba(249,115,22,0.35)', transition: 'opacity 0.2s' }
