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

interface Quake {
  id: string
  mag: number | null
  place: string | null
  time: number
}

const PAGE_URL = "https://www.dayblip.com/world-counters/earthquakes-today"

const faqItems = [
  {
    question: "How many earthquakes happen every day?",
    answer: "The USGS estimates roughly 500 earthquakes occur worldwide every day when including all magnitudes. Of those, about 100 are large enough to be felt, and only one to two per day typically reach magnitude 5.0 or above."
  },
  {
    question: "What is the strongest earthquake ever recorded?",
    answer: "The largest earthquake ever recorded was the 1960 Valdivia earthquake in Chile, measuring 9.5 on the moment magnitude scale. It generated a Pacific-wide tsunami and remains the most powerful seismic event in recorded history."
  },
  {
    question: "Where do most earthquakes occur?",
    answer: "About 90% of earthquakes occur along the Pacific Ring of Fire — a 40,000 km horseshoe-shaped zone encompassing the coasts of South America, North America, Alaska, Japan, and the Philippines. The remaining 10% occur along other tectonic plate boundaries, particularly the Alpide Belt running from the Mediterranean to Southeast Asia."
  },
  {
    question: "How does USGS detect earthquakes?",
    answer: "The USGS operates a global network of seismograph stations called the Global Seismographic Network (GSN). When seismic waves travel through the Earth, these instruments detect the ground motion and transmit data in real time to USGS data centers, which automatically locate and measure the earthquake within minutes."
  },
  {
    question: "What magnitude earthquake can you feel?",
    answer: "Earthquakes below magnitude 2.0 are typically not felt by people at all. Magnitude 2.0–2.9 may be felt only by people very close to the epicenter. Magnitude 3.0–3.9 is often felt but rarely causes damage. Magnitude 5.0 and above can cause significant shaking and structural damage depending on depth and distance."
  },
  {
    question: "How often does a magnitude 7+ earthquake happen?",
    answer: "On average, about 15 to 20 major earthquakes of magnitude 7.0 or higher occur worldwide each year, according to USGS historical data. Magnitude 8.0 or above happens approximately once per year globally, and magnitude 9.0+ events are rare, occurring roughly once per decade."
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
    "name": "Earthquakes Today — Real-Time USGS Feed",
    "description": "Live earthquake counts and magnitude data sourced from the USGS Earthquake Hazards Program API, updated every 60 seconds.",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/publicdomain/zero/1.0/",
    "isAccessibleForFree": true,
    "creditText": "Data sourced from USGS Earthquake Hazards Program (earthquake.usgs.gov)"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Earthquakes Today — Live Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time earthquake counter sourcing live data from USGS, refreshed every 60 seconds."
  }
]

const relatedTools = [
  { emoji: "🌍", title: "World Population Counter", desc: "8.3 billion and counting — live", href: "/world-counters/population" },
  { emoji: "👶", title: "Babies Born Today", desc: "A baby is born every 0.44 seconds", href: "/world-counters/births-today" },
  { emoji: "🌊", title: "Plastic in Ocean Today", desc: "Watch today's total tick up live", href: "/world-counters/plastic-in-ocean" },
  { emoji: "🌲", title: "Trees Cut Down Today", desc: "~475 trees felled every second", href: "/world-counters/trees-cut-today" },
]

function magColor(mag: number | null) {
  if (mag === null) return "#a8a8b3"
  if (mag >= 6) return "#f87171"
  if (mag >= 4) return "#fbbf24"
  if (mag >= 2) return "#4FC3F7"
  return "#a8a8b3"
}

function magLabel(mag: number | null) {
  if (mag === null) return "Unknown"
  if (mag >= 7) return "Major"
  if (mag >= 6) return "Strong"
  if (mag >= 5) return "Moderate"
  if (mag >= 4) return "Light"
  if (mag >= 2) return "Minor"
  return "Micro"
}

export default function EarthquakesTodayPage() {
  const [quakes, setQuakes] = useState<Quake[]>([])
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [error, setError] = useState(false)

  async function fetchQuakes() {
    try {
      const res = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
        { cache: "no-store" }
      )
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      const now = new Date()
      const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      const todayQuakes: Quake[] = (data.features as { id: string; properties: { mag: number | null; place: string | null; time: number } }[])
        .filter(f => f.properties.time >= todayUTC)
        .map(f => ({
          id: f.id,
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
        }))
        .sort((a, b) => b.time - a.time)
      setQuakes(todayQuakes)
      setLastFetch(new Date())
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuakes()
    const t = setInterval(fetchQuakes, 60_000)
    return () => clearInterval(t)
  }, [])

  const todayCount = quakes.length
  const largest = quakes.reduce<number | null>((max, q) => {
    if (q.mag === null) return max
    return max === null || q.mag > max ? q.mag : max
  }, null)
  const sig = quakes.filter(q => q.mag !== null && q.mag >= 4.0)
  const recent = quakes.slice(0, 10)

  const shareText = `${todayCount} earthquakes have hit Earth today. The largest so far: M${largest?.toFixed(1) ?? "?"} Watch it live:`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌋</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Earthquakes Today</h1>
          <p className="text-[#a8a8b3]">Live data from USGS — updated every 60 seconds</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "Earthquakes Today" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              {loading
                ? "Loading live USGS data…"
                : error
                ? "Unable to reach USGS right now. Try refreshing."
                : `${todayCount.toLocaleString()} earthquakes have been recorded worldwide today (UTC). The largest is M${largest?.toFixed(1) ?? "?"}. Data refreshes every 60 seconds from USGS.`}
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter */}
          <div className="rounded-xl border border-[#f87171]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">Earthquakes Today (UTC)</p>
            {loading ? (
              <div className="text-[#a8a8b3] text-3xl animate-pulse">Loading…</div>
            ) : (
              <div className="text-6xl md:text-7xl font-black text-[#f87171] tabular-nums">{todayCount.toLocaleString()}</div>
            )}
            {lastFetch && (
              <p className="text-[#a8a8b3]/60 text-xs mt-3">Last updated: {lastFetch.toLocaleTimeString()} · refreshes every 60s</p>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { label: "Largest magnitude today", value: largest !== null ? `M${largest.toFixed(1)}` : "—", color: "#f87171", emoji: "📊" },
              { label: "Significant (M4.0+) today", value: sig.length.toLocaleString(), color: "#fbbf24", emoji: "⚠️" },
              { label: "Major (M6.0+) today", value: quakes.filter(q => q.mag !== null && q.mag >= 6).length.toLocaleString(), color: "#f87171", emoji: "🚨" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{loading ? "—" : s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent quakes list */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Most Recent Earthquakes Today</h2>
            {loading && <p className="text-[#a8a8b3]">Fetching live USGS data…</p>}
            {error && <p className="text-[#f87171]">Could not load USGS data. Check your connection and refresh.</p>}
            {!loading && !error && recent.length === 0 && (
              <p className="text-[#a8a8b3]">No earthquakes recorded yet today (UTC). Check back soon.</p>
            )}
            {!loading && !error && recent.length > 0 && (
              <div className="space-y-2">
                {recent.map(q => (
                  <div key={q.id} className="flex items-center gap-4 rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3">
                    <div
                      className="w-14 shrink-0 rounded-md py-1 text-center text-sm font-black tabular-nums"
                      style={{ color: magColor(q.mag), background: `${magColor(q.mag)}18` }}
                    >
                      {q.mag !== null ? `M${q.mag.toFixed(1)}` : "M?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm font-medium truncate">{q.place ?? "Unknown location"}</div>
                      <div className="text-[#a8a8b3] text-xs mt-0.5">
                        {new Date(q.time).toLocaleTimeString()} UTC · {magLabel(q.mag)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Magnitude scale */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Magnitude Scale Explained</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                { range: "< 2.0", label: "Micro", desc: "Not felt", color: "#a8a8b3" },
                { range: "2.0–3.9", label: "Minor", desc: "Felt slightly", color: "#4FC3F7" },
                { range: "4.0–4.9", label: "Light", desc: "Felt widely, minor damage", color: "#fbbf24" },
                { range: "5.0–5.9", label: "Moderate", desc: "Can cause damage", color: "#fb923c" },
                { range: "6.0–6.9", label: "Strong", desc: "Destructive in populated areas", color: "#f87171" },
                { range: "7.0+", label: "Major / Great", desc: "Serious damage over wide areas", color: "#e94560" },
              ].map(s => (
                <div key={s.range} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-4">
                  <div className="text-lg font-black tabular-nums" style={{ color: s.color }}>{s.range}</div>
                  <div className="text-white text-sm font-semibold">{s.label}</div>
                  <div className="text-[#a8a8b3] text-xs mt-1">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={shareText}
            url={PAGE_URL}
            title="Earthquakes Today — Live Counter"
            instagramText={`${todayCount} earthquakes today 🌋 The largest: M${largest?.toFixed(1) ?? "?"}. Live USGS data → dayblip.com`}
            tiktokText={`${todayCount} earthquakes hit Earth today 🌋 M${largest?.toFixed(1) ?? "?"} is the biggest so far. Watch live → dayblip.com`}
          />

          <div>
            <MethodologyNote text="Earthquake counts and magnitudes sourced directly from the USGS Earthquake Hazards Program real-time GeoJSON feed (all_day.geojson). Data is filtered to earthquakes with an origin time on or after UTC midnight of the current date. The feed is queried every 60 seconds. Counts may lag real-time by a few minutes as USGS processes seismograph data." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Source: <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4FC3F7]">USGS Earthquake Hazards Program</a> — real-time GeoJSON feed. Figures are real-time estimates and may be revised as USGS reviews seismic data.
          </p>
        </div>
      </section>
    </div>
  )
}
