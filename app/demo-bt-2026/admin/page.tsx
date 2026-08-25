'use client'
import { useState, useRef } from 'react'

type Entry = { id: string; titlu: string; continut: string }
type Rule = { id: string; text: string }
type Knowledge = { updatedAt: string; entries: Entry[]; behaviorRules: Rule[] }

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
  const [tab, setTab] = useState<'cunostinte' | 'comportament'>('cunostinte')
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
            <input type="password" placeholder="Parolă admin" value={pass} onChange={e => setPass(e.target.value)} autoFocus style={inp} />
            {authErr && <div style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{authErr}</div>}
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
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoFocus
              style={{ ...inp, textAlign: 'center', fontSize: '22px', letterSpacing: '6px', fontWeight: 700 }}
            />
            {codeErr && <div style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{codeErr}</div>}
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
          {savedMsg && <span style={{ fontSize: '13px', color: savedMsg.startsWith('Eroare') ? '#ef4444' : '#22c55e' }}>{savedMsg}</span>}
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

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button style={tabStyle('cunostinte')} onClick={() => setTab('cunostinte')}>Cunoștințe ({data.entries.length})</button>
          <button style={tabStyle('comportament')} onClick={() => setTab('comportament')}>Personalizare comportament Ana ({data.behaviorRules.length})</button>
        </div>

        {tab === 'cunostinte' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <div style={{ fontSize: '12px', color: uploadMsg.startsWith('Eroare') ? '#ef4444' : '#22c55e', background: uploadMsg.startsWith('Eroare') ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${uploadMsg.startsWith('Eroare') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: '8px', padding: '10px 14px', lineHeight: 1.6 }}>
                {uploadMsg}
              </div>
            )}
            {data.entries.map(en => (
              <div key={en.id} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={en.titlu} onChange={e => updateEntry(en.id, 'titlu', e.target.value)} placeholder="Titlu (ex: Card XYZ — ofertă nouă)" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <button onClick={() => delEntry(en.id)} style={{ ...btn('#ef4444', false), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <textarea value={en.continut} onChange={e => updateEntry(en.id, 'continut', e.target.value)} placeholder="Conținut — ce trebuie să știe Ana exact" style={ta} />
              </div>
            ))}
            {data.entries.length === 0 && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Nicio intrare încă.</div>}
          </div>
        )}

        {tab === 'comportament' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Scrieți instrucțiuni în limbaj natural (ex. „fii mai formală", „menționează mereu dobânda promoțională
              la final", „nu mai vorbi despre cardul X"). Se salvează ca regulă directă, injectată în promptul Anei —
              nu e fine-tuning de model, e configurare de instrucțiuni.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={ruleInput}
                onChange={e => setRuleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRule()}
                placeholder="Scrieți o regulă de comportament și apăsați Enter…"
                style={{ ...inp, flex: 1 }}
              />
              <button onClick={addRule} style={btn()}>+ Adaugă regulă</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.behaviorRules.map(r => (
                <div key={r.id} style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#e2e8f0', flex: 1, lineHeight: 1.5 }}>{r.text}</span>
                  <button onClick={() => delRule(r.id)} style={{ ...btn('#ef4444', false), padding: '5px 9px', flexShrink: 0, fontSize: '11px' }}>✕</button>
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
