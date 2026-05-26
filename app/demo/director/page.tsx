'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import CalendarTermene from '../../components/CalendarTermene'
import ChecklistConformitate from '../../components/ChecklistConformitate'

function numRo(n: number): string {
  if (n === 0) return 'zero'
  const ones = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă',
    'zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece',
    'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece']
  const tens = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci',
    'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci']
  function conv(x: number): string {
    if (x === 0) return ''
    if (x < 20) return ones[x]
    if (x < 100) { const t = Math.floor(x / 10), o = x % 10; return o === 0 ? tens[t] : `${tens[t]} și ${ones[o]}` }
    if (x < 1000) {
      const h = Math.floor(x / 100), r = x % 100
      const s = h === 1 ? 'o sută' : h === 2 ? 'două sute' : `${ones[h]} sute`
      return r === 0 ? s : `${s} ${conv(r)}`
    }
    if (x < 1000000) {
      const th = Math.floor(x / 1000), r = x % 1000
      const m = th === 1 ? 'o mie' : th === 2 ? 'două mii' : `${conv(th)} mii`
      return r === 0 ? m : `${m} ${conv(r)}`
    }
    return String(x)
  }
  return conv(n)
}

function prepareForSpeech(text: string): string {
  let s = text
  s = s.replace(/\bISJ\b/g, 'I S J')
     .replace(/\bPNRR\b/g, 'P N R R')
     .replace(/\bAI\b/g, 'Ei Ai')
     .replace(/nr\./gi, 'numărul')
     .replace(/\bpct\./gi, 'punctul')
  s = s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[*_~`#]/g, '')
  s = s.replace(/(\d+)\s*mai\s*(\d{4})/gi, (_, d, y) => `${numRo(parseInt(d))} mai ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d+)\/(\d{4})\b/g, (_, n, y) => `${numRo(parseInt(n))} din ${numRo(parseInt(y))}`)
  s = s.replace(/\b(\d{1,9})\b/g, (_, n) => numRo(parseInt(n)))
  return s.trim()
}

function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.lang.startsWith('ro') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Ioana') || v.name.includes('Carmen') || v.name.includes('Maria')))
    || voices.find(v => v.lang.startsWith('ro'))
    || voices.find(v => v.lang.startsWith('en-GB'))
    || voices[0]
    || null
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?…])\s+|(?<=—)\s*/).map(s => s.trim()).filter(s => s.length > 0)
}

function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = prepareForSpeech(text)
  const sentences = splitSentences(clean)
  if (sentences.length === 0) { onEnd?.(); return }
  const voice = getVoice()
  function makeUtt(s: string): SpeechSynthesisUtterance {
    const u = new SpeechSynthesisUtterance(s)
    u.lang = 'ro-RO'
    u.rate = 1.0
    u.pitch = 1.0
    u.volume = 1
    if (voice) u.voice = voice
    return u
  }
  let index = 0
  function speakNext() {
    if (index >= sentences.length) { onEnd?.(); return }
    const u = makeUtt(sentences[index])
    index++
    const lastChar = sentences[index - 1].slice(-1)
    const pause = (lastChar === '.' || lastChar === '!' || lastChar === '?') ? 280 : 180
    u.onend = () => setTimeout(speakNext, pause)
    window.speechSynthesis.speak(u)
  }
  speakNext()
}

const NOTIFICARI = [
  { id: 1, titlu: 'Metodologie Evaluare Națională 2026', data: '19 mai 2026', citit: false, urgent: true, tip: 'Metodologie', sursa: 'Inspector Național' },
  { id: 2, titlu: 'Circular nr. 1247/2026 — Raportare absențe mai 2026', data: '17 mai 2026', citit: false, urgent: true, tip: 'Circular', sursa: 'ISJ Dolj' },
  { id: 3, titlu: 'Procedura nr. 892/2026 — Examene naționale 2026', data: '14 mai 2026', citit: true, urgent: false, tip: 'Procedură', sursa: 'ISJ Dolj' },
  { id: 4, titlu: 'Adresa nr. 2103/2026 — Dotări informatice PNRR', data: '10 mai 2026', citit: true, urgent: false, tip: 'Adresă', sursa: 'Inspector Național' },
  { id: 5, titlu: 'Circular nr. 1198/2026 — Situație statistică an școlar', data: '5 mai 2026', citit: true, urgent: false, tip: 'Circular', sursa: 'ISJ Dolj' },
]

type Msg = { role: 'user' | 'assistant'; content: string }

export default function DirectorPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginNume, setLoginNume] = useState('')
  const [loginTitlu, setLoginTitlu] = useState('Dl')
  const [loginTipScoala, setLoginTipScoala] = useState('Liceu')
  const [loginScoala, setLoginScoala] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [savedProfile, setSavedProfile] = useState<{ titlu: string; nume: string; tipScoala: string; scoala: string } | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [tab, setTab] = useState<'notificari' | 'bot' | 'chat'>('notificari')
  const [notificari, setNotificari] = useState(NOTIFICARI)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showReclama, setShowReclama] = useState(false)
  const [reclamaCategorie, setReclamaCategorie] = useState('Abatere disciplinară')
  const [reclamaDescriere, setReclamaDescriere] = useState('')
  const [reclamaTrimiteISJ, setReclamaTrimiteISJ] = useState(true)
  const [reclamaTrimiteARACIP, setReclamaTrimiteARACIP] = useState(true)
  const [reclamaSent, setReclamaSent] = useState(false)

  // Trimite document către ISJ / ARACIP
  const [showTrimiteDoc, setShowTrimiteDoc] = useState(false)
  const [tdTitlu, setTdTitlu] = useState('')
  const [tdContinut, setTdContinut] = useState('')
  const [tdTip, setTdTip] = useState('Adresă')
  const [tdDestinatar, setTdDestinatar] = useState<'isj' | 'aracip'>('isj')
  const [tdUrgent, setTdUrgent] = useState(false)
  const [tdNr, setTdNr] = useState('')
  const [tdTermen, setTdTermen] = useState('')
  const [tdFile, setTdFile] = useState<File | null>(null)
  const [tdFileUrl, setTdFileUrl] = useState('')
  const [tdFileName, setTdFileName] = useState('')
  const [tdUploadingFile, setTdUploadingFile] = useState(false)
  const [tdSending, setTdSending] = useState(false)
  const [tdSent, setTdSent] = useState(false)
  const [tdError, setTdError] = useState('')

  const unread = notificari.filter(n => !n.citit).length

  useEffect(() => {
    if (typeof window === 'undefined') return
    const urgente = notificari.filter(n => n.urgent && !n.citit).slice(0, 5)
    ;(window as unknown as { __araPageContext?: unknown }).__araPageContext = {
      rol: 'Director',
      scoala: loginScoala || undefined,
      tipScoala: loginTipScoala || undefined,
      totalDocumente: notificari.length,
      neciite: unread,
      urgenteNeciite: urgente.length,
      docVizibile: notificari.slice(0, 8).map(n => {
        const x = n as { titlu: string; sursa: string; urgent?: boolean; citit?: boolean; termen?: string; nrInregistrare?: string }
        return {
          titlu: x.titlu,
          sursa: x.sursa,
          urgent: !!x.urgent,
          citit: !!x.citit,
          termen: x.termen || null,
          nr: x.nrInregistrare || null,
        }
      }),
    }
    return () => { try { delete (window as unknown as { __araPageContext?: unknown }).__araPageContext } catch {} }
  }, [notificari, unread, loginScoala, loginTipScoala])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load saved Director profile from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('director_profile')
      if (raw) {
        const p = JSON.parse(raw)
        if (p.nume) {
          setSavedProfile(p)
          setLoginTitlu(p.titlu || 'Dl')
          setLoginNume(p.nume)
          setLoginTipScoala(p.tipScoala || 'Liceu')
          setLoginScoala(p.scoala || '')
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!loggedIn) return
    fetch('/api/documents?judet=Dolj')
      .then(r => r.json())
      .then(json => {
        if (json.documents?.length) {
          let readIds: string[] = []
          try { readIds = JSON.parse(localStorage.getItem('director_read_ids') || '[]') } catch {}
          const filtered = json.documents.filter((d: any) =>
            // exclude documente trimise de directori (those go UP la ISJ/ARACIP, nu DOWN la directori)
            !(typeof d.sursa_tip === 'string' && d.sursa_tip.startsWith('director-')) &&
            (!d.tipUnitate || d.tipUnitate === 'Toate' || d.tipUnitate === loginTipScoala)
          )
          const myId = loginEmail
          setNotificari(filtered.map((d: any, i: number) => {
            const readByMe = (d.readers || []).some((r: any) => r.userId === myId || r.email === myId)
            return {
              id: i + 1,
              apiId: d.id,
              titlu: d.titlu,
              data: new Date(d.uploadedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
              citit: readIds.includes(d.id) || readByMe,
              urgent: d.urgent,
              tip: d.tip,
              sursa: d.sursa,
              pdfUrl: d.pdfUrl,
              termen: d.termen,
              nrInregistrare: d.nrInregistrare,
              readers: d.readers || [],
            }
          }))
        }
      })
      .catch(() => {})
  }, [loggedIn])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail || !loginPass) { setLoginErr('Completați email și parolă.'); return }
    setLogging(true); setLoginErr('')
    try {
      const check = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'director', password: loginPass, email: loginEmail })
      })
      const cd = await check.json()
      if (!cd?.ok) { setLogging(false); setLoginErr('Email sau parolă incorectă.'); return }
    } catch (e) { console.error('[director auth check]', e) }
    try {
      const ses = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, role: 'director' })
      })
      const sd = await ses.json()
      if (sd?.token) localStorage.setItem('ara_session', sd.token)
    } catch (e) { console.error('[director session]', e) }
    setLogging(false)
    if (loginNume.trim()) {
      try {
        localStorage.setItem('ara_user', JSON.stringify({ titlu: loginTitlu, rol: `Director ${loginTipScoala}`, nume: loginNume.trim(), userId: loginEmail }))
        localStorage.setItem('director_profile', JSON.stringify({ titlu: loginTitlu, nume: loginNume.trim(), tipScoala: loginTipScoala, scoala: loginScoala.trim() }))
      } catch {}
    }
    setLoggedIn(true)
  }

  function authHdrDirector(): Record<string, string> {
    let t = ''
    try { t = localStorage.getItem('ara_session') || '' } catch {}
    return t ? { 'X-User-Session': t } : {}
  }

  function resetTrimiteDoc() {
    setTdTitlu(''); setTdContinut(''); setTdTip('Adresă'); setTdDestinatar('isj')
    setTdUrgent(false); setTdNr(''); setTdTermen('')
    setTdFile(null); setTdFileUrl(''); setTdFileName(''); setTdError(''); setTdSent(false)
  }

  async function tdUploadFile(file: File) {
    setTdUploadingFile(true)
    setTdFile(file)
    setTdFileName(file.name)
    setTdError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      // upload-pdf acceptă sesiune director, NU mai are nevoie de parolă
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: fd, headers: authHdrDirector() })
      const data = await res.json()
      if (data.url) setTdFileUrl(data.url)
      if (data.extractedText && !tdContinut.trim()) setTdContinut(data.extractedText)
      if (!data.url && data.error) setTdError(data.error)
    } catch (e) {
      console.error('[tdUploadFile]', e)
      setTdError('Eroare la încărcare.')
    }
    setTdUploadingFile(false)
  }

  async function tdSubmit() {
    if (!tdTitlu.trim()) { setTdError('Titlul este obligatoriu.'); return }
    if (!tdFileUrl && !tdContinut.trim()) { setTdError('Atașați un fișier sau scrieți conținutul.'); return }
    setTdSending(true)
    setTdError('')
    try {
      const sursa_tip = tdDestinatar === 'isj' ? 'director-isj' : 'director-aracip'
      const sursa = `${loginTitlu}. ${loginNume.trim() || 'Director'}${loginScoala ? ' — ' + loginScoala : ''}`
      const destinatari = tdDestinatar === 'isj' ? 'ISJ Dolj' : 'ARACIP (Agenția Națională)'
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHdrDirector() },
        body: JSON.stringify({
          document: {
            titlu: tdTitlu.trim(),
            tip: tdTip,
            sursa,
            sursa_tip,
            judet: tdDestinatar === 'isj' ? 'Dolj' : 'national',
            termen: tdTermen || undefined,
            urgent: tdUrgent,
            continut: tdContinut.trim() || tdTitlu,
            destinatari,
            nr: tdNr || undefined,
            pdfUrl: tdFileUrl || undefined,
            tipUnitate: loginTipScoala,
          }
        })
      })
      const data = await res.json()
      if (data.ok) { setTdSent(true) }
      else { setTdError(data.error || 'Eroare la trimitere.') }
    } catch (e: any) {
      console.error('[tdSubmit]', e)
      setTdError('Eroare rețea: ' + (e?.message || 'necunoscută'))
    }
    setTdSending(false)
  }

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: '#060b14', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <button onClick={() => router.back()} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #064e3b, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>🏫</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Director</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>Școală / Grădiniță</div>
        <div style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '10px', fontWeight: 700, color: '#34d399', letterSpacing: '1px' }}>DEMO LIVE — AIcraiova.ro</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare Director</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>Acces restricționat — Director unitate școlară</p>

        {/* Profil salvat — intri cu un click */}
        {savedProfile && !editingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Bun venit înapoi</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#34d399' }}>{savedProfile.titlu}. {savedProfile.nume}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{savedProfile.tipScoala} · {savedProfile.scoala || '—'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  title="Modifică datele"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '6px 10px', color: '#94a3b8', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
                >
                  ✏️
                </button>
              </div>
            </div>
            <input type="email" placeholder="Email instituțional" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            <input type="password" placeholder="Parolă" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
            <button onClick={handleLogin as any} disabled={logging} style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', border: 'none', borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
              {logging ? 'Se verifică...' : 'Intră în cont →'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {editingProfile && (
              <button type="button" onClick={() => setEditingProfile(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: 0 }}>← Înapoi la profilul salvat</button>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select value={loginTitlu} onChange={e => setLoginTitlu(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '10px', padding: '11px 10px', fontSize: '13px', color: '#34d399', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, width: '80px' }}>
                <option value="Dl">Dl.</option>
                <option value="Dna">Dna.</option>
              </select>
              <input placeholder="Prenume Nume" value={loginNume} onChange={e => setLoginNume(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            </div>
            <select value={loginTipScoala} onChange={e => setLoginTipScoala(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#34d399', outline: 'none', fontFamily: 'inherit', width: '100%', cursor: 'pointer' }}>
              <option value="Liceu">Liceu</option>
              <option value="Colegiu">Colegiu</option>
              <option value="Școală">Școală Gimnazială / Primară</option>
              <option value="Grădiniță">Grădiniță</option>
            </select>
            <input placeholder="Denumirea unității școlare" value={loginScoala} onChange={e => setLoginScoala(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            <input type="email" placeholder="Email instituțional" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            <input type="password" placeholder="Parolă" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
            {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
            <button type="submit" disabled={logging} style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', border: 'none', borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
              {logging ? 'Se verifică...' : 'Intră în cont →'}
            </button>
          </form>
        )}
        <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: '10px', fontSize: '11px', color: '#34d399', textAlign: 'center' }}>Demo: orice email + parolă funcționează</div>
      </div>
    </div>
  )

  function markRead(id: number, apiId?: string) {
    setNotificari(prev => prev.map(n => n.id === id ? { ...n, citit: true } : n))
    if (apiId) {
      try {
        const existing: string[] = JSON.parse(localStorage.getItem('director_read_ids') || '[]')
        if (!existing.includes(apiId)) localStorage.setItem('director_read_ids', JSON.stringify([...existing, apiId]))
      } catch {}
      const viewerName = loginNume.trim() ? `${loginTitlu} ${loginNume.trim()}` : 'Director'
      let sessionToken = ''
      try { sessionToken = localStorage.getItem('ara_session') || '' } catch {}
      fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-User-Session': sessionToken },
        body: JSON.stringify({ id: apiId, action: 'read', viewer: { name: viewerName, rol: `Director ${loginTipScoala}`, tipScoala: loginTipScoala, scoala: loginScoala.trim() || `${loginTipScoala} (nespecificat)`, userId: loginEmail, email: loginEmail } }),
      }).catch(() => {})
    }
  }

  async function sendBot() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina: 'Portal Director ISJ Dolj' }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Contactați ISJ.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceEnabled) {
        setSpeaking(true)
        speak(reply, () => setSpeaking(false))
      }
    } catch {
      const errMsg = 'Eroare de conexiune. Contactați ISJ la zero două cinci unu, patru unu unu, cinci două două.'
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Contactați ISJ la 0251 411 522.' }])
      if (voiceEnabled) { setSpeaking(true); speak(errMsg, () => setSpeaking(false)) }
    }
    setLoading(false)
  }

  function sendChat() {
    if (!chatInput.trim()) return
    const msg = chatInput
    setChatInput('')
    setChatHistory(h => [...h, { role: 'director', text: msg }])
    setTimeout(() => {
      setChatHistory(h => [...h, { role: 'isj', text: 'Mesaj primit. Vă vom răspunde în cel mai scurt timp. — ISJ Dolj' }])
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '56px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#fff', fontWeight: 600 }}>🏫 {isMobile ? (loginScoala || loginTipScoala).slice(0, 20) : (loginScoala || loginTipScoala) || 'Portal Director'}</span>
          <span style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>DIRECTOR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Director: <strong style={{ color: '#e2e8f0' }}>{loginNume ? `${loginTitlu}. ${loginNume}` : '—'}</strong></span>
          {unread > 0 && (
            <span style={{ background: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              🔔 {unread} nou{unread > 1 ? 'ă' : ''}
            </span>
          )}
          <button
            onClick={() => { resetTrimiteDoc(); setShowTrimiteDoc(true) }}
            style={{
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '6px 10px' : '7px 16px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
            }}
          >
            📤 {isMobile ? 'Trimite' : 'Trimite document'}
          </button>
          <button
            onClick={() => { setShowReclama(true); setReclamaSent(false); setReclamaDescriere('') }}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '6px 10px' : '7px 16px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 8px rgba(220,38,38,0.4)',
            }}
          >
            🚨 {isMobile ? 'Reclamă' : 'Reclamă o abatere'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: isMobile ? '12px 12px 0' : '20px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: isMobile ? '100%' : 'fit-content' }}>
          {[
            { key: 'notificari', label: `🔔 Notificări ISJ${unread > 0 ? ` (${unread})` : ''}` },
            { key: 'bot', label: '🤖 Asistent AI' },
            { key: 'chat', label: '💬 Chat cu ISJ' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'notificari' | 'bot' | 'chat')}
              style={{
                background: tab === t.key ? '#059669' : 'none',
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

      <div style={{ padding: isMobile ? '12px' : '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>

        {/* NOTIFICARI */}
        {tab === 'notificari' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Dashboard cards: Calendar + RAEI + Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', marginBottom: '6px' }}>
              <CalendarTermene />
              <button
                onClick={() => router.push('/demo/director/raei')}
                className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-left hover:bg-purple-500/20"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '12px', padding: '16px', cursor: 'pointer', color: '#e2e8f0', textAlign: 'left' }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#c4b5fd', marginBottom: '6px' }}>📑 Generator RAEI</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>Completează cele 8 secțiuni și generează raportul anual de evaluare internă, gata pentru export PDF.</div>
              </button>
            </div>
            <ChecklistConformitate userId={loginEmail} />

            {notificari.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id, (n as any).apiId)}
                style={{
                  background: '#1e293b',
                  border: `1px solid ${!n.citit ? (n.sursa === 'Inspector Național' ? '#3b82f6' : '#f59e0b') : '#334155'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, background: !n.citit ? (n.sursa === 'Inspector Național' ? '#1d4ed8' : '#92400e') : '#1e293b', border: `1px solid ${!n.citit ? '#f59e0b' : '#334155'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                  {!n.citit && (
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    {!n.citit && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                    {n.urgent && !n.citit && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>URGENT</span>}
                    <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{n.tip}</span>
                    <span style={{ background: n.sursa === 'Inspector Național' ? '#1d4ed8' : '#064e3b', color: n.sursa === 'Inspector Național' ? '#93c5fd' : '#6ee7b7', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>
                      {n.sursa === 'Inspector Național' ? '🇾🇴 Inspector Național' : '🏛️ ISJ Dolj'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: !n.citit ? 700 : 500, color: !n.citit ? '#f1f5f9' : '#94a3b8' }}>
                    {n.titlu}
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Nr. {(n as any).nrInregistrare ?? '—'}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    {n.sursa} · {n.data}
                    {(n as any).apiId && (
                      <a
                        href={`/api/documents/${(n as any).apiId}/download`}
                        target="_blank"
                        rel="noopener"
                        onClick={e => e.stopPropagation()}
                        className="ml-2 inline-block rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 no-underline hover:bg-emerald-500/20"
                        style={{ marginLeft: '10px', background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
                      >
                        ⬇ Descarcă
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {n.citit
                    ? <span style={{ fontSize: '12px', color: '#22c55e' }}>✓ Citit</span>
                    : <span style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>Apasă pentru citire →</span>
                  }
                </div>
              </div>
            ))}

            {notificari.every(n => n.citit) && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#22c55e', fontSize: '14px' }}>
                ✅ Toate documentele au fost citite!
              </div>
            )}
          </div>
        )}

        {/* CHATBOT AI */}
        {tab === 'bot' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Asistent AI ISJ Dolj
                  {speaking && (
                    <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
                      🔊 vorbește...
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>● Online · Cunoaște toate documentele ISJ Dolj</div>
              </div>
              <button
                onClick={() => {
                  if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }
                  setVoiceEnabled(v => !v)
                }}
                title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
                style={{
                  background: voiceEnabled ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${voiceEnabled ? '#7c3aed' : '#334155'}`,
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: voiceEnabled ? '#a78bfa' : '#475569',
                  lineHeight: 1,
                }}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🤖</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Bună ziua! Sunt asistentul AI al ISJ Dolj.<br />Puteți întreba orice despre documentele oficiale.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {[
                      'Când trebuie depus raportul de absențe?',
                      'Ce comisii trebuie formate pentru Bacalaureat?',
                      'Care sunt școlile cu dotări PNRR?',
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setInput(q) }}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    background: m.role === 'user' ? '#059669' : '#0f172a',
                    border: m.role === 'assistant' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Caut în documentele ISJ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendBot()}
                placeholder="Întrebați despre orice document ISJ..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button
                onClick={sendBot}
                disabled={loading}
                style={{ background: loading ? '#334155' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? '...' : 'Întreabă'}
              </button>
            </div>
          </div>
        )}

        {/* CHAT CU ISJ */}
        {tab === 'chat' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderBottom: '1px solid rgba(234,179,8,0.3)', padding: '10px 16px', fontSize: '12px', color: '#fbbf24', lineHeight: 1.5 }}>
              🎬 <strong>Simulare demo</strong> — într-un sistem real, mesajele ar fi rutate automat către inspectorul de specialitate ISJ Dolj.
            </div>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, background: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏛️</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>ISJ Dolj — Canal Oficial</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Comunicare directă cu inspectoratul</div>
              </div>
            </div>

            <div style={{ height: '360px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#64748b' }}>Astăzi · 19 mai 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '70%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', lineHeight: 1.6 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>ISJ Dolj · 08:15</div>
                  Vă reamintim că termenul pentru raportul de absențe (Circular 1247/2026) este <strong>25 mai 2026</strong>. Vă rugăm să transmiteți formularul completat prin platformă.
                </div>
              </div>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'director' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%',
                    background: m.role === 'director' ? '#059669' : '#0f172a',
                    border: m.role === 'isj' ? '1px solid #334155' : 'none',
                    borderRadius: m.role === 'director' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f1f5f9',
                    lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{m.role === 'director' ? 'Director Marin · acum' : 'ISJ Dolj · acum'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Scrieți un mesaj către ISJ Dolj..."
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
              />
              <button onClick={sendChat} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Trimite</button>
            </div>
          </div>
        )}
      </div>

      {/* RECLAMA ABATERE MODAL */}
      {showReclama && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div style={{
            background: '#1e293b', border: '2px solid #dc2626', borderRadius: '16px',
            padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(220,38,38,0.25)',
          }}>
            {reclamaSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Reclamație trimisă!</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', lineHeight: 1.6 }}>
                  Sesizarea dvs. a fost înregistrată și transmisă către:
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {reclamaTrimiteISJ && <span style={{ background: '#1d4ed8', color: '#93c5fd', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px' }}>🏛️ ISJ Dolj</span>}
                  {reclamaTrimiteARACIP && <span style={{ background: '#7c3aed', color: '#c4b5fd', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px' }}>🏅 ARACIP</span>}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '24px' }}>Număr sesizare: <strong style={{ color: '#fca5a5' }}>SES-{Date.now().toString().slice(-6)}</strong></div>
                <button onClick={() => setShowReclama(false)} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Închide
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: 42, height: 42, background: '#7f1d1d', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🚨</div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#fca5a5' }}>Reclamă o abatere</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Sesizare oficială către ISJ și/sau ARACIP</div>
                  </div>
                  <button onClick={() => setShowReclama(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CATEGORIE ABATERE</label>
                  <select
                    value={reclamaCategorie}
                    onChange={e => setReclamaCategorie(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
                  >
                    {['Abatere disciplinară', 'Nerespectare curriculă', 'Evaluare incorectă', 'Hărțuire / bullying', 'Condiții improprii de studiu', 'Fraudă sau corupție', 'Altă abatere'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>DESCRIERE SESIZARE <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    value={reclamaDescriere}
                    onChange={e => setReclamaDescriere(e.target.value)}
                    placeholder="Descrieți abaterea constatată (persoana implicată, data, circumstanțele, orice detalii relevante)..."
                    rows={5}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '10px' }}>TRANSMITE SESIZAREA CĂTRE:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { state: reclamaTrimiteISJ, setter: setReclamaTrimiteISJ, color: '#1d4ed8', bg: 'rgba(29,78,216,0.15)', border: '#3b82f6', icon: '🏛️', label: 'ISJ Dolj', sub: 'Inspectoratul Școlar Județean Dolj' },
                      { state: reclamaTrimiteARACIP, setter: setReclamaTrimiteARACIP, color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', border: '#8b5cf6', icon: '🏅', label: 'ARACIP', sub: 'Agenția Română de Asigurare a Calității în Învățământul Preuniversitar' },
                    ].map(item => (
                      <div
                        key={item.label}
                        onClick={() => item.setter(v => !v)}
                        style={{
                          background: item.state ? item.bg : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${item.state ? item.border : '#334155'}`,
                          borderRadius: '10px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ fontSize: '22px' }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: item.state ? '#f1f5f9' : '#64748b' }}>{item.label}</div>
                          <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>{item.sub}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '6px',
                          background: item.state ? item.color : 'transparent',
                          border: `2px solid ${item.state ? item.color : '#475569'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', color: '#fff', flexShrink: 0,
                          transition: 'all 0.15s',
                        }}>
                          {item.state ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowReclama(false)}
                    style={{ flex: 1, background: 'none', border: '1px solid #334155', borderRadius: '8px', padding: '11px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Anulează
                  </button>
                  <button
                    onClick={async () => {
                      if (!reclamaDescriere.trim()) return
                      if (!reclamaTrimiteISJ && !reclamaTrimiteARACIP) return
                      try {
                        await fetch('/api/reclama', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            categorie: reclamaCategorie,
                            descriere: reclamaDescriere,
                            trimiteISJ: reclamaTrimiteISJ,
                            trimiteARACIP: reclamaTrimiteARACIP,
                            director: loginNume.trim() ? `${loginTitlu} ${loginNume.trim()}` : 'Director',
                            tipScoala: loginTipScoala,
                            scoala: loginScoala.trim() || `${loginTipScoala} (nespecificat)`,
                          })
                        })
                      } catch {}
                      setReclamaSent(true)
                    }}
                    disabled={!reclamaDescriere.trim() || (!reclamaTrimiteISJ && !reclamaTrimiteARACIP)}
                    style={{
                      flex: 2, background: reclamaDescriere.trim() && (reclamaTrimiteISJ || reclamaTrimiteARACIP) ? '#dc2626' : '#334155',
                      color: '#fff', border: 'none', borderRadius: '8px', padding: '11px',
                      fontSize: '13px', fontWeight: 700, cursor: reclamaDescriere.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: reclamaDescriere.trim() ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    🚨 Trimite sesizarea
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TRIMITE DOCUMENT MODAL */}
      {showTrimiteDoc && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div style={{
            background: '#1e293b', border: '2px solid #7c3aed', borderRadius: '16px',
            padding: '24px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(124,58,237,0.25)',
          }}>
            {tdSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Document trimis</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.6 }}>
                  Documentul a fost transmis către <strong style={{ color: '#c4b5fd' }}>{tdDestinatar === 'isj' ? 'ISJ Dolj' : 'ARACIP'}</strong> și înregistrat în platformă.
                </div>
                <button onClick={() => { setShowTrimiteDoc(false); resetTrimiteDoc() }} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Închide
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#f1f5f9' }}>📤 Trimite document</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Către ISJ Dolj sau ARACIP — semnătură automată cu identitatea dumneavoastră</div>
                  </div>
                  <button onClick={() => { setShowTrimiteDoc(false); resetTrimiteDoc() }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.3px' }}>DESTINATAR</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button type="button" onClick={() => setTdDestinatar('isj')} style={{ flex: 1, background: tdDestinatar === 'isj' ? '#1d4ed8' : '#0f172a', border: tdDestinatar === 'isj' ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: '8px', padding: '10px', color: tdDestinatar === 'isj' ? '#fff' : '#94a3b8', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>🏛️ ISJ Dolj</button>
                      <button type="button" onClick={() => setTdDestinatar('aracip')} style={{ flex: 1, background: tdDestinatar === 'aracip' ? '#7c3aed' : '#0f172a', border: tdDestinatar === 'aracip' ? '1px solid #a78bfa' : '1px solid #334155', borderRadius: '8px', padding: '10px', color: tdDestinatar === 'aracip' ? '#fff' : '#94a3b8', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>🎓 ARACIP</button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.3px' }}>TITLU *</label>
                    <input value={tdTitlu} onChange={e => setTdTitlu(e.target.value)} placeholder="Ex: Solicitare aprobare orar 2025-2026" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box', marginTop: '6px', fontFamily: 'inherit' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>TIP</label>
                      <select value={tdTip} onChange={e => setTdTip(e.target.value)} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', marginTop: '6px', fontFamily: 'inherit' }}>
                        <option>Adresă</option><option>Circular</option><option>Procedură</option><option>Ordin</option><option>Metodologie</option><option>Altele</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>NR. ÎNREGISTRARE (opțional)</label>
                      <input value={tdNr} onChange={e => setTdNr(e.target.value)} placeholder="Ex: 123/2026" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box', marginTop: '6px', fontFamily: 'inherit' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>ATAȘAMENT (PDF / DOCX / imagine)</label>
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ background: '#0f172a', border: '1px dashed #475569', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }}>
                        📎 {tdFileName ? 'Schimbă fișier' : 'Selectează fișier'}
                        <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) tdUploadFile(f); e.target.value = '' }} />
                      </label>
                      {tdFileName && <div style={{ fontSize: '12px', color: '#34d399', flex: 1 }}>📄 {tdFileName} {tdUploadingFile && <span style={{ color: '#94a3b8' }}>· se urcă...</span>}</div>}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>CONȚINUT / MESAJ</label>
                    <textarea value={tdContinut} onChange={e => setTdContinut(e.target.value)} placeholder="Conținutul documentului sau mesajul către destinatar. Dacă atașați un PDF/DOCX, textul se extrage automat." rows={4} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginTop: '6px', fontFamily: 'inherit' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tdUrgent} onChange={e => setTdUrgent(e.target.checked)} /> Urgent
                    </label>
                    <div style={{ flex: 1 }}>
                      <input type="date" value={tdTermen} onChange={e => setTdTermen(e.target.value)} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                  </div>

                  {tdError && <div style={{ fontSize: '12px', color: '#ef4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px' }}>{tdError}</div>}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={() => { setShowTrimiteDoc(false); resetTrimiteDoc() }} style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '11px', color: '#94a3b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Anulează</button>
                    <button onClick={tdSubmit} disabled={tdSending || tdUploadingFile} style={{ flex: 2, background: tdSending || tdUploadingFile ? '#334155' : '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 700, cursor: tdSending ? 'wait' : 'pointer' }}>{tdSending ? 'Se trimite...' : `📤 Trimite la ${tdDestinatar === 'isj' ? 'ISJ Dolj' : 'ARACIP'}`}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
