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

// US Census Bureau population clock rates (as of 2024–2025):
// 1 birth every 9 seconds, 1 death every 9.5 seconds, 1 net international migrant every 28 seconds
const BIRTHS_PER_SEC   = 1 / 9        // 0.11111
const DEATHS_PER_SEC   = 1 / 9.5      // 0.10526
const MIGRANTS_PER_SEC = 1 / 28       // 0.03571
const NET_PER_SEC      = BIRTHS_PER_SEC - DEATHS_PER_SEC + MIGRANTS_PER_SEC // ~0.04157

// US Census Bureau projection for Jan 1, 2026
const US_POP_JAN1_2026  = 335_893_238

const PAGE_URL = "https://www.dayblip.com/world-counters/us-population"

function fmtWhole(n: number) { return Math.floor(n).toLocaleString() }
function fmtBig(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`
  return fmtWhole(n)
}

const faqItems = [
  {
    question: "What is the current US population in 2026?",
    answer: "As of mid-2026 the US population is approximately 336 million, based on US Census Bureau projections. This counter uses the Census Bureau's Jan 1, 2026 estimate of 335,893,238 and adds the official net change rates: 1 birth every 9 seconds, 1 death every 9.5 seconds, and 1 net international migrant every 24 seconds."
  },
  {
    question: "How fast is the US population growing?",
    answer: "The US population grows by approximately 1 person every 21 seconds on net, according to Census Bureau 2024 data. That works out to roughly 4 people per minute, 240 per hour, and about 1.5 million net new residents per year when combining births, deaths, and immigration."
  },
  {
    question: "How does the Census Bureau calculate population?",
    answer: "The Census Bureau uses the cohort-component method: it starts with the decennial census count and then adds births, subtracts deaths, and adds net international migration for each subsequent year. The Population Clock updates these estimates daily using vital statistics data from states and immigration data from the Department of Homeland Security."
  },
  {
    question: "What US state has the highest population?",
    answer: "California remains the most populous US state with approximately 39 million residents as of 2024, followed by Texas (~31 million) and Florida (~23 million). Texas has been the fastest-growing large state in recent years due to both domestic migration and international immigration."
  },
  {
    question: "When will the US reach 400 million people?",
    answer: "At current growth rates of approximately 1.5 million net residents per year, the US would reach 400 million sometime around 2060. However, the Census Bureau's long-range projections depend heavily on immigration policy and future fertility trends, so this estimate carries significant uncertainty."
  },
  {
    question: "How many people are born in the US each day?",
    answer: "Approximately 10,700 babies are born in the United States every day, based on the Census Bureau rate of 1 birth every 9 seconds. About 7,900 people die each day, and roughly 3,600 net international migrants arrive, for a daily net population gain of about 6,400 people."
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
    "name": "US Population Live Estimate — Dayblip",
    "description": "Real-time US population estimate calculated from US Census Bureau birth, death, and migration rates applied to the Jan 1, 2026 baseline projection.",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "isAccessibleForFree": true,
    "creditText": "Rates sourced from US Census Bureau Population Clock (census.gov/popclock)"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "US Population Live Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time US population counter using Census Bureau birth, death, and migration rates."
  }
]

const relatedTools = [
  { emoji: "🌍", title: "World Population Counter", desc: "8.3 billion and counting — live", href: "/world-counters/population" },
  { emoji: "👶", title: "Babies Born Today", desc: "A baby is born every 0.44 seconds", href: "/world-counters/births-today" },
  { emoji: "💸", title: "US National Debt", desc: "Watch the debt clock tick in real time", href: "/world-counters/us-debt" },
  { emoji: "🌋", title: "Earthquakes Today", desc: "Live USGS earthquake data", href: "/world-counters/earthquakes-today" },
]

export default function USPopulationPage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const now        = new Date()
  const jan1_2026  = new Date(Date.UTC(2026, 0, 1, 0, 0, 0, 0))
  const sod        = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const secSince2026 = Math.max(0, Math.floor((now.getTime() - jan1_2026.getTime()) / 1000))
  const secToday     = Math.floor((now.getTime() - sod.getTime()) / 1000)

  void tick

  const currentPop     = Math.floor(US_POP_JAN1_2026 + secSince2026 * NET_PER_SEC)
  const birthsToday    = secToday * BIRTHS_PER_SEC
  const deathsToday    = secToday * DEATHS_PER_SEC
  const migrantsToday  = secToday * MIGRANTS_PER_SEC
  const birthsThisYear   = secSince2026 * BIRTHS_PER_SEC
  const deathsThisYear   = secSince2026 * DEATHS_PER_SEC
  const migrantsThisYear = secSince2026 * MIGRANTS_PER_SEC
  const netGrowthThisYear = birthsThisYear - deathsThisYear + migrantsThisYear

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🇺🇸</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">US Population — Live Counter</h1>
          <p className="text-[#a8a8b3]">Real-time estimate based on US Census Bureau birth, death, and migration rates</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "US Population" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              The US population is approximately <span style={{ color: "#4FC3F7" }}>{currentPop.toLocaleString()}</span> as of right now. It grows by roughly 1 person every 21 seconds, driven by Census Bureau rates of 1 birth every 9 seconds, 1 death every 9.5 seconds, and 1 net international migrant every 24 seconds.
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter */}
          <div className="rounded-xl border border-[#4FC3F7]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">US Population Right Now</p>
            <div className="text-5xl md:text-6xl font-black text-[#4FC3F7] tabular-nums">{currentPop.toLocaleString()}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">+{NET_PER_SEC.toFixed(4)} net residents per second</p>
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { emoji: "👶", label: "Births per second", value: BIRTHS_PER_SEC.toFixed(4), color: "#4ade80" },
              { emoji: "💀", label: "Deaths per second", value: DEATHS_PER_SEC.toFixed(4), color: "#f87171" },
              { emoji: "✈️", label: "Net migrants per second", value: MIGRANTS_PER_SEC.toFixed(4), color: "#fbbf24" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Today */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Today So Far</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { emoji: "👶", label: "US births today", value: fmtWhole(birthsToday), color: "#4ade80" },
                { emoji: "💀", label: "US deaths today", value: fmtWhole(deathsToday), color: "#f87171" },
                { emoji: "✈️", label: "Net migrants today", value: fmtWhole(migrantsToday), color: "#fbbf24" },
                { emoji: "📈", label: "Net population gain today", value: `+${fmtWhole(birthsToday - deathsToday + migrantsToday)}`, color: "#4FC3F7" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* This year */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">This Year So Far ({now.getFullYear()})</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: "👶", label: "Births this year", value: fmtBig(birthsThisYear), color: "#4ade80" },
                { emoji: "💀", label: "Deaths this year", value: fmtBig(deathsThisYear), color: "#f87171" },
                { emoji: "📊", label: "Net population growth", value: `+${fmtBig(netGrowthThisYear)}`, color: "#4FC3F7" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <div className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical context */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">US Population Milestones</h2>
            <div className="space-y-2">
              {[
                { year: "1776", pop: "~2.5 million", event: "Declaration of Independence" },
                { year: "1900", pop: "76 million", event: "Industrial Revolution peak" },
                { year: "1950", pop: "152 million", event: "Post-WWII baby boom" },
                { year: "1970", pop: "203 million", event: "Crossed 200 million milestone" },
                { year: "2000", pop: "282 million", event: "Turn of the millennium" },
                { year: "2020", pop: "331 million", event: "2020 Census count" },
                { year: "2026", pop: `~${(currentPop / 1_000_000).toFixed(1)} million`, event: "Right now — live estimate" },
              ].map(m => (
                <div key={m.year} className="flex items-center gap-4 rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3">
                  <div className="w-12 shrink-0 text-sm font-black text-[#4FC3F7] tabular-nums">{m.year}</div>
                  <div className="w-28 shrink-0 text-white font-semibold text-sm">{m.pop}</div>
                  <div className="text-[#a8a8b3] text-sm">{m.event}</div>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={`The US population right now: ${currentPop.toLocaleString()} people. It grows by 1 person every ~21 seconds. Watch it live:`}
            url={PAGE_URL}
            title="US Population — Live Counter 2026"
            instagramText={`US population right now: ${currentPop.toLocaleString()} 🇺🇸 Growing by 1 person every 21 seconds. Live counter → dayblip.com`}
            tiktokText={`The US population right now: ${currentPop.toLocaleString()} 🇺🇸 1 new person every 21 seconds. Watch live → dayblip.com`}
          />

          <div>
            <MethodologyNote text="Population estimate uses the US Census Bureau Jan 1, 2026 projection of 335,893,238 as the baseline, then adds net change at Census Bureau Population Clock rates: 1 birth every 9 seconds, 1 death every 9.5 seconds, 1 net international migrant every 24 seconds. The counter increments in real time from page load using these rates. Figures are estimates; the Census Bureau revises rates periodically." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: US Census Bureau Population Clock (census.gov/popclock) — Jan 1, 2026 projection and vital rates. US Census Bureau 2020 Decennial Census.
          </p>
        </div>
      </section>
    </div>
  )
}
