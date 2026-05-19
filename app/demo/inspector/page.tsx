'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const JUDETE = [
  { name: 'Alba', scoli: 198, active: 198, doc: 12, alert: 0 },
  { name: 'Arad', scoli: 221, active: 219, doc: 8, alert: 2 },
  { name: 'Argeș', scoli: 312, active: 310, doc: 15, alert: 0 },
  { name: 'Bacău', scoli: 287, active: 285, doc: 11, alert: 2 },
  { name: 'Bihor', scoli: 334, active: 334, doc: 9, alert: 0 },
  { name: 'Bistrița-Năsăud', scoli: 167, active: 165, doc: 7, alert: 2 },
  { name: 'Botoșani', scoli: 243, active: 241, doc: 10, alert: 2 },
  { name: 'Brăila', scoli: 142, active: 142, doc: 6, alert: 0 },
  { name: 'Brașov', scoli: 276, active: 276, doc: 14, alert: 0 },
  { name: 'Buzău', scoli: 231, active: 229, doc: 8, alert: 2 },
  { name: 'Călărași', scoli: 156, active: 154, doc: 5, alert: 2 },
  { name: 'Caraș-Severin', scoli: 178, active: 178, doc: 7, alert: 0 },
  { name: 'Cluj', scoli: 398, active: 398, doc: 18, alert: 0 },
  { name: 'Constanța', scoli: 341, active: 339, doc: 13, alert: 2 },
  { name: 'Covasna', scoli: 112, active: 112, doc: 5, alert: 0 },
  { name: 'Dâmbovița', scoli: 267, active: 265, doc: 9, alert: 2 },
  { name: 'Dolj', scoli: 240, active: 238, doc: 16, alert: 2 },
  { name: 'Galați', scoli: 223, active: 221, doc: 8, alert: 2 },
  { name: 'Giurgiu', scoli: 134, active: 134, doc: 4, alert: 0 },
  { name: 'Gorj', scoli: 189, active: 187, doc: 7, alert: 2 },
  { name: 'Harghita', scoli: 178, active: 178, doc: 6, alert: 0 },
  { name: 'Hunedoara', scoli: 201, active: 199, doc: 8, alert: 2 },
  { name: 'Ialomița', scoli: 143, active: 141, doc: 5, alert: 2 },
  { name: 'Iași', scoli: 412, active: 412, doc: 19, alert: 0 },
  { name: 'Ilfov', scoli: 167, active: 167, doc: 7, alert: 0 },
  { name: 'Maramureș', scoli: 256, active: 254, doc: 10, alert: 2 },
  { name: 'Mehedinți', scoli: 145, active: 143, doc: 6, alert: 2 },
  { name: 'Mureș', scoli: 298, active: 298, doc: 11, alert: 0 },
  { name: 'Neamț', scoli: 234, active: 232, doc: 9, alert: 2 },
  { name: 'Olt', scoli: 198, active: 196, doc: 7, alert: 2 },
  { name: 'Prahova', scoli: 356, active: 354, doc: 14, alert: 2 },
  { name: 'Sălaj', scoli: 134, active: 134, doc: 5, alert: 0 },
  { name: 'Satu Mare', scoli: 178, active: 176, doc: 6, alert: 2 },
  { name: 'Sibiu', scoli: 212, active: 212, doc: 9, alert: 0 },
  { name: 'Suceava', scoli: 378, active: 376, doc: 16, alert: 2 },
  { name: 'Teleorman', scoli: 167, active: 165, doc: 6, alert: 2 },
  { name: 'Timiș', scoli: 312, active: 312, doc: 13, alert: 0 },
  { name: 'Tulcea', scoli: 134, active: 132, doc: 5, alert: 2 },
  { name: 'Vâlcea', scoli: 189, active: 187, doc: 7, alert: 2 },
  { name: 'Vaslui', scoli: 223, active: 221, doc: 8, alert: 2 },
  { name: 'Vrancea', scoli: 167, active: 165, doc: 6, alert: 2 },
  { name: 'Municipiul București', scoli: 512, active: 512, doc: 24, alert: 0 },
]

const SCOLI_DEMO = [
  'Liceul Teoretic "Amărăștii de Jos" — Dolj',
  'Colegiul Național "Elena Cuza" — Craiova',
  'Liceul Teoretic "Henri Coandă" — Craiova',
  'Colegiul Național "Mihai Eminescu" — Iași',
  'Liceul Teoretic "George Coșbuc" — Cluj',
  'Colegiul Național "Gheorghe Lazăr" — București',
]

const totalScoli = JUDETE.reduce((s, j) => s + j.scoli, 0)
const totalActive = JUDETE.reduce((s, j) => s + j.active, 0)
const totalAlerte = JUDETE.reduce((s, j) => s + j.alert, 0)

type TipUnitate = 'Liceu' | 'Colegiu' | 'Școală' | 'Grădiniță'
type Scoala = { name: string; director: string; citit: boolean; activ: boolean; tip: TipUnitate }

function detectTip(name: string): TipUnitate {
  if (name.toLowerCase().startsWith('grădiniță') || name.toLowerCase().startsWith('gradinita')) return 'Grădiniță'
  if (name.toLowerCase().startsWith('colegiu') || name.toLowerCase().startsWith('colegiul')) return 'Colegiu'
  if (name.toLowerCase().startsWith('liceu') || name.toLowerCase().startsWith('liceul')) return 'Liceu'
  return 'Școală'
}

const SCOLI_PER_JUDET: Record<string, Scoala[]> = {
  'Dolj': [
    { name: 'Liceul Teoretic "Amărăștii de Jos"', director: 'Ion Marin', citit: true, activ: true, tip: 'Liceu' },
    { name: 'Colegiul Național "Elena Cuza"', director: 'Maria Ionescu', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Liceul Teoretic "Henri Coandă"', director: 'Andrei Popescu', citit: true, activ: true, tip: 'Liceu' },
    { name: 'Școala Gimnazială Nr. 12 Craiova', director: 'Elena Dumitrescu', citit: false, activ: true, tip: 'Școală' },
    { name: 'Colegiul Tehnic "Costin D. Nenițescu"', director: 'Gheorghe Stan', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Liceul cu Program Sportiv', director: 'Florin Popa', citit: false, activ: false, tip: 'Liceu' },
    { name: 'Grădinița Nr. 3 Craiova', director: 'Ana Stoica', citit: true, activ: true, tip: 'Grădiniță' },
    { name: 'Grădinița Nr. 11 Craiova', director: 'Ioana Vlad', citit: true, activ: true, tip: 'Grădiniță' },
    { name: 'Școala Gimnazială "Nicolae Titulescu"', director: 'Mihai Tudorache', citit: true, activ: true, tip: 'Școală' },
  ],
  'Bacău': [
    { name: 'Colegiul Național "Gheorghe Vrânceanu"', director: 'Ioana Toma', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Liceul Teoretic "Henri Coandă" Bacău', director: 'Radu Dinu', citit: false, activ: true, tip: 'Liceu' },
    { name: 'Școala Gimnazială "Alexandru cel Bun"', director: 'Cristina Olaru', citit: false, activ: false, tip: 'Școală' },
    { name: 'Colegiul Economic "Ion Ghica"', director: 'Vasile Lungu', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Grădinița Nr. 7 Bacău', director: 'Mihaela Cojocaru', citit: true, activ: true, tip: 'Grădiniță' },
    { name: 'Grădinița "Lumina" Bacău', director: 'Alina Rus', citit: true, activ: true, tip: 'Grădiniță' },
  ],
  'Arad': [
    { name: 'Colegiul Național "Moise Nicoară"', director: 'Petru Buda', citit: false, activ: true, tip: 'Colegiu' },
    { name: 'Liceul Teoretic "Adam Müller-Guttenbrunn"', director: 'Ileana Feier', citit: true, activ: true, tip: 'Liceu' },
    { name: 'Școala Gimnazială Nr. 1 Arad', director: 'Dorin Sabău', citit: false, activ: false, tip: 'Școală' },
    { name: 'Colegiul Tehnic "Mihai Viteazul"', director: 'Lucia Popa', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Grădinița Nr. 5 Arad', director: 'Elena Feier', citit: true, activ: true, tip: 'Grădiniță' },
  ],
  'Constanța': [
    { name: 'Colegiul Național "Mircea cel Bătrân"', director: 'Nelu Pănescu', citit: false, activ: true, tip: 'Colegiu' },
    { name: 'Liceul Teoretic "Ovidius"', director: 'Simona Grigore', citit: true, activ: true, tip: 'Liceu' },
    { name: 'Școala Gimnazială Nr. 3 Constanța', director: 'Adrian Neagu', citit: false, activ: false, tip: 'Școală' },
    { name: 'Colegiul Economic "Virgil Madgearu"', director: 'Carmen Stan', citit: true, activ: true, tip: 'Colegiu' },
    { name: 'Grădinița Nr. 2 Constanța', director: 'Roxana Mihai', citit: true, activ: true, tip: 'Grădiniță' },
  ],
}

const TIP_COLORS: Record<TipUnitate, { bg: string; color: string }> = {
  'Liceu':      { bg: '#1e3a5f', color: '#93c5fd' },
  'Colegiu':    { bg: '#4c1d95', color: '#c4b5fd' },
  'Școală':     { bg: '#064e3b', color: '#6ee7b7' },
  'Grădiniță':  { bg: '#713f12', color: '#fde68a' },
}

function getScoliJudet(judet: string): Scoala[] {
  if (SCOLI_PER_JUDET[judet]) return SCOLI_PER_JUDET[judet]
  const j = JUDETE.find(x => x.name === judet)
  if (!j) return []
  const necitite = j.alert
  const tipuriCyclice: TipUnitate[] = ['Liceu', 'Colegiu', 'Școală', 'Grădiniță', 'Liceu', 'Școală', 'Grădiniță', 'Colegiu']
  const result: Scoala[] = []
  for (let i = 0; i < Math.min(j.scoli, 8); i++) {
    const tip = tipuriCyclice[i % tipuriCyclice.length]
    result.push({
      name: `${tip === 'Grădiniță' ? 'Grădinița Nr.' : tip === 'Școală' ? 'Școala Gimnazială' : tip + 'l'} "${['Mihai Eminescu', 'Ion Creangă', 'Vasile Alecsandri', 'George Enescu', 'Nicolae Bălcescu'][i % 5]}" ${judet}`,
      director: `${['Ion', 'Maria', 'Andrei', 'Elena', 'Gheorghe', 'Florin', 'Ana', 'Mihai'][i % 8]} ${['Ionescu', 'Popescu', 'Stan', 'Dumitrescu', 'Marin', 'Popa', 'Stoica', 'Tudor'][i % 8]}`,
      citit: i >= necitite,
      activ: i >= (necitite > 0 ? necitite - 1 : 0),
      tip,
    })
  }
  return result
}

type Doc = {
  id: number
  titlu: string
  data: string
  target: 'national' | 'judet' | 'scoala'
  targetName: string
  destinatari: number
  citite: number
  tip: string
}

const DOCS_INITIALE: Doc[] = [
  { id: 1, titlu: 'Metodologie Evaluare Națională 2026', data: '15 mai 2026', target: 'national', targetName: 'Toate județele', destinatari: 11500, citite: 9847, tip: 'Metodologie' },
  { id: 2, titlu: 'Circular privind raportarea statistică trimestrială', data: '10 mai 2026', target: 'national', targetName: 'Toate județele', destinatari: 11500, citite: 11500, tip: 'Circular' },
  { id: 3, titlu: 'Procedură dotări PNRR — județe pilot', data: '5 mai 2026', target: 'judet', targetName: 'ISJ Dolj, ISJ Cluj, ISJ Iași', destinatari: 850, citite: 820, tip: 'Procedură' },
  { id: 4, titlu: 'Adresă verificare conformitate — licee teoretice', data: '28 apr 2026', target: 'scoala', targetName: 'Liceul Teoretic "Amărăștii de Jos"', destinatari: 1, citite: 1, tip: 'Adresă' },
]

export default function InspectorNational() {
  const router = useRouter()
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [showNotifISJ, setShowNotifISJ] = useState(false)
  const [notifISJSelected, setNotifISJSelected] = useState<string[]>([])
  const [notifISJMsg, setNotifISJMsg] = useState('')
  const [notifISJSent, setNotifISJSent] = useState(false)
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [docs, setDocs] = useState<Doc[]>(DOCS_INITIALE)
  const [tab, setTab] = useState<'judete' | 'documente'>('judete')
  const [judetModal, setJudetModal] = useState<string | null>(null)
  const [judetTipFilter, setJudetTipFilter] = useState<string>('Toate')
  const [showAlerte, setShowAlerte] = useState(false)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const timeStr = now.toLocaleString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadTip, setUploadTip] = useState('Circular')
  const [uploadTarget, setUploadTarget] = useState<'national' | 'judet' | 'scoala'>('national')
  const [uploadJudete, setUploadJudete] = useState<string[]>([])
  const [uploadScoala, setUploadScoala] = useState(SCOLI_DEMO[0])
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)

  const filtered = JUDETE.filter(j => j.name.toLowerCase().includes(search.toLowerCase()))

  function targetLabel(d: Doc) {
    if (d.target === 'national') return { text: '🇷🇴 Național', color: '#1d4ed8', bg: '#1e3a5f' }
    if (d.target === 'judet') return { text: '🏛️ Județean', color: '#0891b2', bg: '#0c4a6e' }
    return { text: '🏫 Școală', color: '#059669', bg: '#064e3b' }
  }

  function destinatariLabel(d: Doc) {
    if (d.target === 'national') return '42 ISJ-uri · 11.500 directori'
    if (d.target === 'judet') return d.targetName
    return d.targetName
  }

  async function handleUpload() {
    if (!uploadTitle.trim()) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1800))

    let targetName = 'Toate județele'
    let destinatari = 11500
    if (uploadTarget === 'judet') {
      targetName = uploadJudete.length ? uploadJudete.join(', ') : 'ISJ selectate'
      destinatari = uploadJudete.reduce((s, j) => {
        const found = JUDETE.find(x => x.name === j)
        return s + (found ? found.scoli : 0)
      }, 0) || 240
    } else if (uploadTarget === 'scoala') {
      targetName = uploadScoala
      destinatari = 1
    }

    setDocs(prev => [{
      id: prev.length + 1,
      titlu: uploadTitle,
      data: '19 mai 2026',
      target: uploadTarget,
      targetName,
      destinatari,
      citite: 0,
      tip: uploadTip,
    }, ...prev])

    setUploading(false)
    setUploadDone(true)
    setTimeout(() => {
      setShowUpload(false)
      setUploadDone(false)
      setUploadTitle('')
      setUploadTarget('national')
      setUploadJudete([])
    }, 2200)
  }

  function handleBroadcast() {
    if (!broadcastMsg.trim()) return
    setBroadcastSent(true)
    setTimeout(() => { setShowBroadcast(false); setBroadcastSent(false); setBroadcastMsg('') }, 2000)
  }

  function toggleJudet(name: string) {
    setUploadJudete(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name])
  }

  const newDocsCount = docs.filter(d => d.citite === 0).length

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🇷🇴 Inspector Național</span>
          <span style={{ background: '#1d4ed8', color: '#93c5fd', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>NIVEL NAȚIONAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</span>
          <button
            onClick={() => setShowUpload(true)}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📄 Încarcă Document
          </button>
          <button
            onClick={() => setShowNotifISJ(true)}
            style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            🏛️ Notifică ISJ
          </button>
          <button
            onClick={() => setShowBroadcast(true)}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            📢 Broadcast
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Unități Școlare', val: totalScoli.toLocaleString('ro'), icon: '🏫', color: '#3b82f6', sub: 'școli + grădinițe', click: null },
            { label: 'Județe Conectate', val: '42 / 42', icon: '✅', color: '#10b981', sub: 'toate active', click: null },
            { label: 'Conectate Azi', val: totalActive.toLocaleString('ro'), icon: '🟢', color: '#22c55e', sub: `din ${totalScoli.toLocaleString('ro')} total`, click: null },
            { label: 'Alerte Nerezolvate', val: totalAlerte, icon: '⚠️', color: '#f59e0b', sub: 'click pentru detalii', click: () => setShowAlerte(true) },
          ].map(s => (
            <div
              key={s.label}
              onClick={s.click ?? undefined}
              style={{
                background: '#1e293b',
                border: `1px solid ${s.click ? '#f59e0b' : '#334155'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: s.click ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (s.click) (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,158,11,0.1)' }}
              onMouseLeave={e => { if (s.click) (e.currentTarget as HTMLDivElement).style.background = '#1e293b' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '12px', color: s.click ? '#f59e0b' : '#475569', marginTop: '4px' }}>{s.sub}</div>
                </div>
                <div style={{ fontSize: '28px' }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '16px' }}>
          {[
            { key: 'judete', label: '🗺️ Situație Județe' },
            { key: 'documente', label: `📄 Documente Publicate${newDocsCount > 0 ? ` (${newDocsCount} nou)` : ''}` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'judete' | 'documente')}
              style={{
                background: tab === t.key ? '#1d4ed8' : 'none',
                color: tab === t.key ? '#fff' : '#64748b',
                border: 'none', borderRadius: '8px', padding: '8px 18px',
                fontSize: '13px', fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* JUDETE TAB */}
        {tab === 'judete' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>Situație pe județe</h2>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Caută județ..."
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#e2e8f0', outline: 'none', width: '160px' }}
                />
              </div>
              <div style={{ overflowY: 'auto', maxHeight: '520px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', position: 'sticky', top: 0 }}>
                      {['Județ', 'Unități', 'Conectate', 'Documente', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((j, i) => (
                      <tr
                        key={j.name}
                        onClick={() => setJudetModal(j.name)}
                        style={{ borderBottom: '1px solid #1e293b', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}
                      >
                        <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                          {j.name}
                          <span style={{ fontSize: '11px', color: '#475569', marginLeft: '6px' }}>→</span>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: '13px', color: '#94a3b8' }}>{j.scoli}</td>
                        <td style={{ padding: '10px 16px', fontSize: '13px' }}>
                          <span style={{ color: j.active === j.scoli ? '#22c55e' : '#f59e0b' }}>{j.active}/{j.scoli}</span>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: '13px', color: '#60a5fa' }}>{j.doc}</td>
                        <td style={{ padding: '10px 16px' }}>
                          {j.alert > 0
                            ? <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠️ {j.alert} alerte</span>
                            : <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✓ OK</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar activitate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Activitate Recentă</h3>
                {[
                  { time: '09:38', text: 'ISJ Cluj a confirmat lectura Metodologiei EN 2026', color: '#22c55e' },
                  { time: '09:21', text: 'ISJ Iași — 412 directori notificați de noul document', color: '#3b82f6' },
                  { time: '08:55', text: '⚠️ ISJ Bacău — 2 ISJ-uri inactivi 48h', color: '#f59e0b' },
                  { time: '08:30', text: 'Document PNRR trimis la ISJ Dolj, Cluj, Iași', color: '#a78bfa' },
                  { time: '07:44', text: 'Adresă trimisă direct Liceul Amărăștii de Jos', color: '#67e8f9' },
                  { time: 'Ieri', text: '38 ISJ-uri au confirmat lectura circularului', color: '#22c55e' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', marginTop: '1px', minWidth: '36px' }}>{a.time}</span>
                    <span style={{ width: 3, minWidth: 3, background: a.color, borderRadius: '2px', alignSelf: 'stretch', minHeight: '16px' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{a.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Documente Naționale</h3>
                {[
                  { label: 'Total publicate', val: docs.length.toString(), color: '#3b82f6' },
                  { label: 'Naționale', val: docs.filter(d => d.target === 'national').length.toString(), color: '#60a5fa' },
                  { label: 'Județene', val: docs.filter(d => d.target === 'judet').length.toString(), color: '#67e8f9' },
                  { label: 'Per școală', val: docs.filter(d => d.target === 'scoala').length.toString(), color: '#6ee7b7' },
                  { label: 'Confirmare citire medie', val: '98.2%', color: '#10b981' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTE TAB */}
        {tab === 'documente' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {docs.map(doc => {
              const tl = targetLabel(doc)
              const pct = Math.round((doc.citite / Math.max(doc.destinatari, 1)) * 100)
              return (
                <div key={doc.id} style={{
                  background: '#1e293b',
                  border: `1px solid ${doc.citite === 0 ? '#f59e0b' : '#334155'}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div style={{ width: 44, height: 44, background: '#0f172a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {doc.citite === 0 && <span style={{ background: '#92400e', color: '#fcd34d', fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>NOU</span>}
                      <span style={{ background: '#1e40af', color: '#93c5fd', fontSize: '10px', fontWeight: 600, padding: '1px 8px', borderRadius: '20px' }}>{doc.tip}</span>
                      <span style={{ background: tl.bg, color: tl.color, fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '20px' }}>{tl.text}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{doc.titlu}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {doc.data} · <span style={{ color: '#94a3b8' }}>{destinatariLabel(doc)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: pct === 100 ? '#22c55e' : '#f59e0b' }}>
                      {doc.citite === 0 ? 'Se trimit notificări...' : `${pct}% confirmați`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {doc.citite}/{doc.destinatari} destinatari
                    </div>
                    {doc.citite > 0 && (
                      <div style={{ width: '120px', height: 4, background: '#334155', borderRadius: '2px', marginTop: '6px' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#22c55e' : '#f59e0b', borderRadius: '2px' }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '28px', width: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            {uploadDone ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Document publicat!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>
                  {uploadTarget === 'national' && 'Toți cei 11.500+ directori și 42 ISJ-uri au primit notificare instant.'}
                  {uploadTarget === 'judet' && `ISJ-urile selectate și directorii lor au primit notificare instant.`}
                  {uploadTarget === 'scoala' && 'Directorul școlii selectate a primit notificare instant.'}
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>📄 Publicare Document Oficial</h3>

                {/* Titlu */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titlu document</label>
                  <input
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="ex: Circular nr. 1250/2026 — ..."
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Tip */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip document</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Circular', 'Procedură', 'Adresă', 'Metodologie', 'Decizie'].map(t => (
                      <button
                        key={t}
                        onClick={() => setUploadTip(t)}
                        style={{
                          background: uploadTip === t ? '#1d4ed8' : '#0f172a',
                          border: `1px solid ${uploadTip === t ? '#3b82f6' : '#334155'}`,
                          color: uploadTip === t ? '#fff' : '#94a3b8',
                          borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TARGET SELECTOR */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destinatari</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { key: 'national', icon: '🇷🇴', label: 'Național', sub: '42 ISJ-uri\n11.500+ directori', color: '#1d4ed8', border: '#3b82f6' },
                      { key: 'judet', icon: '🏛️', label: 'Per Județ', sub: 'ISJ selectate\n+ directorii lor', color: '#0e7490', border: '#0891b2' },
                      { key: 'scoala', icon: '🏫', label: 'Per Școală', sub: 'O singură unitate\nșcolară', color: '#065f46', border: '#059669' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setUploadTarget(opt.key as 'national' | 'judet' | 'scoala')}
                        style={{
                          background: uploadTarget === opt.key ? opt.color : '#0f172a',
                          border: `2px solid ${uploadTarget === opt.key ? opt.border : '#334155'}`,
                          borderRadius: '10px', padding: '14px 10px', cursor: 'pointer', textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{opt.icon}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{opt.label}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* JUDETE SELECTOR */}
                {uploadTarget === 'judet' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Selectează județele ({uploadJudete.length} selectate)
                    </label>
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {JUDETE.map(j => (
                        <button
                          key={j.name}
                          onClick={() => toggleJudet(j.name)}
                          style={{
                            background: uploadJudete.includes(j.name) ? '#0e7490' : '#1e293b',
                            border: `1px solid ${uploadJudete.includes(j.name) ? '#0891b2' : '#334155'}`,
                            color: uploadJudete.includes(j.name) ? '#fff' : '#94a3b8',
                            borderRadius: '20px', padding: '3px 10px', fontSize: '11px', cursor: 'pointer',
                          }}
                        >
                          {j.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SCOALA SELECTOR */}
                {uploadTarget === 'scoala' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selectează școala</label>
                    <select
                      value={uploadScoala}
                      onChange={e => setUploadScoala(e.target.value)}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
                    >
                      {SCOLI_DEMO.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Sumar trimitere */}
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '12px', color: '#94a3b8' }}>
                  <strong style={{ color: '#60a5fa' }}>📊 Sumar:</strong>{' '}
                  {uploadTarget === 'national' && 'Documentul va fi trimis tuturor celor 42 ISJ-uri și 11.500+ directori din România. Toți vor primi notificare instantanee.'}
                  {uploadTarget === 'judet' && (uploadJudete.length === 0 ? 'Selectați cel puțin un județ.' : `Documentul va fi trimis la ${uploadJudete.length} ISJ${uploadJudete.length > 1 ? '-uri' : ''}: ${uploadJudete.join(', ')}.`)}
                  {uploadTarget === 'scoala' && `Documentul va fi trimis direct directorului de la: ${uploadScoala}.`}
                </div>

                {uploading ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#3b82f6', fontSize: '14px' }}>
                    🤖 Se publică documentul și se trimit notificări...
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowUpload(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                    <button
                      onClick={handleUpload}
                      disabled={!uploadTitle.trim() || (uploadTarget === 'judet' && uploadJudete.length === 0)}
                      style={{
                        flex: 2,
                        background: !uploadTitle.trim() || (uploadTarget === 'judet' && uploadJudete.length === 0) ? '#334155' : '#3b82f6',
                        color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600,
                        cursor: !uploadTitle.trim() || (uploadTarget === 'judet' && uploadJudete.length === 0) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Publică & Notifică →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ALERTE MODAL */}
      {showAlerte && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid #f59e0b', borderRadius: '16px', width: '700px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fcd34d' }}>⚠️ Alerte Nerezolvate — {totalAlerte} directori inactivi</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Directori care nu au accesat platforma în ultimele 48h sau nu au citit ultimul document</p>
              </div>
              <button onClick={() => setShowAlerte(false)} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕ Închide</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {JUDETE.filter(j => j.alert > 0).map(j => {
                const scoli = getScoliJudet(j.name).filter(s => !s.activ || !s.citit)
                return (
                  <div key={j.name}>
                    <div style={{ padding: '10px 24px', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>🏛️ ISJ {j.name}</span>
                      <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                        {j.alert} alertă{j.alert > 1 ? 'ri' : ''}
                      </span>
                    </div>
                    {scoli.map((s, i) => (
                      <div key={i} style={{ padding: '12px 24px 12px 36px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: !s.activ ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{s.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Director: {s.director}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {!s.activ && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>Inactiv 48h</span>}
                          {!s.citit && s.activ && <span style={{ background: '#451a03', color: '#fcd34d', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>Nu a citit</span>}
                        </div>
                      </div>
                    ))}
                    {scoli.length === 0 && (
                      <div style={{ padding: '12px 24px 12px 36px', display: 'flex', gap: '12px' }}>
                        {Array.from({ length: j.alert }).map((_, i) => (
                          <div key={i} style={{ fontSize: '13px', color: '#64748b' }}>Director #{i + 1} — inactiv 48h</div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid #334155', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAlerte(false)}
                style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}
              >
                Închide
              </button>
              <button
                onClick={() => { setShowAlerte(false); setBroadcastMsg('Vă rugăm să accesați platforma și să confirmați lectura ultimului document transmis. Termen: 24h.'); setShowBroadcast(true) }}
                style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                📢 Trimite reminder tuturor →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICA ISJ MODAL */}
      {showNotifISJ && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid #7c3aed', borderRadius: '16px', width: '620px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            {notifISJSent ? (
              <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Mesaj trimis!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>
                  {notifISJSelected.length === 1
                    ? `ISJ ${notifISJSelected[0]} a primit notificarea.`
                    : `${notifISJSelected.length} ISJ-uri au primit notificarea instant.`}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9' }}>🏛️ Notifică ISJ-uri</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Selectează ISJ-urile destinatare · {notifISJSelected.length > 0 ? <span style={{ color: '#a78bfa' }}>{notifISJSelected.length} selectate</span> : 'niciunul selectat'}
                    </p>
                  </div>
                  <button onClick={() => { setShowNotifISJ(false); setNotifISJSelected([]); setNotifISJMsg('') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Selectie rapida */}
                <div style={{ padding: '12px 24px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Selectare rapidă:</span>
                  <button
                    onClick={() => setNotifISJSelected(JUDETE.map(j => j.name))}
                    style={{ background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1d4ed8', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Toate (42)
                  </button>
                  <button
                    onClick={() => setNotifISJSelected(JUDETE.filter(j => j.alert > 0).map(j => j.name))}
                    style={{ background: '#451a03', color: '#fcd34d', border: '1px solid #92400e', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cu alerte ({JUDETE.filter(j => j.alert > 0).length})
                  </button>
                  <button
                    onClick={() => setNotifISJSelected([])}
                    style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Resetează
                  </button>
                </div>

                {/* Lista ISJ-uri */}
                <div style={{ overflowY: 'auto', maxHeight: '280px', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {JUDETE.map(j => {
                    const sel = notifISJSelected.includes(j.name)
                    return (
                      <button
                        key={j.name}
                        onClick={() => setNotifISJSelected(prev => sel ? prev.filter(x => x !== j.name) : [...prev, j.name])}
                        style={{
                          background: sel ? '#4c1d95' : '#0f172a',
                          border: `1px solid ${sel ? '#7c3aed' : j.alert > 0 ? '#92400e' : '#334155'}`,
                          color: sel ? '#e9d5ff' : j.alert > 0 ? '#fcd34d' : '#94a3b8',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: sel ? 700 : 400,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {sel ? '✓ ' : ''}{j.name}
                        {j.alert > 0 && <span style={{ fontSize: '10px', opacity: 0.8 }}>⚠️</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Mesaj */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid #334155' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mesaj</label>
                  <textarea
                    value={notifISJMsg}
                    onChange={e => setNotifISJMsg(e.target.value)}
                    placeholder="Scrieți mesajul pentru ISJ-urile selectate..."
                    rows={3}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 24px 20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => { setShowNotifISJ(false); setNotifISJSelected([]); setNotifISJMsg('') }}
                    style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Anulează
                  </button>
                  <button
                    onClick={() => {
                      if (!notifISJMsg.trim() || notifISJSelected.length === 0) return
                      setNotifISJSent(true)
                      setTimeout(() => { setShowNotifISJ(false); setNotifISJSent(false); setNotifISJSelected([]); setNotifISJMsg('') }, 2200)
                    }}
                    disabled={!notifISJMsg.trim() || notifISJSelected.length === 0}
                    style={{
                      flex: 2,
                      background: !notifISJMsg.trim() || notifISJSelected.length === 0 ? '#334155' : '#7c3aed',
                      color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600,
                      cursor: !notifISJMsg.trim() || notifISJSelected.length === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Trimite la {notifISJSelected.length || '0'} ISJ{notifISJSelected.length !== 1 ? '-uri' : ''} →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* JUDET DRILL-DOWN MODAL */}
      {judetModal && (() => {
        const toateScoli = getScoliJudet(judetModal)
        const scoli = judetTipFilter === 'Toate' ? toateScoli : toateScoli.filter(s => s.tip === judetTipFilter)
        const necitite = scoli.filter(s => !s.citit)
        const inactive = scoli.filter(s => !s.activ)
        const citite = scoli.filter(s => s.citit)
        const tipCounts = ['Liceu','Colegiu','Școală','Grădiniță'].map(t => ({ tip: t, count: toateScoli.filter(s => s.tip === t).length })).filter(x => x.count > 0)
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', width: '700px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9' }}>🏛️ ISJ {judetModal} — Situație unități</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {scoli.length} unități afișate · {necitite.length > 0 ? `${necitite.length} necitit` : 'toți au citit'} · {inactive.length > 0 ? `${inactive.length} inactivi` : 'toți activi'}
                  </p>
                </div>
                <button onClick={() => { setJudetModal(null); setJudetTipFilter('Toate') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕ Închide</button>
              </div>

              {/* Filtre tip */}
              <div style={{ padding: '12px 24px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tip:</span>
                {[{ tip: 'Toate', count: toateScoli.length }, ...tipCounts].map(({ tip, count }) => {
                  const sel = judetTipFilter === tip
                  const tc = tip !== 'Toate' ? TIP_COLORS[tip as TipUnitate] : { bg: '#1e293b', color: '#94a3b8' }
                  return (
                    <button key={tip} onClick={() => setJudetTipFilter(tip)} style={{
                      background: sel ? (tip !== 'Toate' ? tc.bg : '#334155') : '#0f172a',
                      border: `1px solid ${sel ? (tip !== 'Toate' ? tc.color : '#64748b') : '#334155'}`,
                      color: sel ? (tip !== 'Toate' ? tc.color : '#fff') : '#64748b',
                      borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: sel ? 700 : 400, cursor: 'pointer',
                    }}>
                      {tip} <span style={{ opacity: 0.7 }}>({count})</span>
                    </button>
                  )
                })}
              </div>

              {/* Sumar rapid */}
              <div style={{ padding: '12px 24px', borderBottom: '1px solid #334155', display: 'flex', gap: '10px' }}>
                {[
                  { val: citite.length, label: 'Au citit', bg: '#052e16', border: '#166534', color: '#22c55e' },
                  { val: necitite.length, label: 'Nu au citit', bg: '#7f1d1d', border: '#991b1b', color: '#fca5a5' },
                  { val: inactive.length, label: 'Inactivi', bg: '#451a03', border: '#92400e', color: '#fcd34d' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', padding: '8px 14px', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: s.color, opacity: 0.8, marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Lista */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {necitite.length > 0 && (
                  <div style={{ padding: '10px 24px 4px', fontSize: '11px', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚠️ Nu au citit ultimul document</div>
                )}
                {necitite.map((s, i) => {
                  const tc = TIP_COLORS[s.tip]
                  return (
                    <div key={`n${i}`} style={{ padding: '12px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(239,68,68,0.05)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.activ ? '#f59e0b' : '#ef4444', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ background: tc.bg, color: tc.color, fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px' }}>{s.tip}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Director: {s.director}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✗ Necitit</span>
                        {!s.activ && <span style={{ background: '#451a03', color: '#fcd34d', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⚠ Inactiv</span>}
                      </div>
                    </div>
                  )
                })}
                {citite.length > 0 && (
                  <div style={{ padding: '10px 24px 4px', fontSize: '11px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✓ Au confirmat lectura</div>
                )}
                {citite.map((s, i) => {
                  const tc = TIP_COLORS[s.tip]
                  return (
                    <div key={`c${i}`} style={{ padding: '12px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ background: tc.bg, color: tc.color, fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px' }}>{s.tip}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Director: {s.director}</div>
                      </div>
                      <span style={{ background: '#052e16', color: '#86efac', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>✓ Citit</span>
                    </div>
                  )
                })}
                {scoli.length === 0 && (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Nicio unitate de tip „{judetTipFilter}" în acest județ.</div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* BROADCAST MODAL */}
      {showBroadcast && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', width: '480px' }}>
            {broadcastSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>Broadcast trimis!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>Toți directorii și ISJ-urile din România au primit mesajul.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>📢 Broadcast Național</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Mesaj urgent către toți <strong style={{ color: '#f1f5f9' }}>11.500+ directori</strong> și <strong style={{ color: '#f1f5f9' }}>42 ISJ-uri</strong> din România.</p>
                <textarea
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Scrieți mesajul național..."
                  rows={4}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={() => setShowBroadcast(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Anulează</button>
                  <button onClick={handleBroadcast} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Trimite Național →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
