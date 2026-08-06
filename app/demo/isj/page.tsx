'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import CalendarTermene from '../../components/CalendarTermene'

type TipUnitate = 'Liceu' | 'Colegiu' | 'Școală' | 'Grădiniță'

type UIDoc = {
  id: number; apiId?: string; titlu: string; data: string; citite: number; total: number
  tip: string; sursa: string; nou: boolean; citit: boolean; urgent: boolean
  termen?: string; readers?: any[]; nrInregistrare?: string; pdfUrl?: string
}
const TIP_COLORS: Record<TipUnitate, { bg: string; color: string }> = {
  'Liceu':     { bg: '#1e3a5f', color: '#93c5fd' },
  'Colegiu':   { bg: '#4c1d95', color: '#c4b5fd' },
  'Școală':    { bg: '#064e3b', color: '#6ee7b7' },
  'Grădiniță': { bg: '#713f12', color: '#fde68a' },
}
// Toate județele — inspectorul își alege județul la autentificare (monitorizarea LIVE se filtrează pe el).
const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brașov', 'Brăila',
  'Buzău', 'Caraș-Severin', 'Călărași', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj',
  'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj', 'Sibiu', 'Suceava',
  'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea', 'București',
]
const SCOLI_DOLJ = [
  { name: 'Liceul Teoretic "Amărăștii de Jos"', loc: 'Amărăștii de Jos', director: 'Ion Marin', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Colegiul Național "Elena Cuza"', loc: 'Craiova', director: 'Maria Ionescu', citit: true, activ: true, tip: 'Colegiu' as TipUnitate },
  { name: 'Liceul Teoretic "Henri Coandă"', loc: 'Craiova', director: 'Andrei Popescu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Școala Gimnazială Nr. 12', loc: 'Craiova', director: 'Elena Dumitrescu', citit: false, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Colegiul Tehnic "Costin D. Nenițescu"', loc: 'Craiova', director: 'Gheorghe Stan', citit: true, activ: true, tip: 'Colegiu' as TipUnitate },
  { name: 'Liceul cu Program Sportiv', loc: 'Craiova', director: 'Florin Popa', citit: false, activ: false, tip: 'Liceu' as TipUnitate },
  { name: 'Grădinița Nr. 3', loc: 'Craiova', director: 'Ana Stoica', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Grădinița Nr. 8 Craiova', loc: 'Craiova', director: 'Ioana Vlad', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Grădinița "Lumina" Craiova', loc: 'Craiova', director: 'Petra Ionescu', citit: true, activ: true, tip: 'Grădiniță' as TipUnitate },
  { name: 'Școala Gimnazială "Nicolae Titulescu"', loc: 'Băilești', director: 'Mihai Tudorache', citit: true, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Liceul Teoretic "George Țărnea"', loc: 'Băilești', director: 'Rodica Nițu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
  { name: 'Școala Primară Segarcea', loc: 'Segarcea', director: 'Vasile Constantin', citit: false, activ: true, tip: 'Școală' as TipUnitate },
  { name: 'Liceul Tehnologic Calafat', loc: 'Calafat', director: 'Cristina Barbu', citit: true, activ: true, tip: 'Liceu' as TipUnitate },
]

// Fallback gol — documentele reale se încarcă din /api/documents?judet=Dolj
const DOCUMENTE: UIDoc[] = []

export default function ISJDolj() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [tab, setTab] = useState<'docs' | 'scoli' | 'chat'>('docs')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadContent, setUploadContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [docs, setDocs] = useState(DOCUMENTE)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([
    { role: 'system', text: 'Chat ISJ → Director deschis. Puteți trimite mesaje individuale sau broadcast.' }
  ])
  const [selectedSchool, setSelectedSchool] = useState(SCOLI_DOLJ[0].name)
  const [tipFilter, setTipFilter] = useState<string>('Toate')
  const [uploadTipDoc, setUploadTipDoc] = useState('Circular')
  const [uploadTipUnitate, setUploadTipUnitate] = useState<string>('Toate')
  const [loginTitlu, setLoginTitlu] = useState('Dl')
  const [loginNume, setLoginNume] = useState('')
  const [judet, setJudet] = useState('Dolj')
  const [uploadTermen, setUploadTermen] = useState('')
  const [uploadNr, setUploadNr] = useState('')
  const [uploadUrgent, setUploadUrgent] = useState(false)
  const [uploadDestinatar, setUploadDestinatar] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFileUrl, setUploadFileUrl] = useState('')
  const [uploadFileUploading, setUploadFileUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setUploadFileUploading(true)
    try {
      const fd = new FormData()
      fd.append('password', 'ARACIP')
      fd.append('file', file)
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setUploadFileUrl(data.url)
      if (data.extractedText && !uploadContent.trim()) setUploadContent(data.extractedText)
    } catch {}
    setUploadFileUploading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail || !loginPass) { setLoginErr('Completați email și parolă.'); return }
    setLogging(true); setLoginErr('')
    try {
      const check = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'isj', password: loginPass, email: loginEmail })
      })
      const cd = await check.json()
      if (!cd?.ok) { setLogging(false); setLoginErr('Email sau parolă incorectă.'); return }
    } catch (e) { console.error('[isj auth check]', e) }
    try {
      const ses = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, role: 'isj' })
      })
      const sd = await ses.json()
      if (sd?.token) localStorage.setItem('ara_session', sd.token)
    } catch (e) { console.error('[isj session]', e) }
    setLogging(false)
    if (loginNume.trim()) {
      try { localStorage.setItem('ara_user', JSON.stringify({ titlu: loginTitlu, rol: `Inspector ISJ ${judet}`, nume: loginNume.trim(), userId: loginEmail, judet })) } catch {}
    }
    setLoggedIn(true)
  }

  // Rol de monitorizare ISJ: depunerile de autoevaluare și RAEI-urile din județul inspectorului.
  // (RAEI se transmite oficial și inspectoratului școlar județean — sursă ARACIP.)
  const [judetDepuneri, setJudetDepuneri] = useState<Array<{ nume_unitate: string; tip_unitate: string; localitate: string; status: string; calificativ_general: string | null; created_at: string }>>([])
  const [judetRaei, setJudetRaei] = useState<Array<{ nume_unitate: string; nivel: string | null; an_scolar: string | null; created_at: string }>>([])
  const [judetAutorizari, setJudetAutorizari] = useState<Array<{ nr_inregistrare: string; denumire: string; nivel: string | null; status: string; created_at: string }>>([])
  useEffect(() => {
    if (!loggedIn) return
    const jq = encodeURIComponent(judet)
    fetch(`/api/unitati?judet=${jq}`).then(r => r.json()).then(d => { if (Array.isArray(d?.unitati)) setJudetDepuneri(d.unitati) }).catch(() => {})
    fetch(`/api/raei?judet=${jq}`).then(r => r.json()).then(d => { if (Array.isArray(d?.recent)) setJudetRaei(d.recent) }).catch(() => {})
    fetch(`/api/autorizare?judet=${jq}`).then(r => r.json()).then(d => { if (Array.isArray(d?.recent)) setJudetAutorizari(d.recent) }).catch(() => {})
  }, [loggedIn, judet])

  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/documents?judet=${encodeURIComponent(judet)}`)
      .then(r => r.json())
      .then(json => {
        if (json.documents?.length) {
          let readIds: string[] = []
          try { readIds = JSON.parse(localStorage.getItem('isj_read_ids') || '[]') } catch {}
          setDocs(json.documents.map((d: any, i: number) => ({
            id: i + 1,
            apiId: d.id,
            titlu: d.titlu,
            data: new Date(d.uploadedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
            citite: d.citite ?? 0,
            total: d.totalDestinatari || 240,
            tip: d.tip,
            sursa: d.sursa,
            nou: !readIds.includes(d.id) && i === 0,
            citit: readIds.includes(d.id),
            urgent: d.urgent,
            termen: d.termen,
            readers: d.readers || [],
            nrInregistrare: d.nrInregistrare,
            pdfUrl: d.pdfUrl,
          })))
        }
      })
      .catch(() => {})
  }, [loggedIn, judet])

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: '#060b14', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <button onClick={() => router.push('/aracip')} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>← ARACIP</button>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #164e63, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}>🏛️</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>ISJ {judet}</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>Inspectoratul Școlar Județean</div>
        <div style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '10px', fontWeight: 700, color: '#38bdf8', letterSpacing: '1px' }}>DEMO LIVE — AIcraiova.ro</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare ISJ</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>Acces restricționat — Inspector Județean</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={loginTitlu} onChange={e => setLoginTitlu(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '10px', padding: '11px 10px', fontSize: '13px', color: '#38bdf8', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, width: '80px' }}>
              <option value="Dl">Dl.</option>
              <option value="Dna">Dna.</option>
            </select>
            <input placeholder="Prenume Nume" value={loginNume} onChange={e => setLoginNume(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Județ</label>
            <select value={judet} onChange={e => setJudet(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#38bdf8', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', boxSizing: 'border-box' as const }}>
              {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <input type="email" placeholder="Email instituțional" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
          <input type="password" placeholder="Parolă" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
          {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
          <button type="submit" disabled={logging} style={{ background: 'linear-gradient(135deg, #164e63, #0ea5e9)', border: 'none', borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>
            {logging ? 'Se verifică...' : 'Intră în cont →'}
          </button>
        </form>
        <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '10px', fontSize: '11px', color: '#38bdf8', textAlign: 'center' }}>Demo: orice email + parolă funcționează</div>
      </div>
    </div>
  )

  const TIP_RATII: Record<string, number> = { 'Toate': 1, 'Liceu': 0.18, 'Colegiu': 0.12, 'Școală': 0.45, 'Grădiniță': 0.25 }

  function markDocRead(id: number, apiId?: string) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, citit: true, nou: false } : d))
    if (apiId) {
      try {
        const existing: string[] = JSON.parse(localStorage.getItem('isj_read_ids') || '[]')
        if (!existing.includes(apiId)) localStorage.setItem('isj_read_ids', JSON.stringify([...existing, apiId]))
      } catch {}
      const viewerName = loginNume.trim() ? `${loginTitlu} ${loginNume.trim()}` : 'Inspector ISJ'
      let sessionToken = ''
      try { sessionToken = localStorage.getItem('ara_session') || '' } catch {}
      fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-User-Session': sessionToken },
        body: JSON.stringify({ id: apiId, action: 'read', viewer: { name: viewerName, rol: `Inspector ISJ ${judet}` } }),
      }).catch(() => {})
    }
  }

  async function handleUpload() {
    if (!uploadTitle.trim()) return
    setUploading(true)
    try {
      const destinatari = uploadDestinatar || `Toți directorii din județul ${judet}${uploadTipUnitate !== 'Toate' ? ` — ${uploadTipUnitate}e` : ''}`
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'ARACIP',
          document: {
            titlu: uploadTitle,
            tip: uploadTipDoc,
            sursa: `ISJ ${judet}`,
            sursa_tip: 'isj',
            judet: judet,
            termen: uploadTermen || undefined,
            urgent: uploadUrgent,
            continut: uploadContent || uploadTitle,
            destinatari,
            nr: uploadNr || undefined,
            pdfUrl: uploadFileUrl || undefined,
            tipUnitate: uploadTipUnitate,
            totalDestinatari: Math.round(240 * (TIP_RATII[uploadTipUnitate] ?? 1)),
          }
        })
      })
      const data = await res.json()
      if (data.ok) {
        const total = Math.round(240 * (TIP_RATII[uploadTipUnitate] ?? 1))
        setDocs(prev => [{
          id: prev.length + 1,
          titlu: uploadTitle + (uploadTipUnitate !== 'Toate' ? ` — ${uploadTipUnitate}e` : ''),
          data: new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
          citite: 0,
          total,
          tip: uploadTipDoc,
          sursa: `ISJ ${judet}`,
          nou: true,
          citit: true,
          urgent: uploadUrgent,
        }, ...prev])
        setUploadDone(true)
        setTimeout(() => {
          setShowUpload(false); setUploadDone(false); setUploadTitle(''); setUploadContent('')
          setUploadTipUnitate('Toate'); setUploadTermen(''); setUploadNr(''); setUploadUrgent(false)
          setUploadFile(null); setUploadFileUrl('')
        }, 2000)
      }
    } catch {}
    setUploading(false)
  }

  async function sendChat() {
    if (!chatMsg.trim()) return
    const msg = chatMsg
    setChatMsg('')
    setChatHistory(h => [...h, { role: 'isj', text: msg }])
    await new Promise(r => setTimeout(r, 800))
    setChatHistory(h => [...h, { role: 'director', text: `Am primit mesajul dvs. Vă mulțumesc, voi lua măsurile necesare. — Director ${SCOLI_DOLJ.find(s => s.name === selectedSchool)?.director}` }])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '56px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/aracip')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← ARACIP</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🏛️ ISJ {judet}</span>
          <span style={{ background: '#164e63', color: '#67e8f9', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>INSPECTOR ȘEF</span>
          <span style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>● DEMO LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {docs.some(d => !d.citit && d.sursa === 'Inspector Național') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#92400e', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 12px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px #f59e0b' }} />
              <span style={{ fontSize: '12px', color: '#fcd34d', fontWeight: 700 }}>🔔 {docs.filter(d => !d.citit && d.sursa === 'Inspector Național').length} document{docs.filter(d => !d.citit && d.sursa === 'Inspector Național').length > 1 ? 'e' : ''} nou{docs.filter(d => !d.citit && d.sursa === 'Inspector Național').length > 1 ? 'ă' : ''} de la Inspector Național</span>
            </div>
          )}
          <span style={{ fontSize: '12px', color: '#64748b' }}>Inspector: <strong style={{ color: '#e2e8f0' }}>{loginNume ? `${loginTitlu}. ${loginNume}` : `ISJ ${judet}`}</strong></span>
          <button
            onClick={() => setShowUpload(true)}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Încarcă Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '20px 24px 0', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px', maxWidth: '1200px', margin: '0 auto' }}>
        {(() => {
          const today = new Date().toDateString()
          const allReaders = docs.flatMap((d: any) => d.readers || [])
          const conectateAzi = new Set(allReaders.filter((r: any) => new Date(r.la).toDateString() === today).map((r: any) => r.scoala || r.name)).size
          const alerte = docs.filter(d => (d.urgent && (d.citite ?? 0) === 0) || ((d as any).termen && new Date((d as any).termen) < new Date() && (d.citite ?? 0) < d.total)).length
          const totalCitiri = docs.reduce((s: number, d: any) => s + (d.readers?.length || 0), 0)
          return [
            { label: 'Documente Publicate', val: docs.length.toString(), icon: '📄', color: '#3b82f6' },
            { label: 'Total Citiri', val: totalCitiri.toString(), icon: '👁', color: '#a78bfa' },
            { label: 'Citiri Azi', val: conectateAzi > 0 ? conectateAzi.toString() : '—', icon: '🟢', color: '#22c55e' },
            { label: 'Alerte Nerezolvate', val: alerte.toString(), icon: '⚠️', color: alerte > 0 ? '#f59e0b' : '#22c55e' },
          ]
        })().map(s => (
          <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Calendar Termene */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '20px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <CalendarTermene />
      </div>

      {/* Tabs */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '20px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: isMobile ? '100%' : 'fit-content' }}>
          {[
            { key: 'docs', label: '📄 Documente' },
            { key: 'scoli', label: '🏫 Școli & Directori' },
            { key: 'chat', label: '💬 Chat cu Director' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'docs' | 'scoli' | 'chat')}
              style={{
                background: tab === t.key ? '#3b82f6' : 'none',
                color: tab === t.key ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: tab === t.key ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: isMobile ? '12px' : '16px 24px 24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* DOCUMENTE TAB */}
        {tab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Alerte termen */}
            {docs.filter(d => d.termen && (() => { const z = (new Date(d.termen!).getTime() - Date.now()) / 86400000; return z >= 0 && z <= 5 })()).map(d => (
              <div key={`alert-${d.id}`} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>TERMEN APROAPE — {d.titlu.slice(0, 50)}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Scadent: {new Date(d.termen!).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })} · {Math.ceil((new Date(d.termen!).getTime() - Date.now()) / 86400000)} zile rămase</div>
                </div>
              </div>
            ))}
            {/* Asigurarea calității în județ — monitorizare ISJ (LIVE): autoevaluări depuse + RAEI */}
            {(judetDepuneri.length > 0 || judetRaei.length > 0 || judetAutorizari.length > 0) && (
              <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(5,150,105,0.06))', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '10px' }}>📊 Asigurarea calității în județ — LIVE (rol de monitorizare)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Autoevaluări depuse ({judetDepuneri.length})</div>
                    {judetDepuneri.slice(0, 6).map((u, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', padding: '3px 0', borderBottom: '1px solid #1e293b' }}>
                        {u.nume_unitate} <span style={{ color: '#64748b' }}>· {u.calificativ_general || u.status}</span>
                      </div>
                    ))}
                    {judetDepuneri.length === 0 && <div style={{ fontSize: '12px', color: '#475569' }}>Nicio depunere încă</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>RAEI generate ({judetRaei.length})</div>
                    {judetRaei.slice(0, 6).map((r, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', padding: '3px 0', borderBottom: '1px solid #1e293b' }}>
                        {r.nume_unitate} <span style={{ color: '#64748b' }}>· {r.nivel || '—'} · {r.an_scolar || '—'}</span>
                      </div>
                    ))}
                    {judetRaei.length === 0 && <div style={{ fontSize: '12px', color: '#475569' }}>Niciun RAEI încă</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Cereri autorizare ({judetAutorizari.length})</div>
                    {judetAutorizari.slice(0, 6).map((a, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', padding: '3px 0', borderBottom: '1px solid #1e293b' }}>
                        {a.denumire} <span style={{ color: '#64748b' }}>· {a.nivel || '—'} · {a.status}</span>
                      </div>
                    ))}
                    {judetAutorizari.length === 0 && <div style={{ fontSize: '12px', color: '#475569' }}>Nicio cerere încă</div>}
                  </div>
                </div>
              </div>
            )}

            {docs.map(doc => (
              <div
                key={doc.id}
                onClick={() => !doc.citit && markDocRead(doc.id, doc.apiId)}
                style={{
                  background: '#1e293b',
                  border: `1px solid ${!doc.citit ? (doc.sursa === 'Inspector Național' ? '#3b82f6' : '#f59e0b') : '#334155'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: !doc.citit ? 'pointer' : 'default',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, background: !doc.citit ? (doc.sursa === 'Inspector Național' ? '#1d4ed8' : '#92400e') : '#0f172a', border: `1px solid ${!doc.citit ? '#f59e0b' : '#334155'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                  {!doc.citit && <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {!doc.citit && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                    {!doc.citit && doc.sursa === 'Inspector Național' && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>URGENT</span>}
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{doc.tip}</span>
                    <span style={{ background: doc.sursa === 'Inspector Național' ? '#1d4ed8' : '#064e3b', color: doc.sursa === 'Inspector Național' ? '#93c5fd' : '#6ee7b7', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>
                      {doc.sursa === 'Inspector Național' ? '🇾🇴 Inspector Național' : `🏛️ ISJ ${judet}`}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: !doc.citit ? 700 : 500, color: !doc.citit ? '#f1f5f9' : '#94a3b8', marginBottom: '4px' }}>
                    {doc.titlu}
                    <span className="text-xs text-gray-500" style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Nr. {doc.nrInregistrare ?? '—'}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {doc.sursa} · {doc.data} · AI indexat ✓
                    <span style={{ marginLeft: '10px', color: (doc.readers?.length || 0) > 0 ? '#22c55e' : '#475569', fontWeight: 600 }}>
                      👁 Citit de {(doc.readers?.length || 0)}
                    </span>
                    {doc.apiId && (
                      <a
                        href={`/api/documents/${doc.apiId}/download`}
                        target="_blank"
                        rel="noopener"
                        onClick={e => e.stopPropagation()}
                        className="ml-2 inline-block rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 no-underline hover:bg-blue-500/20"
                        style={{ marginLeft: '10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
                      >
                        ⬇ Descarcă
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '140px' }}>
                  {!doc.citit ? (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>Apasă pentru citire →</span>
                  ) : (
                    <>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: doc.citite === doc.total ? '#22c55e' : '#f59e0b', marginBottom: '4px' }}>
                        {doc.citite}/{doc.total} directori
                      </div>
                      <div style={{ width: 120, height: 4, background: '#334155', borderRadius: '2px' }}>
                        <div style={{ width: `${(doc.citite / doc.total) * 100}%`, height: '100%', background: doc.citite === doc.total ? '#22c55e' : '#f59e0b', borderRadius: '2px' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '4px' }}>✓ Citit de ISJ</div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* Confirmări directori per document */}
            {docs.filter(d => d.citit && (d as any).readers?.length > 0).map(doc => (
              <div key={`readers-${doc.id}`} style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>✅ Confirmări directori — {doc.titlu.slice(0, 45)}...</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(doc as any).readers?.map((r: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{r.name}</span>
                        {r.scoala && <span style={{ color: '#64748b', marginLeft: '8px' }}>{r.scoala}</span>}
                        {r.tipScoala && <span style={{ marginLeft: '6px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '1px 5px', borderRadius: '6px', fontSize: '9px', fontWeight: 700 }}>{r.tipScoala}</span>}
                      </div>
                      <span style={{ color: '#475569' }}>{new Date(r.la).toLocaleString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {docs.every(d => d.citit) && (
              <div style={{ textAlign: 'center', padding: '16px', color: '#22c55e', fontSize: '14px' }}>
                ✅ Toate documentele au fost citite!
              </div>
            )}
          </div>
        )}

        {/* SCOLI TAB */}
        {tab === 'scoli' && (() => {
          // Build real school status from readers
          const allReaders = docs.flatMap((d: any) => d.readers || [])
          const now48 = 48 * 60 * 60 * 1000
          const readerMap = new Map<string, { la: Date; tipScoala?: string; directorName?: string }>()
          for (const r of allReaders) {
            if (!r.scoala) continue
            const la = new Date(r.la)
            const ex = readerMap.get(r.scoala)
            if (!ex || la > ex.la) readerMap.set(r.scoala, { la, tipScoala: r.tipScoala, directorName: r.name })
          }

          // Lista statică demo e specifică Dolj — pentru alte județe afișăm doar confirmările reale (LIVE).
          const scoliStatice = judet === 'Dolj' ? SCOLI_DOLJ : []
          // Enrich static list with real status
          const scoliCuStatus = scoliStatice.map(s => {
            let match = readerMap.get(s.name)
            if (!match) {
              // Try partial name match
              for (const [key, val] of readerMap) {
                const a = s.name.toLowerCase().replace(/[""]/g, '"')
                const b = key.toLowerCase().replace(/[""]/g, '"')
                if (a.includes(b.slice(0, 12)) || b.includes(a.slice(0, 12))) { match = val; break }
              }
            }
            return {
              ...s,
              citit: !!match,
              activ: match ? (Date.now() - match.la.getTime()) < now48 : false,
              director: match?.directorName || s.director,
              lastSeen: match?.la,
            }
          })

          // Add real schools from readers not in static list
          const extraScoli: typeof scoliCuStatus = []
          for (const [scoala, data] of readerMap) {
            const already = scoliCuStatus.some(s => {
              const a = s.name.toLowerCase(); const b = scoala.toLowerCase()
              return a === b || a.includes(b.slice(0, 12)) || b.includes(a.slice(0, 12))
            })
            if (!already) {
              const tip = (data.tipScoala || 'Școală') as TipUnitate
              extraScoli.push({ name: scoala, loc: 'Dolj', director: data.directorName || 'Director', citit: true, activ: (Date.now() - data.la.getTime()) < now48, tip, lastSeen: data.la })
            }
          }

          const toateScolile = [...extraScoli, ...scoliCuStatus]

          return (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Filtre tip */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip:</span>
              {(['Toate', 'Liceu', 'Colegiu', 'Școală', 'Grădiniță'] as const).map(t => {
                const count = t === 'Toate' ? toateScolile.length : toateScolile.filter(s => s.tip === t).length
                if (count === 0) return null
                const sel = tipFilter === t
                const tc = t !== 'Toate' ? TIP_COLORS[t] : { bg: '#334155', color: '#94a3b8' }
                return (
                  <button key={t} onClick={() => setTipFilter(t)} style={{
                    background: sel ? tc.bg : '#0f172a',
                    border: `1px solid ${sel ? tc.color : '#334155'}`,
                    color: sel ? tc.color : '#64748b',
                    borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: sel ? 700 : 400, cursor: 'pointer',
                  }}>
                    {t} ({count})
                  </button>
                )
              })}
              <span style={{ fontSize: '11px', color: '#4ade80', marginLeft: 'auto' }}>
                {toateScolile.filter(s => s.citit).length} confirmate · {toateScolile.filter(s => s.activ).length} active azi
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Unitate Școlară', 'Tip', 'Localitate', 'Director', 'Doc citit', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {toateScolile.filter(s => tipFilter === 'Toate' || s.tip === tipFilter).map((s, i) => {
                  const tc = TIP_COLORS[s.tip]
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #334155', background: s.citit && s.activ ? 'rgba(34,197,94,0.03)' : 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                        {s.name}
                        {(s as any).lastSeen && (
                          <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '2px' }}>
                            ✓ {new Date((s as any).lastSeen).toLocaleString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: tc.bg, color: tc.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{s.tip}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.loc}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.director}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        {s.citit ? <span style={{ color: '#22c55e' }}>✓ Da</span> : <span style={{ color: '#ef4444' }}>✗ Nu</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.activ
                          ? <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>● Activ</span>
                          : <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠ Inactiv 48h</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>
          )
        })()}

        {/* CHAT TAB */}
        {tab === 'chat' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: '16px', height: isMobile ? 'auto' : '500px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '200px' : 'none' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #334155', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selectează Școala</div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {(judet === 'Dolj' ? SCOLI_DOLJ : []).map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSchool(s.name)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: selectedSchool === s.name ? '#1d4ed8' : 'transparent',
                      borderBottom: '1px solid #334155',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: selectedSchool === s.name ? '#fff' : '#e2e8f0' }}>{s.name.slice(0, 30)}...</div>
                    <div style={{ fontSize: '11px', color: selectedSchool === s.name ? '#93c5fd' : '#64748b' }}>{s.director}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: isMobile ? '300px' : 'auto' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{selectedSchool}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Chat direct ISJ ↔ Director</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: isMobile ? '250px' : 'none' }}>
                {chatHistory.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'isj' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      background: m.role === 'isj' ? '#1d4ed8' : m.role === 'system' ? '#334155' : '#065f46',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#f1f5f9',
                    }}>
                      {m.role !== 'system' && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{m.role === 'isj' ? `ISJ ${judet}` : 'Director'}</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px', borderTop: '1px solid #334155', display: 'flex', gap: '10px' }}>
                <input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Scrieți mesaj pentru director..."
                  style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
                />
                <button onClick={sendChat} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Trimite</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: isMobile ? '20px' : '32px', width: isMobile ? 'calc(100vw - 32px)' : '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            {uploadDone ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>Document publicat!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>AI a indexat documentul. Toți cei 240 directori au primit notificare.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>📄 Încarcă Document ISJ</h3>

                {/* Tip document */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip document</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Circular', 'Procedură', 'Adresă', 'Decizie'].map(t => (
                      <button key={t} onClick={() => setUploadTipDoc(t)} style={{
                        background: uploadTipDoc === t ? '#1d4ed8' : '#0f172a',
                        border: `1px solid ${uploadTipDoc === t ? '#3b82f6' : '#334155'}`,
                        color: uploadTipDoc === t ? '#fff' : '#94a3b8',
                        borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                {/* Tip unitate destinatara */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destinatari — tip unitate</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { val: 'Toate', label: 'Toate', color: '#94a3b8', bg: '#334155', count: '240' },
                      { val: 'Liceu', label: 'Licee', color: '#93c5fd', bg: '#1e3a5f', count: '~43' },
                      { val: 'Colegiu', label: 'Colegii', color: '#c4b5fd', bg: '#4c1d95', count: '~29' },
                      { val: 'Școală', label: 'Școli Gimn.', color: '#6ee7b7', bg: '#064e3b', count: '~108' },
                      { val: 'Grădiniță', label: 'Grădinițe', color: '#fde68a', bg: '#713f12', count: '~60' },
                    ].map(opt => {
                      const sel = uploadTipUnitate === opt.val
                      return (
                        <button key={opt.val} onClick={() => setUploadTipUnitate(opt.val)} style={{
                          background: sel ? opt.bg : '#0f172a',
                          border: `2px solid ${sel ? opt.color : '#334155'}`,
                          color: sel ? opt.color : '#64748b',
                          borderRadius: '10px', padding: '7px 14px', cursor: 'pointer', textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 700 }}>{opt.label}</div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>{opt.count} unități</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Titlu document</label>
                  <input
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="ex: Circular nr. 1250/2026 — ..."
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Nr. document (opțional)</label>
                    <input value={uploadNr} onChange={e => setUploadNr(e.target.value)} placeholder="ex: 1250/2026" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Termen (opțional)</label>
                    <input value={uploadTermen} onChange={e => setUploadTermen(e.target.value)} placeholder="ex: 2026-06-15" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Conținut document (AI va indexa acest text)</label>
                  <textarea
                    value={uploadContent}
                    onChange={e => setUploadContent(e.target.value)}
                    placeholder="Introduceți sau lipiți conținutul documentului..."
                    rows={4}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Destinatari (text)</label>
                    <input value={uploadDestinatar} onChange={e => setUploadDestinatar(e.target.value)} placeholder="ex: Toți directorii din județul Dolj" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444', cursor: 'pointer', paddingTop: '22px', flexShrink: 0 }}>
                    <input type="checkbox" checked={uploadUrgent} onChange={e => setUploadUrgent(e.target.checked)} />
                    🔴 Urgent
                  </label>
                </div>
                {/* Upload fișier */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600 }}>📎 Atașează fișier — PDF, Excel, Word, orice format (opțional)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ flex: 1, background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📂</span>
                      <span style={{ fontSize: '12px', color: uploadFile ? '#a78bfa' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {uploadFile ? uploadFile.name : 'Selectează fișier...'}
                      </span>
                      <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadFile(f); setUploadFileUrl(''); handleFileUpload(f) } }} />
                    </label>
                    {uploadFileUploading && <span style={{ fontSize: '12px', color: '#3b82f6', whiteSpace: 'nowrap' }}>Se urcă...</span>}
                    {uploadFileUrl && <span style={{ fontSize: '12px', color: '#22c55e', whiteSpace: 'nowrap', fontWeight: 700 }}>✅ Urcat</span>}
                  </div>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '12px', color: '#64748b' }}>
                  <strong style={{ color: '#a78bfa' }}>🤖 AI automat:</strong> Documentul va fi indexat instant. Directorii pot întreba chatbot-ul despre conținut imediat după publicare.
                </div>
                {uploading ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#3b82f6', fontSize: '14px' }}>
                    🤖 AI indexează documentul... notificând 240 directori...
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowUpload(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                    <button onClick={handleUpload} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Publică & Notifică →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
