"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational projection only.</strong> Actual results depend on market performance, inflation and life circumstances. Past returns do not guarantee future results. Not financial advice.
  </div>
)

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function simulate(portfolio: number, monthly: number, monthlyReturn: number, target: number): number {
  let p = portfolio
  let m = 0
  while (p < target && m < 600) {
    p = p * (1 + monthlyReturn) + monthly
    m++
  }
  return m
}

interface Result {
  fiNumber: number; months: number; fiDate: Date; ageAtFI: number
  monthlyPassiveIncome: number; savingsRate: number
  accel200more: number; accel200less: number; accel1pct: number
  newDate200more: Date; newDate200less: Date; newDate1pct: Date
  currentAge: number; income: number; expenses: number; currentSavings: number; monthlyContrib: number
  annualReturn: number; withdrawalRate: number
}

function compute(
  currentAge: number, income: number, expenses: number,
  currentSavings: number, monthlyContrib: number,
  annualReturn: number, withdrawalRate: number
): Result {
  const fiNumber = expenses / (withdrawalRate / 100)
  const mr = annualReturn / 100 / 12
  const today = new Date()

  const months = simulate(currentSavings, monthlyContrib, mr, fiNumber)
  const fiDate = addMonths(today, months)
  const ageAtFI = currentAge + months / 12
  const monthlyPassiveIncome = fiNumber * (withdrawalRate / 100) / 12
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  const m200 = simulate(currentSavings, monthlyContrib + 200, mr, fiNumber)
  const fiNumber200less = (expenses - 200 * 12) / (withdrawalRate / 100)
  const m200lessActual = simulate(currentSavings, monthlyContrib, mr, Math.max(fiNumber200less, 1))
  const mr1p = (annualReturn + 1) / 100 / 12
  const m1p = simulate(currentSavings, monthlyContrib, mr1p, fiNumber)

  return {
    fiNumber, months, fiDate, ageAtFI, monthlyPassiveIncome,
    savingsRate: Math.max(0, savingsRate),
    accel200more: Math.max(0, months - m200),
    accel200less: Math.max(0, months - m200lessActual),
    accel1pct: Math.max(0, months - m1p),
    newDate200more: addMonths(today, m200),
    newDate200less: addMonths(today, m200lessActual),
    newDate1pct: addMonths(today, m1p),
    currentAge, income, expenses, currentSavings, monthlyContrib, annualReturn, withdrawalRate,
  }
}

function fmtDate(d: Date) { return d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) }
function fmtShortDate(d: Date) { return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) }

// ─── Defined at module scope so React never remounts it on re-render ──────────
function NumField({ label, value, set, prefix }: { label: string; value: string; set: (v: string) => void; prefix?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => set(e.target.value)}
          className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none"
        />
      </div>
    </label>
  )
}

function Countdown({ target }: { target: Date }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  if (diff <= 0) return <div className="text-[#4ade80] font-bold text-lg">You have reached FI! 🎉</div>
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[[days, "days"], [hours, "hrs"], [mins, "min"], [secs, "sec"]].map(([val, lbl]) => (
        <div key={String(lbl)} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-2">
          <div className="tabular-nums text-xl font-black text-[#e94560]">{String(val).padStart(2, "0")}</div>
          <div className="text-xs text-[#a8a8b3]">{lbl}</div>
        </div>
      ))}
    </div>
  )
  void tick
}

export default function FIDatePage() {
  const [age, setAge] = useState("35")
  const [income, setIncome] = useState("75000")
  const [expenses, setExpenses] = useState("50000")
  const [savings, setSavings] = useState("50000")
  const [monthly, setMonthly] = useState("1000")
  const [ret, setRet] = useState("7")
  const [wr, setWr] = useState("4")
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, a = age, i = income, ex = expenses, s = savings, m = monthly, r = ret, w = wr) {
    const res = compute(+a || 35, +i || 0, +ex || 0, +s || 0, +m || 0, +r || 7, +w || 4)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?age=${a}&income=${i}&expenses=${ex}&savings=${s}&monthly=${m}&return=${r}&withdrawal=${w}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const a = p.get("age"), i = p.get("income"), ex = p.get("expenses"), s = p.get("savings"),
      m = p.get("monthly"), r = p.get("return"), w = p.get("withdrawal")
    if (a && i && ex) {
      if (a) setAge(a); if (i) setIncome(i); if (ex) setExpenses(ex)
      if (s) setSavings(s); if (m) setMonthly(m); if (r) setRet(r); if (w) setWr(w)
      runCalc(false, a ?? age, i ?? income, ex ?? expenses, s ?? savings, m ?? monthly, r ?? ret, w ?? wr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const milestone = (months: number) => {
    const years = months / 12
    if (years < 5) return { text: "🔥 You are on the FIRE path!", color: "#e94560" }
    if (years < 15) return { text: "⚡ Strong savings rate — FI within reach!", color: "#F9A825" }
    if (years < 30) return { text: "📈 Steady progress toward independence", color: "#4FC3F7" }
    return { text: "💡 Consider increasing your savings rate to accelerate your FI date", color: "#a8a8b3" }
  }

  const shareUrl = result ? `https://www.dayblip.com/tools/fi-date?age=${age}&income=${income}&expenses=${expenses}&savings=${savings}&monthly=${monthly}&return=${ret}&withdrawal=${wr}` : ""
  const shareText = result
    ? `I could stop working on ${fmtDate(result.fiDate)}!\n${Math.round((result.fiDate.getTime() - Date.now()) / 86400000).toLocaleString()} days from today 🎯\nFI Number needed: ${fmt(result.fiNumber)}\nSavings rate: ${result.savingsRate.toFixed(1)}%\nCalculate yours:\n(Educational only — not financial advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Financial Independence Date Calculator", "Calculate the exact date you could achieve financial independence and stop working. Includes live countdown to your FI date and FIRE calculator.", "https://www.dayblip.com/tools/fi-date", "FinanceApplication"),
        faqSchema([
          { question: "What is financial independence?", answer: "Financial independence means having enough invested savings to cover your living expenses indefinitely using a safe withdrawal rate, typically 4%, without needing to work." },
          { question: "How much do I need to retire early?", answer: "Your FI number equals your annual expenses divided by your safe withdrawal rate. At 4% withdrawal rate, you need 25 times your annual expenses invested." },
          { question: "What is the 4% rule?", answer: "The 4% rule states that you can withdraw 4% of your portfolio annually in retirement with a high probability of your money lasting 30+ years, based on historical market data." },
          { question: "How can I reach financial independence faster?", answer: "Increase your savings rate, reduce expenses, and invest the difference. Saving an extra $200 per month can move your FI date forward by 12-18 months." },
        ]),
        howToSchema("How to Calculate Your Financial Independence Date", "Find your exact financial independence date in seconds", [
          "Enter your current age",
          "Enter your annual income and annual expenses",
          "Enter your current portfolio value",
          "Enter your monthly investment contribution",
          "Set expected annual return and safe withdrawal rate",
          "Click Find My FI Date to see your exact independence date",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Financial Independence Date", url: "https://www.dayblip.com/tools/fi-date" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Financial Independence Calculator — When Can You Stop Working?</h1>
          <p className="text-[#a8a8b3]">Find the exact date you could stop working forever</p>
          <a href="/blog/financial-independence-date" style={{ fontSize: "13px", color: "#e94560", marginTop: "8px", display: "inline-block" }}>Read: How to Calculate Your FI Date →</a>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Your financial independence date is when your invested portfolio generates enough passive income to cover all expenses without working. At a 4% safe withdrawal rate you need 25 times your annual expenses invested. A person spending $50,000 per year needs $1,250,000 invested to retire.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Financial independence (FI) means your investments generate enough income to cover your living expenses indefinitely. This calculator uses compound interest projections and the 4% safe withdrawal rule to find your exact FI date and generate a live countdown.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Financial Independence Date" }
          ]} />
          {DISCLAIMER}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumField label="Current age" value={age} set={setAge} />
            <NumField label="Annual income" value={income} set={setIncome} prefix="$" />
            <NumField label="Annual expenses" value={expenses} set={setExpenses} prefix="$" />
            <NumField label="Current portfolio value" value={savings} set={setSavings} prefix="$" />
            <NumField label="Monthly investment" value={monthly} set={setMonthly} prefix="$" />
            <NumField label="Expected annual return (%)" value={ret} set={setRet} />
            <NumField label="Safe withdrawal rate (%)" value={wr} set={setWr} />
          </div>
          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Find My FI Date
          </button>

          {result && (() => {
            const ms = milestone(result.months)
            return (
              <div className="space-y-6">
                {/* FI Date */}
                <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-center">
                  <div className="text-sm font-bold uppercase tracking-widest text-[#a8a8b3]">You could stop working on</div>
                  <div className="my-2 text-4xl font-black text-[#e94560]">{fmtDate(result.fiDate)}</div>
                  <div className="mt-1 text-sm text-[#a8a8b3]">Live countdown</div>
                  <div className="mt-3"><Countdown target={result.fiDate} /></div>
                </div>

                {/* Milestone */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center font-semibold" style={{ color: ms.color }}>{ms.text}</div>

                {/* Key numbers */}
                <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-3">
                  {[
                    { label: "FI number needed", val: fmt(result.fiNumber), color: "#F9A825" },
                    { label: "Still needed", val: fmt(Math.max(0, result.fiNumber - result.currentSavings)), color: "#e94560" },
                    { label: "Months until FI", val: result.months.toLocaleString(), color: "#ffffff" },
                    { label: "Age at FI", val: result.ageAtFI.toFixed(1), color: "#4FC3F7" },
                    { label: "Monthly passive income", val: fmt(result.monthlyPassiveIncome), color: "#4ade80" },
                    { label: "Your savings rate", val: `${result.savingsRate.toFixed(1)}%`, color: "#F9A825" },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                      <div className="font-black" style={{ color: c.color }}>{c.val}</div>
                      <div className="mt-0.5 text-xs text-[#a8a8b3]">{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* Savings rate bar */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="mb-2 font-bold text-white">Your savings rate vs average American</div>
                  <div className="flex justify-between text-xs text-[#a8a8b3] mb-1"><span>Average American: 3.5%</span><span>Yours: {result.savingsRate.toFixed(1)}%</span></div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#0f3460]">
                    <div className="h-full rounded-full bg-[#e94560] transition-all" style={{ width: `${Math.min(100, result.savingsRate)}%` }} />
                  </div>
                </div>

                {/* Accelerators */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <div className="mb-3 font-bold text-white">What changes your FI date?</div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-[#0f3460] text-[#a8a8b3] text-xs"><th className="py-1.5 text-left">Action</th><th className="py-1.5 text-right">Months saved</th><th className="py-1.5 text-right">New FI date</th></tr></thead>
                    <tbody className="text-white">
                      <tr className="border-b border-[#0f3460]"><td className="py-2">Save $200/month more</td><td className="py-2 text-right text-[#4ade80]">{result.accel200more} mo</td><td className="py-2 text-right">{fmtShortDate(result.newDate200more)}</td></tr>
                      <tr className="border-b border-[#0f3460]"><td className="py-2">Spend $200/month less</td><td className="py-2 text-right text-[#4ade80]">{result.accel200less} mo</td><td className="py-2 text-right">{fmtShortDate(result.newDate200less)}</td></tr>
                      <tr><td className="py-2">Get 1% more annual return</td><td className="py-2 text-right text-[#4ade80]">{result.accel1pct} mo</td><td className="py-2 text-right">{fmtShortDate(result.newDate1pct)}</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* ── NOW WHAT? Interpretation Layer ── */}
                {(() => {
                  const sr = result.savingsRate
                  const mo = result.months
                  const yr = Math.floor(mo / 12)
                  const best = Math.min(result.accel200more, result.accel200less)
                  const bestLabel = result.accel200more <= result.accel200less
                    ? 'saving an extra $200/month'
                    : 'cutting $200/month in expenses'

                  let srTier: 'critical' | 'low' | 'good' | 'excellent'
                  let srMessage: string
                  if (sr < 10) {
                    srTier = 'critical'
                    srMessage = `Your savings rate is ${sr.toFixed(1)}% — below the 10% minimum most financial planners recommend. At this rate, reaching FI in ${yr} years will be extremely difficult without a significant income increase or expense reduction.`
                  } else if (sr < 25) {
                    srTier = 'low'
                    srMessage = `Your savings rate is ${sr.toFixed(1)}%. The typical American saves 5–8%, so you are ahead — but FI-focused individuals typically target 25–50%. Closing that gap is the single highest-leverage move available to you.`
                  } else if (sr < 50) {
                    srTier = 'good'
                    srMessage = `Your savings rate is ${sr.toFixed(1)}% — solidly above average and in the range most FIRE practitioners target. You are on a real path to financial independence.`
                  } else {
                    srTier = 'excellent'
                    srMessage = `Your savings rate is ${sr.toFixed(1)}% — exceptional. You are saving at the level of aggressive FIRE practitioners. Maintaining this rate consistently is the primary challenge at your stage.`
                  }

                  let timelineMessage: string
                  if (yr <= 5) {
                    timelineMessage = `At ${yr} years to FI, you are in striking distance. Your primary job now is protecting your savings rate and avoiding lifestyle inflation as your income grows. A single large expense shock (job loss, medical, divorce) is the main risk at this stage — ensure your emergency fund covers 12+ months of expenses.`
                  } else if (yr <= 15) {
                    timelineMessage = `At ${yr} years to FI, you have a clear, achievable timeline. Compounding is beginning to do real work — your portfolio growth will increasingly outpace your contributions. The highest-ROI actions now are income growth (your savings rate compounds on a larger base) and keeping expenses flat as income rises.`
                  } else if (yr <= 30) {
                    timelineMessage = `At ${yr} years to FI, the timeline is long enough that small improvements compound dramatically. Shaving 5 years off a 25-year FI timeline is achievable with a 5–10% improvement in savings rate. Do not underestimate the impact of the accelerators above — small changes now produce large time savings later.`
                  } else {
                    timelineMessage = `At ${yr} years, FI under current inputs is a very long road. The most important variable to change is your savings rate — income growth combined with controlled expenses has the highest leverage here. Consider whether your income trajectory changes significantly in the next 5 years before treating this timeline as fixed.`
                  }

                  const leverMessage = best > 0
                    ? `Your single most powerful lever right now: ${bestLabel} moves your FI date ${Math.floor(best / 12)} years and ${best % 12} months sooner. That is the highest-ROI financial change available to you today.`
                    : `Run the accelerators above to find your highest-ROI next move.`

                  let nextActions: string[]
                  if (srTier === 'critical') {
                    nextActions = [
                      'Find one expense to cut immediately — target $200–500/month',
                      'Calculate your true hourly wage to understand what your time costs',
                      'Review every subscription and recurring charge this week',
                      'Set an automatic transfer on payday before discretionary spending',
                    ]
                  } else if (srTier === 'low') {
                    nextActions = [
                      `Close the gap: increasing savings rate to 25% is your highest-leverage move`,
                      'Negotiate salary or find income growth — same lifestyle at higher income = huge savings rate jump',
                      'Automate savings increases of 1% per year to painlessly ratchet up your rate',
                      'Use the True Hourly Wage calculator to reframe large purchases in time cost',
                    ]
                  } else if (srTier === 'good') {
                    nextActions = [
                      'Maintain rate through income growth — lifestyle inflation is the primary risk',
                      'Optimize investment allocation — ensure tax-advantaged accounts (401k, IRA, HSA) are maxed first',
                      'Build a 12-month expense emergency fund to protect against timeline disruption',
                      'Model the impact of major life expenses (house, children, education) on this timeline',
                    ]
                  } else {
                    nextActions = [
                      'Model sequence-of-returns risk — high savings rate means large portfolio exposure near FI date',
                      'Ensure 12–24 months of expenses in cash/short-term bonds as FI approaches',
                      'Consider whether your withdrawal rate assumption accounts for healthcare costs pre-65',
                      'Run your FI date with a 3.5% withdrawal rate as a stress test — 4% is optimistic over 40+ year horizons',
                    ]
                  }

                  const borderColor = srTier === 'critical' ? '#e94560'
                    : srTier === 'low' ? '#facc15'
                    : srTier === 'good' ? '#4ade80'
                    : '#a78bfa'

                  const labelColor = borderColor

                  return (
                    <div style={{
                      background: '#0d1b2a',
                      borderRadius: '16px',
                      padding: '28px 28px 24px',
                      margin: '32px 0 24px',
                      borderLeft: `4px solid ${borderColor}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '22px' }}>🧭</span>
                        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                          Now What? Your FI Action Plan
                        </h3>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                          Savings Rate Assessment
                        </p>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                          {srMessage}
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                          What This Timeline Means
                        </p>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                          {timelineMessage}
                        </p>
                      </div>

                      <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                        <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                          ⚡ {leverMessage}
                        </p>
                      </div>

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

                <ShareButtons text={shareText} url={shareUrl} title="Financial Independence Date Calculator" />
                {/* Embed this tool */}
                <div style={{
                  textAlign: "center",
                  marginTop: "32px",
                  marginBottom: "16px",
                  padding: "16px",
                  background: "#1e2d4a",
                  borderRadius: "8px",
                  border: "1px solid #2a3a5a",
                }}>
                  <p style={{ color: "#a8a8b3", fontSize: "14px", margin: "0 0 8px 0" }}>
                    Want to add this tool to your website?
                  </p>
                  <a
                    href="/embed"
                    style={{ color: "#e94560", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
                  >
                    Get the free embed code →
                  </a>
                </div>
                <RelatedTools tools={[
                  { emoji: "🛡️", title: "Life Insurance Calculator", desc: "How much coverage do you actually need?", href: "/tools/life-insurance-calculator" },
                  { emoji: "🏦", title: "Retirement Savings", desc: "Are you on track to retire?", href: "/finance/retirement-savings" },
                  { emoji: "💹", title: "Compound Interest", desc: "Watch your money grow over time", href: "/finance/compound-interest" },
                  { emoji: "💳", title: "Minimum Payment True Cost", desc: "See the shocking cost of paying minimums", href: "/tools/minimum-payment" },
                  { emoji: "📊", title: "Net Worth Calculator", desc: "Know where you stand financially", href: "/finance/net-worth" },
                ]} />
                {DISCLAIMER}
              </div>
            )
          })()}
          <FAQAccordion items={[
            {
              question: "What is financial independence?",
              answer: "Financial independence means having enough invested assets that passive returns can cover your living expenses indefinitely — you no longer need to work for money. It is calculated using the 4 percent rule: annual expenses divided by 0.04 gives your FI number."
            },
            {
              question: "What is a FI number?",
              answer: "Your FI number is the total portfolio value needed to retire. If you spend $50,000 per year your FI number is $50,000 divided by 0.04 which equals $1,250,000. At this level a 4 percent annual withdrawal historically sustains a portfolio indefinitely."
            },
            {
              question: "How long does it take to reach financial independence?",
              answer: "Time to FI depends almost entirely on savings rate. At a 10 percent savings rate FI takes roughly 40 years. At 25 percent about 32 years. At 50 percent about 17 years. At 70 percent about 8.5 years. Increasing savings rate is more powerful than increasing income."
            },
            {
              question: "What investment return should I assume?",
              answer: "The US stock market has historically returned approximately 10 percent annually before inflation or about 7 percent after inflation. Most FI calculators use 7 percent real return as a conservative baseline. Your actual returns will vary based on asset allocation."
            },
            {
              question: "What is the 4 percent rule?",
              answer: "The 4 percent rule comes from the 1994 Trinity Study which found that a portfolio of 50-75 percent stocks could sustain 30 years of withdrawals at 4 percent annually with high historical success rates. For longer retirements of 40-50 years many planners use 3 to 3.5 percent as a more conservative rate."
            },
            {
              question: "What is a good savings rate for financial independence?",
              answer: "Most FI practitioners target a savings rate of 25-50 percent of gross income. The average American saves 5-8 percent. At 25 percent savings rate FI takes approximately 32 years from zero. At 50 percent approximately 17 years. Every percentage point increase in savings rate meaningfully shortens the timeline."
            },
          ]} />
        </div>
      </section>
    </div>
  )
}
