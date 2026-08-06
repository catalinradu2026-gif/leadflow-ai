'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { pushFormareReport } from '@/lib/formareClient'

/**
 * MODUL 3 (Activitatea A.3 — evaluatori externi) — Simulare EVALUARE EXTERNĂ „în condiții reale".
 * Replică procesul real de evaluare externă periodică desfășurat de ARACIP conform cadrului
 * normativ în vigoare:
 *  - Legea învățământului preuniversitar nr. 198/2023, Titlul IV „Asigurarea calității"
 *    (art. 233 — domeniile și criteriile evaluate; art. 234 — CEAC și raportul anual de
 *    evaluare internă/RAEI); a abrogat O.U.G. nr. 75/2005 / Legea nr. 87/2006, fostul act-cadru;
 *  - O.M.E. nr. 6.072/2023 — măsuri tranzitorii care mențin în aplicare metodologia și
 *    standardele de mai jos până la elaborarea noilor acte de aplicare a Legii nr. 198/2023
 *    (reorganizarea ARACIP → ARACIIP, cu preluarea inspecției, este amânată până la anul
 *    școlar 2026–2027; activitatea continuă sub ARACIP);
 *  - H.G. nr. 993/2020 — Metodologia de evaluare instituțională în vederea autorizării,
 *    acreditării și evaluării periodice a organizațiilor furnizoare de educație;
 *  - H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022 — standardele și cei 24 de
 *    indicatori de performanță (aplicabili din anul școlar 2022–2023);
 *  - Instrucțiunile ARACIP nr. 1–3/2022 — documentele încărcate în platforma
 *    https://calitate.aracip.eu, corelate pe fiecare indicator.
 * Etape reale: (1) analiza documentelor pre-vizită din platformă, (2) vizita cu completarea
 * grilei pe cei 24 de indicatori prin triangulare (calificativ autoevaluare vs. evaluare externă),
 * (3) interviuri și asistențe, (4) raportul de evaluare externă periodică — cu cele
 * 5 întrebări fundamentale și concluziile pe domenii. Unitățile sunt fictive (antrenament).
 */

// Scala reală a calificativelor (nivelul de realizare al indicatorului) — de la
// „Nesatisfăcător" la „Excelent", conform metodologiei în vigoare.
const CALIFICATIVE = [
  { val: 5, label: 'Excelent', scurt: 'E', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', sens: 'Unitatea a depășit cerințele standardelor de referință, dovedind creativitate și inovație.' },
  { val: 4, label: 'Foarte bine', scurt: 'FB', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', sens: 'Sunt îndeplinite toate cerințele standardelor de referință (de calitate).' },
  { val: 3, label: 'Bine', scurt: 'B', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', sens: 'Este îndeplinită cel puțin o cerință din standardele de referință, peste nivelul minim.' },
  { val: 2, label: 'Satisfăcător', scurt: 'S', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', sens: 'Sunt îndeplinite toate cerințele standardelor de acreditare — nivelul minim obligatoriu.' },
  { val: 1, label: 'Nesatisfăcător', scurt: 'NS', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', sens: 'NU sunt îndeplinite toate cerințele standardelor de acreditare.' },
]

function calif(val: number) {
  return CALIFICATIVE.find(c => c.val === Math.min(5, Math.max(1, Math.round(val)))) || CALIFICATIVE[4]
}

// Cei 24 de indicatori de performanță — denumirile oficiale din anexa la H.G. nr. 994/2020
// (modificată prin H.G. nr. 631/2022), așa cum apar în rapoartele de evaluare externă ARACIP.
// „Dovezile" provin din Instrucțiunea ARACIP nr. 3/2022 (documente per indicator în platformă);
// pentru indicatorii fără documente obligatorii (I7, I11, I21, I22) verificarea se face direct la vizită.
const INDICATORI: { cod: string; domeniu: 'A' | 'B' | 'C'; text: string; dovezi: string[]; laVizita?: boolean }[] = [
  { cod: 'I1', domeniu: 'A', text: 'Existența, structura și conținutul documentelor proiective: planul de dezvoltare și planul managerial', dovezi: ['PDI/PAS (și revizuirile, dacă e cazul)', 'Planul managerial / operațional pentru anul în curs', 'RAEI pe ultimii 3 ani', 'Raportul anual privind starea și calitatea învățământului (ultimii 3 ani)'] },
  { cod: 'I2', domeniu: 'A', text: 'Organizarea internă și funcționarea curentă a unității de învățământ', dovezi: ['Regulamentul intern', 'Schema orară', 'Statul de funcții și deciziile de încadrare/titularizare', 'Fișele de post (câte una pentru fiecare poziție)'] },
  { cod: 'I3', domeniu: 'A', text: 'Existența și funcționarea sistemului de comunicare internă și externă și de gestionare a informației', dovezi: ['Organigrama', 'Procedura de comunicare internă și externă', 'Registrul de intrări/ieșiri (model de răspuns)', 'Evidența absolvenților și a tranzitării elevilor între niveluri'] },
  { cod: 'I4', domeniu: 'A', text: 'Asigurarea sănătății și securității tuturor celor implicați în activitatea școlară', dovezi: ['Contractul cu medicul/asistentul medical', 'Autorizația sanitară de funcționare', 'Autorizația/avizul de securitate la incendiu', 'Analiza chestionarelor de feedback aplicate elevilor'] },
  { cod: 'I5', domeniu: 'A', text: 'Asigurarea serviciilor de orientare și consiliere pentru elevi', dovezi: ['Acordurile cu entități/ONG-uri și/sau cu comunitatea locală', 'Documentele consilierului școlar (fără date confidențiale)', 'Procedura de colaborare cu CJRAE/CMBRAE'] },
  { cod: 'I6', domeniu: 'A', text: 'Caracteristicile, dotarea și utilizarea spațiilor școlare, administrative și auxiliare', dovezi: ['Planul de școlarizare aprobat', 'Portofoliul unui cadru didactic (planificare scanată — model)', 'Documentul privind progresul dotării cu bază materială (poate fi parte a PDI)', 'Vizitarea spațiilor școlare, administrative și auxiliare'] },
  { cod: 'I7', domeniu: 'A', text: 'Accesibilitatea spațiilor școlare, administrative și auxiliare și a echipamentelor, materialelor, mijloacelor de învățământ și auxiliarelor curriculare', laVizita: true, dovezi: ['Verificare directă: rampe și căi de acces (inclusiv pentru persoane cu dizabilități)', 'Verificare directă: accesul elevilor la mijloacele de învățământ și auxiliare', 'Verificare directă: accesul la bibliotecă și la tehnologia informatică și de comunicare'] },
  { cod: 'I8', domeniu: 'A', text: 'Managementul personalului didactic, de conducere, didactic auxiliar și nedidactic', dovezi: ['Deciziile de titularizare/încadrare', 'Actele de studii ale cadrelor didactice încadrate', 'Extrasul Revisal', 'Fișele de evaluare ale personalului'] },
  { cod: 'I9', domeniu: 'B', text: 'Definirea și promovarea ofertei educaționale', dovezi: ['Oferta educațională', 'Planurile remediale pentru copiii vulnerabili', 'Comunicarea rezultatelor către beneficiari (model)'] },
  { cod: 'I10', domeniu: 'B', text: 'Proiectarea curriculumului și planificarea activităților de învățare', dovezi: ['Planificările cadrelor didactice (un model)', 'Respectarea planurilor-cadru și a programelor în vigoare'] },
  { cod: 'I11', domeniu: 'B', text: 'Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine', laVizita: true, dovezi: ['Asistențe la activitățile de învățare', 'Observarea directă a participării elevilor', 'Observarea climatului și a stării de bine în clase'] },
  { cod: 'I12', domeniu: 'B', text: 'Rezultatele obținute (participare școlară, rezultatele învățării și starea de bine)', dovezi: ['Planificările evaluării (la nivel de disciplină/arie/școală)', 'Planificarea activităților remediale pentru fiecare elev', 'Analiza progresului fiecărui elev (pentru o clasă)', 'Fișa de progres a preșcolarului (pentru nivelul preșcolar)'] },
  { cod: 'I13', domeniu: 'B', text: 'Urmărirea traiectului școlar și/sau profesional ulterior al absolvenților', dovezi: ['Procedura de urmărire ulterioară a absolvenților', 'Analiza chestionarelor de feedback adresate absolvenților'] },
  { cod: 'I14', domeniu: 'B', text: 'Constituirea bugetului unității de învățământ și execuția bugetară', dovezi: ['Execuția bugetară', 'Fundamentarea bugetului în corelare cu PDI/PAS'] },
  { cod: 'I15', domeniu: 'C', text: 'Realizarea autoevaluării instituționale și asigurarea internă a calității conform prevederilor legale', dovezi: ['RAEI pe ultimii 3 ani (din platforma calitate.aracip.eu)'] },
  { cod: 'I16', domeniu: 'C', text: 'Dezvoltarea profesională a personalului', dovezi: ['Situația cursurilor de formare profesională a personalului', 'Planificarea interasistențelor (dacă se practică în unitate)'] },
  { cod: 'I17', domeniu: 'C', text: 'Revizuirea ofertei educaționale și a PDI/PAS', dovezi: ['Oferta educațională (revizuită)', 'Analiza chestionarelor de feedback', 'Corespondența privind propunerile pentru PDI/PAS'] },
  { cod: 'I18', domeniu: 'C', text: 'Optimizarea evaluării rezultatelor învățării', dovezi: ['RAEI (ultimii 3 ani)', 'Instrumentele proprii de evaluare (dacă e cazul)'] },
  { cod: 'I19', domeniu: 'C', text: 'Evaluarea calității activității corpului profesoral', dovezi: ['Planurile individuale de remediere a punctelor slabe ale cadrelor didactice', 'Fișele anuale de evaluare a personalului didactic'] },
  { cod: 'I20', domeniu: 'C', text: 'Optimizarea accesului la resursele educaționale', dovezi: ['Analiza progresului accesului elevilor la mijloace de învățământ și la baza materială', 'Comunicarea cu beneficiarii (model)'] },
  { cod: 'I21', domeniu: 'C', text: 'Constituirea bazei de date a unității de învățământ', laVizita: true, dovezi: ['Verificare directă: baza de date internă a unității', 'Verificare directă: concordanța cu datele din SIIIR'] },
  { cod: 'I22', domeniu: 'C', text: 'Asigurarea accesului la oferta educațională a școlii', laVizita: true, dovezi: ['Verificare directă: pagina web a unității', 'Verificare directă: avizier și materiale de prezentare', 'Verificare directă: accesul public la informațiile de interes'] },
  { cod: 'I23', domeniu: 'C', text: 'Constituirea și funcționarea structurilor responsabile cu evaluarea internă a calității', dovezi: ['Decizia de înființare a CEAC', 'Regulamentul CEAC', 'Planul managerial CEAC'] },
  { cod: 'I24', domeniu: 'C', text: 'Acuratețea raportărilor prevăzute de legislația în vigoare', dovezi: ['Raportul anual privind starea și calitatea învățământului (ultimii 3 ani)', 'Concordanța datelor raportate (RAEI, SIIIR) cu realitatea din unitate'] },
]

const DOMENII_META: Record<'A' | 'B' | 'C', { titlu: string; culoare: string }> = {
  A: { titlu: 'Domeniul A: Capacitatea instituțională', culoare: '#3b82f6' },
  B: { titlu: 'Domeniul B: Eficacitate educațională', culoare: '#a855f7' },
  C: { titlu: 'Domeniul C: Managementul calității', culoare: '#14b8a6' },
}

// Cele 5 întrebări fundamentale din raportul de evaluare externă ARACIP,
// cu tabelul real de corelare a indicatorilor (Anexa 1 la raport).
const INTREBARI_FUNDAMENTALE = [
  { nr: 1, text: 'În ce măsură școala servește nevoile și interesele membrilor individuali ai comunității școlare (în special elevi, părinți, cadre didactice), ale comunității în ansamblu și ale societății în general?', indicatori: ['I1', 'I2', 'I3', 'I5', 'I6', 'I8', 'I9', 'I10', 'I14', 'I16', 'I17', 'I18', 'I19', 'I21', 'I23'] },
  { nr: 2, text: 'În ce măsură școala funcționează și este guvernată în mod eficient?', indicatori: ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I8', 'I11', 'I15', 'I22'] },
  { nr: 3, text: 'În ce măsură școala obține rezultatele scontate ale învățării?', indicatori: ['I1', 'I3', 'I4', 'I5', 'I6', 'I9', 'I10', 'I11', 'I12', 'I13', 'I15', 'I16', 'I18'] },
  { nr: 4, text: 'În ce măsură școala asigură starea de bine a participanților la educație?', indicatori: ['I1', 'I2', 'I3', 'I5', 'I6', 'I7', 'I9', 'I10', 'I11', 'I12', 'I15'] },
  { nr: 5, text: 'În ce măsură este școala o instituție de succes, care învață și se îmbunătățește continuu?', indicatori: ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14', 'I15', 'I16', 'I17', 'I18', 'I19', 'I20', 'I24'] },
]

// Documentele analizate ÎNAINTE de vizită, din platforma https://calitate.aracip.eu,
// cu denumirile și categoriile reale din Instrucțiunile ARACIP nr. 1–3/2022.
const DOCUMENTE_PREVIZITA = [
  { nume: 'PDI/PAS (și revizuirile, dacă e cazul)', categorie: 'DOCUMENTELE ȘCOLII / PLANIFICARE INTERNĂ' },
  { nume: 'Plan managerial / plan operațional pentru anul în curs', categorie: 'DOCUMENTELE ȘCOLII / PLANIFICARE INTERNĂ' },
  { nume: 'RAEI pe ultimii 3 ani', categorie: 'generat anual în platformă' },
  { nume: 'Raportul anual privind starea și calitatea învățământului (ultimii 3 ani)', categorie: 'DOCUMENTE DE ÎNFIINȚARE / ALTELE' },
  { nume: 'Organigrama', categorie: 'DOCUMENTELE ȘCOLII / RESURSE UMANE' },
  { nume: 'Regulamentul intern', categorie: 'DOCUMENTELE ȘCOLII / DOCUMENTE DE FUNCȚIONARE ȘI RESURSE MATERIALE' },
  { nume: 'Statul de funcții', categorie: 'DOCUMENTELE ȘCOLII / RESURSE UMANE' },
  { nume: 'Extras Revisal', categorie: 'DOCUMENTELE ȘCOLII / RESURSE UMANE' },
  { nume: 'Decizia de înființare, regulamentul și planul managerial CEAC', categorie: 'DOCUMENTELE ȘCOLII / SISTEMUL DE MANAGEMENT AL CALITĂȚII' },
  { nume: 'Planul de școlarizare aprobat', categorie: 'DOCUMENTELE ȘCOLII / OFERTĂ EDUCAȚIONALĂ ȘI REZULTATE EDUCAȚIONALE' },
  { nume: 'Execuția bugetară', categorie: 'DOCUMENTE DE ÎNFIINȚARE / ALTELE' },
  { nume: 'Schema orară', categorie: 'DOCUMENTE DE ÎNFIINȚARE / ALTELE' },
]

// Interviurile și observațiile din timpul vizitei — interlocutorii reali din
// rapoartele de evaluare externă (director, președinte CA, coordonator CEAC etc.).
const INTERVIURI = [
  { id: 'director', rol: 'Director', ind: 'I1, I2, I8, I14', ghid: 'Documentele proiective (PDI/plan managerial), guvernarea unității, resursele umane, bugetul, relația cu ISJ/ISMB și cu comunitatea.', intrebari: ['Cum ați fundamentat țintele din PDI și cum le corelați cu bugetul și cu execuția bugetară? (I1, I14)', 'Cum este organizată încadrarea personalului și ce dovezi ale evaluării personalului aveți? (I8)'] },
  { id: 'ceac', rol: 'Coordonator CEAC', ind: 'I15, I23', ghid: 'Funcționarea CEAC, elaborarea RAEI, nivelul de realizare a indicatorilor în autoevaluare, planul de îmbunătățire și aplicarea lui.', intrebari: ['Cum ați ajuns la calificativul din RAEI la indicatorul X și ce dovadă concretă îl susține? (I15)', 'Cum monitorizează CEAC planul de îmbunătățire și unde sunt procesele-verbale ale ședințelor? (I23)'] },
  { id: 'cadre', rol: 'Cadre didactice', ind: 'I10, I11, I12, I16', ghid: 'Proiectarea și realizarea activităților de învățare, evaluarea și progresul elevilor, formarea continuă, interasistențele.', intrebari: ['Cum urmăriți progresul fiecărui elev și ce faceți concret pentru cei rămași în urmă? (I12)', 'Ce cursuri de formare ați parcurs recent și cum s-au reflectat la clasă? (I16)'] },
  { id: 'parinti', rol: 'Reprezentanți ai părinților', ind: 'I3, I4, I9', ghid: 'Comunicarea școală–familie, siguranța și starea de bine a elevilor, accesul la oferta educațională, satisfacția față de serviciile educaționale.', intrebari: ['Copiii dvs. se simt în siguranță în școală și sunteți consultați în deciziile importante? (I4, I3)', 'Cum aflați despre oferta educațională și despre rezultatele copilului? (I9)'] },
  { id: 'elevi', rol: 'Elevi (după caz)', ind: 'I5, I11, I20', ghid: 'Participarea la activități, starea de bine, accesul la resurse, serviciile de orientare și consiliere.', intrebari: ['Vă simțiți bine la școală și participați activ la lecții? (I11, starea de bine)', 'Aveți acces la bibliotecă, la tehnologie și la consiliere când aveți nevoie? (I20, I5)'] },
  { id: 'asistente', rol: 'Asistențe la activități didactice', ind: 'I11', ghid: 'Observarea directă a activităților de învățare (I11): metode, participare, climat, obținerea stării de bine.', intrebari: ['Observare directă: metode active, gradul de participare a elevilor, climatul și starea de bine în clasă. (I11)'] },
]

// Unități de învățământ FICTIVE (antrenament) — cu calificativele de AUTOEVALUARE
// din RAEI-ul propriu (Partea a III-a), pe care evaluatorul extern le compară cu constatările proprii.
type Scoala = {
  id: string; denumire: string; localitate: string; nivel: string; nrElevi: number; nrProf: number
  anInfiintare: number; promovabilitate: number; abandon: number; anScolar: string
  autoeval: Record<string, number>
}

const SCOLI_FICTIVE: Scoala[] = [
  {
    id: 's1', denumire: 'Liceul Teoretic „Mihai Eminescu"', localitate: 'Ploiești, jud. Prahova', nivel: 'Liceal (teoretic)', nrElevi: 780, nrProf: 54, anInfiintare: 1948, promovabilitate: 87.3, abandon: 1.2, anScolar: '2024–2025',
    autoeval: { I1: 4, I2: 4, I3: 3, I4: 4, I5: 3, I6: 4, I7: 3, I8: 4, I9: 4, I10: 4, I11: 3, I12: 3, I13: 3, I14: 4, I15: 4, I16: 3, I17: 3, I18: 3, I19: 4, I20: 3, I21: 4, I22: 4, I23: 4, I24: 4 },
  },
  {
    id: 's2', denumire: 'Școala Gimnazială „Ion Creangă"', localitate: 'Suceava, jud. Suceava', nivel: 'Primar + Gimnazial', nrElevi: 425, nrProf: 28, anInfiintare: 1966, promovabilitate: 91.5, abandon: 0.8, anScolar: '2024–2025',
    autoeval: { I1: 3, I2: 4, I3: 3, I4: 4, I5: 2, I6: 3, I7: 2, I8: 4, I9: 3, I10: 4, I11: 3, I12: 3, I13: 2, I14: 3, I15: 3, I16: 3, I17: 3, I18: 3, I19: 3, I20: 2, I21: 3, I22: 3, I23: 3, I24: 4 },
  },
  {
    id: 's3', denumire: 'Colegiul Tehnic „Traian Vuia"', localitate: 'Oradea, jud. Bihor', nivel: 'Liceal tehnologic + Profesional', nrElevi: 920, nrProf: 68, anInfiintare: 1953, promovabilitate: 79.4, abandon: 3.1, anScolar: '2024–2025',
    autoeval: { I1: 3, I2: 3, I3: 2, I4: 3, I5: 2, I6: 2, I7: 2, I8: 3, I9: 3, I10: 3, I11: 2, I12: 2, I13: 3, I14: 3, I15: 2, I16: 2, I17: 2, I18: 2, I19: 3, I20: 2, I21: 3, I22: 2, I23: 3, I24: 3 },
  },
  {
    id: 's4', denumire: 'Grădinița cu Program Prelungit Nr. 14', localitate: 'Cluj-Napoca, jud. Cluj', nivel: 'Preșcolar', nrElevi: 210, nrProf: 14, anInfiintare: 1975, promovabilitate: 100, abandon: 0, anScolar: '2024–2025',
    autoeval: { I1: 5, I2: 4, I3: 4, I4: 5, I5: 4, I6: 5, I7: 4, I8: 4, I9: 4, I10: 4, I11: 5, I12: 4, I13: 3, I14: 4, I15: 4, I16: 4, I17: 4, I18: 4, I19: 4, I20: 4, I21: 4, I22: 4, I23: 5, I24: 4 },
  },
]

export default function SimulareEvaluareExternaPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<'selectie' | 'documente' | 'vizita' | 'interviuri' | 'raport'>('selectie')
  const [scoala, setScoala] = useState<Scoala | null>(null)
  const [numeEvaluator, setNumeEvaluator] = useState('')
  const [docAnalizate, setDocAnalizate] = useState<Record<number, boolean>>({})
  const [constatariDoc, setConstatariDoc] = useState('')
  const [calificative, setCalificative] = useState<Record<string, number>>({})
  const [constatari, setConstatari] = useState<Record<string, string>>({})
  const [dovezi, setDovezi] = useState<Record<string, boolean[]>>({})
  const [noteInterviu, setNoteInterviu] = useState<Record<string, string>>({})

  const totalIndicatori = INDICATORI.length
  const completate = INDICATORI.filter(i => calificative[i.cod] !== undefined).length
  const docsBifate = Object.values(docAnalizate).filter(Boolean).length

  function setCalif(cod: string, val: number) {
    setCalificative(prev => ({ ...prev, [cod]: val }))
  }
  function toggleDovada(cod: string, idx: number) {
    setDovezi(prev => {
      const arr = [...(prev[cod] || [])]
      arr[idx] = !arr[idx]
      return { ...prev, [cod]: arr }
    })
  }

  function scorMediu(coduri?: string[]) {
    const lista = (coduri || INDICATORI.map(i => i.cod)).map(c => calificative[c]).filter(v => v !== undefined)
    if (!lista.length) return 0
    return lista.reduce((a, b) => a + b, 0) / lista.length
  }

  function finalizeaza() {
    try { localStorage.setItem('aracip_evaluare_done', '1') } catch { /* noop */ }
    // Persistență cloud non-blocantă (fallback localStorage dacă Supabase lipsește).
    try {
      pushFormareReport('evaluare', scorMediu(), {
        scoala: scoala?.denumire, evaluator: numeEvaluator,
        calificative, constatari, dovezi, constatariDoc, noteInterviu,
      })
    } catch { /* noop */ }
    setEtapa('raport')
  }

  const bg = '#0f172a'
  const card = 'rgba(255,255,255,0.04)'
  const border = 'rgba(255,255,255,0.08)'
  const dataAzi = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })

  // ---------- ETAPA 0: SELECȚIA UNITĂȚII ----------
  if (etapa === 'selectie') {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <button onClick={() => router.push('/formare')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginBottom: 32 }}>← Platformă</button>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontSize: 27, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Simulare Evaluare Externă Periodică</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              Exersați procesul complet al evaluării externe periodice conform <strong style={{ color: '#5eead4' }}>Legii nr. 198/2023</strong> (Titlul IV — art. 233 domeniile și criteriile), <strong style={{ color: '#5eead4' }}>H.G. nr. 993/2020</strong> (metodologia) și <strong style={{ color: '#5eead4' }}>H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022</strong> (standardele — cei 24 de indicatori): analiza documentelor din platformă, vizita cu triangularea dovezilor, interviurile și raportul de evaluare externă.
            </p>
          </div>

          {/* Etapele reale ale procesului */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#5eead4', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Etapele reale ale evaluării externe</div>
            {[
              { n: '1', t: 'Analiza documentelor (pre-vizită)', d: 'Comisia analizează documentele încărcate de unitate în platforma calitate.aracip.eu, conform Instrucțiunilor ARACIP nr. 1–3/2022, inclusiv RAEI pe ultimii 3 ani.' },
              { n: '2', t: 'Vizita de evaluare', d: 'Verificarea în teren a dovezilor și completarea grilei pe cei 24 de indicatori, comparând calificativul de autoevaluare (din RAEI) cu cel constatat.' },
              { n: '3', t: 'Interviuri și asistențe', d: 'Interviuri cu directorul, coordonatorul CEAC, cadre didactice, părinți și elevi; asistențe la activitățile de învățare.' },
              { n: '4', t: 'Raportul de evaluare externă', d: 'Concluzii prin raportare la cele 5 întrebări fundamentale, nivelul de realizare al indicatorilor, puncte tari și arii de îmbunătățire pe domenii. Raportul se face public conform art. 12 alin. (8) din H.G. nr. 993/2020.' },
            ].map(q => (
              <div key={q.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ background: 'rgba(20,184,166,0.18)', color: '#5eead4', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{q.n}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{q.t}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{q.d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Briefing metodologic pentru expertul evaluator — repere la nivel expert */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#5eead4', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Repere metodologice pentru evaluator</div>
            {[
              { t: 'Comisia și observatorii', d: 'Comisia se desemnează prin hotărâre de evaluare ARACIP, din experți înscriși în Registrul ARACIP al experților în evaluare și acreditare. La vizită participă, ca observatori, un inspector școlar desemnat de ISJ/ISMB și, după caz, un observator desemnat de federațiile naționale ale părinților. Raportul redactat de coordonator este validat de un expert ARACIP.' },
              { t: 'Triangularea dovezilor', d: 'Fiecare constatare se confirmă din minimum trei surse independente: documentul din platformă, observarea directă în teren și declarațiile din interviuri/chestionare. O afirmație susținută de o singură sursă nu constituie dovadă suficientă pentru acordarea calificativului.' },
              { t: 'Verificări obligatorii la vizită', d: 'Autorizația sanitară de funcționare și autorizația/avizul de securitate la incendiu (I4); accesibilitatea spațiilor și a mijloacelor de învățământ, inclusiv pentru persoanele cu dizabilități (I7); asistențe la activitățile de învățare (I11); baza de date și concordanța cu SIIIR (I21); accesul public la oferta educațională (I22). Pentru I7, I11, I21 și I22 nu există documente obligatorii în platformă — verificarea este exclusiv directă (Instrucțiunea ARACIP nr. 3/2022).' },
              { t: 'Logica calificativelor', d: 'La ACREDITARE fiecare indicator se apreciază „Respectă standardele: DA/NU" — un singur „NU" la standardul de acreditare blochează acreditarea. La EVALUAREA PERIODICĂ se aplică scala „Nesatisfăcător"–„Excelent", cumulativă: „Satisfăcător" = toate cerințele de acreditare; „Bine"/„Foarte bine" = cerințe suplimentare din standardul de referință; „Excelent" = depășirea referinței, cu creativitate și inovație. Calificativele NU se compensează între indicatori.' },
              { t: 'Autoevaluare (RAEI) vs. constatare externă', d: 'Raportul prezintă, pentru fiecare indicator, ambele calificative în paralel. Diferențele mari și sistematice între autoevaluare și constatări indică o cultură a calității deficitară (autoevaluare necalibrată), ceea ce afectează direct I15 — realizarea autoevaluării instituționale.' },
              { t: 'Dovadă bună vs. dovadă slabă (cazuistică)', d: 'Ex. I19: dovadă slabă = fișe de evaluare completate formal, cu punctaj maxim la toți; dovadă bună = fișe individuale care identifică puncte slabe concrete, corelate cu un plan de remediere și cu interasistențe ulterioare care confirmă corectarea. Ex. I23: decizia de înființare a CEAC există, dar lipsesc procesele-verbale, procedurile aplicate și urmele monitorizării planului de îmbunătățire → „Nesatisfăcător", comisie doar „pe hârtie".' },
            ].map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ background: 'rgba(20,184,166,0.14)', color: '#5eead4', width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{q.t}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>{q.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Numele evaluatorului (coordonator al comisiei de evaluare) *</label>
            <input
              value={numeEvaluator}
              onChange={e => setNumeEvaluator(e.target.value)}
              placeholder="Prenume Nume"
              style={{ width: '100%', padding: '12px 14px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, color: '#475569' }}>În procesul real, evaluatorii sunt experți înscriși în Registrul ARACIP al experților în evaluare și acreditare, desemnați prin hotărâre de evaluare ARACIP.</div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', marginBottom: 16 }}>Selectați unitatea de învățământ (fictivă) de evaluat:</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SCOLI_FICTIVE.map(s => {
              const medieAuto = Object.values(s.autoeval).reduce((a, b) => a + b, 0) / 24
              const cAuto = calif(medieAuto)
              return (
                <div
                  key={s.id}
                  onClick={() => { if (numeEvaluator) { setScoala(s); setEtapa('documente') } }}
                  style={{
                    background: card, border: `2px solid ${border}`, borderRadius: 14, padding: '20px 24px',
                    cursor: numeEvaluator ? 'pointer' : 'not-allowed', opacity: numeEvaluator ? 1 : 0.5,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (numeEvaluator) { (e.currentTarget as HTMLDivElement).style.borderColor = '#14b8a644'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.denumire}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{s.localitate} · {s.nivel}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, color: '#475569', marginBottom: 2 }}>Autoevaluare RAEI {s.anScolar} (medie)</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cAuto.color }}>{cAuto.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748b' }}>👥 {s.nrElevi} elevi/copii</span>
                    <span style={{ color: '#64748b' }}>👨‍🏫 {s.nrProf} cadre didactice</span>
                    <span style={{ color: '#64748b' }}>📈 {s.promovabilitate}% promovabilitate</span>
                    {s.abandon > 0 && <span style={{ color: '#f59e0b' }}>⚠ {s.abandon}% abandon</span>}
                  </div>
                </div>
              )
            })}
          </div>
          {!numeEvaluator && <div style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 16 }}>Introduceți numele evaluatorului pentru a continua.</div>}
        </div>
      </div>
    )
  }

  // ---------- ETAPA 1: ANALIZA DOCUMENTELOR PRE-VIZITĂ ----------
  if (etapa === 'documente' && scoala) {
    const s = scoala
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <button onClick={() => setEtapa('selectie')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginBottom: 24 }}>← Selecție</button>

          <div style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Etapa 1 · Analiza documentelor pre-vizită</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.denumire}</h2>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{s.localitate} · Evaluare externă periodică</div>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
              <strong style={{ color: '#e2e8f0' }}>Comisia de evaluare</strong> (desemnată prin hotărâre de evaluare ARACIP — simulare):<br />
              1. Coordonator comisie: <strong style={{ color: '#e2e8f0' }}>{numeEvaluator}</strong><br />
              2. Membru comisie: expert din Registrul ARACIP<br />
              Observator desemnat de ISJ/ISMB: inspector școlar<br />
              Observator desemnat de federația națională a părinților<br />
              <strong style={{ color: '#e2e8f0' }}>Durata vizitei:</strong> 2 zile
            </div>
          </div>

          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Documente încărcate de unitate în platforma calitate.aracip.eu</h3>
            <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
              Conform Instrucțiunilor ARACIP nr. 1–3/2022, unitatea postează în platformă documentele corelate pe fiecare indicator (max. 30 MB/document). Analizați fiecare document înainte de vizită și marcați-l ca parcurs.
            </p>
            {DOCUMENTE_PREVIZITA.map((d, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer', background: docAnalizate[i] ? 'rgba(20,184,166,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${docAnalizate[i] ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                <input type="checkbox" checked={!!docAnalizate[i]} onChange={() => setDocAnalizate(p => ({ ...p, [i]: !p[i] }))} style={{ accentColor: '#14b8a6', width: 16, height: 16, marginTop: 2 }} />
                <span>
                  <span style={{ fontSize: 13.5, color: docAnalizate[i] ? '#e2e8f0' : '#94a3b8', fontWeight: 600 }}>{d.nume}</span>
                  <span style={{ display: 'block', fontSize: 11.5, color: '#475569', marginTop: 2 }}>{d.categorie}</span>
                </span>
              </label>
            ))}
          </div>

          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Constatări preliminare din analiza documentelor</h3>
            <textarea
              value={constatariDoc}
              onChange={e => setConstatariDoc(e.target.value)}
              placeholder="ex: PDI 2024–2028 aprobat în CA, fundamentat pe analize SWOT/PESTE; RAEI finalizat în platformă pentru ultimii 3 ani; execuția bugetară corelată cu țintele PDI..."
              rows={4}
              style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#e2e8f0', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
          </div>

          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '16px', marginBottom: 24, fontSize: 13, color: '#fbbf24', lineHeight: 1.6 }}>
            <strong>ℹ Simulare de antrenament</strong> — Unitatea și documentele sunt fictive. Procedura, indicatorii și structura raportului sunt cele reale, conform metodologiei în vigoare.
          </div>

          <button onClick={() => setEtapa('vizita')} disabled={docsBifate < DOCUMENTE_PREVIZITA.length}
            style={{ width: '100%', padding: '16px', background: docsBifate < DOCUMENTE_PREVIZITA.length ? '#1e293b' : '#14b8a6', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: docsBifate < DOCUMENTE_PREVIZITA.length ? 'not-allowed' : 'pointer', opacity: docsBifate < DOCUMENTE_PREVIZITA.length ? 0.5 : 1 }}>
            {docsBifate < DOCUMENTE_PREVIZITA.length ? `Analizați toate documentele (${DOCUMENTE_PREVIZITA.length - docsBifate} rămase)` : 'Etapa 2 — Începe vizita de evaluare →'}
          </button>
        </div>
      </div>
    )
  }

  // ---------- ETAPA 2: VIZITA — GRILA PE CEI 24 DE INDICATORI ----------
  if (etapa === 'vizita' && scoala) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 24px' }}>
          <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setEtapa('documente')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Documente</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{scoala.denumire}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>Etapa 2 · Vizita de evaluare · Coordonator: {numeEvaluator}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#475569' }}>Indicatori evaluați</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: completate === totalIndicatori ? '#22c55e' : '#14b8a6' }}>{completate}/{totalIndicatori}</div>
            </div>
          </div>
          <div style={{ maxWidth: 920, margin: '6px auto 0', background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4 }}>
            <div style={{ background: '#14b8a6', borderRadius: 4, height: 4, width: `${(completate / totalIndicatori) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 24px' }}>
          {/* Legenda scalei reale */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nivelul de realizare al indicatorului — calificativele reale</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CALIFICATIVE.map(c => (
                <div key={c.val} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5 }}>
                  <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}55`, fontWeight: 700, borderRadius: 6, padding: '2px 8px', flexShrink: 0, minWidth: 96, textAlign: 'center' }}>{c.label}</span>
                  <span style={{ color: '#94a3b8', lineHeight: 1.5 }}>{c.sens}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              Pentru fiecare indicator, comparați calificativul de <strong style={{ color: '#c4b5fd' }}>autoevaluare</strong> (din RAEI-ul unității) cu constatările proprii și acordați calificativul de <strong style={{ color: '#5eead4' }}>evaluare externă</strong>. Raportul final le prezintă pe ambele, ca în modelul real ARACIP.
            </div>
          </div>

          {(['A', 'B', 'C'] as const).map(dom => {
            const meta = DOMENII_META[dom]
            const lista = INDICATORI.filter(i => i.domeniu === dom)
            return (
              <div key={dom} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 32, background: meta.culoare, borderRadius: 4 }} />
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{meta.titlu}</h2>
                </div>

                {lista.map(ind => {
                  const val = calificative[ind.cod]
                  const doveziBifate = dovezi[ind.cod] || []
                  const auto = calif(scoala.autoeval[ind.cod])
                  return (
                    <div key={ind.cod} style={{ background: card, border: `1px solid ${val !== undefined ? meta.culoare + '44' : border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{ background: `${meta.culoare}22`, color: meta.culoare, fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>{ind.cod}</span>
                        <span style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, fontWeight: 600, flex: 1, minWidth: 200 }}>{ind.text}</span>
                        <span title="Calificativul acordat de unitate în RAEI (Partea a III-a)" style={{ background: auto.bg, color: auto.color, border: `1px solid ${auto.color}44`, fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                          Autoevaluare RAEI: {auto.scurt}
                        </span>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600 }}>
                          {ind.laVizita ? 'Verificare directă la vizită (fără documente obligatorii în platformă — Instrucțiunea ARACIP nr. 3/2022):' : 'Dovezi verificate (documente din platformă + verificare în teren):'}
                        </div>
                        {ind.dovezi.map((d, di) => (
                          <label key={di} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={!!doveziBifate[di]}
                              onChange={() => toggleDovada(ind.cod, di)}
                              style={{ accentColor: meta.culoare, width: 16, height: 16 }}
                            />
                            <span style={{ fontSize: 13, color: doveziBifate[di] ? '#e2e8f0' : '#475569' }}>{d}</span>
                          </label>
                        ))}
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600 }}>Calificativ evaluare externă (nivel de realizare):</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {CALIFICATIVE.slice().reverse().map(q => (
                            <button
                              key={q.val}
                              onClick={() => setCalif(ind.cod, q.val)}
                              style={{
                                padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: val === q.val ? 700 : 400,
                                background: val === q.val ? q.bg : 'rgba(255,255,255,0.04)',
                                border: `2px solid ${val === q.val ? q.color : 'rgba(255,255,255,0.08)'}`,
                                color: val === q.val ? q.color : '#64748b', transition: 'all 0.15s',
                              }}
                            >{q.label}</button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={constatari[ind.cod] || ''}
                        onChange={e => setConstatari(o => ({ ...o, [ind.cod]: e.target.value }))}
                        placeholder="Constatări (dovezi identificate, aspecte pozitive, arii de îmbunătățire)..."
                        rows={2}
                        style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}

          <button
            onClick={() => setEtapa('interviuri')}
            disabled={completate < totalIndicatori}
            style={{
              width: '100%', padding: '16px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700,
              cursor: completate < totalIndicatori ? 'not-allowed' : 'pointer',
              background: completate < totalIndicatori ? '#1e293b' : '#14b8a6', color: '#fff',
              opacity: completate < totalIndicatori ? 0.5 : 1,
            }}
          >
            {completate < totalIndicatori ? `Evaluați toți cei 24 de indicatori (${totalIndicatori - completate} rămași)` : 'Etapa 3 — Interviuri și asistențe →'}
          </button>
        </div>
      </div>
    )
  }

  // ---------- ETAPA 3: INTERVIURI ȘI ASISTENȚE ----------
  if (etapa === 'interviuri' && scoala) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <button onClick={() => setEtapa('vizita')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginBottom: 24 }}>← Grila de evaluare</button>

          <div style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Etapa 3 · Interviuri, observații și asistențe</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{scoala.denumire}</h2>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              În timpul vizitei, comisia realizează interviuri cu conducerea, coordonatorul CEAC, cadrele didactice, părinții și elevii, precum și asistențe la activitățile de învățare. Constatările se corelează cu indicatorii și fundamentează concluziile la cele 5 întrebări fundamentale din raport. Notele sunt opționale, dar recomandate.
            </p>
          </div>

          {INTERVIURI.map(iv => (
            <div key={iv.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: '#e2e8f0' }}>{iv.rol}</span>
                <span style={{ background: 'rgba(20,184,166,0.14)', color: '#5eead4', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>Indicatori: {iv.ind}</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>Teme urmărite: {iv.ghid}</div>
              <div style={{ background: '#0f172a', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Întrebări-tip corelate cu indicatorii</div>
                {iv.intrebari.map((q, qi) => (
                  <div key={qi} style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5, marginBottom: 2 }}>• {q}</div>
                ))}
              </div>
              <textarea
                value={noteInterviu[iv.id] || ''}
                onChange={e => setNoteInterviu(o => ({ ...o, [iv.id]: e.target.value }))}
                placeholder="Constatări din interviu/observare..."
                rows={2}
                style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
          ))}

          <button onClick={finalizeaza}
            style={{ width: '100%', padding: '16px', background: '#14b8a6', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>
            Etapa 4 — Generează Raportul de Evaluare Externă Periodică →
          </button>
        </div>
      </div>
    )
  }

  // ---------- ETAPA 4: RAPORTUL DE EVALUARE EXTERNĂ PERIODICĂ ----------
  if (etapa === 'raport' && scoala) {
    const s = scoala
    const scorGeneral = scorMediu()
    const areNS = INDICATORI.some(i => calificative[i.cod] === 1)
    const calFinal = areNS ? CALIFICATIVE[4] : calif(scorGeneral)

    const domeniiScor = (['A', 'B', 'C'] as const).map(dom => {
      const meta = DOMENII_META[dom]
      const coduri = INDICATORI.filter(i => i.domeniu === dom).map(i => i.cod)
      const avg = scorMediu(coduri)
      return { dom, meta, avg, c: calif(avg) }
    })

    const puncteTari = (dom: 'A' | 'B' | 'C') => INDICATORI.filter(i => i.domeniu === dom && (calificative[i.cod] || 0) >= 4)
    const ariiImbunatatire = (dom: 'A' | 'B' | 'C') => INDICATORI.filter(i => i.domeniu === dom && (calificative[i.cod] || 0) <= 2)

    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header raport — structura reală ARACIP */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Agenția Română de Asigurare a Calității în Învățământul Preuniversitar</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>RAPORT DE EVALUARE EXTERNĂ PERIODICĂ</h1>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Simulare de formare · {dataAzi}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{s.denumire}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{s.localitate} · {s.nivel}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Coordonator al echipei de evaluare externă: <strong style={{ color: '#e2e8f0' }}>{numeEvaluator}</strong></div>

            <div style={{ display: 'inline-block', background: `${calFinal.color}15`, border: `2px solid ${calFinal.color}44`, borderRadius: 12, padding: '16px 32px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Nivel general de realizare (simulare)</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: calFinal.color }}>{calFinal.label}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Media indicatorilor: {scorGeneral.toFixed(2)} / 5,00 <span style={{ fontSize: 11 }}>(orientativ)</span></div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>Media este orientativă. Oficial, ARACIP nu mediază și nu compensează indicatorii — fiecare se apreciază individual, pe descriptori.</div>
            </div>

            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
              În procesul real, raportul se face public în conformitate cu prevederile art. 12 alin. (8) din H.G. nr. 993/2020, iar evaluarea externă periodică se finalizează cu atestatul privind nivelul calității educației furnizate de unitatea de învățământ.
            </div>
          </div>

          {/* Structura reală a raportului */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 22px', marginBottom: 20, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>Structura raportului de evaluare externă:</strong><br />
            PARTEA I — Scopul și concluziile vizitei de evaluare externă · PARTEA a II-a — Informații generale privind unitatea de învățământ · PARTEA a III-a — Surse informaționale · PARTEA a IV-a — Activitățile întreprinse în timpul vizitei
          </div>

          {/* PARTEA I — cele 5 întrebări fundamentale */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>PARTEA I — Scopul și concluziile vizitei</h2>
            <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 18, lineHeight: 1.6 }}>
              Constatările sunt raportate la cele 5 întrebări fundamentale (de la „nesatisfăcător" la „excelent"), prin corelarea calificativelor acordate indicatorilor (tabelul de corelare — Anexa 1 la raport).
            </p>
            {INTREBARI_FUNDAMENTALE.map(q => {
              const avg = scorMediu(q.indicatori)
              const c = calif(avg)
              return (
                <div key={q.nr} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ background: 'rgba(20,184,166,0.15)', color: '#5eead4', width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{q.nr}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.5, fontWeight: 600 }}>{q.text}</div>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>Prin corelarea constatărilor la indicatorii: {q.indicatori.join(', ')}</div>
                    </div>
                    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}44`, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, flexShrink: 0 }}>{c.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nivelul de realizare al indicatorilor — autoevaluare vs. evaluare externă */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Nivelul de realizare al indicatorilor</h2>
            <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 16 }}>Comparația dintre calificativul de autoevaluare (RAEI) și calificativul acordat la evaluarea externă — ca în modelul real de raport ARACIP.</p>
            {(['A', 'B', 'C'] as const).map(dom => {
              const meta = DOMENII_META[dom]
              return (
                <div key={dom} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: meta.culoare, marginBottom: 8 }}>{meta.titlu}</div>
                  {INDICATORI.filter(i => i.domeniu === dom).map(ind => {
                    const auto = calif(s.autoeval[ind.cod])
                    const ext = calif(calificative[ind.cod] || 1)
                    return (
                      <div key={ind.cod} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: meta.culoare, fontSize: 12, fontWeight: 800, width: 34, flexShrink: 0 }}>{ind.cod}</span>
                        <span style={{ flex: 1, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.4 }}>{ind.text}</span>
                        <span title="Autoevaluare (RAEI)" style={{ background: auto.bg, color: auto.color, fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, width: 34, textAlign: 'center', flexShrink: 0 }}>{auto.scurt}</span>
                        <span title="Evaluare externă" style={{ background: ext.bg, color: ext.color, fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: `1px solid ${ext.color}66`, width: 34, textAlign: 'center', flexShrink: 0 }}>{ext.scurt}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <div style={{ fontSize: 11.5, color: '#475569', marginTop: 8 }}>Coloana 1 = calificativ autoevaluare (RAEI) · Coloana 2 = calificativ evaluare externă. NS = Nesatisfăcător, S = Satisfăcător, B = Bine, FB = Foarte bine, E = Excelent.</div>
          </div>

          {/* Concluzii pe domenii: puncte tari + arii de îmbunătățire */}
          {domeniiScor.map(d => (
            <div key={d.dom} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{d.meta.titlu}</h2>
                <span style={{ background: d.c.bg, color: d.c.color, fontSize: 12.5, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>{d.c.label} ({d.avg.toFixed(2)})</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, marginBottom: 16 }}>
                <div style={{ background: d.meta.culoare, borderRadius: 4, height: 6, width: `${(d.avg / 5) * 100}%`, transition: 'width 0.5s' }} />
              </div>

              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#86efac', marginBottom: 6 }}>• Puncte tari identificate:</div>
              {puncteTari(d.dom).length === 0 && <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>Niciun indicator la nivelul standardelor de referință („Foarte bine"/„Excelent").</div>}
              {puncteTari(d.dom).map(i => (
                <div key={i.cod} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, marginBottom: 6, paddingLeft: 12 }}>
                  <strong style={{ color: '#86efac' }}>{i.cod}</strong> — {i.text}{constatari[i.cod] ? <em style={{ color: '#64748b' }}> · {constatari[i.cod]}</em> : ''}
                </div>
              ))}

              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fbbf24', margin: '12px 0 6px' }}>• Arii de îmbunătățire identificate:</div>
              {ariiImbunatatire(d.dom).length === 0 && <div style={{ fontSize: 13, color: '#64748b' }}>Toți indicatorii domeniului depășesc nivelul minim al standardelor de acreditare.</div>}
              {ariiImbunatatire(d.dom).map(i => {
                const e = calif(calificative[i.cod] || 1)
                return (
                  <div key={i.cod} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, marginBottom: 6, paddingLeft: 12 }}>
                    <strong style={{ color: e.val === 1 ? '#fca5a5' : '#fbbf24' }}>{i.cod} ({e.label})</strong> — {i.text}{constatari[i.cod] ? <em style={{ color: '#64748b' }}> · {constatari[i.cod]}</em> : ''}
                    {e.val === 1 && <em style={{ color: '#fca5a5' }}> · Neîndeplinirea standardelor de acreditare impune măsuri de remediere, cu termene și responsabili.</em>}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Părțile II–IV, sintetic */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>PARTEA a II-a — Informații generale privind unitatea de învățământ</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {[
                { label: 'Nivel de învățământ', val: s.nivel },
                { label: 'An înființare', val: String(s.anInfiintare) },
                { label: 'Elevi/copii înscriși', val: String(s.nrElevi) },
                { label: 'Cadre didactice', val: String(s.nrProf) },
                { label: 'Promovabilitate', val: `${s.promovabilitate}%` },
                { label: 'Rată abandon', val: `${s.abandon}%` },
              ].map(f => (
                <div key={f.label} style={{ background: '#0f172a', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#e2e8f0' }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>PARTEA a III-a — Surse informaționale</h2>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              <li>Documentele unității din platforma calitate.aracip.eu ({docsBifate} documente analizate, conform Instrucțiunilor ARACIP nr. 1–3/2022)</li>
              <li>RAEI pe ultimii 3 ani (autoevaluarea instituțională)</li>
              <li>Interviuri cu directorul, coordonatorul CEAC, cadre didactice, părinți și elevi</li>
              <li>Observarea directă și asistențe la activitățile de învățare</li>
            </ul>
            {constatariDoc && (
              <div style={{ marginTop: 12, fontSize: 13, color: '#94a3b8', lineHeight: 1.6, background: '#0f172a', borderRadius: 10, padding: '12px 14px' }}>
                <strong style={{ color: '#e2e8f0' }}>Constatări din analiza documentelor:</strong> {constatariDoc}
              </div>
            )}
          </div>

          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '24px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>PARTEA a IV-a — Activitățile întreprinse în timpul vizitei</h2>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              <li>Analiza documentelor și verificarea concordanței cu realitatea din unitate</li>
              <li>Vizitarea spațiilor școlare, administrative și auxiliare; verificarea accesibilității (I7)</li>
              <li>Completarea grilei de evaluare pe cei 24 de indicatori de performanță</li>
              <li>Interviuri și asistențe la activitățile de învățare (I11)</li>
            </ul>
            {INTERVIURI.filter(iv => noteInterviu[iv.id]).map(iv => (
              <div key={iv.id} style={{ marginTop: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.6, background: '#0f172a', borderRadius: 10, padding: '10px 14px' }}>
                <strong style={{ color: '#e2e8f0' }}>{iv.rol}:</strong> {noteInterviu[iv.id]}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { setEtapa('selectie'); setCalificative({}); setConstatari({}); setDovezi({}); setDocAnalizate({}); setConstatariDoc(''); setNoteInterviu({}) }} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Evaluare nouă
            </button>
            <button onClick={() => router.push('/formare')} style={{ flex: 1, padding: '14px', background: '#14b8a6', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Înapoi la platformă
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
