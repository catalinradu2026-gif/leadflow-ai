export default function Despre() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Cine suntem</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Prima agenție AI<br />
            <span className="text-white/40">din Craiova</span>
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-white/60 text-lg leading-relaxed">
            Suntem prima agenție din Craiova specializată în automatizări inteligente cu AI. Creăm boți WhatsApp, agenți AI și automatizări care economisesc zeci de ore pe săptămână.
          </p>
          <p className="text-white/40 leading-relaxed">
            Lucrăm cu clinici medicale, restaurante, hoteluri, saloane, magazine și service-uri din Craiova și Dolj. Înțelegem piața locală și construim soluții adaptate realității românești — nu șabloane generice.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
            {[['7-14', 'Zile implementare'], ['24/7', 'Sisteme active'], ['100%', 'Suport în română']].map(([val, label]) => (
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
