'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Despre() {
  const { lang } = useLang()
  const tr = t[lang].despre

  return (
    <section id="despre" className="py-32 bg-black border-t border-white/5 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            {tr.title1}<br />
            <span className="text-white/40">{tr.title2}</span>
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-white/60 text-lg leading-relaxed">
            {tr.p1}
          </p>
          <p className="text-white/40 leading-relaxed">
            {tr.p2}
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
            {tr.stats.map(([val, label]) => (
              <div key={label}>
                <div className="font-serif text-3xl text-gold mb-1">{val}</div>
                <div className="text-white/40 text-xs tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
