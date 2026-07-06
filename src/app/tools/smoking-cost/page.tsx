"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import FinanceCTA from "@/components/FinanceCTA"
import GeoAnswerBlock from "@/components/GeoAnswerBlock"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import { generateShareImage } from "@/utils/generateShareImage"

function fvAnnuity(monthly: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12
  if (r === 0) return monthly * months
  return monthly * ((Math.pow(1 + r, months) - 1) / r)
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmt2(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimates only.</strong> Health information is general in nature. Consult a healthcare provider for personalized guidance. Not financial advice.
  </div>
)

interface Result {
  perDay: number; packPrice: number; started: number; currentAge: number; rate: number
  packsPerDay: number; dailyCost: number; monthlyCost: number; annualCost: number
  yearsSmoking: number; totalSpent: number; investmentValue: number
  totalCigarettes: number; totalDays: number
  futureAnnual: number; futureYears: number
  futureInv5: number; futureInv10: number; futureInv20: number
}

function compute(perDay: number, packPrice: number, started: number, currentAge: number, rate: number): Result {
  const yearsSmoking  = Math.max(0, currentAge - started)
  const packsPerDay   = perDay / 20
  const dailyCost     = packsPerDay * packPrice
  const monthlyCost   = dailyCost * 30.5
  const annualCost    = dailyCost * 365
  const totalSpent    = Math.round(annualCost * yearsSmoking)
  const investmentValue = Math.round(fvAnnuity(monthlyCost, rate, yearsSmoking * 12))
  const totalCigarettes = Math.round(perDay * 365 * yearsSmoking)
  const totalMinutes  = totalCigarettes * 7
  const totalDays     = +(totalMinutes / 60 / 24).toFixed(1)
  const futureAnnual  = annualCost
  const futureYears   = Math.max(0, 65 - currentAge)
  const futureInv5    = Math.round(fvAnnuity(monthlyCost, rate, 60))
  const futureInv10   = Math.round(fvAnnuity(monthlyCost, rate, 120))
  const futureInv20   = Math.round(fvAnnuity(monthlyCost, rate, 240))
  return { perDay, packPrice, started, currentAge, rate, packsPerDay, dailyCost, monthlyCost, annualCost, yearsSmoking, totalSpent, investmentValue, totalCigarettes, totalDays, futureAnnual, futureYears, futureInv5, futureInv10, futureInv20 }
}

export default function SmokingCostPage() {
  const [perDay,      setPerDay]      = useState("10")
  const [packPrice,   setPackPrice]   = useState("9.50")
  const [started,     setStarted]     = useState("20")
  const [currentAge,  setCurrentAge]  = useState("40")
  const [rate,        setRate]        = useState("7")
  const [result,      setResult]      = useState<Result | null>(null)

  function runCalc(push = true, pd = perDay, pp = packPrice, st = started, ca = currentAge, r = rate) {
    const res = compute(parseFloat(pd)||0, parseFloat(pp)||0, parseFloat(st)||0, parseFloat(ca)||0, parseFloat(r)||7)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?perday=${pd}&price=${pp}&started=${st}&age=${ca}&rate=${r}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const pd = p.get("perday"), pp = p.get("price"), st = p.get("started"), ca = p.get("age"), r = p.get("rate")
    if (pd && ca) {
      if (pd) setPerDay(pd); if (pp) setPackPrice(pp); if (st) setStarted(st)
      if (ca) setCurrentAge(ca); if (r) setRate(r)
      runCalc(false, pd, pp ?? packPrice, st ?? started, ca, r ?? rate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function downloadShareImage() {
    if (!result) return
    const trueCost = result.totalSpent + result.investmentValue
    void generateShareImage({
      title: "My True Cost of Smoking",
      primaryStat: fmt(trueCost),
      primaryLabel: "total true lifetime cost",
      stats: [
        { label: "Spent on cigarettes", value: fmt(result.totalSpent) },
        { label: "Lost investment returns", value: fmt(result.investmentValue) },
        { label: "Habit", value: `${result.packsPerDay.toFixed(1)} packs/day for ${result.yearsSmoking} years` },
      ],
      tagline: "What could you do with this money?",
      toolUrl: "dayblip.com/tools/smoking-cost",
      filename: "dayblip-smoking-cost.png",
    })
  }

  const shareUrl  = result ? `https://www.dayblip.com/tools/smoking-cost?perday=${perDay}&price=${packPrice}&started=${started}&age=${currentAge}&rate=${rate}` : ""
  const shareText = result
    ? `I have spent ${fmt(result.totalSpent)} on cigarettes since age ${result.started}.\nIf invested instead: ${fmt(result.investmentValue)}!\nPlus ${result.totalDays} full days of my life spent smoking.\n(Educational only)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("True Cost of Smoking Calculator", "Calculate the full financial cost of smoking including what your cigarette money could have been worth if invested instead.", "https://www.dayblip.com/tools/smoking-cost", "HealthApplication"),
        faqSchema([
          { question: "How much does smoking cost per year?", answer: "At $9.50 per pack and 10 cigarettes per day, smoking costs approximately $1,731 per year. Heavy smokers spending on a pack daily spend $3,468 or more annually." },
          { question: "How much money would I save if I quit smoking?", answer: "A pack-a-day smoker quitting saves approximately $3,468 per year. Invested at 7% annual return, that becomes $47,000 after 10 years and $148,000 after 20 years." },
          { question: "What is the lifetime cost of smoking?", answer: "A pack-a-day smoker from age 20 to 65 spends approximately $156,060 on cigarettes alone. If invested instead at 7% return that money would grow to over $1 million." },
        ]),
        howToSchema("How to Calculate True Cost of Smoking", "See the full lifetime cost of smoking", [
          "Enter cigarettes smoked per day",
          "Enter price per pack",
          "Enter the age you started smoking",
          "Enter your current age",
          "Click Calculate My True Cost for full breakdown",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Smoking Cost Calculator", url: "https://www.dayblip.com/tools/smoking-cost" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">True Cost of Smoking Calculator — The Lifetime Financial Impact</h1>
          <p className="text-[#a8a8b3]">Calculate the full financial and health cost of your smoking habit</p>
          <a href="/blog/true-cost-of-smoking" style={{ fontSize: "13px", color: "#e94560", marginTop: "8px", display: "inline-block" }}>Read: The Number Most Smokers Have Never Calculated →</a>
        </div>
      </section>

      <section className="px-6 pt-8 pb-0 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <GeoAnswerBlock answer="To calculate the true cost of smoking: multiply daily packs by pack price by 365 for annual cost, then calculate the investment opportunity cost using compound interest. One pack per day for 30 years costs $87,600 in cigarettes plus $324,000 in lost investment returns — a total true cost of over $400,000. Use the interactive tool below." />
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A pack-a-day smoker at $9.50 per pack spends $3,468 per year on cigarettes. Over 20 years that is $69,360 spent. If invested instead at 7% annual return that money would grow to $193,000. A smoker from age 20 to 65 spends approximately $156,000 on cigarettes alone — over $600,000 in lost investment opportunity.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The true cost of smoking includes the direct spending on cigarettes plus the compounding opportunity cost of that money not being invested. This calculator shows both the total amount spent and what that money would be worth today if invested instead. It also calculates the time cost of smoking — hours spent per year just on the act of smoking.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "True Cost of Smoking" }
          ]} />
          <AuthorByline variant="tool" />
          {DISCLAIMER}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { label: "Cigarettes per day", val: perDay, set: setPerDay, prefix: undefined },
              { label: "Price per pack ($)", val: packPrice, set: setPackPrice, prefix: "$" },
              { label: "Age started smoking", val: started, set: setStarted, prefix: undefined },
              { label: "Current age", val: currentAge, set: setCurrentAge, prefix: undefined },
              { label: "Investment return (%)", val: rate, set: setRate, prefix: undefined },
            ].map(({ label, val, set, prefix }) => (
              <label key={label} className="block">
                <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
                <div className="flex items-center gap-2">
                  {prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
                  <input type="number" step="0.01" value={val} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </div>
              </label>
            ))}
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My True Cost
          </button>

          {result && (
            <div className="space-y-6">
              {/* Financial cost */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">Total spent on cigarettes in {result.yearsSmoking} years of smoking</div>
                <div className="my-1 text-5xl font-black text-[#e94560]">{fmt(result.totalSpent)}</div>
                <div className="text-sm text-[#a8a8b3]">{fmt2(result.dailyCost)}/day · {fmt(result.monthlyCost)}/month · {fmt(result.annualCost)}/year</div>
              </div>

              {/* Investment comparison */}
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-6 text-white">
                <div className="font-bold text-[#4ade80] mb-2">📈 If invested at {result.rate}% instead since age {result.started}</div>
                <div className="text-3xl font-black text-[#4ade80]">{fmt(result.investmentValue)}</div>
                <p className="mt-2 text-sm text-[#a8a8b3]">You have the cigarettes. You could have had <span className="font-bold text-white">{fmt(result.investmentValue)}</span>.</p>
              </div>

              {/* Time cost */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-white mb-2">⏱️ Time cost of smoking</div>
                <p>Total cigarettes smoked: <span className="font-bold text-[#F9A825]">{result.totalCigarettes.toLocaleString()}</span></p>
                <p className="mt-1">Time spent smoking: <span className="font-bold text-[#F9A825]">{result.totalDays} full days</span> of your life just smoking</p>
              </div>

              {/* Quit calculation */}
              {result.futureYears > 0 && (
                <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                  <div className="font-bold text-[#4ade80] mb-2">💚 If you quit today and invested the savings at {result.rate}%</div>
                  {[["5 years", result.futureInv5], ["10 years", result.futureInv10], ["20 years", result.futureInv20]].map(([yr, v]) => (
                    <p key={String(yr)} className="mt-1 text-[#a8a8b3]">
                      In <span className="font-bold text-white">{yr}</span>: <span className="font-bold text-[#4ade80]">{fmt(+v)}</span>
                    </p>
                  ))}
                  <p className="mt-2 text-xs text-[#a8a8b3]">Based on investing {fmt(result.monthlyCost)}/month</p>
                </div>
              )}

              {/* Health context */}
              <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-[#4FC3F7] mb-1">🔬 General health research context</div>
                <p className="text-[#a8a8b3]">According to CDC data, smoking is associated with significant health risks. The financial cost above does not include potential healthcare costs associated with smoking-related conditions.</p>
                <div className="mt-3 p-3 rounded-lg bg-[#16213e]">
                  <div className="font-bold text-white">For help quitting (free US resources):</div>
                  <p className="mt-1 text-[#4ade80] font-bold">1-800-QUIT-NOW</p>
                  <p className="text-[#a8a8b3]">smokefree.gov — free quit plans and support</p>
                </div>
              </div>

              <FinanceCTA
                emoji="🏦"
                headline="What if you invested instead?"
                description="See how much that money could grow in a retirement account over time."
                linkText="Retirement Savings Calculator"
                href="/finance/retirement-savings"
              />
              <ShareButtons text={shareText} url={shareUrl} title="True Cost of Smoking Calculator" />
              <button
                onClick={downloadShareImage}
                style={{
                  width: "100%", background: "#e8445a", color: "#fff",
                  border: "none", borderRadius: "8px", padding: "12px 24px",
                  fontSize: "16px", fontWeight: "600", cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
              >
                📸 Download Your Result
              </button>
              {DISCLAIMER}
            </div>
          )}
          <FAQAccordion items={[
            {
              question: "How much does smoking cost per year?",
              answer: "At the average US cigarette price of approximately $8.00 per pack, a one-pack-per-day smoker spends about $2,920 per year on cigarettes alone. Heavy smokers spending two packs per day spend nearly $6,000 annually. Over 20 years that is $58,000 to $120,000 in cigarette costs before accounting for health insurance premiums, medical costs, and lost investment opportunity."
            },
            {
              question: "What would cigarette money be worth if invested?",
              answer: "At $8 per pack per day invested at 7% annual return, a smoker who quit at 25 and invested the savings would have approximately $280,000 by age 65. Someone who smoked two packs per day would have forgone nearly $560,000 in potential investment value. The Dayblip calculator shows your exact number based on your smoking habit and timeline."
            },
            {
              question: "How much does smoking cost over a lifetime?",
              answer: "A one-pack-per-day smoker who starts at 18 and smokes until 65 spends approximately $137,000 on cigarettes in their lifetime at today&apos;s average prices. Adding health insurance premium differences, estimated medical costs, and lost investment returns, the true lifetime cost of smoking often exceeds $1 million for a lifetime smoker."
            },
            {
              question: "Does smoking affect health insurance costs?",
              answer: "Yes significantly. Under the Affordable Care Act insurers can charge smokers up to 50% more in premiums than non-smokers. For a typical individual health plan this can mean $1,500 to $3,000 more per year in premiums alone. Over a 20-year period this adds $30,000 to $60,000 to the true financial cost of smoking."
            },
            {
              question: "How long does it take to save money after quitting smoking?",
              answer: "The financial savings from quitting smoking begin immediately. A one-pack-per-day smoker saves approximately $8 per day, $56 per week, and $240 per month from day one. Within one year of quitting a former smoker has saved nearly $3,000 in cigarette costs alone — not counting health insurance savings and reduced medical expenses."
            },
            {
              question: "What is the investment opportunity cost of smoking?",
              answer: "Investment opportunity cost is the return you could have earned if cigarette money had been invested instead. At $8 per day invested at 7% annual return, the opportunity cost over 30 years is approximately $280,000. This is the money a smoker effectively gives up — not just the cigarettes but the compounding returns those dollars could have generated."
            }
          ]} />
          <RelatedTools tools={[
            { emoji: "💹", title: "Compound Interest", desc: "Watch your money grow over time", href: "/finance/compound-interest" },
            { emoji: "💰", title: "Savings Goal Calculator", desc: "How long to reach your goal?", href: "/finance/savings-goal" },
            { emoji: "💳", title: "Debt Payoff Calculator", desc: "Avalanche or snowball your debt", href: "/finance/debt-payoff" },
            { emoji: "📋", title: "Budget Calculator", desc: "Build your 50/30/20 budget", href: "/finance/budget-calculator" },
            { emoji: "🆓", title: "Financial Independence Date", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
          ]} />
        </div>
      </section>
    </div>
  )
}
