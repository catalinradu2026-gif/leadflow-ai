const planuri = [
  {
    nume: 'Essential',
    pret: '500€',
    descriere: 'Perfect pentru afaceri la început de drum care vor să automatizeze primele procese.',
    features: ['1 sistem AI implementat', 'Chatbot personalizat', 'Integrare email/WhatsApp', 'Setup & configurare', 'Support 30 zile'],
    highlight: false,
  },
  {
    nume: 'Growth',
    pret: '1.500€',
    descriere: 'Soluția completă pentru afaceri care vor să scaleze rapid și consistent.',
    features: ['3 sisteme AI integrate', 'Lead generation automat', 'CRM + pipeline automatizat', 'Raportare lunară', 'Support 90 zile', 'Optimizare lunară'],
    highlight: true,
  },
  {
    nume: 'Elite',
    pret: '3.000€',
    descriere: 'Infrastructură completă de automatizare pentru companii cu procese complexe.',
    features: ['Sisteme AI nelimitate', 'Strategie personalizată', 'Integrări complexe', 'Dedicated account manager', 'SLA garantat', 'Optimizare continuă'],
    highlight: false,
  },
]

export default function Preturi() {
  return (
    <section id="preturi" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Investiție</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Pachete & Prețuri</h2>
          <p className="text-white/40">Prețuri de la, personalizate în funcție de complexitate</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {planuri.map((plan) => (
            <div
              key={plan.nume}
              className={`relative p-8 border transition-all duration-300 ${
                plan.highlight
                  ? 'border-gold/50 bg-gold/5'
                  : 'border-white/5 bg-black/40 hover:border-white/10'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black text-xs font-semibold tracking-widest uppercase">
                  Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-white mb-2">{plan.nume}</h3>
                <div className="text-gold font-serif text-4xl font-bold mb-4">
                  de la {plan.pret}
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{plan.descriere}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="text-white/60 text-sm flex items-center gap-3">
                    <span className="text-gold text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center py-3 text-sm tracking-widest uppercase transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gold text-black hover:bg-gold-light'
                    : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                Solicită ofertă
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
