"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, breadcrumbSchema } from "@/lib/schema"

interface DecadeData {
  gas: number
  movie: number
  bread: number
  homeAvg: number
  medianIncome: number
}

const DECADE_DATA: Record<number, DecadeData> = {
  1920: { gas: 0.21, movie: 0.25, bread: 0.09, homeAvg: 6300, medianIncome: 1380 },
  1930: { gas: 0.18, movie: 0.23, bread: 0.09, homeAvg: 5000, medianIncome: 1368 },
  1940: { gas: 0.21, movie: 0.40, bread: 0.14, homeAvg: 7200, medianIncome: 2000 },
  1950: { gas: 0.29, movie: 0.53, bread: 0.19, homeAvg: 14100, medianIncome: 3300 },
  1960: { gas: 0.31, movie: 0.69, bread: 0.22, homeAvg: 20000, medianIncome: 5600 },
  1970: { gas: 0.57, movie: 1.55, bread: 0.35, homeAvg: 36000, medianIncome: 9870 },
  1980: { gas: 1.22, movie: 2.89, bread: 0.99, homeAvg: 76400, medianIncome: 17710 },
  1990: { gas: 1.15, movie: 4.23, bread: 1.38, homeAvg: 149000, medianIncome: 29943 },
  2000: { gas: 2.15, movie: 5.82, bread: 2.10, homeAvg: 207000, medianIncome: 42148 },
  2010: { gas: 3.28, movie: 8.65, bread: 2.79, homeAvg: 272900, medianIncome: 49445 },
  2020: { gas: 3.42, movie: 12.05, bread: 3.94, homeAvg: 397000, medianIncome: 67521 },
}

const CPI_MULTIPLIERS: Record<number, number> = {
  1920: 16.8, 1930: 19.4, 1940: 23.1, 1950: 13.5, 1960: 10.9,
  1970: 8.3, 1980: 3.9, 1990: 2.4, 2000: 1.8, 2010: 1.4,
  2015: 1.3, 2020: 1.2,
}

const WORLD_POP: Record<number, number> = {
  1920: 1.86, 1930: 2.07, 1940: 2.30, 1950: 2.52, 1960: 3.03,
  1970: 3.70, 1980: 4.43, 1990: 5.30, 2000: 6.07, 2010: 6.93,
  2020: 7.79, 2026: 8.20,
}

const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

function getDecade(year: number): number {
  return Math.floor(year / 10) * 10
}

function getDecadeData(year: number): DecadeData {
  const d = getDecade(year)
  const keys = Object.keys(DECADE_DATA).map(Number).sort((a, b) => a - b)
  const key = keys.find(k => k >= d) ?? keys[keys.length - 1]
  const prev = keys[keys.indexOf(key) - 1]
  if (prev === undefined) return DECADE_DATA[key]
  const t = (d - prev) / (key - prev)
  const a = DECADE_DATA[prev], b = DECADE_DATA[key]
  return {
    gas: a.gas + t * (b.gas - a.gas),
    movie: a.movie + t * (b.movie - a.movie),
    bread: a.bread + t * (b.bread - a.bread),
    homeAvg: Math.round(a.homeAvg + t * (b.homeAvg - a.homeAvg)),
    medianIncome: Math.round(a.medianIncome + t * (b.medianIncome - a.medianIncome)),
  }
}

function getCPI(year: number): number {
  const keys = Object.keys(CPI_MULTIPLIERS).map(Number).sort((a, b) => a - b)
  if (year <= keys[0]) return CPI_MULTIPLIERS[keys[0]]
  if (year >= keys[keys.length - 1]) return CPI_MULTIPLIERS[keys[keys.length - 1]]
  for (let i = 0; i < keys.length - 1; i++) {
    if (year >= keys[i] && year <= keys[i + 1]) {
      const t = (year - keys[i]) / (keys[i + 1] - keys[i])
      return CPI_MULTIPLIERS[keys[i]] + t * (CPI_MULTIPLIERS[keys[i + 1]] - CPI_MULTIPLIERS[keys[i]])
    }
  }
  return 1
}

function getWorldPop(year: number): number {
  const keys = Object.keys(WORLD_POP).map(Number).sort((a, b) => a - b)
  if (year <= keys[0]) return WORLD_POP[keys[0]]
  if (year >= keys[keys.length - 1]) return WORLD_POP[keys[keys.length - 1]]
  for (let i = 0; i < keys.length - 1; i++) {
    if (year >= keys[i] && year <= keys[i + 1]) {
      const t = (year - keys[i]) / (keys[i + 1] - keys[i])
      return WORLD_POP[keys[i]] + t * (WORLD_POP[keys[i + 1]] - WORLD_POP[keys[i]])
    }
  }
  return 7
}

interface WikiEvent {
  text: string
  year: number
  pages?: { title: string; content_urls?: { desktop?: { page?: string } } }[]
}

interface WikiResponse {
  events?: WikiEvent[]
  births?: WikiEvent[]
  deaths?: WikiEvent[]
}

export default function TimeMachineDatePage({ params }: { params: { date: string } }) {
  const { date } = params
  const [wikiEvents, setWikiEvents] = useState<WikiEvent[]>([])
  const [wikiLoading, setWikiLoading] = useState(true)

  const parsed = useMemo(() => {
    const parts = date.split("-")
    const year = parseInt(parts[0] ?? "2000", 10)
    const month = parseInt(parts[1] ?? "1", 10)
    const day = parseInt(parts[2] ?? "1", 10)
    const dateObj = new Date(year, month - 1, day)
    const dayOfWeek = DAYS[dateObj.getDay()]
    const monthName = MONTHS_LONG[month - 1] ?? ""
    const label = `${dayOfWeek}, ${monthName} ${day}, ${year}`
    const prices = getDecadeData(year)
    const cpi = getCPI(year)
    const pop = getWorldPop(year)
    return { year, month, month0: month - 1, day, label, prices, cpi, pop, monthName }
  }, [date])

  useEffect(() => {
    const mm = String(parsed.month).padStart(2, "0")
    const dd = String(parsed.day).padStart(2, "0")
    fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`, {
      headers: { "Api-User-Agent": "Dayblip/1.0 (dayblip.com)" },
    })
      .then(r => r.json())
      .then((data: WikiResponse) => {
        const events: WikiEvent[] = []
        // Prefer events from the exact year, then other events
        const allEvents = data.events ?? []
        const exact = allEvents.filter(e => e.year === parsed.year)
        const rest = allEvents.filter(e => e.year !== parsed.year).slice(0, exact.length > 0 ? 3 : 5)
        events.push(...exact, ...rest)
        setWikiEvents(events.slice(0, 6))
      })
      .catch(() => setWikiEvents([]))
      .finally(() => setWikiLoading(false))
  }, [parsed.month, parsed.day, parsed.year])

  const shareText = `On ${parsed.label} gas cost $${parsed.prices.gas.toFixed(2)}/gallon and the world had ${parsed.pop.toFixed(2)} billion people. Travel back to any date free:`
  const shareUrl = `https://www.dayblip.com/time-machine/${date}`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          `Historical Date — ${parsed.label}`,
          `See what life was like on ${parsed.label} — prices events songs and world context.`,
          shareUrl,
          "UtilitiesApplication"
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Time Machine", url: "https://www.dayblip.com/time-machine" },
          { name: parsed.label, url: shareUrl },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="text-5xl mb-4">⏰</div>
          <p className="text-[#a8a8b3] text-sm mb-2 uppercase tracking-widest">You traveled back to</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">{parsed.label}</h1>
          <p className="text-[#a8a8b3]">Here is what life looked like on that exact day</p>
        </div>
      </section>

      <section className="px-6 py-6 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Time Machine", href: "/time-machine" }, { label: parsed.label }]} />
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">

          <div>
            <h2 className="text-white font-bold text-lg mb-4">💰 What Things Cost in {parsed.year}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { icon: "⛽", label: "Gas per gallon", value: `$${parsed.prices.gas.toFixed(2)}` },
                { icon: "🍞", label: "Bread per loaf", value: `$${parsed.prices.bread.toFixed(2)}` },
                { icon: "🎬", label: "Movie ticket", value: `$${parsed.prices.movie.toFixed(2)}` },
                { icon: "🏠", label: "Average new home", value: `$${parsed.prices.homeAvg.toLocaleString()}` },
                { icon: "💼", label: "Median income/year", value: `$${parsed.prices.medianIncome.toLocaleString()}` },
                { icon: "💵", label: "$1.00 in today's $", value: `$${parsed.cpi.toFixed(2)}` },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-bold text-lg" style={{ color: "#F9A825" }}>{item.value}</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-4">🌍 Fun Context for {parsed.year}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-[#a8a8b3] text-xs mb-1">World Population</div>
                <div className="text-white font-bold text-lg">~{parsed.pop.toFixed(2)} billion people</div>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-[#a8a8b3] text-xs mb-1">Inflation Equivalent</div>
                <div className="text-white font-bold text-lg">$1.00 in {parsed.year} = ${parsed.cpi.toFixed(2)} today</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-4">📰 What Happened on {parsed.monthName} {parsed.day}</h2>
            {wikiLoading ? (
              <div className="text-[#a8a8b3] text-sm">Loading historical events...</div>
            ) : wikiEvents.length > 0 ? (
              <div className="space-y-3">
                {wikiEvents.map((evt, i) => (
                  <div key={i} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                    <span className="text-xs font-bold mr-2" style={{ color: "#e94560" }}>{evt.year}</span>
                    <span className="text-[#e8e8e8] text-sm">{evt.text}</span>
                    {evt.pages?.[0]?.content_urls?.desktop?.page && (
                      <a
                        href={evt.pages[0].content_urls.desktop.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs mt-1"
                        style={{ color: "#4FC3F7" }}
                      >
                        Read more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#a8a8b3] text-sm">Historical events for this date could not be loaded right now. Try another date or check Wikipedia directly.</p>
            )}
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
            <p className="text-[#a8a8b3] text-sm mb-3">Want to explore another date?</p>
            <Link href="/time-machine" className="inline-block rounded-lg px-6 py-3 font-bold text-white transition-opacity hover:opacity-90" style={{ background: "#e94560" }}>
              ← Back to Time Machine
            </Link>
          </div>

          <ShareButtons text={shareText} url={shareUrl} title={`Historical Date — ${parsed.label}`} />

          <RelatedTools tools={[
            { emoji: "🎂", title: "Born In Year", desc: "What the world looked like when you were born", href: "/born-in" },
            { emoji: "📅", title: "On This Day", desc: "What happened on this day in history", href: "/on-this-day" },
            { emoji: "⏳", title: "Days Since", desc: "How long ago was any date?", href: "/days-since" },
            { emoji: "🎂", title: "Age Calculator", desc: "Calculate exact age between any two dates", href: "/age-calculator" },
          ]} />
        </div>
      </section>
    </div>
  )
}
