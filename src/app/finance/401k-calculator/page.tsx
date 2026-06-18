"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function FourOhOneKPage() {
  const [currentAge, setCurrentAge] = useState("35")
  const [retirementAge, setRetirementAge] = useState("65")
  const [balance, setBalance] = useState("50000")
  const [salary, setSalary] = useState("75000")
  const [yourPct, setYourPct] = useState("6")
  const [matchPct, setMatchPct] = useState("3")
  const [returnPct, setReturnPct] = useState("7")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("age")) setCurrentAge(p.get("age")!)
    if (p.get("retireage")) setRetirementAge(p.get("retireage")!)
    if (p.get("balance")) setBalance(p.get("balance")!)
    if (p.get("salary")) setSalary(p.get("salary")!)
    if (p.get("contrib")) setYourPct(p.get("contrib")!)
    if (p.get("match")) setMatchPct(p.get("match")!)
    if (p.get("return")) setReturnPct(p.get("return")!)
  }, [])

  const calc = useMemo(() => {
    const ca = parseFloat(currentAge) || 0
    const ra = parseFloat(retirementAge) || 0
    const bal = parseFloat(balance) || 0
    const sal = parseFloat(salary) || 0
    const yp = parseFloat(yourPct) || 0
    const mp = parseFloat(matchPct) || 0
    const ret = (parseFloat(returnPct) || 0) / 100 / 12
    const years = Math.max(0, ra - ca)
    const months = years * 12
    const yourAnnual = sal * yp / 100
    const matchAnnual = sal * Math.min(yp, mp) / 100
    const totalMonthly = (yourAnnual + matchAnnual) / 12
    const projected = ret === 0
      ? bal + totalMonthly * months
      : bal * Math.pow(1 + ret, months) + totalMonthly * ((Math.pow(1 + ret, months) - 1) / ret)
    const monthlyIncome = projected * 0.04 / 12
    const leavingMoney = yp < mp
    const scenarios = [3, 6, 10, 15].map(pct => {
      const m = (sal * (pct + Math.min(pct, mp)) / 100) / 12
      const b = ret === 0 ? bal + m * months : bal * Math.pow(1 + ret, months) + m * ((Math.pow(1 + ret, months) - 1) / ret)
      return { pct, balance: b, monthly: b * 0.04 / 12 }
    })
    return { yourAnnual, matchAnnual, projected, monthlyIncome, leavingMoney, scenarios }
  }, [currentAge, retirementAge, balance, salary, yourPct, matchPct, returnPct])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "401(k) Calculator",
          "Project your 401(k) balance at retirement including employer match and compound growth.",
          "https://www.dayblip.com/finance/401k-calculator",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How does employer 401(k) matching work?", answer: "An employer match adds money to your 401(k) based on what you contribute, up to a set percentage of your salary. If your employer matches 3% and you contribute at least 3%, you receive the full match. Contributing less than the match percentage leaves free money on the table." },
          { question: "How much will my 401(k) be worth at retirement?", answer: "Your projected balance depends on your current balance, annual salary, your contribution percentage, the employer match, the years until retirement, and your expected annual return. This calculator compounds monthly contributions plus growth to estimate your balance at your chosen retirement age." },
          { question: "What is the 4% rule for retirement income?", answer: "The 4% rule estimates that you can withdraw about 4% of your retirement balance per year with low risk of running out of money. This calculator divides that annual figure by twelve to show an approximate monthly retirement income from your projected balance." },
          { question: "What contribution percentage should I choose?", answer: "At minimum, contribute enough to capture your full employer match. This calculator compares 3%, 6%, 10%, and 15% contribution scenarios so you can see how raising your contribution rate changes your retirement balance and monthly income." },
        ]),
        howToSchema(
          "401(k) Calculator — How To Use",
          "Estimate your 401(k) balance at retirement with employer match and compound growth.",
          [
            "Enter your current age and your planned retirement age.",
            "Enter your current 401(k) balance and annual salary.",
            "Enter your contribution percentage and your employer match percentage.",
            "Enter your expected annual return.",
            "Review your projected balance, employer match, and estimated monthly retirement income.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "401(k) Calculator", url: "https://www.dayblip.com/finance/401k-calculator" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">401k Calculator — Maximize Your Retirement Savings</h1>
          <p className="text-[#a8a8b3]">Maximize your retirement savings with employer matching</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The 2025 401k contribution limit is $23,500 per year ($31,000 if age 50+). Contributing enough to get the full employer match is always the first priority — it is a 50-100% instant return. $500 per month in a 401k at 7% return from age 25 becomes approximately $1.37 million at age 65.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A 401k is an employer-sponsored retirement savings account where contributions are made pre-tax, reducing your taxable income today. Many employers match contributions up to a percentage of salary — this match is free money that should always be captured first before any other investing. This calculator projects your 401k balance at retirement.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "401(k) Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Current Age", val: currentAge, set: setCurrentAge },
              { label: "Retirement Age", val: retirementAge, set: setRetirementAge },
              { label: "Current 401(k) Balance ($)", val: balance, set: setBalance },
              { label: "Annual Salary ($)", val: salary, set: setSalary },
              { label: "Your Contribution (%)", val: yourPct, set: setYourPct },
              { label: "Employer Match (%)", val: matchPct, set: setMatchPct },
              { label: "Expected Annual Return (%)", val: returnPct, set: setReturnPct },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} className={inp} />
              </label>
            ))}
          </div>

          {calc.leavingMoney && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4">
              <p className="text-yellow-300 font-semibold">⚠️ You are leaving free money on the table!</p>
              <p className="text-[#a8a8b3] text-sm mt-1">Increase your contribution to {matchPct}% to get the full employer match.</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Your Annual Contribution", value: fmt(calc.yourAnnual), color: "#4FC3F7" },
              { label: "Employer Annual Match", value: fmt(calc.matchAnnual), color: "#4ade80" },
              { label: "Projected Balance", value: fmt(calc.projected), color: "#F9A825" },
              { label: "Monthly Income (4% Rule)", value: fmt(calc.monthlyIncome), color: "#e94560" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                <div className="text-2xl font-black" style={{ color: r.color }}>{r.value}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Contribution Scenarios</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Your %</th>
                <th className="py-2 text-right text-[#a8a8b3]">Balance at Retirement</th>
                <th className="py-2 text-right text-[#a8a8b3]">Monthly Income</th>
              </tr></thead>
              <tbody>{calc.scenarios.map(s => (
                <tr key={s.pct} className={`border-b border-[#0f3460]/50 ${s.pct === parseFloat(yourPct) ? "bg-[#e94560]/10" : ""}`}>
                  <td className="py-2 text-white">{s.pct}%</td>
                  <td className="py-2 text-right text-[#F9A825]">{fmt(s.balance)}</td>
                  <td className="py-2 text-right text-[#4ade80]">{fmt(s.monthly)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const salaryAmt = parseFloat(salary) || 0
            const yourPctNum = parseFloat(yourPct) || 0
            const matchPctNum = parseFloat(matchPct) || 0
            const yearsToRetire = parseFloat(retirementAge) - parseFloat(currentAge)
            const uncapturedMatch = calc.leavingMoney
              ? Math.round(salaryAmt * (matchPctNum - yourPctNum) / 100)
              : 0

            let tier: 'no-match' | 'below-match' | 'at-match' | 'above-match' | 'maxed'
            let tierMessage: string
            const limit2026 = 23500

            if (yourPctNum === 0) {
              tier = 'no-match'
              tierMessage = `You are contributing 0% to your 401k. This is the most expensive financial mistake most Americans make. If your employer matches ${matchPctNum}% and you contribute nothing, you forfeit ${fmt(Math.round(salaryAmt * matchPctNum / 100))}/year in free compensation. Enroll today — it takes 10 minutes and the match is immediate free money.`
            } else if (calc.leavingMoney) {
              tier = 'below-match'
              tierMessage = `You are contributing ${yourPctNum}% but your employer matches up to ${matchPctNum}%. You are forfeiting ${fmt(uncapturedMatch)}/year in employer matching funds — the equivalent of a ${Math.round(uncapturedMatch / salaryAmt * 100)}% pay cut you volunteered for. Increase to ${matchPctNum}% immediately.`
            } else if (yourPctNum <= matchPctNum + 1) {
              tier = 'at-match'
              tierMessage = `You are capturing your full employer match — the most important first step. Your projected balance of ${fmt(Math.round(calc.projected))} generates approximately ${fmt(Math.round(calc.monthlyIncome))}/month in retirement income at a 4% withdrawal rate. The next lever: increase contributions toward the $${limit2026.toLocaleString()} annual limit.`
            } else if (calc.yourAnnual < limit2026 * 0.9) {
              tier = 'above-match'
              tierMessage = `You are contributing above the employer match — strong financial discipline. Your ${fmt(Math.round(calc.yourAnnual))}/year contribution grows to a projected ${fmt(Math.round(calc.projected))} over ${Math.round(yearsToRetire)} years. You have room to increase toward the 2026 limit of $${limit2026.toLocaleString()} for additional tax-deferred growth.`
            } else {
              tier = 'maxed'
              tierMessage = `You are at or near the 2026 401k limit of $${limit2026.toLocaleString()} — exceptional retirement discipline. Your projected ${fmt(Math.round(calc.projected))} balance generates approximately ${fmt(Math.round(calc.monthlyIncome))}/month in retirement income. Next priority: overflow into a backdoor Roth IRA ($7,000) or taxable brokerage account.`
            }

            let incomeMessage: string
            if (calc.monthlyIncome < 1000) {
              incomeMessage = `Your projected ${fmt(Math.round(calc.monthlyIncome))}/month retirement income from this 401k alone is below a comfortable threshold. Social Security (average benefit ~$1,800/month in 2026) and other savings will need to supplement this significantly.`
            } else if (calc.monthlyIncome < 3000) {
              incomeMessage = `Your projected ${fmt(Math.round(calc.monthlyIncome))}/month from this 401k provides a meaningful foundation. Combined with Social Security (average ~$1,800/month) you may approach ${fmt(Math.round(calc.monthlyIncome + 1800))}/month total — a starting point for modeling your full retirement income picture.`
            } else {
              incomeMessage = `Your projected ${fmt(Math.round(calc.monthlyIncome))}/month from this 401k alone is a strong retirement income foundation. Combined with Social Security and any other savings you are building toward genuine financial independence in retirement.`
            }

            let nextActions: string[]
            if (tier === 'no-match' || tier === 'below-match') {
              nextActions = [
                `Log into your HR portal today and increase 401k contribution to ${matchPctNum}% — this takes 10 minutes and recaptures ${fmt(Math.round(salaryAmt * matchPctNum / 100))}/year in free money`,
                `Understand your vesting schedule — employer match may vest gradually (cliff or graded vesting). Know when it becomes fully yours`,
                `Choose a target-date fund if you are unsure about investment selection — automatically rebalances toward bonds as retirement approaches`,
                `Set a calendar reminder to increase contribution by 1% every 6 months until you reach 15% total`
              ]
            } else if (tier === 'at-match') {
              nextActions = [
                `Increase contribution by 2% — the take-home pay impact is smaller than you expect due to pre-tax reduction in federal and state taxes`,
                `Verify your investment allocation — default fund selections are often too conservative for a ${Math.round(yearsToRetire)}-year timeline`,
                `Check your vesting status — ensure you understand when employer contributions become 100% yours`,
                `Open a Roth IRA ($7,000/year) if your income is below the phase-out threshold — complementary tax-free growth`
              ]
            } else {
              nextActions = [
                tier === 'maxed'
                  ? `Max is reached — next priority is backdoor Roth IRA ($7,000/year) if income exceeds direct contribution limits`
                  : `Push toward the $${limit2026.toLocaleString()} limit — each additional $1,000/year at ${parseFloat(returnPct) || 7}% for ${Math.round(yearsToRetire)} years adds ${fmt(Math.round(1000 * (Math.pow(1 + (parseFloat(returnPct) || 7) / 100, yearsToRetire) - 1) / ((parseFloat(returnPct) || 7) / 100)))} to your balance`,
                `Review asset allocation — at your contribution level a 1% return drag from poor fund selection is thousands over ${Math.round(yearsToRetire)} years`,
                `Model Social Security claiming age — delaying from 62 to 70 increases benefit by approximately 77%, dramatically changing total retirement income`,
                `Consider HSA if eligible — triple tax advantage and can be used as a stealth retirement account after 65`
              ]
            }

            const borderColor = tier === 'no-match' ? '#e94560'
              : tier === 'below-match' ? '#facc15'
              : tier === 'at-match' ? '#60a5fa'
              : tier === 'above-match' ? '#4ade80'
              : '#a78bfa'
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
                    Now What? Your 401k Action Plan
                  </h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Contribution Status — {yourPctNum}% of ${salaryAmt.toLocaleString()} Salary
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {tierMessage}
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Projected Retirement Income — {fmt(Math.round(calc.monthlyIncome))}/Month
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {incomeMessage}
                  </p>
                </div>
                {uncapturedMatch > 0 && (
                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      ⚠️ You are forfeiting {fmt(uncapturedMatch)}/year in employer matching funds.
                      Over {Math.round(yearsToRetire)} years at {parseFloat(returnPct) || 7}% that uncaptured match
                      would have grown to approximately {fmt(Math.round(uncapturedMatch * (Math.pow(1 + (parseFloat(returnPct) || 7) / 100, yearsToRetire) - 1) / ((parseFloat(returnPct) || 7) / 100)))}.
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
                        <span style={{ color: borderColor, fontSize: '14px', fontWeight: '800', minWidth: '20px', marginTop: '1px' }}>{i + 1}.</span>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
          <ShareButtons
            text={`Investing ${yourPct}% of my $${salary} salary in 401k = ${fmt(calc.projected)} at retirement! (Educational only)`}
            url={`https://www.dayblip.com/finance/401k-calculator?age=${currentAge}&retireage=${retirementAge}&balance=${balance}&salary=${salary}&contrib=${yourPct}&match=${matchPct}&return=${returnPct}`}
            title="401(k) Calculator"
          />
          <RelatedTools tools={[
            { emoji: "💰", title: "Retirement Savings", desc: "Are you on track?", href: "/finance/retirement-savings" },
            { emoji: "📈", title: "Compound Interest", desc: "Grow wealth over time", href: "/finance/compound-interest" },
            { emoji: "🏖️", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
            { emoji: "📋", title: "Roth IRA vs Traditional", desc: "Which is better for you?", href: "/blog/roth-ira-vs-traditional-ira" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">401(k) contribution limits and employer match rules vary. Consult your plan documents and a financial advisor. For educational purposes only.</p>
          <FAQAccordion items={[
            { q: "What is the 401k contribution limit for 2026?", a: "The IRS 401k contribution limit for 2026 is $23,500 for employees under 50. Workers aged 50 and over can make an additional catch-up contribution of $7,500 bringing their total to $31,000. These limits adjust annually for inflation." },
            { q: "Should I contribute to a traditional or Roth 401k?", a: "Traditional 401k contributions reduce taxable income now and are taxed on withdrawal. Roth 401k contributions are made with after-tax dollars and withdrawals are tax-free. If you expect to be in a higher tax bracket in retirement than now, Roth is generally better." },
            { q: "What happens to my 401k if I change jobs?", a: "You can roll your 401k balance to your new employer's plan, roll it to an IRA, leave it with the former employer if the balance is above $7,000, or cash it out which triggers taxes and a 10 percent early withdrawal penalty if under age 59 and a half." },
            { q: "How does employer matching work?", a: "Common match structures include 50 percent of contributions up to 6 percent of salary or 100 percent of contributions up to 3 percent of salary. Always contribute at least enough to get the full employer match — it is an immediate 50 to 100 percent return on that portion." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
