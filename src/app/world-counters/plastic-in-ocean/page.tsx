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

// Jambeck et al. (Science, 2015) — ~8 million metric tons/year entering oceans
// Updated estimates (Borrelle et al., Science 2020) — 11 million metric tons/year as of ~2016
// Using 11 million metric tons/year as current baseline
const PLASTIC_MT_PER_YEAR  = 11_000_000          // metric tons
const PLASTIC_KG_PER_YEAR  = PLASTIC_MT_PER_YEAR * 1_000  // kg
const SECS_YEAR            = 365.25 * 86_400

const PLASTIC_KG_PER_SEC   = PLASTIC_KG_PER_YEAR / SECS_YEAR  // ~348.6 kg/sec
const PLASTIC_MT_PER_SEC   = PLASTIC_KG_PER_SEC / 1_000       // ~0.3486 mt/sec

// Cumulative estimate: ~194 million metric tons as of Jan 1, 2026
// Based on progressive accumulation since 1950s with accelerating annual rates
const CUMULATIVE_MT_JAN1_2026 = 194_000_000

const PAGE_URL = "https://www.dayblip.com/world-counters/plastic-in-ocean"

function fmtWhole(n: number) { return Math.floor(n).toLocaleString() }
function fmtMT(mt: number) {
  if (mt >= 1_000_000) return `${(mt / 1_000_000).toFixed(3)} million metric tons`
  return `${fmtWhole(mt)} metric tons`
}

const faqItems = [
  {
    question: "How much plastic is in the ocean right now?",
    answer: "Scientists estimate approximately 150 to 200 million metric tons of plastic have accumulated in the world's oceans, with roughly 11 million additional metric tons entering each year (Borrelle et al., Science 2020). At current trajectories, that annual input could nearly triple by 2040 without major policy intervention."
  },
  {
    question: "How does plastic get into the ocean?",
    answer: "Approximately 80% of ocean plastic originates on land, carried to the sea via rivers, storm drains, and coastal littering. The remaining 20% comes from marine sources like fishing gear, cargo ships, and offshore platforms. The top 20 rivers in Asia and Africa account for roughly 67% of all river-borne plastic reaching the ocean."
  },
  {
    question: "What is the Great Pacific Garbage Patch?",
    answer: "The Great Pacific Garbage Patch is a gyre of marine debris in the North Pacific Ocean, estimated to cover approximately 1.6 million square kilometers — roughly twice the size of Texas. It contains an estimated 80,000 metric tons of plastic, mostly in the form of broken-down microplastic fragments rather than whole objects (Ocean Cleanup Foundation, 2018)."
  },
  {
    question: "How long does plastic last in the ocean?",
    answer: "Most plastics do not biodegrade in the ocean — they photodegrade, breaking down into progressively smaller fragments called microplastics. A plastic bag can persist for 20 years; a plastic bottle for 450 years; fishing line for 600 years. Microplastics measuring less than 5mm are now found in the deepest ocean trenches and in the bodies of marine life worldwide."
  },
  {
    question: "How does ocean plastic affect marine life?",
    answer: "Over 800 marine species are affected by ocean plastic through entanglement, ingestion, or habitat disruption. Sea turtles mistake plastic bags for jellyfish; seabirds feed plastic fragments to their chicks; whales have been found with hundreds of kilograms of plastic in their stomachs. Microplastics have been detected in fish tissue consumed by humans, raising food safety concerns."
  },
  {
    question: "What can reduce plastic entering the ocean?",
    answer: "Research published in Science (2020) found that extending waste collection to the 20% of the world's population currently without access to waste management could reduce ocean plastic input by 41%. Additional high-impact interventions include banning single-use plastics (EU, Canada), plastic producer responsibility legislation, and river interception systems being deployed by organizations like The Ocean Cleanup."
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
    "name": "Plastic Entering the Ocean Today — Live Estimate",
    "description": "Real-time estimate of plastic mass entering the ocean today, based on 11 million metric tons per year (Borrelle et al., Science 2020).",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "isAccessibleForFree": true,
    "creditText": "Based on Borrelle et al. (2020), Science — projected annual plastic input to ocean"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Plastic in Ocean Today — Live Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time counter of plastic entering the ocean today, based on 11 million metric tons per year rate."
  }
]

const relatedTools = [
  { emoji: "🌲", title: "Trees Cut Down Today", desc: "~475 trees felled every second", href: "/world-counters/trees-cut-today" },
  { emoji: "🌋", title: "Earthquakes Today", desc: "Live USGS earthquake data", href: "/world-counters/earthquakes-today" },
  { emoji: "🌍", title: "World Population Counter", desc: "8.3 billion and counting — live", href: "/world-counters/population" },
  { emoji: "👶", title: "Babies Born Today", desc: "A baby is born every 0.44 seconds", href: "/world-counters/births-today" },
]

export default function PlasticInOceanPage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const now        = new Date()
  const sod        = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const jan1_2026  = new Date(Date.UTC(2026, 0, 1, 0, 0, 0, 0))
  const jan1_year  = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
  const secToday   = Math.floor((now.getTime() - sod.getTime())  / 1000)
  const secThisYear = Math.floor((now.getTime() - jan1_year.getTime()) / 1000)
  const secSince2026 = Math.max(0, Math.floor((now.getTime() - jan1_2026.getTime()) / 1000))

  void tick

  const kgToday          = secToday * PLASTIC_KG_PER_SEC
  const mtToday          = kgToday / 1_000
  const kgThisYear       = secThisYear * PLASTIC_KG_PER_SEC
  const cumulativeMT     = CUMULATIVE_MT_JAN1_2026 + secSince2026 * PLASTIC_MT_PER_SEC

  // Equivalencies for today's plastic
  const truckLoads = mtToday / 10  // average garbage truck ~10 metric tons
  const elephants  = mtToday / 5   // average elephant ~5 metric tons

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌊</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Plastic Entering the Ocean Today</h1>
          <p className="text-[#a8a8b3]">11 million metric tons per year — watch today&apos;s total tick up in real time</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "Plastic in Ocean Today" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              An estimated <span style={{ color: "#4FC3F7" }}>{fmtMT(mtToday)}</span> of plastic has entered the world&apos;s oceans today. That is approximately <span style={{ color: "#f87171" }}>{fmtWhole(kgToday)} kg</span> — or about {fmtWhole(truckLoads)} garbage trucks full — based on 11 million metric tons entering oceans every year (Borrelle et al., Science 2020).
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter — kg today */}
          <div className="rounded-xl border border-[#4FC3F7]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">Plastic Entered Ocean Today</p>
            <div className="text-4xl md:text-5xl font-black text-[#4FC3F7] tabular-nums">{fmtWhole(kgToday)} kg</div>
            <div className="text-2xl font-bold text-[#a8a8b3] mt-2 tabular-nums">{fmtMT(mtToday)}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">~{PLASTIC_KG_PER_SEC.toFixed(1)} kg per second</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "kg per second", value: PLASTIC_KG_PER_SEC.toFixed(1), color: "#4FC3F7", emoji: "⚡" },
              { label: "Garbage trucks today", value: fmtWhole(truckLoads), color: "#fbbf24", emoji: "🚛" },
              { label: "Elephant equivalents today", value: fmtWhole(elephants), color: "#fb923c", emoji: "🐘" },
              { label: "Metric tons per year", value: "11 million", color: "#f87171", emoji: "📅" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cumulative & this year */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Bigger Picture</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { emoji: "📆", label: "Plastic entered ocean this year", value: fmtMT(kgThisYear / 1_000), color: "#4FC3F7" },
                { emoji: "🌊", label: "Estimated cumulative in ocean", value: `~${(cumulativeMT / 1_000_000).toFixed(0)}M metric tons`, color: "#fb923c" },
                { emoji: "🔢", label: "Annual input (current rate)", value: "11 million metric tons", color: "#f87171" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-lg font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Types of plastic */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">What Kind of Plastic Enters the Ocean?</h2>
            <div className="space-y-3">
              {[
                { type: "Single-use packaging", share: 36, color: "#f87171", desc: "Bottles, bags, wrappers, straws" },
                { type: "Textiles & microfibers", share: 16, color: "#fb923c", desc: "Synthetic clothing shed in washing" },
                { type: "Consumer goods", share: 14, color: "#fbbf24", desc: "Electronics, toys, household items" },
                { type: "Fishing gear", share: 11, color: "#4FC3F7", desc: "Nets, lines, traps — often abandoned" },
                { type: "Other / industrial", share: 23, color: "#a8a8b3", desc: "Construction, transport, agriculture" },
              ].map(s => (
                <div key={s.type} className="rounded-lg border border-[#0f3460] bg-[#0d1b2a] p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-semibold">{s.type}</span>
                    <span className="text-sm font-black tabular-nums" style={{ color: s.color }}>{s.share}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#16213e] overflow-hidden mb-1">
                    <div className="h-full rounded-full" style={{ width: `${s.share}%`, backgroundColor: s.color }} />
                  </div>
                  <p className="text-xs text-[#a8a8b3]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={`${fmtWhole(kgToday)} kg of plastic has entered the ocean today — that's ${fmtWhole(truckLoads)} garbage trucks. Watch it tick live:`}
            url={PAGE_URL}
            title="Plastic Entering the Ocean Today — Live Counter"
            instagramText={`${fmtWhole(kgToday)} kg of plastic entered the ocean today 🌊 That's ${fmtWhole(truckLoads)} garbage trucks full. Live counter → dayblip.com`}
            tiktokText={`${fmtWhole(kgToday)} kg of plastic hit the ocean today 🌊 348 kg every single second. Watch live → dayblip.com`}
          />

          <div>
            <MethodologyNote text="Today's plastic input calculated at 348.6 kg/second, derived from 11 million metric tons per year (Borrelle et al., Science 2020, 'Predicted growth in plastic waste exceeds efforts to mitigate plastic pollution') divided by 31,557,600 seconds per year. Cumulative ocean plastic estimate of ~194M metric tons as of Jan 1, 2026 is extrapolated from the OECD Global Plastics Outlook 2022 and Jambeck et al. (2015). The plastics breakdown by type is sourced from OECD Global Plastics Outlook 2022. All figures are estimates with significant uncertainty." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: Borrelle et al. (2020), Science — ocean plastic input rates. Jambeck et al. (2015), Science — coastal plastic waste. OECD Global Plastics Outlook 2022. Ocean Cleanup Foundation (2018) — Great Pacific Garbage Patch.
          </p>
        </div>
      </section>
    </div>
  )
}
