"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

type Situation = "remote" | "hybrid" | "office"
type Transport = "car" | "transit" | "both"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fvMonthly(monthly: number, months: number, r = 0.07) {
  const rm = r / 12
  return monthly * ((Math.pow(1 + rm, months) - 1) / rm)
}

interface Result {
  situation: Situation; netSavings: number; pretaxEquivalent: number
  commuteCost: number; lunchSavings: number; coffeeSavings: number; clothingCost: number; wfhExtraCosts: number
  commuteHoursPerYear: number; commuteDaysPerYear: number
  commuteMiles: number
}

function compute(
  situation: Situation, daysInOffice: number, commuteMiles: number,
  transport: Transport, gasPrice: number, mpg: number, monthlyPass: number,
  lunchDays: number, lunchCost: number, homeLunchCost: number,
  coffeeDays: number, coffeeCost: number,
  wardrobe: number, dryCleaning: number,
  utilities: number, internet: number, equipment: number,
): Result {
  const workDaysPerYear = 250
  const officeDaysPerYear = daysInOffice * (workDaysPerYear / 5)

  let annualFuelCost = 0
  let annualTransitCost = 0
  if (transport === "car" || transport === "both") {
    annualFuelCost = (commuteMiles * 2 * officeDaysPerYear) / mpg * gasPrice
  }
  if (transport === "transit" || transport === "both") {
    annualTransitCost = monthlyPass * 12 * (daysInOffice / 5)
  }
  const commuteCost = Math.round(annualFuelCost + annualTransitCost)

  const lunchSavings = Math.round((lunchCost - homeLunchCost) * lunchDays * (officeDaysPerYear / 5))
  const coffeeSavings = Math.round(coffeeCost * coffeeDays * (officeDaysPerYear / 5))
  const clothingCost = wardrobe + dryCleaning
  const wfhExtraCosts = Math.round((utilities + internet) * 12 + equipment)

  const totalOfficeCosts = commuteCost + lunchSavings + coffeeSavings + clothingCost
  let netSavings = Math.round(totalOfficeCosts - wfhExtraCosts)

  if (situation === "hybrid") {
    const hybridRatio = daysInOffice / 5
    netSavings = Math.round(netSavings * (1 - hybridRatio))
  }

  const pretaxEquivalent = Math.round(netSavings / 0.75)
  const avgCommuteSpeedMph = 30
  const commuteHoursPerYear = Math.round((commuteMiles / avgCommuteSpeedMph * 2) * officeDaysPerYear)
  const commuteDaysPerYear = +(commuteHoursPerYear / 24).toFixed(1)

  return {
    situation, netSavings, pretaxEquivalent, commuteCost, lunchSavings,
    coffeeSavings, clothingCost, wfhExtraCosts, commuteHoursPerYear, commuteDaysPerYear, commuteMiles,
  }
}

function situationLabel(net: number) {
  if (net > 10000) return { text: "🟢 Remote work is a massive financial benefit for you", color: "#15803d" }
  if (net >= 3000) return { text: "🟡 Remote work provides meaningful savings worth negotiating for", color: "#d97706" }
  if (net >= 0)   return { text: "🟠 Small savings — remote work has modest financial benefit", color: "#ea580c" }
  return { text: "🔴 Office work may have financial advantages in your situation", color: "#dc2626" }
}

function NumField({ label, value, set, prefix, step }: { label: string; value: string; set: (v: string) => void; prefix?: string; step?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input type="number" step={step ?? "1"} value={value} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
      </div>
    </label>
  )
}

function SituationBtn({ val, label, current, onChange }: { val: Situation; label: string; current: Situation; onChange: (v: Situation) => void }) {
  return (
    <button onClick={() => onChange(val)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${current === val ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
      {label}
    </button>
  )
}

export default function WFHCalculatorPage() {
  const [situation, setSituation] = useState<Situation>("remote")
  const [daysInOffice, setDaysInOffice] = useState(3)
  const [commuteMiles, setCommuteMiles] = useState("15")
  const [transport, setTransport] = useState<Transport>("car")
  const [gasPrice, setGasPrice] = useState("3.50")
  const [mpg, setMpg] = useState("28")
  const [monthlyPass, setMonthlyPass] = useState("120")
  const [lunchDays, setLunchDays] = useState("3")
  const [lunchCost, setLunchCost] = useState("15")
  const [homeLunchCost, setHomeLunchCost] = useState("5")
  const [coffeeDays, setCoffeeDays] = useState("5")
  const [coffeeCost, setCoffeeCost] = useState("5.50")
  const [wardrobe, setWardrobe] = useState("800")
  const [dryCleaning, setDryCleaning] = useState("150")
  const [utilities, setUtilities] = useState("60")
  const [internet, setInternet] = useState("25")
  const [equipment, setEquipment] = useState("150")
  const [result, setResult] = useState<Result | null>(null)

  const officeDays = situation === "remote" ? 0 : situation === "office" ? 5 : daysInOffice

  function runCalc(push = true) {
    const res = compute(
      situation, officeDays, +(commuteMiles) || 0,
      transport, +(gasPrice) || 3.5, +(mpg) || 28, +(monthlyPass) || 0,
      +(lunchDays) || 0, +(lunchCost) || 0, +(homeLunchCost) || 0,
      +(coffeeDays) || 0, +(coffeeCost) || 0,
      +(wardrobe) || 0, +(dryCleaning) || 0,
      +(utilities) || 0, +(internet) || 0, +(equipment) || 0,
    )
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?situation=${situation}&commute=${commuteMiles}&mpg=${mpg}&gas=${gasPrice}&lunches=${lunchDays}&coffees=${coffeeDays}&wardrobe=${wardrobe}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const sit = p.get("situation") as Situation | null
    const cm = p.get("commute")
    if (sit) {
      setSituation(sit)
      if (cm) setCommuteMiles(cm)
      if (p.get("mpg")) setMpg(p.get("mpg")!)
      if (p.get("gas")) setGasPrice(p.get("gas")!)
      if (p.get("lunches")) setLunchDays(p.get("lunches")!)
      if (p.get("coffees")) setCoffeeDays(p.get("coffees")!)
      if (p.get("wardrobe")) setWardrobe(p.get("wardrobe")!)
      // defer calc after state settles
      setTimeout(() => runCalc(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/wfh-calculator?situation=${situation}&commute=${commuteMiles}` : ""
  const shareText = result
    ? `Working from home saves me ${fmt(Math.abs(result.netSavings))}/year!\nThat is equivalent to a ${fmt(result.pretaxEquivalent)}/year salary raise!\nCalculate your WFH value:`
    : ""

  const showCommute = situation !== "remote"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">How Much Does Remote Work Save or Cost You?</h1>
          <p className="text-[#a8a8b3]">Calculate the true financial value of working from home vs office</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          {/* Situation toggle */}
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Your work situation</div>
            <div className="flex gap-2">
              <SituationBtn val="remote" label="Fully Remote" current={situation} onChange={setSituation} />
              <SituationBtn val="hybrid" label="Hybrid" current={situation} onChange={setSituation} />
              <SituationBtn val="office" label="In Office" current={situation} onChange={setSituation} />
            </div>
          </div>

          {/* Hybrid days */}
          {situation === "hybrid" && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Days in office per week: {daysInOffice}</span>
              <input type="range" min={1} max={4} value={daysInOffice} onChange={e => setDaysInOffice(+e.target.value)} className="accent-[#e94560]" />
            </label>
          )}

          {/* Commute section */}
          {showCommute && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-4">
              <div className="text-sm font-bold text-white">🚗 Commute costs</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <NumField label="Commute distance (miles one way)" value={commuteMiles} set={setCommuteMiles} />
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Transport method</span>
                  <select value={transport} onChange={e => setTransport(e.target.value as Transport)} className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                    <option value="car">Car</option>
                    <option value="transit">Public Transit</option>
                    <option value="both">Both</option>
                  </select>
                </label>
                {(transport === "car" || transport === "both") && (
                  <>
                    <NumField label="Gas price ($/gal)" value={gasPrice} set={setGasPrice} prefix="$" step="0.01" />
                    <NumField label="Car MPG" value={mpg} set={setMpg} />
                  </>
                )}
                {(transport === "transit" || transport === "both") && (
                  <NumField label="Monthly transit pass ($)" value={monthlyPass} set={setMonthlyPass} prefix="$" />
                )}
              </div>
            </div>
          )}

          {/* Food section */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-4">
            <div className="text-sm font-bold text-white">☕ Food &amp; coffee</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <NumField label="Work lunches bought/week" value={lunchDays} set={setLunchDays} />
              <NumField label="Avg lunch cost" value={lunchCost} set={setLunchCost} prefix="$" />
              <NumField label="Home lunch cost" value={homeLunchCost} set={setHomeLunchCost} prefix="$" />
              <NumField label="Work coffees/week" value={coffeeDays} set={setCoffeeDays} />
              <NumField label="Avg coffee cost" value={coffeeCost} set={setCoffeeCost} prefix="$" step="0.01" />
            </div>
          </div>

          {/* Clothing section */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
            <div className="text-sm font-bold text-white">👔 Clothing (annual)</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumField label="Work wardrobe spend" value={wardrobe} set={setWardrobe} prefix="$" />
              <NumField label="Dry cleaning" value={dryCleaning} set={setDryCleaning} prefix="$" />
            </div>
          </div>

          {/* WFH extra costs */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
            <div className="text-sm font-bold text-white">🏠 WFH extra costs (monthly unless noted)</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <NumField label="Utility increase/mo" value={utilities} set={setUtilities} prefix="$" />
              <NumField label="Internet upgrade/mo" value={internet} set={setInternet} prefix="$" />
              <NumField label="Home office equip/yr" value={equipment} set={setEquipment} prefix="$" />
            </div>
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Savings
          </button>

          {result && (() => {
            const lbl = situationLabel(result.netSavings)
            const positive = result.netSavings >= 0
            return (
              <div className="space-y-6">
                {/* Headline */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                  <div className="text-sm text-[#a8a8b3]">{positive ? "Remote work saves you:" : "Going to office costs you:"}</div>
                  <div className="my-2 text-6xl font-black" style={{ color: positive ? "#4ade80" : "#e94560" }}>{fmt(Math.abs(result.netSavings))}<span className="text-2xl">/year</span></div>
                  <div className="mt-2 text-sm text-white">= <span className="font-bold text-[#F9A825]">{fmt(result.pretaxEquivalent)}/year salary raise</span> (post-tax equivalent)</div>
                </div>

                {/* Situation label */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center font-semibold text-sm" style={{ color: lbl.color }}>{lbl.text}</div>

                {/* Breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-3">Cost breakdown</div>
                  <table className="w-full">
                    <tbody className="text-[#a8a8b3]">
                      {[
                        ["Commute costs saved", result.commuteCost],
                        ["Lunch savings", result.lunchSavings],
                        ["Coffee savings", result.coffeeSavings],
                        ["Clothing savings", result.clothingCost],
                      ].map(([l, v]) => (
                        <tr key={String(l)} className="border-b border-[#0f3460]">
                          <td className="py-1.5">{l}</td>
                          <td className="py-1.5 text-right font-bold text-[#4ade80]">+{fmt(+v)}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-[#0f3460]">
                        <td className="py-1.5">WFH extra costs</td>
                        <td className="py-1.5 text-right font-bold text-[#e94560]">−{fmt(result.wfhExtraCosts)}</td>
                      </tr>
                      <tr className="font-bold text-white">
                        <td className="pt-2">Net annual</td>
                        <td className="pt-2 text-right" style={{ color: positive ? "#4ade80" : "#e94560" }}>{positive ? "+" : "−"}{fmt(Math.abs(result.netSavings))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Time saved */}
                {result.commuteMiles > 0 && (
                  <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                    <div className="font-bold text-white mb-1">⏱️ Time saved not commuting</div>
                    <p><span className="font-bold text-[#4FC3F7]">{result.commuteHoursPerYear.toLocaleString()} hours</span> per year</p>
                    <p className="mt-1 text-[#a8a8b3]">= <span className="font-bold text-white">{result.commuteDaysPerYear} full days</span> of your life annually</p>
                  </div>
                )}

                {/* Over time */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-2">📈 Over time</div>
                  {[[5, 60], [10, 120]].map(([yr, mo]) => (
                    <p key={yr} className="mt-1 text-[#a8a8b3]">
                      <span className="font-bold text-white">{yr} years:</span>{" "}
                      {fmt(result.netSavings * yr)} saved · {fmt(fvMonthly(result.netSavings / 12, mo))} if invested at 7%
                    </p>
                  ))}
                </div>

                <ShareButtons text={shareText} url={shareUrl} title="Work From Home Savings Calculator" />
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
