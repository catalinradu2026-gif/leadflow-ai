const pasi = [
  {
    nr: '01',
    titlu: 'Analiză',
    descriere: 'Studiem în detaliu procesele tale de vânzare, punctele de fricțiune și oportunitățile de automatizare. Livrăm un raport complet cu roadmap-ul de implementare.',
  },
  {
    nr: '02',
    titlu: 'Implementare',
    descriere: 'Construim și integrăm sistemele AI în infrastructura ta existentă. Zero downtime, zero complicații. Echipa ta continuă să lucreze normal în timp ce noi implementăm.',
  },
  {
    nr: '03',
    titlu: 'Optimizare',
    descriere: 'Monitorizăm performanța, analizăm datele și optimizăm continuu sistemele. Fiecare lună sistemul devine mai inteligent și mai eficient.',
  },
]

export default function Proces() {
  return (
    <section id="proces" className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Cum lucrăm</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Procesul nostru</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Linie conectoare */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          {pasi.map((pas) => (
            <div key={pas.nr} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/30 text-gold font-serif text-xl mb-8 relative">
                {pas.nr}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-4">{pas.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{pas.descriere}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
