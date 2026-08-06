'use client'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../hooks/useIsMobile'
import { useEffect, useState } from 'react'
import { getFormareNume, getFormareUserId, getFormareUnitate, getFormareJudet } from '@/lib/formareClient'
import { genereazaCertificat } from '@/lib/certificate'

function getProgress() {
  if (typeof window === 'undefined') return { elearning: 0, autoevaluare: false, evaluare: false }
  try {
    const el = JSON.parse(localStorage.getItem('aracip_elearning_progress') || '{}')
    const done = Object.values(el).filter(Boolean).length
    const total = 6
    return {
      elearning: Math.round((done / total) * 100),
      autoevaluare: !!localStorage.getItem('aracip_autoevaluare_done'),
      evaluare: !!localStorage.getItem('aracip_evaluare_done'),
    }
  } catch { return { elearning: 0, autoevaluare: false, evaluare: false } }
}

export default function FormareLanding() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [progress, setProgress] = useState({ elearning: 0, autoevaluare: false, evaluare: false })
  const [rol, setRol] = useState<'toate' | 'formabil' | 'evaluator'>('toate')
  // Rolul cu care s-a autentificat utilizatorul (sursa de adevăr pentru acces).
  const [authRol, setAuthRol] = useState<'toate' | 'formabil' | 'evaluator'>('formabil')
  const [authState, setAuthState] = useState<'checking' | 'ok'>('checking')

  useEffect(() => {
    // Acces REAL: fără sesiune de Formare → înapoi la /aracip (unde se face login-ul).
    let hasSession = false
    try { hasSession = !!localStorage.getItem('aracip_formare_ok') } catch { /* ignore */ }
    if (!hasSession) { router.replace('/aracip'); return }

    setProgress(getProgress())
    try {
      const saved = localStorage.getItem('aracip_formare_rol')
      if (saved === 'formabil' || saved === 'evaluator' || saved === 'toate') { setRol(saved); setAuthRol(saved) }
    } catch { /* ignore */ }
    setAuthState('ok')
  }, [router])

  function selectRol(r: 'toate' | 'formabil' | 'evaluator') {
    setRol(r)
    try { localStorage.setItem('aracip_formare_rol', r) } catch { /* ignore */ }
  }

  function schimbaRol() {
    try {
      localStorage.removeItem('aracip_formare_ok')
      localStorage.removeItem('aracip_formare_rol')
      localStorage.removeItem('aracip_formare_user')
      localStorage.removeItem('aracip_formare_nume')
      localStorage.removeItem('aracip_formare_unitate')
      localStorage.removeItem('aracip_formare_judet')
      localStorage.removeItem('ara_session')
    } catch { /* ignore */ }
    router.replace('/aracip')
  }

  // Ce module se aplică fiecărui rol (filtru UX, NU securitate)
  const roluri: Record<string, string[]> = {
    toate: ['elearning', 'autoevaluare', 'evaluare'],
    formabil: ['elearning', 'autoevaluare'],   // Activitatea A.2
    evaluator: ['elearning', 'evaluare'],       // Activitatea A.3
  }
  function moduleActiv(id: string) { return roluri[rol].includes(id) }

  const modules = [
    {
      id: 'elearning',
      icon: '🎓',
      badge: 'MODUL 1 · FORMARE PROFESIONALĂ',
      badgeBg: '#1d4ed8', badgeColor: '#bfdbfe',
      title: 'E-Learning',
      subtitle: 'Cursuri Online',
      desc: '6 cursuri interactive despre procedurile ARACIP, standardele de calitate și metodologia de evaluare. Quizuri și certificate de absolvire.',
      btnLabel: progress.elearning > 0 ? `Continuă (${progress.elearning}%)` : 'Începe cursurile →',
      btnBg: '#3b82f6',
      borderColor: '#3b82f6',
      glowBg: 'rgba(59,130,246,0.07)',
      glowHover: 'rgba(59,130,246,0.14)',
      tags: ['6 cursuri', 'Quizuri', 'Certificate'],
      tagBg: 'rgba(59,130,246,0.18)', tagColor: '#93c5fd',
      accent: '#3b82f6',
      route: '/formare/elearning',
      progressVal: progress.elearning,
    },
    {
      id: 'autoevaluare',
      icon: '📋',
      badge: 'MODUL 2 · SIMULARE UNITATE ȘCOLARĂ',
      badgeBg: '#7e22ce', badgeColor: '#e9d5ff',
      title: 'Simulare',
      subtitle: 'Autoevaluare Instituțională',
      desc: 'Exersați completarea Raportului Anual de Evaluare Internă (RAEI) în condiții reale — cei 24 de indicatori din HG 994/2020. Feedback instant și scor de pregătire.',
      btnLabel: progress.autoevaluare ? 'Reluați simularea →' : 'Începe simularea →',
      btnBg: '#a855f7',
      borderColor: '#a855f7',
      glowBg: 'rgba(168,85,247,0.07)',
      glowHover: 'rgba(168,85,247,0.14)',
      tags: ['RAEI complet', 'Feedback', 'Scor pregătire'],
      tagBg: 'rgba(168,85,247,0.18)', tagColor: '#d8b4fe',
      accent: '#a855f7',
      route: '/formare/simulare-autoevaluare',
      progressVal: progress.autoevaluare ? 100 : 0,
    },
    {
      id: 'evaluare',
      icon: '🔍',
      badge: 'MODUL 3 · SIMULARE EVALUATOR EXTERN',
      badgeBg: '#0f766e', badgeColor: '#99f6e4',
      title: 'Simulare',
      subtitle: 'Evaluare Externă',
      desc: 'Experții evaluatori exersează procesul complet conform HG 993/2020 — analiza documentelor, vizita, interviurile și raportul de evaluare externă.',
      btnLabel: progress.evaluare ? 'Reluați simularea →' : 'Intră în simulare →',
      btnBg: '#14b8a6',
      borderColor: '#14b8a6',
      glowBg: 'rgba(20,184,166,0.07)',
      glowHover: 'rgba(20,184,166,0.14)',
      tags: ['Grile reale', 'Vizită virtuală', 'Raport ARACIP'],
      tagBg: 'rgba(20,184,166,0.18)', tagColor: '#5eead4',
      accent: '#14b8a6',
      route: '/formare/simulare-evaluare-externa',
      progressVal: progress.evaluare ? 100 : 0,
    },
  ]

  if (authState === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '14px' }}>
        Se verifică accesul...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '40px 20px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      <button onClick={() => router.push('/aracip')} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', zIndex: 20 }}>← Înapoi</button>

      <button onClick={schimbaRol} style={{ position: 'fixed', top: 20, right: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '8px 16px', color: '#f87171', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', zIndex: 20 }}>Ieși / schimbă rol</button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px', marginTop: isMobile ? '40px' : 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '40px', padding: '8px 20px', marginBottom: '28px',
          fontSize: '13px', color: '#c4b5fd', letterSpacing: '0.5px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          Platformă ARACIP · Aplicație Informatică Suport
        </div>

        <h1 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '18px', letterSpacing: '-1.5px' }}>
          Formare Profesională și<br />
          <span style={{ color: '#a78bfa' }}>Evaluarea Calității în Educație</span>
        </h1>

        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '560px', lineHeight: 1.7, margin: '0 auto' }}>
          Sistem integrat pentru formarea personalului didactic și simularea proceselor de autoevaluare și evaluare externă a celor <strong style={{ color: '#c4b5fd' }}>1.000 de unități de învățământ</strong>.
        </p>
      </div>

      {/* Selector rol — reflectă rolul cu care ești autentificat. Doar sesiunea ARACIP (toate) le deblochează pe toate. */}
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
          {authRol === 'toate' ? 'Alege-ți rolul' : 'Autentificat ca'}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'formabil' as const, label: '🎓 Sunt Formabil' },
            { id: 'evaluator' as const, label: '🔍 Sunt Evaluator extern' },
          ].map(r => {
            const activ = rol === r.id
            // Blocare: dacă nu ai sesiune ARACIP (toate), poți selecta doar rolul tău autentificat.
            const locked = authRol !== 'toate' && r.id !== authRol
            return (
              <button
                key={r.id}
                onClick={() => { if (!locked) selectRol(r.id) }}
                disabled={locked}
                title={locked ? 'Disponibil doar cu autentificarea rolului respectiv' : undefined}
                style={{
                  background: activ ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${activ ? '#a78bfa' : 'rgba(255,255,255,0.12)'}`,
                  color: activ ? '#a78bfa' : '#94a3b8',
                  borderRadius: '30px',
                  padding: isMobile ? '9px 16px' : '10px 22px',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 700,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.35 : 1,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '620px', margin: '16px auto 0', lineHeight: 1.6 }}>
          Formabilii parcurg formarea și exersează autoevaluarea <strong style={{ color: '#a78bfa' }}>(A.2)</strong>. Evaluatorii externi exersează evaluarea externă <strong style={{ color: '#5eead4' }}>(A.3)</strong>. E-Learning-ul este comun ambelor roluri.
        </p>
      </div>

      {/* 3 Module Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '1100px',
        width: '100%',
        marginBottom: '48px',
      }}>
        {modules.map(m => {
          const activ = moduleActiv(m.id)
          return (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            aria-label={`${m.title} — ${m.subtitle}`}
            onClick={() => router.push(m.route)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(m.route) } }}
            style={{
              background: m.glowBg,
              border: `2px solid ${activ ? m.borderColor : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px',
              padding: '40px 32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
              opacity: activ ? 1 : 0.4,
              filter: activ ? 'none' : 'grayscale(0.6)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = m.glowHover
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLDivElement).style.opacity = '1'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = m.glowBg
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLDivElement).style.opacity = activ ? '1' : '0.4'
            }}
          >
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: `${m.accent}18`, borderRadius: '50%' }} />
            <div style={{ fontSize: '52px', marginBottom: '18px' }}>{m.icon}</div>
            <div style={{ display: 'inline-block', background: m.badgeBg, color: m.badgeColor, fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '14px', letterSpacing: '0.5px' }}>
              {m.badge}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{m.title}</h2>
            <div style={{ fontSize: '14px', color: m.badgeColor, fontWeight: 600, marginBottom: '12px' }}>{m.subtitle}</div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px' }}>{m.desc}</p>

            {m.progressVal > 0 && m.progressVal < 100 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Progres</span><span>{m.progressVal}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '4px' }}>
                  <div style={{ background: m.accent, borderRadius: '4px', height: '4px', width: `${m.progressVal}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            )}
            {m.progressVal === 100 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>
                ✓ Completat
              </div>
            )}

            <div style={{ background: m.btnBg, color: '#fff', padding: '13px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, display: 'inline-block', marginBottom: '20px' }}>
              {m.btnLabel}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {m.tags.map(tag => (
                <span key={tag} style={{ background: m.tagBg, color: m.tagColor, fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
              ))}
            </div>
          </div>
          )
        })}
      </div>

      {/* Certificat de participare — disponibil când formarea e finalizată */}
      {(() => {
        const finalizatFormabil = progress.elearning >= 100 || progress.autoevaluare
        const finalizatEvaluator = progress.elearning >= 100 || progress.evaluare
        const eligibil = authRol === 'evaluator' ? finalizatEvaluator
          : authRol === 'formabil' ? finalizatFormabil
          : (finalizatFormabil || finalizatEvaluator)
        if (!eligibil) return null
        const certRol: 'formabil' | 'evaluator' = authRol === 'evaluator' ? 'evaluator' : 'formabil'
        return (
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <button
              onClick={() => genereazaCertificat({
                nume: getFormareNume() || getFormareUserId(),
                rol: certRol,
                unitate: getFormareUnitate() || undefined,
                judet: getFormareJudet() || undefined,
              })}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #14b8a6)', border: 'none', borderRadius: '14px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}
            >
              🎓 Descarcă certificatul de participare
            </button>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>
              Certificat nominal — Activitatea {certRol === 'evaluator' ? 'A.3 (evaluator extern)' : 'A.2 (formabil)'}
            </div>
          </div>
        )
      })()}

      {/* Stats */}
      <div style={{ display: 'flex', gap: isMobile ? '32px' : '56px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { val: '1.000', label: 'Unități Evaluate' },
          { val: '6', label: 'Cursuri E-Learning' },
          { val: '42', label: 'Județe + București' },
          { val: '3 ani', label: 'Suport & Garanție' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa' }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', fontSize: '12px', color: '#334155', textAlign: 'center' }}>
        Proiect cofinanțat din fonduri europene · Activitățile A.2 și A.3 · <strong style={{ color: '#a78bfa' }}>NewTime Concept Solutions S.R.L.</strong>
      </div>
    </div>
  )
}
