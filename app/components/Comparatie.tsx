'use client'
import { useState } from 'react'

const scenarios = [
  {
    situatie: 'Client sună la 2 noaptea',
    traditional: { text: 'Telefon nerespuns. Clientul sună la concurență.', bad: true },
    ai: { text: 'Răspuns instant. Rezervare confirmată automat.', bad: false },
  },
  {
    situatie: '50 de mesaje simultan pe WhatsApp',
    traditional: { text: 'Angajatul răspunde la 1. Restul 49 așteaptă sau pleacă.', bad: true },
    ai: { text: 'Toate 50 primesc răspuns în câteva secunde.', bad: false },
  },
  {
    situatie: 'Angajat în concediu medical',
    traditional: { text: 'Activitate oprită. Clienți pierduți. Haos.', bad: true },
    ai: { text: 'Zero impact. Sistemul nu obosește, nu se îmbolnăvește.', bad: false },
  },
  {
    situatie: 'Client întreabă prețul în weekend',
    traditional: { text: 'Răspuns luni dimineața — dacă mai e interesat.', bad: true },
    ai: { text: 'Răspuns imediat + ofertă personalizată trimisă automat.', bad: false },
  },
  {
    situatie: 'Urmărire lead-uri neconvertite',
    traditional: { text: 'Se uită. Nimeni nu are timp să le contacteze pe toate.', bad: true },
    ai: { text: 'Mesaj automat trimis la 24h, 72h, 7 zile — până convertesc.', bad: false },
  },
  {
    situatie: 'Raport zilnic activitate',
    traditional: { text: 'Nimeni nu face. Sau se face greșit, manual.', bad: true },
    ai: { text: 'Raport complet generat automat în fiecare dimineață.', bad: false },
  },
]

export default function Comparatie() {
  const [activeRow, setActiveRow] = useState<number | null>(null)

  return (
    <section className="py-32 bg-[#050505] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5">Realitatea din teren</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Cum arată afacerea ta<br />
            <span className="text-white/40">cu și fără AI</span>
          </h2>
          <p className="text-white/35 text-base max-w-lg mx-auto">
            Nu vorbe. Situații reale care se întâmplă în fiecare zi în afacerea ta.
          </p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-px bg-white/5 mb-px">
          <div className="bg-[#050505] px-6 py-4">
            <p className="text-white/25 text-xs tracking-widest uppercase">Situație</p>
          </div>
          <div className="bg-red-950/20 px-6 py-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-red-400/80 text-xs tracking-widest uppercase font-semibold">Fără AI</p>
          </div>
          <div className="bg-emerald-950/20 px-6 py-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-400/80 text-xs tracking-widest uppercase font-semibold">Cu AI Craiova</p>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-px bg-white/5">
          {scenarios.map((s, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr_1fr] gap-px cursor-pointer transition-all duration-200 ${activeRow === i ? 'bg-white/5' : 'bg-white/[0.02]'}`}
              onClick={() => setActiveRow(activeRow === i ? null : i)}
            >
              {/* Situatie */}
              <div className="bg-[#050505] px-6 py-5 flex items-center">
                <p className="text-white/70 text-sm font-medium">{s.situatie}</p>
              </div>
              {/* Traditional */}
              <div className="bg-red-950/10 px-6 py-5 flex items-start gap-3">
                <span className="text-red-500 text-sm shrink-0 mt-0.5">✕</span>
                <p className="text-red-300/60 text-sm leading-relaxed">{s.traditional.text}</p>
              </div>
              {/* AI */}
              <div className="bg-emerald-950/10 px-6 py-5 flex items-start gap-3">
                <span className="text-emerald-400 text-sm shrink-0 mt-0.5">✓</span>
                <p className="text-emerald-300/80 text-sm leading-relaxed">{s.ai.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cost comparison strip */}
        <div className="grid md:grid-cols-2 gap-px bg-white/5 mt-px mb-10">
          <div className="bg-red-950/15 px-8 py-8">
            <p className="text-red-400/50 text-xs tracking-widest uppercase mb-3">Fără AI — cost lunar</p>
            <p className="font-serif text-4xl font-bold text-red-400 mb-1">16.000 – 18.000 <span className="text-xl font-normal">lei</span></p>
            <p className="text-white/25 text-sm">3 angajați în schimburi + taxe + birou + erori</p>
          </div>
          <div className="bg-emerald-950/15 px-8 py-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-black text-[10px] font-bold tracking-widest uppercase">
              Recomandat
            </div>
            <p className="text-emerald-400/50 text-xs tracking-widest uppercase mb-3">Cu AI Craiova — cost lunar</p>
            <p className="font-serif text-4xl font-bold text-emerald-400 mb-1">400 – 600 <span className="text-xl font-normal">€</span></p>
            <p className="text-white/25 text-sm">Implementare + mentenanță. Recuperezi în 2–4 luni.</p>
          </div>
        </div>

        {/* Concluzie impact */}
        <div className="border border-gold/20 bg-gradient-to-r from-gold/5 via-gold/8 to-gold/5 p-10 text-center">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Concluzia calculului</p>
          <p className="text-white font-semibold text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-2">
            Afacerile care nu adoptă AI în 2025
          </p>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            nu pierd clienți din cauza prețului —{' '}
            <span className="text-gold">îi pierd din cauza timpului de răspuns.</span>
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-yellow-300 transition-all duration-300"
          >
            Vreau AI pentru afacerea mea →
          </a>
        </div>

      </div>
    </section>
  )
}
