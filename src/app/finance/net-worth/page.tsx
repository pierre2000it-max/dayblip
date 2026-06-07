"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

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
          <h1 className="mb-3 text-4xl font-bold text-white">Net Worth Calculator</h1>
          <p className="text-[#a8a8b3]">Know exactly where you stand financially</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
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

          <ShareButtons
            text="Free net worth calculator with Federal Reserve age benchmarks. (Educational only)"
            url="https://www.dayblip.com/finance/net-worth"
            title="Net Worth Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Source: Federal Reserve Survey of Consumer Finances. For educational purposes only. Medians vary by location, occupation and many other factors.</p>
        </div>
      </section>
    </div>
  )
}
