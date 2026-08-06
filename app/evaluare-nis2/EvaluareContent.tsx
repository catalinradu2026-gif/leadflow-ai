'use client'
import { useState } from 'react'

type Raspuns = 'da' | 'partial' | 'nu' | ''

type Intrebare = {
  cheie: string
  text: string
  labelDa: string
  labelPartial: string
  labelNu: string
}

type Categorie = {
  titlu: string
  intrebari: Intrebare[]
}

const CATEGORII: Categorie[] = [
  {
    titlu: '1. Acces și parole',
    intrebari: [
      {
        cheie: 'q1_acces_controlat',
        text: 'Cine are acces la datele importante ale firmei (contracte, date clienți, coduri sursă)? E acces controlat, sau oricine din firmă poate ajunge la orice?',
        labelDa: 'Da, e controlat', labelPartial: 'Parțial', labelNu: 'Nu, e liber',
      },
      {
        cheie: 'q2_revocare_acces',
        text: 'Când un angajat pleacă din firmă, i se taie imediat accesul la conturi/sisteme?',
        labelDa: 'Da', labelPartial: 'Parțial / cu întârziere', labelNu: 'Nu / nu s-a pus problema',
      },
      {
        cheie: 'q3_2fa',
        text: 'Folosiți autentificare cu doi factori (cod pe telefon la login), sau doar parolă simplă/partajată?',
        labelDa: 'Da, 2FA pe conturile importante', labelPartial: 'Doar pe unele conturi', labelNu: 'Nu, doar parolă',
      },
    ],
  },
  {
    titlu: '2. Backup și recuperare',
    intrebari: [
      {
        cheie: 'q4_backup',
        text: 'Faceți backup regulat la datele importante? Unde se salvează?',
        labelDa: 'Da, regulat', labelPartial: 'Ocazional / neregulat', labelNu: 'Nu facem backup',
      },
      {
        cheie: 'q5_test_restaurare',
        text: 'Ați testat vreodată restaurarea dintr-un backup, ca să vedeți că funcționează?',
        labelDa: 'Da', labelPartial: 'O dată, demult', labelNu: 'Niciodată',
      },
    ],
  },
  {
    titlu: '3. Incidente de securitate',
    intrebari: [
      {
        cheie: 'q6_incident_avut',
        text: 'V-ați confruntat vreodată cu un virus, un atac cibernetic, date pierdute sau furate?',
        labelDa: 'Nu, niciodată', labelPartial: 'Ceva minor, fără impact major', labelNu: 'Da, am avut un incident real',
      },
      {
        cheie: 'q7_plan_incident',
        text: 'Dacă s-ar întâmpla mâine un incident, există pași scriși de urmat, sau s-ar improviza?',
        labelDa: 'Da, avem pași scriși', labelPartial: 'Știm cam ce-am face, dar nu-i scris', labelNu: 'Nu, am improviza',
      },
    ],
  },
  {
    titlu: '4. Politici scrise',
    intrebari: [
      {
        cheie: 'q8_politici_scrise',
        text: 'Aveți vreun document scris despre cum se folosesc calculatoarele, telefoanele, datele firmei — sau totul e „așa facem noi de obicei"?',
        labelDa: 'Da, avem documente scrise', labelPartial: 'Câteva reguli nescrise/informale', labelNu: 'Nimic scris',
      },
    ],
  },
  {
    titlu: '5. Furnizori și terți',
    intrebari: [
      {
        cheie: 'q9_furnizori_verificati',
        text: 'Lucrați cu firme externe care ating datele voastre (hosting, contabilitate externă, alți subcontractori)? Ați verificat cât de sigure sunt?',
        labelDa: 'Da, îi verificăm', labelPartial: 'Lucrăm cu terți, dar nu i-am verificat', labelNu: 'Nu lucrăm cu terți',
      },
    ],
  },
  {
    titlu: '6. Responsabilitate',
    intrebari: [
      {
        cheie: 'q10_responsabil',
        text: 'E cineva desemnat oficial responsabil cu securitatea informației, sau se ocupă „cine apucă"?',
        labelDa: 'Da, e desemnat oficial', labelPartial: 'Cineva se ocupă informal', labelNu: 'Nimeni',
      },
    ],
  },
]

const TOATE_INTREBARILE = CATEGORII.flatMap((c) => c.intrebari)

export default function EvaluareContent() {
  const [firma, setFirma] = useState('')
  const [cui, setCui] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [raspunsuri, setRaspunsuri] = useState<Record<string, Raspuns>>({})
  const [note, setNote] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'trimit' | 'ok' | 'eroare'>('idle')
  const [eroareMsg, setEroareMsg] = useState('')

  const setRaspuns = (cheie: string, val: Raspuns) => setRaspunsuri((r) => ({ ...r, [cheie]: val }))
  const setNota = (cheie: string, val: string) => setNote((n) => ({ ...n, [cheie]: val }))

  const gata = firma.trim() && contact.trim() && email.trim() &&
    TOATE_INTREBARILE.every((i) => raspunsuri[i.cheie])

  async function trimite() {
    setStatus('trimit')
    setEroareMsg('')
    const body: Record<string, string> = { firma, cui, contact, email }
    for (const i of TOATE_INTREBARILE) {
      body[i.cheie] = raspunsuri[i.cheie] || ''
      body[`${i.cheie}_nota`] = note[i.cheie] || ''
    }
    try {
      const r = await fetch('/api/evaluare-nis2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!r.ok || !j.ok) throw new Error(j.error || 'eroare necunoscută')
      setStatus('ok')
    } catch (e) {
      setStatus('eroare')
      setEroareMsg(e instanceof Error ? e.message : 'A apărut o eroare.')
    }
  }

  if (status === 'ok') {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="text-gold text-sm tracking-widest uppercase mb-3">AI Craiova · NEWTIME</div>
          <h1 className="text-2xl font-serif font-semibold mb-4">Mulțumim, {firma}!</h1>
          <p className="text-white/70">
            Am primit răspunsurile. În cel mult 48 de ore primiți pe <span className="text-gold">{email}</span> evaluarea
            completă — ce aveți deja bine, ce lipsește, și un preț estimat dacă vreți să continuăm.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="font-serif text-xl font-semibold tracking-wide">
            AI <span className="text-gold">Craiova</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-gold text-xs tracking-widest uppercase mb-2">Evaluare gratuită</div>
        <h1 className="text-3xl font-serif font-semibold mb-3">Conformitate NIS2 / ISO 27001</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Completați în 5-10 minute. Nu există răspunsuri greșite — scopul e să vedem unde stă firma
          dvs. față de cerințele NIS2/ISO 27001. Primiți gratuit, pe email, un document cu ce aveți deja
          bine, ce lipsește, și un preț estimat dacă vreți să continuăm.
        </p>

        <section className="bg-white/[0.04] border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-gold font-semibold mb-4 tracking-wide text-sm uppercase">Despre firma dvs.</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Camp label="Numele firmei *" value={firma} onChange={setFirma} />
            <Camp label="CUI" value={cui} onChange={setCui} />
            <Camp label="Persoană de contact *" value={contact} onChange={setContact} />
            <Camp label="Email *" value={email} onChange={setEmail} type="email" />
          </div>
        </section>

        {CATEGORII.map((cat) => (
          <section key={cat.titlu} className="mb-8">
            <h2 className="text-gold font-semibold mb-4 tracking-wide text-sm uppercase border-t border-white/10 pt-6">
              {cat.titlu}
            </h2>
            {cat.intrebari.map((i) => (
              <div key={i.cheie} className="mb-6 bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <p className="text-sm font-medium mb-3 text-white/90">{i.text}</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(['da', 'partial', 'nu'] as const).map((val) => {
                    const label = val === 'da' ? i.labelDa : val === 'partial' ? i.labelPartial : i.labelNu
                    const activ = raspunsuri[i.cheie] === val
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRaspuns(i.cheie, val)}
                        className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors ${
                          activ
                            ? 'bg-gold text-black border-gold'
                            : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
                <input
                  type="text"
                  placeholder="Detalii opționale..."
                  value={note[i.cheie] || ''}
                  onChange={(e) => setNota(i.cheie, e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white/80 placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                />
              </div>
            ))}
          </section>
        ))}

        {status === 'eroare' && (
          <p className="text-red-400 text-sm mb-4">{eroareMsg} Încercați din nou sau scrieți la contact@aicraiova.ro.</p>
        )}

        <button
          type="button"
          disabled={!gata || status === 'trimit'}
          onClick={trimite}
          className="w-full sm:w-auto px-8 py-3.5 bg-gold text-black font-semibold text-sm tracking-widest uppercase rounded-md hover:bg-gold-light transition-colors disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
        >
          {status === 'trimit' ? 'Se trimite...' : 'Trimite evaluarea'}
        </button>
        {!gata && (
          <p className="text-white/30 text-xs mt-3">Completați toate câmpurile marcate * și toate întrebările.</p>
        )}
      </div>
    </main>
  )
}

function Camp({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/15 rounded px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/60"
      />
    </div>
  )
}
