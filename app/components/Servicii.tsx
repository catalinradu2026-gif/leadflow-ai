const servicii = [
  {
    icon: '💬',
    titlu: 'Bot WhatsApp AI',
    descriere: 'Bot inteligent care preia rezervări, califică lead-uri și răspunde clienților 24/7. Perfect pentru clinici, restaurante, hoteluri, saloane.',
    features: ['Rezervări automate', 'Calificare lead-uri', 'Răspunsuri instant 24/7'],
  },
  {
    icon: '⚡',
    titlu: 'Automatizări Complete',
    descriere: 'Conectăm toate aplicațiile tale — WhatsApp, email, calendar, facturare. Fluxuri automate cu n8n + AI care elimină munca repetitivă.',
    features: ['Integrare n8n', 'Conectare Groq/Claude AI', 'Zero intervenție manuală'],
  },
  {
    icon: '🤖',
    titlu: 'Agenți AI cu Memorie',
    descriere: 'Agenți AI care știu istoricul fiecărui client, urmăresc conversații și iau decizii inteligente. Nu simple chatboturi — sisteme cu adevărat inteligente.',
    features: ['Memorie conversații', 'Decizii contextuale', 'Personalizare avansată'],
  },
  {
    icon: '🔗',
    titlu: 'Integrări Complete',
    descriere: 'Site + WhatsApp + Calendar + Plăți + CRM — totul conectat într-un singur ecosistem. Clientul intră, sistemul lucrează automat.',
    features: ['Integrare site web', 'Calendar & plăți', 'CRM automatizat'],
  },
  {
    icon: '📊',
    titlu: 'Audit & Optimizare',
    descriere: 'Analizăm procesele tale actuale, identificăm unde pierzi timp și bani, și implementăm soluții AI cu ROI măsurabil.',
    features: ['Analiză procese', 'Raport ROI', 'Plan implementare'],
  },
  {
    icon: '🛡️',
    titlu: 'Mentenanță Lunară',
    descriere: 'Nu te lăsăm singur după implementare. Monitorizăm, optimizăm și îmbunătățim continuu sistemele tale AI.',
    features: ['Monitorizare 24/7', 'Update-uri lunare', 'Support prioritar'],
  },
]

export default function Servicii() {
  return (
    <section id="servicii" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Ce construim</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Servicii AI pentru afaceri locale</h2>
          <p className="text-white/40 max-w-xl mx-auto">Soluții adaptate pentru clinici, restaurante, hoteluri, saloane, magazine și service-uri din Craiova și Dolj</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {servicii.map((s) => (
            <div key={s.titlu} className="group p-8 border border-white/5 hover:border-gold/30 bg-black/40 transition-all duration-500 hover:bg-black/60">
              <div className="text-3xl mb-6">{s.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">{s.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{s.descriere}</p>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="text-white/30 text-xs flex items-center gap-2">
                    <span className="text-gold">✓</span> {f}
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
