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

// Source: Crowther et al., Nature 2015 — ~15 billion trees felled per year
// Trees planted: ~5 billion per year (World Economic Forum / FAO estimates)
const TREES_CUT_PER_YEAR    = 15_000_000_000
const TREES_PLANTED_PER_YEAR = 5_000_000_000
const SECS_YEAR              = 365.25 * 86_400

const TREES_CUT_PER_SEC     = TREES_CUT_PER_YEAR    / SECS_YEAR  // ~475.3
const TREES_PLANTED_PER_SEC = TREES_PLANTED_PER_YEAR / SECS_YEAR  // ~158.4
const NET_LOSS_PER_SEC      = TREES_CUT_PER_SEC - TREES_PLANTED_PER_SEC

const PAGE_URL = "https://www.dayblip.com/world-counters/trees-cut-today"

function fmtWhole(n: number) { return Math.floor(n).toLocaleString() }
function fmtBig(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(3)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`
  return fmtWhole(n)
}

const faqItems = [
  {
    question: "How many trees are cut down every day?",
    answer: "Approximately 41 million trees are cut down every day worldwide, based on annual estimates of 15 billion trees felled per year (Crowther et al., Nature 2015). That works out to about 475 trees every single second, 24 hours a day."
  },
  {
    question: "How many trees are left in the world?",
    answer: "The same 2015 Nature study estimated approximately 3 trillion trees currently exist on Earth — about 422 trees per person. However, the global tree count has fallen by roughly 46% since the start of human civilization, and continues to decline by a net 10 billion trees per year."
  },
  {
    question: "Why are trees cut down?",
    answer: "The primary drivers of deforestation are agricultural expansion (cattle ranching, soy, palm oil), commercial logging for timber and paper, infrastructure development, and fuelwood collection. Agriculture accounts for roughly 80% of global deforestation, according to the UN Food and Agriculture Organization (FAO)."
  },
  {
    question: "How many trees need to be planted to offset deforestation?",
    answer: "Scientists estimate that planting 1 trillion trees in suitable areas could capture roughly 205 billion tonnes of carbon (Bastin et al., Science 2019), but this would not fully offset deforestation — protecting existing old-growth forests is far more valuable than replanting, since mature forests store carbon accumulated over centuries."
  },
  {
    question: "Which country loses the most trees?",
    answer: "Brazil consistently leads global deforestation, primarily due to Amazon deforestation for cattle ranching and agriculture. The Democratic Republic of Congo and Indonesia are also major contributors. The Amazon has lost over 17% of its forest cover in the past 50 years, according to Brazil's INPE monitoring agency."
  },
  {
    question: "How long does it take to grow a tree?",
    answer: "Growth rates vary enormously by species. Fast-growing plantation trees like eucalyptus or pine reach harvestable size in 7 to 15 years. A typical hardwood oak takes 40 to 150 years to mature. Old-growth trees like the giant sequoia or bristlecone pine can take hundreds to thousands of years — meaning deforestation losses cannot be quickly reversed."
  },
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
    "name": "Trees Cut Down Today — Live Estimate",
    "description": "Real-time estimate of trees felled worldwide today, calculated from 15 billion annual felling rate (Crowther et al., Nature 2015).",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "isAccessibleForFree": true,
    "creditText": "Based on Crowther et al. (2015), Nature — Global tree count and annual loss rates"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Trees Cut Down Today — Live Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time counter showing trees felled today worldwide based on 15 billion annual rate."
  }
]

const relatedTools = [
  { emoji: "🌊", title: "Plastic in Ocean Today", desc: "11M metric tons enter per year", href: "/world-counters/plastic-in-ocean" },
  { emoji: "🌋", title: "Earthquakes Today", desc: "Live USGS earthquake data", href: "/world-counters/earthquakes-today" },
  { emoji: "🌍", title: "World Population Counter", desc: "8.3 billion and counting — live", href: "/world-counters/population" },
  { emoji: "💸", title: "US National Debt", desc: "Watch the debt clock tick live", href: "/world-counters/us-debt" },
]

export default function TreesCutTodayPage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const now         = new Date()
  const sod         = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const jan1        = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
  const secToday    = Math.floor((now.getTime() - sod.getTime())  / 1000)
  const secThisYear = Math.floor((now.getTime() - jan1.getTime()) / 1000)

  void tick

  const cutToday      = secToday * TREES_CUT_PER_SEC
  const plantedToday  = secToday * TREES_PLANTED_PER_SEC
  const netLossToday  = secToday * NET_LOSS_PER_SEC
  const cutThisYear   = secThisYear * TREES_CUT_PER_SEC
  const plantedThisYear = secThisYear * TREES_PLANTED_PER_SEC

  const pctPlanted = cutToday > 0 ? Math.min(100, (plantedToday / cutToday) * 100) : 0

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌲</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Trees Cut Down Today</h1>
          <p className="text-[#a8a8b3]">~475 trees felled every second — watch today&apos;s total live</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "Trees Cut Down Today" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              Approximately <span style={{ color: "#f87171" }}>{fmtBig(cutToday)} trees</span> have been cut down today worldwide. That is roughly 475 trees every second, or 41 million per day — a rate that far outpaces the ~158 trees planted per second.
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter — trees cut */}
          <div className="rounded-xl border border-[#f87171]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">Trees Cut Down Today</p>
            <div className="text-5xl md:text-6xl font-black text-[#f87171] tabular-nums">{fmtBig(cutToday)}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">~{TREES_CUT_PER_SEC.toFixed(1)} trees per second</p>
          </div>

          {/* Cut vs Planted */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Cut vs Planted Today</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#f87171]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">🪓</div>
                <div className="text-2xl font-black text-[#f87171] tabular-nums">{fmtBig(cutToday)}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Trees cut today</div>
              </div>
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">🌱</div>
                <div className="text-2xl font-black text-[#4ade80] tabular-nums">{fmtBig(plantedToday)}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Trees planted today</div>
              </div>
              <div className="rounded-xl border border-[#fb923c]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">📉</div>
                <div className="text-2xl font-black text-[#fb923c] tabular-nums">−{fmtBig(netLossToday)}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Net loss today</div>
              </div>
            </div>

            {/* Progress bar: planted vs cut */}
            <div className="mt-4 rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
              <div className="flex justify-between text-sm text-[#a8a8b3] mb-2">
                <span>Trees planted as % of trees cut today</span>
                <span className="font-bold text-white">{pctPlanted.toFixed(1)}%</span>
              </div>
              <div className="h-4 rounded-full bg-[#16213e] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pctPlanted}%`, background: "linear-gradient(90deg, #4ade80, #22c55e)" }}
                />
              </div>
              <p className="text-xs text-[#a8a8b3] mt-2">
                For every 3 trees cut, only 1 is planted — a net loss of ~10 billion trees per year.
              </p>
            </div>
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Trees cut per second", value: TREES_CUT_PER_SEC.toFixed(0), color: "#f87171", emoji: "⚡" },
              { label: "Trees cut per minute", value: fmtWhole(TREES_CUT_PER_SEC * 60), color: "#fb923c", emoji: "⏱️" },
              { label: "Trees cut per hour", value: fmtWhole(TREES_CUT_PER_SEC * 3600), color: "#fbbf24", emoji: "🕐" },
              { label: "Trees cut per year", value: "15 billion", color: "#f87171", emoji: "📅" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* This year */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">This Year So Far ({now.getFullYear()})</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🪓", label: "Trees cut this year", value: fmtBig(cutThisYear), color: "#f87171" },
                { emoji: "🌱", label: "Trees planted this year", value: fmtBig(plantedThisYear), color: "#4ade80" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-6 text-center">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={`${fmtBig(cutToday)} trees have been cut down today worldwide. That's ~475 every second. Watch it live:`}
            url={PAGE_URL}
            title="Trees Cut Down Today — Live Counter"
            instagramText={`${fmtBig(cutToday)} trees cut today 🌲 475 per second. We plant 1 for every 3 we cut. Live counter → dayblip.com`}
            tiktokText={`${fmtBig(cutToday)} trees cut down today 🌲🪓 475 every single second. Watch the live counter → dayblip.com`}
          />

          <div>
            <MethodologyNote text="Trees-felled estimate based on Crowther et al. (2015), Nature — 'Mapping tree density at a global scale', which estimated ~15.3 billion trees are cut annually. Trees-planted figure (~5 billion/year) is from World Economic Forum and FAO estimates. Both rates are divided by seconds per year (365.25 × 86,400 = 31,557,600) and applied from UTC midnight of the current day. These are macro-scale estimates; actual rates vary by season and region." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: Crowther et al. (2015), Nature — global tree density and felling rates. FAO Global Forest Resources Assessment 2020. World Economic Forum reforestation estimates.
          </p>
        </div>
      </section>
    </div>
  )
}
