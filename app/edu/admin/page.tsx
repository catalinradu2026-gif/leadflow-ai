'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type Modul = {
  id: number
  titlu: string
  descriere: string
  icon: string
  culoare: string
  continut: string
}

export default function EduAdmin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [autentificat, setAutentificat] = useState(false)
  const [modules, setModules] = useState<Modul[]>([])
  const [modulSelectat, setModulSelectat] = useState<Modul | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  async function login() {
    if (!password.trim()) return
    setLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/edu-modules')
      const data = await res.json()
      if (data.modules) {
        setModules(data.modules)
        setAutentificat(true)
      }
    } catch {
      setLoginError('Eroare de conexiune.')
    }
    setLoading(false)
  }

  async function saveAll() {
    if (!modulSelectat) return
    const updated = modules.map(m => m.id === modulSelectat.id ? modulSelectat : m)
    setModules(updated)
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/edu-modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, modules: updated }),
      })
      const data = await res.json()
      if (data.ok) {
        setSaveMsg('✅ Salvat cu succes!')
      } else {
        setSaveMsg(`❌ ${data.error || 'Eroare la salvare'}`)
      }
    } catch {
      setSaveMsg('❌ Eroare de conexiune.')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  if (!autentificat) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px', width: '360px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Admin Cursuri AI</h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Introduceți parola pentru a edita modulele</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Parolă admin..."
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          {loginError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>{loginError}</div>}
          <button
            onClick={login}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#334155' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Se încarcă...' : 'Intră în Admin →'}
          </button>
          <button
            onClick={() => router.push('/edu')}
            style={{ width: '100%', marginTop: '10px', background: 'none', color: '#64748b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', fontSize: '13px', cursor: 'pointer' }}
          >
            ← Înapoi la Edu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '18px' }}>🔐</span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Admin — Editare Module Cursuri AI</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveMsg && <span style={{ fontSize: '13px', fontWeight: 600, color: saveMsg.startsWith('✅') ? '#22c55e' : '#ef4444' }}>{saveMsg}</span>}
          {modulSelectat && (
            <button
              onClick={saveAll}
              disabled={saving}
              style={{ background: saving ? '#334155' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Se salvează...' : '💾 Salvează Modulul'}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar module */}
        <div style={{ width: '280px', background: '#1e293b', borderRight: '1px solid #334155', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #334155', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Module ({modules.length})
          </div>
          {modules.map(m => (
            <div
              key={m.id}
              onClick={() => setModulSelectat({ ...m })}
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                background: modulSelectat?.id === m.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderBottom: '1px solid #334155',
                borderLeft: `3px solid ${modulSelectat?.id === m.id ? m.culoare : 'transparent'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>Săptămâna {m.id}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: modulSelectat?.id === m.id ? '#f1f5f9' : '#94a3b8', lineHeight: 1.3 }}>{m.titlu}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {!modulSelectat ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#334155' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>←</div>
              <div style={{ fontSize: '16px' }}>Selectați un modul din stânga pentru a-l edita</div>
            </div>
          ) : (
            <div style={{ maxWidth: '700px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <span style={{ fontSize: '32px' }}>{modulSelectat.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Săptămâna {modulSelectat.id}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9' }}>Editare Modul</div>
                </div>
              </div>

              {/* Titlu */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Titlu modul
                </label>
                <input
                  value={modulSelectat.titlu}
                  onChange={e => setModulSelectat({ ...modulSelectat, titlu: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '15px', fontWeight: 600, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Descriere */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Descriere scurtă (apare pe card)
                </label>
                <input
                  value={modulSelectat.descriere}
                  onChange={e => setModulSelectat({ ...modulSelectat, descriere: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Conținut lecție */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Conținut lecție — ce predă profesorul AI
                </label>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '4px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', padding: '6px 10px', borderBottom: '1px solid #1e293b' }}>
                    💡 Scrieți fiecare idee pe un rând nou. Profesorul AI va preda interactiv din acest conținut.
                  </div>
                  <textarea
                    value={modulSelectat.continut}
                    onChange={e => setModulSelectat({ ...modulSelectat, continut: e.target.value })}
                    rows={16}
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7, fontFamily: "'Segoe UI', Arial, sans-serif" }}
                    placeholder="Introduceți conținutul lecției...&#10;&#10;Exemplu:&#10;AI înseamnă că un calculator poate face lucruri care necesită inteligență umană.&#10;&#10;AI învață din exemple — dacă i se arată mii de fotografii cu câini, învață să recunoască câini.&#10;&#10;Tipuri de AI: recunoaștere vocală, traducere automată, diagnostic medical."
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  {modulSelectat.continut.length} caractere · {modulSelectat.continut.split('\n').filter(l => l.trim()).length} idei
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: '#0f172a', border: `1px solid ${modulSelectat.culoare}33`, borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview — cum vede elevul</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Săptămâna {modulSelectat.id}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>{modulSelectat.titlu || '—'}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{modulSelectat.descriere || '—'}</div>
              </div>

              <button
                onClick={saveAll}
                disabled={saving}
                style={{ background: saving ? '#334155' : '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', width: '100%' }}
              >
                {saving ? '⏳ Se salvează...' : '💾 Salvează Modulul →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
