const servicii = [
  {
    icon: '◈',
    titlu: 'AI Client Systems',
    descriere: 'Sisteme conversaționale AI care preiau și califică lead-urile automat, 24/7. Chatboți avansați, voiceboți și agenți AI personalizați pentru afacerea ta.',
    features: ['Chatbot AI personalizat', 'Calificare automată lead-uri', 'Integrare CRM'],
  },
  {
    icon: '◉',
    titlu: 'Lead Generation Systems',
    descriere: 'Infrastructuri automate care atrag constant clienți potențiali calificați. De la campanii AI-driven la sisteme de nurturing complet automatizate.',
    features: ['Campanii automate', 'Scoring lead-uri AI', 'Follow-up inteligent'],
  },
  {
    icon: '◎',
    titlu: 'Sales Automation',
    descriere: 'Automatizăm întreg ciclul de vânzare — de la primul contact la semnarea contractului. Procese repetitive eliminate, echipa ta focusată pe closing.',
    features: ['Pipeline automatizat', 'Propuneri generate AI', 'Raportare în timp real'],
  },
]

export default function Servicii() {
  return (
    <section id="servicii" className="py-32 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Ce facem</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Servicii premium</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {servicii.map((s) => (
            <div
              key={s.titlu}
              className="group p-8 border border-white/5 hover:border-gold/30 bg-black/40 transition-all duration-500 hover:bg-black/60"
            >
              <div className="text-gold text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">{s.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{s.descriere}</p>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="text-white/30 text-xs flex items-center gap-2">
                    <span className="text-gold">—</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
