"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function getFRA(birthYear: number): number {
  if (birthYear <= 1954) return 66
  if (birthYear === 1955) return 66 + 2 / 12
  if (birthYear === 1956) return 66 + 4 / 12
  if (birthYear === 1957) return 66 + 6 / 12
  if (birthYear === 1958) return 66 + 8 / 12
  if (birthYear === 1959) return 66 + 10 / 12
  return 67
}

function getMultiplier(claimAge: number, fra: number): number {
  if (claimAge <= 62) return 0.70
  if (claimAge >= 70) return 1.32
  const diff = claimAge - fra
  if (diff < 0) {
    // Early claiming reduction
    return Math.max(0.70, 1 + diff * 0.0667)
  }
  // Delayed credits: 8% per year
  return Math.min(1.32, 1 + diff * 0.08)
}

export default function SocialSecurityPage() {
  const [birthYear, setBirthYear] = useState("1965")
  const [benefitAt62, setBenefitAt62] = useState("1500")
  const [health, setHealth] = useState("Good")
  const [marital, setMarital] = useState("Single")

  const calc = useMemo(() => {
    const by = parseInt(birthYear) || 1965
    const b62 = parseFloat(benefitAt62) || 0
    const fra = getFRA(by)
    // monthly benefit at 62
    const fraBenefit = b62 / getMultiplier(62, fra)
    const ages = [62, 63, 64, 65, 66, 67, 68, 69, 70]
    const rows = ages.map(age => {
      const mult = getMultiplier(age, fra)
      const monthly = fraBenefit * mult
      const annual = monthly * 12
      const lifeMonths = Math.max(0, (85 - age) * 12)
      const lifetime = monthly * lifeMonths
      return { age, monthly, annual, lifetime }
    })
    const best = rows.reduce((a, b) => a.lifetime > b.lifetime ? a : b)
    const base62 = rows[0]
    const breakEvens = rows.slice(1).map(r => {
      // months until cumulative benefit surpasses claiming at 62
      // After claiming at 62: earns base62.monthly each month
      // After claiming at r.age: earns r.monthly each month but starts (r.age-62)*12 months later
      const delay = (r.age - 62) * 12
      const diff = r.monthly - base62.monthly
      if (diff <= 0) return { age: r.age, breakEvenAge: null }
      const months = base62.monthly * delay / diff
      const breakEvenAge = 62 + (delay + months) / 12
      return { age: r.age, breakEvenAge: breakEvenAge.toFixed(1) }
    })
    return { rows, best, fra, breakEvens }
  }, [birthYear, benefitAt62, health, marital])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Social Security Calculator</h1>
          <p className="text-[#a8a8b3]">Find the best age to claim your Social Security benefits</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Birth Year</span>
              <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Est. Monthly Benefit at 62 ($)</span>
              <input type="number" value={benefitAt62} onChange={e => setBenefitAt62(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Health Status</span>
              <select value={health} onChange={e => setHealth(e.target.value)} className={sel}>
                {["Excellent", "Good", "Fair", "Poor"].map(h => <option key={h}>{h}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Marital Status</span>
              <select value={marital} onChange={e => setMarital(e.target.value)} className={sel}>
                {["Single", "Married"].map(m => <option key={m}>{m}</option>)}
              </select></label>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-sm text-[#a8a8b3]">
            Your Full Retirement Age (FRA): <span className="text-white font-bold">{calc.fra.toFixed(1)} years</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#0f3460]">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460] bg-[#1a1a2e]">
                {["Claim Age", "Monthly Benefit", "Annual Benefit", "Lifetime to 85"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">{h}</th>
                ))}
              </tr></thead>
              <tbody>{calc.rows.map(r => (
                <tr key={r.age} className={`border-b border-[#0f3460]/50 ${r.age === calc.best.age ? "bg-[#F9A825]/10" : ""}`}>
                  <td className="px-4 py-2 text-white font-semibold">
                    {r.age} {r.age === calc.best.age ? "⭐" : ""}
                  </td>
                  <td className="px-4 py-2 text-[#4FC3F7]">{fmt(r.monthly)}</td>
                  <td className="px-4 py-2 text-white">{fmt(r.annual)}</td>
                  <td className="px-4 py-2 text-[#F9A825] font-bold">{fmt(r.lifetime)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">⚖️ Break-Even vs Claiming at 62</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {calc.breakEvens.map(be => (
                <div key={be.age} className="text-sm">
                  <span className="text-[#a8a8b3]">Claim at {be.age}: </span>
                  <span className="text-white">{be.breakEvenAge ? `Break even at age ${be.breakEvenAge}` : "Never breaks even"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">ℹ️ Key Facts</h2>
            <ul className="text-sm text-[#a8a8b3] space-y-1">
              <li>• Claiming early reduces benefits permanently by up to 30%</li>
              <li>• Delaying past FRA increases benefits by 8% per year up to age 70</li>
              <li>• Spousal benefits can be up to 50% of your partner&#39;s benefit</li>
              <li>• Visit <span className="text-[#4FC3F7]">ssa.gov</span> for your actual benefit statement</li>
            </ul>
          </div>

          <p className="text-xs text-[#a8a8b3]">⚠️ This is an estimate. Visit ssa.gov for your actual Social Security benefit statement. Not financial advice.</p>
        </div>
      </section>
    </div>
  )
}
