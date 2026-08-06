'use client'
import { useLang } from '../LangContext'

const NIDO_URL = '/nido'

const copy = {
  ro: {
    label: 'Nou · Siguranța celor dragi',
    title: 'Nido',
    sub: 'Aplicație GPS pentru copii și vârstnici, cu AI care veghează, nu doar urmărește.',
    desc: 'Localizare live, AI Guard pentru grooming și bullying, detectare cădere pentru vârstnici, Nido Navi — rută cu transport public ca la Bolt, și un asistent AI, Ava, care răspunde 24/7.',
    cta: 'Deschide Nido',
  },
  en: {
    label: 'New · Safety for your loved ones',
    title: 'Nido',
    sub: 'GPS app for children and elderly, with AI that watches, not just tracks.',
    desc: 'Live location, AI Guard for grooming and bullying, fall detection for the elderly, Nido Navi — public-transport routing like Bolt, and an AI assistant, Ava, answering 24/7.',
    cta: 'Open Nido',
  },
  de: {
    label: 'Neu · Sicherheit für Ihre Liebsten',
    title: 'Nido',
    sub: 'GPS-App für Kinder und Senioren, mit KI, die wacht, nicht nur ortet.',
    desc: 'Live-Standort, KI-Schutz vor Grooming und Mobbing, Sturzerkennung für Senioren, Nido Navi — ÖPNV-Routing wie bei Bolt, und ein KI-Assistent, Ava, rund um die Uhr erreichbar.',
    cta: 'Nido öffnen',
  },
  it: {
    label: 'Novità · Sicurezza per i tuoi cari',
    title: 'Nido',
    sub: 'App GPS per bambini e anziani, con IA che veglia, non solo traccia.',
    desc: 'Posizione in tempo reale, AI Guard contro adescamento e bullismo, rilevamento cadute per anziani, Nido Navi — percorso con mezzi pubblici come Bolt, e un assistente IA, Ava, attivo 24/7.',
    cta: 'Apri Nido',
  },
  fr: {
    label: 'Nouveau · Sécurité pour vos proches',
    title: 'Nido',
    sub: 'Application GPS pour enfants et aînés, avec une IA qui veille, pas seulement qui suit.',
    desc: 'Localisation en direct, AI Guard contre le grooming et le harcèlement, détection de chute pour les aînés, Nido Navi — itinéraire en transports comme Bolt, et une assistante IA, Ava, disponible 24/7.',
    cta: 'Ouvrir Nido',
  },
  zh: {
    label: '全新 · 守护您所爱之人',
    title: 'Nido',
    sub: '面向儿童和长辈的 GPS 应用，AI 不只追踪，更懂得守护。',
    desc: '实时定位、AI 守护识别诱骗与霸凌、长辈跌倒检测、Nido Navi（像 Bolt 一样规划公共交通路线），以及 24/7 在线的 AI 助手 Ava。',
    cta: '打开 Nido',
  },
} as const

export default function Nido() {
  const { lang } = useLang()
  const tr = copy[lang as keyof typeof copy] ?? copy.ro

  return (
    <section id="nido" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <a
          href={NIDO_URL}
          title={`${tr.title} — ${tr.desc}`}
          className="group flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/10 hover:border-gold/40 bg-gradient-to-br from-zinc-900/80 to-black transition-all duration-500 hover:from-zinc-900"
        >
          <div className="shrink-0 relative">
            <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl group-hover:bg-gold/30 transition-all duration-500" />
            <img
              src="/nido-og.png"
              alt="Nido"
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{tr.label}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              {tr.title}
            </h2>
            <p className="text-white/70 text-base md:text-lg">{tr.sub}</p>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl mt-3 max-h-40 opacity-100 overflow-hidden transition-all duration-500 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:mt-3 md:group-hover:max-h-40 md:group-hover:opacity-100">{tr.desc}</p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black text-xs font-semibold tracking-widest uppercase group-hover:bg-gold-light transition-all duration-300">
              {tr.cta}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}
