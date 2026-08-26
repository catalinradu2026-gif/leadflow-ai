'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type Entry = { id: string; titlu: string; continut: string }
type Rule = { id: string; text: string }
type Knowledge = { updatedAt: string; entries: Entry[]; behaviorRules: Rule[] }
type Lead = { phone: string; context: string; mesaj: string; data: string }
type DashboardData = {
  total: number
  topKeywords: { word: string; count: number }[]
  leads: Lead[]
  leadsCount: number
  daily: { date: string; count: number }[]
}
type MarketReport = {
  totalMesaje: number
  topTopics: { context: string; label: string; count: number }[]
  topObjections: { label: string; count: number }[]
  amountDistribution: { bucket: string; count: number }[]
  periodDistribution: { bucket: string; count: number }[]
  gapQuestions: { intrebare: string; context: string; data: string }[]
  gapCount: number
}
type AgentAssist = {
  found: boolean
  conversationCount?: number
  topics: string[]
  objections: string[]
  lastAmount: number | null
  lastMonths: number | null
  gapCount: number
  transcript: { ts: string; context: string; user: string; ana: string | null }[]
  error?: string
}

const TEAL = '#2ea89d'
const NAVY = '#0f2942'

const inp = { background: '#0a1a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }
const ta = { ...inp, minHeight: '80px', resize: 'vertical' as const }
const btn = (c = TEAL, textDark = true) => ({ background: c, color: textDark ? '#04141a' : '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' })

function uid() { return Math.random().toString(36).slice(2) }

export default function BtAdmin() {
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [checking, setChecking] = useState(false)
  const [stage, setStage] = useState<'password' | 'code'>('password')
  const [code, setCode] = useState('')
  const [codeErr, setCodeErr] = useState('')
  const [data, setData] = useState<Knowledge | null>(null)
  const [tab, setTab] = useState<'cunostinte' | 'comportament' | 'dashboard' | 'piata' | 'consultant'>('cunostinte')
  const [dash, setDash] = useState<DashboardData | null>(null)
  const [dashLoading, setDashLoading] = useState(false)
  const [market, setMarket] = useState<MarketReport | null>(null)
  const [marketLoading, setMarketLoading] = useState(false)
  const [assistPhone, setAssistPhone] = useState('')
  const [assistActivePhone, setAssistActivePhone] = useState('')
  const [assist, setAssist] = useState<AgentAssist | null>(null)
  const [assistLoading, setAssistLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [ruleInput, setRuleInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function completeLogin() {
    const kRes = await fetch('/api/bt-knowledge')
    const kJson = await kRes.json()
    setData(kJson)
    setAuth(true)
    loadDashboard()
    loadMarketReport()
  }

  async function loadDashboard() {
    setDashLoading(true)
    try {
      const r = await fetch('/api/bt-log')
      const j = await r.json()
      setDash(j)
    } catch {
      // dashboard-ul rămâne gol dacă log-ul nu poate fi citit — nu blochează restul panoului
    }
    setDashLoading(false)
  }

  async function loadMarketReport() {
    setMarketLoading(true)
    try {
      const r = await fetch('/api/bt-market-report')
      const j = await r.json()
      setMarket(j)
    } catch {
      // raportul rămâne gol dacă nu poate fi citit — nu blochează restul panoului
    }
    setMarketLoading(false)
  }

  // Agent Assist Live — consultantul caută un telefon deja colectat și vede transcriptul
  // + sumarul discuției acelui lead cu Ana. "Live" = polling simplu la 8s cât timp căutarea
  // e activă (nu WebSocket — inutil de complex pentru un demo, dar tot actualizează în timp
  // real cât consultantul stă cu pagina deschisă lângă client).
  const loadAgentAssist = useCallback(async (phone: string, silent = false) => {
    if (!phone.trim()) return
    if (!silent) setAssistLoading(true)
    try {
      const r = await fetch(`/api/bt-agent-assist?phone=${encodeURIComponent(phone.trim())}`)
      const j = await r.json()
      setAssist(j)
    } catch {
      setAssist({ found: false, topics: [], objections: [], lastAmount: null, lastMonths: null, gapCount: 0, transcript: [], error: 'Eroare de conexiune.' })
    }
    if (!silent) setAssistLoading(false)
  }, [])

  function searchAgentAssist(e?: React.FormEvent) {
    e?.preventDefault()
    if (!assistPhone.trim()) return
    setAssistActivePhone(assistPhone.trim())
    loadAgentAssist(assistPhone.trim())
  }

  useEffect(() => {
    if (!assistActivePhone || tab !== 'consultant') return
    const id = setInterval(() => loadAgentAssist(assistActivePhone, true), 8000)
    return () => clearInterval(id)
  }, [assistActivePhone, tab, loadAgentAssist])

  function downloadMarketCsv() {
    if (!market) return
    const lines: string[] = []
    lines.push('Raport de piata agregat (anonimizat) — Demo BT')
    lines.push('')
    lines.push('Subiect,Numar mesaje')
    market.topTopics.forEach(t => lines.push(`"${t.label}",${t.count}`))
    lines.push('')
    lines.push('Obiectie,Frecventa')
    market.topObjections.forEach(o => lines.push(`"${o.label}",${o.count}`))
    lines.push('')
    lines.push('Interval suma,Numar cereri')
    market.amountDistribution.forEach(a => lines.push(`"${a.bucket}",${a.count}`))
    lines.push('')
    lines.push('Interval perioada,Numar cereri')
    market.periodDistribution.forEach(p => lines.push(`"${p.bucket}",${p.count}`))
    lines.push('')
    lines.push('Intrebari fara raspuns clar (gap-uri),Context,Data')
    market.gapQuestions.forEach(g => {
      const esc = (s: string) => `"${(s || '').replace(/"/g, '""')}"`
      lines.push(`${esc(g.intrebare)},${esc(g.context)},${esc(g.data)}`)
    })
    const csv = '﻿' + lines.join('\r\n') // BOM pentru diacritice corecte în Excel
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bt-demo-raport-piata-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function downloadCsv() {
    if (!dash) return
    const header = 'Telefon,Context,Mesaj,Data'
    const rows = dash.leads.map(l => {
      const esc = (s: string) => `"${(s || '').replace(/"/g, '""')}"`
      return [esc(l.phone), esc(l.context), esc(l.mesaj), esc(l.data)].join(',')
    })
    const csv = '﻿' + [header, ...rows].join('\r\n') // BOM pentru diacritice corecte în Excel
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bt-demo-leaduri-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function login(e?: React.FormEvent) {
    e?.preventDefault()
    if (!pass.trim() || checking) return
    setChecking(true)
    setAuthErr('')
    try {
      const res = await fetch('/api/bt-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      })
      const json = await res.json()
      if (json.ok) {
        // Parolă corectă și 2FA dezactivat — acces direct.
        await completeLogin()
      } else if (json.twoFactorRequired) {
        // Parolă corectă, dar mai e nevoie de codul din aplicația de autentificare.
        setStage('code')
      } else {
        setAuthErr(json.error || 'Parolă incorectă.')
      }
    } catch {
      setAuthErr('Eroare de conexiune.')
    }
    setChecking(false)
  }

  async function verifyCode(e?: React.FormEvent) {
    e?.preventDefault()
    if (!code.trim() || checking) return
    setChecking(true)
    setCodeErr('')
    try {
      const res = await fetch('/api/bt-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, code: code.trim() }),
      })
      const json = await res.json()
      if (json.ok) {
        await completeLogin()
      } else {
        setCodeErr(json.error || 'Cod incorect.')
      }
    } catch {
      setCodeErr('Eroare de conexiune.')
    }
    setChecking(false)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    try {
      const res = await fetch('/api/bt-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, knowledge: { entries: data.entries, behaviorRules: data.behaviorRules } }),
      })
      const json = await res.json()
      if (json.ok) { setSavedMsg('Salvat! Ana știe imediat.'); setTimeout(() => setSavedMsg(''), 3000) }
      else setSavedMsg('Eroare: ' + json.error)
    } catch {
      setSavedMsg('Eroare de conexiune.')
    }
    setSaving(false)
  }

  function updateEntry(id: string, field: keyof Entry, val: string) {
    setData(d => d ? { ...d, entries: d.entries.map(x => x.id === id ? { ...x, [field]: val } : x) } : d)
  }
  function addEntry() {
    setData(d => d ? { ...d, entries: [{ id: uid(), titlu: '', continut: '' }, ...d.entries] } : d)
  }
  function delEntry(id: string) {
    setData(d => d ? { ...d, entries: d.entries.filter(x => x.id !== id) } : d)
  }

  async function handleFileUpload(file: File) {
    setUploading(true)
    setUploadMsg('')
    try {
      const fd = new FormData()
      fd.append('password', pass)
      fd.append('file', file)
      const res = await fetch('/api/bt-upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || json.error) {
        setUploadMsg('Eroare: ' + (json.error || 'încărcare eșuată'))
      } else {
        setData(d => d ? { ...d, entries: [{ id: uid(), titlu: json.name || file.name, continut: json.extractedText || '' }, ...d.entries] } : d)
        setUploadMsg(`„${json.name}" adăugat ca intrare nouă — verificați conținutul și apăsați „Salvează tot".`)
        setTimeout(() => setUploadMsg(''), 6000)
      }
    } catch {
      setUploadMsg('Eroare de conexiune la încărcare.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function addRule() {
    const text = ruleInput.trim()
    if (!text || !data) return
    setData(d => d ? { ...d, behaviorRules: [{ id: uid(), text }, ...d.behaviorRules] } : d)
    setRuleInput('')
  }
  function delRule(id: string) {
    setData(d => d ? { ...d, behaviorRules: d.behaviorRules.filter(x => x.id !== id) } : d)
  }

  if (!auth && stage === 'password') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', width: '340px', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>🔧</div>
          <h2 style={{ color: '#f1f5f9', textAlign: 'center', marginBottom: '4px', fontSize: '17px' }}>Admin demo BT</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '22px', fontSize: '12px' }}>Pasul 1 din 2 — parolă · Cunoștințe Ana, acces restricționat echipei</p>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label htmlFor="bt-admin-pass" className="sr-only">Parolă admin</label>
            <input id="bt-admin-pass" type="password" placeholder="Parolă admin" aria-label="Parolă admin" aria-invalid={!!authErr} value={pass} onChange={e => setPass(e.target.value)} autoFocus style={inp} />
            {authErr && <div role="alert" style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{authErr}</div>}
            <button type="submit" disabled={checking} style={{ ...btn(), width: '100%' }}>{checking ? 'Se verifică...' : 'Continuă →'}</button>
          </form>
        </div>
      </div>
    )
  }

  if (!auth && stage === 'code') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', width: '360px', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ color: '#f1f5f9', textAlign: 'center', marginBottom: '4px', fontSize: '17px' }}>Verificare în doi pași</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '18px', fontSize: '12px' }}>
            Pasul 2 din 2 — introduceți codul de 6 cifre din aplicația de autentificare (Google Authenticator, Authy etc.)
          </p>
          <form onSubmit={verifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label htmlFor="bt-admin-code" className="sr-only">Cod de verificare în doi pași, 6 cifre</label>
            <input
              id="bt-admin-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              aria-label="Cod de verificare în doi pași, 6 cifre"
              aria-invalid={!!codeErr}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoFocus
              style={{ ...inp, textAlign: 'center', fontSize: '22px', letterSpacing: '6px', fontWeight: 700 }}
            />
            {codeErr && <div role="alert" style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{codeErr}</div>}
            <button type="submit" disabled={checking || code.length !== 6} style={{ ...btn(), width: '100%' }}>{checking ? 'Se verifică...' : 'Confirmă →'}</button>
            <button type="button" onClick={() => { setStage('password'); setCode(''); setCodeErr('') }} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>← Înapoi la parolă</button>
          </form>
          <details style={{ marginTop: '18px', fontSize: '11px', color: '#475569' }}>
            <summary style={{ cursor: 'pointer', color: '#64748b' }}>Nu ați configurat încă aplicația de autentificare?</summary>
            <div style={{ marginTop: '8px', lineHeight: 1.6 }}>
              În aplicația de autentificare (Google Authenticator, Authy, Microsoft Authenticator etc.), alegeți
              „Adaugă cont" → „Introduceți cheia manual" și folosiți cheia de configurare primită separat de la
              administratorul demo-ului. Codul afișat se schimbă la fiecare 30 de secunde.
            </div>
          </details>
        </div>
      </div>
    )
  }

  if (!data) return <div style={{ color: '#fff', padding: 40, background: '#0a1a2a', minHeight: '100vh' }}>Se încarcă...</div>

  const tabStyle = (t: string) => ({
    background: tab === t ? TEAL : 'rgba(255,255,255,0.04)',
    border: `1px solid ${tab === t ? TEAL : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
    fontWeight: tab === t ? 700 : 400, color: tab === t ? '#04141a' : '#64748b',
    cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a1a2a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', maxWidth: '820px', margin: '0 auto 20px' }}>
        <div>
          <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>🔧 Admin demo BT — Ana</h1>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Ultima actualizare: {data.updatedAt.slice(0, 16).replace('T', ' ')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {savedMsg && <span role="status" aria-live="polite" style={{ fontSize: '13px', color: savedMsg.startsWith('Eroare') ? '#ef4444' : '#22c55e' }}>{savedMsg}</span>}
          <button onClick={save} disabled={saving} style={btn(saving ? '#334155' : '#22c55e', false)}>
            {saving ? 'Se salvează...' : '💾 Salvează tot'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.3)', borderRadius: '10px', padding: '10px 16px', marginBottom: '20px', fontSize: '12px', color: '#fcd34d', lineHeight: 1.6 }}>
          ⚠️ Tot ce adăugați aici devine parte din cunoștințele „de încredere" ale Anei — se folosește exact ca
          baza de cunoștințe existentă (nu o înlocuiește). Regulile anti-inventare rămân valabile: dacă adăugați
          o informație greșită, Ana o va prezenta ca fiind reală — verificați ce introduceți.
        </div>

        <div role="tablist" aria-label="Secțiuni admin" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button role="tab" aria-selected={tab === 'dashboard'} id="bt-tab-dashboard" aria-controls="bt-panel-dashboard" style={tabStyle('dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
          <button role="tab" aria-selected={tab === 'piata'} id="bt-tab-piata" aria-controls="bt-panel-piata" style={tabStyle('piata')} onClick={() => setTab('piata')}>📈 Raport de piață</button>
          <button role="tab" aria-selected={tab === 'consultant'} id="bt-tab-consultant" aria-controls="bt-panel-consultant" style={tabStyle('consultant')} onClick={() => setTab('consultant')}>🎧 Agent Assist Live</button>
          <button role="tab" aria-selected={tab === 'cunostinte'} id="bt-tab-cunostinte" aria-controls="bt-panel-cunostinte" style={tabStyle('cunostinte')} onClick={() => setTab('cunostinte')}>Cunoștințe ({data.entries.length})</button>
          <button role="tab" aria-selected={tab === 'comportament'} id="bt-tab-comportament" aria-controls="bt-panel-comportament" style={tabStyle('comportament')} onClick={() => setTab('comportament')}>Personalizare comportament Ana ({data.behaviorRules.length})</button>
        </div>

        {tab === 'consultant' && (
          <div id="bt-panel-consultant" role="tabpanel" aria-labelledby="bt-tab-consultant" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ background: 'rgba(46,168,157,0.08)', border: '1px solid rgba(46,168,157,0.25)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', color: '#7dd3c0', lineHeight: 1.6 }}>
              🎧 Introduceți numărul de telefon al unui lead deja colectat (din pre-calificare) ca să vedeți
              transcriptul complet + un sumar al discuției lui cu Ana. Se actualizează automat la 8 secunde
              cât timp căutarea e activă.
            </div>
            <form onSubmit={searchAgentAssist} style={{ display: 'flex', gap: '8px' }}>
              <label htmlFor="bt-assist-phone" className="sr-only">Telefon lead</label>
              <input
                id="bt-assist-phone"
                value={assistPhone}
                onChange={e => setAssistPhone(e.target.value)}
                placeholder="ex: 0722 123 456"
                aria-label="Telefon lead"
                style={{ ...inp, flex: 1 }}
              />
              <button type="submit" disabled={assistLoading || !assistPhone.trim()} style={btn()}>
                {assistLoading ? 'Se caută...' : '🔍 Caută'}
              </button>
            </form>

            {assist && !assist.found && (
              <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
                {assist.error || 'Niciun lead găsit cu acest telefon în log — verificați numărul sau așteptați să scrie clientul.'}
              </div>
            )}

            {assist && assist.found && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Subiecte discutate</div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.6 }}>{assist.topics.join(', ') || '—'}</div>
                  </div>
                  <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Sumă / perioadă cerută (ultima menționată)</div>
                    <div style={{ fontSize: '13px', color: TEAL, fontWeight: 700 }}>
                      {assist.lastAmount ? `${assist.lastAmount.toLocaleString('ro-RO')} lei` : '—'}
                      {assist.lastMonths ? ` · ${assist.lastMonths} luni` : ''}
                    </div>
                  </div>
                  <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Goluri de informație în discuție</div>
                    <div style={{ fontSize: '13px', color: assist.gapCount > 0 ? '#fcd34d' : '#e2e8f0', fontWeight: 700 }}>{assist.gapCount}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Obiecții ridicate</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {assist.objections.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Nicio obiecție detectată.</span>}
                    {assist.objections.map(o => (
                      <span key={o} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#fca5a5', fontWeight: 600 }}>{o}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Transcript complet ({assist.transcript.length} mesaje)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
                    {assist.transcript.map((m, i) => (
                      <div key={i} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#64748b' }}>{m.context}</span>
                          <span style={{ color: '#64748b' }}>{m.ts.slice(0, 16).replace('T', ' ')}</span>
                        </div>
                        <div style={{ color: '#e2e8f0', marginBottom: m.ana ? '6px' : 0 }}><b style={{ color: TEAL }}>Client:</b> {m.user}</div>
                        {m.ana && <div style={{ color: '#94a3b8' }}><b style={{ color: '#fcd34d' }}>Ana:</b> {m.ana}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'piata' && (
          <div id="bt-panel-piata" role="tabpanel" aria-labelledby="bt-tab-piata" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(46,168,157,0.08)', border: '1px solid rgba(46,168,157,0.25)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', color: '#7dd3c0', lineHeight: 1.6 }}>
              📊 Statistici AGREGATE și ANONIMIZATE, utile pentru bancă — fără nume, telefon sau email individual.
              Separat de tab-ul de leaduri (acolo rămân datele individuale de contact).
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={loadMarketReport} disabled={marketLoading} style={{ ...btn('rgba(255,255,255,0.06)', false), border: '1px solid rgba(255,255,255,0.15)', fontSize: '12px', padding: '6px 12px' }}>
                {marketLoading ? 'Se actualizează...' : '↻ Actualizează'}
              </button>
              <button onClick={downloadMarketCsv} disabled={!market || market.totalMesaje === 0} style={{ ...btn(!market || market.totalMesaje === 0 ? '#334155' : TEAL), fontSize: '12px', padding: '6px 14px' }}>⬇ Descarcă CSV/Excel</button>
            </div>

            {!market && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Se încarcă raportul...</div>}

            {market && (
              <>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Top subiecte/produse căutate</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {market.topTopics.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Încă nu sunt suficiente date.</span>}
                    {market.topTopics.map(t => {
                      const max = Math.max(1, ...market.topTopics.map(x => x.count))
                      return (
                        <div key={t.context} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: '#e2e8f0', width: '180px', flexShrink: 0 }}>{t.label}</span>
                          <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '16px', position: 'relative' }}>
                            <div style={{ width: `${(t.count / max) * 100}%`, height: '100%', background: TEAL, borderRadius: '4px' }} />
                          </div>
                          <span style={{ fontSize: '12px', color: '#64748b', width: '24px', textAlign: 'right' }}>{t.count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Top obiecții/îngrijorări exprimate frecvent</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {market.topObjections.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Nicio obiecție detectată încă.</span>}
                    {market.topObjections.map(o => (
                      <span key={o.label} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#fca5a5', fontWeight: 600 }}>
                        {o.label} <span style={{ color: '#64748b' }}>×{o.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Distribuția sumelor cerute</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {market.amountDistribution.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Fără date încă.</span>}
                      {market.amountDistribution.map(a => (
                        <div key={a.bucket} style={{ display: 'flex', justifyContent: 'space-between', background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
                          <span style={{ color: '#e2e8f0' }}>{a.bucket}</span>
                          <span style={{ color: TEAL, fontWeight: 700 }}>{a.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Distribuția perioadelor cerute</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {market.periodDistribution.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Fără date încă.</span>}
                      {market.periodDistribution.map(p => (
                        <div key={p.bucket} style={{ display: 'flex', justifyContent: 'space-between', background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
                          <span style={{ color: '#e2e8f0' }}>{p.bucket}</span>
                          <span style={{ color: TEAL, fontWeight: 700 }}>{p.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Întrebări la care Ana nu a putut răspunde clar ({market.gapCount})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {market.gapQuestions.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Niciun gol de informație detectat încă.</span>}
                    {market.gapQuestions.slice().reverse().slice(0, 20).map((g, i) => (
                      <div key={i} style={{ background: NAVY, border: '1px solid rgba(252,211,77,0.2)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#fcd34d', fontWeight: 700 }}>{g.context}</span>
                          <span style={{ color: '#64748b' }}>{g.data.slice(0, 16).replace('T', ' ')}</span>
                        </div>
                        <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>{g.intrebare}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'dashboard' && (
          <div id="bt-panel-dashboard" role="tabpanel" aria-labelledby="bt-tab-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={loadDashboard} disabled={dashLoading} style={{ ...btn('rgba(255,255,255,0.06)', false), border: '1px solid rgba(255,255,255,0.15)', fontSize: '12px', padding: '6px 12px' }}>
                {dashLoading ? 'Se actualizează...' : '↻ Actualizează'}
              </button>
            </div>

            {!dash && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Se încarcă datele...</div>}

            {dash && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Total conversații (mesaje)</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9' }}>{dash.total}</div>
                  </div>
                  <div style={{ background: NAVY, border: '1px solid rgba(46,168,157,0.3)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Leaduri colectate (telefon)</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: TEAL }}>{dash.leadsCount}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Activitate — ultimele 14 zile</div>
                  <div style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '110px' }}>
                    {dash.daily.map(d => {
                      const max = Math.max(1, ...dash.daily.map(x => x.count))
                      const h = Math.max(3, Math.round((d.count / max) * 80))
                      return (
                        <div key={d.date} title={`${d.date}: ${d.count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '100%', height: `${h}px`, background: d.count > 0 ? TEAL : 'rgba(255,255,255,0.06)', borderRadius: '3px 3px 0 0' }} />
                          <div style={{ fontSize: '8px', color: '#475569' }}>{d.date.slice(8, 10)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Subiecte frecvente (top 10 cuvinte-cheie)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {dash.topKeywords.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Încă nu sunt suficiente date.</span>}
                    {dash.topKeywords.map(k => (
                      <span key={k.word} style={{ background: 'rgba(46,168,157,0.12)', border: '1px solid rgba(46,168,157,0.3)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: TEAL, fontWeight: 600 }}>
                        {k.word} <span style={{ color: '#64748b' }}>×{k.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Leaduri (telefon din pre-calificare)</div>
                    <button onClick={downloadCsv} disabled={dash.leadsCount === 0} style={{ ...btn(dash.leadsCount === 0 ? '#334155' : TEAL), fontSize: '12px', padding: '6px 14px' }}>⬇ Descarcă CSV</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dash.leads.length === 0 && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Niciun lead colectat încă.</span>}
                    {dash.leads.slice().reverse().slice(0, 30).map((l, i) => (
                      <div key={i} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: TEAL }}>{l.phone}</span>
                          <span style={{ color: '#64748b' }}>{l.data.slice(0, 16).replace('T', ' ')} · {l.context}</span>
                        </div>
                        <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>{l.mesaj}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'cunostinte' && (
          <div id="bt-panel-cunostinte" role="tabpanel" aria-labelledby="bt-tab-cunostinte" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Produse noi, oferte, corecții — orice informație pe care Ana trebuie să o știe instant, fără deploy de cod.
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={addEntry} style={{ ...btn('rgba(255,255,255,0.06)', false), border: '1px solid rgba(255,255,255,0.15)' }}>+ Adaugă intrare (text)</button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ ...btn(uploading ? '#334155' : TEAL), border: 'none' }}
              >
                {uploading ? 'Se procesează...' : '📎 Încarcă fișier (PDF/DOCX/XLSX)'}
              </button>
              <span style={{ fontSize: '11px', color: '#475569' }}>JPEG neacceptat — vezi motiv la încercare</span>
            </div>
            {uploadMsg && (
              <div role="status" aria-live="polite" style={{ fontSize: '12px', color: uploadMsg.startsWith('Eroare') ? '#ef4444' : '#22c55e', background: uploadMsg.startsWith('Eroare') ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${uploadMsg.startsWith('Eroare') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: '8px', padding: '10px 14px', lineHeight: 1.6 }}>
                {uploadMsg}
              </div>
            )}
            {data.entries.map(en => (
              <div key={en.id} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label htmlFor={`bt-entry-titlu-${en.id}`} className="sr-only">Titlu intrare cunoștințe</label>
                  <input id={`bt-entry-titlu-${en.id}`} value={en.titlu} onChange={e => updateEntry(en.id, 'titlu', e.target.value)} placeholder="Titlu (ex: Card XYZ — ofertă nouă)" aria-label="Titlu intrare cunoștințe" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <button onClick={() => delEntry(en.id)} aria-label={`Șterge intrarea „${en.titlu || 'fără titlu'}"`} style={{ ...btn('#ef4444', false), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <label htmlFor={`bt-entry-continut-${en.id}`} className="sr-only">Conținut intrare cunoștințe</label>
                <textarea id={`bt-entry-continut-${en.id}`} value={en.continut} onChange={e => updateEntry(en.id, 'continut', e.target.value)} placeholder="Conținut — ce trebuie să știe Ana exact" aria-label="Conținut intrare cunoștințe" style={ta} />
              </div>
            ))}
            {data.entries.length === 0 && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Nicio intrare încă.</div>}
          </div>
        )}

        {tab === 'comportament' && (
          <div id="bt-panel-comportament" role="tabpanel" aria-labelledby="bt-tab-comportament" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Scrieți instrucțiuni în limbaj natural (ex. „fii mai formală", „menționează mereu dobânda promoțională
              la final", „nu mai vorbi despre cardul X"). Se salvează ca regulă directă, injectată în promptul Anei —
              nu e fine-tuning de model, e configurare de instrucțiuni.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label htmlFor="bt-rule-input" className="sr-only">Regulă nouă de comportament</label>
              <input
                id="bt-rule-input"
                value={ruleInput}
                onChange={e => setRuleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRule()}
                placeholder="Scrieți o regulă de comportament și apăsați Enter…"
                aria-label="Regulă nouă de comportament"
                style={{ ...inp, flex: 1 }}
              />
              <button onClick={addRule} style={btn()}>+ Adaugă regulă</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.behaviorRules.map(r => (
                <div key={r.id} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, lineHeight: 1.5 }}>{r.text}</span>
                  <button onClick={() => delRule(r.id)} aria-label={`Șterge regula: ${r.text}`} style={{ ...btn('#ef4444', false), padding: '5px 9px', flexShrink: 0, fontSize: '11px' }}>✕</button>
                </div>
              ))}
              {data.behaviorRules.length === 0 && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Nicio regulă încă.</div>}
            </div>
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
