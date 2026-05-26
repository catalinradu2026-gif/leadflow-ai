'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'
import { useEffect, useState } from 'react'

// Parolele NU mai sunt hardcoded client-side. Verificarea se face server-side via /api/auth/check.
// Parola pentru upload este transmisă temporar la apelurile POST/PATCH/DELETE (server o validează).
const LOGIN_EMAIL = 'contact@aicraiova.ro'

export default function AracipHome() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [modalCard, setModalCard] = useState<{ route: string; title: string } | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [parola, setParola] = useState('')
  const [parolaErr, setParolaErr] = useState(false)

  // Management panel state
  const [showMgmt, setShowMgmt] = useState(false)
  const [mgmtPassInput, setMgmtPassInput] = useState('')
  const [mgmtPassOk, setMgmtPassOk] = useState(false)
  const [mgmtPassErr, setMgmtPassErr] = useState(false)
  // Parola este reținută DOAR în memorie după validarea server-side; nu se persistă.
  const [mgmtPass, setMgmtPass] = useState('')
  const [mgmtView, setMgmtView] = useState<'list' | 'add' | 'edit'>('list')
  const [mgmtDocs, setMgmtDocs] = useState<any[]>([])
  const [mgmtLoading, setMgmtLoading] = useState(false)
  const [editDoc, setEditDoc] = useState<any | null>(null)
  // Form fields (shared for add/edit)
  const [fTitle, setFTitle] = useState('')
  const [fTip, setFTip] = useState('Metodologie')
  const [fContent, setFContent] = useState('')
  const [fNr, setFNr] = useState('')
  const [fTermen, setFTermen] = useState('')
  const [fUrgent, setFUrgent] = useState(false)
  const [fPdfFile, setFPdfFile] = useState<File | null>(null)
  const [fPdfUrl, setFPdfUrl] = useState('')
  const [fPdfUploading, setFPdfUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [expandedReaders, setExpandedReaders] = useState<string | null>(null)

  function openMgmt() { setShowMgmt(true); setMgmtPassInput(''); setMgmtPassOk(false); setMgmtPassErr(false); setMgmtPass('') }
  function closeMgmt() { setShowMgmt(false); setMgmtPassOk(false); setMgmtView('list'); setMgmtPass('') }

  async function checkMgmtPass(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'aracip-admin', password: mgmtPassInput })
      })
      const data = await res.json()
      if (data?.ok) {
        setMgmtPassOk(true); setMgmtPassErr(false); setMgmtPass(mgmtPassInput)
        try { localStorage.setItem('ara_aracip_admin_ok', '1') } catch (e) { console.error('[aracip storage]', e) }
        loadDocs()
      } else {
        setMgmtPassErr(true); setMgmtPassInput('')
      }
    } catch (e) {
      console.error('[aracip checkMgmtPass]', e)
      setMgmtPassErr(true); setMgmtPassInput('')
    }
  }

  async function loadDocs() {
    setMgmtLoading(true)
    try {
      const res = await fetch('/api/documents')
      const data = await res.json()
      setMgmtDocs(data.documents || [])
    } catch (e) { console.error('[aracip loadDocs]', e) }
    setMgmtLoading(false)
  }

  function clearForm() { setFTitle(''); setFTip('Metodologie'); setFContent(''); setFNr(''); setFTermen(''); setFUrgent(false); setFPdfFile(null); setFPdfUrl('') }

  function startAdd() { clearForm(); setEditDoc(null); setMgmtView('add'); setSaveMsg('') }
  function startEdit(doc: any) {
    setFTitle(doc.titlu); setFTip(doc.tip); setFContent(doc.continut || ''); setFNr(doc.nr || '')
    setFTermen(doc.termen || ''); setFUrgent(doc.urgent || false); setFPdfUrl(doc.pdfUrl || ''); setFPdfFile(null)
    setEditDoc(doc); setMgmtView('edit'); setSaveMsg('')
  }

  async function uploadPdf() {
    if (!fPdfFile) return
    setFPdfUploading(true)
    try {
      const fd = new FormData()
      fd.append('password', mgmtPass)
      fd.append('file', fPdfFile)
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setFPdfUrl(data.url)
      if (data.extractedText && !fContent.trim()) setFContent(data.extractedText)
    } catch (e) { console.error('[aracip uploadPdf]', e) }
    setFPdfUploading(false)
  }

  async function handleSave() {
    if (!fTitle.trim()) { setSaveMsg('Titlul este obligatoriu.'); return }
    setSaving(true); setSaveMsg('')
    try {
      if (mgmtView === 'add') {
        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: mgmtPass,
            document: {
              titlu: fTitle, tip: fTip, sursa: 'ARACIP', sursa_tip: 'aracip', judet: 'national',
              termen: fTermen || undefined, urgent: fUrgent, continut: fContent || fTitle,
              destinatari: 'Toate ISJ-urile din România', nr: fNr || undefined,
              pdfUrl: fPdfUrl || undefined,
              tipUnitate: 'Toate',
            }
          })
        })
        const data = await res.json()
        if (data.ok) { setSaveMsg('✅ Salvat! ARA a indexat documentul.'); await loadDocs(); setTimeout(() => { setMgmtView('list'); setSaveMsg('') }, 1500) }
        else setSaveMsg('❌ Eroare: ' + (data.error || 'necunoscută'))
      } else if (mgmtView === 'edit' && editDoc) {
        const res = await fetch('/api/documents', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: mgmtPass, id: editDoc.id,
            updates: { titlu: fTitle, tip: fTip, continut: fContent, nr: fNr || undefined, termen: fTermen || undefined, urgent: fUrgent, pdfUrl: fPdfUrl || undefined }
          })
        })
        const data = await res.json()
        if (data.ok) { setSaveMsg('✅ Actualizat!'); await loadDocs(); setTimeout(() => { setMgmtView('list'); setSaveMsg('') }, 1500) }
        else setSaveMsg('❌ Eroare: ' + (data.error || 'necunoscută'))
      }
    } catch (err: any) { setSaveMsg('❌ Eroare rețea: ' + err.message) }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleteConfirmId(null)
    try {
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: mgmtPass, id })
      })
      const data = await res.json()
      if (data.ok) await loadDocs()
      else setSaveMsg('❌ Eroare ștergere: ' + (data.error || 'necunoscută'))
    } catch (e) { console.error('[aracip handleDelete]', e) }
  }

  useEffect(() => { setMounted(true) }, [])

  function handleCardClick(card: { securizat?: boolean; route: string; title: string }) {
    if (card.securizat) {
      setModalCard({ route: card.route, title: card.title })
      setLoginEmail('')
      setParola('')
      setParolaErr(false)
    } else {
      router.push(card.route)
    }
  }

  async function submitParola(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'aracip-login', email: loginEmail.trim().toLowerCase(), password: parola })
      })
      const data = await res.json()
      if (data?.ok) {
        try { localStorage.setItem('ara_aracip_login_ok', '1') } catch (e) { console.error('[aracip storage]', e) }
        router.push(modalCard!.route)
        setModalCard(null)
      } else {
        setParolaErr(true); setParola('')
      }
    } catch (e) {
      console.error('[aracip submitParola]', e)
      setParolaErr(true); setParola('')
    }
  }

  const cards = [
    {
      id: 'isj',
      icon: '🏫',
      tag: 'Portal ISJ',
      title: 'Portal Inspectorate\n& Directori',
      desc: 'Dashboard centralizat pentru toate unitățile din județ. Raportare, documente și comunicare în timp real.',
      color: '#6366f1',
      colorLight: 'rgba(99,102,241,0.1)',
      colorBorder: 'rgba(99,102,241,0.25)',
      colorHover: 'rgba(99,102,241,0.18)',
      route: '/demo',
    },
    {
      id: 'acreditare',
      icon: '🏅',
      tag: 'Calitate',
      title: 'Autorizare,\nAcreditare & Evaluare',
      nesecurizat: true,
      desc: 'Dosare digitale, vizite comisii ARACIP și evaluare externă periodică — fără hârtii, 100% online.',
      color: '#a855f7',
      colorLight: 'rgba(168,85,247,0.1)',
      colorBorder: 'rgba(168,85,247,0.25)',
      colorHover: 'rgba(168,85,247,0.18)',
      route: '/acreditare',
    },
    {
      id: 'scoala',
      icon: '🏫',
      tag: 'Portal Școală',
      title: 'Portal\nȘcoală',
      desc: 'Director, profesori, diriginți și elevi — tot ce are nevoie o școală într-un singur loc.',
      color: '#0ea5e9',
      colorLight: 'rgba(14,165,233,0.1)',
      colorBorder: 'rgba(14,165,233,0.25)',
      colorHover: 'rgba(14,165,233,0.18)',
      route: '/scoala',
      securizat: true,
    },
    {
      id: 'gradinita',
      icon: '🌈',
      tag: 'Portal Grădiniță',
      title: 'Portal\nGrădiniță',
      desc: 'Director, educatoare și părinți — resurse digitale adaptate pentru unitățile preșcolare.',
      color: '#f43f5e',
      colorLight: 'rgba(244,63,94,0.1)',
      colorBorder: 'rgba(244,63,94,0.25)',
      colorHover: 'rgba(244,63,94,0.18)',
      route: '/gradinita',
      securizat: true,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#f1f5f9',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      {/* Background glow effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <header style={{
          padding: isMobile ? '18px 20px' : '24px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(6,11,20,0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', color: '#475569', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>← Acasă</button>
            <div style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #14b8a6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
            }}>🏛️</div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px', color: '#f1f5f9' }}>ARACIP</div>
              <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '0.3px' }}>PLATFORMĂ DIGITALĂ NAȚIONALĂ</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isMobile && (
              <span style={{ fontSize: '12px', color: '#334155' }}>România · 2026</span>
            )}
            <button
              onClick={openMgmt}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: '10px', padding: '8px 16px',
                fontSize: '13px', color: '#a78bfa', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              📤 {isMobile ? 'Upload' : 'Încarcă Document'}
            </button>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '20px', padding: '6px 14px',
              fontSize: '12px', color: '#22c55e', fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e', animation: mounted ? 'pulse 2s infinite' : 'none' }} />
              {isMobile ? 'Activ' : 'Sistem Activ'}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section style={{
          textAlign: 'center',
          padding: isMobile ? '60px 24px 48px' : '100px 40px 80px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: '40px',
            padding: '8px 20px',
            fontSize: '12px', color: '#c4b5fd',
            fontWeight: 600, letterSpacing: '0.3px',
            marginBottom: '32px',
          }}>
            🇷🇴 Agenția Română de Asigurare a Calității în Învățământul Preuniversitar
          </div>

          <h1 style={{
            fontSize: isMobile ? '38px' : '72px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: isMobile ? '-1.5px' : '-3px',
            marginBottom: '24px',
            ...(isMobile ? { color: '#ffffff' } : {
              background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 70%, #14b8a6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }),
          }}>
            Educație de calitate<br />în era digitală
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '19px',
            color: '#475569',
            maxWidth: '560px',
            lineHeight: 1.75,
            margin: '0 auto 48px',
          }}>
            Platforma națională pentru autorizare, acreditare și evaluare a unităților de învățământ preuniversitar. Zero hârtii, 100% digital.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '48px',
            flexWrap: 'wrap',
            marginBottom: isMobile ? '56px' : '80px',
          }}>
            {[
              { val: '11.500', label: 'Unități școlare' },
              { val: '42', label: 'Județe' },
              { val: '100%', label: 'Digital' },
              { val: '24/7', label: 'Disponibil' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '16px' : '20px',
            maxWidth: '760px',
            margin: '0 auto',
          }}>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card as any)}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isMobile ? card.colorHover : (hovered === card.id ? card.colorHover : card.colorLight),
                  border: `1.5px solid ${isMobile ? card.color : (hovered === card.id ? card.color : card.colorBorder)}`,
                  borderRadius: '24px',
                  padding: isMobile ? '28px 24px' : '36px 32px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transform: isMobile ? 'translateY(-4px)' : (hovered === card.id ? 'translateY(-6px)' : 'translateY(0)'),
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: isMobile
                    ? `0 12px 32px ${card.color}33, 0 4px 0 ${card.color}44`
                    : (hovered === card.id ? `0 20px 48px ${card.color}22` : '0 4px 20px rgba(0,0,0,0.2)'),
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow top-right */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '120px', height: '120px',
                  background: `radial-gradient(ellipse, ${card.color}22, transparent 70%)`,
                  borderRadius: '50%',
                  transition: 'opacity 0.25s',
                  opacity: hovered === card.id ? 1 : 0.5,
                }} />

                {(card as any).securizat && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    borderRadius: '20px', padding: '2px 10px',
                    fontSize: '10px', fontWeight: 800, color: '#ef4444',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    🔒 Securizat
                  </div>
                )}
                {(card as any).nesecurizat && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.35)',
                    borderRadius: '20px', padding: '2px 10px',
                    fontSize: '10px', fontWeight: 800, color: '#22c55e',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    🔓 Nesecurizat
                  </div>
                )}

                <div style={{ fontSize: '40px', marginBottom: '16px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{card.icon}</div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: `${card.color}22`,
                  border: `1px solid ${card.color}44`,
                  borderRadius: '20px', padding: '3px 12px',
                  fontSize: '10px', fontWeight: 800, color: card.color,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  marginBottom: '14px',
                }}>
                  {card.tag}
                </div>

                <div style={{
                  fontSize: isMobile ? '19px' : '21px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  whiteSpace: 'pre-line',
                }}>
                  {card.title}
                </div>

                <div style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}>
                  {card.desc}
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: 700, color: card.color,
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}33`,
                  borderRadius: '10px',
                  padding: '8px 18px',
                  transition: 'all 0.2s',
                }}>
                  Accesează
                  <span style={{
                    display: 'inline-block',
                    transform: hovered === card.id ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features strip */}
        <section style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: isMobile ? '32px 20px' : '40px 56px',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '24px' : '32px',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            {[
              { icon: '🔒', title: 'Securizat GDPR', desc: 'Date stocate pe servere europene' },
              { icon: '⚡', title: 'Timp Real', desc: 'Notificări și alerte instant' },
              { icon: '📄', title: 'Zero Hârtii', desc: 'Toate documentele 100% digital' },
              { icon: '🤖', title: 'AI Integrat', desc: 'Asistent inteligent disponibil 24/7' },
            ].map(f => (
              <div key={f.title}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Despre noi */}
        <section style={{
          padding: isMobile ? '48px 20px' : '72px 56px',
          maxWidth: '860px',
          margin: '0 auto',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: '6px 16px', fontSize: '11px', fontWeight: 700, color: '#a78bfa', letterSpacing: '1px', marginBottom: '16px' }}>DESPRE NOI</div>
            <h2 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, marginBottom: '16px' }}>
              Transparență în Era Digitală
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
              România 2026 — digitalizarea educației nu mai e o viziune, e o realitate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
            {[
              {
                icon: '🤖',
                titlu: 'ARA — Asistentul AI ARACIP',
                text: 'ARA este primul asistent digital vocal specializat pe procedurile ARACIP din România. Răspunde în timp real la întrebări despre autorizare, acreditare și evaluare periodică — disponibil 24/7, în limba română, pe orice dispozitiv.',
              },
              {
                icon: '🧠',
                titlu: 'Inteligență Artificială în Educație',
                text: 'ARA nu este un chatbot obișnuit. Cunoaște legislația ARACIP, standardele A1/A2/A3, procedurile ISJ și programele BAC. Se adaptează contextului fiecărei pagini și ghidează fiecare utilizator exact acolo unde are nevoie.',
              },
              {
                icon: '🏛️',
                titlu: 'Cine este ARACIP',
                text: 'Agenția Română de Asigurare a Calității în Învățământul Preuniversitar este autoritatea națională care evaluează și acreditează unitățile de învățământ din România, garantând dreptul fiecărui copil la o educație de calitate.',
              },
              {
                icon: '🎯',
                titlu: 'Misiunea ARACIP',
                text: 'Evaluarea externă a calității educației în toate cele 11.500 de unități școlare din România — stat și privat, urban și rural — printr-un sistem transparent, obiectiv și bazat pe standarde naționale și europene.',
              },
              {
                icon: '⚖️',
                titlu: 'Cadrul legal',
                text: 'ARACIP funcționează în baza Legii 198/2023 și OUG 75/2005, aplicând standarde de calitate aliniate directivelor europene. Fiecare decizie de acreditare are forță juridică și este publicată în Registrul Național.',
              },
              {
                icon: '🚀',
                titlu: 'ARACIP Digital',
                text: 'Prin această platformă, ARACIP face pasul decisiv spre transparență totală — procese 100% digitale, registre publice în timp real, comunicare directă cu unitățile școlare și acces deschis pentru elevi, părinți și societate.',
              },
            ].map(item => (
              <div key={item.titlu} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '14px',
                padding: '24px',
                transform: isMobile ? 'translateY(-4px)' : undefined,
                boxShadow: isMobile
                  ? '0 12px 32px rgba(124,58,237,0.2), 0 4px 0 rgba(124,58,237,0.35)'
                  : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.25s ease',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{item.titlu}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: isMobile ? '24px 20px 100px' : '28px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🏛️</div>
            <span style={{ fontSize: '12px', color: '#334155' }}>ARACIP · Platformă Digitală · România · 2026</span>
          </div>
          <div style={{ fontSize: '12px', color: '#1e293b' }}>
            Powered by <strong style={{ color: '#7c3aed' }}>AIcraiova</strong>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #22c55e; }
          50% { box-shadow: 0 0 16px #22c55e, 0 0 24px #22c55e44; }
        }
      `}</style>

      {/* Panou Management Documente ARACIP */}
      {showMgmt && (
        <div onClick={closeMgmt} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d1117', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Segoe UI', Arial, sans-serif" }}>

            {/* Header panou */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📋</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9' }}>Documente ARACIP</div>
                  {mgmtPassOk && <div style={{ fontSize: '11px', color: '#64748b' }}>Administrator · {mgmtDocs.length} doc · {mgmtDocs.reduce((s, d) => s + (d.citite ?? 0), 0)} confirmări totale</div>}
                </div>
              </div>
              <button onClick={closeMgmt} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>✕ Închide</button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {!mgmtPassOk ? (
                /* Ecran parolă */
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#f1f5f9' }}>Parolă administrator ARACIP</div>
                  </div>
                  <form onSubmit={checkMgmtPass} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="password" placeholder="Parolă ARACIP" value={mgmtPassInput} onChange={e => { setMgmtPassInput(e.target.value); setMgmtPassErr(false) }} autoFocus
                      style={{ background: mgmtPassErr ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)', border: `1px solid ${mgmtPassErr ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '13px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', width: '100%', boxSizing: 'border-box' as const }} />
                    {mgmtPassErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>Parolă incorectă.</div>}
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Intră →</button>
                  </form>
                </>
              ) : mgmtView === 'list' ? (
                /* Lista documente */
                <>
                  {/* Stats sistem */}
                  {mgmtDocs.length > 0 && (() => {
                    const totalCitiri = mgmtDocs.reduce((s, d) => s + (d.citite ?? 0), 0)
                    const totalDestinatari = mgmtDocs.reduce((s, d) => s + (d.totalDestinatari ?? 0), 0)
                    const allReaders = mgmtDocs.flatMap((d: any) => d.readers || [])
                    const byTip: Record<string, number> = {}
                    allReaders.forEach((r: any) => { if (r.tipScoala) byTip[r.tipScoala] = (byTip[r.tipScoala] || 0) + 1 })
                    const docUrg = mgmtDocs.filter((d: any) => d.urgent).length
                    return (
                      <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#a78bfa', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📊 Dashboard Sistem</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          {[
                            { label: 'Documente', val: mgmtDocs.length, color: '#a78bfa' },
                            { label: 'Urgente', val: docUrg, color: '#f87171' },
                            { label: 'Confirmări', val: totalCitiri, color: '#22c55e' },
                          ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.val}</div>
                              <div style={{ fontSize: '10px', color: '#475569' }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                        {Object.keys(byTip).length > 0 && (
                          <div>
                            <div style={{ fontSize: '10px', color: '#475569', marginBottom: '6px' }}>Confirmări pe tip unitate:</div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {Object.entries(byTip).map(([tip, cnt]) => (
                                <span key={tip} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', color: '#4ade80', fontWeight: 600 }}>{tip}: {cnt}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button type="button" onClick={startAdd} style={{ flex: 1, background: 'rgba(124,58,237,0.15)', border: '1.5px dashed rgba(124,58,237,0.5)', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, color: '#a78bfa', cursor: 'pointer' }}>
                      + Adaugă document nou
                    </button>
                    <button type="button" onClick={loadDocs} disabled={mgmtLoading} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
                      {mgmtLoading ? '...' : '🔄 Reîncarcă'}
                    </button>
                  </div>
                  {mgmtLoading ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Se încarcă...</div>
                  ) : mgmtDocs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Niciun document. Adaugă primul document.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {mgmtDocs.map(doc => (
                        <div key={doc.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                {doc.urgent && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>URGENT</span>}
                                <span style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '10px' }}>{doc.tip}</span>
                                <span style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', fontSize: '10px', padding: '1px 7px', borderRadius: '10px' }}>{doc.sursa_tip?.toUpperCase()}</span>
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.titlu}</div>
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                {new Date(doc.uploadedAt).toLocaleDateString('ro-RO')} {doc.nr ? `· ${doc.nr}` : ''} {doc.pdfUrl ? '· 📎 atașat' : ''}
                              </div>
                              {/* Citite info */}
                              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '11px', color: (doc.citite ?? 0) > 0 ? '#22c55e' : '#475569', fontWeight: 600 }}>
                                  👁 {doc.citite ?? 0} {(doc.citite ?? 0) === 1 ? 'vizualizare' : 'vizualizări'}
                                </span>
                                {(doc.readers?.length ?? 0) > 0 && (
                                  <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); setExpandedReaders(expandedReaders === doc.id ? null : doc.id) }}
                                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', color: '#4ade80', cursor: 'pointer', fontWeight: 600 }}
                                  >
                                    {expandedReaders === doc.id ? '▲ Ascunde' : '▼ Cine a văzut'}
                                  </button>
                                )}
                              </div>
                              {/* Readers list */}
                              {expandedReaders === doc.id && doc.readers?.length > 0 && (
                                <div style={{ marginTop: '8px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {doc.readers.map((r: any, idx: number) => (
                                    <div key={idx} style={{ borderBottom: idx < doc.readers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: idx < doc.readers.length - 1 ? '6px' : 0 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                                        <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{r.name}</span>
                                        <span style={{ color: '#64748b', fontSize: '10px' }}>{new Date(r.la).toLocaleString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>
                                        {r.rol}{r.scoala ? ` · ${r.scoala}` : ''}
                                        {r.tipScoala && <span style={{ marginLeft: '6px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>{r.tipScoala}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              {deleteConfirmId === doc.id ? (
                                <>
                                  <button type="button" onClick={e => { e.stopPropagation(); handleDelete(doc.id) }} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '7px', padding: '6px 10px', fontSize: '11px', color: '#f87171', cursor: 'pointer', fontWeight: 700 }}>Confirm</button>
                                  <button type="button" onClick={e => { e.stopPropagation(); setDeleteConfirmId(null) }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '6px 10px', fontSize: '11px', color: '#94a3b8', cursor: 'pointer' }}>Anulează</button>
                                </>
                              ) : (
                                <>
                                  <button type="button" onClick={e => { e.stopPropagation(); startEdit(doc) }} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}>✏️</button>
                                  <button type="button" onClick={e => { e.stopPropagation(); setDeleteConfirmId(doc.id) }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', color: '#f87171', cursor: 'pointer', fontWeight: 600 }}>🗑️</button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Form adăugare / editare */
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => setMgmtView('list')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>← Înapoi</button>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{mgmtView === 'add' ? '📤 Document nou' : '✏️ Editează document'}</div>
                  </div>

                  {/* Tip */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip document</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['Metodologie', 'Ordin', 'Procedură', 'Circular', 'Adresă'].map(t => (
                        <button key={t} onClick={() => setFTip(t)} style={{ background: fTip === t ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.04)', border: `1px solid ${fTip === t ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`, color: fTip === t ? '#a78bfa' : '#64748b', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  {/* Titlu */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titlu *</label>
                    <input value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="ex: Metodologie evaluare periodică 2026" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>

                  {/* Nr + Termen */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nr. document</label>
                      <input value={fNr} onChange={e => setFNr(e.target.value)} placeholder="ex: 4798/2026" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' as const }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Termen</label>
                      <input value={fTermen} onChange={e => setFTermen(e.target.value)} placeholder="ex: 2026-07-01" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' as const }} />
                    </div>
                  </div>

                  {/* Conținut */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conținut (ARA indexează acest text)</label>
                    <textarea value={fContent} onChange={e => setFContent(e.target.value)} placeholder="Introduceți sau lipiți conținutul documentului..." rows={4} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f1f5f9', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }} />
                  </div>

                  {/* Upload PDF */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📎 Fișier atașat — PDF, Excel, Word, orice format (opțional)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>📂</span>
                        <span style={{ fontSize: '13px', color: fPdfFile ? '#a78bfa' : '#64748b' }}>{fPdfFile ? fPdfFile.name : 'Selectează fișier (PDF, Excel, Word, imagine...)' }</span>
                        <input type="file" accept="*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setFPdfFile(f); setFPdfUrl('') } }} />
                      </label>
                      {fPdfFile && !fPdfUrl && (
                        <button onClick={uploadPdf} disabled={fPdfUploading} style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#a78bfa', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {fPdfUploading ? 'Se urcă...' : '⬆️ Upload'}
                        </button>
                      )}
                      {fPdfUrl && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>✅ Urcat</span>}
                    </div>
                    {fPdfUrl && <div style={{ marginTop: '6px', fontSize: '11px', color: '#475569', wordBreak: 'break-all' }}>URL: {fPdfUrl}</div>}
                  </div>

                  {/* Urgent */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444', cursor: 'pointer', marginBottom: '20px' }}>
                    <input type="checkbox" checked={fUrgent} onChange={e => setFUrgent(e.target.checked)} />
                    🔴 Document urgent
                  </label>

                  {saveMsg && <div style={{ padding: '10px 14px', borderRadius: '8px', background: saveMsg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${saveMsg.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: '13px', color: saveMsg.startsWith('✅') ? '#22c55e' : '#f87171', marginBottom: '16px' }}>{saveMsg}</div>}

                  {saving ? (
                    <div style={{ textAlign: 'center', padding: '14px', color: '#a78bfa', fontSize: '14px' }}>🤖 ARA indexează documentul...</div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setMgmtView('list')} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '10px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                      <button onClick={handleSave} style={{ flex: 2, background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                        {mgmtView === 'add' ? '📤 Publică Național →' : '💾 Salvează modificările →'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal parolă */}
      {modalCard && (
        <div
          onClick={() => setModalCard(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: isMobile ? '28px 20px' : '40px 48px', width: '100%', maxWidth: '380px', fontFamily: "'Segoe UI', Arial, sans-serif" }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Acces restricționat</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>Introduceți parola pentru a accesa secțiunea</div>
            </div>
            <form onSubmit={submitParola} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => { setLoginEmail(e.target.value); setParolaErr(false) }}
                autoFocus
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${parolaErr ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '13px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }}
              />
              <input
                type="password"
                placeholder="Parolă"
                value={parola}
                onChange={e => { setParola(e.target.value); setParolaErr(false) }}
                style={{ background: parolaErr ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)', border: `1px solid ${parolaErr ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '13px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }}
              />
              {parolaErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>Email sau parolă incorectă.</div>}
              <button type="submit" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
                Intră →
              </button>
              <button type="button" onClick={() => setModalCard(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', padding: '8px' }}>
                Anulează
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
