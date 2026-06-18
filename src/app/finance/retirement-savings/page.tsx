"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function RetirementSavingsPage() {
  const [currentAge, setCurrentAge] = useState("35")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [monthlySavings, setMonthlySavings] = useState("500")
  const [expectedReturn, setExpectedReturn] = useState("7")
  const [desiredIncome, setDesiredIncome] = useState("5000")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("age")) setCurrentAge(p.get("age")!)
    if (p.get("retireage")) setRetirementAge(p.get("retireage")!)
    if (p.get("savings")) setCurrentSavings(p.get("savings")!)
    if (p.get("monthly")) setMonthlySavings(p.get("monthly")!)
    if (p.get("return")) setExpectedReturn(p.get("return")!)
    if (p.get("income")) setDesiredIncome(p.get("income")!)
  }, [])

  const calc = useMemo(() => {
    const ca = parseFloat(currentAge) || 0
    const ra = parseFloat(retirementAge) || 0
    const cs = parseFloat(currentSavings) || 0
    const ms = parseFloat(monthlySavings) || 0
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12
    const di = parseFloat(desiredIncome) || 0
    const months = Math.max(0, (ra - ca) * 12)
    const projected = r === 0
      ? cs + ms * months
      : cs * Math.pow(1 + r, months) + ms * ((Math.pow(1 + r, months) - 1) / r)
    const needed = di * 12 * 25
    const surplus = projected - needed
    const onTrack = projected >= needed
    const milestones = [30, 40, 50, 60, ra].filter(a => a > ca && a <= ra).map(age => {
      const mn = (age - ca) * 12
      const bal = r === 0 ? cs + ms * mn : cs * Math.pow(1 + r, mn) + ms * ((Math.pow(1 + r, mn) - 1) / r)
      return { age, bal }
    })
    return { projected, needed, surplus, onTrack, milestones }
  }, [currentAge, retirementAge, currentSavings, monthlySavings, expectedReturn, desiredIncome])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Retirement Savings Calculator",
          "Find out if your retirement savings are on track to fund your retirement.",
          "https://www.dayblip.com/finance/retirement-savings",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How does this calculator project my retirement savings?", answer: "It compounds your current savings and monthly contributions monthly at your expected return until your retirement age, giving the projected balance you would have when you stop working." },
          { question: "What is the 25x rule?", answer: "The 25x rule estimates the nest egg you need as 25 times your desired annual retirement income, which corresponds to a 4% annual withdrawal rate. If you want $5,000 a month, that is $60,000 a year, so you would target $1.5 million." },
          { question: "What return should I assume?", answer: "Many planners use a long-run average of around 7% for a diversified portfolio, but returns vary year to year and are not guaranteed. You can adjust the expected return field to test more conservative assumptions." },
          { question: "What does 'on track' mean here?", answer: "You are flagged as on track when your projected savings at retirement meet or exceed the amount needed under the 25x rule. Otherwise the calculator shows the shortfall so you can adjust your contributions." },
        ]),
        howToSchema(
          "Retirement Savings Calculator — How To Use",
          "Check whether your retirement savings are on track.",
          [
            "Enter your current age and planned retirement age.",
            "Enter your current savings and how much you save each month.",
            "Set your expected annual return and your desired monthly retirement income.",
            "Read the on-track or shortfall result, your projected balance versus the amount needed, and the savings milestones by age.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Retirement Savings Calculator", url: "https://www.dayblip.com/finance/retirement-savings" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Retirement Savings Calculator — Are You on Track?</h1>
          <p className="text-[#a8a8b3]">Find out if you are on track to retire comfortably</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The general retirement savings guideline suggests having 1× salary saved by 30, 3× by 40, 6× by 50, 8× by 60 and 10× by 67. To retire comfortably at 65 most Americans need $1–$1.5 million saved. At a 7% average return saving $500 per month from age 25 results in approximately $1.37 million by age 65.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Retirement savings calculators project how much your current savings and contributions will grow by retirement using compound interest. The calculation accounts for your current age, savings balance, monthly contributions and expected investment return to show whether you are on track to meet your retirement income goals.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Retirement Savings Calculator" }]} />
          <LastUpdated />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Current Age", val: currentAge, set: setCurrentAge },
              { label: "Retirement Age", val: retirementAge, set: setRetirementAge },
              { label: "Current Savings ($)", val: currentSavings, set: setCurrentSavings },
              { label: "Monthly Savings ($)", val: monthlySavings, set: setMonthlySavings },
              { label: "Expected Return (%)", val: expectedReturn, set: setExpectedReturn },
              { label: "Desired Monthly Income ($)", val: desiredIncome, set: setDesiredIncome },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} className={inp} />
              </label>
            ))}
          </div>

          <div className={`rounded-xl p-6 text-center ${calc.onTrack ? "border border-green-500/30 bg-green-900/20" : "border border-red-500/30 bg-red-900/20"}`}>
            <div className="text-4xl mb-2">{calc.onTrack ? "✅" : "⚠️"}</div>
            <div className={`text-3xl font-black ${calc.onTrack ? "text-green-400" : "text-red-400"}`}>
              {calc.onTrack ? "ON TRACK" : "SHORTFALL"}
            </div>
            <div className="text-[#a8a8b3] mt-1">
              {calc.onTrack
                ? `Surplus of ${fmt(calc.surplus)}`
                : `Shortfall of ${fmt(Math.abs(calc.surplus))}`}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.projected)}</div>
              <div className="text-sm text-[#a8a8b3]">Projected at Retirement</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-white">{fmt(calc.needed)}</div>
              <div className="text-sm text-[#a8a8b3]">Amount Needed (25x Rule)</div>
            </div>
          </div>

          {calc.milestones.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <p className="mb-3 font-bold text-white">📅 Savings Milestones</p>
              <div className="flex flex-wrap gap-3">
                {calc.milestones.map(m => (
                  <div key={m.age} className="rounded-lg bg-[#16213e] px-4 py-3 text-center min-w-[100px]">
                    <div className="text-lg font-black text-[#e94560]">Age {m.age}</div>
                    <div className="text-sm text-white">{fmt(m.bal)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MethodologyNote text="Uses compound growth formula with annual IRS contribution limits. Historical S&P 500 return data sourced from FRED (Federal Reserve Economic Data)." />
          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const yearsToRetirement = parseFloat(retirementAge) - parseFloat(currentAge)
            const monthly = parseFloat(monthlySavings) || 0
            const returnRate = parseFloat(expectedReturn) || 7
            const shortfall = Math.abs(calc.surplus)
            const isOnTrack = calc.onTrack
            const projectedStr = fmt(calc.projected)
            const neededStr = fmt(calc.needed)

            const r = returnRate / 100 / 12
            const n = yearsToRetirement * 12
            const extraMonthly = !isOnTrack && r > 0 && n > 0
              ? Math.round(shortfall * r / (Math.pow(1 + r, n) - 1))
              : 0

            let timelineTier: 'urgent' | 'moderate' | 'comfortable' | 'long'
            if (yearsToRetirement <= 10) timelineTier = 'urgent'
            else if (yearsToRetirement <= 20) timelineTier = 'moderate'
            else if (yearsToRetirement <= 30) timelineTier = 'comfortable'
            else timelineTier = 'long'

            let surplusTier: 'large-surplus' | 'small-surplus' | 'small-shortfall' | 'large-shortfall'
            if (isOnTrack && calc.surplus > calc.needed * 0.25) surplusTier = 'large-surplus'
            else if (isOnTrack) surplusTier = 'small-surplus'
            else if (!isOnTrack && shortfall < calc.needed * 0.25) surplusTier = 'small-shortfall'
            else surplusTier = 'large-shortfall'

            let primaryMessage: string
            if (surplusTier === 'large-surplus') {
              primaryMessage = `You are projected to have ${projectedStr} at retirement — significantly more than your ${neededStr} target. You have strong financial flexibility. The primary risks at this stage are sequence-of-returns risk (a market downturn near retirement can be devastating), healthcare costs before Medicare eligibility at 65, and inflation eroding purchasing power over a long retirement. Consider whether your ${returnRate}% return assumption is conservative enough for a long retirement horizon.`
            } else if (surplusTier === 'small-surplus') {
              primaryMessage = `You are projected to reach ${projectedStr} — on track to meet your ${neededStr} target with a modest margin. Maintaining your current savings rate consistently is the primary challenge. Lifestyle inflation, job changes, and unexpected expenses are the most common reasons on-track savers fall behind. Review this projection annually and after any significant income or expense change.`
            } else if (surplusTier === 'small-shortfall') {
              primaryMessage = `You are projected to fall short of your ${neededStr} target by ${fmt(shortfall)}. This gap is closeable. Adding $${extraMonthly.toLocaleString()}/month to your contributions today would close it entirely — at your current salary that is often achievable through a single raise or one eliminated expense. Small consistent increases in savings rate compound dramatically over ${yearsToRetirement} years.`
            } else {
              primaryMessage = `You are projected to fall short of your ${neededStr} target by ${fmt(shortfall)}. This is a significant gap but ${yearsToRetirement} years is meaningful time to close it. Closing this gap requires adding approximately $${extraMonthly.toLocaleString()}/month in contributions, increasing your expected return through asset allocation, or reducing your desired retirement income target. Most people close large gaps through a combination of all three.`
            }

            let timelineMessage: string
            if (timelineTier === 'urgent') {
              timelineMessage = `With ${yearsToRetirement} years to retirement your most powerful levers are: maximize catch-up contributions (401k $31,000 if age 50+, IRA $8,000 if age 50+), eliminate discretionary expenses to boost monthly savings, and review whether your retirement date can flex 2-3 years — each extra year of work adds both contributions and delays withdrawals.`
            } else if (timelineTier === 'moderate') {
              timelineMessage = `With ${yearsToRetirement} years to retirement compounding still works strongly in your favor. Increasing monthly contributions by $200-500 now produces dramatically larger results than waiting 5 years. The highest-leverage action: automate a 1% savings increase every 6 months — you will not feel the reduction in take-home pay but the long-term impact is significant.`
            } else if (timelineTier === 'comfortable') {
              timelineMessage = `With ${yearsToRetirement} years to retirement you have significant time for compounding to work. The primary risk is complacency — most people who fall short in retirement were on track at your stage but stopped increasing contributions as income grew. Set a rule: every raise increases your savings rate by at least half the raise percentage.`
            } else {
              timelineMessage = `With ${yearsToRetirement} years to retirement time is your most powerful asset. Even small amounts invested consistently now produce enormous results. $500/month at ${returnRate}% for ${yearsToRetirement} years grows to approximately ${fmt(Math.round(500 * (Math.pow(1 + returnRate/100/12, n) - 1) / (returnRate/100/12)))}. The biggest risk at your stage is not starting — or stopping — early.`
            }

            let savingsMessage: string
            if (monthly === 0) {
              savingsMessage = `You are contributing $0/month. Starting any contribution — even $50/month — begins the compounding clock. Open a 401k through your employer (especially if they match) or a Roth IRA and automate the smallest amount you can sustain. Increase it every 6 months.`
            } else if (monthly < 500) {
              savingsMessage = `You are contributing $${monthly.toLocaleString()}/month. This is a start but likely below what is needed for a comfortable retirement. Target increasing to $${Math.min(monthly + 300, 1000).toLocaleString()}/month — find one expense to cut or redirect your next raise entirely to retirement savings.`
            } else if (monthly < 1500) {
              savingsMessage = `You are contributing $${monthly.toLocaleString()}/month — a solid foundation. Verify you are maximizing employer match first (free money), then consider increasing to the 401k limit ($23,500 in 2026) over the next few years through incremental raises.`
            } else {
              savingsMessage = `You are contributing $${monthly.toLocaleString()}/month ($${(monthly * 12).toLocaleString()}/year) — a strong savings rate. Ensure contributions are going into tax-advantaged accounts first (401k, IRA, HSA) before taxable accounts. At this level asset allocation and sequence-of-returns risk management become increasingly important.`
            }

            let nextActions: string[]
            if (surplusTier === 'large-surplus') {
              nextActions = [
                `Model sequence-of-returns risk — a 30% market drop in year 1 of retirement has a dramatically different impact than the same drop in year 10. Build a 2-3 year cash/bond buffer as retirement approaches`,
                `Review your ${returnRate}% return assumption — long retirements of 25-30+ years may want to use 5-6% to be conservative`,
                `Plan healthcare costs before Medicare at 65 — average couple spends $300,000+ on healthcare in retirement`,
                `Consider whether your retirement date could move earlier — your surplus may support it`
              ]
            } else if (surplusTier === 'small-surplus') {
              nextActions = [
                `Protect your savings rate through income changes — when you get a raise, immediately redirect half to retirement before lifestyle adjusts`,
                `Max your 401k ($23,500 in 2026) if not already there — tax-deferred growth at your timeline is significant`,
                `Review this projection annually — rerun with actual returns, updated savings, and any major life changes`,
                `Build a 6-12 month emergency fund to avoid raiding retirement savings during unexpected expenses`
              ]
            } else if (surplusTier === 'small-shortfall') {
              nextActions = [
                `Add $${extraMonthly.toLocaleString()}/month to close your projected gap — this is achievable through a salary increase, expense reduction, or 401k increase`,
                `Max employer 401k match immediately if you are not already — unmatched contributions are the most expensive retirement mistake`,
                `Consider whether your ${returnRate}% return assumption is realistic — a diversified stock/bond portfolio has historically returned 6-8% long-term`,
                `Rerun this calculator after your next raise and redirect at least 50% of the increase to retirement savings`
              ]
            } else {
              nextActions = [
                `Close the gap in steps: target adding $${Math.round(extraMonthly * 0.4).toLocaleString()}/month now (40% of needed increase) and the rest over 3 years`,
                `Review your desired retirement income ($${parseFloat(desiredIncome).toLocaleString()}/month) — reducing by 10-15% significantly changes the required target`,
                `Max all tax-advantaged accounts: 401k $23,500, IRA $7,000, HSA $4,300 single ($8,550 family) in 2026`,
                `Consider working 2-3 years longer — each additional year adds contributions AND delays withdrawals, dramatically improving outcomes`
              ]
            }

            const borderColor = surplusTier === 'large-surplus' ? '#a78bfa'
              : surplusTier === 'small-surplus' ? '#4ade80'
              : surplusTier === 'small-shortfall' ? '#facc15'
              : '#e94560'

            const labelColor = borderColor

            return (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '16px',
                padding: '28px 28px 24px',
                margin: '32px 0 24px',
                borderLeft: `4px solid ${borderColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '22px' }}>🧭</span>
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                    Now What? Your Retirement Action Plan
                  </h3>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    {isOnTrack
                      ? `On Track — ${projectedStr} Projected`
                      : `Shortfall — ${fmt(shortfall)} Gap to Close`
                    }
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {primaryMessage}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Timeline — {yearsToRetirement} Years to Retirement
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {timelineMessage}
                  </p>
                </div>

                <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                  <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                    💰 {savingsMessage}
                  </p>
                </div>

                {!isOnTrack && extraMonthly > 0 && (
                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      ⚡ To close your {fmt(shortfall)} gap completely:
                      add ${extraMonthly.toLocaleString()}/month to your contributions today.
                      That is ${(extraMonthly * 12).toLocaleString()}/year redirected to your future self.
                    </p>
                  </div>
                )}

                <div>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    Your Next 4 Actions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {nextActions.map((action, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: borderColor, fontSize: '14px', fontWeight: '800', minWidth: '20px', marginTop: '1px' }}>
                          {i + 1}.
                        </span>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          <ShareButtons
            text={`${calc.onTrack ? "✅ On track" : "⚠️ Shortfall"} for retirement! Projected savings: ${fmt(calc.projected)} vs ${fmt(calc.needed)} needed. (Educational only)`}
            url={`https://www.dayblip.com/finance/retirement-savings?age=${currentAge}&retireage=${retirementAge}&savings=${currentSavings}&monthly=${monthlySavings}&return=${expectedReturn}&income=${desiredIncome}`}
            title="Retirement Savings Calculator"
          />
          <RelatedTools tools={[
            { emoji: "🏖️", title: "FI Date Calculator", desc: "Find your financial independence date", href: "/tools/fi-date" },
            { emoji: "💵", title: "401k Calculator", desc: "Maximize your retirement contributions", href: "/finance/401k-calculator" },
            { emoji: "📊", title: "Compound Interest Calculator", desc: "Watch your money grow over time", href: "/finance/compound-interest" },
            { emoji: "👴", title: "Social Security Calculator", desc: "When should you claim benefits?", href: "/finance/social-security" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Uses 25x rule (4% withdrawal rate). Actual retirement needs vary by individual.</p>
          <FAQAccordion items={[
            { q: "How much should I have saved for retirement by age?", a: "A common benchmark is to have 1 times your salary saved by 30, 3 times by 40, 6 times by 50, 8 times by 60, and 10 times by retirement. These are guidelines from Fidelity based on retiring at 67 and maintaining your pre-retirement lifestyle." },
            { q: "What is the 4 percent rule?", a: "The 4 percent rule suggests you can withdraw 4 percent of your retirement portfolio in the first year then adjust for inflation each year with a high probability your money lasts 30 years. On a $1 million portfolio that is $40,000 per year." },
            { q: "How does employer match affect my retirement savings?", a: "Employer match is free money. If your employer matches 50 percent of contributions up to 6 percent of salary and you earn $60,000, contributing 6 percent gets you an additional $1,800 from your employer — an immediate 50 percent return on that portion." },
            { q: "What rate of return should I assume?", a: "The US stock market has historically returned approximately 10 percent annually before inflation or about 7 percent after inflation. Most retirement calculators use 6 to 7 percent as a conservative baseline. Your actual returns will vary based on asset allocation and market conditions." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
