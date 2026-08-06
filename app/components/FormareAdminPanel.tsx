'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { JUDETE } from '@/lib/judete'
import { genereazaCertificat } from '@/lib/certificate'

// Panou admin Formare (situația participanților A.2 / A.3), refolosibil:
//  - standalone: /formare/admin
//  - embedded: tab „Formare" din Inspector Național (/demo/inspector)
// Protejat cu parola ADMIN (rol 'admin' via /api/auth/check) → header x-password la /api/formare-admin.

interface Participant {
  userId: string
  nume: string
  email: string
  unitate: string
  judet: string
  rol: string
  progress: number
  moduleTerminate: number
  nrAutoevaluare: number
  nrEvaluare: number
  ultimaActivitate: string | null
}
interface Summary {
  totalFormabili: number
  totalEvaluatori: number
  medieProgres: number
  finalizati: number
  cuRapoarte: number
  total: number
}

const BG = 'linear-gradient(135deg, #060b14 0%, #0f172a 55%, #060b14 100%)'
const CARD_BG = '#0f172a'
const BORDER = 'rgba(255,255,255,0.1)'

function fmtData(iso: string | null): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
  catch { return '—' }
}

/**
 * @param embedded  Când e true, panoul se randează fără fundal full-screen și fără
 *                  butoanele „Înapoi la ARACIP" (potrivit pentru inserare într-un tab).
 * @param initialPassword Parolă pre-completată (ex: dacă gazda e deja autentificată).
 */
export default function FormareAdminPanel({ embedded = false, initialPassword }: { embedded?: boolean; initialPassword?: string } = {}) {
  const router = useRouter()
  const [pass, setPass] = useState(initialPassword || '')
  const [authed, setAuthed] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [loading, setLoading] = useState(false)
  const [persisted, setPersisted] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [summary, setSummary] = useState<Summary>({ totalFormabili: 0, totalEvaluatori: 0, medieProgres: 0, finalizati: 0, cuRapoarte: 0, total: 0 })
  const [dataErr, setDataErr] = useState('')

  const [filtruRol, setFiltruRol] = useState<'toate' | 'formabil' | 'evaluator'>('toate')
  const [filtruJudet, setFiltruJudet] = useState('')
  const [cauta, setCauta] = useState('')
  const [detaliu, setDetaliu] = useState<Participant | null>(null)

  // Auto-login dacă avem o parolă inițială validă (embedded din gazdă autentificată).
  useEffect(() => {
    if (initialPassword && !authed) {
      (async () => {
        try {
          const r = await fetch('/api/auth/check', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'admin', password: initialPassword }),
          })
          const d = await r.json()
          if (d?.ok) { setAuthed(true); loadData(initialPassword) }
        } catch { /* rămâne ecranul de login */ }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPassword])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (loggingIn) return
    setLoggingIn(true); setLoginErr('')
    try {
      const r = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', password: pass }),
      })
      const d = await r.json()
      if (d?.ok) { setAuthed(true); loadData(pass) }
      else { setLoginErr('Parolă incorectă.') }
    } catch { setLoginErr('Eroare de conexiune.') }
    finally { setLoggingIn(false) }
  }

  async function loadData(pwd: string) {
    setLoading(true); setDataErr('')
    try {
      const r = await fetch('/api/formare-admin', { headers: { 'x-password': pwd } })
      if (r.status === 401) { setDataErr('Sesiune neautorizată.'); setLoading(false); return }
      const d = await r.json()
      setParticipants(d.participants || [])
      setSummary(d.summary || summary)
      setPersisted(d.persisted !== false)
    } catch { setDataErr('Nu s-au putut încărca datele.') }
    finally { setLoading(false) }
  }

  const filtrati = useMemo(() => {
    const q = cauta.trim().toLowerCase()
    return participants.filter(p => {
      if (filtruRol !== 'toate' && p.rol !== filtruRol) return false
      if (filtruJudet && p.judet !== filtruJudet) return false
      if (q && !(`${p.nume} ${p.email}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [participants, filtruRol, filtruJudet, cauta])

  const judeteExistente = useMemo(() => {
    const set = new Set(participants.map(p => p.judet).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ro'))
  }, [participants])

  function descarcaCertificat(p: Participant) {
    genereazaCertificat({
      nume: p.nume || p.email,
      rol: p.rol === 'evaluator' ? 'evaluator' : 'formabil',
      unitate: p.unitate || undefined,
      judet: p.judet || undefined,
    })
  }

  function today(): string { return new Date().toISOString().slice(0, 10) }

  async function exportExcel() {
    const XLSX = await import('xlsx')
    const rows = filtrati.map(p => ({
      Nume: p.nume,
      Email: p.email,
      Rol: p.rol === 'evaluator' ? 'Evaluator extern (A.3)' : 'Formabil (A.2)',
      Unitate: p.unitate,
      Județ: p.judet,
      'Progres (%)': p.progress,
      'Module terminate': p.moduleTerminate,
      'Rapoarte autoevaluare': p.nrAutoevaluare,
      'Rapoarte evaluare': p.nrEvaluare,
      'Ultima activitate': fmtData(p.ultimaActivitate),
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Formare')
    XLSX.writeFile(wb, `situatie-formare-${today()}.xlsx`)
  }

  async function exportPDF() {
    const { jsPDF } = await import('jspdf')
    const { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } = await import('@/lib/certFont')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    doc.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_B64); doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
    doc.addFileToVFS('Roboto-Bold.ttf', ROBOTO_BOLD_B64); doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')
    const W = doc.internal.pageSize.getWidth()
    const dataStr = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })

    doc.setFont('Roboto', 'bold'); doc.setFontSize(16); doc.setTextColor(124, 58, 237)
    doc.text('ARACIP — Situație formare', 14, 18)
    doc.setFont('Roboto', 'normal'); doc.setFontSize(10); doc.setTextColor(80, 80, 90)
    doc.text(`Generat: ${dataStr}`, 14, 25)

    doc.setFontSize(9.5); doc.setTextColor(40, 40, 50)
    const sm = `Formabili: ${summary.totalFormabili}   Evaluatori: ${summary.totalEvaluatori}   Progres mediu: ${summary.medieProgres}%   Finalizați: ${summary.finalizati}   Cu rapoarte: ${summary.cuRapoarte}   Total: ${summary.total}`
    doc.text(sm, 14, 32)

    const headers = ['Nume', 'Email', 'Rol', 'Unitate', 'Județ', 'Progres', 'Module', 'Rap.', 'Ultima act.']
    const colX = [14, 60, 110, 145, 195, 220, 240, 258, 274]
    let y = 42
    doc.setFont('Roboto', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255)
    doc.setFillColor(124, 58, 237); doc.rect(12, y - 5, W - 24, 7, 'F')
    headers.forEach((h, i) => doc.text(h, colX[i], y))
    y += 7

    doc.setFont('Roboto', 'normal'); doc.setTextColor(30, 30, 40)
    for (const p of filtrati) {
      if (y > 195) { doc.addPage('a4', 'landscape'); y = 20 }
      const rol = p.rol === 'evaluator' ? 'Evaluator A.3' : 'Formabil A.2'
      const rap = `${p.nrAutoevaluare + p.nrEvaluare}`
      const cells = [
        (p.nume || '—').slice(0, 26), (p.email || '—').slice(0, 28), rol,
        (p.unitate || '—').slice(0, 26), (p.judet || '—').slice(0, 12),
        `${p.progress}%`, `${p.moduleTerminate}`, rap, fmtData(p.ultimaActivitate),
      ]
      cells.forEach((c, i) => doc.text(String(c), colX[i], y))
      y += 6
    }
    if (filtrati.length === 0) { doc.setTextColor(120, 120, 130); doc.text('Niciun participant.', 14, y) }
    doc.save(`situatie-formare-${today()}.pdf`)
  }

  // ---- Login screen ----
  if (!authed) {
    return (
      <div style={{ minHeight: embedded ? 'auto' : '100vh', background: embedded ? 'transparent' : BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: embedded ? '30px 20px' : 20, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '40px 44px', width: '100%', maxWidth: 380 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🛡️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Panou administrare Formare</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Introduceți parola de administrator</div>
          </div>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="password" placeholder="Parolă admin" value={pass} autoFocus={!embedded}
              onChange={e => { setPass(e.target.value); setLoginErr('') }}
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${loginErr ? '#ef4444' : BORDER}`, borderRadius: 12, padding: '13px 16px', fontSize: 14, color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
            />
            {loginErr && <div style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
            <button type="submit" disabled={loggingIn} style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, color: '#fff', cursor: loggingIn ? 'wait' : 'pointer', opacity: loggingIn ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loggingIn ? 'Se verifică...' : 'Intră →'}
            </button>
            {!embedded && (
              <button type="button" onClick={() => router.push('/aracip')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 8 }}>
                ← Înapoi la ARACIP
              </button>
            )}
          </form>
        </div>
      </div>
    )
  }

  // ---- Dashboard ----
  const summaryCards = [
    { label: 'Formabili (A.2)', val: summary.totalFormabili, color: '#a78bfa' },
    { label: 'Evaluatori (A.3)', val: summary.totalEvaluatori, color: '#5eead4' },
    { label: 'Progres mediu', val: `${summary.medieProgres}%`, color: '#60a5fa' },
    { label: 'Finalizați (100%)', val: summary.finalizati, color: '#4ade80' },
  ]

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh', background: embedded ? 'transparent' : BG, padding: embedded ? 0 : '28px 20px 60px', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      <div style={{ maxWidth: embedded ? '100%' : 1240, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            {!embedded && (
              <button onClick={() => router.push('/aracip')} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', marginBottom: 12 }}>← Înapoi</button>
            )}
            <h1 style={{ fontSize: embedded ? 20 : 26, fontWeight: 800, color: '#fff', margin: 0 }}>Administrare Formare</h1>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Situația participanților — Activitățile A.2 (formabili) și A.3 (evaluatori externi)</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => loadData(pass)} disabled={loading} style={btn('#334155')}>{loading ? 'Se încarcă...' : '↻ Reîmprospătează'}</button>
            <button onClick={exportExcel} style={btn('#166534')}>⬇ Export Excel</button>
            <button onClick={exportPDF} style={btn('#7c3aed')}>⬇ Export PDF</button>
          </div>
        </div>

        {!persisted && (
          <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#facc15', marginBottom: 20 }}>
            ⚠️ Persistența în cloud nu este configurată (Supabase). Nu există date de afișat.
          </div>
        )}
        {dataErr && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#f87171', marginBottom: 20 }}>{dataErr}</div>
        )}

        {/* Sumar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
          {summaryCards.map(c => (
            <div key={c.label} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: c.color }}>{c.val}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Filtre */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['toate', 'formabil', 'evaluator'] as const).map(r => (
              <button key={r} onClick={() => setFiltruRol(r)} style={{ ...pill(filtruRol === r), textTransform: 'capitalize' }}>
                {r === 'toate' ? 'Toate' : r === 'formabil' ? 'Formabili' : 'Evaluatori'}
              </button>
            ))}
          </div>
          <select value={filtruJudet} onChange={e => setFiltruJudet(e.target.value)} style={selectStyle()}>
            <option value="" style={{ color: '#000' }}>Toate județele</option>
            {(judeteExistente.length ? judeteExistente : JUDETE).map(j => <option key={j} value={j} style={{ color: '#000' }}>{j}</option>)}
          </select>
          <input placeholder="Caută nume / email..." value={cauta} onChange={e => setCauta(e.target.value)} style={{ ...selectStyle(), minWidth: 220 }} />
          <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>{filtrati.length} din {participants.length}</div>
        </div>

        {/* Tabel */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.12)', textAlign: 'left' }}>
                {['Nume', 'Email', 'Rol', 'Unitate', 'Județ', 'Progres', 'Module', 'Rapoarte', 'Ultima activitate', 'Acțiuni'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', color: '#c4b5fd', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrati.map(p => (
                <tr key={p.userId} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={td()}>{p.nume || <span style={{ color: '#475569' }}>—</span>}</td>
                  <td style={{ ...td(), color: '#94a3b8' }}>{p.email}</td>
                  <td style={td()}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12, background: p.rol === 'evaluator' ? 'rgba(20,184,166,0.18)' : 'rgba(167,139,250,0.18)', color: p.rol === 'evaluator' ? '#5eead4' : '#c4b5fd' }}>
                      {p.rol === 'evaluator' ? 'A.3' : 'A.2'}
                    </span>
                  </td>
                  <td style={{ ...td(), color: '#94a3b8', maxWidth: 180 }}>{p.unitate || '—'}</td>
                  <td style={{ ...td(), color: '#94a3b8' }}>{p.judet || '—'}</td>
                  <td style={td()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 6 }}>
                        <div style={{ background: p.progress >= 100 ? '#4ade80' : '#a78bfa', borderRadius: 4, height: 6, width: `${p.progress}%` }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#94a3b8', width: 32 }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ ...td(), textAlign: 'center' }}>{p.moduleTerminate}</td>
                  <td style={{ ...td(), textAlign: 'center' }}>{p.nrAutoevaluare + p.nrEvaluare}</td>
                  <td style={{ ...td(), color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtData(p.ultimaActivitate)}</td>
                  <td style={td()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.progress >= 100 && (
                        <button onClick={() => descarcaCertificat(p)} title="Descarcă certificat" style={miniBtn('#7c3aed')}>Certificat</button>
                      )}
                      <button onClick={() => setDetaliu(p)} style={miniBtn('#334155')}>Detalii</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrati.length === 0 && (
                <tr><td colSpan={10} style={{ padding: 30, textAlign: 'center', color: '#475569' }}>{loading ? 'Se încarcă...' : 'Niciun participant.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalii */}
      {detaliu && (
        <div onClick={() => setDetaliu(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 460 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{detaliu.nume || detaliu.email}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>{detaliu.email}</div>
            {[
              ['Rol', detaliu.rol === 'evaluator' ? 'Evaluator extern (A.3)' : 'Formabil (A.2)'],
              ['Unitate', detaliu.unitate || '—'],
              ['Județ', detaliu.judet || '—'],
              ['Progres E-Learning', `${detaliu.progress}%`],
              ['Module terminate', String(detaliu.moduleTerminate)],
              ['Rapoarte autoevaluare', String(detaliu.nrAutoevaluare)],
              ['Rapoarte evaluare', String(detaliu.nrEvaluare)],
              ['Ultima activitate', fmtData(detaliu.ultimaActivitate)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {detaliu.progress >= 100 && (
                <button onClick={() => descarcaCertificat(detaliu)} style={{ ...btn('#7c3aed'), flex: 1 }}>⬇ Certificat</button>
              )}
              <button onClick={() => setDetaliu(null)} style={{ ...btn('#334155'), flex: 1 }}>Închide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---- style helpers ----
function btn(bg: string): React.CSSProperties {
  return { background: bg, border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }
}
function miniBtn(bg: string): React.CSSProperties {
  return { background: bg, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }
}
function pill(active: boolean): React.CSSProperties {
  return { background: active ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${active ? '#a78bfa' : BORDER}`, color: active ? '#a78bfa' : '#94a3b8', borderRadius: 20, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }
}
function selectStyle(): React.CSSProperties {
  return { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#e2e8f0', outline: 'none', fontFamily: 'inherit' }
}
function td(): React.CSSProperties {
  return { padding: '12px 14px', verticalAlign: 'middle' }
}
