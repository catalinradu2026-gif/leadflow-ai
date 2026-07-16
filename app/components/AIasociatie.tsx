'use client'
import { useLang } from '../LangContext'

const AIASOCIATIE_URL = 'https://aiasociatie.ro'

const copy = {
  ro: {
    label: 'Nou · Pentru asociații de proprietari',
    title: 'AIasociatie.ro',
    sub: 'Administrarea blocului, automatizată cu AI — mai simplu decât eBloc.',
    desc: 'Platformă completă: liste de plată, încasări online cu cardul, apometre, penalizări legale, contabilitate și un asistent AI care răspunde locatarilor pe WhatsApp.',
    cta: 'Deschide platforma',
  },
  en: {
    label: 'New · For homeowner associations',
    title: 'AIasociatie.ro',
    sub: 'Building administration, automated with AI — simpler than the rest.',
    desc: 'Complete platform: payment lists, online card payments, water meters, legal penalties, accounting and an AI assistant that answers residents on WhatsApp.',
    cta: 'Open the platform',
  },
  de: {
    label: 'Neu · Für Eigentümergemeinschaften',
    title: 'AIasociatie.ro',
    sub: 'Hausverwaltung, mit KI automatisiert — einfacher als der Rest.',
    desc: 'Komplette Plattform: Zahlungslisten, Online-Kartenzahlungen, Wasserzähler, gesetzliche Verzugszinsen, Buchhaltung und ein KI-Assistent, der Bewohner auf WhatsApp beantwortet.',
    cta: 'Plattform öffnen',
  },
  it: {
    label: 'Novità · Per i condomìni',
    title: 'AIasociatie.ro',
    sub: 'Amministrazione del condominio, automatizzata con IA — più semplice.',
    desc: 'Piattaforma completa: liste di pagamento, pagamenti online con carta, contatori acqua, penali legali, contabilità e un assistente IA che risponde ai residenti su WhatsApp.',
    cta: 'Apri la piattaforma',
  },
  fr: {
    label: 'Nouveau · Pour les copropriétés',
    title: 'AIasociatie.ro',
    sub: 'La gestion d’immeuble, automatisée par IA — plus simple.',
    desc: 'Plateforme complète : listes de paiement, paiements en ligne par carte, compteurs d’eau, pénalités légales, comptabilité et un assistant IA qui répond aux résidents sur WhatsApp.',
    cta: 'Ouvrir la plateforme',
  },
  zh: {
    label: '全新 · 面向业主协会',
    title: 'AIasociatie.ro',
    sub: '用人工智能自动化的物业管理 —— 更简单。',
    desc: '完整平台：缴费清单、在线刷卡支付、水表、法定滞纳金、会计核算，以及一个在 WhatsApp 上回答住户的人工智能助手。',
    cta: '打开平台',
  },
} as const

export default function AIasociatie() {
  const { lang } = useLang()
  const tr = copy[lang as keyof typeof copy] ?? copy.ro

  return (
    <section id="aiasociatie" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <a
          href={AIASOCIATIE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={`${tr.title} — ${tr.desc}`}
          className="group flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/10 hover:border-gold/40 bg-gradient-to-br from-zinc-900/80 to-black transition-all duration-500 hover:from-zinc-900"
        >
          {/* Icon — bloc modern, cu glow auriu */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl group-hover:bg-gold/30 transition-all duration-500" />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-zinc-800 to-black border border-gold/30 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <svg viewBox="0 0 48 48" className="w-16 h-16 md:w-20 md:h-20" fill="none">
                <rect x="10" y="6" width="17" height="36" rx="1.5" className="stroke-gold" strokeWidth="1.6" />
                <rect x="27" y="18" width="12" height="24" rx="1.5" className="stroke-gold" strokeWidth="1.6" />
                <g className="fill-gold">
                  <rect x="13.5" y="10" width="3.5" height="3.5" rx="0.5" />
                  <rect x="20" y="10" width="3.5" height="3.5" rx="0.5" />
                  <rect x="13.5" y="17" width="3.5" height="3.5" rx="0.5" />
                  <rect x="20" y="17" width="3.5" height="3.5" rx="0.5" />
                  <rect x="13.5" y="24" width="3.5" height="3.5" rx="0.5" />
                  <rect x="20" y="24" width="3.5" height="3.5" rx="0.5" />
                  <rect x="30.5" y="22" width="3" height="3" rx="0.5" />
                  <rect x="35" y="22" width="3" height="3" rx="0.5" />
                  <rect x="30.5" y="28" width="3" height="3" rx="0.5" />
                  <rect x="35" y="28" width="3" height="3" rx="0.5" />
                  <rect x="17" y="34" width="5" height="8" rx="0.5" />
                </g>
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{tr.label}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">{tr.title}</h2>
            <p className="text-white/70 text-base md:text-lg">{tr.sub}</p>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl mt-3 max-h-40 opacity-100 overflow-hidden transition-all duration-500 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:mt-3 md:group-hover:max-h-40 md:group-hover:opacity-100">{tr.desc}</p>
          </div>

          {/* CTA */}
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
