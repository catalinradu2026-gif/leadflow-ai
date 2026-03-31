const motive = [
  {
    icon: '📍',
    titlu: 'Local în Craiova',
    descriere: 'Nu suntem o agenție din București sau din altă țară. Suntem din Craiova, înțelegem piața locală, ne întâlnim față în față și răspundem rapid.',
  },
  {
    icon: '⚡',
    titlu: 'Tehnologie de top',
    descriere: 'Folosim Groq pentru răspunsuri AI ultra-rapide (sub 1 secundă) la costuri minime. Modele Claude și Llama adaptate pentru fiecare proiect.',
  },
  {
    icon: '🚀',
    titlu: 'Implementare rapidă',
    descriere: 'De la discuție la sistem live în 7-14 zile. Nu luni de așteptare, nu birocrație — livrăm rapid și concret.',
  },
  {
    icon: '🇷🇴',
    titlu: 'Suport 100% în română',
    descriere: 'Documentație, training și suport complet în română. Nicio barieră lingvistică, nicio confuzie — comunicăm clar și direct.',
  },
  {
    icon: '💰',
    titlu: 'ROI măsurabil',
    descriere: 'Nu vindem promisiuni. Înainte de orice implementare calculăm împreună cât timp și bani economisești. Plătești doar dacă are sens.',
  },
  {
    icon: '🔧',
    titlu: 'Mentenanță inclusă',
    descriere: 'Nu dispărem după implementare. Monitorizăm, optimizăm și actualizăm sistemele lunar. Ești în mâini bune pe termen lung.',
  },
]

export default function DeceNoi() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Avantajul nostru</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">De ce AI Craiova?</h2>
          <p className="text-white/40 max-w-xl mx-auto">Local, rapid, profesionist — exact ce ai nevoie pentru a automatiza afacerea ta</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {motive.map((m) => (
            <div key={m.titlu} className="p-8 border border-white/5 hover:border-gold/20 transition-all duration-300">
              <div className="text-3xl mb-4">{m.icon}</div>
              <h3 className="font-semibold text-white mb-3">{m.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{m.descriere}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
