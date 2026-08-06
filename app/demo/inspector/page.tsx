'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, Fragment } from 'react'
import CalendarTermene from '../../components/CalendarTermene'
import AraArchive from '../../components/AraArchive'
import FormareAdminPanel from '../../components/FormareAdminPanel'
import { genereazaAutorizatie } from '../../../lib/autorizatie'
import { genereazaDecizie } from '../../../lib/decizieEvaluare'

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
  apiId?: string
  titlu: string
  data: string
  target: 'national' | 'judet' | 'scoala'
  targetName: string
  destinatari: number
  citite: number
  tip: string
  termen?: string
  urgent?: boolean
  readers?: { name: string; rol: string; tipScoala?: string; scoala?: string; la: string }[]
  nrInregistrare?: string
  pdfUrl?: string
}

// Fallback gol — documentele reale se încarcă din /api/documents
const DOCS_INITIALE: Doc[] = []

export default function InspectorNational() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [showNotifScoala, setShowNotifScoala] = useState(false)
  const [notifScoalaJudet, setNotifScoalaJudet] = useState('Dolj')
  const [notifScoalaScoala, setNotifScoalaScoala] = useState('')
  const [notifScoalaMsg, setNotifScoalaMsg] = useState('')
  const [notifScoalaSent, setNotifScoalaSent] = useState(false)
  const [showNotifISJ, setShowNotifISJ] = useState(false)
  const [notifISJSelected, setNotifISJSelected] = useState<string[]>([])
  const [notifISJMsg, setNotifISJMsg] = useState('')
  const [notifISJSent, setNotifISJSent] = useState(false)
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [docs, setDocs] = useState<Doc[]>(DOCS_INITIALE)
  const [tab, setTab] = useState<'judete' | 'documente' | 'arhiva' | 'formare'>('judete')
  const [judetModal, setJudetModal] = useState<string | null>(null)
  const [judetTipFilter, setJudetTipFilter] = useState<string>('Toate')
  const [showAlerte, setShowAlerte] = useState(false)

  // Rezumat LIVE formare pentru tabloul central (doar cifre agregate; detaliile complete
  // — cu date personale — rămân în tab-ul Formare, parolat).
  const [formareStats, setFormareStats] = useState<{ totalFormabili: number; totalEvaluatori: number; medieProgres: number; finalizati: number; certificate: number; total: number } | null>(null)
  useEffect(() => {
    fetch('/api/formare-stats')
      .then(r => r.json())
      .then(d => { if (d?.summary) setFormareStats(d.summary) })
      .catch(() => { /* fallback grațios — tabloul rămâne fără rezumatul formare */ })
  }, [])

  // RAEI generate de directori (din Generatorul RAEI) — apar live în tabloul central.
  const [raeiStats, setRaeiStats] = useState<{ total: number; pe_judet: Record<string, number>; recent: Array<{ nume_unitate: string; judet: string | null; nivel: string | null; an_scolar: string | null; created_at: string }> } | null>(null)
  useEffect(() => {
    fetch('/api/raei')
      .then(r => r.json())
      .then(d => { if (d?.ok) setRaeiStats({ total: d.total || 0, pe_judet: d.pe_judet || {}, recent: d.recent || [] }) })
      .catch(() => { /* fallback grațios */ })
  }, [])

  // Cereri de autorizare — cu decizie ARACIP (accept/respinge) + generare autorizație.
  type DocDosar = { tip: string; nume: string; url: string }
  type CerereAut = { id: string; nr_inregistrare: string; denumire: string; cui: string | null; judet: string | null; nivel: string | null; status: string; created_at: string; documente?: DocDosar[] }
  const [autorizariStats, setAutorizariStats] = useState<{ total: number; recent: CerereAut[] } | null>(null)
  const [araciPass, setAraciPass] = useState<string | null>(null)
  const [openDosar, setOpenDosar] = useState<string | null>(null)
  // Modale + toast (înlocuiesc prompt()/alert())
  const [showUnlock, setShowUnlock] = useState(false)
  const [unlockPass, setUnlockPass] = useState('')
  const [unlockErr, setUnlockErr] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<{ kind: 'aut' | 'eval'; id: string; denumire: string } | null>(null)
  const [rejectMotiv, setRejectMotiv] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; tip: 'ok' | 'err' } | null>(null)
  function showToast(msg: string, tip: 'ok' | 'err' = 'ok') { setToast({ msg, tip }); setTimeout(() => setToast(null), 3500) }
  const loadAutorizari = () => fetch('/api/autorizare').then(r => r.json()).then(d => { if (d?.ok) setAutorizariStats({ total: d.total || 0, recent: d.recent || [] }) }).catch(() => { /* fallback */ })
  useEffect(() => { loadAutorizari() }, [])

  function deblocheazaAraci() { setUnlockErr(''); setUnlockPass(''); setShowUnlock(true) }
  async function confirmUnlock() {
    if (!unlockPass) { setUnlockErr('Introduceți parola.'); return }
    setUnlocking(true); setUnlockErr('')
    try {
      const r = await fetch('/api/auth/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'admin', password: unlockPass }) })
      const d = await r.json()
      if (d?.ok) { setAraciPass(unlockPass); setShowUnlock(false); showToast('Decizii deblocate.') }
      else setUnlockErr('Parolă incorectă.')
    } catch { setUnlockErr('Eroare de conexiune.') } finally { setUnlocking(false) }
  }

  async function descarcaDocDosar(url: string, nume: string) {
    if (!araciPass) { showToast('Deblochează întâi deciziile ARACIP.', 'err'); return }
    try {
      const r = await fetch(`/api/autorizare/doc?url=${encodeURIComponent(url)}`, { headers: { 'x-password': araciPass } })
      if (!r.ok) { showToast('Nu s-a putut descărca documentul.', 'err'); return }
      const blob = await r.blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href; a.download = nume || 'document'; document.body.appendChild(a); a.click()
      a.remove(); setTimeout(() => URL.revokeObjectURL(href), 4000)
    } catch { showToast('Eroare la descărcare.', 'err') }
  }

  // Autorizare: aprobarea se trimite direct; respingerea deschide modalul de motiv.
  async function trimiteDecizieAut(id: string, status: 'autorizat' | 'respinsa', motiv?: string) {
    if (!araciPass) return false
    try {
      const r = await fetch('/api/autorizare', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-password': araciPass }, body: JSON.stringify({ id, status, motiv }) })
      const d = await r.json()
      if (d?.ok) { loadAutorizari(); return true }
      showToast(d?.error || 'Eroare la decizie.', 'err'); return false
    } catch { showToast('Eroare de conexiune.', 'err'); return false }
  }
  function decideAut(id: string, status: 'autorizat' | 'respinsa') {
    if (!araciPass) return
    if (status === 'respinsa') { const r = autorizariStats?.recent.find(x => x.id === id); setRejectTarget({ kind: 'aut', id, denumire: r?.denumire || '' }); setRejectMotiv(''); return }
    trimiteDecizieAut(id, 'autorizat').then(ok => { if (ok) showToast('Cerere autorizată. Solicitantul a fost notificat pe email.') })
  }

  // Cereri de acreditare + evaluare periodică (de la directori) — decizie ARACIP.
  type CerereEval = { id: string; nr_inregistrare: string; tip: string; denumire: string; cui: string | null; judet: string | null; nivel: string | null; calificativ: string | null; status: string; created_at: string }
  const [evaluariStats, setEvaluariStats] = useState<{ total: number; recent: CerereEval[] } | null>(null)
  const loadEvaluari = () => fetch('/api/evaluari').then(r => r.json()).then(d => { if (d?.ok) setEvaluariStats({ total: d.total || 0, recent: d.recent || [] }) }).catch(() => { /* fallback */ })
  useEffect(() => { loadEvaluari() }, [])

  async function trimiteDecizieEval(id: string, status: 'aprobat' | 'respinsa', motiv?: string) {
    if (!araciPass) return false
    try {
      const r = await fetch('/api/evaluari', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-password': araciPass }, body: JSON.stringify({ id, status, motiv }) })
      const d = await r.json()
      if (d?.ok) { loadEvaluari(); return true }
      showToast(d?.error || 'Eroare la decizie.', 'err'); return false
    } catch { showToast('Eroare de conexiune.', 'err'); return false }
  }
  function decideEval(id: string, status: 'aprobat' | 'respinsa') {
    if (!araciPass) return
    if (status === 'respinsa') { const r = evaluariStats?.recent.find(x => x.id === id); setRejectTarget({ kind: 'eval', id, denumire: r?.denumire || '' }); setRejectMotiv(''); return }
    trimiteDecizieEval(id, 'aprobat').then(ok => { if (ok) showToast('Solicitare aprobată. Directorul a fost notificat pe email.') })
  }

  async function confirmReject() {
    if (!rejectTarget) return
    setRejecting(true)
    const motiv = rejectMotiv.trim() || undefined
    const ok = rejectTarget.kind === 'aut'
      ? await trimiteDecizieAut(rejectTarget.id, 'respinsa', motiv)
      : await trimiteDecizieEval(rejectTarget.id, 'respinsa', motiv)
    setRejecting(false)
    if (ok) { setRejectTarget(null); showToast('Cerere respinsă. Solicitantul a fost notificat pe email.') }
  }

  // Lanțul calității LIVE — depuneri reale de la unități (din /api/unitati)
  type UnitateLive = {
    id: string; nume_unitate: string; judet: string; tip_unitate: string;
    localitate: string | null; status: string; calificativ_general: string | null;
    calificative_domenii: Record<string, string>; rezumat: string | null; created_at: string;
  }
  const [unitatiLive, setUnitatiLive] = useState<UnitateLive[]>([])
  const [aggJudetLive, setAggJudetLive] = useState<Record<string, number>>({})
  const [aggStatusLive, setAggStatusLive] = useState<Record<string, number>>({})
  const [aggCalificativLive, setAggCalificativLive] = useState<Record<string, number>>({})
  const [loadingLive, setLoadingLive] = useState(false)

  async function loadUnitatiLive() {
    setLoadingLive(true)
    try {
      const r = await fetch('/api/unitati')
      const j = await r.json()
      setUnitatiLive(j.unitati || [])
      setAggJudetLive(j.aggregates?.pe_judet || {})
      setAggStatusLive(j.aggregates?.pe_status || {})
      setAggCalificativLive(j.aggregates?.pe_calificativ || {})
    } catch (e) { console.error('[inspector unitati live]', e) }
    setLoadingLive(false)
  }

  const STATUS_LIVE_LABEL: Record<string, string> = {
    autoevaluare_depusa: 'Autoevaluare depusă', in_evaluare: 'În evaluare',
    acreditat: 'Acreditat', periodica: 'Evaluare periodică',
  }
  const STATUS_LIVE_COLOR: Record<string, string> = {
    autoevaluare_depusa: '#f59e0b', in_evaluare: '#3b82f6', acreditat: '#22c55e', periodica: '#14b8a6',
  }

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!loggedIn) return
    loadUnitatiLive()
    fetch('/api/documents?judet=national')
      .then(r => r.json())
      .then(json => {
        if (json.documents?.length) {
          setDocs(json.documents.map((d: any) => ({
            id: parseInt(d.id) || Date.now(),
            apiId: d.id,
            titlu: d.titlu,
            data: new Date(d.uploadedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
            target: d.judet === 'national' ? 'national' : 'judet',
            targetName: d.destinatari,
            destinatari: d.totalDestinatari ?? 11500,
            citite: d.citite ?? 0,
            tip: d.tip,
            termen: d.termen,
            urgent: d.urgent,
            readers: d.readers || [],
            nrInregistrare: d.nrInregistrare,
            pdfUrl: d.pdfUrl,
          })))
        }
      }).catch(e => console.error('[inspector load docs]', e))
  }, [loggedIn])
  const timeStr = now.toLocaleString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadTip, setUploadTip] = useState('Circular')
  const [uploadTarget, setUploadTarget] = useState<'national' | 'judet' | 'scoala'>('national')
  const [uploadJudete, setUploadJudete] = useState<string[]>([])
  const [uploadScoala, setUploadScoala] = useState(SCOLI_DEMO[0])
  const [uploadTipUnitate, setUploadTipUnitate] = useState<string>('Toate')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadContent, setUploadContent] = useState('')
  const [uploadTermen, setUploadTermen] = useState('')
  const [uploadNr, setUploadNr] = useState('')
  const [uploadUrgent, setUploadUrgent] = useState(false)
  const [loginTitlu, setLoginTitlu] = useState('Dl')
  const [loginNume, setLoginNume] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFileUrl, setUploadFileUrl] = useState('')
  const [uploadFileUploading, setUploadFileUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setUploadFileUploading(true)
    try {
      const fd = new FormData()
      fd.append('password', 'ARACIP')
      fd.append('file', file)
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setUploadFileUrl(data.url)
      if (data.extractedText && !uploadContent.trim()) setUploadContent(data.extractedText)
    } catch (e) { console.error('[inspector handleFileUpload]', e) }
    setUploadFileUploading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail || !loginPass) { setLoginErr('Completați email și parolă.'); return }
    setLogging(true); setLoginErr('')
    // Validare parolă server-side
    try {
      const check = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'inspector', password: loginPass, email: loginEmail })
      })
      const cd = await check.json()
      if (!cd?.ok) { setLogging(false); setLoginErr('Email sau parolă incorectă.'); return }
    } catch (e) {
      console.error('[inspector auth check]', e)
      // Permite fallback demo
    }
    // Emite token de sesiune
    try {
      const ses = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, role: 'inspector' })
      })
      const sd = await ses.json()
      if (sd?.token) localStorage.setItem('ara_session', sd.token)
    } catch (e) { console.error('[inspector session]', e) }
    setLogging(false)
    if (loginNume.trim()) {
      try {
        localStorage.setItem('ara_user', JSON.stringify({ titlu: loginTitlu, rol: 'Inspector Național', nume: loginNume.trim(), userId: loginEmail }))
      } catch (e) { console.error('[inspector localStorage]', e) }
    }
    setLoggedIn(true)
  }

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: '#060b14', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <button onClick={() => router.back()} style={{ position: 'fixed', top: 20, left: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>← Înapoi</button>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}>🇷🇴</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>ARACIP</div>
        <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>Portal Inspector Național</div>
        <div style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '10px', fontWeight: 700, color: '#60a5fa', letterSpacing: '1px' }}>DEMO LIVE — AIcraiova.ro</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', padding: '36px 40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Autentificare ARACIP</h2>
        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>Acces restricționat — Inspector Național</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={loginTitlu} onChange={e => setLoginTitlu(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '11px 10px', fontSize: '13px', color: '#60a5fa', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0, width: '80px' }}>
              <option value="Dl">Dl.</option>
              <option value="Dna">Dna.</option>
            </select>
            <input placeholder="Prenume Nume" value={loginNume} onChange={e => setLoginNume(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
          </div>
          <input type="email" placeholder="Email instituțional" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
          <input type="password" placeholder="Parolă" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const }} />
          {loginErr && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{loginErr}</div>}
          <button type="submit" disabled={logging} style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', border: 'none', borderRadius: '12px', padding: '13px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}>
            {logging ? 'Se verifică...' : 'Intră în cont →'}
          </button>
        </form>
        <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '10px', fontSize: '11px', color: '#60a5fa', textAlign: 'center' }}>Demo: orice email + parolă funcționează</div>
      </div>
    </div>
  )

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

    const TIP_RATIOS: Record<string, number> = { 'Toate': 1, 'Liceu': 0.18, 'Colegiu': 0.12, 'Școală': 0.45, 'Grădiniță': 0.25 }
    const tipSuffix = uploadTipUnitate !== 'Toate' ? ` · doar ${uploadTipUnitate}e` : ''
    const ratio = TIP_RATIOS[uploadTipUnitate] ?? 1
    let targetName = `Toate județele${tipSuffix}`
    let destinatari = Math.round(11500 * ratio)
    if (uploadTarget === 'judet') {
      targetName = (uploadJudete.length ? uploadJudete.join(', ') : 'ISJ selectate') + tipSuffix
      const base = uploadJudete.reduce((s, j) => {
        const found = JUDETE.find(x => x.name === j)
        return s + (found ? found.scoli : 0)
      }, 0) || 240
      destinatari = Math.round(base * ratio)
    } else if (uploadTarget === 'scoala') {
      targetName = uploadScoala
      destinatari = 1
    }

    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'ARACIP',
          document: {
            titlu: uploadTitle,
            tip: uploadTip,
            sursa: 'Inspector Național ARACIP',
            sursa_tip: 'inspector',
            judet: 'national',
            termen: uploadTermen || undefined,
            urgent: uploadUrgent,
            continut: uploadContent || uploadTitle,
            destinatari: targetName,
            nr: uploadNr || undefined,
            pdfUrl: uploadFileUrl || undefined,
            totalDestinatari: destinatari,
            tipUnitate: uploadTipUnitate,
          }
        })
      })
    } catch (e) { console.error('[inspector handleUpload]', e) }

    setDocs(prev => [{
      id: Date.now(),
      titlu: uploadTitle,
      data: new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
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
      setUploadContent('')
      setUploadTermen('')
      setUploadNr('')
      setUploadUrgent(false)
      setUploadTarget('national')
      setUploadJudete([])
      setUploadTipUnitate('Toate')
      setUploadFile(null)
      setUploadFileUrl('')
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

  const todayStr = new Date().toDateString()
  const allReaders = docs.flatMap(d => d.readers || [])
  const conectateAzi = new Set(allReaders.filter(r => new Date(r.la).toDateString() === todayStr).map(r => r.scoala || r.name)).size
  const alerteReale = docs.filter(d =>
    (d.urgent && (d.citite ?? 0) === 0) ||
    (d.termen && new Date(d.termen) < new Date() && (d.citite ?? 0) < d.destinatari)
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Demo</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🇷🇴 {loginNume ? `${loginTitlu}. ${loginNume}` : 'Inspector Național'}</span>
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
            onClick={() => { setShowNotifScoala(true); setNotifScoalaScoala('') }}
            style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            🏫 Notifică Școală
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

        {/* Dashboard statistici rapide */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Total documente</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6' }}>{docs.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Urgent nerezolvate</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b' }}>{docs.filter(d => d.urgent && (d.citite ?? 0) < d.destinatari).length}</div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: '4px' }}>Top 3 județe (după unități)</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[...JUDETE].sort((a, b) => b.scoli - a.scoli).slice(0, 3).map((j, i) => (
                <span key={j.name} style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                  {i + 1}. {j.name} ({j.scoli})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Alertă ARACIP — cereri noi care așteaptă decizie */}
        {(() => {
          const pAut = autorizariStats?.recent.filter(r => r.status === 'depusa' || r.status === 'in_analiza').length || 0
          const pEval = evaluariStats?.recent.filter(r => r.status === 'depusa' || r.status === 'in_analiza').length || 0
          const tot = pAut + pEval
          if (tot === 0) return null
          return (
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '12px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 22 }}>🔔</div>
              <div style={{ flex: 1, fontSize: 13, color: '#fcd34d', fontWeight: 600 }}>{tot} {tot === 1 ? 'cerere așteaptă' : 'cereri așteaptă'} decizia ARACIP{pAut ? ` · ${pAut} autorizare` : ''}{pEval ? ` · ${pEval} acreditare/evaluare` : ''}.</div>
              {!araciPass && <button onClick={deblocheazaAraci} style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.5)', color: '#fcd34d', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🔓 Deblochează decizii</button>}
            </div>
          )
        })()}

        {/* Formare Profesională — rezumat LIVE pe tabloul central (detalii complete în tab-ul Formare, parolat) */}
        {formareStats && (
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(20,184,166,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#c4b5fd' }}>🎓 Formare Profesională — LIVE (A.2 / A.3)</div>
              <button onClick={() => setTab('formare')} style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Detalii (parolat) →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Total participanți', val: String(formareStats.total), color: '#a78bfa' },
                { label: 'Formabili (A.2)', val: String(formareStats.totalFormabili), color: '#c4b5fd' },
                { label: 'Evaluatori (A.3)', val: String(formareStats.totalEvaluatori), color: '#5eead4' },
                { label: 'Progres mediu', val: `${formareStats.medieProgres}%`, color: '#60a5fa' },
                { label: 'Finalizați', val: String(formareStats.finalizati), color: '#4ade80' },
                { label: 'Certificate', val: String(formareStats.certificate), color: '#fbbf24' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAEI generate de directori — LIVE (din Generatorul RAEI) */}
        {raeiStats && raeiStats.total > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.12), rgba(59,130,246,0.06))', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#6ee7b7' }}>📄 RAEI generate de unități — LIVE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>{raeiStats.total}</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: 520 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b' }}>
                    {['Unitate', 'Județ', 'Nivel', 'An școlar', 'Data'].map(h => <th key={h} style={{ padding: '4px 8px', fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {raeiStats.recent.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #334155', color: '#cbd5e1' }}>
                      <td style={{ padding: '5px 8px' }}>{r.nume_unitate}</td>
                      <td style={{ padding: '5px 8px' }}>{r.judet || '—'}</td>
                      <td style={{ padding: '5px 8px' }}>{r.nivel || '—'}</td>
                      <td style={{ padding: '5px 8px' }}>{r.an_scolar || '—'}</td>
                      <td style={{ padding: '5px 8px', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('ro-RO')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cereri de autorizare — LIVE + decizie ARACIP (accept/respinge) + autorizație */}
        {autorizariStats && autorizariStats.total > 0 && (() => {
          const statusStil: Record<string, { bg: string; c: string; label: string }> = {
            depusa: { bg: 'rgba(148,163,184,0.15)', c: '#cbd5e1', label: 'Depusă' },
            in_analiza: { bg: 'rgba(245,158,11,0.15)', c: '#fbbf24', label: 'În analiză' },
            autorizat: { bg: 'rgba(34,197,94,0.15)', c: '#4ade80', label: 'Autorizat' },
            respinsa: { bg: 'rgba(239,68,68,0.15)', c: '#f87171', label: 'Respinsă' },
          }
          return (
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(168,85,247,0.06))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd' }}>🏫 Cereri de autorizare (unități noi) — LIVE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {!araciPass
                  ? <button onClick={deblocheazaAraci} style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>🔓 Deblochează decizii</button>
                  : <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>✓ Decizii deblocate</span>}
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>{autorizariStats.total}</div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: 680 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b' }}>
                    {['Nr. înreg.', 'Unitate', 'Județ', 'Nivel', 'Status', 'Data', 'Acțiuni'].map(h => <th key={h} style={{ padding: '4px 8px', fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {autorizariStats.recent.map(r => {
                    const st = statusStil[r.status] || statusStil.depusa
                    const inAsteptare = r.status === 'depusa' || r.status === 'in_analiza'
                    const nrDocs = r.documente?.length || 0
                    const deschis = openDosar === r.id
                    return (
                    <Fragment key={r.id}>
                    <tr style={{ borderTop: '1px solid #334155', color: '#cbd5e1' }}>
                      <td style={{ padding: '6px 8px', color: '#60a5fa', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.nr_inregistrare}</td>
                      <td style={{ padding: '6px 8px' }}>{r.denumire}</td>
                      <td style={{ padding: '6px 8px' }}>{r.judet || '—'}</td>
                      <td style={{ padding: '6px 8px' }}>{r.nivel || '—'}</td>
                      <td style={{ padding: '6px 8px' }}><span style={{ background: st.bg, color: st.c, fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>{st.label}</span></td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('ro-RO')}</td>
                      <td style={{ padding: '6px 8px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button onClick={() => setOpenDosar(deschis ? null : r.id)} style={{ background: deschis ? '#1e40af' : 'rgba(59,130,246,0.15)', color: deschis ? '#fff' : '#93c5fd', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📎 Dosar ({nrDocs}) {deschis ? '▲' : '▼'}</button>
                          {r.status === 'autorizat' && (
                            <button onClick={() => genereazaAutorizatie({ denumire: r.denumire, cui: r.cui || undefined, judet: r.judet || undefined, nivel: r.nivel || undefined, nrInregistrare: r.nr_inregistrare })} style={{ background: '#166534', color: '#bbf7d0', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📄 Autorizație</button>
                          )}
                          {araciPass && inAsteptare && (
                            <>
                              <button onClick={() => decideAut(r.id, 'autorizat')} style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>✓ Acceptă</button>
                              <button onClick={() => decideAut(r.id, 'respinsa')} style={{ background: '#7f1d1d', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>✕ Respinge</button>
                            </>
                          )}
                          {!araciPass && inAsteptare && <span style={{ fontSize: 10.5, color: '#475569' }}>🔒 blocat</span>}
                          {r.status === 'respinsa' && <span style={{ fontSize: 10.5, color: '#f87171' }}>—</span>}
                        </div>
                      </td>
                    </tr>
                    {deschis && (
                      <tr>
                        <td colSpan={7} style={{ padding: '0 8px 12px', background: 'rgba(15,23,42,0.6)' }}>
                          <div style={{ border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>📁 Documentele dosarului {r.nr_inregistrare} — verifică înainte de decizie</div>
                            {nrDocs === 0 && <div style={{ fontSize: 12, color: '#64748b' }}>Nu au fost atașate documente la această cerere.</div>}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {(r.documente || []).map((d, di) => (
                                <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                  <span style={{ color: '#94a3b8', minWidth: 180 }}>{d.tip}</span>
                                  <span style={{ color: '#cbd5e1', flex: 1 }}>{d.nume}</span>
                                  {d.url
                                    ? <button onClick={() => descarcaDocDosar(d.url, d.nume)} style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80', borderRadius: 6, padding: '3px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>⬇ Descarcă</button>
                                    : <span style={{ fontSize: 11, color: '#64748b' }}>fără fișier</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )
        })()}

        {/* Cereri de acreditare + evaluare periodică — decizie ARACIP */}
        {evaluariStats && evaluariStats.total > 0 && (() => {
          const stStil: Record<string, { bg: string; c: string; label: string }> = {
            depusa: { bg: 'rgba(148,163,184,0.15)', c: '#cbd5e1', label: 'Depusă' },
            in_analiza: { bg: 'rgba(245,158,11,0.15)', c: '#fbbf24', label: 'În analiză' },
            aprobat: { bg: 'rgba(34,197,94,0.15)', c: '#4ade80', label: 'Aprobat' },
            respinsa: { bg: 'rgba(239,68,68,0.15)', c: '#f87171', label: 'Respinsă' },
          }
          return (
          <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(20,184,166,0.05))', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#d8b4fe' }}>🏅 Cereri acreditare / evaluare periodică — LIVE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#c084fc' }}>{evaluariStats.total}</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: 700 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b' }}>
                    {['Nr. înreg.', 'Tip', 'Unitate', 'Județ', 'Nivel', 'Status', 'Acțiuni'].map(h => <th key={h} style={{ padding: '4px 8px', fontWeight: 600 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {evaluariStats.recent.map(r => {
                    const st = stStil[r.status] || stStil.depusa
                    const inAsteptare = r.status === 'depusa' || r.status === 'in_analiza'
                    const tipLbl = r.tip === 'evaluare_periodica' ? 'Evaluare periodică' : 'Acreditare'
                    return (
                    <tr key={r.id} style={{ borderTop: '1px solid #334155', color: '#cbd5e1' }}>
                      <td style={{ padding: '6px 8px', color: '#c084fc', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.nr_inregistrare}</td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{tipLbl}</td>
                      <td style={{ padding: '6px 8px' }}>{r.denumire}</td>
                      <td style={{ padding: '6px 8px' }}>{r.judet || '—'}</td>
                      <td style={{ padding: '6px 8px' }}>{r.nivel || '—'}</td>
                      <td style={{ padding: '6px 8px' }}><span style={{ background: st.bg, color: st.c, fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>{st.label}</span></td>
                      <td style={{ padding: '6px 8px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {r.status === 'aprobat' && (
                            <button onClick={() => genereazaDecizie({ tip: r.tip === 'evaluare_periodica' ? 'evaluare_periodica' : 'acreditare', denumire: r.denumire, cui: r.cui || undefined, judet: r.judet || undefined, nivel: r.nivel || undefined, calificativ: r.calificativ || undefined, nrInregistrare: r.nr_inregistrare })} style={{ background: '#166534', color: '#bbf7d0', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📄 {r.tip === 'evaluare_periodica' ? 'Atestat' : 'Decizie'}</button>
                          )}
                          {araciPass && inAsteptare && (
                            <>
                              <button onClick={() => decideEval(r.id, 'aprobat')} style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>✓ Aprobă</button>
                              <button onClick={() => decideEval(r.id, 'respinsa')} style={{ background: '#7f1d1d', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>✕ Respinge</button>
                            </>
                          )}
                          {!araciPass && inAsteptare && <span style={{ fontSize: 10.5, color: '#475569' }}>🔒 blocat</span>}
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )
        })()}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Documente Publicate', val: docs.length.toString(), icon: '📄', color: '#3b82f6', sub: 'total în sistem', click: null },
            { label: 'Total Citiri', val: docs.reduce((s, d) => s + (d.readers?.length || 0), 0).toString(), icon: '👁', color: '#10b981', sub: 'directori care au citit', click: null },
            { label: 'Citiri Azi', val: conectateAzi > 0 ? conectateAzi.toLocaleString('ro') : '—', icon: '🟢', color: '#22c55e', sub: conectateAzi > 0 ? `directori activi azi` : 'nicio confirmare azi', click: null },
            { label: 'Alerte Nerezolvate', val: alerteReale.length, icon: '⚠️', color: '#f59e0b', sub: 'click pentru detalii', click: () => setShowAlerte(true) },
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

        {/* Calendar Termene */}
        <div style={{ marginBottom: '20px' }}>
          <CalendarTermene />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '16px' }}>
          {[
            { key: 'judete', label: 'Situatie Judete' },
            { key: 'documente', label: `Documente Publicate${newDocsCount > 0 ? ` (${newDocsCount} nou)` : ''}` },
            { key: 'arhiva', label: 'Arhiva ARACIP' },
            { key: 'formare', label: 'Formare' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'judete' | 'documente' | 'arhiva' | 'formare')}
              style={{
                background: tab === t.key ? (t.key === 'arhiva' ? '#065f46' : t.key === 'formare' ? '#6d28d9' : '#1d4ed8') : 'none',
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
          <>
          {/* ===== DEPUNERI LIVE (lanțul calității: Școală → ISJ → ARACIP) ===== */}
          <div style={{ background: 'linear-gradient(135deg,#1e293b,#22143f)', border: '1px solid #6d28d9', borderRadius: '12px', padding: '18px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>Depuneri LIVE de la unități</h2>
                <span style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>DATE REALE · Supabase</span>
              </div>
              <button onClick={loadUnitatiLive} disabled={loadingLive} style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#c4b5fd', cursor: 'pointer', fontWeight: 600 }}>
                {loadingLive ? '...' : '🔄 Reîncarcă'}
              </button>
            </div>

            {/* Agregate reale */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: unitatiLive.length ? '16px' : '0' }}>
              <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Total depuneri</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa' }}>{unitatiLive.length}</div>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Județe active</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#67e8f9' }}>{Object.keys(aggJudetLive).length}</div>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Autoevaluări depuse</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{aggStatusLive['autoevaluare_depusa'] || 0}</div>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Acreditate</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#22c55e' }}>{aggStatusLive['acreditat'] || 0}</div>
              </div>
            </div>

            {unitatiLive.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', padding: '4px 0' }}>
                Nicio depunere reală încă. Când o unitate trimite autoevaluarea prin <span style={{ color: '#c4b5fd' }}>/acreditare/depunere</span>, apare aici instant.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Unitate', 'Județ', 'Tip', 'Status', 'Calificativ', 'Depus'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {unitatiLive.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '9px 12px', fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{u.nume_unitate}{u.localitate ? <span style={{ color: '#475569', fontWeight: 400 }}> · {u.localitate}</span> : null}</td>
                        <td style={{ padding: '9px 12px', fontSize: '12px', color: '#94a3b8' }}>{u.judet}</td>
                        <td style={{ padding: '9px 12px', fontSize: '12px', color: '#94a3b8' }}>{u.tip_unitate}</td>
                        <td style={{ padding: '9px 12px' }}>
                          <span style={{ background: (STATUS_LIVE_COLOR[u.status] || '#64748b') + '22', color: STATUS_LIVE_COLOR[u.status] || '#94a3b8', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{STATUS_LIVE_LABEL[u.status] || u.status}</span>
                        </td>
                        <td style={{ padding: '9px 12px', fontSize: '12px', color: u.calificativ_general ? '#a78bfa' : '#475569' }}>{u.calificativ_general || '—'}</td>
                        <td style={{ padding: '9px 12px', fontSize: '11px', color: '#64748b' }}>{new Date(u.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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
                {(() => {
                  const events: { time: string; text: string; color: string }[] = []
                  // Real reader events from documents
                  for (const d of docs) {
                    for (const r of (d.readers || [])) {
                      events.push({
                        time: new Date(r.la).toLocaleString('ro-RO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
                        text: `${r.name}${r.scoala ? ` (${r.scoala})` : ''} — citit "${d.titlu.slice(0, 40)}${d.titlu.length > 40 ? '...' : ''}"`,
                        color: '#22c55e',
                      })
                    }
                  }
                  events.sort((a, b) => b.time.localeCompare(a.time))
                  if (events.length === 0) {
                    return <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', padding: '8px 0' }}>Nicio activitate înregistrată încă.</div>
                  }
                  return events.slice(0, 8).map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', marginTop: '1px', minWidth: '70px' }}>{a.time}</span>
                      <span style={{ width: 3, minWidth: 3, background: a.color, borderRadius: '2px', alignSelf: 'stretch', minHeight: '16px' }} />
                      <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{a.text}</span>
                    </div>
                  ))
                })()}
              </div>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Documente Naționale</h3>
                {[
                  { label: 'Total publicate', val: docs.length.toString(), color: '#3b82f6' },
                  { label: 'Naționale', val: docs.filter(d => d.target === 'national').length.toString(), color: '#60a5fa' },
                  { label: 'Județene', val: docs.filter(d => d.target === 'judet').length.toString(), color: '#67e8f9' },
                  { label: 'Per școală', val: docs.filter(d => d.target === 'scoala').length.toString(), color: '#6ee7b7' },
                  { label: 'Confirmare citire medie', val: (() => {
                    if (docs.length === 0) return '—'
                    const totalDest = docs.reduce((s, d) => s + (d.destinatari || 0), 0)
                    const totalRead = docs.reduce((s, d) => s + ((d.readers?.length) ?? d.citite ?? 0), 0)
                    if (totalDest === 0) return '—'
                    return `${Math.round((totalRead / totalDest) * 100)}%`
                  })(), color: '#10b981' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
        )}

        {/* DOCUMENTE TAB */}
        {tab === 'documente' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => {
              fetch('/api/documents?judet=national').then(r => r.json()).then(json => {
                if (json.documents?.length) {
                  setDocs(json.documents.map((d: any) => ({
                    id: parseInt(d.id) || Date.now(),
                    titlu: d.titlu,
                    data: new Date(d.uploadedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
                    target: d.judet === 'national' ? 'national' : 'judet',
                    targetName: d.destinatari,
                    destinatari: d.totalDestinatari ?? 11500,
                    citite: d.citite ?? 0,
                    tip: d.tip,
                    termen: d.termen,
                    urgent: d.urgent,
                    readers: d.readers || [],
                  })))
                }
              }).catch(e => console.error('[inspector load docs]', e))
            }} style={{ alignSelf: 'flex-end', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}>
              🔄 Reîncarcă din server
            </button>
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
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
                      {doc.titlu}
                      <span className="text-xs text-gray-500" style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Nr. {doc.nrInregistrare ?? '—'}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {doc.data} · <span style={{ color: '#94a3b8' }}>{destinatariLabel(doc)}</span>
                      <span style={{ marginLeft: '10px', color: (doc.readers?.length || 0) > 0 ? '#22c55e' : '#475569', fontWeight: 600 }}>
                        👁 Citit de {(doc.readers?.length || 0)}
                      </span>
                      {doc.apiId && (
                        <a href={`/api/documents/${doc.apiId}/download`} target="_blank" rel="noopener" style={{ marginLeft: '10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                          ⬇ Descarcă
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: pct === 100 ? '#22c55e' : doc.citite === 0 ? '#64748b' : '#f59e0b' }}>
                      {doc.citite === 0 ? 'Nicio confirmare încă' : `${pct}% confirmați`}
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
        {/* ARHIVA TAB */}
        {tab === 'arhiva' && (
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '20px 24px',
            }}
          >
            <AraArchive password="ARACIP2026" readOnly={false} />
          </div>
        )}

        {/* FORMARE TAB — panou administrare formabili (A.2) / evaluatori (A.3) */}
        {tab === 'formare' && (
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '20px 24px',
            }}
          >
            <FormareAdminPanel embedded />
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

                {/* TIP UNITATE SELECTOR */}
                {uploadTarget !== 'scoala' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tip unitate destinatară
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { val: 'Toate', label: 'Toate unitățile', sub: '100%', color: '#64748b', bg: '#334155' },
                        { val: 'Liceu', label: 'Licee', sub: '~18%', color: '#93c5fd', bg: '#1e3a5f' },
                        { val: 'Colegiu', label: 'Colegii', sub: '~12%', color: '#c4b5fd', bg: '#4c1d95' },
                        { val: 'Școală', label: 'Școli Gimnaziale', sub: '~45%', color: '#6ee7b7', bg: '#064e3b' },
                        { val: 'Grădiniță', label: 'Grădinițe', sub: '~25%', color: '#fde68a', bg: '#713f12' },
                      ].map(opt => {
                        const sel = uploadTipUnitate === opt.val
                        return (
                          <button
                            key={opt.val}
                            onClick={() => setUploadTipUnitate(opt.val)}
                            style={{
                              background: sel ? opt.bg : '#0f172a',
                              border: `2px solid ${sel ? opt.color : '#334155'}`,
                              borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', textAlign: 'center', minWidth: '90px',
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: 700, color: sel ? opt.color : '#64748b', marginBottom: '2px' }}>{opt.label}</div>
                            <div style={{ fontSize: '11px', color: sel ? opt.color : '#475569', opacity: 0.8 }}>{opt.sub}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

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

                {/* Content + meta */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conținut document (ARA va indexa automat)</label>
                  <textarea value={uploadContent} onChange={e => setUploadContent(e.target.value)} placeholder="Introduceți sau lipiți conținutul documentului..." rows={4} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Nr. document (opțional)</label>
                    <input value={uploadNr} onChange={e => setUploadNr(e.target.value)} placeholder="ex: 1250/2026" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Termen (opțional)</label>
                    <input value={uploadTermen} onChange={e => setUploadTermen(e.target.value)} placeholder="ex: 2026-06-15" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444', cursor: 'pointer', paddingTop: '22px', flexShrink: 0 }}>
                    <input type="checkbox" checked={uploadUrgent} onChange={e => setUploadUrgent(e.target.checked)} />
                    🔴 Urgent
                  </label>
                </div>

                {/* Upload fișier */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📎 Fișier atașat — PDF, Excel, Word, orice format (opțional)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ flex: 1, background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📂</span>
                      <span style={{ fontSize: '12px', color: uploadFile ? '#a78bfa' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {uploadFile ? uploadFile.name : 'Selectează fișier...'}
                      </span>
                      <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadFile(f); setUploadFileUrl(''); handleFileUpload(f) } }} />
                    </label>
                    {uploadFileUploading && <span style={{ fontSize: '12px', color: '#3b82f6', whiteSpace: 'nowrap' }}>Se urcă...</span>}
                    {uploadFileUrl && <span style={{ fontSize: '12px', color: '#22c55e', whiteSpace: 'nowrap', fontWeight: 700 }}>✅ Urcat</span>}
                  </div>
                </div>

                {/* Sumar trimitere */}
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '12px', color: '#94a3b8' }}>
                  <strong style={{ color: '#60a5fa' }}>📊 Sumar:</strong>{' '}
                  {uploadTarget === 'national' && 'Documentul va fi trimis tuturor celor 42 ISJ-uri și 11.500+ directori din România. Toți vor primi notificare instantanee.'}
                  {uploadTarget === 'judet' && (uploadJudete.length === 0 ? 'Selectați cel puțin un județ.' : `Documentul va fi trimis la ${uploadJudete.length} ISJ${uploadJudete.length > 1 ? '-uri' : ''}: ${uploadJudete.join(', ')}.`)}
                  {uploadTarget === 'scoala' && `Documentul va fi trimis direct directorului de la: ${uploadScoala}.`}
                  <br /><strong style={{ color: '#a78bfa' }}>🤖 ARA indexează instant</strong> — directorii pot întreba chatbot-ul despre conținut imediat după publicare.
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
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fcd34d' }}>⚠️ Alerte Nerezolvate — {alerteReale.length} document{alerteReale.length !== 1 ? 'e' : ''}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Documente urgente fără confirmare sau cu termenul depășit</p>
              </div>
              <button onClick={() => setShowAlerte(false)} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕ Închide</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {alerteReale.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  ✅ Nicio alertă activă
                </div>
              ) : alerteReale.map(doc => {
                const isUrgentNecitit = doc.urgent && (doc.citite ?? 0) === 0
                const isPastDeadline = doc.termen && new Date(doc.termen) < new Date()
                const pct = Math.round(((doc.citite ?? 0) / Math.max(doc.destinatari, 1)) * 100)
                return (
                  <div key={doc.id} style={{ padding: '14px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isUrgentNecitit ? '#ef4444' : '#f59e0b', flexShrink: 0, marginTop: '5px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{doc.titlu}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {doc.data} · {doc.targetName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        {doc.citite ?? 0}/{doc.destinatari} confirmări ({pct}%)
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                      {isUrgentNecitit && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>🔴 Urgent — 0 citiri</span>}
                      {isPastDeadline && <span style={{ background: '#451a03', color: '#fcd34d', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>⏰ Termen depășit</span>}
                    </div>
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

      {/* NOTIFICA SCOALA MODAL */}
      {showNotifScoala && (() => {
        const scoliJudet = getScoliJudet(notifScoalaJudet)
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid #059669', borderRadius: '16px', width: '560px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              {notifScoalaSent ? (
                <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ color: '#22c55e', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Notificare trimisă!</h3>
                  <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>
                    Directorul de la <strong style={{ color: '#f1f5f9' }}>{notifScoalaScoala}</strong> a primit notificarea instant.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9' }}>🏫 Notifică direct școala / grădinița</h3>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Mesaj direct către directorul unei unități școlare</p>
                    </div>
                    <button onClick={() => { setShowNotifScoala(false); setNotifScoalaMsg(''); setNotifScoalaScoala('') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Județ */}
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Județ</label>
                      <select
                        value={notifScoalaJudet}
                        onChange={e => { setNotifScoalaJudet(e.target.value); setNotifScoalaScoala('') }}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none' }}
                      >
                        {JUDETE.map(j => <option key={j.name} value={j.name}>{j.name}</option>)}
                      </select>
                    </div>

                    {/* Scoala */}
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Unitate școlară ({scoliJudet.length} disponibile)
                      </label>
                      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '8px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {scoliJudet.map((s, i) => {
                          const tc = TIP_COLORS[s.tip]
                          const sel = notifScoalaScoala === s.name
                          return (
                            <button
                              key={i}
                              onClick={() => setNotifScoalaScoala(s.name)}
                              style={{
                                background: sel ? 'rgba(5,150,105,0.2)' : 'transparent',
                                border: `1px solid ${sel ? '#059669' : 'transparent'}`,
                                borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                              }}
                            >
                              <span style={{ background: tc.bg, color: tc.color, fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px', flexShrink: 0 }}>{s.tip}</span>
                              <span style={{ fontSize: '13px', color: sel ? '#f1f5f9' : '#94a3b8', flex: 1 }}>{s.name}</span>
                              <span style={{ fontSize: '11px', color: '#475569' }}>Dir: {s.director}</span>
                              {sel && <span style={{ color: '#22c55e', fontSize: '14px' }}>✓</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mesaj */}
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mesaj</label>
                      <textarea
                        value={notifScoalaMsg}
                        onChange={e => setNotifScoalaMsg(e.target.value)}
                        placeholder="Scrieți mesajul pentru directorul școlii selectate..."
                        rows={3}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #334155', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => { setShowNotifScoala(false); setNotifScoalaMsg(''); setNotifScoalaScoala('') }}
                      style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}
                    >
                      Anulează
                    </button>
                    <button
                      onClick={() => {
                        if (!notifScoalaMsg.trim() || !notifScoalaScoala) return
                        setNotifScoalaSent(true)
                        setTimeout(() => { setShowNotifScoala(false); setNotifScoalaSent(false); setNotifScoalaMsg(''); setNotifScoalaScoala('') }, 2200)
                      }}
                      disabled={!notifScoalaMsg.trim() || !notifScoalaScoala}
                      style={{
                        flex: 2, background: !notifScoalaMsg.trim() || !notifScoalaScoala ? '#334155' : '#059669',
                        color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600,
                        cursor: !notifScoalaMsg.trim() || !notifScoalaScoala ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {notifScoalaScoala ? `Trimite la ${notifScoalaScoala.split('"')[0].trim()} →` : 'Selectează o unitate →'}
                    </button>
                  </div>
                </>
              )}
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

      {/* Modal deblocare decizii ARACIP (înlocuiește prompt parolă) */}
      {showUnlock && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }} onClick={() => setShowUnlock(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28, width: 400, maxWidth: '100%' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>🔓 Deblochează deciziile ARACIP</h3>
            <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 18 }}>Introduceți parola ARACIP pentru a putea accepta/respinge cereri și a vedea documentele dosarelor.</p>
            <input
              type="password" autoFocus value={unlockPass}
              onChange={e => setUnlockPass(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmUnlock() }}
              placeholder="Parola ARACIP"
              style={{ width: '100%', background: '#0f172a', border: `1px solid ${unlockErr ? '#ef4444' : '#334155'}`, borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }}
            />
            {unlockErr && <div style={{ fontSize: 12, color: '#f87171', marginTop: 8 }}>{unlockErr}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowUnlock(false)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, cursor: 'pointer' }}>Anulează</button>
              <button onClick={confirmUnlock} disabled={unlocking} style={{ flex: 1, background: unlocking ? '#1e40af' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 700, cursor: unlocking ? 'wait' : 'pointer' }}>{unlocking ? 'Se verifică...' : 'Deblochează'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal motiv respingere (înlocuiește prompt motiv) */}
      {rejectTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }} onClick={() => setRejectTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28, width: 460, maxWidth: '100%' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f87171', marginBottom: 6 }}>✕ Respinge cererea</h3>
            <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 16 }}>{rejectTarget.denumire ? <>Respingeți cererea pentru <strong style={{ color: '#cbd5e1' }}>{rejectTarget.denumire}</strong>.</> : 'Confirmați respingerea cererii.'} Motivul apare în notificarea trimisă solicitantului pe email.</p>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Motivul respingerii (opțional)</label>
            <textarea
              autoFocus value={rejectMotiv} onChange={e => setRejectMotiv(e.target.value)} rows={4}
              placeholder="ex: Lipsesc avizul ISU și dovada spațiului..."
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: '#e2e8f0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setRejectTarget(null)} style={{ flex: 1, background: '#334155', color: '#94a3b8', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, cursor: 'pointer' }}>Anulează</button>
              <button onClick={confirmReject} disabled={rejecting} style={{ flex: 1, background: rejecting ? '#7f1d1d' : '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 700, cursor: rejecting ? 'wait' : 'pointer' }}>{rejecting ? 'Se trimite...' : 'Confirmă respingerea'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast (înlocuiește alert) */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 70, background: toast.tip === 'ok' ? '#166534' : '#7f1d1d', color: '#fff', borderRadius: 10, padding: '12px 20px', fontSize: 13.5, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '90vw' }}>
          {toast.tip === 'ok' ? '✓ ' : '⚠ '}{toast.msg}
        </div>
      )}
    </div>
  )
}
