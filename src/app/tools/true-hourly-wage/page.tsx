"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import { generateShareImage } from "@/utils/generateShareImage"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"
import GeoAnswerBlock from "@/components/GeoAnswerBlock"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmt2(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational calculation for perspective.</strong> Not all work expenses are deductible.
  </div>
)

interface Result {
  salary: number; officialHourly: number; trueHourly: number; diff: number; pctLess: number
  officialHours: number; extraHours: number; totalHours: number; extraDays: number
  commute: number; clothes: number; lunches: number; other: number; totalCosts: number
  netSalary: number
}

export default function TrueHourlyWagePage() {
  const [salary, setSalary] = useState("75000")
  const [hours, setHours] = useState("40")
  const [weeks, setWeeks] = useState("50")
  const [commuteMin, setCommuteMin] = useState("30")
  const [prepMin, setPrepMin] = useState("30")
  const [lunchMin, setLunchMin] = useState("0")
  const [decompMin, setDecompMin] = useState("20")
  const [commuteCost, setCommuteCost] = useState("2400")
  const [clothesCost, setClothesCost] = useState("800")
  const [lunchCost, setLunchCost] = useState("1200")
  const [devCost, setDevCost] = useState("0")
  const [otherCost, setOtherCost] = useState("0")
  const [result, setResult] = useState<Result | null>(null)

  function compute(): Result {
    const sal = parseFloat(salary) || 0
    const hpw = parseFloat(hours) || 0
    const wks = parseFloat(weeks) || 0
    const officialHours = wks * hpw
    const officialHourly = officialHours > 0 ? sal / officialHours : 0
    const extraHoursPerDay = ((parseFloat(commuteMin) || 0) * 2 + (parseFloat(prepMin) || 0) + (parseFloat(lunchMin) || 0) + (parseFloat(decompMin) || 0)) / 60
    const extraHours = extraHoursPerDay * (wks * 5)
    const totalHours = officialHours + extraHours
    const commute = parseFloat(commuteCost) || 0
    const clothes = parseFloat(clothesCost) || 0
    const lunches = parseFloat(lunchCost) || 0
    const other = (parseFloat(devCost) || 0) + (parseFloat(otherCost) || 0)
    const totalCosts = commute + clothes + lunches + other
    const netSalary = sal - totalCosts
    const trueHourly = totalHours > 0 ? netSalary / totalHours : 0
    return {
      salary: sal, officialHourly, trueHourly, diff: officialHourly - trueHourly,
      pctLess: officialHourly > 0 ? ((officialHourly - trueHourly) / officialHourly) * 100 : 0,
      officialHours, extraHours, totalHours, extraDays: extraHours / 8,
      commute, clothes, lunches, other, totalCosts, netSalary,
    }
  }

  function runCalc(push = true) {
    const res = compute()
    setResult(res)
    if (push && typeof window !== "undefined") {
      const totalCosts = (parseFloat(commuteCost) || 0) + (parseFloat(clothesCost) || 0) + (parseFloat(lunchCost) || 0) + (parseFloat(devCost) || 0) + (parseFloat(otherCost) || 0)
      window.history.pushState({}, "", `?salary=${parseFloat(salary) || 0}&hours=${parseFloat(hours) || 0}&commute=${parseFloat(commuteMin) || 0}&prep=${parseFloat(prepMin) || 0}&costs=${totalCosts}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("salary")) {
      if (p.get("salary")) setSalary(p.get("salary")!)
      if (p.get("hours")) setHours(p.get("hours")!)
      if (p.get("commute")) setCommuteMin(p.get("commute")!)
      if (p.get("prep")) setPrepMin(p.get("prep")!)
      setTimeout(() => runCalc(false), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/true-hourly-wage?salary=${result.salary}&hours=${parseFloat(hours) || 0}` : ""
  const shareText = result ? `My ${fmt(result.salary)} salary actually pays ${fmt2(result.trueHourly)}/hour after commute and work costs! That is ${fmt2(result.diff)} less per hour than I thought 😮 (Educational only)` : ""

  function downloadShareImage() {
    if (!result) return
    void generateShareImage({
      title: "My True Hourly Wage",
      primaryStat: `$${result.trueHourly.toFixed(2)}`,
      primaryLabel: "true hourly rate",
      stats: [
        { label: "Stated salary", value: `$${result.salary.toLocaleString()}` },
        { label: "Nominal hourly", value: `$${result.officialHourly.toFixed(2)}` },
        { label: "Actually earning", value: `${result.pctLess.toFixed(1)}% less than you think` },
      ],
      tagline: "Know what you are really worth.",
      toolUrl: "dayblip.com/tools/true-hourly-wage",
      filename: "dayblip-true-hourly-wage.png",
    })
  }

  const numField = (label: string, value: string, set: (v: string) => void, prefix?: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-white">{label}</span>
      <div className="flex items-center gap-1">{prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input type="number" value={value} onChange={e => set(e.target.value)}
          className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></div>
    </label>
  )

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"WebApplication","name":"True Hourly Wage Calculator","url":"https://www.dayblip.com/tools/true-hourly-wage","description":"Calculate your real hourly wage after accounting for commute time, work expenses, and unpaid overtime.","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is a true hourly wage?","acceptedAnswer":{"@type":"Answer","text":"True hourly wage is your actual compensation per hour of time your job consumes — including commute, prep time, and unpaid overtime — minus all work-related expenses like commuting costs, clothing, and bought lunches. It is almost always lower than your stated hourly rate."}},{"@type":"Question","name":"How do you calculate true hourly wage?","acceptedAnswer":{"@type":"Answer","text":"Start with take-home pay after tax. Subtract all annual work-required costs including commuting, clothing, and food. Add up all hours the job consumes including commute and overtime. Divide adjusted income by total hours."}},{"@type":"Question","name":"Why does true hourly wage matter?","acceptedAnswer":{"@type":"Answer","text":"True hourly wage changes how you evaluate job offers, raises, remote work, and side income. A $90,000 job with a long commute may pay less per true hour than an $80,000 job close to home. Remote work saves both money and time often equivalent to a 10 to 15 percent salary increase."}},{"@type":"Question","name":"What work expenses should I include?","acceptedAnswer":{"@type":"Answer","text":"Include commuting costs such as gas, transit, and parking; work clothing and dry cleaning; bought lunches and convenience dinners on late nights; professional development not covered by your employer; and any tools or software you pay for personally."}}]}) }} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">True Hourly Wage Calculator — What Does Your Job Really Pay?</h1>
          <p className="text-[#a8a8b3]">Calculate your true hourly wage after commute time, prep time and work costs</p>
          <a href="/blog/true-hourly-wage" style={{ fontSize: "13px", color: "#e94560", marginTop: "8px", display: "inline-block" }}>Read: What Your Salary Actually Pays Per Hour →</a>
        </div>
      </section>

      <section className="px-6 pt-8 pb-0 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <GeoAnswerBlock answer="To calculate your true hourly wage: subtract all work-related expenses and add all work-related time to get your real rate. A $60,000 salary with $400/month in commuting costs and 50-hour work weeks yields a true hourly wage of $18.46 — not the $28.85 your contract suggests. Use the interactive tool below." />
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Your true hourly wage is significantly lower than your official rate. A $75,000 salary appears to pay $36/hour but after deducting unpaid commute time, work prep time, commute costs, work lunches and clothing the real rate drops to approximately $28/hour — 22% less. The longer your commute the lower your true hourly rate.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Your official salary divides your pay by contracted work hours only. But employment requires additional unpaid time — commuting, preparing for work, decompressing after work — and additional costs beyond what you would spend working from home. True hourly wage accounts for all of these to show your real compensation rate.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "True Hourly Wage" }
          ]} />
          <LastUpdated />
          {DISCLAIMER}

          <div className="space-y-4">
            <h3 className="font-bold text-white">Your salary</h3>
            <div className="grid grid-cols-3 gap-3">
              {numField("Annual salary", salary, setSalary, "$")}
              {numField("Hours / week", hours, setHours)}
              {numField("Weeks / year", weeks, setWeeks)}
            </div>
            <h3 className="font-bold text-white">Unpaid work-related time (per workday, minutes)</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {numField("Commute (each way)", commuteMin, setCommuteMin)}
              {numField("Getting ready", prepMin, setPrepMin)}
              {numField("Unpaid lunch", lunchMin, setLunchMin)}
              {numField("Decompression", decompMin, setDecompMin)}
            </div>
            <h3 className="font-bold text-white">Work-related annual costs</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {numField("Commute cost", commuteCost, setCommuteCost, "$")}
              {numField("Work clothes", clothesCost, setClothesCost, "$")}
              {numField("Work lunches", lunchCost, setLunchCost, "$")}
              {numField("Pro development", devCost, setDevCost, "$")}
              {numField("Other expenses", otherCost, setOtherCost, "$")}
            </div>
            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate My True Wage
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><div className="text-2xl font-black text-white">{fmt2(result.officialHourly)}</div><div className="text-xs text-[#a8a8b3]">Official rate</div></div>
                  <div><div className="text-2xl font-black text-[#e94560]">{fmt2(result.trueHourly)}</div><div className="text-xs text-[#a8a8b3]">True rate</div></div>
                  <div><div className="text-2xl font-black text-[#FF6B6B]">{fmt2(result.diff)}</div><div className="text-xs text-[#a8a8b3]">Difference</div></div>
                </div>
                <p className="mt-3 text-center font-bold text-[#FF6B6B]">You earn {result.pctLess.toFixed(0)}% less than you think</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-2 font-bold text-white">Breakdown</h3>
                <ul className="space-y-1.5 text-[#a8a8b3]">
                  <li className="flex justify-between"><span>Official hours/year</span><span className="text-white">{Math.round(result.officialHours).toLocaleString()}</span></li>
                  <li className="flex justify-between"><span>Extra unpaid hours</span><span className="text-white">{Math.round(result.extraHours).toLocaleString()}</span></li>
                  <li className="flex justify-between"><span>Total hours committed</span><span className="text-white">{Math.round(result.totalHours).toLocaleString()}</span></li>
                  <li className="flex justify-between"><span>Extra days/year for job</span><span className="text-white">{result.extraDays.toFixed(1)}</span></li>
                </ul>
                <h3 className="mb-2 mt-4 font-bold text-white">Annual costs</h3>
                <ul className="space-y-1.5 text-[#a8a8b3]">
                  <li className="flex justify-between"><span>Commute</span><span className="text-white">{fmt(result.commute)}</span></li>
                  <li className="flex justify-between"><span>Clothes</span><span className="text-white">{fmt(result.clothes)}</span></li>
                  <li className="flex justify-between"><span>Lunches</span><span className="text-white">{fmt(result.lunches)}</span></li>
                  <li className="flex justify-between"><span>Other</span><span className="text-white">{fmt(result.other)}</span></li>
                  <li className="flex justify-between border-t border-[#0f3460] pt-1.5 font-bold"><span className="text-white">Total costs</span><span className="text-[#FF6B6B]">{fmt(result.totalCosts)}</span></li>
                  <li className="flex justify-between"><span>Net salary after costs</span><span className="text-white">{fmt(result.netSalary)}</span></li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-6 text-sm text-white">
                <p>Over a 40-year career this gap costs you <span className="font-bold text-[#FF6B6B]">{fmt(result.diff * result.totalHours * 40)}</span> in real compensation compared to your official rate.</p>
                <p className="mt-2">At your true hourly rate of {fmt2(result.trueHourly)}: your job pays like <span className="font-bold text-[#e94560]">{fmt(result.trueHourly * result.officialHours)}</span> not {fmt(result.salary)}.</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="True Hourly Wage Calculator" />
              <button
                onClick={downloadShareImage}
                style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
              >
                📸 Download Your Result
              </button>
              {DISCLAIMER}
            </div>
          )}
          {/* Embed this tool */}
          <div style={{
            textAlign: "center",
            marginTop: "32px",
            marginBottom: "16px",
            padding: "16px",
            background: "#1e2d4a",
            borderRadius: "8px",
            border: "1px solid #2a3a5a",
          }}>
            <p style={{ color: "#a8a8b3", fontSize: "14px", margin: "0 0 8px 0" }}>
              Want to add this tool to your website?
            </p>
            <a
              href="/embed"
              style={{ color: "#e94560", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
            >
              Get the free embed code →
            </a>
          </div>
          <MethodologyNote text="Divides annual compensation by total hours committed to work — including commute, preparation, and decompression time — then subtracts annualized work-related costs." />
          <RelatedTools tools={[
            { emoji: "⏱️", title: "Overtime Pay Calculator", desc: "How much do you earn working extra hours?", href: "/finance/overtime-calculator" },
            { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
            { emoji: "🏠", title: "WFH Savings Calculator", desc: "What is remote work really worth?", href: "/tools/wfh-calculator" },
            { emoji: "💼", title: "Side Hustle Potential", desc: "What could you earn with your skills?", href: "/tools/side-hustle" },
            { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
          ]} />
          <FAQAccordion items={[
            { q: "What is a true hourly wage?", a: "True hourly wage is your actual compensation per hour of time your job consumes — including commute, prep time, and unpaid overtime — minus all work-related expenses like commuting costs, clothing, and bought lunches. It is almost always lower than your stated hourly rate." },
            { q: "How do you calculate true hourly wage?", a: "Start with take-home pay after tax. Subtract all annual work-required costs including commuting, clothing, and food. Add up all hours the job consumes including commute and overtime. Divide adjusted income by total hours." },
            { q: "Why does true hourly wage matter?", a: "True hourly wage changes how you evaluate job offers, raises, remote work, and side income. A $90,000 job with a long commute may pay less per true hour than an $80,000 job close to home. Remote work saves both money and time often equivalent to a 10 to 15 percent salary increase." },
            { q: "What work expenses should I include?", a: "Include commuting costs such as gas, transit, and parking; work clothing and dry cleaning; bought lunches and convenience dinners on late nights; professional development not covered by your employer; and any tools or software you pay for personally." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
