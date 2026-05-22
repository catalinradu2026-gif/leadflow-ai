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
  const [nrClasa, setNrClasa] = useState('10B')
  const [modulClasa, setModulClasa] = useState<string[]>(['BAC Matematică M1'])
  const [orarSalvat, setOrarSalvat] = useState(false)
  const [codCopiat, setCodCopiat] = useState(false)

  // Elevi
  type Elev = { nr: string; nume: string }
  type ContElev = { nr: string; nume: string; user: string; parola: string; minutePlatforma: number; ultimaConectare: string | null }
  const [eleviInput, setEleviInput] = useState<Elev[]>([{ nr: '', nume: '' }])
  const [conturiGenerate, setConturiGenerate] = useState<ContElev[]>([])

  // Incarcare din localStorage la pornire
  useEffect(() => {
    try {
      const zi = localStorage.getItem('dir_zi')
      const ora = localStorage.getItem('dir_ora')
      const clasa = localStorage.getItem('dir_clasa')
      const modul = localStorage.getItem('dir_modul')
      const elevi = localStorage.getItem('dir_elevi')
      const conturi = localStorage.getItem('dir_conturi')
      if (zi) setZiDirigentie(zi)
      if (ora) setOraDirigentie(ora)
      if (clasa) setNrClasa(clasa)
      if (modul) setModulClasa(JSON.parse(modul))
      if (elevi) setEleviInput(JSON.parse(elevi))
      if (conturi) setConturiGenerate(JSON.parse(conturi))
    } catch {}
  }, [])

  // Salvare automata in localStorage la orice modificare
  useEffect(() => { localStorage.setItem('dir_zi', ziDirigentie) }, [ziDirigentie])
  useEffect(() => { localStorage.setItem('dir_ora', oraDirigentie) }, [oraDirigentie])
  useEffect(() => { localStorage.setItem('dir_clasa', nrClasa) }, [nrClasa])
  useEffect(() => { localStorage.setItem('dir_modul', JSON.stringify(modulClasa)) }, [modulClasa])
  useEffect(() => { localStorage.setItem('dir_elevi', JSON.stringify(eleviInput)) }, [eleviInput])
  useEffect(() => { localStorage.setItem('dir_conturi', JSON.stringify(conturiGenerate)) }, [conturiGenerate])
  const [sectiuneElevi, setSectiuneElevi] = useState(false)
  const [tabElevi, setTabElevi] = useState<'adauga' | 'conturi' | 'activitate'>('adauga')

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
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Raport Activitate — ${demoDashboard.clasa}</title><style>
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
      <h2>Raport Activitate — Clasa ${demoDashboard.clasa}</h2>
      <p>${demoDashboard.scoala} · ${demoDashboard.judet} · Diriginte: ${demoDashboard.nume} · Generat: ${new Date().toLocaleDateString('ro-RO')}</p>
      <table>
        <thead><tr><th>Nr.</th><th>Nume</th><th>Timp platformă</th><th>Ultima conectare</th><th>Observații</th></tr></thead>
        <tbody>${conturiGenerate.map(c => `<tr>
          <td>${c.nr}</td>
          <td>${c.nume}</td>
          <td class="${c.minutePlatforma > 10 ? 'verde' : c.minutePlatforma > 0 ? 'galben' : 'gri'}">${c.minutePlatforma} min</td>
          <td>${c.ultimaConectare ?? '—'}</td>
          <td class="obs">${c.minutePlatforma === 0 ? 'Nu a accesat platforma' : c.minutePlatforma < 5 ? 'Activitate redusă' : c.minutePlatforma > 20 ? 'Foarte activ' : 'Activitate normală'}</td>
        </tr>`).join('')}</tbody>
      </table>
      <div class="footer">Platformă EDU DIGITAL · aicraiova.ro · Document generat automat pentru uz intern</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  function genereazaConturi() {
    const DEMO_ACTIVITATE = ['2 min','14 min','0 min','31 min','8 min','22 min','5 min','47 min','3 min','19 min']
    const DEMO_DATA = ['ieri 18:42','azi 09:15',null,'ieri 20:03','ieri 16:30',null,'azi 08:55','acum 3 zile',null,'ieri 22:10']
    const conturi = eleviInput.filter(e => e.nume.trim()).map((e, i) => ({
      nr: e.nr || String(i + 1),
      nume: e.nume.trim(),
      user: slugNume(e.nume.trim()),
      parola: randPass(),
      minutePlatforma: parseInt(DEMO_ACTIVITATE[i % DEMO_ACTIVITATE.length]) || 0,
      ultimaConectare: DEMO_DATA[i % DEMO_DATA.length],
    }))
    setConturiGenerate(conturi)
    setTabElevi('conturi')
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
            Demo: orice email + parolă funcționează
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
            {/* Clasa si modul */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '5px', fontWeight: 600 }}>Nr. clasă</div>
                <input
                  value={nrClasa}
                  onChange={e => setNrClasa(e.target.value)}
                  placeholder="ex: 10B"
                  style={{ ...inputStyle, width: '80px', padding: '8px 10px', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}
                />
              </div>
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
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {(['adauga', 'conturi', 'activitate'] as const).map(t => (
                    <button key={t} onClick={() => setTabElevi(t)} style={{
                      flex: 1, background: 'none', border: 'none', borderBottom: `2px solid ${tabElevi === t ? '#6366f1' : 'transparent'}`,
                      padding: '12px 8px', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: '12px', fontWeight: tabElevi === t ? 700 : 400,
                      color: tabElevi === t ? '#a5b4fc' : '#475569',
                    }}>
                      {t === 'adauga' ? '✏️ Adaugă elevi' : t === 'conturi' ? '🔑 Conturi' : '📊 Activitate'}
                    </button>
                  ))}
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
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <button onClick={printActivitate} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#4ade80', cursor: 'pointer', fontFamily: 'inherit' }}>🖨️ Printează raport</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                        {conturiGenerate.map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '8px', background: c.ultimaConectare ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: c.ultimaConectare ? '#4ade80' : '#334155', flexShrink: 0 }}>{c.nr}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nume}</div>
                              <div style={{ fontSize: '11px', color: '#475569' }}>{c.ultimaConectare ? `Ultima conectare: ${c.ultimaConectare}` : 'Niciodată conectat'}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: c.minutePlatforma > 10 ? '#4ade80' : c.minutePlatforma > 0 ? '#f59e0b' : '#334155' }}>{c.minutePlatforma} min</div>
                              <div style={{ fontSize: '10px', color: '#334155' }}>pe platformă</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      </>
                    )}
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
