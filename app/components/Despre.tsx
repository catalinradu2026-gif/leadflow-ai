export default function Despre() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Despre noi</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Nu vindem software.<br />
            <span className="text-white/40">Construim sisteme.</span>
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-white/60 text-lg leading-relaxed">
            AI Craiova este o agenție specializată în implementarea sistemelor de automatizare bazate pe inteligență artificială. Lucrăm cu antreprenori și companii care vor să scaleze fără să angajeze mai mulți oameni.
          </p>
          <p className="text-white/40 leading-relaxed">
            Fiecare client primește un sistem personalizat — nu șabloane, nu soluții generice. Analizăm procesele tale, identificăm oportunitățile și construim infrastructura care lucrează pentru tine 24/7.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
            {[['98%', 'Rată satisfacție'], ['3x', 'ROI mediu client'], ['24/7', 'Sisteme active']].map(([val, label]) => (
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
