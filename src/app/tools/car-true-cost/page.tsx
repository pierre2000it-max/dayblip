"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmt2(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimate.</strong> Actual costs vary.
  </div>
)

interface CarCost {
  price: number; loanAmount: number; monthly: number; totalLoan: number; totalInterest: number
  insurance: number; maintenance: number; fuel: number; registration: number; annualOperating: number
  depreciation: number; totalTrueCost: number; perMile: number; monthlyTrue: number
  opportunity: number; downPayment: number
}

function loanCalc(P: number, rate: number, term: number) {
  const r = rate / 12 / 100
  if (r === 0) return { monthly: term > 0 ? P / term : 0 }
  const monthly = P * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)
  return { monthly }
}

function fvAnnuity(monthly: number, rate: number, years: number) {
  const r = rate / 12
  const n = years * 12
  return r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r)
}

function computeCar(price: number, down: number, term: number, rate: number, insurance: number, maintRate: number, fuel: number, reg: number, years: number, miles: number): CarCost {
  const loanAmount = Math.max(0, price - down)
  const { monthly } = loanCalc(loanAmount, rate, term)
  const totalLoan = monthly * term
  const totalInterest = totalLoan - loanAmount
  const maintenance = price * (maintRate / 100)
  const annualOperating = insurance + maintenance + fuel + reg
  const remainingValue = price * 0.80 * Math.pow(0.85, years - 1)
  const depreciation = price - remainingValue
  // true cost = cash paid (down + loan incl. interest) + operating costs over the ownership period
  const trueCost = (down + totalLoan) + (annualOperating * years)
  const perMile = miles * years > 0 ? trueCost / (miles * years) : 0
  const monthlyTrue = years > 0 ? trueCost / (years * 12) : 0
  const opportunity = fvAnnuity(monthly, rate / 100, years)
  return {
    price, loanAmount, monthly, totalLoan, totalInterest, insurance, maintenance, fuel, registration: reg,
    annualOperating, depreciation, totalTrueCost: trueCost, perMile, monthlyTrue, opportunity, downPayment: down,
  }
}

export default function CarTrueCostPage() {
  const [price, setPrice] = useState("35000")
  const [down, setDown] = useState("5000")
  const [term, setTerm] = useState("60")
  const [rate, setRate] = useState("7")
  const [insurance, setInsurance] = useState("1800")
  const [maintRate, setMaintRate] = useState("1.5")
  const [fuel, setFuel] = useState("2400")
  const [reg, setReg] = useState("200")
  const [years, setYears] = useState("5")
  const [miles, setMiles] = useState("12000")
  const [result, setResult] = useState<CarCost | null>(null)
  const [compare, setCompare] = useState<CarCost | null>(null)

  function gather() {
    return {
      price: parseFloat(price) || 0, down: parseFloat(down) || 0, term: parseInt(term) || 60, rate: parseFloat(rate) || 0,
      insurance: parseFloat(insurance) || 0, maintRate: parseFloat(maintRate) || 0, fuel: parseFloat(fuel) || 0,
      reg: parseFloat(reg) || 0, years: parseInt(years) || 5, miles: parseFloat(miles) || 0,
    }
  }

  function runCalc(push = true) {
    const g = gather()
    const res = computeCar(g.price, g.down, g.term, g.rate, g.insurance, g.maintRate, g.fuel, g.reg, g.years, g.miles)
    const cmp = computeCar(20000, Math.min(g.down, 20000), g.term, g.rate, g.insurance * 0.85, g.maintRate, g.fuel * 0.85, g.reg, g.years, g.miles)
    setResult(res); setCompare(cmp)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?price=${g.price}&down=${g.down}&term=${g.term}&rate=${g.rate}&insurance=${g.insurance}&fuel=${g.fuel}&years=${g.years}&miles=${g.miles}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("price")) {
      if (p.get("price")) setPrice(p.get("price")!)
      if (p.get("down")) setDown(p.get("down")!)
      if (p.get("term")) setTerm(p.get("term")!)
      if (p.get("rate")) setRate(p.get("rate")!)
      if (p.get("insurance")) setInsurance(p.get("insurance")!)
      if (p.get("fuel")) setFuel(p.get("fuel")!)
      if (p.get("years")) setYears(p.get("years")!)
      if (p.get("miles")) setMiles(p.get("miles")!)
      setTimeout(() => runCalc(false), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/car-true-cost?price=${result.price}&years=${parseInt(years) || 5}` : ""
  const shareText = result ? `The true cost of my ${fmt(result.price)} car over ${years} years is actually ${fmt(result.totalTrueCost)}! Not just the sticker price 🚗💸 (Educational only)` : ""

  const field = (label: string, value: string, set: (v: string) => void, prefix = "$") => (
    <label className="block"><span className="mb-1 block text-xs font-semibold text-white">{label}</span>
      <div className="flex items-center gap-1">{prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input type="number" value={value} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></div>
    </label>
  )
  const yrs = parseInt(years) || 5

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">True Car Cost Calculator — The Real Total Cost of Owning Your Car</h1>
          <p className="text-[#a8a8b3]">The sticker price is just the beginning</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American spends $12,182 per year on car ownership including loan payments, insurance, fuel, maintenance and depreciation. Over 10 years a $35,000 car costs approximately $85,000 in total ownership expenses. A new car loses 20% of its value in the first year and 50% within 5 years. The true monthly cost of car ownership is typically 40-60% more than the loan payment alone.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The true cost of car ownership goes far beyond the monthly loan payment. It includes insurance, fuel, regular maintenance, unexpected repairs, registration fees, and depreciation — the largest hidden cost most buyers ignore. This calculator shows the real monthly and annual cost of owning any vehicle based on your specific purchase price, loan terms and driving habits.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {field("Car price", price, setPrice)}
            {field("Down payment", down, setDown)}
            <label className="block"><span className="mb-1 block text-xs font-semibold text-white">Loan term</span>
              <select value={term} onChange={e => setTerm(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none">
                {["36", "48", "60", "72"].map(t => <option key={t} value={t}>{t} months</option>)}
              </select></label>
            {field("Interest rate %", rate, setRate, "")}
            {field("Annual insurance", insurance, setInsurance)}
            {field("Maintenance % of value", maintRate, setMaintRate, "")}
            {field("Annual fuel", fuel, setFuel)}
            {field("Annual registration", reg, setReg)}
            {field("Years to own", years, setYears, "")}
            {field("Miles / year", miles, setMiles, "")}
          </div>
          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate True Cost
          </button>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-2 font-bold text-white">Purchase costs</h3>
                <ul className="space-y-1 text-[#a8a8b3]">
                  <li className="flex justify-between"><span>Car price</span><span className="text-white">{fmt(result.price)}</span></li>
                  <li className="flex justify-between"><span>Down payment</span><span className="text-white">-{fmt(result.downPayment)}</span></li>
                  <li className="flex justify-between"><span>Loan amount</span><span className="text-white">{fmt(result.loanAmount)}</span></li>
                  <li className="flex justify-between"><span>Total interest</span><span className="text-[#FF6B6B]">{fmt(result.totalInterest)}</span></li>
                  <li className="flex justify-between font-bold"><span className="text-white">Total paid for car</span><span className="text-white">{fmt(result.downPayment + result.totalLoan)}</span></li>
                </ul>
                <h3 className="mb-2 mt-4 font-bold text-white">Annual operating costs</h3>
                <ul className="space-y-1 text-[#a8a8b3]">
                  <li className="flex justify-between"><span>Insurance</span><span className="text-white">{fmt(result.insurance)}/yr</span></li>
                  <li className="flex justify-between"><span>Maintenance</span><span className="text-white">{fmt(result.maintenance)}/yr</span></li>
                  <li className="flex justify-between"><span>Fuel</span><span className="text-white">{fmt(result.fuel)}/yr</span></li>
                  <li className="flex justify-between"><span>Registration</span><span className="text-white">{fmt(result.registration)}/yr</span></li>
                  <li className="flex justify-between font-bold"><span className="text-white">Total annual</span><span className="text-white">{fmt(result.annualOperating)}</span></li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-2 font-bold text-white">{yrs}-year true cost</h3>
                <ul className="space-y-1 text-[#a8a8b3]">
                  <li className="flex justify-between"><span>Purchase + interest</span><span className="text-white">{fmt(result.downPayment + result.totalLoan)}</span></li>
                  <li className="flex justify-between"><span>Insurance ({yrs} yrs)</span><span className="text-white">{fmt(result.insurance * yrs)}</span></li>
                  <li className="flex justify-between"><span>Maintenance</span><span className="text-white">{fmt(result.maintenance * yrs)}</span></li>
                  <li className="flex justify-between"><span>Fuel</span><span className="text-white">{fmt(result.fuel * yrs)}</span></li>
                  <li className="flex justify-between"><span>Registration</span><span className="text-white">{fmt(result.registration * yrs)}</span></li>
                  <li className="flex justify-between"><span>Depreciation</span><span className="text-white">{fmt(result.depreciation)}</span></li>
                  <li className="flex justify-between border-t border-[#0f3460] pt-2 text-lg font-black"><span className="text-white">TOTAL TRUE COST</span><span className="text-[#e94560]">{fmt(result.totalTrueCost)}</span></li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#F9A825]">{fmt2(result.perMile)}</div><div className="text-[#a8a8b3]">True cost per mile</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-white">{fmt(result.monthlyTrue)}</div><div className="text-[#a8a8b3]">True cost per month</div></div>
              </div>

              <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5 text-sm text-white">
                Opportunity cost: if your monthly payments of {fmt(result.monthly)} were invested at 7%, you would have <span className="font-bold text-[#4ade80]">{fmt(result.opportunity)}</span> over {yrs} years.
              </div>

              {compare && (
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-5 text-sm text-white">
                  A {fmt(20000)} car instead would cost <span className="font-bold">{fmt(compare.totalTrueCost)}</span> true total — saving <span className="font-bold text-[#4ade80]">{fmt(result.totalTrueCost - compare.totalTrueCost)}</span>.
                </div>
              )}

              <ShareButtons text={shareText} url={shareUrl} title="True Cost of Car Ownership" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
