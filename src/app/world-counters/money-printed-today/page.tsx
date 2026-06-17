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

const PAGE_URL = "https://www.dayblip.com/world-counters/money-printed-today"

const M2_ANNUAL_GROWTH = 752_500_000_000 // $752.5 billion per year
const GROWTH_PER_SECOND = M2_ANNUAL_GROWTH / 365 / 24 / 3600

const faqItems = [
  {
    question: "How much money does the US print every day?",
    answer: "The US Bureau of Engraving and Printing produces approximately 38 million banknotes per day with a face value of about $1.22 billion. However about 90% of this replaces worn or damaged currency already in circulation rather than adding new money to the economy. The true expansion of the money supply — measured by M2 — is approximately $2.1 billion per day."
  },
  {
    question: "What is M2 money supply?",
    answer: "M2 is the Federal Reserve's broad measure of money in circulation. It includes physical cash, checking accounts, savings accounts, and money market funds. As of 2026 the US M2 money supply is approximately $21.5 trillion. When economists talk about money supply growth they are typically referring to M2 not just physical cash."
  },
  {
    question: "Does printing more money cause inflation?",
    answer: "Money supply growth can contribute to inflation when it outpaces economic growth. When more dollars chase the same amount of goods prices tend to rise. The US experienced significant inflation from 2021 to 2023 partly due to the large M2 expansion during the COVID-19 pandemic when M2 grew by over 25% in a single year."
  },
  {
    question: "Who controls how much money is printed in the US?",
    answer: "The Federal Reserve controls monetary policy including the money supply through interest rates and open market operations. The Bureau of Engraving and Printing physically produces banknotes but the Fed controls how many notes enter circulation. Congress and the Treasury Department manage fiscal policy which also affects money supply indirectly."
  },
  {
    question: "How much did the US money supply grow during COVID?",
    answer: "US M2 money supply grew from approximately $15.4 trillion in February 2020 to $21.7 trillion by April 2022 — an increase of roughly $6.3 trillion or 41% in just over two years. This was the largest peacetime expansion of the US money supply in history and contributed significantly to the inflation surge of 2021-2023."
  },
  {
    question: "Where does the money supply data come from?",
    answer: "This counter uses Federal Reserve M2 money supply data published by the Federal Reserve Bank of St. Louis (FRED database). The annual growth rate is calculated from the most recent 12-month M2 change. Physical note production figures are from the US Bureau of Engraving and Printing annual report. Source: Federal Reserve FRED — fred.stlouisfed.org"
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
    "name": "US Money Supply Growth Live Estimate — Dayblip",
    "description": "Real-time estimate of US M2 money supply growth today and this year, calculated from Federal Reserve FRED database annual M2 growth rate data.",
    "url": PAGE_URL,
    "creator": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "isAccessibleForFree": true,
    "creditText": "Data from Federal Reserve FRED database — fred.stlouisfed.org"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Money Printed Today — Live US Dollar Counter",
    "url": PAGE_URL,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "description": "Real-time US M2 money supply growth counter based on Federal Reserve FRED data, updating every second."
  }
]

const relatedTools = [
  { emoji: "🌍", title: "World Counters", desc: "Live global statistics", href: "/world-counters" },
  { emoji: "💰", title: "US National Debt", desc: "Live US debt clock", href: "/world-counters/us-national-debt" },
  { emoji: "📈", title: "Inflation Calculator", desc: "What money was worth in any year", href: "/finance/inflation" },
  { emoji: "💹", title: "Compound Interest", desc: "How money grows over time", href: "/finance/compound-interest" },
]

export default function MoneyPrintedTodayPage() {
  const [moneyToday, setMoneyToday] = useState(0)
  const [moneyThisYear, setMoneyThisYear] = useState(0)

  useEffect(() => {
    function tick() {
      const now = new Date()

      const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      const secToday = Math.floor((now.getTime() - sod.getTime()) / 1000)

      const jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
      const secThisYear = Math.floor((now.getTime() - jan1.getTime()) / 1000)

      setMoneyToday(Math.floor(secToday * GROWTH_PER_SECOND))
      setMoneyThisYear(Math.floor(secThisYear * GROWTH_PER_SECOND))
    }

    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const shareText = `The US has created $${moneyToday.toLocaleString()} in new money today. See the live counter at Dayblip 💵`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💵</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Money Printed Today</h1>
          <p className="text-[#a8a8b3]">Live US M2 money supply growth counter based on Federal Reserve FRED data</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "World Counters", href: "/world-counters" },
            { label: "Money Printed Today" }
          ]} />

          {/* Quick Answer */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#0d1b2a] p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-white text-lg font-semibold leading-snug">
              The US money supply (M2) grows by approximately $752 billion per year based on 2024-2026 Federal Reserve data — about $23,843 every second. This represents new money entering the economy through credit creation, not physical printing. The Bureau of Engraving and Printing produces about $1.22 billion in physical notes daily, mostly replacing old bills.
            </p>
            <AuthorByline variant="tool" />
          </div>

          {/* Big counter — today */}
          <div className="rounded-xl border border-[#4FC3F7]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">New Money Created Today (M2 Growth)</p>
            <div className="text-5xl md:text-6xl font-black text-[#4FC3F7] tabular-nums">${moneyToday.toLocaleString()}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">~$23,843 per second in M2 money supply growth</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-xl font-black tabular-nums text-[#4FC3F7]">${moneyThisYear.toLocaleString()}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">New money created this year</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">🏦</div>
              <div className="text-xl font-black tabular-nums text-[#F9A825]">$752.5B</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Annual M2 growth rate</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
              <div className="text-2xl mb-1">🖨️</div>
              <div className="text-xl font-black tabular-nums text-[#f87171]">$1.22B</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Physical notes printed daily</div>
            </div>
          </div>

          {/* Context note */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#0d1b2a] p-5">
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <span className="font-semibold text-white">At this rate</span> the US money supply grows by approximately $752 billion per year. The US Bureau of Engraving and Printing produces approximately 38 million physical notes per day worth approximately $1.22 billion — mostly replacing worn currency already in circulation.
            </p>
          </div>

          {/* M2 history */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">US M2 Money Supply Milestones</h2>
            <div className="space-y-2">
              {[
                { year: "2000", value: "$4.9 trillion", event: "Dot-com era" },
                { year: "2008", value: "$8.2 trillion", event: "Financial crisis" },
                { year: "2015", value: "$12.0 trillion", event: "Post-recession recovery" },
                { year: "2020 (Feb)", value: "$15.4 trillion", event: "Pre-COVID baseline" },
                { year: "2022 (Apr)", value: "$21.7 trillion", event: "COVID stimulus peak — all-time high" },
                { year: "2026", value: "~$21.5 trillion", event: "Current estimate" },
              ].map(m => (
                <div key={m.year} className="flex items-center gap-4 rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3">
                  <div className="w-20 shrink-0 text-sm font-black text-[#4FC3F7] tabular-nums">{m.year}</div>
                  <div className="w-32 shrink-0 text-white font-semibold text-sm">{m.value}</div>
                  <div className="text-[#a8a8b3] text-sm">{m.event}</div>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} />

          <ShareButtons
            text={shareText}
            url={PAGE_URL}
            title="Money Printed Today — Live US Dollar Counter"
            instagramText={`The US has created $${moneyToday.toLocaleString()} in new money today 💵 Watch the live counter → dayblip.com`}
            tiktokText={`$${moneyToday.toLocaleString()} in new US money created today 💵 Live M2 counter → dayblip.com`}
          />

          <div>
            <MethodologyNote text="The money printed counter is based on US M2 money supply growth data from the Federal Reserve Bank of St. Louis FRED database. The annual growth rate of approximately 3.5% is applied to the January 2026 M2 base of $21.5 trillion, producing an estimated annual expansion of $752.5 billion or approximately $23,843 per second. This counter measures broad money supply growth — not physical currency production. Physical note production data is from the US Bureau of Engraving and Printing. Important: money supply growth and physical printing are different things. Most modern money is created digitally through bank lending and credit expansion. Sources: Federal Reserve FRED (fred.stlouisfed.org); Bureau of Engraving and Printing (moneyfactory.gov)." />
            <LastUpdated />
          </div>

          <RelatedTools tools={relatedTools} />

          <p className="text-xs text-[#a8a8b3]/60">
            Sources: Federal Reserve Bank of St. Louis FRED database (fred.stlouisfed.org) · US Bureau of Engraving and Printing (moneyfactory.gov). Figures are statistical estimates based on annual growth rates and may vary from actual money supply changes.
          </p>
        </div>
      </section>
    </div>
  )
}
