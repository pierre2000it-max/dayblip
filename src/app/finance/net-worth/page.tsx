"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function NetWorthPage() {
  const [assets, setAssets] = useState({ checking: "", investments: "", retirement: "", home: "", vehicle: "", other: "" })
  const [liabilities, setLiabilities] = useState({ mortgage: "", carLoan: "", creditCard: "", studentLoans: "", other: "" })
  const [age, setAge] = useState("")

  const setA = (k: keyof typeof assets) => (e: React.ChangeEvent<HTMLInputElement>) => setAssets(a => ({ ...a, [k]: e.target.value }))
  const setL = (k: keyof typeof liabilities) => (e: React.ChangeEvent<HTMLInputElement>) => setLiabilities(l => ({ ...l, [k]: e.target.value }))

  const calc = useMemo(() => {
    const totalAssets = Object.values(assets).reduce((s, v) => s + (parseFloat(v) || 0), 0)
    const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + (parseFloat(v) || 0), 0)
    const netWorth = totalAssets - totalLiabilities
    const a = parseInt(age) || 0
    const benchmarks = [
      { range: "25–34", median: 14000 },
      { range: "35–44", median: 91000 },
      { range: "45–54", median: 168000 },
      { range: "55–64", median: 213000 },
      { range: "65+", median: 266000 },
    ]
    const myBenchmark = a >= 65 ? benchmarks[4] : a >= 55 ? benchmarks[3] : a >= 45 ? benchmarks[2] : a >= 35 ? benchmarks[1] : a >= 25 ? benchmarks[0] : null
    const pctOfMedian = myBenchmark ? ((netWorth / myBenchmark.median) * 100).toFixed(0) : null
    return { totalAssets, totalLiabilities, netWorth, benchmarks, myBenchmark, pctOfMedian }
  }, [assets, liabilities, age])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Net Worth Calculator",
          "Calculate your total net worth by subtracting liabilities from assets.",
          "https://www.dayblip.com/finance/net-worth",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How is net worth calculated?", answer: "Net worth equals total assets minus total liabilities. The calculator adds up your cash, investments, retirement accounts, home and vehicle value and other assets, then subtracts your mortgage, car loan, credit card debt, student loans and other debts." },
          { question: "Can net worth be negative?", answer: "Yes. If your debts exceed your assets — common for recent graduates or new homeowners — your net worth is negative. The figure turns red in the calculator to signal this." },
          { question: "What assets should I include?", answer: "Include everything you own that has resale value: bank balances, brokerage and retirement accounts, the market value of your home and vehicles, and other valuables. Use current market values, not purchase prices." },
          { question: "How do I compare my net worth to others my age?", answer: "Enter your age and the calculator shows the U.S. median net worth for your age band from the Federal Reserve Survey of Consumer Finances, plus what percentage of that median you have reached." },
        ]),
        howToSchema(
          "Net Worth Calculator — How To Use",
          "Find your total net worth and compare it to age benchmarks.",
          [
            "Enter the value of each asset: checking and savings, investments, retirement accounts, home, vehicle and other assets.",
            "Enter each liability: mortgage, car loan, credit card debt, student loans and other debts.",
            "Read your net worth, which updates automatically as total assets minus total liabilities.",
            "Enter your age to compare against the median net worth for your age range.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Net Worth Calculator", url: "https://www.dayblip.com/finance/net-worth" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Net Worth Calculator — What Are You Really Worth?</h1>
          <p className="text-[#a8a8b3]">Know exactly where you stand financially</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Net worth equals total assets minus total liabilities. The median US net worth is approximately $192,700. By age group: under 35 median is $39,000, ages 35–44 is $135,000, ages 45–54 is $247,000, ages 55–64 is $364,000. Home equity is the largest asset for most Americans, typically representing 40–60% of total net worth.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Net worth is the most comprehensive measure of financial health. It includes all assets — cash, investments, real estate and personal property — minus all debts including mortgages, car loans, student loans and credit card balances. Tracking net worth over time shows whether your financial position is improving or deteriorating.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Net Worth Calculator" }]} />
          <div className="rounded-xl border border-green-500/20 bg-[#1a1a2e] p-6">
            <h2 className="mb-4 font-bold text-white text-lg">💚 Assets</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Checking & Savings", k: "checking" as const },
                { label: "Investments", k: "investments" as const },
                { label: "Retirement Accounts", k: "retirement" as const },
                { label: "Home Value", k: "home" as const },
                { label: "Vehicle Value", k: "vehicle" as const },
                { label: "Other Assets", k: "other" as const },
              ].map(f => (
                <label key={f.k} className="flex flex-col gap-1">
                  <span className="text-sm text-[#a8a8b3]">{f.label} ($)</span>
                  <input type="number" value={assets[f.k]} onChange={setA(f.k)} placeholder="0" className={inp} />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-[#1a1a2e] p-6">
            <h2 className="mb-4 font-bold text-white text-lg">🔴 Liabilities</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Mortgage Balance", k: "mortgage" as const },
                { label: "Car Loan", k: "carLoan" as const },
                { label: "Credit Card Debt", k: "creditCard" as const },
                { label: "Student Loans", k: "studentLoans" as const },
                { label: "Other Debts", k: "other" as const },
              ].map(f => (
                <label key={f.k} className="flex flex-col gap-1">
                  <span className="text-sm text-[#a8a8b3]">{f.label} ($)</span>
                  <input type="number" value={liabilities[f.k]} onChange={setL(f.k)} placeholder="0" className={inp} />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">Your Net Worth</div>
            <div className={`text-5xl font-black ${calc.netWorth >= 0 ? "text-[#F9A825]" : "text-[#e94560]"}`}>{fmt(calc.netWorth)}</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><div className="font-bold text-green-400">{fmt(calc.totalAssets)}</div><div className="text-[#a8a8b3]">Total Assets</div></div>
              <div><div className="font-bold text-[#e94560]">{fmt(calc.totalLiabilities)}</div><div className="text-[#a8a8b3]">Total Liabilities</div></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-bold text-white">📊 How Do You Compare?</h2>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Your age" className="ml-auto rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none w-28" />
            </div>
            {calc.myBenchmark && <p className="text-[#a8a8b3] text-sm mb-4">Age {calc.myBenchmark.range} median: {fmt(calc.myBenchmark.median)} — you are at <span className={`font-bold ${parseFloat(calc.pctOfMedian!) >= 100 ? "text-green-400" : "text-[#e94560]"}`}>{calc.pctOfMedian}%</span> of median</p>}
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Age Range</th>
                <th className="py-2 text-right text-[#a8a8b3]">Median Net Worth</th>
              </tr></thead>
              <tbody>{calc.benchmarks.map(b => (
                <tr key={b.range} className={`border-b border-[#0f3460]/50 ${calc.myBenchmark?.range === b.range ? "bg-[#e94560]/10" : ""}`}>
                  <td className="py-2 text-white">{b.range}</td>
                  <td className="py-2 text-right text-[#F9A825]">{fmt(b.median)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const nw = calc.netWorth
            const assets = calc.totalAssets
            const liabilities = calc.totalLiabilities
            const ageNum = parseFloat(age) || 0
            const pctOfMedian = calc.pctOfMedian ? parseFloat(calc.pctOfMedian) : null
            const hasAge = ageNum > 0
            const hasData = assets > 0 || liabilities > 0

            if (!hasData) {
              return (
                <div style={{
                  background: '#0d1b2a',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  margin: '32px 0 24px',
                  borderLeft: '4px solid #60a5fa'
                }}>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    Enter your assets and liabilities above to see your personalized net worth action plan.
                  </p>
                </div>
              )
            }

            let tier: 'negative' | 'low' | 'building' | 'established' | 'strong'
            let tierMessage: string

            if (nw < 0) {
              tier = 'negative'
              tierMessage = `Your net worth is -${fmt(Math.abs(nw))} — your liabilities exceed your assets. This is common in your 20s and early 30s (student loans, car loans, mortgages) and is not a crisis if trending in the right direction. The priority: stop the gap from widening. Do not add new liabilities and start directing any cash flow surplus toward the highest-rate debt.`
            } else if (nw < 50000) {
              tier = 'low'
              tierMessage = `Your net worth is ${fmt(nw)} — you are in positive territory and building. The US median net worth is $97,000 (Federal Reserve SCF 2022). The fastest path to closing that gap: eliminate high-interest debt, maximize employer retirement match, and let compound interest work. Every dollar of debt eliminated and invested doubles the net worth impact.`
            } else if (nw < 250000) {
              tier = 'building'
              tierMessage = `Your net worth of ${fmt(nw)} puts you in building territory — above early stages but below the inflection point where compounding significantly accelerates. The primary lever now: increase investable assets relative to depreciating assets (cars, consumer goods). Real estate and retirement accounts at this level are the dominant drivers.`
            } else if (nw < 1000000) {
              tier = 'established'
              tierMessage = `Your net worth of ${fmt(nw)} is established. You are above the US median and building toward financial independence. At this level asset allocation, tax efficiency, and protecting against sequence-of-returns risk become increasingly important. The biggest risk: lifestyle inflation that consumes income that could accelerate the next milestone.`
            } else {
              tier = 'strong'
              tierMessage = `Your net worth of ${fmt(nw)} is strong. At this level you are likely approaching or have reached financial independence territory. Estate planning, asset protection, tax-efficient withdrawal strategies, and legacy planning become high-priority. A fee-only fiduciary advisor generates positive ROI at this net worth level.`
            }

            let benchmarkMessage: string
            if (!hasAge) {
              benchmarkMessage = `Enter your age above to see how your net worth compares to the median for your age group — from Federal Reserve Survey of Consumer Finances data.`
            } else if (pctOfMedian === null) {
              benchmarkMessage = `Net worth benchmarks are available for ages 25+. At your stage the most important metric is the direction of your net worth — is it increasing each month?`
            } else if (pctOfMedian < 50) {
              benchmarkMessage = `Your net worth is ${calc.pctOfMedian}% of the median for your age group — below the midpoint for your peers. This is a common starting position and closes quickly with consistent investing. The gap between the bottom and median net worth for most age groups can be closed in 5-10 years of disciplined saving.`
            } else if (pctOfMedian < 150) {
              benchmarkMessage = `Your net worth is ${calc.pctOfMedian}% of the median for your age group — near or at the median. You are on pace with your peers. The next milestone: reach 2× the median for your age group by increasing savings rate and investment returns.`
            } else {
              benchmarkMessage = `Your net worth is ${calc.pctOfMedian}% of the median for your age group — well above your peers. At this level peer comparison becomes less relevant than your own FI number. Use the Dayblip FI Date calculator to find your personal financial independence timeline.`
            }

            const liabilityRatio = assets > 0 ? Math.round((liabilities / assets) * 100) : 0

            let nextActions: string[]
            if (tier === 'negative') {
              nextActions = [
                `List all liabilities by interest rate — target highest rate first (avalanche) or smallest balance first (snowball) based on your psychology`,
                `Find the minimum to contribute to 401k to capture full employer match — even while in negative net worth this is typically worth it`,
                `Track net worth monthly — negative net worth trending toward zero is meaningful progress even if the number is still negative`,
                `Stop taking on new liabilities — every new loan while net worth is negative compounds the hole`
              ]
            } else if (tier === 'low' || tier === 'building') {
              nextActions = [
                `Identify your single largest liability — if it is high-interest debt, aggressive payoff is often the highest guaranteed return available`,
                `Maximize retirement account contributions — 401k and IRA assets count toward net worth and grow tax-advantaged`,
                `Calculate your net worth monthly or quarterly — tracking creates accountability and reveals the trend`,
                `Use the Dayblip FI Date calculator to find how your current net worth trajectory maps to financial independence`
              ]
            } else if (tier === 'established') {
              nextActions = [
                `Review asset allocation — at ${fmt(nw)} net worth, a 10% market correction is a large dollar amount. Ensure allocation matches risk tolerance and timeline`,
                `Audit tax efficiency — are high-growth assets in tax-advantaged accounts and bonds in taxable accounts?`,
                `Model your FI number — at this net worth you may be closer to financial independence than you think`,
                `Ensure estate basics are in place: will, beneficiary designations, and power of attorney`
              ]
            } else {
              nextActions = [
                `Consult a fee-only fiduciary CFP — at ${fmt(nw)} net worth professional tax and estate planning generates clear positive ROI`,
                `Review withdrawal sequencing for retirement — order of accounts (taxable, traditional, Roth) significantly affects tax liability`,
                `Ensure asset protection is in place — liability insurance, umbrella policy, and appropriate entity structure if self-employed`,
                `Consider Roth conversion ladder if in a lower-income year — converting traditional IRA to Roth at current tax rates`
              ]
            }

            const borderColor = tier === 'negative' ? '#e94560'
              : tier === 'low' ? '#facc15'
              : tier === 'building' ? '#60a5fa'
              : tier === 'established' ? '#4ade80'
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
                    Now What? Your Net Worth Action Plan
                  </h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Net Worth — {nw >= 0 ? fmt(nw) : '-' + fmt(Math.abs(nw))}
                    {liabilityRatio > 0 ? ` (${liabilityRatio}% Liability Ratio)` : ''}
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {tierMessage}
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    {hasAge ? `Age Benchmark — ${calc.pctOfMedian ?? '—'}% of Median for Age ${ageNum}` : 'Age Benchmark — Enter Age to Compare'}
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {benchmarkMessage}
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
            text="Free net worth calculator with Federal Reserve age benchmarks. (Educational only)"
            url="https://www.dayblip.com/finance/net-worth"
            title="Net Worth Calculator"
          />
          <RelatedTools tools={[
            { emoji: "🏦", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
            { emoji: "💳", title: "Debt Payoff Calculator", desc: "Pay off debt faster", href: "/finance/debt-payoff" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "💰", title: "Retirement Savings", desc: "Are you on track?", href: "/finance/retirement-savings" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">Source: Federal Reserve Survey of Consumer Finances. For educational purposes only. Medians vary by location, occupation and many other factors.</p>
          <FAQAccordion items={[
            { q: "What is net worth?", a: "Net worth is the total value of everything you own minus everything you owe. Assets include cash, investments, real estate, and personal property. Liabilities include mortgage balance, car loans, student loans, and credit card debt." },
            { q: "What is the average net worth by age in the US?", a: "According to Federal Reserve Survey of Consumer Finances data, median net worth by age is approximately: under 35 — $39,000; 35 to 44 — $135,000; 45 to 54 — $247,000; 55 to 64 — $365,000; 65 to 74 — $410,000. Mean values are significantly higher due to wealth concentration at the top." },
            { q: "Is home equity counted in net worth?", a: "Yes. Home equity — the market value of your home minus your remaining mortgage balance — is a major component of net worth for most American households." },
            { q: "How often should I calculate my net worth?", a: "Tracking net worth quarterly or annually gives a useful picture of financial progress. Monthly tracking can feel noisy due to market fluctuations in investment accounts." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
