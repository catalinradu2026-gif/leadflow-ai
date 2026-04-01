const testimoniale = [
  {
    nume: 'Client — Cazare Olimp',
    rol: 'Proprietar locație turistică',
    text: 'Botul AI a preluat toate rezervările pe WhatsApp. Nu mai pierd rezervări noaptea și am câștigat minim 3 ore pe zi. Implementarea a durat o săptămână.',
    initiale: 'CB',
    tag: null,
  },
  {
    nume: 'Client — Firmă internațională de recrutare',
    rol: 'Director operațional',
    text: 'Am implementat botul WhatsApp AI pentru gestionarea a sute de candidați simultan, în perioada de recrutare intensă. Botul colectează automat datele (nume, dată naștere, telefon, buletin), filtrează candidații după criterii precise și trimite dosarele direct recrutorilor responsabili — fără nicio intervenție manuală. Volumul de muncă s-a redus drastic. Clientul a fost impresionat de viteza de implementare și de cât de bine a înțeles botul contextul specific al afacerii lor.',
    initiale: 'DE',
    tag: '🌍 Internațional',
  },
  {
    nume: 'Urmează afacerea ta',
    rol: 'Craiova & Dolj',
    text: 'Locuri limitate pentru implementări noi în această lună. Contactează-ne acum pentru a beneficia de prețul de lansare.',
    initiale: '?',
    tag: null,
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
            <div key={i} className={`p-8 border bg-black/40 hover:border-gold/10 transition-all duration-300 flex flex-col ${i === 1 ? 'border-gold/25 bg-gold/[0.03]' : 'border-white/5'}`}>
              {t.tag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-5 self-start">
                  {t.tag}
                </div>
              )}
              <div className="text-gold text-3xl font-serif mb-6">"</div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 italic flex-1">{t.text}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0 ${i === 1 ? 'bg-gold/30 text-gold' : 'bg-gold/20 text-gold'}`}>
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
