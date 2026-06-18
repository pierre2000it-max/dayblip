"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

const CPI: Record<number, number> = {
  1913: 9.9, 1920: 20.0, 1930: 16.7, 1940: 14.0, 1950: 24.1,
  1960: 29.6, 1970: 38.8, 1975: 53.8, 1980: 82.4, 1985: 107.6,
  1990: 130.7, 1995: 152.4, 2000: 172.2, 2005: 195.3, 2010: 218.1,
  2015: 237.0, 2020: 258.8, 2024: 314.0, 2026: 325.0,
  // Projections at ~2% annual inflation — replace with BLS actuals each January
  2027: 331.5, 2028: 338.1, 2029: 344.9, 2030: 351.8,
}

const YEARS = Object.keys(CPI).map(Number).sort((a, b) => a - b)

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function InflationPage() {
  const currentYear = new Date().getFullYear()
  const [mode, setMode] = useState<"past" | "present">("past")
  const [amount, setAmount] = useState("100")
  const [fromYear, setFromYear] = useState(1980)
  const [toYear, setToYear] = useState(1980)

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("amount")) setAmount(p.get("amount")!)
    if (p.get("fromyear")) setFromYear(Number(p.get("fromyear")))
    if (p.get("mode")) setMode(p.get("mode") as "past" | "present")
  }, [])

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0
    const cpiNow = CPI[currentYear] ?? CPI[2026]
    if (mode === "past") {
      const adjusted = (a * cpiNow) / CPI[fromYear]
      const pct = ((adjusted - a) / a * 100).toFixed(1)
      return { value: adjusted, label: `$${a} in ${fromYear} = ${fmt(adjusted)} in ${currentYear}`, pct: `+${pct}% purchasing power change` }
    } else {
      const adjusted = (a * CPI[toYear]) / cpiNow
      const pct = ((adjusted - a) / a * 100).toFixed(1)
      return { value: adjusted, label: `$${a} today = ${fmt(adjusted)} in ${toYear}`, pct: `${pct}% purchasing power change` }
    }
  }, [mode, amount, fromYear, toYear, currentYear])

  const buyingPowerRows = [1913, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map(yr => ({
    year: yr,
    value: (100 * (CPI[currentYear] ?? CPI[2026])) / CPI[yr],
  }))

  const items = [
    { item: "Gallon of Gas", then: "$0.29 (1970)", now: "$3.50", change: "+1,107%" },
    { item: "Movie Ticket", then: "$1.55 (1970)", now: "$15.00", change: "+868%" },
    { item: "New Car", then: "$3,500 (1970)", now: "$48,000", change: "+1,271%" },
    { item: "New Home", then: "$23,450 (1970)", now: "$420,000", change: "+1,691%" },
    { item: "Loaf of Bread", then: "$0.25 (1970)", now: "$4.50", change: "+1,700%" },
  ]

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Inflation Calculator",
          "See how inflation changes the purchasing power of money over time.",
          "https://www.dayblip.com/finance/inflation",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How do I calculate what money was worth in the past?", answer: "Choose a dollar amount and a starting year, and the calculator multiplies it by the ratio of the current Consumer Price Index to the index in that year. This shows the equivalent value in today's dollars and the change in purchasing power." },
          { question: "What is purchasing power?", answer: "Purchasing power is how much you can buy with a given amount of money. As prices rise with inflation, the same dollar buys less over time. This calculator shows how much purchasing power has been gained or lost between two years." },
          { question: "What data does this inflation calculator use?", answer: "It uses Consumer Price Index figures based on data from the US Bureau of Labor Statistics for benchmark years from 1913 through the present, allowing comparisons across more than a century." },
          { question: "Can I convert today's dollars back to a past year?", answer: "Yes. Switch to the Today to Past mode, enter an amount, and select a target year to see what today's money would have been equivalent to in that earlier year." },
        ]),
        howToSchema(
          "Inflation Calculator — How To Use",
          "Compare the purchasing power of money across years using historical CPI data.",
          [
            "Choose Past to Today or Today to Past mode.",
            "Enter the dollar amount.",
            "Select the year to compare against.",
            "Review the equivalent value and the change in purchasing power.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Inflation Calculator", url: "https://www.dayblip.com/finance/inflation" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Inflation Calculator — How Much Has Money Lost Its Value?</h1>
          <p className="text-[#a8a8b3]">See how purchasing power has changed over time</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">$100 in 1990 equals approximately $236 today due to inflation. The US dollar has lost 57% of its purchasing power since 1990. Average annual inflation in the US is 3.1% over the past 30 years. At 3% inflation money loses half its purchasing power every 23 years.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Inflation is the rate at which the general price of goods and services rises over time, reducing purchasing power. This calculator shows how much a dollar amount from any past year is worth today and how much today&apos;s dollars will be worth in the future at different inflation rates.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Inflation Calculator" }]} />
          <div className="flex gap-2">
            {([["past", "📅 Past → Today"], ["present", "🕐 Today → Past"]] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-colors ${mode === m ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Amount ($)</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            {mode === "past" ? (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">From Year</span>
                <select value={fromYear} onChange={e => setFromYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            ) : (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Equivalent in Year</span>
                <select value={toYear} onChange={e => setToYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            )}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-4 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(result.value)}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">{result.pct}</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <p className="font-semibold text-white text-center">{result.label}</p>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💵 What was $100 worth? (in {currentYear} dollars)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Year</th>
                  <th className="py-2 text-right text-[#a8a8b3]">$100 then = today</th>
                </tr></thead>
                <tbody>{buyingPowerRows.map(r => (
                  <tr key={r.year} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{r.year}</td>
                    <td className="py-2 text-right text-[#F9A825]">{fmt(r.value)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🛒 Common Items — Then vs Now</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Item</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Then</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Now</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Change</th>
                </tr></thead>
                <tbody>{items.map(r => (
                  <tr key={r.item} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{r.item}</td>
                    <td className="py-2 text-center text-[#a8a8b3]">{r.then}</td>
                    <td className="py-2 text-center text-white">{r.now}</td>
                    <td className="py-2 text-right text-[#e94560]">{r.change}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <ShareButtons
            text={`$${amount} in ${fromYear} = ${fmt(result.value)} today! That's ${result.pct} inflation. (Educational only)`}
            url={`https://www.dayblip.com/finance/inflation?amount=${amount}&fromyear=${fromYear}&mode=${mode}`}
            title="Inflation Calculator"
          />
          <RelatedTools tools={[
            { emoji: "📈", title: "Compound Interest", desc: "Grow wealth over time", href: "/finance/compound-interest" },
            { emoji: "💡", title: "What If I Invested?", desc: "See investment growth", href: "/finance/what-if-i-invested" },
            { emoji: "🏖️", title: "Retirement Savings", desc: "Plan for retirement", href: "/finance/retirement-savings" },
            { emoji: "🏠", title: "Cost of Living", desc: "Compare living costs", href: "/finance/cost-of-living" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">CPI data based on US Bureau of Labor Statistics. For educational purposes only.</p>
          <FAQAccordion items={[
            { q: "What is inflation?", a: "Inflation is the rate at which the general price level of goods and services rises over time, reducing purchasing power. When inflation is 3 percent per year, something that costs $100 today will cost $103 next year." },
            { q: "What data source is used to calculate inflation?", a: "Inflation calculations use the Consumer Price Index published by the US Bureau of Labor Statistics. The CPI tracks the average price change over time for a fixed basket of consumer goods and services." },
            { q: "What has average US inflation been historically?", a: "The US has averaged approximately 3.1 percent annual inflation since 1926. The 2021 to 2023 period saw elevated inflation peaking above 9 percent in mid-2022 before declining. Long-term financial planning typically assumes 2 to 3 percent annual inflation." },
            { q: "How does inflation affect savings?", a: "Inflation erodes purchasing power. $100,000 in savings earning 1 percent interest while inflation runs at 3 percent loses roughly 2 percent of real value per year. After 20 years at that gap, the real purchasing power drops to about $67,000 in today's dollars." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
