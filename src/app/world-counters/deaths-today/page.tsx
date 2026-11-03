import Link from "next/link"
import Counter from "./Counter"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// Re-render on the server every 60s so crawlers read near-current values.
export const revalidate = 60

const URL = "https://www.dayblip.com/world-counters/deaths-today"
const DESCRIPTION = "See how many people have died worldwide today, live. About 2 deaths every second, from UN data on 63.1 million yearly deaths. Free, no signup required."

// WHO global health estimates, 2023: selected leading causes (millions of deaths).
const WORLD_CAUSES: Array<[string, string]> = [
  ["Ischaemic heart disease", "9.5 million"],
  ["Chronic obstructive pulmonary disease", "3.6 million"],
  ["Lower respiratory infections", "2.7 million"],
  ["Alzheimer disease and other dementias", "2.1 million"],
  ["Diabetes", "2.0 million"],
  ["Trachea, bronchus and lung cancers", "1.8 million"],
]

// CDC NCHS Data Brief No. 521, final 2023 US deaths.
const US_CAUSES: Array<[string, number]> = [
  ["Diseases of the heart", 680_981],
  ["Cancer", 613_352],
  ["Accidents (unintentional injuries)", 222_698],
  ["Stroke", 162_639],
  ["Chronic lower respiratory diseases", 145_357],
  ["Alzheimer disease", 114_034],
  ["Diabetes", 95_190],
  ["Kidney disease", 55_253],
  ["Chronic liver disease and cirrhosis", 52_222],
  ["COVID-19", 49_932],
]
const US_TOTAL_2023 = 3_090_964

const FAQS = [
  {
    question: "How many people die every day?",
    answer: "About 172,800 people die each day worldwide, based on 63.1 million deaths a year in UN estimates. That is about 7,200 an hour and 2 every second.",
  },
  {
    question: "How many people die every second?",
    answer: "About 2. The UN estimate of 63.1 million deaths a year works out to 2.00 deaths per second, or 120 per minute.",
  },
  {
    question: "How many people are born for every person who dies?",
    answer: "About 2.1. The UN estimates 132.4 million births and 63.1 million deaths a year, so the world population grows by about 69.3 million people a year.",
  },
  {
    question: "What is the leading cause of death in the world?",
    answer: "Ischaemic heart disease. WHO estimates it caused about 9.5 million deaths in 2023, around 16% of all deaths.",
  },
  {
    question: "How accurate is the death counter?",
    answer: "It shows an average, not a live registry. No agency counts deaths worldwide in real time, so the counter multiplies a yearly UN estimate by the seconds elapsed since local midnight.",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema("Deaths Today: Live Global Death Counter", DESCRIPTION, URL, "UtilitiesApplication", "2026-11-03"),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "World Counters", url: "https://www.dayblip.com/world-counters" },
            { name: "Deaths Today", url: URL },
          ]),
        ]}
      />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🕯️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Deaths Today: Live Global Counter</h1>
          <p className="text-[#a8a8b3]">About 2 people die every second somewhere in the world</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "World Counters", href: "/world-counters" }, { label: "Deaths Today" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
              Quick Answer
            </div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              About 172,800 people die worldwide each day, which is 2 every second. That is based on 63.1 million deaths a year in
              UN estimates. About 2.1 babies are born for every person who dies. In the US, 3,090,964 people died in 2023, about
              8,470 a day.
            </p>
          </div>

          <Counter initialNow={Date.now()} />

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>Leading causes of death worldwide</h2>
            <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: "0 0 12px" }}>
              Heart disease causes more deaths than any other condition. These are WHO estimates for 2023, listed from most to
              fewest deaths among the causes shown.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560" }}>Cause</th>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560" }}>Deaths, 2023</th>
                  </tr>
                </thead>
                <tbody>
                  {WORLD_CAUSES.map(([c, d], i) => (
                    <tr key={c} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{c}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: "#a8a8b3", fontSize: "13px", margin: "8px 0 0" }}>
              Source: World Health Organization, global health estimates 2023. Stroke is also a leading cause but is not listed
              because Dayblip could not confirm its 2023 figure.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>Leading causes of death in the US</h2>
            <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: "0 0 12px" }}>
              {US_TOTAL_2023.toLocaleString("en-US")} people died in the US in 2023. Heart disease and cancer together caused
              {" "}{(((US_CAUSES[0][1] + US_CAUSES[1][1]) / US_TOTAL_2023) * 100).toFixed(0)}% of them.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
                <thead>
                  <tr>
                    {["Rank", "Cause", "Deaths, 2023", "Share of US deaths"].map(h => (
                      <th key={h} scope="col" style={{ textAlign: "left", padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {US_CAUSES.map(([c, d], i) => (
                    <tr key={c} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{i + 1}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{c}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{d.toLocaleString("en-US")}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>{((d / US_TOTAL_2023) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: "#a8a8b3", fontSize: "13px", margin: "8px 0 0" }}>
              Source: CDC National Center for Health Statistics, Mortality in the United States, 2023 (Data Brief No. 521). The
              Census Bureau population clock uses a projected rate for the current year, so it differs from this final count.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 16px" }}>Frequently asked questions</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {FAQS.map(f => (
                <div key={f.question}>
                  <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600, margin: "0 0 6px" }}>{f.question}</h3>
                  <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <ShareButtons
            text="About 2 people die every second worldwide. Watch the live death counter:"
            url={URL}
            title="Deaths Today: Live Global Death Counter"
          />

          <div>
            <MethodologyNote text="The counter multiplies 63.1 million yearly deaths (UN World Population Prospects 2024, 2025 estimates) by the seconds since local midnight, using a 365.25-day year. It shows an average rate, not a registry count. Cause-of-death tables use WHO 2023 estimates and final CDC 2023 US data." />
            <LastUpdated date="November 2026" />
            <p style={{ color: "#a8a8b3", fontSize: "14px", marginTop: "12px" }}>
              <Link href="/data/world-population" style={{ color: "#e94560", textDecoration: "underline" }}>Download the births and deaths rates as a CSV</Link>.
            </p>
          </div>

          <RelatedTools
            tools={[
              { emoji: "👶", title: "Births Today", desc: "Live count of babies born worldwide", href: "/world-counters/births-today" },
              { emoji: "🌍", title: "World Population Counter", desc: "Live world population estimate", href: "/world-counters/population" },
              { emoji: "🇺🇸", title: "US Population Counter", desc: "Live US births, deaths and growth", href: "/world-counters/us-population" },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
