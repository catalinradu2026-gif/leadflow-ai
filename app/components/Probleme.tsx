const probleme = [
  {
    problema: 'Pierzi ore întregi răspunzând la mesaje WhatsApp',
    solutie: 'Botul AI răspunde instant, 24/7, fără să obosești',
    icon: '⏰',
  },
  {
    problema: 'Clienții sună și nu găsesc pe nimeni disponibil',
    solutie: 'Agentul AI preia, califică și programează automat',
    icon: '📞',
  },
  {
    problema: 'Rezervările se fac manual și apar duble sau greșeli',
    solutie: 'Sistem automat conectat la calendar, zero erori',
    icon: '📅',
  },
  {
    problema: 'Nu ai timp să urmărești toți lead-urile și pierzi clienți',
    solutie: 'Follow-up automat după fiecare contact, fără să uiți pe nimeni',
    icon: '💰',
  },
]

export default function Probleme() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Recunoști situația?</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Cât timp pierzi tu<br />
            <span className="text-white/40">în fiecare zi?</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {probleme.map((p) => (
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
            Vreau să rezolv asta →
          </a>
        </div>
      </div>
    </section>
  )
}
