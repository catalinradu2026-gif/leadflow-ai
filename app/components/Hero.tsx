'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Hero() {
  const { lang } = useLang()
  const tr = t[lang].hero

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[140px]" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 bg-gold/5 mb-4">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          <span className="text-gold text-xs tracking-[0.2em] uppercase">{tr.badge}</span>
        </div>
        <p className="text-white/50 text-sm md:text-base mb-8">
          {tr.tagline}
        </p>

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          {tr.title1}{' '}
          <span className="text-gold">{tr.title2}</span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          {tr.sub1}
        </p>
        <p className="text-white/30 text-base max-w-xl mx-auto mb-12">
          {tr.sub2}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300">
            {tr.cta1}
          </a>
          <a href="#servicii" className="px-10 py-4 border border-white/20 text-white/70 text-sm tracking-widest uppercase hover:border-white/50 hover:text-white transition-all duration-300">
            {tr.cta2}
          </a>
        </div>

        <p className="text-white/20 text-xs mt-8">{tr.footer}</p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        SCROLL
      </div>
    </section>
  )
}
