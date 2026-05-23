'use client'
import { useState, useEffect } from 'react'

type AraDoc    = { id: string; titlu: string; continut: string; termen?: string; urgent?: boolean }
type AraModul  = { id: string; titlu: string; url: string; descriere: string }
type AraAnunt  = { id: string; titlu: string; continut: string; activ: boolean }
type AraGeneral= { id: string; titlu: string; continut: string }
type Knowledge = { updatedAt: string; isj: AraDoc[]; module: AraModul[]; anunturi: AraAnunt[]; general: AraGeneral[] }

const PASS = 'ARACIP2026'
const inp  = { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }
const btn  = (c = '#7c3aed') => ({ background: c, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' })
const ta   = { ...inp, minHeight: '80px', resize: 'vertical' as const }

function uid() { return Math.random().toString(36).slice(2) }

export default function AraAdmin() {
  const [pass, setPass]     = useState('')
  const [auth, setAuth]     = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [data, setData]     = useState<Knowledge | null>(null)
  const [tab, setTab]       = useState<'isj' | 'module' | 'anunturi' | 'general'>('isj')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    if (pass !== PASS) { setAuthErr('Parolă incorectă.'); return }
    setLoading(true)
    const res = await fetch('/api/ara-knowledge')
    const json = await res.json()
    setData(json)
    setLoading(false)
    setAuth(true)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    const res = await fetch('/api/ara-knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass, knowledge: data }),
    })
    const json = await res.json()
    setSaving(false)
    if (json.ok) { setSavedMsg('Salvat! ARA știe imediat.'); setTimeout(() => setSavedMsg(''), 3000) }
    else setSavedMsg('Eroare: ' + json.error)
  }

  function updateIsj(id: string, field: keyof AraDoc, val: string | boolean) {
    setData(d => d ? { ...d, isj: d.isj.map(x => x.id === id ? { ...x, [field]: val } : x) } : d)
  }
  function addIsj() {
    setData(d => d ? { ...d, isj: [...d.isj, { id: uid(), titlu: '', continut: '', termen: '', urgent: false }] } : d)
  }
  function delIsj(id: string) {
    setData(d => d ? { ...d, isj: d.isj.filter(x => x.id !== id) } : d)
  }

  function updateModule(id: string, field: keyof AraModul, val: string) {
    setData(d => d ? { ...d, module: d.module.map(x => x.id === id ? { ...x, [field]: val } : x) } : d)
  }
  function addModul() {
    setData(d => d ? { ...d, module: [...d.module, { id: uid(), titlu: '', url: '', descriere: '' }] } : d)
  }
  function delModul(id: string) {
    setData(d => d ? { ...d, module: d.module.filter(x => x.id !== id) } : d)
  }

  function updateAnunt(id: string, field: keyof AraAnunt, val: string | boolean) {
    setData(d => d ? { ...d, anunturi: d.anunturi.map(x => x.id === id ? { ...x, [field]: val } : x) } : d)
  }
  function addAnunt() {
    setData(d => d ? { ...d, anunturi: [...d.anunturi, { id: uid(), titlu: '', continut: '', activ: true }] } : d)
  }
  function delAnunt(id: string) {
    setData(d => d ? { ...d, anunturi: d.anunturi.filter(x => x.id !== id) } : d)
  }

  function updateGeneral(id: string, field: keyof AraGeneral, val: string) {
    setData(d => d ? { ...d, general: d.general.map(x => x.id === id ? { ...x, [field]: val } : x) } : d)
  }
  function addGeneral() {
    setData(d => d ? { ...d, general: [...d.general, { id: uid(), titlu: '', continut: '' }] } : d)
  }
  function delGeneral(id: string) {
    setData(d => d ? { ...d, general: d.general.filter(x => x.id !== id) } : d)
  }

  const tabStyle = (t: string) => ({
    background: tab === t ? '#7c3aed' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${tab === t ? '#7c3aed' : '#334155'}`,
    borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
    fontWeight: tab === t ? 700 : 400, color: tab === t ? '#fff' : '#64748b',
    cursor: 'pointer', fontFamily: 'inherit',
  })

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px', width: '360px' }}>
        <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>🏛️</div>
        <h2 style={{ color: '#f1f5f9', textAlign: 'center', marginBottom: '24px', fontSize: '18px' }}>Admin ARA — Cunoștințe</h2>
        <input type="password" placeholder="Parolă admin" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={{ ...inp, marginBottom: '12px' }} />
        {authErr && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>{authErr}</div>}
        <button onClick={login} style={{ ...btn(), width: '100%' }}>{loading ? 'Se încarcă...' : 'Intră →'}</button>
      </div>
    </div>
  )

  if (!data) return <div style={{ color: '#fff', padding: 40 }}>Se încarcă...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', maxWidth: '900px', margin: '0 auto 24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>🏛️ ARA — Cunoștințe dinamice</h1>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>Ultima actualizare: {data.updatedAt.slice(0, 16).replace('T', ' ')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {savedMsg && <span style={{ fontSize: '13px', color: savedMsg.startsWith('Eroare') ? '#ef4444' : '#22c55e' }}>{savedMsg}</span>}
          <button onClick={save} disabled={saving} style={btn(saving ? '#334155' : '#059669')}>
            {saving ? 'Se salvează...' : '💾 Salvează tot'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={tabStyle('isj')} onClick={() => setTab('isj')}>📄 Documente ISJ ({data.isj.length})</button>
          <button style={tabStyle('module')} onClick={() => setTab('module')}>📚 Module ({data.module.length})</button>
          <button style={tabStyle('anunturi')} onClick={() => setTab('anunturi')}>📢 Anunțuri ({data.anunturi.filter(a => a.activ).length} active)</button>
          <button style={tabStyle('general')} onClick={() => setTab('general')}>ℹ️ General ({data.general.length})</button>
        </div>

        {/* ISJ */}
        {tab === 'isj' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Circulare, proceduri, adrese active de la ISJ. ARA le citează automat.</div>
            {data.isj.map(doc => (
              <div key={doc.id} style={{ background: '#1e293b', border: `1px solid ${doc.urgent ? '#ef444433' : '#334155'}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input value={doc.titlu} onChange={e => updateIsj(doc.id, 'titlu', e.target.value)} placeholder="Titlu document" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ef4444', cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" checked={!!doc.urgent} onChange={e => updateIsj(doc.id, 'urgent', e.target.checked)} /> Urgent
                  </label>
                  <button onClick={() => delIsj(doc.id)} style={{ ...btn('#ef4444'), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <textarea value={doc.continut} onChange={e => updateIsj(doc.id, 'continut', e.target.value)} placeholder="Conținut / detalii" style={ta} />
                <input value={doc.termen || ''} onChange={e => updateIsj(doc.id, 'termen', e.target.value)} placeholder="Termen (ex: 2026-05-25)" style={{ ...inp, width: '220px' }} />
              </div>
            ))}
            <button onClick={addIsj} style={{ ...btn('#334155'), alignSelf: 'flex-start' }}>+ Adaugă document</button>
          </div>
        )}

        {/* Module */}
        {tab === 'module' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Modulele disponibile pe platformă. ARA știe unde să trimită utilizatorul.</div>
            {data.module.map(m => (
              <div key={m.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={m.titlu} onChange={e => updateModule(m.id, 'titlu', e.target.value)} placeholder="Titlu modul" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <input value={m.url} onChange={e => updateModule(m.id, 'url', e.target.value)} placeholder="URL (ex: /edu/bac/matematica)" style={{ ...inp, flex: 1 }} />
                  <button onClick={() => delModul(m.id)} style={{ ...btn('#ef4444'), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <input value={m.descriere} onChange={e => updateModule(m.id, 'descriere', e.target.value)} placeholder="Descriere scurtă" style={inp} />
              </div>
            ))}
            <button onClick={addModul} style={{ ...btn('#334155'), alignSelf: 'flex-start' }}>+ Adaugă modul</button>
          </div>
        )}

        {/* Anunțuri */}
        {tab === 'anunturi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Anunțuri active — ARA le menționează proactiv în orice conversație.</div>
            {data.anunturi.map(a => (
              <div key={a.id} style={{ background: '#1e293b', border: `1px solid ${a.activ ? '#22c55e33' : '#334155'}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input value={a.titlu} onChange={e => updateAnunt(a.id, 'titlu', e.target.value)} placeholder="Titlu anunț" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e', cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" checked={a.activ} onChange={e => updateAnunt(a.id, 'activ', e.target.checked)} /> Activ
                  </label>
                  <button onClick={() => delAnunt(a.id)} style={{ ...btn('#ef4444'), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <textarea value={a.continut} onChange={e => updateAnunt(a.id, 'continut', e.target.value)} placeholder="Textul anunțului" style={ta} />
              </div>
            ))}
            <button onClick={addAnunt} style={{ ...btn('#334155'), alignSelf: 'flex-start' }}>+ Adaugă anunț</button>
          </div>
        )}

        {/* General */}
        {tab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Informații generale despre platformă pe care ARA le știe întotdeauna.</div>
            {data.general.map(g => (
              <div key={g.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={g.titlu} onChange={e => updateGeneral(g.id, 'titlu', e.target.value)} placeholder="Titlu secțiune" style={{ ...inp, flex: 1, fontWeight: 600 }} />
                  <button onClick={() => delGeneral(g.id)} style={{ ...btn('#ef4444'), padding: '6px 10px', flexShrink: 0 }}>✕</button>
                </div>
                <textarea value={g.continut} onChange={e => updateGeneral(g.id, 'continut', e.target.value)} placeholder="Conținut" style={{ ...ta, minHeight: '100px' }} />
              </div>
            ))}
            <button onClick={addGeneral} style={{ ...btn('#334155'), alignSelf: 'flex-start' }}>+ Adaugă secțiune</button>
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
