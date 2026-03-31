const testimoniale = [
  {
    nume: 'Client — Cazare Olimp',
    rol: 'Proprietar locație turistică',
    text: 'Botul AI a preluat toate rezervările pe WhatsApp. Nu mai pierd rezervări noaptea și am câștigat minim 3 ore pe zi. Implementarea a durat o săptămână.',
    initiale: 'CB',
  },
  {
    nume: 'Urmează afacerea ta',
    rol: 'Craiova & Dolj',
    text: 'Fii printre primii antreprenori din Craiova care automatizează cu AI. Programează o discuție gratuită și vezi cum arată sistemul pentru afacerea ta.',
    initiale: '?',
  },
  {
    nume: 'Urmează afacerea ta',
    rol: 'Craiova & Dolj',
    text: 'Locuri limitate pentru implementări noi în această lună. Contactează-ne acum pentru a beneficia de prețul de lansare.',
    initiale: '?',
  },
]

export default function Testimoniale() {
  return (
    <section className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Ce spun clienții</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Rezultate reale</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimoniale.map((t, i) => (
            <div key={i} className="p-8 border border-white/5 bg-black/40 hover:border-gold/10 transition-all duration-300">
              <div className="text-gold text-3xl font-serif mb-6">"</div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 italic">{t.text}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-10 h-10 bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                  {t.initiale}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.nume}</div>
                  <div className="text-white/30 text-xs">{t.rol}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
