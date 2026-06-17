"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import AuthorByline from "@/components/AuthorByline"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import FAQAccordion from "@/components/FAQAccordion"
import SchemaMarkup from "@/components/SchemaMarkup"
import Link from "next/link"

const PAGE_URL = "https://www.dayblip.com/world-counters/co2-emissions"

const faqItems = [
  {
    question: "How much CO2 does the US emit per day?",
    answer: "The United States emits approximately 13.4 million metric tons of CO2 per day based on annual EIA data of roughly 4.9 billion metric tons per year. This works out to about 155 metric tons every second, or 9,300 metric tons per minute."
  },
  {
    question: "Is the US the largest CO2 emitter in the world?",
    answer: "The United States is the second largest CO2 emitter globally after China. China emits approximately 11-12 billion metric tons per year while the US emits approximately 4.9 billion. Together the two countries account for roughly 40% of global CO2 emissions."
  },
  {
    question: "What produces the most CO2 in the United States?",
    answer: "The transportation sector is the largest source of US CO2 emissions at approximately 28% of total emissions, followed by the electric power sector at 25%, industry at 23%, commercial and residential buildings at 13%, and agriculture at 11%, according to the US Environmental Protection Agency."
  },
  {
    question: "How much CO2 does the average American produce per year?",
    answer: "The average American produces approximately 14-15 metric tons of CO2 per year — one of the highest per capita rates in the world. The global average is approximately 4.7 metric tons per person per year. European countries average 6-8 metric tons per person."
  },
  {
    question: "Is US CO2 emissions increasing or decreasing?",
    answer: "US CO2 emissions have generally trended downward since peaking around 2007, primarily due to a shift from coal to natural gas and renewable energy in electricity generation. However year-to-year changes vary based on economic activity, weather patterns, and energy prices."
  },
  {
    question: "Where does this CO2 emissions data come from?",
    answer: "This counter uses data from the US Energy Information Administration (EIA), the official US government source for energy and emissions statistics. The EIA publishes annual CO2 emissions data by sector and state. The counter calculates a per-second rate from the most recent annual total available."
  }
]

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  },
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "US CO2 Emissions Live Estimate — Dayblip",
    "description": "Real-time estimate of US CO2 emissions today and this year, calculated from US Energy Information Administration annual emissions data.",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "isAccessibleForFree": true,
    "creditText": "Data from US Energy Information Administration (EIA) — eia.gov"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "US CO2 Emissions Today — Live Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time US CO2 emissions counter based on EIA annual data, updating every second."
  }
]

const relatedTools = [
  { emoji: "🌍", title: "World Counters", desc: "Live global statistics", href: "/world-counters" },
  { emoji: "🌊", title: "Plastic in Ocean", desc: "Live ocean plastic counter", href: "/world-counters/plastic-in-ocean" },
  { emoji: "🌳", title: "Trees Cut Today", desc: "Live deforestation counter", href: "/world-counters/trees-cut-today" },
  { emoji: "💰", title: "US National Debt", desc: "Live US debt clock", href: "/world-counters/us-national-debt" },
]

export default function Co2EmissionsPage() {
  const [annualEmissions, setAnnualEmissions] = useState(4_900_000_000)
  const [dataYear, setDataYear] = useState("2023")
  const [emissionsToday, setEmissionsToday] = useState(0)
  const [emissionsThisYear, setEmissionsThisYear] = useState(0)

  useEffect(() => {
    fetch("/api/eia-co2")
      .then(r => r.json())
      .then(data => {
        if (data.value) {
          setAnnualEmissions(data.value * 1_000_000)
          setDataYear(data.year)
        }
      })
      .catch(() => {/* use fallback */})
  }, [])

  useEffect(() => {
    function tick() {
      const now = new Date()
      const perSecond = annualEmissions / 365 / 24 / 3600

      const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      const secToday = Math.floor((now.getTime() - sod.getTime()) / 1000)

      const jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
      const secThisYear = Math.floor((now.getTime() - jan1.getTime()) / 1000)

      setEmissionsToday(Math.floor(secToday * perSecond))
      setEmissionsThisYear(Math.floor(secThisYear * perSecond))
    }

    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [annualEmissions])

  const shareText = `The US has emitted ${emissionsToday.toLocaleString()} metric tons of CO2 today. See the live counter at Dayblip 🌍`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌫️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">US CO2 Emissions Today</h1>
          <p className="text-[#a8a8b3]">Live counter based on EIA annual data — updates every second</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "US CO2 Emissions Today" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              The United States emits approximately 4.9 billion metric tons of CO2 per year — about 155 metric tons every second. That is roughly 13.4 million metric tons per day, making the US one of the world&apos;s largest carbon emitters. Data from the US Energy Information Administration.
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter — today */}
          <div className="rounded-xl border border-[#4FC3F7]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">Metric Tons of CO2 Emitted Today (US)</p>
            <div className="text-5xl md:text-6xl font-black text-[#4FC3F7] tabular-nums">{emissionsToday.toLocaleString()}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">~155 metric tons per second</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-2xl font-black tabular-nums text-[#4FC3F7]">{emissionsThisYear.toLocaleString()}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Metric tons emitted this year</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">🚗</div>
              <div className="text-2xl font-black tabular-nums text-[#F9A825]">{Math.floor(emissionsToday / 4.6).toLocaleString()}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Equivalent cars driven for a year today</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-2xl font-black tabular-nums text-[#f87171]">4.9B</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Metric tons per year (annual total)</div>
            </div>
          </div>

          <p className="text-xs text-[#a8a8b3]/60 text-center">
            Based on EIA {dataYear} data — updates when new data is released
          </p>

          {/* Sector breakdown */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">US CO2 Emissions by Sector</h2>
            <div className="space-y-3">
              {[
                { sector: "Transportation", pct: 28, color: "#f87171" },
                { sector: "Electric Power", pct: 25, color: "#fbbf24" },
                { sector: "Industry", pct: 23, color: "#4FC3F7" },
                { sector: "Buildings (Commercial & Residential)", pct: 13, color: "#4ade80" },
                { sector: "Agriculture", pct: 11, color: "#a78bfa" },
              ].map(s => (
                <div key={s.sector} className="rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{s.sector}</span>
                    <span className="text-sm font-black tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0f3460]">
                    <div className="h-2 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#a8a8b3]/60 mt-2">Source: US Environmental Protection Agency — epa.gov</p>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={shareText}
            url={PAGE_URL}
            title="US CO2 Emissions Today — Live Counter"
            instagramText={`The US has emitted ${emissionsToday.toLocaleString()} metric tons of CO2 today 🌫️ See the live counter → dayblip.com`}
            tiktokText={`${emissionsToday.toLocaleString()} metric tons of CO2 emitted by the US today 🌫️ Watch the live counter → dayblip.com`}
          />

          <div>
            <MethodologyNote text="US CO2 emissions data is sourced from the US Energy Information Administration (EIA), the official US government agency for energy statistics. The counter calculates a per-second emission rate by dividing the most recent annual total by the number of seconds in a year. The annual figure is fetched from the EIA API and cached for 24 hours. When live data is unavailable the counter uses the most recent known annual figure of approximately 4.9 billion metric tons (EIA 2023). Emissions vary by season and economic conditions — this counter shows a statistical average rate, not a real-time measurement. Source: EIA CO2 Emissions Aggregates dataset — eia.gov" />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: US Energy Information Administration — eia.gov · US Environmental Protection Agency — epa.gov. Figures are statistical estimates based on annual averages and may vary from actual real-time emissions.
          </p>
        </div>
      </section>
    </div>
  )
}
