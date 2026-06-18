"use client"
import { useState, useMemo, useCallback } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

interface Debt { id: number; name: string; balance: string; rate: string; minPayment: string }

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function addMonths(months: number) {
  const d = new Date(2025, 4, 1) // fixed reference date for determinism
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

let _nextId = 2

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 0, name: "Credit Card", balance: "5000", rate: "22", minPayment: "100" },
    { id: 1, name: "Car Loan", balance: "12000", rate: "6", minPayment: "250" },
  ])
  const [extra, setExtra] = useState("200")
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche")

  const update = useCallback((id: number, field: keyof Debt, value: string) =>
    setDebts(ds => ds.map(d => d.id === id ? { ...d, [field]: value } : d)), [])

  const addDebt = () => {
    if (debts.length < 5) {
      const newId = _nextId++
      setDebts(ds => [...ds, { id: newId, name: "New Debt", balance: "0", rate: "0", minPayment: "0" }])
    }
  }

  const calc = useMemo(() => {
    const parsed = debts.map(d => ({
      name: d.name,
      balance: parseFloat(d.balance) || 0,
      rate: (parseFloat(d.rate) || 0) / 100 / 12,
      min: parseFloat(d.minPayment) || 0,
    })).filter(d => d.balance > 0)
    if (!parsed.length) return null
    const extraPmt = parseFloat(extra) || 0
    const sorted = [...parsed].sort((a, b) =>
      strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance
    )
    const bals = sorted.map(d => d.balance)
    let month = 0
    let totalInterest = 0
    const payoffMonths: number[] = new Array(sorted.length).fill(0)
    const MAX = 600
    while (bals.some(b => b > 0) && month < MAX) {
      month++
      let extraLeft = extraPmt
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue
        const interest = bals[i] * sorted[i].rate
        totalInterest += interest
        bals[i] += interest
        const pmt = Math.min(bals[i], sorted[i].min)
        bals[i] -= pmt
        if (bals[i] < 0) bals[i] = 0
      }
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue
        const pay = Math.min(bals[i], extraLeft)
        bals[i] -= pay
        extraLeft -= pay
        if (bals[i] <= 0) { bals[i] = 0; if (!payoffMonths[i]) payoffMonths[i] = month }
        if (extraLeft <= 0) break
      }
    }
    const minOnlyInterest = parsed.reduce((acc, d) => {
      let bal = d.balance; let mo = 0; let int = 0
      while (bal > 0 && mo < MAX) {
        const i = bal * d.rate; int += i; bal += i - d.min; mo++
        if (bal < 0) bal = 0
      }
      return acc + int
    }, 0)
    return {
      months: month,
      debtFreeDate: addMonths(month),
      totalInterest,
      interestSaved: Math.max(0, minOnlyInterest - totalInterest),
      order: sorted.map((d, i) => ({ name: d.name, months: payoffMonths[i] || month })),
    }
  }, [debts, extra, strategy])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none w-full"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Debt Payoff Calculator",
          "Create a debt payoff plan using the snowball or avalanche method and see your debt-free date.",
          "https://www.dayblip.com/finance/debt-payoff",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What is the debt avalanche method?", answer: "The avalanche method targets the debt with the highest interest rate first while paying minimums on the rest. Once it is cleared, you roll that payment to the next-highest rate. This minimizes total interest paid and is usually the fastest mathematically." },
          { question: "What is the debt snowball method?", answer: "The snowball method targets the smallest balance first while paying minimums on the rest. Clearing small debts quickly builds momentum and motivation. It may cost slightly more interest than avalanche but works well for staying motivated." },
          { question: "How does an extra monthly payment speed up payoff?", answer: "Any extra payment is applied to your priority debt on top of the minimums, shrinking the balance faster and reducing interest. The calculator shows how your extra payment shortens your timeline and how much interest you save." },
          { question: "When will I be debt free?", answer: "Enter each debt's balance, rate, and minimum payment, your extra monthly payment, and your chosen strategy. The calculator simulates month by month to show your debt-free date, total interest, interest saved, and the payoff order." },
        ]),
        howToSchema(
          "Debt Payoff Calculator — How To Use",
          "Build a snowball or avalanche debt payoff plan and find your debt-free date.",
          [
            "Enter each debt's name, balance, interest rate, and minimum payment.",
            "Add additional debts if needed, up to five.",
            "Enter your extra monthly payment.",
            "Choose the avalanche or snowball strategy.",
            "Review your debt-free date, total interest, and payoff order.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Debt Payoff Calculator", url: "https://www.dayblip.com/finance/debt-payoff" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Debt Payoff Calculator — Avalanche vs Snowball Method</h1>
          <p className="text-[#a8a8b3]">Choose your strategy and become debt free faster</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[900px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The debt avalanche method pays off highest-interest debt first and saves the most money in interest. The debt snowball method pays off smallest balances first and builds psychological momentum. On $20,000 of mixed debt the avalanche method typically saves $2,000–$5,000 more in interest than the snowball method over the payoff period.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Debt payoff calculators compare different repayment strategies to show total interest paid and payoff timeline for each approach. The right strategy depends on whether you prioritize saving maximum interest or building psychological wins through quick payoffs. Both methods beat making only minimum payments by thousands of dollars.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Debt Payoff Calculator" }]} />
          <LastUpdated />
          <div className="space-y-3">
            {debts.map(d => (
              <div key={d.id} className="grid grid-cols-2 gap-2 md:grid-cols-5 items-end rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <label className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  <span className="text-xs text-[#a8a8b3]">Debt Name</span>
                  <input value={d.name} onChange={e => update(d.id, "name", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Balance ($)</span>
                  <input type="number" value={d.balance} onChange={e => update(d.id, "balance", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Rate (%)</span>
                  <input type="number" step="0.1" value={d.rate} onChange={e => update(d.id, "rate", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Min Payment ($)</span>
                  <input type="number" value={d.minPayment} onChange={e => update(d.id, "minPayment", e.target.value)} className={inp} />
                </label>
                <button onClick={() => setDebts(ds => ds.filter(x => x.id !== d.id))} className="text-[#e94560] text-sm hover:opacity-70 text-left md:text-center">Remove</button>
              </div>
            ))}
            {debts.length < 5 && (
              <button onClick={addDebt} className="rounded-lg border border-[#e94560]/50 px-4 py-2 text-[#e94560] hover:bg-[#e94560]/10 text-sm">+ Add Debt</button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Extra Monthly Payment ($)</span>
              <input type="number" value={extra} onChange={e => setExtra(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Strategy</span>
              <div className="flex gap-2">
                {(["avalanche", "snowball"] as const).map(s => (
                  <button key={s} onClick={() => setStrategy(s)}
                    className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${strategy === s ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {s === "avalanche" ? "🏔️ Avalanche" : "⛄ Snowball"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {calc && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-5 text-center">
                  <div className="text-2xl font-black text-green-400">{calc.months} months</div>
                  <div className="text-sm text-[#a8a8b3]">Debt Free In</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{calc.debtFreeDate}</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#e94560]">{fmt(calc.totalInterest)}</div>
                  <div className="text-sm text-[#a8a8b3]">Total Interest</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.interestSaved)}</div>
                  <div className="text-sm text-[#a8a8b3]">Interest Saved</div>
                </div>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <p className="font-bold text-white mb-3">📋 Payoff Order ({strategy})</p>
                {calc.order.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-3 py-2 border-b border-[#0f3460]/50 last:border-0">
                    <span className="text-[#e94560] font-black w-8">#{i + 1}</span>
                    <span className="text-white flex-1">{d.name}</span>
                    <span className="text-[#a8a8b3] text-sm">{d.months} months</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <MethodologyNote text="Standard amortization formula applied per payment period. Avalanche method orders debts by highest interest rate; snowball method by lowest balance." />
          {calc && (
            <>
              {/* ── NOW WHAT? Interpretation Layer ── */}
              {(() => {
                const months = calc.months
                const years = Math.floor(months / 12)
                const remainMonths = months % 12
                const interestSaved = calc.interestSaved
                const extraAmt = parseFloat(extra) || 0

                let tier: 'urgent' | 'moderate' | 'long' | 'crushing'
                let tierMessage: string

                if (months <= 12) {
                  tier = 'urgent'
                  tierMessage = `You are ${months} month${months === 1 ? '' : 's'} from debt freedom — so close you can see it. At this stage the most important thing is protecting your payoff date. Do not take on any new debt, avoid missing payments, and consider making one extra payment this month to finish even sooner.`
                } else if (months <= 36) {
                  tier = 'moderate'
                  tierMessage = `You will be debt-free in ${years > 0 ? years + ' year' + (years > 1 ? 's' : '') + (remainMonths > 0 ? ' and ' + remainMonths + ' months' : '') : months + ' months'} — a clear, achievable finish line. Stay focused on the plan. The biggest risk at this stage is lifestyle creep eating into your extra payments or taking on new debt before the old is cleared.`
                } else if (months <= 84) {
                  tier = 'long'
                  tierMessage = `Your debt-free date is ${years} year${years > 1 ? 's' : ''} away. The ${strategy === 'avalanche' ? 'avalanche (highest interest first)' : 'snowball (smallest balance first)'} strategy you chose is ${strategy === 'avalanche' ? 'mathematically optimal — minimizing total interest paid' : 'psychologically powerful — early wins build momentum'}. Staying consistent over this timeline is the primary challenge.`
                } else {
                  tier = 'crushing'
                  tierMessage = `At ${years} years to debt freedom, your debt load is significant. This timeline can be compressed dramatically: every $100/month in extra payments materially shortens the timeline. The first priority is stopping new debt accumulation — paying down $500 while adding $300 in new debt is running in place.`
                }

                const strategyMessage = strategy === 'avalanche'
                  ? `The avalanche method (highest APR first) minimizes total interest paid — mathematically optimal. You save the most money this way. The psychological challenge: your first payoff may take longer than with the snowball method.`
                  : `The snowball method (smallest balance first) creates early wins and psychological momentum. Research shows completion rates are higher with snowball for many people. You pay slightly more interest than avalanche but the motivational benefit is real.`

                let extraMessage: string
                if (extraAmt === 0) {
                  extraMessage = `You have no extra payment allocated. Adding even $100/month to your debt payoff can shorten your timeline by months or years and save significant interest. Try adding an amount above and recalculate to see the impact.`
                } else if (interestSaved > 0) {
                  extraMessage = `Your ${fmt(extraAmt)}/month extra payment saves ${fmt(interestSaved)} in interest. This is one of the highest guaranteed returns available — paying down ${strategy === 'avalanche' ? 'high-interest' : 'your'} debt at your rates is a guaranteed return equal to those rates.`
                } else {
                  extraMessage = `Your extra payment of ${fmt(extraAmt)}/month is accelerating your payoff significantly.`
                }

                let nextActions: string[]
                if (tier === 'urgent') {
                  nextActions = [
                    `Make one extra payment this month — you are close enough that it meaningfully moves the finish line`,
                    `Plan your "debt-free celebration" spending in advance — give yourself a reward that does not undo the progress`,
                    `The day you are debt-free: redirect the full payment amount to savings and investing immediately, before lifestyle adjusts`,
                    `Build a 3-6 month emergency fund with your freed-up cash flow — this prevents the next crisis from creating new debt`
                  ]
                } else if (tier === 'moderate') {
                  nextActions = [
                    `Automate your extra payment so it never competes with discretionary spending`,
                    `Look for one windfall to accelerate: tax refund, bonus, or side income applied directly to debt`,
                    `Review whether balance transfers or personal loans at lower rates could reduce total interest — only if you will not accumulate new balance`,
                    `Build a $1,000 emergency fund now even while paying debt — this prevents small emergencies from derailing the plan`
                  ]
                } else {
                  nextActions = [
                    `Find $200-500/month in additional payments — at ${years} years even small increases compound into years saved`,
                    `Stop all new debt accumulation — new debt while paying off old is the primary reason payoff timelines extend`,
                    `Consider a side income source directed entirely at debt — even $300/month consistently shortens ${years}-year timelines dramatically`,
                    `After payoff redirect every dollar of debt payments to investing — your debt payment habit becomes your wealth-building habit`
                  ]
                }

                const borderColor = tier === 'urgent' ? '#4ade80'
                  : tier === 'moderate' ? '#60a5fa'
                  : tier === 'long' ? '#facc15'
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
                        Now What? Your Debt Payoff Action Plan
                      </h3>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                        Timeline — Debt Free in {years > 0 ? years + 'yr ' : ''}{remainMonths > 0 ? remainMonths + 'mo' : ''}
                      </p>
                      <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        {tierMessage}
                      </p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                        Strategy — {strategy === 'avalanche' ? 'Avalanche (Highest APR First)' : 'Snowball (Smallest Balance First)'}
                      </p>
                      <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        {strategyMessage}
                      </p>
                    </div>
                    <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                      <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                        💡 {extraMessage}
                      </p>
                    </div>
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
                text={`Using ${strategy} strategy I'll be debt free in ${calc.months} months and save ${fmt(calc.interestSaved)} in interest! (Educational only)`}
                url="https://www.dayblip.com/finance/debt-payoff"
                title="Debt Payoff Calculator"
              />
            </>
          )}
          <RelatedTools tools={[
            { emoji: "💳", title: "Minimum Payment Calculator", desc: "The true cost of minimum payments", href: "/tools/minimum-payment" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Calculate your total net worth", href: "/finance/net-worth" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your overall financial health", href: "/tools/financial-life-score" },
            { emoji: "🏖️", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Results are estimates.</p>
          <FAQAccordion items={[
            { q: "What is the difference between avalanche and snowball debt payoff?", a: "Avalanche pays the highest interest rate debt first minimizing total interest paid. Snowball pays the smallest balance first creating psychological wins. Avalanche saves more money mathematically. Snowball works better for people who need motivation from early progress." },
            { q: "How long does it take to pay off credit card debt?", a: "It depends on balance, interest rate, and monthly payment. A $5,000 balance at 20 percent APR paying only the minimum takes over 30 years and costs more than $7,000 in interest. Paying $200 per month clears it in about 32 months." },
            { q: "Should I pay off debt or invest?", a: "If your debt interest rate exceeds expected investment returns, pay off debt first. High-interest credit card debt at 20 percent or more should almost always be paid before investing. Low-interest debt like mortgages at 3 to 5 percent may be worth carrying while investing, especially with employer match available." },
            { q: "What is a debt-to-income ratio?", a: "Debt-to-income ratio is your total monthly debt payments divided by gross monthly income. Lenders typically want DTI below 43 percent for mortgage qualification. Below 36 percent is considered healthy." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
