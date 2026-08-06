'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

const CATEGORII = [
  { id: 'toate', label: 'Toate', icon: '📚' },
  { id: 'autorizare', label: 'Autorizare', icon: '📋' },
  { id: 'acreditare', label: 'Acreditare', icon: '🏅' },
  { id: 'evaluare', label: 'Evaluare Periodică', icon: '🔄' },
  { id: 'standarde', label: 'Standarde', icon: '⚖️' },
  { id: 'proceduri', label: 'Proceduri', icon: '📝' },
]

type Act = { id: number; titlu: string; tip: string; an: number; categorie: string; desc: string; articole: string[]; color: string; link?: string; envigoare?: boolean }

const ACTE: Act[] = [
  {
    id: 1,
    titlu: 'Legea învățământului preuniversitar nr. 198/2023',
    tip: 'Lege',
    an: 2023,
    categorie: 'acreditare',
    envigoare: true,
    desc: 'Cadrul legal general al sistemului de învățământ preuniversitar. Reglementează asigurarea calității în educație și rolul ARACIP (autorizare, acreditare, evaluare externă periodică).',
    articole: ['Art. 233: Domeniile asigurării calității', 'Art. 234: CEAC și RAEI (Raportul Anual de Evaluare Internă)', 'Asigurarea calității și evaluarea externă'],
    link: 'https://lege5.ro/Gratuit/geztqmjtgq2tm/legea-invatamantului-preuniversitar-nr-198-2023',
    color: '#a855f7',
  },
  {
    id: 13,
    titlu: 'HG nr. 993/2020 — Metodologia de evaluare instituțională',
    tip: 'Hotărâre Guvern',
    an: 2020,
    categorie: 'proceduri',
    envigoare: true,
    desc: 'Metodologia de evaluare instituțională în vederea autorizării, acreditării și evaluării periodice a organizațiilor furnizoare de educație. Procedurile se derulează la cerere, pe bază de contract cu ARACIP, și se finalizează prin ordin al ministrului educației (la propunerea ARACIP) sau prin atestat ARACIP.',
    articole: ['Vizite de evaluare de 2–5 zile (autorizare/acreditare/evaluare)', 'Acreditarea se face în două etape succesive', 'Evaluarea periodică cel puțin o dată la 5 ani'],
    link: 'https://aracip.eu',
    color: '#6366f1',
  },
  {
    id: 14,
    titlu: 'HG nr. 994/2020 — Standarde de autorizare, acreditare și evaluare periodică',
    tip: 'Hotărâre Guvern',
    an: 2020,
    categorie: 'standarde',
    envigoare: true,
    desc: 'Standardele naționale de autorizare de funcționare provizorie, de acreditare și de evaluare externă periodică în învățământul preuniversitar (de stat, particular și confesional).',
    articole: ['Anexă: standarde de autorizare de funcționare provizorie', 'Standarde de acreditare instituțională', 'Standarde de evaluare externă periodică'],
    link: 'https://www.cdep.ro/pls/legis/legis_pck.htp_act?ida=171341',
    color: '#3b82f6',
  },
  {
    id: 15,
    titlu: 'HG nr. 631/2022 — Modificarea standardelor (HG 994/2020)',
    tip: 'Hotărâre Guvern',
    an: 2022,
    categorie: 'standarde',
    envigoare: true,
    desc: 'Modifică anexa la HG 994/2020 și aprobă noile standarde ARACIP. Din anul școlar 2022–2023, evaluarea internă și externă se face pe baza celor 24 de indicatori, cu accent pe proces și rezultate, stare de bine, acces la educație și echitate.',
    articole: ['24 de indicatori (I1–I24)', 'Domenii: capacitate instituțională, eficacitate educațională, managementul calității', 'Aplicare din anul școlar 2022–2023'],
    link: 'https://aracip.eu/categorii-documente/standarde-evaluare-periodica',
    color: '#f59e0b',
  },
  {
    id: 16,
    titlu: 'O.M.E. nr. 6072/2023 — Măsuri tranzitorii Legea 198/2023',
    tip: 'Ordin ministerial',
    an: 2023,
    categorie: 'proceduri',
    envigoare: true,
    desc: 'Aprobă calendarul și măsurile tranzitorii de punere în aplicare a Legii învățământului preuniversitar nr. 198/2023, inclusiv pentru activitatea ARACIP până la intrarea completă în vigoare a noilor metodologii.',
    articole: ['Calendarul de aplicare a Legii 198/2023', 'Măsuri tranzitorii pentru evaluarea calității', 'Valabilitatea reglementărilor aflate în vigoare la 1 septembrie 2023'],
    link: 'https://legislatie.just.ro/Public/DetaliiDocument/274193',
    color: '#14b8a6',
  },
  {
    id: 17,
    titlu: 'Instrucțiunile ARACIP (1–3/2022)',
    tip: 'Decizie ARACIP',
    an: 2022,
    categorie: 'proceduri',
    envigoare: true,
    desc: 'Instrucțiuni de aplicare unitară a standardelor și a metodologiei de evaluare — completarea RAEI, aplicarea indicatorilor și pregătirea dosarelor de autorizare / acreditare / evaluare periodică.',
    articole: ['Aplicarea unitară a celor 24 de indicatori', 'Completarea RAEI (Raportul Anual de Evaluare Internă)', 'Documentele dosarului de evaluare externă'],
    link: 'https://aracip.eu',
    color: '#22c55e',
  },
  {
    id: 2,
    titlu: 'OUG nr. 75/2005 privind asigurarea calității în educație',
    tip: 'Ordonanță',
    an: 2005,
    categorie: 'acreditare',
    desc: 'Actul fondator al ARACIP. Definește metodologia de evaluare, structura organizatorică și atribuțiile agenției.',
    articole: ['Art. 10: Constituirea ARACIP', 'Art. 14-22: Proceduri de autorizare și acreditare', 'Art. 25: Registrul Național'],
    color: '#6366f1',
  },
  {
    id: 3,
    titlu: 'HG nr. 21/2007 — Standarde de autorizare (istoric)',
    tip: 'Hotărâre Guvern',
    an: 2007,
    categorie: 'autorizare',
    desc: 'Standardele de autorizare de funcționare provizorie. ISTORIC — înlocuit de HG nr. 994/2020 (modificată prin HG 631/2022). Se folosesc standardele în vigoare (994/2020).',
    articole: ['Anexa 1: Standarde capacitate instituțională', 'Anexa 2: Indicatori minimali', 'Anexa 3: Fișa de autoevaluare'],
    color: '#3b82f6',
  },
  {
    id: 4,
    titlu: 'HG nr. 22/2007 — Standarde de acreditare (istoric)',
    tip: 'Hotărâre Guvern',
    an: 2007,
    categorie: 'acreditare',
    desc: 'Standardele de acreditare și de evaluare periodică. ISTORIC — înlocuit de HG nr. 994/2020 (modificată prin HG 631/2022), care introduce cei 24 de indicatori actuali.',
    articole: ['A1: Capacitate instituțională (15 standarde)', 'A2: Eficacitate educațională (12 standarde)', 'A3: Managementul calității (8 standarde)'],
    color: '#a855f7',
  },
  {
    id: 5,
    titlu: 'Ordinul MEN nr. 4496/2015 — Regulament ARACIP',
    tip: 'Ordin ministerial',
    an: 2015,
    categorie: 'proceduri',
    desc: 'Regulamentul de organizare și funcționare al ARACIP. Detaliază procedurile de lucru, componența comisiilor și termenele legale.',
    articole: ['Cap. II: Organizare internă', 'Cap. III: Procedura de autorizare (30-60 zile)', 'Cap. IV: Procedura de acreditare'],
    color: '#14b8a6',
  },
  {
    id: 6,
    titlu: 'Ordinul MEN nr. 5547/2011 — Metodologie evaluare periodică',
    tip: 'Ordin ministerial',
    an: 2011,
    categorie: 'evaluare',
    desc: 'Metodologia de evaluare externă periodică a unităților de învățământ preuniversitar. Ciclul de 5 ani, proceduri și calificative.',
    articole: ['Art. 3-8: Planificarea vizitelor', 'Art. 12: Calificative (Excelent/Bine/Satisfăcător/Nesatisfăcător)', 'Art. 20: Contestații'],
    color: '#14b8a6',
  },
  {
    id: 7,
    titlu: 'Ordinul MEC nr. 3165/2020 — Standarde specifice',
    tip: 'Ordin ministerial',
    an: 2020,
    categorie: 'standarde',
    desc: 'Standarde specifice pentru diferitele niveluri și forme de învățământ: grădiniță, primar, gimnaziu, liceu, vocațional.',
    articole: ['Anexa 1: Grădiniță și educație timpurie', 'Anexa 2: Primar și gimnaziu', 'Anexa 3: Liceu și școli profesionale'],
    color: '#f59e0b',
  },
  {
    id: 8,
    titlu: 'HG nr. 1418/2006 — Metodologie cadru ARACIP',
    tip: 'Hotărâre Guvern',
    an: 2006,
    categorie: 'proceduri',
    desc: 'Metodologia-cadru de evaluare și acreditare a unităților de învățământ preuniversitar. Definește tipurile de evaluare și documentele obligatorii.',
    articole: ['Art. 5: Raportul de autoevaluare', 'Art. 8-12: Vizita comisiei ARACIP', 'Art. 15: Deliberare și decizie'],
    color: '#6366f1',
  },
  {
    id: 9,
    titlu: 'Ordin MECTS nr. 6143/2011 — Evaluarea cadrelor didactice',
    tip: 'Ordin ministerial',
    an: 2011,
    categorie: 'standarde',
    desc: 'Metodologia de evaluare anuală a activității personalului didactic. Relevantă pentru dosarul de acreditare — portofolii și fișe de post.',
    articole: ['Art. 3: Fișa de autoevaluare cadru didactic', 'Art. 7: Criterii de performanță', 'Anexa: Fișă evaluare model'],
    color: '#f59e0b',
  },
  {
    id: 10,
    titlu: 'Legea nr. 87/2006 — Calitatea în educație',
    tip: 'Lege',
    an: 2006,
    categorie: 'acreditare',
    desc: 'Legea care a aprobat OUG 75/2005 și a consolidat cadrul legal al ARACIP. Definește principiile asigurării calității în sistemul național.',
    articole: ['Art. 1-5: Principii generale', 'Art. 10: Tipuri de evaluare externă', 'Art. 15: Registrul Național al Unităților Acreditate'],
    color: '#6366f1',
  },
  {
    id: 11,
    titlu: 'Ordinul MEN nr. 4431/2014 — Educație timpurie',
    tip: 'Ordin ministerial',
    an: 2014,
    categorie: 'autorizare',
    desc: 'Reglementări specifice pentru autorizarea și funcționarea unităților de educație timpurie antepreșcolară (0-3 ani).',
    articole: ['Art. 4: Standarde spații (2 mp/copil)', 'Art. 8: Personal calificat obligatoriu', 'Art. 12: Autorizare sanitară specială'],
    color: '#3b82f6',
  },
  {
    id: 12,
    titlu: 'Decizia ARACIP nr. 1/2023 — Ghid autoevaluare',
    tip: 'Decizie ARACIP',
    an: 2023,
    categorie: 'proceduri',
    desc: 'Ghidul actualizat pentru completarea raportului de autoevaluare. Include instrucțiuni detaliate pentru fiecare standard și indicator.',
    articole: ['Cap. 1: Structura raportului', 'Cap. 2: Completarea indicatorilor A1-A3', 'Anexa: Exemple bune practici'],
    color: '#22c55e',
  },
]

const TIP_COLORS: Record<string, string> = {
  'Lege': '#a855f7',
  'Ordonanță': '#6366f1',
  'Hotărâre Guvern': '#3b82f6',
  'Ordin ministerial': '#14b8a6',
  'Decizie ARACIP': '#22c55e',
}

export default function Legislatie() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [categorie, setCategorie] = useState('toate')
  const [cautare, setCautare] = useState('')
  const [expandat, setExpandat] = useState<number | null>(null)

  const acte = ACTE.filter(a => {
    const matchCat = categorie === 'toate' || a.categorie === categorie
    const matchCautare = a.titlu.toLowerCase().includes(cautare.toLowerCase()) || a.desc.toLowerCase().includes(cautare.toLowerCase())
    return matchCat && matchCautare
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span>⚖️</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Legislație ARACIP</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Acte normative centralizate · actualizate</div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '16px' : '28px 24px' }}>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            placeholder="🔍 Caută în legislație..."
            value={cautare}
            onChange={e => setCautare(e.target.value)}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', color: '#e2e8f0', outline: 'none', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* Categorii */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {CATEGORII.map(c => (
            <button
              key={c.id}
              onClick={() => setCategorie(c.id)}
              style={{
                background: categorie === c.id ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${categorie === c.id ? '#a78bfa' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: categorie === c.id ? 700 : 400,
                color: categorie === c.id ? '#a78bfa' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569', alignSelf: 'center' }}>{acte.length} acte</span>
        </div>

        {/* Lista acte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {acte.map(act => (
            <div
              key={act.id}
              style={{
                background: expandat === act.id ? `${act.color}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${expandat === act.id ? act.color + '33' : 'rgba(255,255,255,0.06)'}`,
                borderLeft: `3px solid ${act.color}`,
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              <div
                onClick={() => setExpandat(expandat === act.id ? null : act.id)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ background: `${TIP_COLORS[act.tip]}18`, color: TIP_COLORS[act.tip], fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>{act.tip}</span>
                    <span style={{ fontSize: '11px', color: '#475569' }}>{act.an}</span>
                    {act.envigoare && <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', letterSpacing: '0.3px' }}>● ÎN VIGOARE</span>}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>{act.titlu}</div>
                  {expandat !== act.id && (
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.desc}</div>
                  )}
                </div>
                <span style={{ color: '#475569', fontSize: '12px', flexShrink: 0 }}>{expandat === act.id ? '▲' : '▼'}</span>
              </div>

              {expandat === act.id && (
                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${act.color}22` }}>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginTop: '12px', marginBottom: '12px' }}>{act.desc}</p>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Articole cheie</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {act.articole.map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                        <span style={{ color: act.color, flexShrink: 0 }}>›</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                  {act.link && (
                    <a href={act.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', background: `${act.color}18`, border: `1px solid ${act.color}44`, color: act.color, borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                      🔗 Vezi textul oficial
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {acte.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>Niciun act găsit.</div>
        )}

        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '10px', fontSize: '12px', color: '#64748b' }}>
          ℹ️ Legislația este actualizată de echipa ARACIP. Pentru versiunile oficiale și consolidate, consultați <strong style={{ color: '#a78bfa' }}>legislatie.just.ro</strong> sau <strong style={{ color: '#a78bfa' }}>aracip.eu/legislatie</strong>.
        </div>
      </div>
    </div>
  )
}
