'use client'
import { useLang } from '../LangContext'

const HOME_SMART_URL = '/aihomesmart'

const copy = {
  ro: {
    label: 'Nou · Pentru locuințe',
    title: 'AI Home Smart',
    sub: 'Venim și cu automatizare pentru locuințe — pentru consumatorii casnici.',
    desc: 'Automatizare completă AI: încălzire, climă, lumini, prize și panouri fotovoltaice, toate într-o singură aplicație. Mira te așteaptă acasă și îți gestionează singură confortul.',
    cta: 'Deschide aplicația',
  },
  en: {
    label: 'New · For homes',
    title: 'AI Home Smart',
    sub: 'We now also bring home automation — for residential consumers.',
    desc: 'Full AI automation: heating, cooling, lights, plugs and solar panels, all in one app. Mira welcomes you home and manages your comfort on its own.',
    cta: 'Open the app',
  },
  de: {
    label: 'Neu · Für Wohnungen',
    title: 'AI Home Smart',
    sub: 'Jetzt auch Hausautomation — für private Verbraucher.',
    desc: 'Vollständige KI-Automatisierung: Heizung, Kühlung, Licht, Steckdosen und Solaranlagen in einer App. Mira empfängt Sie zu Hause und steuert Ihren Komfort selbstständig.',
    cta: 'App öffnen',
  },
  it: {
    label: 'Novità · Per le case',
    title: 'AI Home Smart',
    sub: 'Ora anche automazione domestica — per i consumatori domestici.',
    desc: 'Automazione completa con IA: riscaldamento, climatizzazione, luci, prese e pannelli solari, tutto in una app. Mira ti aspetta a casa e gestisce da sola il tuo comfort.',
    cta: 'Apri l’app',
  },
  fr: {
    label: 'Nouveau · Pour les maisons',
    title: 'AI Home Smart',
    sub: 'Désormais aussi la domotique — pour les particuliers.',
    desc: 'Automatisation complète par IA : chauffage, climatisation, lumières, prises et panneaux solaires, le tout dans une seule app. Mira vous accueille chez vous et gère seule votre confort.',
    cta: 'Ouvrir l’application',
  },
  zh: {
    label: '全新 · 面向住宅',
    title: 'AI Home Smart',
    sub: '我们现在也提供家居自动化 —— 面向家庭用户。',
    desc: '全面的人工智能自动化：供暖、制冷、照明、插座和太阳能板，全部集成在一个应用中。Mira 在家中迎接您，并自动管理您的居家舒适。',
    cta: '打开应用',
  },
} as const

export default function HomeSmart() {
  const { lang } = useLang()
  const tr = copy[lang as keyof typeof copy] ?? copy.ro

  return (
    <section id="home-smart" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <a
          href={HOME_SMART_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={`${tr.title} — ${tr.desc}`}
          className="group flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/10 hover:border-gold/40 bg-gradient-to-br from-zinc-900/80 to-black transition-all duration-500 hover:from-zinc-900"
        >
          {/* Sigla AI Home Smart */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl group-hover:bg-gold/30 transition-all duration-500" />
            <img
              src="/home-smart-logo-512.png"
              alt="AI Home Smart"
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{tr.label}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              {tr.title}
            </h2>
            <p className="text-white/70 text-base md:text-lg">{tr.sub}</p>
            {/* descriere — vizibilă pe mobil, apare la hover pe desktop */}
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
