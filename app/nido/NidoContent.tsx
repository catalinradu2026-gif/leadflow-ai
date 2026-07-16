'use client'
import { useState } from 'react'
import { useLang } from '../LangContext'
import { t } from '../translations'
import InstallButton from './InstallButton'
import NidoChatbot from './NidoChatbot'

const IBAN = 'RO45 BTRL RONCRT 0433800501'

const ANNUAL_DISCOUNT = 0.3 // 30% reducere la plata anuala
const MONTHS = 12

// Formatare in stil RO: virgula zecimala, 2 zecimale (ex. 327,60)
function fmt2(n: number): string {
  return n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
// Format fara zecimale fortate (ex. 39 sau 39,5)
function fmt(n: number): string {
  return n.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function NidoContent() {
  const { lang, cycleLang } = useLang()
  const tr = t[lang].nido

  const [annual, setAnnual] = useState(false)

  // Preturi lunare din dictionar (sursa de adevar) -> calcul anual cu -30%
  const familyMonthly = parseFloat(tr.planFamilyPrice)
  const premiumMonthly = parseFloat(tr.planPremiumPrice)

  function annualTotal(monthly: number) {
    return monthly * MONTHS * (1 - ANNUAL_DISCOUNT)
  }
  function annualSavings(monthly: number) {
    return monthly * MONTHS * ANNUAL_DISCOUNT
  }
  function annualPerMonth(monthly: number) {
    return annualTotal(monthly) / MONTHS
  }

  const iosMail = `mailto:contact@aicraiova.ro?subject=${encodeURIComponent(tr.iosMailSubject)}&body=${encodeURIComponent(tr.iosMailBody)}`

  // Bloc de pret reutilizabil pentru Family / Premium (respecta toggle-ul anual)
  function PaidPriceBlock({ monthly }: { monthly: number }) {
    if (!annual) {
      return (
        <div className="mt-2">
          <div>
            <span className="text-3xl font-bold">{fmt(monthly)}</span>
            <span className="text-white/50">{tr.planUnitMonth}</span>
          </div>
          <div className="text-cyan-300 text-sm mt-1 font-semibold">
            ≈ {fmt2(monthly / 30)} {tr.perDayEquiv}
          </div>
        </div>
      )
    }
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <span className="text-white/40 line-through text-base">{fmt(monthly)}{tr.planUnitMonth}</span>
          <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[11px] font-bold text-amber-200">
            {tr.billingSaveBadge}
          </span>
        </div>
        <div className="mt-1">
          <span className="text-3xl font-bold">{fmt2(annualTotal(monthly))}</span>
          <span className="text-white/50"> lei{tr.perYear}</span>
        </div>
        <div className="text-cyan-300 text-sm mt-1 font-semibold">
          ≈ {fmt2(annualPerMonth(monthly))} lei{tr.perMonthEquiv} · {fmt2(annualPerMonth(monthly) / 30)} {tr.perDayEquiv}
        </div>
        <div className="text-emerald-300 text-sm mt-1 font-semibold">
          {tr.youSave} {fmt2(annualSavings(monthly))} lei
        </div>
        <div className="text-white/40 text-xs mt-2 leading-relaxed">
          {fmt(monthly)} × {MONTHS} {tr.formulaMonths} {tr.formulaConnector} {tr.formulaDiscount} = {fmt2(annualTotal(monthly))} lei{tr.perYear}
        </div>
      </div>
    )
  }

  // Pretul Premium / zi (folosit pentru framingul "sub 2 lei pe zi")
  const premiumPerDay = premiumMonthly / 30

  return (
    <main className="min-h-screen bg-[#04111f] text-white overflow-x-hidden">
      {/* glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <a href="/" className="font-serif text-lg font-semibold tracking-wide">
            AI <span className="text-gold">Craiova</span>
          </a>
          <div className="flex items-center gap-4">
            {/* Lang toggle */}
            <button
              onClick={cycleLang}
              title="Schimbă limba / Change language"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-white/80 text-xs font-semibold hover:border-white/50 hover:text-white transition-all duration-200 shrink-0 rounded"
            >
              <span className="text-base leading-none">
                {lang === 'ro' ? '🇷🇴' : lang === 'en' ? '🇬🇧' : lang === 'de' ? '🇩🇪' : lang === 'it' ? '🇮🇹' : lang === 'fr' ? '🇫🇷' : '🇨🇳'}
              </span>
              <span className="tracking-widest uppercase">{lang.toUpperCase()}</span>
            </button>
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <span className="text-xl">🐣</span>
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Nido</span>
            </span>
          </div>
        </div>
      </header>

      {/* ===== 1. HERO — promisiune clara ===== */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 text-4xl shadow-2xl shadow-cyan-500/30">
          🐣
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-6 leading-tight">{tr.heroTitle}</h1>
        <p className="mt-4 text-lg md:text-xl text-cyan-300 font-semibold tracking-wide">{tr.heroSub}</p>
        <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed font-light">
          <b className="text-white font-semibold">{tr.heroLead1}</b> {tr.heroLeadBold}{tr.heroLead2}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <InstallButton label={tr.heroCta} />
          <p className="text-sm text-white/55">{tr.installNote}</p>

          {/* Framing pret: sub 2 lei pe zi, direct sub CTA */}
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            ☕ {tr.pricePerDayHero}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200">
            {tr.urgencyLine}
          </span>

          <a
            href={iosMail}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
          >
            {tr.iosCta}
          </a>

          <p className="mt-2 text-xs text-white/50 max-w-md">{tr.trustLine}</p>
        </div>
      </section>

      {/* ===== 2. PROBLEMA / FRICA — de ce ai nevoie ===== */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center leading-tight">{tr.problemTitle}</h2>
        <p className="text-white/60 text-center mt-3 max-w-2xl mx-auto leading-relaxed">{tr.problemSub}</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {tr.problemItems.map((p) => (
            <div key={p.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <div className="text-4xl">{p.e}</div>
              <h3 className="font-bold mt-3">{p.t}</h3>
              <p className="text-white/55 text-sm mt-2 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent max-w-2xl mx-auto leading-relaxed">
          {tr.problemPunch}
        </p>
      </section>

      {/* ===== 3. CUM FUNCȚIONEAZĂ — 3 pasi simpli ===== */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl font-bold text-center">{tr.howTitle}</h2>
        <p className="text-white/55 text-center mt-2 mb-10">{tr.howSub}</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {tr.howSteps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <div className="mx-auto w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[#04263b] font-bold grid place-items-center text-lg">
                {i + 1}
              </div>
              <div className="text-3xl mt-4">{s.e}</div>
              <h3 className="font-bold mt-2">{s.t}</h3>
              <p className="text-white/55 text-sm mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 4. FUNCȚII DE BAZĂ ===== */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl font-bold text-center">{tr.featuresTitle}</h2>
        <p className="text-white/55 text-center mt-2 mb-10">{tr.featuresSub}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tr.features.map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
            >
              <div className="text-3xl">{f.e}</div>
              <h3 className="font-bold mt-3">{f.t}</h3>
              <p className="text-white/55 text-sm mt-1 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 4.5 🧭 NIDO NAVI — VEDETA NOUĂ (ca Bolt) ===== */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-400/[0.10] via-cyan-500/[0.07] to-blue-600/[0.10] p-8 md:p-12">
          <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-amber-400/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-cyan-400/20 blur-[110px]" />

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/15 px-4 py-1.5 text-xs font-bold text-amber-200 animate-pulse">
              {tr.aiNaviBadge}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-5 leading-tight">{tr.aiNaviTitle}</h2>
            <p className="text-white/80 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">{tr.aiNaviTagline}</p>
            <p className="text-cyan-200 font-semibold mt-4 max-w-2xl mx-auto leading-relaxed">{tr.aiNaviLead}</p>
          </div>

          {/* 3 pasi Navi, ca un flow Bolt */}
          <div className="relative grid sm:grid-cols-3 gap-4 mt-10">
            {tr.aiNaviSteps.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-white/10 bg-[#04111f]/60 p-6 text-center">
                <span className="absolute top-3 right-4 text-xs font-bold text-amber-300/50">{String(i + 1).padStart(2, '0')}</span>
                <div className="text-4xl">{s.e}</div>
                <h3 className="font-bold mt-3 text-amber-100">{s.t}</h3>
                <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          <p className="relative mt-8 text-center text-sm md:text-base font-semibold text-white/80 max-w-2xl mx-auto leading-relaxed">
            {tr.aiNaviNote}
          </p>
        </div>
      </section>

      {/* ===== 5. ⭐ AI PREMIUM — vedeta / diferentiatorul ===== */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/[0.10] via-blue-600/[0.06] to-purple-600/[0.08] p-8 md:p-12">
          <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-blue-600/20 blur-[100px]" />

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-200">
              {tr.aiPremiumBadge}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-5 leading-tight">{tr.aiPremiumTitle}</h2>
            <p className="text-white/70 mt-3 max-w-2xl mx-auto leading-relaxed">{tr.aiPremiumSub}</p>

            {/* Mesaj-cheie: GPS vs AI */}
            <div className="mt-8 inline-flex flex-col sm:flex-row items-stretch gap-3 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="text-2xl">📍</div>
                <p className="mt-2 text-white/70 text-sm font-medium">{tr.aiPremiumKey1}</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 px-5 py-4 shadow-lg shadow-cyan-500/10">
                <div className="text-2xl">🧠</div>
                <p className="mt-2 text-cyan-100 text-sm font-bold">{tr.aiPremiumKey2}</p>
              </div>
            </div>
          </div>

          {/* Functiile AI (Nido Navi e prezentat separat, ca vedeta) */}
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {tr.aiPremiumItems.map((a, i) => (
              <div
                key={a.t}
                className="group relative rounded-2xl border border-white/10 bg-[#04111f]/60 p-5 transition hover:border-cyan-400/50 hover:bg-[#04111f]/80"
              >
                <span className="absolute top-4 right-4 text-xs font-bold text-cyan-300/40 group-hover:text-cyan-300/70 transition">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="text-3xl">{a.e}</div>
                <h3 className="font-bold mt-3 text-cyan-100">{a.t}</h3>
                <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>

          {/* Reframing pret + concluzie */}
          <div className="relative mt-10 text-center">
            <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent max-w-2xl mx-auto leading-relaxed">
              {tr.aiPremiumReframe}
            </p>
            <span className="inline-flex items-center gap-2 mt-5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-bold text-cyan-100">
              ☕ {tr.aiPremiumPerDay}
            </span>
            <p className="text-white/55 text-sm mt-4">{tr.aiPremiumClose}</p>
          </div>
        </div>
      </section>

      {/* ===== 5.5 TOT CE FACE NIDO — pe categorii ===== */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center leading-tight">{tr.allFeaturesTitle}</h2>
        <p className="text-white/60 text-center mt-3 max-w-2xl mx-auto leading-relaxed">{tr.allFeaturesSub}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {tr.featureCategories.map((cat) => (
            <div
              key={cat.t}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.e}</span>
                <h3 className="font-serif text-xl font-bold">{cat.t}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {cat.items.map((it) => (
                  <li key={it} className="flex gap-2 text-white/75 text-sm leading-relaxed">
                    <span className="text-cyan-400 shrink-0">✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 6. PREȚURI ===== */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-serif text-3xl font-bold text-center">{tr.pricingTitle}</h2>
        <p className="text-center mt-3">
          <span className="inline-block rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-200">
            {tr.pricingBadge}
          </span>
        </p>

        {/* Toggle Lunar / Anual (-30%) */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                !annual ? 'bg-white text-[#04263b]' : 'text-white/70 hover:text-white'
              }`}
            >
              {tr.billingMonthly}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                annual ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-[#04263b]' : 'text-white/70 hover:text-white'
              }`}
            >
              {tr.billingAnnual}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${annual ? 'bg-[#04263b]/20 text-[#04263b]' : 'bg-amber-400/20 text-amber-200'}`}>
                {tr.billingSaveBadge}
              </span>
            </button>
          </div>
          <p className="text-xs text-white/50">{annual ? tr.payOncePerYear : tr.billingDiscountNote}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-10 items-start">
          {/* Gratuit */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col">
            <div className="text-3xl">🆓</div>
            <h3 className="font-serif text-xl font-bold mt-3">{tr.planFreeName}</h3>
            <div className="mt-2"><span className="text-3xl font-bold">{tr.planFreePrice}</span><span className="text-white/50">{tr.planFreeUnit}</span></div>
            <p className="text-emerald-300 text-sm mt-1 font-semibold">{tr.planFreeTag}</p>
            <ul className="text-white/70 text-sm mt-5 space-y-2">
              {tr.planFreeFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>

          {/* Family */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col">
            <div className="text-3xl">👨‍👩‍👧</div>
            <h3 className="font-serif text-xl font-bold mt-3">{tr.planFamilyName}</h3>
            <PaidPriceBlock monthly={familyMonthly} />
            <ul className="text-white/70 text-sm mt-5 space-y-2">
              {tr.planFamilyFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="mt-5"><InstallButton label={tr.heroCta} /></div>
          </div>

          {/* Premium — evidentiat */}
          <div className="relative rounded-2xl border-2 border-cyan-400 bg-gradient-to-b from-cyan-400/10 to-blue-600/10 p-6 flex flex-col shadow-2xl shadow-cyan-500/20 md:-mt-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-1 text-xs font-bold text-[#04263b] whitespace-nowrap">
              {tr.planBestBadge}
            </div>
            <div className="text-3xl">👑</div>
            <h3 className="font-serif text-xl font-bold mt-3">{tr.planPremiumName}</h3>
            <PaidPriceBlock monthly={premiumMonthly} />
            <ul className="text-white/85 text-sm mt-5 space-y-2">
              {tr.planPremiumFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="mt-5"><InstallButton label={tr.heroCta} /></div>
          </div>
        </div>

        {/* Reframing pret */}
        <p className="text-center text-white/60 text-sm mt-8">
          💡 <b className="text-white">{tr.priceReframe}</b>
        </p>
        {/* Asterisk: cum se activeaza fiecare plan */}
        <p className="text-center text-white/45 text-xs mt-4 max-w-2xl mx-auto leading-relaxed">{tr.planNota}</p>
      </section>

      {/* ===== 7. SOCIAL PROOF / ÎNCREDERE ===== */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        {/* De ce Nido GÂNDEȘTE, nu doar urmărește */}
        <div className="mb-12 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-blue-600/[0.10] to-cyan-500/[0.06] p-8 md:p-10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">{tr.whyThinksTitle}</h2>
          <p className="mt-4 text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
            {tr.whyThinksSub}
          </p>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed">{tr.whyThinksPunch}</p>
        </div>

        {/* Comparatie onesta */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center">{tr.compareTitle}</h2>
        <p className="text-white/55 text-center mt-2 mb-8">{tr.compareSub}</p>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] text-left">
                <th className="px-4 py-3 font-semibold text-white/60"></th>
                <th className="px-4 py-3 font-bold text-center text-cyan-200">{tr.compareColNido}</th>
                <th className="px-4 py-3 font-semibold text-center text-white/50">{tr.compareColOthers}</th>
              </tr>
            </thead>
            <tbody>
              {tr.compareRows.map((row, i) => (
                <tr key={row.f} className={i % 2 ? 'bg-white/[0.02]' : ''}>
                  <td className="px-4 py-3 text-white/75">{row.f}</td>
                  <td className="px-4 py-3 text-center font-semibold text-emerald-300">✓ {row.n}</td>
                  <td className="px-4 py-3 text-center text-white/45">{row.o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Incredere GDPR / EU */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/[0.06] to-blue-600/[0.06] p-8 md:p-10">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-center">{tr.trustTitle}</h3>
          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            {tr.trust.map((c) => (
              <div key={c.t} className="text-center">
                <div className="text-3xl">{c.e}</div>
                <h4 className="font-bold mt-2">{c.t}</h4>
                <p className="text-white/55 text-sm mt-1 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. CUM PLĂTEȘTI + INSTALARE ===== */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="font-bold text-lg">{tr.payTitle} <span className="text-white/50 font-normal text-sm">{tr.payTitleNote}</span></h3>
          <p className="text-white/55 text-sm mt-2">{tr.payIntro}</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-black/30 border border-white/10 p-4">
              <div className="text-white/40 text-xs uppercase tracking-wide">{tr.payBeneficiaryLabel}</div>
              <div className="font-semibold mt-1">{tr.payBeneficiary}</div>
            </div>
            <div className="rounded-xl bg-black/30 border border-white/10 p-4">
              <div className="text-white/40 text-xs uppercase tracking-wide">{tr.payIbanLabel}</div>
              <div className="font-semibold mt-1 select-all">{IBAN}</div>
            </div>
          </div>
          <p className="text-white/55 text-sm mt-4">
            {tr.payNote1} <b className="text-white">{tr.payNoteBold}</b> {tr.payNote2}
          </p>
          <p className="text-cyan-300/70 text-xs mt-2">{tr.payCardSoon}</p>
        </div>

        {/* Pasi de instalare (concis, sub plata) */}
        <h2 className="font-serif text-2xl font-bold text-center mt-12 mb-8">{tr.installTitle}</h2>
        <div className="space-y-4">
          {tr.steps.map((s, i) => (
            <div key={s.t} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[#04263b] font-bold grid place-items-center">
                {i + 1}
              </div>
              <div>
                <b className="text-lg">{s.t}</b>
                <p className="text-white/55 text-sm mt-1 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 9. PROMO REFERRAL ===== */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/[0.12] via-cyan-500/[0.06] to-blue-600/[0.08] p-8 md:p-10 text-center">
          <div className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full bg-amber-400/20 blur-[80px]" />
          <div className="text-5xl">🎁</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-4">{tr.referralTitle}</h2>
          <p className="text-white/80 text-base md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">{tr.referralText}</p>
          <p className="inline-flex items-center gap-2 mt-6 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-cyan-200">
            📲 {tr.referralFindCode}
          </p>
        </div>
      </section>

      {/* ===== 10. CTA FINAL ===== */}
      <section className="max-w-3xl mx-auto px-6 pt-4 pb-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">{tr.finalCtaTitle}</h2>
        <p className="text-white/70 mt-3 max-w-xl mx-auto leading-relaxed">{tr.finalCtaSub}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <InstallButton label={tr.installBtnNow} />
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            ☕ {tr.pricePerDayHero}
          </span>
          <p className="text-sm text-white/55">{tr.installNote}</p>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-bold">
            <span className="text-xl">🐣</span>
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Nido</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="tel:+40787813485" className="text-cyan-300 hover:text-cyan-200">📞 0787 813 485</a>
            <a href="mailto:contact@aicraiova.ro" className="text-cyan-300 hover:text-cyan-200">✉️ contact@aicraiova.ro</a>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-white/50">
            <a href="https://nido-server-production.up.railway.app/confidentialitate.html" target="_blank" rel="noopener" className="hover:text-white/80">Confidențialitate</a>
            <a href="https://nido-server-production.up.railway.app/termeni.html" target="_blank" rel="noopener" className="hover:text-white/80">Termeni</a>
          </div>
          <p className="text-white/70 text-base mt-6">{tr.footerDevBy} <span className="font-semibold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">AIcraiova</span></p>
          <p className="text-white/35 text-[11px] mt-2 leading-relaxed">
            NEWTIME CONCEPT SOLUTIONS SRL · CUI 38803627 · J2018000242160 · Craiova, Str. Albișoarei nr. 7
          </p>
        </div>
      </footer>

      {/* Ava — chatbot vânzări Nido */}
      <NidoChatbot />
    </main>
  )
}
