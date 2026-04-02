'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Probleme() {
  const { lang } = useLang()
  const tr = t[lang].probleme

  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            {tr.title1}<br />
            <span className="text-white/40">{tr.title2}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {tr.items.map((p) => (
            <div key={p.problema} className="p-8 border border-white/5 bg-zinc-950/50 group hover:border-gold/20 transition-all duration-300">
              <div className="flex gap-6 items-start">
                <div className="text-3xl flex-shrink-0">{p.icon}</div>
                <div>
                  <p className="text-white/40 text-sm mb-3 line-through">❌ {p.problema}</p>
                  <p className="text-white/80 text-sm font-medium">✅ {p.solutie}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#contact" className="inline-block px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300">
            {tr.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
