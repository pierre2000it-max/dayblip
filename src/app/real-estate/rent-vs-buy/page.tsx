"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function RentVsBuyPage() {
  const [rent, setRent] = useState("2000")
  const [rentIncrease, setRentIncrease] = useState("3")
  const [rentersIns, setRentersIns] = useState("20")
  const [homePrice, setHomePrice] = useState("400000")
  const [downPct, setDownPct] = useState("20")
  const [mortgageRate, setMortgageRate] = useState("7")
  const [propTaxPct, setPropTaxPct] = useState("1.2")
  const [homeIns, setHomeIns] = useState("150")
  const [hoa, setHoa] = useState("0")
  const [maintPct, setMaintPct] = useState("1")
  const [years, setYears] = useState("7")
  const [investReturn, setInvestReturn] = useState("7")
  const [homeAppreciation, setHomeAppreciation] = useState("3")

  const calc = useMemo(() => {
    const yr = Math.max(1, parseInt(years) || 7)
    const hp = parseFloat(homePrice) || 0
    const dp = hp * (parseFloat(downPct) || 0) / 100
    const loan = hp - dp
    const mr = (parseFloat(mortgageRate) || 0) / 100 / 12
    const n = 30 * 12
    const pi = mr === 0 ? loan / n : loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
    const annualTax = hp * (parseFloat(propTaxPct) || 0) / 100
    const annualIns = (parseFloat(homeIns) || 0) * 12
    const annualHoa = (parseFloat(hoa) || 0) * 12
    const annualMaint = hp * (parseFloat(maintPct) || 0) / 100
    const closingCosts = hp * 0.03

    let totalRentCost = 0
    let monthlyR = parseFloat(rent) || 0
    const ri = (parseFloat(rentIncrease) || 0) / 100
    const ri12 = parseFloat(rentersIns) || 0
    for (let y = 0; y < yr; y++) {
      totalRentCost += monthlyR * 12 + ri12 * 12
      monthlyR *= (1 + ri)
    }
    const oppCost = dp * (Math.pow(1 + (parseFloat(investReturn) || 0) / 100, yr) - 1)
    totalRentCost += oppCost

    let totalBuyCost = closingCosts + dp
    let bal = loan
    let equityGained = dp
    for (let y = 0; y < yr; y++) {
      for (let m = 0; m < 12; m++) {
        const interest = bal * mr
        const principal = pi - interest
        bal -= principal
        equityGained += principal
        if (bal < 0) bal = 0
      }
      totalBuyCost += pi * 12 + annualTax + annualIns + annualHoa + annualMaint
    }
    const homeValue = hp * Math.pow(1 + (parseFloat(homeAppreciation) || 0) / 100, yr)
    const appreciation = homeValue - hp
    totalBuyCost -= (equityGained + appreciation)

    const rows = Array.from({ length: Math.min(yr, 30) }, (_, i) => {
      const y = i + 1
      let rc = 0
      let mr2 = parseFloat(rent) || 0
      for (let j = 0; j < y; j++) { rc += mr2 * 12 + ri12 * 12; mr2 *= (1 + ri) }
      const oc = dp * (Math.pow(1 + (parseFloat(investReturn) || 0) / 100, y) - 1)
      rc += oc
      const bc = closingCosts + dp + (pi * 12 + annualTax + annualIns + annualHoa + annualMaint) * y
        - (dp + equityGained * (y / yr) + hp * (Math.pow(1 + (parseFloat(homeAppreciation) || 0) / 100, y) - 1))
      return { year: y, rentTotal: rc, buyTotal: bc }
    })

    const breakEven = rows.find(r => r.buyTotal <= r.rentTotal)?.year ?? null

    return { totalRentCost, totalBuyCost, winner: totalRentCost <= totalBuyCost ? "Renting" : "Buying", diff: Math.abs(totalRentCost - totalBuyCost), breakEven, rows }
  }, [rent, rentIncrease, rentersIns, homePrice, downPct, mortgageRate, propTaxPct, homeIns, hoa, maintPct, years, investReturn, homeAppreciation])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none text-sm"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Rent vs Buy Calculator</h1>
          <p className="text-[#a8a8b3]">Find out which is the smarter financial choice for you</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
              <h2 className="font-bold text-white">🏢 Renting</h2>
              {[
                { label: "Monthly Rent ($)", val: rent, set: setRent },
                { label: "Annual Rent Increase (%)", val: rentIncrease, set: setRentIncrease },
                { label: "Renters Insurance ($/mo)", val: rentersIns, set: setRentersIns },
              ].map(f => <label key={f.label} className="flex flex-col gap-1"><span className="text-xs text-[#a8a8b3]">{f.label}</span><input type="number" step="0.1" value={f.val} onChange={e => f.set(e.target.value)} className={inp} /></label>)}
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
              <h2 className="font-bold text-white">🏠 Buying</h2>
              {[
                { label: "Home Price ($)", val: homePrice, set: setHomePrice },
                { label: "Down Payment (%)", val: downPct, set: setDownPct },
                { label: "Mortgage Rate (%)", val: mortgageRate, set: setMortgageRate },
                { label: "Property Tax (%/yr)", val: propTaxPct, set: setPropTaxPct },
                { label: "Home Insurance ($/mo)", val: homeIns, set: setHomeIns },
                { label: "HOA ($/mo)", val: hoa, set: setHoa },
                { label: "Maintenance (%/yr)", val: maintPct, set: setMaintPct },
              ].map(f => <label key={f.label} className="flex flex-col gap-1"><span className="text-xs text-[#a8a8b3]">{f.label}</span><input type="number" step="0.1" value={f.val} onChange={e => f.set(e.target.value)} className={inp} /></label>)}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Years Staying", val: years, set: setYears },
              { label: "Investment Return (%)", val: investReturn, set: setInvestReturn },
              { label: "Home Appreciation (%/yr)", val: homeAppreciation, set: setHomeAppreciation },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" step="0.1" value={f.val} onChange={e => f.set(e.target.value)}
                  className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-3xl font-black text-[#F9A825]">{calc.winner} wins</div>
            <div className="text-[#a8a8b3] mt-1">by {fmt(calc.diff)} over {years} years</div>
            {calc.breakEven && <div className="text-sm text-white mt-2">Break-even: Year <span className="text-[#4FC3F7] font-bold">{calc.breakEven}</span></div>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#4FC3F7]">{fmt(calc.totalRentCost)}</div>
              <div className="text-sm text-[#a8a8b3]">Total Cost Renting ({years} yrs)</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.totalBuyCost)}</div>
              <div className="text-sm text-[#a8a8b3]">Total Cost Buying ({years} yrs)</div>
            </div>
          </div>

          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Many factors affect the rent vs buy decision beyond financial costs. Consult a real estate professional.</p>
        </div>
      </section>
    </div>
  )
}
