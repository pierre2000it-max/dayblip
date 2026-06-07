"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const homeData: Record<number, { price: number; rate: number; medianIncome: number }> = {
  1970: { price: 23450, rate: 8.45, medianIncome: 9870 },
  1975: { price: 39000, rate: 9.05, medianIncome: 13720 },
  1980: { price: 76400, rate: 13.74, medianIncome: 21020 },
  1985: { price: 100800, rate: 12.43, medianIncome: 27430 },
  1990: { price: 149800, rate: 10.13, medianIncome: 35050 },
  1995: { price: 158700, rate: 7.93, medianIncome: 40610 },
  2000: { price: 244900, rate: 8.05, medianIncome: 50890 },
  2005: { price: 297000, rate: 5.87, medianIncome: 56200 },
  2010: { price: 272900, rate: 4.69, medianIncome: 54000 },
  2015: { price: 289200, rate: 3.85, medianIncome: 58700 },
  2020: { price: 407700, rate: 3.11, medianIncome: 67500 },
  2024: { price: 420000, rate: 6.87, medianIncome: 78000 },
}
const YEARS = Object.keys(homeData).map(Number).sort((a, b) => a - b)

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function monthlyPayment(price: number, rate: number): number {
  const P = price * 0.8
  const r = rate / 12 / 100
  const n = 360
  return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

interface Row { year: number; price: number; rate: number; monthly: number; pctMedian: number; pctUser: number; status: string }
interface Result {
  rows: Row[]; income: number
  mostAffordableYear: number; mostAffordablePct: number
  leastAffordableYear: number; leastAffordablePct: number
  todayPct: number
  income1990Needed: number; incomeTodayNeeded: number; incomeIncreasePct: number
}

function statusFor(pct: number): string {
  if (pct < 28) return "✅ Comfortable"
  if (pct <= 36) return "⚠️ Stretched"
  return "❌ Unaffordable"
}

export default function MortgageByYearPage() {
  const [income, setIncome] = useState("75000")
  const [result, setResult] = useState<Result | null>(null)

  function compute(userIncome = parseFloat(income) || 0): Result {
    const rows: Row[] = YEARS.map(year => {
      const d = homeData[year]
      const monthly = monthlyPayment(d.price, d.rate)
      const annualPmt = monthly * 12
      const pctMedian = (annualPmt / d.medianIncome) * 100
      const pctUser = userIncome > 0 ? (annualPmt / userIncome) * 100 : 0
      return { year, price: d.price, rate: d.rate, monthly, pctMedian, pctUser, status: statusFor(pctMedian) }
    })
    const sortedByMedian = [...rows].sort((a, b) => a.pctMedian - b.pctMedian)
    const most = sortedByMedian[0]
    const least = sortedByMedian[sortedByMedian.length - 1]
    const today = rows[rows.length - 1]
    const income1990Needed = (monthlyPayment(homeData[1990].price, homeData[1990].rate) * 12) / 0.28
    const incomeTodayNeeded = (monthlyPayment(homeData[2024].price, homeData[2024].rate) * 12) / 0.28
    return {
      rows, income: userIncome,
      mostAffordableYear: most.year, mostAffordablePct: most.pctMedian,
      leastAffordableYear: least.year, leastAffordablePct: least.pctMedian,
      todayPct: today.pctUser,
      income1990Needed, incomeTodayNeeded,
      incomeIncreasePct: ((incomeTodayNeeded - income1990Needed) / income1990Needed) * 100,
    }
  }

  function runCalc(push = true) {
    const res = compute()
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?income=${parseFloat(income) || 0}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("income")) {
      setIncome(p.get("income")!)
      setResult(compute(Number(p.get("income"))))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/mortgage-by-year?income=${result.income}` : ""
  const shareText = result ? `In 1990 you needed ${fmt(result.income1990Needed)} income to afford the median home. Today you need ${fmt(result.incomeTodayNeeded)} — ${result.incomeIncreasePct.toFixed(0)}% more!` : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Home Affordability by Year — Could You Afford a Home in 1990?</h1>
          <p className="text-[#a8a8b3]">See how home affordability has changed across the decades</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The median US home price in 1990 was $122,900. At 1990 mortgage rates of 10.1% the monthly payment was $1,085. The median household income in 1990 was $29,943 — making that payment 43% of monthly income. Today the median home costs $420,000 at 7% rate — a monthly payment of $2,796 on median household income of $80,610 which is also 42% of monthly income.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Home affordability measures the relationship between home prices, mortgage rates and household incomes across different historical periods. This calculator shows what it would have cost to buy a median home in any year from 1970 to today and compares that burden to household income at the time — revealing how affordability has changed across generations.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Your annual income</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={income} onChange={e => setIncome(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></div>
            </label>
            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Show Affordability History
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <table className="w-full text-xs md:text-sm">
                  <thead><tr className="text-[#a8a8b3]">
                    <th className="px-2 py-2 text-left">Year</th><th className="px-2 py-2 text-right">Price</th>
                    <th className="px-2 py-2 text-right">Rate</th><th className="px-2 py-2 text-right">Monthly</th>
                    <th className="px-2 py-2 text-right">% Median</th><th className="px-2 py-2 text-right">% Yours</th>
                    <th className="px-2 py-2 text-left">Status</th>
                  </tr></thead>
                  <tbody>
                    {result.rows.map(r => (
                      <tr key={r.year} className="border-t border-[#0f3460] text-white">
                        <td className="px-2 py-1.5">{r.year}</td>
                        <td className="px-2 py-1.5 text-right">{fmt(r.price)}</td>
                        <td className="px-2 py-1.5 text-right">{r.rate}%</td>
                        <td className="px-2 py-1.5 text-right">{fmt(r.monthly)}</td>
                        <td className="px-2 py-1.5 text-right">{r.pctMedian.toFixed(0)}%</td>
                        <td className="px-2 py-1.5 text-right">{r.pctUser.toFixed(0)}%</td>
                        <td className="px-2 py-1.5">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-sm text-white">
                <p>The most affordable year to buy a home was <span className="font-bold text-[#4ade80]">{result.mostAffordableYear}</span> when housing cost only {result.mostAffordablePct.toFixed(0)}% of median income.</p>
                <p className="mt-2">On your income of {fmt(result.income)}: most affordable year {result.mostAffordableYear}, least affordable {result.leastAffordableYear}. Today: <span className="font-bold text-[#F9A825]">{result.todayPct.toFixed(0)}%</span> of your income.</p>
              </div>

              <div className="rounded-xl border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-[#FF6B6B]">Shocking stat</h3>
                <p>In 1990 you needed <span className="font-bold">{fmt(result.income1990Needed)}</span>/year income to comfortably buy the median home. Today you need <span className="font-bold">{fmt(result.incomeTodayNeeded)}</span>/year. That is {result.incomeIncreasePct.toFixed(0)}% more income required.</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <p>To comfortably afford today&apos;s median home ({fmt(420000)}) at 6.87%: recommended income <span className="font-bold text-[#F9A825]">{fmt(result.incomeTodayNeeded)}</span>/year (based on 28% of income rule).</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Home Affordability by Year" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
