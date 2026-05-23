'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type View = 'login' | 'register' | 'dashboard'

const ZILE = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri']
const TIP_SCOALA = ['Liceu', 'Colegiu Național', 'Colegiu Tehnic', 'Școală Gimnazială', 'Școală Primară']
const MODULE = ['BAC Matematică M1', 'BAC Matematică M2', 'BAC Română', 'Capacitate Matematică', 'Capacitate Română']

export default function DirigintePage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [view, setView] = useState<View>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)

  // Register state
  const [regNume, setRegNume] = useState('')
  const [regScoala, setRegScoala] = useState('')
  const [regJudet, setRegJudet] = useState('')
  const [regClasa, setRegClasa] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regZi, setRegZi] = useState('')
  const [regOra, setRegOra] = useState('')
  const [regTip, setRegTip] = useState('')
  const [regModul, setRegModul] = useState('')
  const [registering, setRegistering] = useState(false)
  const [regDone, setRegDone] = useState(false)

  // Dashboard (demo after login)
  const [codIntro, setCodIntro] = useState('')
  const [codActiv, setCodActiv] = useState(false)
  const [minuteRamase, setMinuteRamase] = useState(60)
  const [ziDirigentie, setZiDirigentie] = useState('Joi')
  const [oraDirigentie, setOraDirigentie] = useState('08:00')
  const [nrClasa, setNrClasa] = useState('')
  const [modulClasa, setModulClasa] = useState<string[]>(['BAC Matematică M1'])
  const [orarSalvat, setOrarSalvat] = useState(false)
  const [codCopiat, setCodCopiat] = useState(false)

  // Multi-clasa
  const GRADE_DIR = ['5','6','7','8','9','10','11','12']
  const LITERE_DIR = ['A','B','C','D','E','F']
  const [clase, setClase] = useState<string[]>([])
  const [adaugaClasaOpen, setAdaugaClasaOpen] = useState(false)
  const [nouaGrada, setNouaGrada] = useState('10')
  const [nouaLitera, setNouaLitera] = useState('A')
  const [nouaLiteraCustom, setNouaLiteraCustom] = useState('')

  // Elevi
  type Elev = { nr: string; nume: string }
  type RiscNivel = 'ridicat' | 'mediu' | 'ok'
  type ContElev = {
    nr: string; nume: string; user: string; parola: string
    minutePlatforma: number; ultimaConectare: string | null
    activitateModul?: Record<string, number>
    riscNivel: RiscNivel; riscCategorie: string[]
    coins: number; nivel: number; streak: number; badges: string[]
  }
  const [eleviInput, setEleviInput] = useState<Elev[]>([{ nr: '', nume: '' }])
  const [conturiGenerate, setConturiGenerate] = useState<ContElev[]>([])

  const [hydrated, setHydrated] = useState(false)

  // Catalog note + absente
  type CatalogEntry = { elevNr: string; note: Record<string, string>; absMot: number; absNemot: number; observatii?: string; purtare?: Record<string, string> }
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [hydrated2, setHydrated2] = useState(false)
  type ProfEntry = { nota: string; absMot: number; absNemot: number; observatii: string }
  type ProfCatalogs = Record<string, Record<string, ProfEntry>>
  const [profCatalogs, setProfCatalogs] = useState<ProfCatalogs>({})
  const [hydrated3, setHydrated3] = useState(false)
  const [catalogIdx, setCatalogIdx] = useState(0)
  const [importStatus, setImportStatus] = useState('')

  // Incarcare din localStorage — o singura data la montare
  useEffect(() => {
    try {
      const cl = localStorage.getItem('dir_clase')
      if (cl) setClase(JSON.parse(cl))
      const clActiva = localStorage.getItem('dir_clasa') || ''
      if (clActiva) {
        setNrClasa(clActiva)
        const data = localStorage.getItem(`dir_data_${clActiva}`)
        if (data) {
          const d = JSON.parse(data)
          if (d.zi) setZiDirigentie(d.zi)
          if (d.ora) setOraDirigentie(d.ora)
          if (d.modul) setModulClasa(d.modul)
          if (d.elevi) setEleviInput(d.elevi)
          if (d.conturi) setConturiGenerate(d.conturi)
        }
        const catData = localStorage.getItem(`dir_catalog_${clActiva}`)
        if (catData) setCatalog(JSON.parse(catData))
      }
      const pcData = localStorage.getItem('prof_catalogs')
      if (pcData) setProfCatalogs(JSON.parse(pcData))
    } catch {}
    setHydrated(true); setHydrated2(true); setHydrated3(true)
  }, [])

  // Salvare combinata per-clasa
  useEffect(() => {
    if (!hydrated || !nrClasa) return
    localStorage.setItem('dir_clasa', nrClasa)
    localStorage.setItem('dir_clase', JSON.stringify(clase))
    localStorage.setItem(`dir_data_${nrClasa}`, JSON.stringify({ zi: ziDirigentie, ora: oraDirigentie, modul: modulClasa, elevi: eleviInput, conturi: conturiGenerate }))
  }, [ziDirigentie, oraDirigentie, nrClasa, modulClasa, eleviInput, conturiGenerate, clase, hydrated])

  useEffect(() => {
    if (hydrated2 && nrClasa) localStorage.setItem(`dir_catalog_${nrClasa}`, JSON.stringify(catalog))
  }, [catalog, hydrated2, nrClasa])

  useEffect(() => { if (hydrated3) localStorage.setItem('prof_catalogs', JSON.stringify(profCatalogs)) }, [profCatalogs, hydrated3])

  function getCatalogEntry(nr: string): CatalogEntry {
    return catalog.find(e => e.elevNr === nr) || { elevNr: nr, note: {}, absMot: 0, absNemot: 0 }
  }
  function updateCatalog(nr: string, patch: Partial<CatalogEntry>) {
    setCatalog(prev => {
      const exists = prev.find(e => e.elevNr === nr)
      if (exists) return prev.map(e => e.elevNr === nr ? { ...e, ...patch } : e)
      return [...prev, { elevNr: nr, note: {}, absMot: 0, absNemot: 0, ...patch }]
    })
  }

  function loadClasaData(clasa: string) {
    try {
      const data = localStorage.getItem(`dir_data_${clasa}`)
      if (data) {
        const d = JSON.parse(data)
        setZiDirigentie(d.zi || 'Joi')
        setOraDirigentie(d.ora || '08:00')
        setModulClasa(d.modul || ['BAC Matematică M1'])
        setEleviInput(d.elevi || [{ nr: '', nume: '' }])
        setConturiGenerate(d.conturi || [])
      } else {
        setZiDirigentie('Joi')
        setOraDirigentie('08:00')
        setModulClasa(['BAC Matematică M1'])
        setEleviInput([{ nr: '', nume: '' }])
        setConturiGenerate([])
      }
      const catData = localStorage.getItem(`dir_catalog_${clasa}`)
      setCatalog(catData ? JSON.parse(catData) : [])
    } catch {}
    setCatalogIdx(0)
    setTabElevi('adauga')
  }

  function switchClasa(nouaClasa: string) {
    if (nrClasa) {
      try {
        localStorage.setItem(`dir_data_${nrClasa}`, JSON.stringify({ zi: ziDirigentie, ora: oraDirigentie, modul: modulClasa, elevi: eleviInput, conturi: conturiGenerate }))
        localStorage.setItem(`dir_catalog_${nrClasa}`, JSON.stringify(catalog))
      } catch {}
    }
    setNrClasa(nouaClasa)
    loadClasaData(nouaClasa)
  }

  function addClasa() {
    const litera = nouaLiteraCustom.trim().toUpperCase() || nouaLitera
    const numeClasa = `${nouaGrada}${litera}`
    const noua = clase.includes(numeClasa) ? clase : [...clase, numeClasa]
    setClase(noua)
    localStorage.setItem('dir_clase', JSON.stringify(noua))
    setAdaugaClasaOpen(false)
    setNouaLiteraCustom('')
    switchClasa(numeClasa)
  }

  const [sectiuneElevi, setSectiuneElevi] = useState(false)
  const [tabElevi, setTabElevi] = useState<'adauga' | 'conturi' | 'activitate' | 'catalog' | 'alerte' | 'clasament'>('adauga')

  function slugNume(nume: string) {
    return nume.toLowerCase()
      .replace(/ă/g,'a').replace(/â/g,'a').replace(/î/g,'i').replace(/ș/g,'s').replace(/ț/g,'t')
      .replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
  }
  function randPass() {
    const c = 'abcdefghjkmnpqrstuvwxyz23456789'
    return Array.from({length:7}, () => c[Math.floor(Math.random()*c.length)]).join('')
  }
  function printConturi() {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Conturi Elevi — ${demoDashboard.clasa}</title><style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111}
      h2{margin:0 0 4px}p{margin:0 0 20px;color:#555;font-size:13px}
      table{width:100%;border-collapse:collapse}
      th{background:#f1f5f9;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #e2e8f0}
      td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px}
      tr:nth-child(even) td{background:#fafafa}
      .mono{font-family:monospace;font-size:13px}
      .footer{margin-top:32px;font-size:11px;color:#94a3b8;text-align:center}
      @media print{body{padding:16px}}
    </style></head><body>
      <h2>Conturi Elevi — Clasa ${demoDashboard.clasa}</h2>
      <p>${demoDashboard.scoala} · ${demoDashboard.judet} · Diriginte: ${demoDashboard.nume}</p>
      <table>
        <thead><tr><th>Nr.</th><th>Nume</th><th>Utilizator</th><th>Parolă</th></tr></thead>
        <tbody>${conturiGenerate.map(c => `<tr><td>${c.nr}</td><td>${c.nume}</td><td class="mono">${c.user}</td><td class="mono">${c.parola}</td></tr>`).join('')}</tbody>
      </table>
      <div class="footer">Platformă EDU DIGITAL · aicraiova.ro · Păstrați aceste date în siguranță</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  function printActivitate() {
    const w = window.open('', '_blank')!
    const modColoane = modulClasa.map(m => `<th>${m}</th>`).join('')
    const rows = conturiGenerate.map(c => {
      const modCelule = modulClasa.map(m => {
        const min = c.activitateModul?.[m] ?? 0
        const cls = min > 10 ? 'verde' : min > 0 ? 'galben' : 'gri'
        return `<td class="${cls}">${min > 0 ? min + ' min' : '—'}</td>`
      }).join('')
      const total = modulClasa.reduce((s, m) => s + (c.activitateModul?.[m] ?? 0), 0)
      const obs = total === 0 ? 'Nu a accesat platforma' : total < 5 ? 'Activitate redusă' : total > 20 ? 'Foarte activ' : 'Activitate normală'
      return `<tr><td>${c.nr}</td><td>${c.nume}</td>${modCelule}<td>${c.ultimaConectare ?? '—'}</td><td class="obs">${obs}</td></tr>`
    }).join('')
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Raport Activitate — Clasa ${nrClasa}</title><style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111}
      h2{margin:0 0 4px}p{margin:0 0 20px;color:#555;font-size:13px}
      table{width:100%;border-collapse:collapse}
      th{background:#f1f5f9;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #e2e8f0}
      td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px}
      tr:nth-child(even) td{background:#fafafa}
      .verde{color:#16a34a;font-weight:700}.galben{color:#d97706;font-weight:700}.gri{color:#94a3b8}
      .obs{font-size:12px;color:#64748b;font-style:italic}
      .footer{margin-top:32px;font-size:11px;color:#94a3b8;text-align:center}
      @media print{body{padding:16px}}
    </style></head><body>
      <h2>Raport Activitate — Clasa ${nrClasa}</h2>
      <p>${demoDashboard.scoala} · ${demoDashboard.judet} · Diriginte: ${demoDashboard.nume} · Generat: ${new Date().toLocaleDateString('ro-RO')}</p>
      <table>
        <thead><tr><th>Nr.</th><th>Nume</th>${modColoane}<th>Ultima conectare</th><th>Observații</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Platformă EDU DIGITAL · aicraiova.ro · Document generat automat pentru uz intern</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  function genereazaConturi() {
    const DEMO_MIN = [0, 14, 0, 31, 8, 22, 5, 47, 3, 19, 12, 0, 7, 25, 0, 11]
    const DEMO_DATA = ['ieri 18:42','azi 09:15',null,'ieri 20:03','ieri 16:30',null,'azi 08:55','acum 3 zile',null,'ieri 22:10','azi 11:20',null,'ieri 21:05','acum 2 zile',null,'ieri 16:55']
    const DEMO_STREAK = [0,3,0,12,2,7,1,14,0,5,4,0,2,9,0,6]
    const ALL_BADGES = ['🌟 Primul pas','📐 Matematician','📖 Cititor','🔥 Dedicat','⚡ Rapid','🎯 Precis','🤖 AI Fan','💎 Top 3']
    const CATEGORII_RISC = [['Abandon'],['Performanță'],['Abandon','Emoțional'],['Performanță','Emoțional'],['Abandon']]

    const conturi = eleviInput.filter(e => e.nume.trim()).map((e, i) => {
      const activitateModul: Record<string, number> = {}
      modulClasa.forEach((m, mi) => {
        activitateModul[m] = DEMO_MIN[(i + mi * 3) % DEMO_MIN.length]
      })
      const totalMin = Object.values(activitateModul).reduce((s, v) => s + v, 0)
      const conectat = DEMO_DATA[i % DEMO_DATA.length]
      const streak = DEMO_STREAK[i % DEMO_STREAK.length]
      const coins = Math.round(totalMin * 3 + streak * 10)
      const nivel = coins === 0 ? 0 : coins < 30 ? 1 : coins < 80 ? 2 : coins < 150 ? 3 : coins < 250 ? 4 : 5
      const badges = totalMin === 0 ? [] : ALL_BADGES.filter((_, bi) => (i + bi) % 3 === 0).slice(0, nivel + 1)
      const riscNivel: 'ridicat' | 'mediu' | 'ok' = totalMin === 0 || !conectat ? 'ridicat' : totalMin < 8 ? 'mediu' : 'ok'
      const riscCategorie = riscNivel !== 'ok' ? CATEGORII_RISC[i % CATEGORII_RISC.length] : []
      return {
        nr: e.nr || String(i + 1), nume: e.nume.trim(),
        user: slugNume(e.nume.trim()), parola: randPass(),
        minutePlatforma: totalMin, ultimaConectare: conectat,
        activitateModul, riscNivel, riscCategorie,
        coins, nivel, streak, badges,
      }
    })
    setConturiGenerate(conturi)
    setTabElevi('conturi')
  }

  async function handleImportExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const XLSX = await import('xlsx')
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws)
      let imported = 0
      rows.forEach(row => {
        const numeRaw = row['Nume'] || row['nume'] || ''
        if (!numeRaw) return
        const elev = conturiGenerate.find(c => c.nume.toLowerCase().trim() === numeRaw.toLowerCase().trim())
        if (!elev) return
        const note: Record<string, string> = {}
        modulClasa.forEach(m => { if (row[m]) note[m] = row[m] })
        updateCatalog(elev.nr, {
          note,
          absMot: parseInt(row['Abs.Motivate'] || row['Absente Motivate'] || row['abs_mot'] || '0') || 0,
          absNemot: parseInt(row['Abs.Nemotivate'] || row['Absente Nemotivate'] || row['abs_nemot'] || '0') || 0,
          observatii: row['Observatii'] || row['Observații'] || row['observatii'] || '',
        })
        imported++
      })
      setImportStatus(`✅ ${imported} elevi importați`)
    } catch {
      setImportStatus('❌ Eroare import')
    }
    setTimeout(() => setImportStatus(''), 3000)
    e.target.value = ''
  }

  const demoDashboard = {
    nume: 'Prof. Maria Ionescu',
    scoala: 'Colegiul Național "Elena Cuza"',
    judet: 'Dolj',
    clasa: '10B',
    zi: 'Joi',
    ora: '08:00',
    modul: 'BAC Matematică M1',
    cod: 'DRGX-7291',
    status: 'PENDING' as 'PENDING' | 'ACTIVE' | 'EXPIRED',
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setLoginErr('Completați email și parolă.'); return }
    setLogging(true)
    setLoginErr('')
    await new Promise(r => setTimeout(r, 900))
    setLogging(false)
    if (email.trim().toLowerCase() !== 'contact@aicraiova.ro' || password !== 'ARACIP') {
      setLoginErr('Email sau parolă incorectă.')
      return
    }
    setView('dashboard')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regNume || !regScoala || !regEmail || !regPass || !regZi || !regOra || !regModul) {
      return
    }
    setRegistering(true)
    await new Promise(r => setTimeout(r, 1200))
    setRegistering(false)
    setRegDone(true)
  }

  function activareCod() {
    if (codIntro.trim().toUpperCase() === demoDashboard.cod) {
      setCodActiv(true)
    }
  }

  const STATUS_COLOR: Record<string, string> = {
    PENDING: '#f59e0b',
    ACTIVE: '#22c55e',
    EXPIRED: '#ef4444',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '20px 16px' : '40px 20px',
    }}>

      {/* Back */}
      <button
        onClick={() => router.push('/demo')}
        style={{
          position: 'fixed', top: 20, left: 20,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '8px 16px',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      >
        ← Înapoi
      </button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '16px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
        }}>👨‍🏫</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9' }}>Portal Diriginte</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>Unități Școlare · EDU DIGITAL · AIcraiova</div>
      </div>

      {/* ---- LOGIN ---- */}
      {view === 'login' && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '36px 40px',
          width: '100%',
          maxWidth: '400px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Autentificare</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="email"
              placeholder="Email școlar"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
            <button type="submit" disabled={logging} style={btnGreen}>
              {logging ? 'Se autentifică...' : 'Intră în cont →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '13px', color: '#475569' }}>Nu ai cont? </span>
            <button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}>
              Înregistrează-te
            </button>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', fontSize: '11px', color: '#4ade80', textAlign: 'center' }}>
            Acces restricționat · Contactați AIcraiova pentru credențiale
          </div>
        </div>
      )}

      {/* ---- REGISTER ---- */}
      {view === 'register' && !regDone && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '36px 40px',
          width: '100%',
          maxWidth: '480px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>Înregistrare Diriginte</h2>
          <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
            Contul tău trebuie aprobat de ISJ înainte de activare.
          </p>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Nume complet" value={regNume} onChange={e => setRegNume(e.target.value)} style={inputStyle} required />
            <select value={regTip} onChange={e => setRegTip(e.target.value)} style={selectStyle} required>
              <option value="">Tipul unității școlare</option>
              {TIP_SCOALA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input placeholder="Denumirea școlii" value={regScoala} onChange={e => setRegScoala(e.target.value)} style={inputStyle} required />
            <input placeholder="Județul" value={regJudet} onChange={e => setRegJudet(e.target.value)} style={inputStyle} required />
            <input placeholder="Clasa dirigată (ex: 10B)" value={regClasa} onChange={e => setRegClasa(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email școlar" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Parolă" value={regPass} onChange={e => setRegPass(e.target.value)} style={inputStyle} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={regZi} onChange={e => setRegZi(e.target.value)} style={selectStyle} required>
                <option value="">Ziua dirigenției</option>
                {ZILE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <input
                type="time"
                value={regOra}
                onChange={e => setRegOra(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <select value={regModul} onChange={e => setRegModul(e.target.value)} style={selectStyle} required>
              <option value="">Modulul dorit</option>
              {MODULE.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <button type="submit" disabled={registering} style={btnGreen}>
              {registering ? 'Se trimite cererea...' : 'Trimite cerere de înregistrare →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
              ← Înapoi la login
            </button>
          </div>
        </div>
      )}

      {regDone && view === 'register' && (
        <div style={{
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Cerere trimisă!</div>
          <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
            ISJ-ul tău va aproba contul în maxim 24h. Vei primi un email de confirmare.
          </div>
          <button onClick={() => { setView('login'); setRegDone(false) }} style={btnGreen}>
            Înapoi la login
          </button>
        </div>
      )}

      {/* ---- DASHBOARD ---- */}
      {view === 'dashboard' && (
        <div style={{
          width: '100%',
          maxWidth: '540px',
        }}>
          {/* Welcome */}
          <div style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👨‍🏫</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{demoDashboard.nume}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{demoDashboard.scoala} · {demoDashboard.judet}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
              {[
                { label: 'Clasa', val: nrClasa },
                { label: 'Ora de dirigenție', val: `${ziDirigentie} · ${oraDirigentie}` },
                { label: 'Module', val: modulClasa.length ? modulClasa.join(', ') : '—' },
              ].map(r => (
                <div key={r.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ color: '#475569', marginBottom: '2px' }}>{r.label}</div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Codul zilei */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '16px',
          }}>
            {/* Selector clase */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Clase dirigate</span>
                {nrClasa && <span style={{ color: '#22c55e', fontWeight: 700 }}>Activă: {nrClasa}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {clase.map(cl => (
                  <button key={cl} onClick={() => switchClasa(cl)} style={{
                    background: nrClasa === cl ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${nrClasa === cl ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: '14px', fontWeight: 800, color: nrClasa === cl ? '#4ade80' : '#94a3b8',
                    transition: 'all 0.15s',
                  }}>{cl}</button>
                ))}
                <button onClick={() => setAdaugaClasaOpen(v => !v)} style={{
                  background: adaugaClasaOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px dashed ${adaugaClasaOpen ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '13px', fontWeight: 700, color: adaugaClasaOpen ? '#a5b4fc' : '#475569',
                }}>+ Clasă</button>
              </div>

              {/* Panel adauga clasa */}
              {adaugaClasaOpen && (
                <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '8px' }}>Clasa nouă:</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px' }}>An</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {GRADE_DIR.map(g => (
                          <button key={g} onClick={() => setNouaGrada(g)} style={{
                            background: nouaGrada === g ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${nouaGrada === g ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit',
                            fontSize: '13px', fontWeight: nouaGrada === g ? 700 : 400,
                            color: nouaGrada === g ? '#a5b4fc' : '#475569',
                          }}>{g}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px' }}>Literă</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {LITERE_DIR.map(l => (
                          <button key={l} onClick={() => { setNouaLitera(l); setNouaLiteraCustom('') }} style={{
                            background: nouaLitera === l && !nouaLiteraCustom ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${nouaLitera === l && !nouaLiteraCustom ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit',
                            fontSize: '13px', fontWeight: nouaLitera === l && !nouaLiteraCustom ? 700 : 400,
                            color: nouaLitera === l && !nouaLiteraCustom ? '#4ade80' : '#475569',
                          }}>{l}</button>
                        ))}
                      </div>
                      <input placeholder="Altă literă..." value={nouaLiteraCustom}
                        onChange={e => setNouaLiteraCustom(e.target.value.toUpperCase().slice(0, 3))}
                        style={{ ...inputStyle, width: '120px', padding: '6px 10px', fontSize: '13px' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#a5b4fc', fontFamily: 'monospace' }}>
                      Previzualizare: <span style={{ color: '#f1f5f9' }}>{nouaGrada}{nouaLiteraCustom.trim().toUpperCase() || nouaLitera}</span>
                    </div>
                    <button onClick={addClasa} style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)', border: 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Confirmă →
                    </button>
                    <button onClick={() => { setAdaugaClasaOpen(false); setNouaLiteraCustom('') }} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                      Anulează
                    </button>
                  </div>
                </div>
              )}

              {!nrClasa && clase.length === 0 && (
                <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Adaugă prima clasă dirigată folosind butonul „+ Clasă"</div>
              )}
            </div>

            {/* Module */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '5px', fontWeight: 600 }}>Module active</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {MODULE.map(m => {
                    const activ = modulClasa.includes(m)
                    return (
                      <button
                        key={m}
                        onClick={() => setModulClasa(prev => activ ? prev.filter(x => x !== m) : [...prev, m])}
                        style={{
                          background: activ ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${activ ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '8px',
                          padding: '5px 10px',
                          fontSize: '12px',
                          fontWeight: activ ? 700 : 400,
                          color: activ ? '#a5b4fc' : '#475569',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {activ ? '✓ ' : ''}{m}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Codul sesiunii · {ziDirigentie}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {ZILE.map(z => (
                  <button
                    key={z}
                    onClick={() => { setZiDirigentie(z); setCodActiv(false); setCodIntro('') }}
                    style={{
                      background: ziDirigentie === z ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${ziDirigentie === z ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: ziDirigentie === z ? 700 : 400,
                      color: ziDirigentie === z ? '#4ade80' : '#475569',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
            {/* Orar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>Ora dirigenției:</div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', flex: 1 }}>
                {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'].map(h => (
                  <button
                    key={h}
                    onClick={() => setOraDirigentie(h)}
                    style={{
                      background: oraDirigentie === h ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${oraDirigentie === h ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: oraDirigentie === h ? 700 : 400,
                      color: oraDirigentie === h ? '#a5b4fc' : '#475569',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setOrarSalvat(true)
                  setTimeout(() => setOrarSalvat(false), 2500)
                }}
                style={{
                  background: orarSalvat ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #4338ca, #6366f1)',
                  border: `1px solid ${orarSalvat ? 'rgba(34,197,94,0.4)' : 'transparent'}`,
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: orarSalvat ? '#4ade80' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {orarSalvat ? '✓ Salvat' : 'Salvează'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 900,
                letterSpacing: '4px',
                color: codActiv ? '#22c55e' : '#f59e0b',
                fontFamily: 'monospace',
              }}>
                {demoDashboard.cod}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(demoDashboard.cod)
                  setCodIntro(demoDashboard.cod)
                  setCodCopiat(true)
                  setTimeout(() => setCodCopiat(false), 2000)
                }}
                title="Copiază codul"
                style={{
                  background: codCopiat ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${codCopiat ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: codCopiat ? '#4ade80' : '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {codCopiat ? '✓ Copiat' : '⎘ Copiază'}
              </button>
              <div style={{
                background: codActiv ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${codActiv ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)'}`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: codActiv ? '#22c55e' : '#f59e0b',
              }}>
                {codActiv ? '🟢 ACTIV' : '🟡 PENDING'}
              </div>
            </div>

            {codActiv ? (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>⏱ Sesiune activă — {minuteRamase} minute rămase</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>20 întrebări disponibile pentru clasa ta</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                  Introdu codul pe calculatorul clasei pentru a porni sesiunea (60 min, 20 întrebări):
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    placeholder="Introdu codul pe proiector..."
                    value={codIntro}
                    onChange={e => setCodIntro(e.target.value)}
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', letterSpacing: '2px' }}
                  />
                  <button onClick={activareCod} style={{ ...btnGreen, padding: '0 20px', whiteSpace: 'nowrap' }}>
                    Activează
                  </button>
                </div>
                {codIntro && codIntro.trim().toUpperCase() !== demoDashboard.cod && (
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>Cod incorect. Verificați și reîncercați.</div>
                )}
              </div>
            )}
          </div>

          {/* Card EDU Digital — apare doar dupa activarea codului */}
          {codActiv && <button
            onClick={() => router.push('/edu')}
            style={{
              width: '100%',
              background: 'rgba(20,184,166,0.06)',
              border: '1.5px solid rgba(20,184,166,0.25)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '16px',
              fontFamily: "'Segoe UI', Arial, sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(20,184,166,0.12)'
              e.currentTarget.style.borderColor = '#14b8a6'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(20,184,166,0.06)'
              e.currentTarget.style.borderColor = 'rgba(20,184,166,0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', boxShadow: '0 4px 14px rgba(20,184,166,0.3)',
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'inline-block', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: 800, color: '#14b8a6', letterSpacing: '1px', marginBottom: '6px' }}>
                  EDU DIGITAL
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Educație Digitală</div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  Accesează cursurile AI, pregătirea BAC și Capacitate pentru clasa ta.
                </div>
              </div>
              <div style={{ color: '#14b8a6', fontSize: '20px', flexShrink: 0 }}>→</div>
            </div>
          </button>}

          {/* Info */}
          <div style={{ fontSize: '12px', color: '#1e293b', textAlign: 'center', lineHeight: 1.6 }}>
            Codul apare automat la 8:00 în ziua orei tale de dirigenție.<br />
            Expiră la 60 min după activare sau la miezul nopții.
          </div>

          {/* Sectiunea Elevi */}
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
            <button
              onClick={() => setSectiuneElevi(v => !v)}
              style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>👥</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Elevi & Activitate</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>Gestionează conturi și monitorizează timpul pe platformă</div>
                </div>
              </div>
              <span style={{ color: '#475569', fontSize: '18px', transform: sectiuneElevi ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>

            {sectiuneElevi && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
                  {([
                    ['adauga','✏️ Adaugă'],
                    ['conturi','🔑 Conturi'],
                    ['activitate','📊 Activitate'],
                    ['catalog','📋 Catalog'],
                    ['alerte','⚠️ Alerte'],
                    ['clasament','🏆 Clasament'],
                  ] as [typeof tabElevi, string][]).map(([t, label]) => {
                    const alertCount = t === 'alerte' ? conturiGenerate.filter(c => c.riscNivel === 'ridicat').length : 0
                    return (
                      <button key={t} onClick={() => setTabElevi(t)} style={{
                        flex: '0 0 auto', background: 'none', border: 'none', borderBottom: `2px solid ${tabElevi === t ? '#6366f1' : 'transparent'}`,
                        padding: '12px 10px', cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: '12px', fontWeight: tabElevi === t ? 700 : 400,
                        color: tabElevi === t ? '#a5b4fc' : '#475569',
                        position: 'relative' as const,
                      }}>
                        {label}
                        {alertCount > 0 && <span style={{ marginLeft: '4px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{alertCount}</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Tab: Adauga */}
                {tabElevi === 'adauga' && (
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                      Scrie numărul și numele fiecărui elev din catalog:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '12px' }}>
                      {eleviInput.map((elev, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            placeholder="Nr."
                            value={elev.nr}
                            onChange={e => setEleviInput(prev => prev.map((el, idx) => idx === i ? { ...el, nr: e.target.value } : el))}
                            style={{ ...inputStyle, width: '52px', flexShrink: 0, textAlign: 'center', padding: '10px 8px' }}
                          />
                          <input
                            placeholder={`Elev ${i + 1} — Nume Prenume`}
                            value={elev.nume}
                            onChange={e => setEleviInput(prev => prev.map((el, idx) => idx === i ? { ...el, nume: e.target.value } : el))}
                            style={{ ...inputStyle, flex: 1, padding: '10px 12px' }}
                          />
                          {eleviInput.length > 1 && (
                            <button onClick={() => setEleviInput(prev => prev.filter((_, idx) => idx !== i))}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setEleviInput(prev => [...prev, { nr: String(prev.length + 1), nume: '' }])}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px', color: '#475569', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}
                      >+ Adaugă elev</button>
                      <button
                        onClick={genereazaConturi}
                        disabled={!eleviInput.some(e => e.nume.trim())}
                        style={{ flex: 2, background: 'linear-gradient(135deg, #4338ca, #6366f1)', border: 'none', borderRadius: '10px', padding: '10px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}
                      >Generează conturi →</button>
                    </div>
                  </div>
                )}

                {/* Tab: Conturi */}
                {tabElevi === 'conturi' && (
                  <div style={{ padding: '16px' }}>
                    {conturiGenerate.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>
                        Adaugă elevii și apasă „Generează conturi"
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#475569' }}>{conturiGenerate.length} conturi generate</div>
                          <button onClick={printConturi} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit' }}>🖨️ Printează</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                          {conturiGenerate.map((c, i) => (
                            <div key={i} style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#a5b4fc', flexShrink: 0 }}>{c.nr}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nume}</div>
                                <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>{c.user} · {c.parola}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab: Activitate */}
                {tabElevi === 'activitate' && (
                  <div style={{ padding: '16px' }}>
                    {conturiGenerate.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>
                        Generează conturi pentru a vedea activitatea
                      </div>
                    ) : (
                      <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                        <button
                          onClick={() => {
                            if (!confirm('Resetezi activitatea tuturor elevilor? Conturile rămân, doar timpii se șterg.')) return
                            setConturiGenerate(prev => prev.map(c => ({ ...c, minutePlatforma: 0, ultimaConectare: null, activitateModul: Object.fromEntries(Object.keys(c.activitateModul ?? {}).map(k => [k, 0])) })))
                          }}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit' }}
                        >↺ Resetează activitate</button>
                        <button onClick={printActivitate} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#4ade80', cursor: 'pointer', fontFamily: 'inherit' }}>🖨️ Printează raport</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                        {conturiGenerate.map((c, i) => (
                          <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: modulClasa.length > 0 ? '10px' : '0' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '8px', background: c.ultimaConectare ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: c.ultimaConectare ? '#4ade80' : '#334155', flexShrink: 0 }}>{c.nr}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{c.nume}</div>
                                <div style={{ fontSize: '11px', color: '#475569' }}>{c.ultimaConectare ? `Ultima conectare: ${c.ultimaConectare}` : 'Niciodată conectat'}</div>
                              </div>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: c.minutePlatforma > 10 ? '#4ade80' : c.minutePlatforma > 0 ? '#f59e0b' : '#334155', flexShrink: 0 }}>{c.minutePlatforma} min total</div>
                            </div>
                            {modulClasa.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {modulClasa.map(m => {
                                  const min = c.activitateModul?.[m] ?? 0
                                  return (
                                    <div key={m} style={{ background: min > 0 ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${min > 0 ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '8px', padding: '4px 10px', fontSize: '11px' }}>
                                      <span style={{ color: '#475569' }}>{m.replace('BAC ','').replace('Capacitate ','Cap. ')}: </span>
                                      <span style={{ fontWeight: 700, color: min > 10 ? '#4ade80' : min > 0 ? '#f59e0b' : '#334155' }}>{min > 0 ? `${min} min` : '—'}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab: Catalog */}
                {tabElevi === 'catalog' && (() => {
                  const elevi = conturiGenerate
                  const [idx, setIdx] = [catalogIdx, setCatalogIdx]
                  const c = elevi[idx]
                  const entry = c ? getCatalogEntry(c.nr) : null

                  // Teacher subjects for this class — exclude platform prep modules
                  const profPentruClasa = profCatalogs[nrClasa] || {}
                  const materiiProf = Object.keys(profPentruClasa).filter(m => !MODULE.includes(m))

                  // Overall average across all teacher subjects with nota
                  const medieGenerala = (() => {
                    if (!c || !entry) return null
                    const vals: number[] = []
                    materiiProf.forEach(m => { const pe = profPentruClasa[m]?.[c.nr]; if (pe?.nota) vals.push(parseFloat(pe.nota)) })
                    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null
                  })()

                  return (
                    <div style={{ padding: '16px' }}>
                      {/* Import Excel */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', marginBottom: '14px' }}>
                        <span style={{ fontSize: '16px' }}>📂</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc' }}>Importă Excel / CSV</div>
                          <div style={{ fontSize: '10px', color: '#475569' }}>Coloane: Nume, {materiiProf.join(', ')}{materiiProf.length ? ', ' : ''}Abs.Motivate, Abs.Nemotivate</div>
                        </div>
                        {importStatus && <span style={{ fontSize: '11px', color: importStatus.includes('✅') ? '#4ade80' : '#f87171', fontWeight: 700 }}>{importStatus}</span>}
                        <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleImportExcel} />
                      </label>

                      {elevi.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>Adaugă elevi mai întâi din tab-ul ✏️</div>
                      ) : (
                        <>
                          {/* Navigare */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
                              style={{ background: idx === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.15)', border: `1px solid ${idx === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.4)'}`, borderRadius: '10px', width: 40, height: 40, cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#334155' : '#a5b4fc', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9' }}>{c?.nr}. {c?.nume}</div>
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                Elev {idx + 1} din {elevi.length}
                                {medieGenerala !== null && <span style={{ marginLeft: '8px', fontWeight: 700, color: medieGenerala >= 5 ? '#4ade80' : '#f87171' }}>· Medie: {medieGenerala.toFixed(2)}</span>}
                              </div>
                            </div>
                            <button onClick={() => setIdx(Math.min(elevi.length - 1, idx + 1))} disabled={idx === elevi.length - 1}
                              style={{ background: idx === elevi.length - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.15)', border: `1px solid ${idx === elevi.length - 1 ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.4)'}`, borderRadius: '10px', width: 40, height: 40, cursor: idx === elevi.length - 1 ? 'not-allowed' : 'pointer', color: idx === elevi.length - 1 ? '#334155' : '#a5b4fc', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</button>
                          </div>

                          {entry && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                              {/* Materiile selectate de profesori */}
                              {materiiProf.length === 0 ? (
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: '#334155', fontSize: '12px' }}>
                                  Niciun profesor nu a introdus note pentru clasa {nrClasa} încă.
                                </div>
                              ) : (
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Note materii · {materiiProf.length} materii</div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {materiiProf.map(m => {
                                      const pe = profPentruClasa[m]?.[c.nr]
                                      const nota = pe?.nota ? parseFloat(pe.nota) : null
                                      return (
                                        <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: nota !== null ? (nota < 5 ? 'rgba(239,68,68,0.05)' : nota < 7 ? 'rgba(245,158,11,0.05)' : 'rgba(34,197,94,0.05)') : 'rgba(255,255,255,0.02)', border: `1px solid ${nota !== null ? (nota < 5 ? 'rgba(239,68,68,0.2)' : nota < 7 ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)') : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', padding: '10px 12px' }}>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{m}</div>
                                            <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                              {pe?.absMot ? <span style={{ color: '#4ade80' }}>{pe.absMot} abs.mot.</span> : null}
                                              {pe?.absNemot ? <span style={{ color: '#f87171' }}>{pe.absNemot} abs.nemot.</span> : null}
                                              {!pe?.absMot && !pe?.absNemot && !pe?.nota && <span>Fără date încă</span>}
                                            </div>
                                            {pe?.observatii && <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>{pe.observatii}</div>}
                                          </div>
                                          <div style={{ fontSize: '28px', fontWeight: 900, color: nota === null ? '#334155' : nota < 5 ? '#f87171' : nota < 7 ? '#fbbf24' : '#4ade80', flexShrink: 0, minWidth: '40px', textAlign: 'center' }}>
                                            {pe?.nota || '—'}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Absente */}
                              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Absențe</div>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                  {[['absMot','Motivate','#4ade80','rgba(34,197,94,0.15)','rgba(34,197,94,0.3)'],['absNemot','Nemotivate','#f87171','rgba(239,68,68,0.15)','rgba(239,68,68,0.3)']] .map(([field, label, color, bg, border]) => (
                                    <div key={field} style={{ flex: 1, minWidth: '100px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '11px', marginBottom: '8px', color: color as string }}>{label}</div>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <button onClick={() => updateCatalog(c.nr, { [field]: Math.max(0, (entry[field as keyof typeof entry] as number) - 1) })}
                                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color: '#94a3b8', fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '28px', fontWeight: 800, color: color as string, minWidth: '40px', textAlign: 'center' }}>{entry[field as keyof typeof entry] as number}</span>
                                        <button onClick={() => updateCatalog(c.nr, { [field]: (entry[field as keyof typeof entry] as number) + 1 })}
                                          style={{ background: bg as string, border: `1px solid ${border}`, borderRadius: '8px', width: 32, height: 32, cursor: 'pointer', color: color as string, fontSize: '18px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Purtare per modul — ROFUIP 2024 */}
                              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notă Purtare · per Modul</div>
                                  <div style={{ fontSize: '9px', color: '#334155' }}>minim 6 pentru promovare</div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {['M1','M2','M3','M4','M5'].map((ml, mi) => {
                                    const purtareVal = entry.purtare?.[ml] || ''
                                    const pv = parseFloat(purtareVal)
                                    const pColor = !purtareVal ? '#475569' : pv < 6 ? '#f87171' : pv < 8 ? '#fbbf24' : '#4ade80'
                                    return (
                                      <div key={ml} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>{ml}</div>
                                        <input
                                          type="text" inputMode="numeric" placeholder="—"
                                          value={purtareVal}
                                          onChange={ev => {
                                            const v = ev.target.value
                                            if (v === '' || /^([1-9]|10)$/.test(v)) {
                                              updateCatalog(c.nr, { purtare: { ...(entry.purtare || {}), [ml]: v } })
                                            }
                                          }}
                                          style={{ width: '44px', textAlign: 'center', background: purtareVal ? `${pColor}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${purtareVal ? pColor + '55' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '6px 4px', fontSize: '16px', fontWeight: 800, color: pColor, outline: 'none', fontFamily: 'inherit' }}
                                        />
                                      </div>
                                    )
                                  })}
                                </div>
                                {(() => {
                                  const notePurtare = ['M1','M2','M3','M4','M5'].map(ml => parseFloat(entry.purtare?.[ml] || '')).filter(v => !isNaN(v))
                                  if (!notePurtare.length) return null
                                  const mediePurtare = notePurtare.reduce((a,b)=>a+b,0)/notePurtare.length
                                  const color = mediePurtare < 6 ? '#f87171' : mediePurtare < 8 ? '#fbbf24' : '#4ade80'
                                  return (
                                    <div style={{ marginTop: '10px', fontSize: '12px', color, fontWeight: 700 }}>
                                      Media purtare: {mediePurtare.toFixed(2)} {mediePurtare < 6 ? '⚠ Sub minimul legal (6)' : ''}
                                    </div>
                                  )
                                })()}
                              </div>

                              {/* Observatii */}
                              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Observații diriginte</div>
                                <textarea
                                  placeholder="Notează orice observație relevantă despre acest elev..."
                                  value={entry.observatii || ''}
                                  onChange={e => updateCatalog(c.nr, { observatii: e.target.value } as any)}
                                  rows={3}
                                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontSize: '13px' }}
                                />
                              </div>

                              {/* Puncte de navigare */}
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingTop: '4px' }}>
                                {elevi.map((_, i) => (
                                  <button key={i} onClick={() => setIdx(i)}
                                    style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: '4px', background: i === idx ? '#6366f1' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })()}

                {/* Tab: Alerte */}
                {tabElevi === 'alerte' && (
                  <div style={{ padding: '16px' }}>
                    {/* Status funcționalitate */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>✅ Timp platformă — funcțional</div>
                      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>✅ Absențe din catalog — funcțional</div>
                      <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>⚠️ Note — parțial (doar diriginte, nu profesori)</div>
                      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#f87171', fontWeight: 700 }}>🔴 Alertă automată consilier — nefuncțional</div>
                    </div>
                    {conturiGenerate.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>Generează conturi pentru a vedea alertele</div>
                    ) : (() => {
                      const eleviiCuRisc = conturiGenerate.map(c => {
                        const entry = getCatalogEntry(c.nr)
                        const medieNote = modulClasa.length > 0
                          ? modulClasa.filter(m => entry.note[m]).reduce((s, m, _, arr) => s + parseFloat(entry.note[m] || '0') / arr.length, 0)
                          : null
                        const catRisc: string[] = []
                        if (c.minutePlatforma === 0 || !c.ultimaConectare) catRisc.push('Abandon')
                        if (medieNote !== null && medieNote > 0 && medieNote < 5) catRisc.push('Performanță')
                        if (entry.absNemot >= 5) catRisc.push('Abandon')
                        if (entry.absNemot >= 3 && c.minutePlatforma === 0) catRisc.push('Emoțional')
                        const riscNivel: 'ridicat' | 'mediu' | 'ok' = catRisc.length >= 2 || entry.absNemot >= 5 ? 'ridicat' : catRisc.length === 1 || c.minutePlatforma < 8 ? 'mediu' : 'ok'
                        return { ...c, riscNivel, riscCategorie: [...new Set(catRisc)], medieNote, absMot: entry.absMot, absNemot: entry.absNemot }
                      })
                      const ridicat = eleviiCuRisc.filter(c => c.riscNivel === 'ridicat')
                      const mediu = eleviiCuRisc.filter(c => c.riscNivel === 'mediu')
                      return (
                        <>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '80px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                              <div style={{ fontSize: '22px', fontWeight: 800, color: '#f87171' }}>{ridicat.length}</div>
                              <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>RISC RIDICAT</div>
                            </div>
                            <div style={{ flex: 1, minWidth: '80px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fbbf24' }}>{mediu.length}</div>
                              <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 600 }}>RISC MEDIU</div>
                            </div>
                            <div style={{ flex: 1, minWidth: '80px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                              <div style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80' }}>{conturiGenerate.length - ridicat.length - mediu.length}</div>
                              <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>OK</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                            {[...ridicat, ...mediu].map((c, i) => (
                              <div key={i} style={{ background: c.riscNivel === 'ridicat' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${c.riscNivel === 'ridicat' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: '12px', padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                  <div style={{ fontSize: '18px' }}>{c.riscNivel === 'ridicat' ? '🔴' : '🟡'}</div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{c.nr}. {c.nume}</div>
                                    <div style={{ fontSize: '11px', color: c.riscNivel === 'ridicat' ? '#f87171' : '#fbbf24', fontWeight: 600 }}>{c.riscNivel === 'ridicat' ? 'RISC RIDICAT' : 'RISC MEDIU'}</div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {c.riscCategorie.map((cat: string) => (
                                    <div key={cat} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#94a3b8' }}>
                                      {cat === 'Abandon' ? '🚪 Abandon' : cat === 'Performanță' ? '📉 Performanță' : '💙 Emoțional'}
                                    </div>
                                  ))}
                                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#94a3b8' }}>⏱ {c.minutePlatforma} min</div>
                                  {(c as any).absNemot > 0 && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#f87171' }}>🚫 {(c as any).absNemot} abs. nemot.</div>}
                                  {(c as any).medieNote !== null && (c as any).medieNote > 0 && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#f87171' }}>📉 Medie {(c as any).medieNote.toFixed(1)}</div>}
                                  {!c.ultimaConectare && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#f87171' }}>Niciodată conectat</div>}
                                </div>
                              </div>
                            ))}
                            {ridicat.length === 0 && mediu.length === 0 && (
                              <div style={{ textAlign: 'center', padding: '24px', color: '#4ade80', fontSize: '13px' }}>✅ Niciun elev cu risc detectat</div>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* Tab: Clasament */}
                {tabElevi === 'clasament' && (
                  <div style={{ padding: '16px' }}>
                    {conturiGenerate.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>Generează conturi pentru a vedea clasamentul</div>
                    ) : (() => {
                      const sorted = [...conturiGenerate].sort((a, b) => b.coins - a.coins)
                      return (
                        <>
                          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '10px' }}>Clasament anonim · elevii nu văd numele colegilor</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                            {sorted.map((c, i) => {
                              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`
                              const nivelLabel = ['Nou','Începător','Mediu','Avansat','Expert','Master'][c.nivel] || 'Nou'
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: i < 3 ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${i < 3 ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                                  <div style={{ fontSize: i < 3 ? '20px' : '13px', fontWeight: 700, color: '#94a3b8', width: 28, textAlign: 'center', flexShrink: 0 }}>{medal}</div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{c.nr}. {c.nume}</div>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                                      {c.badges.slice(0, 3).map(b => <span key={b} style={{ fontSize: '11px' }}>{b}</span>)}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>🪙 {c.coins}</div>
                                    <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 600 }}>{nivelLabel}</div>
                                    {c.streak > 0 && <div style={{ fontSize: '10px', color: '#f97316' }}>🔥 {c.streak} zile</div>}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

              </div>
            )}
          </div>

          <button
            onClick={() => setView('login')}
            style={{ display: 'block', width: '100%', marginTop: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
          >
            Deconectare
          </button>
        </div>
      )}

      <style>{`
        input::placeholder { color: #334155; }
        select option { background: #0d1117; }
      `}</style>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#f1f5f9',
  outline: 'none',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  width: '100%',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

const btnGreen: React.CSSProperties = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  borderRadius: '12px',
  padding: '13px 24px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
  transition: 'opacity 0.2s',
}
