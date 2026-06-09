"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

type Situation = "remote" | "hybrid" | "office"
type Transport  = "car"    | "transit" | "both"

// ─── Pure helpers (module scope) ─────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}
function fvMonthly(monthly: number, months: number, r = 0.07) {
  const rm = r / 12
  return monthly * ((Math.pow(1 + rm, months) - 1) / rm)
}

interface Result {
  situation: Situation; netSavings: number; pretaxEquivalent: number
  commuteCost: number; lunchSavings: number; coffeeSavings: number
  clothingCost: number; wfhExtraCosts: number
  commuteHoursPerYear: number; commuteDaysPerYear: number; commuteMiles: number
}

// All args explicit — no closure over component state
function computeResult(
  situation: Situation, daysInOffice: number, commuteMiles: number,
  transport: Transport, gasPrice: number, mpg: number, monthlyPass: number,
  lunchDays: number, lunchCost: number, homeLunchCost: number,
  coffeeDays: number, coffeeCost: number,
  wardrobe: number, dryCleaning: number,
  utilities: number, internet: number, equipment: number,
): Result {
  const workDaysPerYear   = 250
  const officeDaysPerYear = daysInOffice * (workDaysPerYear / 5)

  let annualFuel    = 0
  let annualTransit = 0
  if (transport === "car"     || transport === "both") annualFuel    = (commuteMiles * 2 * officeDaysPerYear) / mpg * gasPrice
  if (transport === "transit" || transport === "both") annualTransit = monthlyPass * 12 * (daysInOffice / 5)
  const commuteCost   = Math.round(annualFuel + annualTransit)
  const lunchSavings  = Math.round((lunchCost - homeLunchCost) * lunchDays * (officeDaysPerYear / 5))
  const coffeeSavings = Math.round(coffeeCost * coffeeDays * (officeDaysPerYear / 5))
  const clothingCost  = wardrobe + dryCleaning
  const wfhExtraCosts = Math.round((utilities + internet) * 12 + equipment)

  let netSavings = Math.round(commuteCost + lunchSavings + coffeeSavings + clothingCost - wfhExtraCosts)
  if (situation === "hybrid") netSavings = Math.round(netSavings * (1 - daysInOffice / 5))

  const pretaxEquivalent   = Math.round(netSavings / 0.75)
  const commuteHoursPerYear = Math.round((commuteMiles / 30 * 2) * officeDaysPerYear)
  const commuteDaysPerYear  = +(commuteHoursPerYear / 24).toFixed(1)

  return {
    situation, netSavings, pretaxEquivalent, commuteCost, lunchSavings,
    coffeeSavings, clothingCost, wfhExtraCosts, commuteHoursPerYear,
    commuteDaysPerYear, commuteMiles,
  }
}

function situationLabel(net: number) {
  if (net > 10000) return { text: "🟢 Remote work is a massive financial benefit for you", color: "#15803d" }
  if (net >= 3000) return { text: "🟡 Remote work provides meaningful savings worth negotiating for", color: "#d97706" }
  if (net >= 0)    return { text: "🟠 Small savings — remote work has modest financial benefit", color: "#ea580c" }
  return             { text: "🔴 Office work may have financial advantages in your situation", color: "#dc2626" }
}

// ─── Reusable input components (module scope — never remounts on parent render) ─
function NumField({
  label, value, onChange, prefix, step, min,
}: {
  label: string; value: string
  onChange: (v: string) => void
  prefix?: string; step?: string; min?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input
          type="number"
          min={min ?? "0"}
          step={step ?? "1"}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none"
        />
      </div>
    </label>
  )
}

function SituationBtn({
  val, label, current, onChange,
}: {
  val: Situation; label: string; current: Situation; onChange: (v: Situation) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(val)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        current === val
          ? "bg-[#e94560] text-white"
          : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}

function TransportBtn({
  val, label, current, onChange,
}: {
  val: Transport; label: string; current: Transport; onChange: (v: Transport) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(val)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        current === val
          ? "bg-[#e94560] text-white"
          : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WFHCalculatorPage() {
  // String state keeps inputs editable (no controlled-input conflicts)
  const [situation,    setSituation]    = useState<Situation>("remote")
  const [daysInOffice, setDaysInOffice] = useState(3)
  const [commuteMiles, setCommuteMiles] = useState("15")
  const [transport,    setTransport]    = useState<Transport>("car")
  const [gasPrice,     setGasPrice]     = useState("3.50")
  const [mpg,          setMpg]          = useState("28")
  const [monthlyPass,  setMonthlyPass]  = useState("120")
  const [lunchDays,    setLunchDays]    = useState("3")
  const [lunchCost,    setLunchCost]    = useState("15")
  const [homeLunchCost,setHomeLunchCost]= useState("5")
  const [coffeeDays,   setCoffeeDays]   = useState("5")
  const [coffeeCost,   setCoffeeCost]   = useState("5.50")
  const [wardrobe,     setWardrobe]     = useState("800")
  const [dryCleaning,  setDryCleaning]  = useState("150")
  const [utilities,    setUtilities]    = useState("60")
  const [internet,     setInternet]     = useState("25")
  const [equipment,    setEquipment]    = useState("150")
  const [result,       setResult]       = useState<Result | null>(null)

  // Derive office days from situation
  const officeDays = situation === "remote" ? 0 : situation === "office" ? 5 : daysInOffice
  const showCommute = situation !== "remote"

  // Run calculation from current React state (button click)
  function handleCalc(push = true) {
    const res = computeResult(
      situation,
      officeDays,
      parseFloat(commuteMiles) || 0,
      transport,
      parseFloat(gasPrice)      || 3.5,
      parseFloat(mpg)           || 28,
      parseFloat(monthlyPass)   || 0,
      parseFloat(lunchDays)     || 0,
      parseFloat(lunchCost)     || 0,
      parseFloat(homeLunchCost) || 0,
      parseFloat(coffeeDays)    || 0,
      parseFloat(coffeeCost)    || 0,
      parseFloat(wardrobe)      || 0,
      parseFloat(dryCleaning)   || 0,
      parseFloat(utilities)     || 0,
      parseFloat(internet)      || 0,
      parseFloat(equipment)     || 0,
    )
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState(
        {},
        "",
        `?situation=${situation}&commute=${commuteMiles}&mpg=${mpg}&gas=${gasPrice}&lunches=${lunchDays}&coffees=${coffeeDays}&wardrobe=${wardrobe}`,
      )
    }
  }

  // URL-param load — calculate directly from param strings, no setTimeout stale closure
  useEffect(() => {
    if (typeof window === "undefined") return
    const p   = new URLSearchParams(window.location.search)
    const sit = p.get("situation") as Situation | null
    if (!sit) return

    const cm  = p.get("commute")  ?? "15"
    const mpgV = p.get("mpg")    ?? "28"
    const gasV = p.get("gas")    ?? "3.50"
    const lunV = p.get("lunches") ?? "3"
    const cofV = p.get("coffees") ?? "5"
    const wrdV = p.get("wardrobe") ?? "800"

    // Set all state from params
    setSituation(sit)
    setCommuteMiles(cm)
    setMpg(mpgV)
    setGasPrice(gasV)
    setLunchDays(lunV)
    setCoffeeDays(cofV)
    setWardrobe(wrdV)

    // Calculate immediately with the raw param strings — no stale closures
    const od  = sit === "remote" ? 0 : sit === "office" ? 5 : 3
    const res = computeResult(
      sit, od,
      parseFloat(cm)   || 0,   "car",
      parseFloat(gasV) || 3.5, parseFloat(mpgV) || 28, 120,
      parseFloat(lunV) || 0,   15, 5,
      parseFloat(cofV) || 0,   5.5,
      parseFloat(wrdV) || 0,   150, 60, 25, 150,
    )
    setResult(res)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result
    ? `https://www.dayblip.com/tools/wfh-calculator?situation=${situation}&commute=${commuteMiles}`
    : ""
  const shareText = result
    ? `Working from home saves me ${fmt(Math.abs(result.netSavings))}/year!\nThat is equivalent to a ${fmt(result.pretaxEquivalent)}/year salary raise!\nCalculate your WFH value:`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Work From Home Savings Calculator", "Calculate the true financial value of working from home versus the office. See exactly how much remote work saves or costs you per year.", "https://www.dayblip.com/tools/wfh-calculator", "FinanceApplication"),
        faqSchema([
          { question: "How much does working from home save?", answer: "The average remote worker saves $2,000-$7,000 per year compared to office workers when accounting for commute costs, work lunches, work clothing and coffee." },
          { question: "Is working from home financially better?", answer: "For most workers yes. Remote work eliminates commute costs, reduces food and clothing expenses, and is equivalent to a salary raise of 10-15% for many workers." },
          { question: "How much does commuting cost per year?", answer: "The average American commuter spends $2,000-$5,000 per year on transportation, work food and clothing. A 30-minute commute each way costs roughly 250 hours of unpaid time annually." },
        ]),
        howToSchema("How to Calculate Your WFH Savings", "Calculate your remote work savings per year", [
          "Select your work situation — remote hybrid or office",
          "Enter commute distance and transport method",
          "Enter work food and coffee spending",
          "Enter clothing and dry cleaning costs",
          "Enter any WFH extra costs",
          "Click Calculate My Savings for full breakdown",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "WFH Calculator", url: "https://www.dayblip.com/tools/wfh-calculator" },
        ]),
      ]} />
      {/* ── Hero ── */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}
      >
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">
            How Much Does Remote Work Save or Cost You?
          </h1>
          <p className="text-[#a8a8b3]">
            Calculate the true financial value of working from home vs office
          </p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average remote worker saves $2,500–$7,000 per year compared to office workers. A typical commuter spends $3,000–$5,000 annually on transportation, work lunches, clothing and coffee. Working from home eliminates most of these costs and is equivalent to a $3,500–$9,000 pre-tax salary raise for the average American worker.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The true financial value of remote work goes beyond eliminating commute costs. It includes savings on work lunches, coffee, professional clothing and dry cleaning — offset by small increases in home utility and internet costs. This calculator gives you the exact net annual figure for your specific commute and spending patterns.</p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "WFH Savings Calculator" }
          ]} />

          {/* Situation toggle */}
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Your work situation</div>
            <div className="flex gap-2">
              <SituationBtn val="remote" label="Fully Remote" current={situation} onChange={setSituation} />
              <SituationBtn val="hybrid" label="Hybrid"       current={situation} onChange={setSituation} />
              <SituationBtn val="office" label="In Office"    current={situation} onChange={setSituation} />
            </div>
          </div>

          {/* Hybrid: days per week */}
          {situation === "hybrid" && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">
                Days in office per week: <span className="text-[#e94560]">{daysInOffice}</span>
              </span>
              <input
                type="range" min={1} max={4} value={daysInOffice}
                onChange={e => setDaysInOffice(parseInt(e.target.value, 10))}
                className="accent-[#e94560]"
              />
            </label>
          )}

          {/* Commute (hidden for fully remote) */}
          {showCommute && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-4">
              <div className="text-sm font-bold text-white">🚗 Commute costs</div>

              <NumField
                label="Commute distance (miles one way)"
                value={commuteMiles}
                onChange={setCommuteMiles}
              />

              <div>
                <div className="mb-1 text-sm font-semibold text-white">Transport method</div>
                <div className="flex gap-2">
                  <TransportBtn val="car"     label="Car"            current={transport} onChange={setTransport} />
                  <TransportBtn val="transit" label="Public Transit" current={transport} onChange={setTransport} />
                  <TransportBtn val="both"    label="Both"           current={transport} onChange={setTransport} />
                </div>
              </div>

              {(transport === "car" || transport === "both") && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <NumField label="Gas price ($/gal)" value={gasPrice} onChange={setGasPrice} prefix="$" step="0.01" />
                  <NumField label="Car MPG"            value={mpg}      onChange={setMpg} />
                </div>
              )}
              {(transport === "transit" || transport === "both") && (
                <NumField label="Monthly transit pass" value={monthlyPass} onChange={setMonthlyPass} prefix="$" />
              )}
            </div>
          )}

          {/* Food & coffee */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-4">
            <div className="text-sm font-bold text-white">☕ Food &amp; coffee</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <NumField label="Work lunches bought/week" value={lunchDays}     onChange={setLunchDays} />
              <NumField label="Avg lunch cost"           value={lunchCost}     onChange={setLunchCost}     prefix="$" />
              <NumField label="Home lunch cost"          value={homeLunchCost} onChange={setHomeLunchCost} prefix="$" />
              <NumField label="Work coffees/week"        value={coffeeDays}    onChange={setCoffeeDays} />
              <NumField label="Avg coffee cost"          value={coffeeCost}    onChange={setCoffeeCost}    prefix="$" step="0.01" />
            </div>
          </div>

          {/* Clothing */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
            <div className="text-sm font-bold text-white">👔 Clothing (annual)</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumField label="Work wardrobe spend" value={wardrobe}    onChange={setWardrobe}    prefix="$" />
              <NumField label="Dry cleaning"         value={dryCleaning} onChange={setDryCleaning} prefix="$" />
            </div>
          </div>

          {/* WFH extra costs */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
            <div className="text-sm font-bold text-white">🏠 WFH extra costs (monthly unless noted)</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <NumField label="Utility increase/mo"     value={utilities} onChange={setUtilities} prefix="$" />
              <NumField label="Internet upgrade/mo"     value={internet}  onChange={setInternet}  prefix="$" />
              <NumField label="Home office equip/yr"    value={equipment} onChange={setEquipment} prefix="$" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCalc()}
            className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Calculate My Savings
          </button>

          {/* ── Results ── */}
          {result && (() => {
            const lbl      = situationLabel(result.netSavings)
            const positive = result.netSavings >= 0
            return (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                  <div className="text-sm text-[#a8a8b3]">
                    {positive ? "Remote work saves you:" : "Going to office costs you:"}
                  </div>
                  <div
                    className="my-2 text-6xl font-black"
                    style={{ color: positive ? "#4ade80" : "#e94560" }}
                  >
                    {fmt(Math.abs(result.netSavings))}
                    <span className="text-2xl">/year</span>
                  </div>
                  <div className="mt-2 text-sm text-white">
                    = <span className="font-bold text-[#F9A825]">{fmt(result.pretaxEquivalent)}/year salary raise</span>{" "}
                    (post-tax equivalent)
                  </div>
                </div>

                <div
                  className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center font-semibold text-sm"
                  style={{ color: lbl.color }}
                >
                  {lbl.text}
                </div>

                {/* Breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-3">Cost breakdown</div>
                  <table className="w-full">
                    <tbody className="text-[#a8a8b3]">
                      {([
                        ["Commute costs saved", result.commuteCost],
                        ["Lunch savings",        result.lunchSavings],
                        ["Coffee savings",       result.coffeeSavings],
                        ["Clothing savings",     result.clothingCost],
                      ] as [string, number][]).map(([l, v]) => (
                        <tr key={l} className="border-b border-[#0f3460]">
                          <td className="py-1.5">{l}</td>
                          <td className="py-1.5 text-right font-bold text-[#4ade80]">+{fmt(v)}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-[#0f3460]">
                        <td className="py-1.5">WFH extra costs</td>
                        <td className="py-1.5 text-right font-bold text-[#e94560]">−{fmt(result.wfhExtraCosts)}</td>
                      </tr>
                      <tr className="font-bold text-white">
                        <td className="pt-2">Net annual</td>
                        <td className="pt-2 text-right" style={{ color: positive ? "#4ade80" : "#e94560" }}>
                          {positive ? "+" : "−"}{fmt(Math.abs(result.netSavings))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Time saved */}
                {result.commuteMiles > 0 && (
                  <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                    <div className="font-bold text-white mb-1">⏱️ Time saved not commuting</div>
                    <p>
                      <span className="font-bold text-[#4FC3F7]">
                        {result.commuteHoursPerYear.toLocaleString()} hours
                      </span>{" "}
                      per year
                    </p>
                    <p className="mt-1 text-[#a8a8b3]">
                      ={" "}
                      <span className="font-bold text-white">{result.commuteDaysPerYear} full days</span>{" "}
                      of your life annually
                    </p>
                  </div>
                )}

                {/* Over time */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-2">📈 Over time</div>
                  {([[5, 60], [10, 120]] as [number, number][]).map(([yr, mo]) => (
                    <p key={yr} className="mt-1 text-[#a8a8b3]">
                      <span className="font-bold text-white">{yr} years:</span>{" "}
                      {fmt(result.netSavings * yr)} saved ·{" "}
                      {fmt(fvMonthly(result.netSavings / 12, mo))} if invested at 7%
                    </p>
                  ))}
                </div>

                <ShareButtons
                  text={shareText}
                  url={shareUrl}
                  title="Work From Home Savings Calculator"
                />
                <RelatedTools tools={[
                  { emoji: "🌐", title: "Time Zone Converter", desc: "Convert time zones for remote teams", href: "/tools/timezone-converter" },
                  { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
                  { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
                  { emoji: "💼", title: "Side Hustle Potential", desc: "What could you earn with your skills?", href: "/tools/side-hustle" },
                  { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
                ]} />
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
