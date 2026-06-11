"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

const POPULAR_DATES = [
  { label: "Moon Landing", date: "1969-07-20", emoji: "🌕" },
  { label: "JFK Assassination", date: "1963-11-22", emoji: "🇺🇸" },
  { label: "9/11", date: "2001-09-11", emoji: "🗽" },
  { label: "Black Monday", date: "1987-10-19", emoji: "📉" },
  { label: "Hiroshima", date: "1945-08-06", emoji: "☮️" },
  { label: "Berlin Wall Falls", date: "1989-11-09", emoji: "🧱" },
  { label: "Y2K New Year", date: "2000-01-01", emoji: "🎉" },
  { label: "COVID Pandemic Declared", date: "2020-03-11", emoji: "😷" },
]

export default function TimeMachinePage() {
  const router = useRouter()
  const [date, setDate] = useState("")

  function go() {
    if (date) router.push(`/time-machine/${date}`)
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Historical Date Calculator — Time Machine",
          "See what life was like on any date in history — prices events songs and world context.",
          "https://www.dayblip.com/time-machine",
          "UtilitiesApplication"
        ),
        faqSchema([
          {
            question: "What did things cost in 1980?",
            answer: "In 1980 gasoline cost approximately $1.25 per gallon. A movie ticket cost $2.89. A loaf of bread cost $0.99. A new home cost an average of $76,400. The median household income was $17,710 per year. Adjusting for inflation $1.00 in 1980 is equivalent to approximately $3.90 today.",
          },
          {
            question: "How do I find out what happened on my birthday in history?",
            answer: "Enter your exact birth date in the Dayblip Time Machine to see historical events from your birth year and the recurring events that happen every year on that date throughout history. The tool pulls from Wikipedia's historical event database and shows gas prices food costs and entertainment context for your birth decade.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Time Machine", url: "https://www.dayblip.com/time-machine" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="text-5xl mb-4">⏰</div>
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Historical Date Calculator — Travel Back to Any Date in History</h1>
          <p className="text-[#a8a8b3]">Gas prices, food costs, world events, #1 songs — for any date from 1920 to today</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Time Machine" }]} />
          <div className="mt-6" style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "#e94560", letterSpacing: "2px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px" }}>On October 19 1987 — Black Monday — the Dow Jones fell 22.6% in a single day. Gas cost $0.95 per gallon. The #1 song was Bad by Michael Jackson. A movie ticket cost $3.91. A new home cost an average of $104,500. Every date in history tells a story. What happened on your date?</p>
          </div>
          <p className="mt-4 leading-relaxed" style={{ color: "#a8a8b3", fontSize: "14px" }}>The Dayblip Time Machine lets you look up any date from 1920 to today and see what life was like at that moment. Gas prices food costs movie tickets average home prices and major world events are all sourced from historical records government data and news archives. Use it to explore your birthday anniversary the day you were hired or any historically significant date.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <label className="block text-sm font-semibold text-white mb-2">Enter any date from 1920 to today</label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="date"
                value={date}
                min="1920-01-01"
                max={new Date().toISOString().split("T")[0]}
                onChange={e => setDate(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
              />
              <button
                onClick={go}
                disabled={!date}
                className="rounded-lg px-6 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#e94560" }}
              >
                Travel to That Date →
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 text-lg">Popular Historical Dates</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {POPULAR_DATES.map(d => (
                <button
                  key={d.date}
                  onClick={() => router.push(`/time-machine/${d.date}`)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#e94560]"
                >
                  <span className="text-3xl">{d.emoji}</span>
                  <span className="text-xs font-semibold text-white">{d.label}</span>
                  <span className="text-xs text-[#a8a8b3]">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          <ShareButtons
            text="Travel back to any date in history and see what life was like. Gas prices, food costs, world events, #1 songs — free:"
            url="https://www.dayblip.com/time-machine"
            title="Historical Date Time Machine"
          />

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
