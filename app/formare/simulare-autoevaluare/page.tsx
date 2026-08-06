'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { pushFormareReport } from '@/lib/formareClient'

/**
 * MODUL 2 — Simulare AUTOEVALUARE „în condiții reale".
 * Replică RAEI — Raportul Anual de Evaluare Internă a calității — așa cum este
 * el completat anual de CEAC în platforma https://calitate.aracip.eu, conform:
 *  - Legea învățământului preuniversitar nr. 198/2023, Titlul IV „Asigurarea calității"
 *    (art. 233 — domeniile și criteriile; art. 234 — CEAC și raportul anual de evaluare
 *    internă); a abrogat O.U.G. nr. 75/2005 / Legea nr. 87/2006, fostul act-cadru;
 *  - O.M.E. nr. 6.072/2023 — măsuri tranzitorii care mențin metodologia și standardele;
 *  - H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022 — cei 24 de indicatori
 *    de performanță (aplicabili din anul școlar 2022–2023);
 *  - Instrucțiunilor ARACIP nr. 1–3/2022 — dovezile/documentele pe fiecare indicator.
 * Structura reală a RAEI: Partea I — Informații generale; Partea a II-a — Descrierea
 * activităților de îmbunătățire realizate; Partea a III-a — Nivelul de realizare a
 * indicatorilor de performanță; Partea a IV-a — Planul de îmbunătățire a calității.
 */

// Scala reală a calificativelor (nivelul de realizare al indicatorului).
const CALIFICATIVE = [
  { val: 5, label: 'Excelent', scurt: 'E', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', sens: 'Unitatea a depășit cerințele standardelor de referință, dovedind creativitate și inovație.' },
  { val: 4, label: 'Foarte bine', scurt: 'FB', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', sens: 'Sunt îndeplinite toate cerințele standardelor de referință (de calitate).' },
  { val: 3, label: 'Bine', scurt: 'B', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', sens: 'Este îndeplinită cel puțin o cerință din standardele de referință (de calitate), peste nivelul minim.' },
  { val: 2, label: 'Satisfăcător', scurt: 'S', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', sens: 'Sunt îndeplinite toate cerințele standardelor de acreditare — nivelul minim obligatoriu de calitate.' },
  { val: 1, label: 'Nesatisfăcător', scurt: 'NS', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', sens: 'NU sunt îndeplinite toate cerințele standardelor de acreditare care stabilesc calitatea minimă acceptabilă.' },
]

// Cei 24 de indicatori de performanță — denumirile oficiale din anexa la H.G. nr. 994/2020
// (modificată prin H.G. nr. 631/2022), grupați pe domeniile și criteriile din art. 233 al
// Legii nr. 198/2023. Dovezile provin din Instrucțiunea ARACIP nr. 3/2022.
const DOMENII = [
  {
    domeniu: 'A. Capacitatea instituțională',
    culoare: '#3b82f6',
    criterii: [
      {
        criteriu: 'a) structurile instituționale, administrative și manageriale',
        indicatori: [
          { cod: 'I1', text: 'Existența, structura și conținutul documentelor proiective: planul de dezvoltare și planul managerial', ghid: 'Dovezi (Instrucțiunea ARACIP nr. 3/2022): PDI/PAS (și revizuirile), planul managerial/operațional pentru anul în curs, RAEI pe ultimii 3 ani, raportul anual privind starea și calitatea învățământului.' },
          { cod: 'I2', text: 'Organizarea internă și funcționarea curentă a unității de învățământ', ghid: 'Dovezi: regulamentul intern, schema orară, statul de funcții, deciziile de încadrare/titularizare, fișele de post, pagina web a școlii.' },
          { cod: 'I3', text: 'Existența și funcționarea sistemului de comunicare internă și externă și de gestionare a informației', ghid: 'Dovezi: organigrama, procedura de comunicare internă și externă, registrul de intrări/ieșiri, evidența absolvenților și a tranzitării elevilor între niveluri.' },
          { cod: 'I4', text: 'Asigurarea sănătății și securității tuturor celor implicați în activitatea școlară', ghid: 'Dovezi: contractul cu medicul/asistentul medical, autorizația sanitară de funcționare, autorizația/avizul de securitate la incendiu, analiza chestionarelor de feedback aplicate elevilor.' },
          { cod: 'I5', text: 'Asigurarea serviciilor de orientare și consiliere pentru elevi', ghid: 'Dovezi: acordurile cu entități/ONG-uri și/sau comunitatea locală, documentele consilierului școlar (fără date confidențiale), procedura de colaborare cu CJRAE/CMBRAE.' },
        ],
      },
      {
        criteriu: 'b) baza materială și optimizarea utilizării bazei materiale',
        indicatori: [
          { cod: 'I6', text: 'Caracteristicile, dotarea și utilizarea spațiilor școlare, administrative și auxiliare', ghid: 'Dovezi: planul de școlarizare aprobat, portofoliul unui cadru didactic (model), documentul privind progresul dotării cu bază materială (poate fi parte a PDI).' },
          { cod: 'I7', text: 'Accesibilitatea spațiilor școlare, administrative și auxiliare și a echipamentelor, materialelor, mijloacelor de învățământ și auxiliarelor curriculare', ghid: 'Fără documente obligatorii în platformă — se demonstrează la fața locului: rampe/căi de acces (inclusiv pentru persoane cu dizabilități), accesul elevilor la mijloacele de învățământ, bibliotecă, TIC.' },
        ],
      },
      {
        criteriu: 'c) resursele umane',
        indicatori: [
          { cod: 'I8', text: 'Managementul personalului didactic, de conducere, didactic auxiliar și nedidactic', ghid: 'Dovezi: deciziile de titularizare/încadrare, actele de studii ale cadrelor didactice, extrasul Revisal, fișele de evaluare ale personalului, strategia de dezvoltare profesională.' },
        ],
      },
    ],
  },
  {
    domeniu: 'B. Eficacitate educațională',
    culoare: '#a855f7',
    criterii: [
      {
        criteriu: 'a) conținutul programelor de studiu',
        indicatori: [
          { cod: 'I9', text: 'Definirea și promovarea ofertei educaționale', ghid: 'Dovezi: oferta educațională, planurile remediale pentru copiii vulnerabili, comunicarea rezultatelor către beneficiari (model).' },
          { cod: 'I10', text: 'Proiectarea curriculumului și planificarea activităților de învățare', ghid: 'Dovezi: planificările cadrelor didactice (un model); respectarea planurilor-cadru și a programelor școlare în vigoare.' },
          { cod: 'I11', text: 'Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine', ghid: 'Fără documente obligatorii în platformă — se demonstrează prin activitatea de la clasă: participarea elevilor, metodele folosite, climatul și starea de bine.' },
        ],
      },
      {
        criteriu: 'b) rezultatele învățării',
        indicatori: [
          { cod: 'I12', text: 'Rezultatele obținute (participare școlară, rezultatele învățării și starea de bine)', ghid: 'Dovezi: planificările evaluării, planificarea activităților remediale pentru fiecare elev, analiza progresului fiecărui elev (o clasă), fișa de progres a preșcolarului (nivel preșcolar).' },
        ],
      },
      {
        criteriu: 'c) angajabilitate',
        indicatori: [
          { cod: 'I13', text: 'Urmărirea traiectului școlar și/sau profesional ulterior al absolvenților', ghid: 'Dovezi: procedura de urmărire ulterioară a absolvenților, analiza chestionarelor de feedback adresate absolvenților.' },
        ],
      },
      {
        criteriu: 'd) activitatea financiară a organizației',
        indicatori: [
          { cod: 'I14', text: 'Constituirea bugetului unității de învățământ și execuția bugetară', ghid: 'Dovezi: execuția bugetară, fundamentarea bugetului în corelare cu țintele PDI/PAS.' },
        ],
      },
    ],
  },
  {
    domeniu: 'C. Managementul calității',
    culoare: '#14b8a6',
    criterii: [
      {
        criteriu: 'a) strategii și proceduri pentru asigurarea calității',
        indicatori: [
          { cod: 'I15', text: 'Realizarea autoevaluării instituționale și asigurarea internă a calității conform prevederilor legale', ghid: 'Dovezi: RAEI pe ultimii 3 ani (finalizat în platforma calitate.aracip.eu), funcționarea reală a CEAC.' },
          { cod: 'I16', text: 'Dezvoltarea profesională a personalului', ghid: 'Dovezi: situația cursurilor de formare profesională a personalului, planificarea interasistențelor (dacă se practică).' },
        ],
      },
      {
        criteriu: 'b) proceduri privind inițierea, monitorizarea și revizuirea periodică a programelor și activităților desfășurate',
        indicatori: [
          { cod: 'I17', text: 'Revizuirea ofertei educaționale și a PDI/PAS', ghid: 'Dovezi: oferta educațională revizuită, analiza chestionarelor de feedback, corespondența privind propunerile pentru PDI/PAS.' },
        ],
      },
      {
        criteriu: 'c) proceduri obiective și transparente de evaluare a rezultatelor învățării',
        indicatori: [
          { cod: 'I18', text: 'Optimizarea evaluării rezultatelor învățării', ghid: 'Dovezi: RAEI (ultimii 3 ani), instrumentele proprii de evaluare (dacă e cazul), ritmicitatea și transparența evaluării.' },
        ],
      },
      {
        criteriu: 'd) proceduri de evaluare periodică a calității corpului profesoral',
        indicatori: [
          { cod: 'I19', text: 'Evaluarea calității activității corpului profesoral', ghid: 'Dovezi: planurile individuale de remediere a punctelor slabe ale cadrelor didactice, fișele anuale de evaluare.' },
        ],
      },
      {
        criteriu: 'e) accesibilitatea resurselor adecvate învățării',
        indicatori: [
          { cod: 'I20', text: 'Optimizarea accesului la resursele educaționale', ghid: 'Dovezi: analiza progresului accesului elevilor la mijloace de învățământ și la baza materială, comunicarea cu beneficiarii (model).' },
        ],
      },
      {
        criteriu: 'f) baza de date actualizată sistematic, referitoare la asigurarea internă a calității',
        indicatori: [
          { cod: 'I21', text: 'Constituirea bazei de date a unității de învățământ', ghid: 'Fără documente obligatorii în platformă — se demonstrează prin baza de date internă și concordanța cu datele din SIIIR.' },
        ],
      },
      {
        criteriu: 'g) transparența informațiilor de interes public',
        indicatori: [
          { cod: 'I22', text: 'Asigurarea accesului la oferta educațională a școlii', ghid: 'Fără documente obligatorii în platformă — se demonstrează prin pagina web, avizier și accesul public la informațiile de interes.' },
        ],
      },
      {
        criteriu: 'h) funcționalitatea structurilor de asigurare a calității educației, conform legii',
        indicatori: [
          { cod: 'I23', text: 'Constituirea și funcționarea structurilor responsabile cu evaluarea internă a calității', ghid: 'Dovezi: decizia de înființare a CEAC, regulamentul CEAC, planul operațional/managerial al CEAC (componența CEAC — art. 234 alin. (5) din Legea nr. 198/2023).' },
        ],
      },
      {
        criteriu: 'i) acuratețea raportărilor prevăzute de legislația în vigoare',
        indicatori: [
          { cod: 'I24', text: 'Acuratețea raportărilor prevăzute de legislația în vigoare', ghid: 'Dovezi: raportul anual privind starea și calitatea învățământului (ultimii 3 ani); concordanța dintre datele raportate (RAEI, SIIIR) și realitatea din unitate.' },
        ],
      },
    ],
  },
]

function califByVal(val: number) {
  return CALIFICATIVE.find(c => c.val === val)
}

function labelPunctaj(avg: number): string {
  const r = Math.round(avg)
  return califByVal(Math.min(5, Math.max(1, r)))?.label || '-'
}
function colorPunctaj(avg: number): string {
  const r = Math.round(avg)
  return califByVal(Math.min(5, Math.max(1, r)))?.color || '#64748b'
}

export default function SimulareAutoevaluarePage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<'date' | 'evaluare' | 'rezultat'>('date')
  const [denumire, setDenumire] = useState('')
  const [localitate, setLocalitate] = useState('')
  const [nivel, setNivel] = useState('Liceal')
  const [nrElevi, setNrElevi] = useState('')
  const [anScolar, setAnScolar] = useState('2025–2026')
  const [activitatiRealizate, setActivitatiRealizate] = useState('')
  const [calificative, setCalificative] = useState<Record<string, number>>({})
  const [dovezi, setDovezi] = useState<Record<string, string>>({})

  const toateCoduri = DOMENII.flatMap(d => d.criterii.flatMap(c => c.indicatori.map(i => i.cod)))
  const completate = toateCoduri.filter(cod => calificative[cod] !== undefined).length
  const total = toateCoduri.length

  function setCalif(cod: string, val: number) {
    setCalificative(prev => ({ ...prev, [cod]: val }))
  }

  function calcScor() {
    const vals = Object.values(calificative)
    if (!vals.length) return 0
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }

  function finalizeaza() {
    try { localStorage.setItem('aracip_autoevaluare_done', '1') } catch { /* noop */ }
    // Persistență cloud non-blocantă (fallback localStorage dacă Supabase lipsește).
    try { pushFormareReport('autoevaluare', calcScor(), { denumire, localitate, nivel, anScolar, activitatiRealizate, calificative, dovezi }) } catch { /* noop */ }
    setEtapa('rezultat')
  }

  const bg = '#0f172a'
  const card = 'rgba(255,255,255,0.04)'
  const border = 'rgba(255,255,255,0.08)'

  // ---------- ETAPA 1: PĂRȚILE I–II (informații generale + activități realizate) ----------
  if (etapa === 'date') {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <button onClick={() => router.push('/formare')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginBottom: 32 }}>← Platformă</button>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
            <h1 style={{ fontSize: 27, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Simulare RAEI — Autoevaluare Instituțională</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              Exersați completarea <strong style={{ color: '#c4b5fd' }}>Raportului Anual de Evaluare Internă a calității (RAEI)</strong> exact ca în platforma calitate.aracip.eu — pe cei 24 de indicatori de performanță din H.G. nr. 994/2020 (modificată prin H.G. nr. 631/2022). RAEI este elaborat anual de CEAC și adus la cunoștința beneficiarilor prin afișare sau publicare (art. 234 din Legea nr. 198/2023).
            </p>
          </div>

          {/* Cele 4 părți reale ale RAEI */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Structura reală a RAEI — cele 4 părți</div>
            {[
              { n: 'I', t: 'Informații generale', d: 'Date de identificare a unității și indicatori de structură și context (mediu, niveluri, efective, buget).' },
              { n: 'II', t: 'Descrierea activităților de îmbunătățire a calității realizate', d: 'Activitățile de îmbunătățire derulate în anul școlar analizat și rezultatele lor.' },
              { n: 'III', t: 'Nivelul de realizare a indicatorilor de performanță', d: 'Autoevaluarea pe cei 24 de indicatori, cu calificative de la „Nesatisfăcător" la „Excelent", pe baza dovezilor.' },
              { n: 'IV', t: 'Planul de îmbunătățire a calității', d: 'Activitățile de îmbunătățire planificate pentru anul școlar următor, cu responsabili și termene.' },
            ].map(q => (
              <div key={q.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ background: 'rgba(167,139,250,0.18)', color: '#c4b5fd', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{q.n}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Partea {q.n === 'I' ? 'I' : `a ${q.n}-a`} — {q.t}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{q.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Partea I — Informații generale</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Datele de identificare ale unității pentru care se realizează raportul anual de evaluare internă.</p>

            {[
              { label: 'Denumirea unității de învățământ *', val: denumire, set: setDenumire, placeholder: 'ex: Liceul Teoretic „Mihai Eminescu"' },
              { label: 'Localitate / județ *', val: localitate, set: setLocalitate, placeholder: 'ex: Cluj-Napoca, jud. Cluj' },
              { label: 'Număr de elevi/copii înscriși *', val: nrElevi, set: setNrElevi, placeholder: 'ex: 450' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Nivel de învățământ *</label>
                <select value={nivel} onChange={e => setNivel(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                  {['Antepreșcolar', 'Preșcolar (grădiniță)', 'Primar', 'Gimnazial', 'Liceal', 'Profesional', 'Postliceal'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>An școlar analizat *</label>
                <select value={anScolar} onChange={e => setAnScolar(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                  {['2025–2026', '2024–2025', '2023–2024'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Partea a II-a — Descrierea activităților de îmbunătățire realizate (opțional)</label>
              <textarea value={activitatiRealizate} onChange={e => setActivitatiRealizate(e.target.value)}
                placeholder="ex: derularea programului de activități remediale la matematică; dotarea a două săli de clasă cu table interactive; formarea a 8 cadre didactice în evaluarea centrată pe competențe..."
                rows={3}
                style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} />
            </div>

            <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '16px', marginBottom: 24, fontSize: 13, color: '#c4b5fd', lineHeight: 1.6 }}>
              <strong>ℹ Simulare de antrenament</strong> — Datele introduse nu se transmit către ARACIP și nu au efecte oficiale. Scopul este exersarea completării RAEI conform metodologiei reale.
            </div>

            <button onClick={() => setEtapa('evaluare')} disabled={!denumire || !localitate || !nrElevi}
              style={{ width: '100%', padding: '14px', background: !denumire || !localitate || !nrElevi ? '#1e293b' : '#a855f7', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: !denumire || !localitate || !nrElevi ? 'not-allowed' : 'pointer', opacity: !denumire || !localitate || !nrElevi ? 0.5 : 1 }}>
              Partea a III-a — Nivelul de realizare a indicatorilor →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- ETAPA 2: PARTEA a III-a (autoevaluarea pe cei 24 de indicatori) ----------
  if (etapa === 'evaluare') {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px' }}>
          <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setEtapa('date')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Date</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{denumire}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>RAEI · Partea a III-a — Nivelul de realizare a indicatorilor · {localitate} · {anScolar}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#475569' }}>Indicatori completați</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: completate === total ? '#22c55e' : '#a78bfa' }}>{completate}/{total}</div>
            </div>
          </div>
          <div style={{ maxWidth: 920, margin: '8px auto 0', background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4 }}>
            <div style={{ background: '#a855f7', borderRadius: 4, height: 4, width: `${(completate / total) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 24px' }}>
          {/* Legenda scalei reale */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Scala calificativelor (nivelul de realizare al indicatorului)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CALIFICATIVE.map(c => (
                <div key={c.val} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5 }}>
                  <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}55`, fontWeight: 700, borderRadius: 6, padding: '2px 8px', flexShrink: 0, minWidth: 96, textAlign: 'center' }}>{c.label}</span>
                  <span style={{ color: '#94a3b8', lineHeight: 1.5 }}>{c.sens}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>Nivelul minim obligatoriu (standardele de acreditare) = <strong style={{ color: '#f59e0b' }}>Satisfăcător</strong>. Un calificativ „Nesatisfăcător" impune măsuri de remediere în planul de îmbunătățire (Partea a IV-a).</div>
          </div>

          {DOMENII.map(domeniu => (
            <div key={domeniu.domeniu} style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 4, height: 32, background: domeniu.culoare, borderRadius: 4 }} />
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{domeniu.domeniu}</h2>
              </div>

              {domeniu.criterii.map(criteriu => (
                <div key={criteriu.criteriu} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: domeniu.culoare, marginBottom: 10 }}>Criteriul {criteriu.criteriu}</div>

                  {criteriu.indicatori.map(ind => {
                    const val = calificative[ind.cod]
                    return (
                      <div key={ind.cod} style={{ background: card, border: `1px solid ${val !== undefined ? domeniu.culoare + '44' : border}`, borderRadius: 14, padding: '18px 20px', marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                          <span style={{ background: `${domeniu.culoare}22`, color: domeniu.culoare, fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>{ind.cod}</span>
                          <span style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, fontWeight: 600 }}>{ind.text}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>{ind.ghid}</div>

                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600 }}>Calificativ (nivel de realizare):</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                          {CALIFICATIVE.slice().reverse().map(q => (
                            <button key={q.val} onClick={() => setCalif(ind.cod, q.val)}
                              style={{ padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: val === q.val ? 700 : 400,
                                background: val === q.val ? q.bg : 'rgba(255,255,255,0.04)',
                                border: `2px solid ${val === q.val ? q.color : 'rgba(255,255,255,0.08)'}`,
                                color: val === q.val ? q.color : '#64748b', transition: 'all 0.15s' }}>
                              {q.label}
                            </button>
                          ))}
                        </div>
                        {val !== undefined && (
                          <textarea value={dovezi[ind.cod] || ''} onChange={e => setDovezi(o => ({ ...o, [ind.cod]: e.target.value }))}
                            placeholder="Dovezi și descrierea situației — documente, date, constatări care susțin calificativul acordat..."
                            rows={2}
                            style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}

          <button onClick={finalizeaza} disabled={completate < total}
            style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: completate < total ? 'not-allowed' : 'pointer',
              background: completate < total ? '#1e293b' : '#a855f7', color: '#fff', opacity: completate < total ? 0.5 : 1 }}>
            {completate < total ? `Evaluați toți cei 24 de indicatori (${total - completate} rămași)` : 'Generează RAEI + Partea a IV-a — Planul de îmbunătățire →'}
          </button>
        </div>
      </div>
    )
  }

  // ---------- ETAPA 3: RAPORT RAEI (sinteză + Partea a IV-a) ----------
  const scor = calcScor()
  const dataAzi = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })

  const scorePeDomenii = DOMENII.map(d => {
    const coduri = d.criterii.flatMap(c => c.indicatori.map(i => i.cod))
    const vals = coduri.map(k => calificative[k]).filter(v => v !== undefined)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    const minim = vals.length ? Math.min(...vals) : 0
    return { domeniu: d.domeniu, culoare: d.culoare, avg, minim, label: labelPunctaj(avg), color: colorPunctaj(avg) }
  })

  // Indicatorii sub prag (Nesatisfăcător) — impun măsuri de remediere obligatorii.
  const flatIndicatori = DOMENII.flatMap(d => d.criterii.flatMap(c => c.indicatori.map(i => ({ ...i, domeniu: d.domeniu, culoare: d.culoare }))))
  const nesatisfacatoare = flatIndicatori.filter(i => calificative[i.cod] === 1)
  const doarMinim = flatIndicatori.filter(i => calificative[i.cod] === 2)
  const areNesatisfacator = nesatisfacatoare.length > 0
  const calFinalLabel = areNesatisfacator ? 'Nesatisfăcător' : labelPunctaj(scor)
  const calFinalColor = areNesatisfacator ? '#ef4444' : colorPunctaj(scor)

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Raport Anual de Evaluare Internă a calității</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>RAEI — {anScolar}</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Simulare de formare · generat la {dataAzi}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{denumire}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{localitate} · {nivel} · {nrElevi} elevi/copii</div>

          <div style={{ display: 'inline-block', background: `${calFinalColor}18`, border: `2px solid ${calFinalColor}44`, borderRadius: 16, padding: '20px 36px' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Nivel general de realizare (simulare)</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: calFinalColor }}>{calFinalLabel}</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Media indicatorilor: {scor.toFixed(2)} / 5,00 <span style={{ fontSize: 11 }}>(orientativ)</span></div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, maxWidth: 380 }}>Media este orientativă, pentru autoevaluare. Oficial, ARACIP nu mediază și nu compensează indicatorii — fiecare indicator se apreciază individual, pe descriptori.</div>
            {areNesatisfacator && (
              <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 8, maxWidth: 380 }}>
                Existența a cel puțin unui indicator „Nesatisfăcător" înseamnă neîndeplinirea standardelor de acreditare și impune măsuri de remediere obligatorii în planul de îmbunătățire.
              </div>
            )}
          </div>
        </div>

        {/* Partea a II-a — activități realizate (dacă au fost descrise) */}
        {activitatiRealizate && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Partea a II-a — Activitățile de îmbunătățire realizate</h2>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{activitatiRealizate}</p>
          </div>
        )}

        {/* Partea a III-a — sinteza pe domenii */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Partea a III-a — Nivelul de realizare a indicatorilor (sinteză pe domenii)</h2>
          <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 18 }}>Nivelul de realizare pentru fiecare domeniu (media indicatorilor — orientativ). Domeniile și criteriile sunt cele din anexa la H.G. nr. 994/2020 (în aplicarea art. 233 din Legea nr. 198/2023).</p>
          {scorePeDomenii.map(d => (
            <div key={d.domeniu} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: '#94a3b8' }}>{d.domeniu}</span>
                <span style={{ color: d.color, fontWeight: 700 }}>{d.label} ({d.avg.toFixed(1)})</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6 }}>
                <div style={{ background: d.culoare, borderRadius: 4, height: 6, width: `${(d.avg / 5) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Măsuri de remediere / progres */}
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f87171', marginBottom: 6 }}>Măsuri pentru planul de îmbunătățire</h2>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 16 }}>Măsurile de remediere sunt obligatorii pentru indicatorii evaluați „Nesatisfăcător"; pentru indicatorii „Satisfăcător" se recomandă progresul către standardele de referință.</p>
          {nesatisfacatoare.length === 0 && doarMinim.length === 0 && (
            <div style={{ color: '#86efac', fontSize: 14 }}>Toți indicatorii depășesc nivelul minim al standardelor de acreditare. Se recomandă menținerea și diseminarea bunelor practici.</div>
          )}
          {nesatisfacatoare.map(i => (
            <div key={i.cod} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5 }}>
              <span style={{ color: '#ef4444', flexShrink: 0, fontWeight: 700 }}>‼</span>
              <span><strong style={{ color: '#fca5a5' }}>{i.cod} (Nesatisfăcător):</strong> {i.text}. <em style={{ color: '#64748b' }}>Măsură de remediere obligatorie — se include în planul de îmbunătățire, cu responsabil și termen.</em></span>
            </div>
          ))}
          {doarMinim.map(i => (
            <div key={i.cod} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5 }}>
              <span style={{ color: '#f59e0b', flexShrink: 0 }}>→</span>
              <span><strong style={{ color: '#fbbf24' }}>{i.cod} (Satisfăcător):</strong> {i.text}. <em style={{ color: '#64748b' }}>Recomandare de progres către standardele de referință.</em></span>
            </div>
          ))}
        </div>

        {/* Partea a IV-a — Planul de îmbunătățire */}
        <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 12 }}>Partea a IV-a — Planul de îmbunătățire a calității (anul școlar următor)</h2>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 13.5, lineHeight: 1.7 }}>
            <li>Preluarea măsurilor de remediere și de progres în <strong style={{ color: '#e2e8f0' }}>planul de îmbunătățire a calității</strong>, cu obiective, activități, responsabili, termene și resurse.</li>
            <li>Corelarea planului cu <strong style={{ color: '#e2e8f0' }}>PDI/PAS</strong> și cu bugetul unității (revizuirea — indicatorul I17).</li>
            <li>Monitorizarea implementării de către <strong style={{ color: '#e2e8f0' }}>CEAC</strong> și reluarea autoevaluării în anul școlar următor.</li>
            <li>Finalizarea RAEI în platforma <strong style={{ color: '#e2e8f0' }}>calitate.aracip.eu</strong> și aducerea lui la cunoștința beneficiarilor prin afișare sau publicare (art. 234 din Legea nr. 198/2023).</li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setEtapa('date'); setCalificative({}); setDovezi({}) }} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Reia simularea
          </button>
          <button onClick={() => router.push('/formare')} style={{ flex: 1, padding: '14px', background: '#a855f7', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Înapoi la platformă
          </button>
        </div>
      </div>
    </div>
  )
}
