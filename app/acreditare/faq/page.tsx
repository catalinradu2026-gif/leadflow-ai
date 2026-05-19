'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '../../hooks/useIsMobile'

const CATEGORII = [
  { id: 'toate', label: 'Toate' },
  { id: 'autorizare', label: 'Autorizare' },
  { id: 'acreditare', label: 'Acreditare' },
  { id: 'evaluare', label: 'Evaluare Periodică' },
  { id: 'documente', label: 'Documente' },
  { id: 'termene', label: 'Termene & Taxe' },
]

const INTREBARI = [
  // AUTORIZARE
  {
    id: 1, categorie: 'autorizare',
    intrebare: 'Ce este autorizarea de funcționare provizorie?',
    raspuns: 'Autorizarea de funcționare provizorie este prima etapă obligatorie pentru orice unitate școlară nouă. Fără aceasta, unitatea funcționează ilegal. ARACIP verifică dacă sunt îndeplinite standardele minime de funcționare: spații conforme, personal calificat, documente de bază. Valabilitatea este temporară — până la acreditare.',
  },
  {
    id: 2, categorie: 'autorizare',
    intrebare: 'Ce documente sunt necesare pentru autorizare?',
    raspuns: 'Dosarul de autorizare include: cerere tip ARACIP, acte de proprietate sau folosință spații, aviz ISU (pompieri), aviz DSP (sanitar), plan de școlarizare propus, lista cadrelor didactice cu grade și titluri, regulament intern, ofertă educațională. Documentele se depun în format digital prin platforma ARACIP.',
  },
  {
    id: 3, categorie: 'autorizare',
    intrebare: 'Cât durează procesul de autorizare?',
    raspuns: 'ARACIP procesează cererea în 30-60 de zile lucrătoare de la depunerea dosarului complet. Dacă dosarul este incomplet, se trimite o notificare și termenul se reia de la data completării. Recomandăm depunerea cu cel puțin 3 luni înainte de data planificată pentru începerea activității.',
  },
  {
    id: 4, categorie: 'autorizare',
    intrebare: 'Ce se întâmplă dacă funcționăm fără autorizație?',
    raspuns: 'Funcționarea fără autorizație ARACIP este ilegală. Unitățile care funcționează fără autorizație sunt pasibile de amendă conform Legii Educației, iar diplomele eliberate nu sunt recunoscute de stat. ISJ poate dispune încetarea activității imediate.',
  },
  {
    id: 5, categorie: 'autorizare',
    intrebare: 'Poate fi respinsă cererea de autorizare?',
    raspuns: 'Da. ARACIP poate respinge cererea dacă standardele minime nu sunt îndeplinite: spații sub normativ, lipsa avizelor obligatorii, personal necalificat sau documente lipsă. Unitatea poate corecta deficiențele și redepune cererea. Există dreptul de contestație în 15 zile de la comunicarea deciziei.',
  },

  // ACREDITARE
  {
    id: 6, categorie: 'acreditare',
    intrebare: 'Care este diferența dintre autorizare și acreditare?',
    raspuns: 'Autorizarea (provizie) permite funcționarea unității noi pe baza verificării standardelor minime. Acreditarea (permanentă) confirmă că unitatea oferă educație de calitate după cel puțin 1 an de activitate. Acreditarea implică o evaluare completă: autoevaluare + vizita comisiei ARACIP + decizie. Acreditarea este valabilă 5 ani.',
  },
  {
    id: 7, categorie: 'acreditare',
    intrebare: 'Ce sunt criteriile A1, A2 și A3?',
    raspuns: 'ARACIP evaluează trei domenii principale: A1 — Capacitatea instituțională (spații, dotări, resurse umane, management); A2 — Eficacitatea educațională (programe, rezultate elevi, activitate didactică); A3 — Managementul calității (proceduri, autoevaluare, îmbunătățire continuă, transparență). Fiecare criteriu are standarde și indicatori specifici.',
  },
  {
    id: 8, categorie: 'acreditare',
    intrebare: 'Ce este raportul de autoevaluare?',
    raspuns: 'Raportul de autoevaluare (RAE) este documentul central al procesului de acreditare. Școala îl completează conform modelului ARACIP, evaluând fiecare standard și indicator din A1-A3. RAE trebuie să fie realist și susținut de dovezi concrete (fotografii, documente, statistici). Un RAE prea optimist poate fi contraproductiv la vizita comisiei.',
  },
  {
    id: 9, categorie: 'acreditare',
    intrebare: 'Cum decurge vizita comisiei ARACIP?',
    raspuns: 'Vizita durează 2 zile și include: inspecția spațiilor și dotărilor, discuții cu conducerea și cadrele didactice, analiza documentelor (ROI, PDI, proceduri, cataloage), observarea activităților didactice și discuții cu elevii și părinții. Comisia este formată din evaluatori externi desemnați de ARACIP, nu inspectori locali.',
  },
  {
    id: 10, categorie: 'acreditare',
    intrebare: 'Ce calificative poate acorda ARACIP?',
    raspuns: 'ARACIP acordă patru calificative: Excelent, Bine, Satisfăcător (acestea trei conduc la acreditare) și Nesatisfăcător (nu se acordă acreditarea). Unitatea cu calificativ "Nesatisfăcător" poate contesta în 15 zile sau corecta deficiențele și solicita o nouă evaluare.',
  },
  {
    id: 11, categorie: 'acreditare',
    intrebare: 'Cât timp este valabilă acreditarea?',
    raspuns: 'Acreditarea este valabilă 5 ani. La expirare, unitatea trebuie să parcurgă evaluarea externă periodică pentru menținerea acreditării. ARACIP planifică vizitele din timp și notifică unitățile în avans. Acreditarea poate fi suspendată sau retrasă dacă standardele nu mai sunt menținute.',
  },
  {
    id: 12, categorie: 'acreditare',
    intrebare: 'Câte cadre didactice titulare sunt obligatorii?',
    raspuns: 'Cel puțin 80% din cadrele didactice trebuie să fie titulare sau detașate cu grade didactice (definitivat, gradul II sau gradul I). Profesorii suplinitori pot reprezenta maximum 20% din personal. Această cerință este verificată atât la autorizare, cât și la acreditare.',
  },

  // EVALUARE PERIODICA
  {
    id: 13, categorie: 'evaluare',
    intrebare: 'Evaluarea periodică este obligatorie pentru toate școlile?',
    raspuns: 'Da, evaluarea externă periodică este obligatorie pentru TOATE unitățile de învățământ preuniversitar acreditate — atât de stat, cât și private. Ciclul este de 5 ani. Nesuportarea evaluării sau obținerea calificativului "Nesatisfăcător" poate duce la pierderea acreditării.',
  },
  {
    id: 14, categorie: 'evaluare',
    intrebare: 'Cine stabilește data vizitei pentru evaluarea periodică?',
    raspuns: 'ARACIP planifică și programează vizitele, nu unitățile școlare. Planificarea se face pe județe și ani școlari, iar unitățile sunt notificate cu cel puțin 30 de zile înainte. Nu este posibilă reprogramarea unilaterală — doar în situații excepționale cu justificare și aprobare ARACIP.',
  },
  {
    id: 15, categorie: 'evaluare',
    intrebare: 'Ce se întâmplă dacă obținem "Nesatisfăcător" la evaluarea periodică?',
    raspuns: 'Calificativul "Nesatisfăcător" la evaluarea periodică inițiază procedura de retragere a acreditării. Unitatea are 30 de zile să conteste sau să prezinte un plan de remediere. ARACIP poate acorda un termen suplimentar pentru corectarea deficiențelor grave, dar fără îmbunătățire, acreditarea este retrasă.',
  },
  {
    id: 16, categorie: 'evaluare',
    intrebare: 'Evaluarea periodică se desfășoară similar cu acreditarea?',
    raspuns: 'Procesul este similar: raport de autoevaluare completat de școală + vizita comisiei ARACIP (2 zile) + deliberare + decizie cu calificativ. Comisia evaluează aceleași trei criterii A1-A3, dar acordă mai multă atenție evoluției față de evaluarea anterioară și sustenabilității calității.',
  },

  // DOCUMENTE
  {
    id: 17, categorie: 'documente',
    intrebare: 'Ce este Planul de Dezvoltare Instituțională (PDI)?',
    raspuns: 'PDI este documentul strategic al școlii, elaborat pe 4 ani. Descrie viziunea, misiunea, obiectivele strategice și planul de acțiune al unității. Este obligatoriu pentru acreditare și trebuie să fie actualizat și în vigoare la momentul vizitei. Un PDI expirat este considerat o deficiență majoră.',
  },
  {
    id: 18, categorie: 'documente',
    intrebare: 'Câte proceduri operaționale sunt necesare?',
    raspuns: 'ARACIP solicită minimum 10-15 proceduri operaționale care să acopere principalele activități ale școlii: admitere, evaluare elevi, gestionarea situațiilor de criză, achiziții, relații cu părinții etc. Procedurile trebuie să fie aprobate de Consiliul de Administrație, asumate de personal și efectiv aplicate.',
  },
  {
    id: 19, categorie: 'documente',
    intrebare: 'Ce trebuie să conțină Regulamentul de Ordine Interioară (ROI)?',
    raspuns: 'ROI reglementează drepturile și obligațiile elevilor, părinților și personalului. Trebuie să fie actualizat anual, aprobat în Consiliul de Administrație și comunicat tuturor părților. Un ROI din 2018 neactualizat este un semnal de alarmă pentru comisia ARACIP.',
  },
  {
    id: 20, categorie: 'documente',
    intrebare: 'Ce sunt portofoliile cadrelor didactice?',
    raspuns: 'Fiecare cadru didactic trebuie să aibă un portofoliu profesional cu: fișa postului semnată și actualizată, planificările calendaristice, probe de evaluare aplicate, dovezi de formare continuă, participări la activități extracurriculare. Portofoliile sunt verificate de comisie în cadrul vizitei.',
  },
  {
    id: 21, categorie: 'documente',
    intrebare: 'Este obligatorie biblioteca pentru toate școlile?',
    raspuns: 'Biblioteca este obligatorie pentru licee, cu minimum 1.000 de volume. Pentru școli primare și gimnazii, este recomandată, dar nu obligatorie prin normativ. Totuși, lipsa unui spațiu de lectură sau a resurselor bibliografice influențează negativ evaluarea criteriului A1 (capacitate instituțională).',
  },

  // TERMENE & TAXE
  {
    id: 22, categorie: 'termene',
    intrebare: 'Există taxe pentru procesele ARACIP?',
    raspuns: 'Nu există taxe directe pentru unitățile de stat. Pentru unitățile private, pot exista tarife de evaluare stabilite prin hotărâre de guvern. Verificați pe aracip.eu sau contactați direct ARACIP pentru detalii actualizate privind tarifele în vigoare.',
  },
  {
    id: 23, categorie: 'termene',
    intrebare: 'Care sunt termenele legale pentru fiecare procedură?',
    raspuns: 'Autorizare: 30-60 zile lucrătoare. Acreditare după depunerea RAE: 60-90 de zile pentru programarea vizitei. Contestații: 15 zile de la comunicarea deciziei. Evaluare periodică: planificată de ARACIP cu 30 de zile înainte. Răspuns la solicitări: 10-15 zile lucrătoare.',
  },
  {
    id: 24, categorie: 'termene',
    intrebare: 'Pot fi contestate deciziile ARACIP?',
    raspuns: 'Da. Orice decizie ARACIP poate fi contestată în 15 zile calendaristice de la comunicare. Contestația se depune la ARACIP și este analizată de o comisie independentă. Dacă contestația este respinsă, se poate face plângere la instanța de contencios administrativ.',
  },
  {
    id: 25, categorie: 'termene',
    intrebare: 'Când trebuie depus RAE înainte de vizita ARACIP?',
    raspuns: 'Raportul de autoevaluare trebuie depus cu minimum 30 de zile înainte de vizita programată a comisiei. ARACIP confirmă primirea și poate solicita clarificări sau completări. Nedepunerea RAE la termen poate duce la reprogramarea vizitei sau la penalizări în evaluare.',
  },
]

export default function FAQ() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [categorie, setCategorie] = useState('toate')
  const [cautare, setCautare] = useState('')
  const [deschis, setDeschis] = useState<number | null>(null)

  const intrebari = INTREBARI.filter(f => {
    const matchCat = categorie === 'toate' || f.categorie === categorie
    const matchSearch = f.intrebare.toLowerCase().includes(cautare.toLowerCase()) || f.raspuns.toLowerCase().includes(cautare.toLowerCase())
    return matchCat && matchSearch
  })

  const CAT_COLORS: Record<string, string> = {
    autorizare: '#3b82f6',
    acreditare: '#a855f7',
    evaluare: '#14b8a6',
    documente: '#f59e0b',
    termene: '#6366f1',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => router.push('/acreditare')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Acreditare</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span>❓</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>Întrebări Frecvente ARACIP</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>25 întrebări · ghid pas cu pas</div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '16px' : '28px 24px' }}>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            placeholder="🔍 Caută în întrebări frecvente..."
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
              {c.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569', alignSelf: 'center' }}>{intrebari.length} întrebări</span>
        </div>

        {/* FAQ list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {intrebari.map(f => {
            const color = CAT_COLORS[f.categorie] || '#64748b'
            return (
              <div
                key={f.id}
                style={{
                  background: deschis === f.id ? `${color}08` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${deschis === f.id ? color + '33' : 'rgba(255,255,255,0.06)'}`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  onClick={() => setDeschis(deschis === f.id ? null : f.id)}
                  style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                >
                  <span style={{ color, fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>?</span>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: deschis === f.id ? '#f1f5f9' : '#cbd5e1', lineHeight: 1.4 }}>
                    {f.intrebare}
                  </div>
                  <span style={{ color: '#475569', fontSize: '12px', flexShrink: 0 }}>{deschis === f.id ? '▲' : '▼'}</span>
                </div>
                {deschis === f.id && (
                  <div style={{ padding: '0 16px 16px 44px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.8 }}>
                    {f.raspuns}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {intrebari.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>Nicio întrebare găsită.</div>
        )}

        {/* ARA promo */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '36px' }}>🏛️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Nu găsești răspunsul?</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Întreabă-o pe ARA — asistentul nostru AI disponibil 24/7. Apasă butonul 🏛️ din colțul din dreapta jos.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
