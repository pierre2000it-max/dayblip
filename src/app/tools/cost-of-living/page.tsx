"use client"
import { useState, useMemo } from "react"
import { cities } from "@/data/cost-of-living"
import ShareButtons from "@/components/ShareButtons"
import AuthorByline from "@/components/AuthorByline"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import FAQAccordion from "@/components/FAQAccordion"

const PAGE_URL = "https://www.dayblip.com/tools/cost-of-living"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}
function fmtIdx(n: number) {
  return n.toFixed(1)
}

const faqItems = [
  {
    question: "How is cost of living calculated?",
    answer: "Cost of living indexes compare the price of a fixed basket of goods and services — housing, groceries, utilities, transportation, and healthcare — against a national average of 100. A city with an index of 150 costs 50% more than the national average overall. The most widely used US index is the C2ER COLI (Council for Community and Economic Research), updated quarterly."
  },
  {
    question: "What salary do I need in a new city?",
    answer: "To maintain your current standard of living after moving, multiply your current salary by the ratio of the new city's COLI to your current city's COLI. For example, if you earn $80,000 in Indianapolis (COLI 90) and move to Austin (COLI 119), you need $80,000 × (119 ÷ 90) = $105,800 in Austin to keep the same purchasing power."
  },
  {
    question: "Which US city has the highest cost of living?",
    answer: "Among major US cities, San Francisco and San Jose consistently rank as the most expensive, with overall cost of living indexes around 210–225 versus the national average of 100. New York City follows at approximately 187. The primary driver in all three cities is housing, which runs 300–400% of the national average."
  },
  {
    question: "Which US city has the lowest cost of living?",
    answer: "Among major metros, El Paso TX, Memphis TN, and Cleveland OH are consistently among the most affordable, with COLI indexes in the low 80s. Housing costs in these cities run 70–75% of the national average. Mid-size Midwest cities like Indianapolis, Columbus, and Kansas City also offer below-average costs at index levels of 88–91."
  },
  {
    question: "Does cost of living include taxes?",
    answer: "The standard C2ER COLI does not include income taxes, which vary significantly by state. When evaluating a move, income tax rates can be as important as day-to-day costs — states like Texas, Florida, and Nevada have no state income tax, while California taxes top earners at 13.3%. Always add state income tax analysis to a full cost-of-living comparison."
  },
  {
    question: "How often is cost of living data updated?",
    answer: "The C2ER Cost of Living Index is updated quarterly. Dayblip uses the most recent Q4 2024 data. Housing values use Zillow's Observed Rent Index and Home Value Index as of December 2024. Income figures use US Census Bureau American Community Survey 5-year estimates (2023). The data will next be refreshed in January 2026."
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cost of Living Comparison Calculator",
  url: PAGE_URL,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  description: "Compare cost of living between 50 US cities. Calculate equivalent salary needed to maintain your standard of living after relocating.",
}

const relatedTools = [
  { emoji: "💼", title: "True Hourly Wage", desc: "What your job actually pays after all costs", href: "/tools/true-hourly-wage" },
  { emoji: "🏠", title: "Rent vs Buy", desc: "Is buying a home the right move for you?", href: "/real-estate/rent-vs-buy" },
  { emoji: "💸", title: "Take-Home Pay", desc: "See your after-tax paycheck by state", href: "/finance/take-home-pay" },
  { emoji: "🧭", title: "Tax Migration Calculator", desc: "How much could you save by moving states?", href: "/tools/tax-migration" },
]

const CATEGORY_WEIGHTS = {
  housing:      0.30,
  groceries:    0.15,
  utilities:    0.10,
  transport:    0.10,
  healthcare:   0.05,
  other:        0.30,
}

export default function CostOfLivingPage() {
  const sortedCities = useMemo(() => [...cities].sort((a, b) => a.name.localeCompare(b.name)), [])

  const [fromSlug, setFromSlug] = useState("new-york-city")
  const [toSlug,   setToSlug]   = useState("austin")
  const [salary,   setSalary]   = useState("100000")

  const fromCity = cities.find(c => c.slug === fromSlug) ?? cities[0]
  const toCity   = cities.find(c => c.slug === toSlug)   ?? cities[3]

  const salaryNum = parseFloat(salary.replace(/,/g, "")) || 0
  const ratio     = toCity.coliIndex / fromCity.coliIndex
  const equivSalary = Math.round(salaryNum * ratio)
  const diff       = equivSalary - salaryNum
  const pctChange  = ((ratio - 1) * 100)
  const moreOrLess = pctChange >= 0 ? "more" : "less"

  const categories = [
    { label: "Housing",       from: fromCity.housingIndex,      to: toCity.housingIndex,      weight: CATEGORY_WEIGHTS.housing },
    { label: "Groceries",     from: fromCity.groceriesIndex,    to: toCity.groceriesIndex,    weight: CATEGORY_WEIGHTS.groceries },
    { label: "Utilities",     from: fromCity.utilitiesIndex,    to: toCity.utilitiesIndex,    weight: CATEGORY_WEIGHTS.utilities },
    { label: "Transportation",from: fromCity.transportIndex,    to: toCity.transportIndex,    weight: CATEGORY_WEIGHTS.transport },
    { label: "Healthcare",    from: fromCity.healthcareIndex,   to: toCity.healthcareIndex,   weight: CATEGORY_WEIGHTS.healthcare },
  ]

  const shareText = salaryNum > 0
    ? `I calculated that a ${fmt(salaryNum)} salary in ${fromCity.name} is equivalent to ${fmt(equivSalary)} in ${toCity.name}. ${toCity.name} costs ${Math.abs(pctChange).toFixed(0)}% ${moreOrLess}:`
    : `Compare cost of living between ${fromCity.name} and ${toCity.name} — free calculator:`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-6xl">🏙️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Cost of Living Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">Compare 50 US cities — find the salary you need to maintain your lifestyle</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Cost of Living" },
          ]} />

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">
              To find the equivalent salary in a new city, multiply your current salary by the ratio of the new city&apos;s cost-of-living index to your current city&apos;s index.
              A $100,000 salary in Indianapolis (COLI 90) equals $132,000 in New York City (COLI 187) in purchasing power.
              Housing is the biggest variable — it ranges from 70% of the national average in El Paso to 435% in San Francisco.
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Calculator */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-6">
            <h2 className="text-xl font-bold text-white">Compare Cities</h2>

            {/* City selectors */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Current city</label>
                <select
                  value={fromSlug}
                  onChange={e => setFromSlug(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
                >
                  {sortedCities.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Destination city</label>
                <select
                  value={toSlug}
                  onChange={e => setToSlug(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
                >
                  {sortedCities.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary input */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Your current salary (optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a8b3]">$</span>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="100000"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] py-3 pl-8 pr-4 text-white focus:border-[#e94560] focus:outline-none"
                />
              </div>
            </div>

            {/* Result */}
            <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#0d1b2a] p-6 text-center">
              <p className="text-sm text-[#a8a8b3] uppercase tracking-wide mb-1">Equivalent salary in {toCity.name}</p>
              <div className="text-5xl font-black tabular-nums" style={{ color: pctChange >= 0 ? "#ff6b6b" : "#4ade80" }}>
                {fmt(equivSalary)}
              </div>
              {salaryNum > 0 && (
                <p className="text-[#a8a8b3] text-sm mt-2">
                  {Math.abs(pctChange).toFixed(1)}% {moreOrLess} than {fmt(salaryNum)} — a difference of{" "}
                  <span style={{ color: diff >= 0 ? "#ff6b6b" : "#4ade80" }}>{diff >= 0 ? "+" : ""}{fmt(diff)}</span>/year
                </p>
              )}
              <p className="text-[#a8a8b3] text-xs mt-3">
                COLI: {fromCity.name} {fmtIdx(fromCity.coliIndex)} → {toCity.name} {fmtIdx(toCity.coliIndex)} (national avg = 100)
              </p>
            </div>
          </div>

          {/* City snapshot cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[fromCity, toCity].map((city, i) => (
              <div key={city.slug} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                <h3 className="font-bold text-white text-lg">{city.name}, {city.state}</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Overall COLI", value: fmtIdx(city.coliIndex) + " / 100" },
                    { label: "Median 1BR rent", value: fmt(city.medRent1br) + "/mo" },
                    { label: "Median home price", value: fmt(city.medHomePrice) },
                    { label: "Median household income", value: fmt(city.medHouseholdIncome) + "/yr" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-[#a8a8b3]">{row.label}</span>
                      <span className="font-semibold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
                {i === 0 && (
                  <div className="pt-1 text-xs text-[#a8a8b3]">Your current city</div>
                )}
                {i === 1 && (
                  <div className="pt-1 text-xs text-[#a8a8b3]">Your destination</div>
                )}
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Category Breakdown</h2>
            <div className="space-y-4">
              {categories.map(cat => {
                const catRatio = cat.to / cat.from
                const catPct   = (catRatio - 1) * 100
                const isHigher = catPct >= 0
                return (
                  <div key={cat.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-semibold">{cat.label}</span>
                      <span style={{ color: isHigher ? "#ff6b6b" : "#4ade80" }}>
                        {isHigher ? "+" : ""}{catPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a8a8b3]">
                      <span className="w-24 shrink-0">{fromCity.name.split(" ")[0]}: {fmtIdx(cat.from)}</span>
                      <div className="flex-1 h-2 rounded bg-[#0f3460] overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${Math.min(100, (Math.min(cat.from, cat.to) / Math.max(cat.from, cat.to)) * 100)}%`,
                            background: "#4FC3F7",
                          }}
                        />
                      </div>
                      <span className="w-24 shrink-0 text-right">{toCity.name.split(" ")[0]}: {fmtIdx(cat.to)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-[#a8a8b3]">
              All indexes: national average = 100. Housing weighted 30%, groceries 15%, utilities 10%, transport 10%, healthcare 5%.
            </p>
          </div>

          {/* Cost of Living Index table (top 10 by COLI) */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Most & Least Expensive US Cities</h2>
            <div className="space-y-1">
              {[
                { label: "Most expensive", list: [...cities].sort((a, b) => b.coliIndex - a.coliIndex).slice(0, 5) },
                { label: "Most affordable", list: [...cities].sort((a, b) => a.coliIndex - b.coliIndex).slice(0, 5) },
              ].map(group => (
                <div key={group.label} className="mb-4">
                  <h3 className="text-sm font-semibold text-[#a8a8b3] uppercase tracking-wider mb-2">{group.label}</h3>
                  {group.list.map((city, rank) => (
                    <div key={city.slug} className="flex items-center justify-between rounded-lg bg-[#16213e] px-4 py-2 mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#a8a8b3] w-4">{rank + 1}.</span>
                        <span className="text-white text-sm">{city.name}, {city.state}</span>
                      </div>
                      <span className="font-bold tabular-nums" style={{ color: city.coliIndex > 110 ? "#ff6b6b" : "#4ade80" }}>
                        {fmtIdx(city.coliIndex)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={shareText}
            url={PAGE_URL}
            title="Cost of Living Comparison Calculator — Dayblip"
          />

          <div>
            <MethodologyNote text="Cost of living indexes sourced from the C2ER (Council for Community and Economic Research) Cost of Living Index, Q4 2024. National average = 100. Overall index is a weighted composite of housing (30%), groceries (15%), utilities (10%), transportation (10%), healthcare (5%), and miscellaneous goods and services (30%). Median rent from Zillow Observed Rent Index, December 2024. Median home values from Zillow Home Value Index, December 2024. Median household income from US Census Bureau American Community Survey 5-year estimates (2023). Salary equivalence formula: Equivalent Salary = Current Salary × (Destination COLI ÷ Origin COLI)." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: C2ER Cost of Living Index Q4 2024 (coli.org) · Zillow Research (zillow.com/research) · US Census Bureau ACS 2023 (census.gov).
            Cost of living data is updated quarterly. Tax burden not included — consult a tax professional for state income tax comparisons.
          </p>
        </div>
      </section>
    </div>
  )
}
