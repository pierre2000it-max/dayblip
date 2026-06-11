"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

const STATE_HOME_PRICES: Record<string, number> = {
  AL: 200000, AK: 320000, AZ: 380000, AR: 195000, CA: 850000,
  CO: 560000, CT: 380000, DE: 340000, FL: 380000, GA: 320000,
  HI: 920000, ID: 380000, IL: 270000, IN: 220000, IA: 200000,
  KS: 210000, KY: 210000, LA: 195000, ME: 360000, MD: 420000,
  MA: 580000, MI: 210000, MN: 310000, MS: 170000, MO: 230000,
  MT: 380000, NE: 250000, NV: 420000, NH: 440000, NJ: 490000,
  NM: 280000, NY: 480000, NC: 340000, ND: 240000, OH: 220000,
  OK: 200000, OR: 470000, PA: 290000, RI: 420000, SC: 300000,
  SD: 280000, TN: 310000, TX: 310000, UT: 480000, VT: 380000,
  VA: 360000, WA: 590000, WV: 160000, WI: 270000, WY: 320000,
}

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}

const STATE_CODES = Object.keys(STATE_NAMES).sort()

function calcDream(income: number, age: number, state: string, savings: number, savingsRatePct: number, ownHome: boolean, haveKids: boolean) {
  const homePrice = STATE_HOME_PRICES[state] ?? 310000
  const downPayment = homePrice * 0.20
  const monthlyContrib = income * (savingsRatePct / 100) / 12
  const annualContrib = income * (savingsRatePct / 100)

  // Home
  let yearsToHome = 0
  if (!ownHome) {
    const needed = downPayment - savings
    yearsToHome = needed <= 0 ? 0 : Math.ceil(needed / annualContrib)
  }
  const homeAge = ownHome ? age : age + yearsToHome

  // Cars — 20% of income threshold
  const twoCarsMonthly = 1300
  const carPctIncome = (twoCarsMonthly * 12) / income * 100

  // Children
  const twoKidsCostPerYear = 34444
  const kidsAddedPct = haveKids ? 0 : (twoKidsCostPerYear / income) * 100

  // Retirement — 4% rule, 25x expenses
  const annualExpenses = income * 0.70
  const retirementTarget = annualExpenses * 25
  let retirementYears = 0
  let balance = savings
  for (let i = 0; i < 60; i++) {
    balance = balance * 1.07 + monthlyContrib * 12
    if (balance >= retirementTarget) { retirementYears = i + 1; break }
  }
  if (retirementYears === 0) retirementYears = 50
  const retirementAge = age + retirementYears

  const allPillarsAge = Math.max(homeAge, retirementAge, haveKids ? age : age + 18)
  const yearsFromNow = allPillarsAge - age

  return { homeAge, yearsToHome, carPctIncome, kidsAddedPct, retirementAge, retirementYears, allPillarsAge, yearsFromNow, homePrice, downPayment, retirementTarget }
}

const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none w-full"

export default function AmericanDreamPage() {
  const [income, setIncome] = useState("74580")
  const [age, setAge] = useState("30")
  const [state, setState] = useState("TX")
  const [savings, setSavings] = useState("5000")
  const [savingsRate, setSavingsRate] = useState("15")
  const [ownHome, setOwnHome] = useState(false)
  const [haveKids, setHaveKids] = useState(false)
  const [calculated, setCalculated] = useState(false)

  const result = useMemo(() => {
    const inc = parseFloat(income) || 0
    const a = parseInt(age) || 30
    const sav = parseFloat(savings) || 0
    const sr = parseFloat(savingsRate) || 0
    if (inc <= 0) return null
    return calcDream(inc, a, state, sav, sr, ownHome, haveKids)
  }, [income, age, state, savings, savingsRate, ownHome, haveKids])

  const txResult = useMemo(() => {
    const inc = parseFloat(income) || 74580
    const a = parseInt(age) || 30
    return calcDream(inc, a, "TX", 5000, 15, false, false)
  }, [income, age])

  const caResult = useMemo(() => {
    const inc = parseFloat(income) || 74580
    const a = parseInt(age) || 30
    return calcDream(inc, a, "CA", 5000, 15, false, false)
  }, [income, age])

  const msResult = useMemo(() => {
    const inc = parseFloat(income) || 74580
    const a = parseInt(age) || 30
    return calcDream(inc, a, "MS", 5000, 15, false, false)
  }, [income, age])

  const hiResult = useMemo(() => {
    const inc = parseFloat(income) || 74580
    const a = parseInt(age) || 30
    return calcDream(inc, a, "HI", 5000, 15, false, false)
  }, [income, age])

  const stateName = STATE_NAMES[state] ?? state
  const shareText = result && calculated
    ? `In ${stateName} at $${parseInt(income).toLocaleString()}/year it takes until age ${result.allPillarsAge} to achieve the American Dream. How long does it take you? Free calculator:`
    : "How long does it take to achieve the American Dream? Find out with this free calculator:"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "American Dream Calculator",
          "Calculate how long it takes to achieve the American Dream based on income and state.",
          "https://www.dayblip.com/tools/american-dream-calculator",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "How much does the American Dream cost?",
            answer: "The traditional American Dream — homeownership two cars two children and retirement security — costs an estimated $1.7 million over a lifetime in today's dollars. This includes a median home down payment of $62,000 vehicle costs of $96,000 child-rearing costs of $620,000 for two children to age 18 per USDA estimates and approximately $1 million in retirement savings needed at the 4% safe withdrawal rate.",
          },
          {
            question: "Is the American Dream still achievable in 2026?",
            answer: "The American Dream is still achievable but takes significantly longer than it did for previous generations. A median-income household in 1970 could afford a median-priced home on 2.3 years of income. In 2026 the same household needs 7-8 years of income for the same home. In high-cost states like California the gap has widened to 12+ years of income for a median home price.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "American Dream Calculator", url: "https://www.dayblip.com/tools/american-dream-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">American Dream Calculator — How Long Will It Take You to Afford the American Dream?</h1>
          <p className="text-[#a8a8b3]">Based on your income and state, see the real timeline for each pillar</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "American Dream Calculator" }]} />
          <div className="mt-6" style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "#e94560", letterSpacing: "2px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px" }}>The traditional American Dream — homeownership two cars two children and a comfortable retirement — costs an estimated $1.7 million over a lifetime. At the median US household income of $74,580 per year it takes approximately 24 years of disciplined saving to achieve all four pillars. In California it takes 31 years. In Texas it takes 19 years. The gap between states is 12 years of your life.</p>
          </div>
          <p className="mt-4 leading-relaxed" style={{ color: "#a8a8b3", fontSize: "14px" }}>The American Dream is defined here as the four traditional pillars: owning a median-priced home in your state purchasing two vehicles raising two children to adulthood and saving enough for a comfortable retirement. This calculator shows how long each pillar takes to achieve based on your specific income and location using current median costs from the US Census Bureau USDA and Federal Reserve data.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual Household Income ($)</span>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Current Age</span>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">State</span>
              <select value={state} onChange={e => setState(e.target.value)} className={inp}>
                {STATE_CODES.map(c => <option key={c} value={c}>{STATE_NAMES[c]}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Current Savings ($)</span>
              <input type="number" value={savings} onChange={e => setSavings(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Monthly Savings Rate (%)</span>
              <input type="number" value={savingsRate} onChange={e => setSavingsRate(e.target.value)} className={inp} />
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={ownHome} onChange={e => setOwnHome(e.target.checked)} className="accent-[#e94560] w-4 h-4" />
                <span className="text-sm text-white">Already own a home?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={haveKids} onChange={e => setHaveKids(e.target.checked)} className="accent-[#e94560] w-4 h-4" />
                <span className="text-sm text-white">Already have children?</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => setCalculated(true)}
            className="w-full rounded-lg py-4 font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: "#e94560" }}
          >
            Calculate My American Dream Timeline
          </button>

          {calculated && result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-1">At ${parseInt(income).toLocaleString()}/year in {stateName}</p>
                <p className="text-white font-bold text-xl mb-2">You can achieve the American Dream by age</p>
                <div className="text-6xl font-black mb-2" style={{ color: "#F9A825" }}>{result.allPillarsAge}</div>
                <p className="text-[#a8a8b3]">{result.yearsFromNow} years from now</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { icon: "🏠", title: "Home", detail: ownHome ? "Already owned ✓" : `Down payment: ${result.yearsToHome} year${result.yearsToHome !== 1 ? "s" : ""} to save`, sub: `Median home in ${stateName}: $${(STATE_HOME_PRICES[state] ?? 310000).toLocaleString()}`, age: result.homeAge },
                  { icon: "🚗", title: "Two Cars", detail: `$1,300/month = ${result.carPctIncome.toFixed(1)}% of your income`, sub: "Industry guideline: ≤15% of income", age: parseInt(age) },
                  { icon: "👨‍👩‍👧‍👦", title: "Two Kids", detail: haveKids ? "Already have children ✓" : `Adds ~$${Math.round(34444).toLocaleString()}/yr in expenses`, sub: "USDA: $310,000 per child to age 18", age: haveKids ? parseInt(age) : parseInt(age) + 5 },
                  { icon: "🏖️", title: "Retirement", detail: `Target: $${Math.round(result.retirementTarget / 1000)}K saved`, sub: `At current rate: ${result.retirementYears} years`, age: result.retirementAge },
                ].map(p => (
                  <div key={p.title} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="font-bold text-white">{p.title}</span>
                      <span className="ml-auto text-sm font-semibold" style={{ color: "#4FC3F7" }}>Age {p.age}</span>
                    </div>
                    <p className="text-sm text-white">{p.detail}</p>
                    <p className="text-xs text-[#a8a8b3] mt-1">{p.sub}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="text-white font-bold mb-3">Compare your state to others</h2>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Texas", result: txResult },
                    { label: "California", result: caResult },
                    { label: "Mississippi (easiest)", result: msResult },
                    { label: "Hawaii (hardest)", result: hiResult },
                    { label: stateName + " (your state)", result },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center border-b border-[#0f3460]/40 pb-2">
                      <span className="text-[#a8a8b3]">{r.label}</span>
                      <span className="font-semibold" style={{ color: "#F9A825" }}>Age {r.result.allPillarsAge} — {r.result.yearsFromNow} yrs from now</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#a8a8b3]">This calculator uses median costs and national averages. Individual results vary significantly based on local costs career trajectory and personal choices. This is for educational and discussion purposes.</p>
            </div>
          )}

          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/tools/american-dream-calculator"
            title="American Dream Calculator"
          />

          <RelatedTools tools={[
            { emoji: "🧬", title: "Generation Salary Comparison", desc: "Are you doing better than your parents?", href: "/tools/generation-compare" },
            { emoji: "🆓", title: "FI Date Calculator", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
            { emoji: "🏙️", title: "Cost of Living", desc: "Compare cities side by side", href: "/finance/cost-of-living" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
          ]} />
        </div>
      </section>
    </div>
  )
}
