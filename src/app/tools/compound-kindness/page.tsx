"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

interface Result {
  acts: number; people: number; ripple: number; years: number
  directActsPerYear: number; totalDirectActs: number; directPeople: number
  wave1: number; wave2: number; wave3: number; totalRipple: number
  context: string
}

function getContext(n: number): string {
  if (n < 1000) return "a small town"
  if (n < 10000) return "a large town"
  if (n < 100000) return "a small city"
  if (n < 1000000) return "a major city"
  if (n < 10000000) return "a small country"
  if (n < 50000000) return "a large country like Spain, Canada or Argentina"
  return "one of the world's largest countries"
}

function compute(acts: number, people: number, ripple: number, years: number): Result {
  const directActsPerYear = acts * 365
  const totalDirectActs = directActsPerYear * years
  const directPeople = totalDirectActs * people
  const wave1 = directPeople
  const wave2 = wave1 * ripple
  const wave3 = wave2 * ripple
  const totalRipple = wave1 + wave2 + wave3
  return { acts, people, ripple, years, directActsPerYear, totalDirectActs, directPeople, wave1, wave2, wave3, totalRipple, context: getContext(totalRipple) }
}

export default function CompoundKindnessPage() {
  const [acts, setActs] = useState(1)
  const [people, setPeople] = useState(3)
  const [ripple, setRipple] = useState(1)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, a = acts, p = people, r = ripple, y = years) {
    const res = compute(a, p, r, y)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?acts=${a}&people=${p}&ripple=${r}&years=${y}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const pr = new URLSearchParams(window.location.search)
    if (pr.get("acts") || pr.get("years")) {
      const a = Number(pr.get("acts") ?? 1), p = Number(pr.get("people") ?? 3), r = Number(pr.get("ripple") ?? 1), y = Number(pr.get("years") ?? 10)
      setActs(a); setPeople(p); setRipple(r); setYears(y)
      setResult(compute(a, p, r, y))
    }
  }, [])

  const f = (n: number) => Math.round(n).toLocaleString()

  const shareUrl = result ? `https://www.dayblip.com/tools/compound-kindness?acts=${result.acts}&people=${result.people}&years=${result.years}` : ""
  const shareText = result
    ? `If I do ${result.acts} kind act(s) per day for ${result.years} years the ripple effect could touch ${f(result.totalRipple)} people!`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">The Compound Effect of Kindness</h1>
          <p className="text-[#a8a8b3]">What if one kind act per day could ripple across the world?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Kind acts per day: {acts}</span>
            <input type="range" min={1} max={5} value={acts} onChange={e => setActs(Number(e.target.value))} className="accent-[#e94560]" /></label>
          <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">People each act directly affects: {people}</span>
            <input type="range" min={1} max={10} value={people} onChange={e => setPeople(Number(e.target.value))} className="accent-[#e94560]" /></label>
          <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Each affected person does {ripple} kind act(s)</span>
            <input type="range" min={0} max={2} value={ripple} onChange={e => setRipple(Number(e.target.value))} className="accent-[#e94560]" /></label>
          <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Years to calculate: {years}</span>
            <input type="range" min={1} max={30} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" /></label>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Impact
          </button>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-3 font-bold text-white">Your direct impact</h3>
                <p>Kind acts per year: <span className="font-bold text-[#F9A825]">{f(result.directActsPerYear)}</span></p>
                <p className="mt-1">Over {result.years} years: <span className="font-bold text-[#F9A825]">{f(result.totalDirectActs)}</span> acts</p>
                <p className="mt-1">People directly affected: <span className="font-bold text-[#F9A825]">{f(result.directPeople)}</span></p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-3 font-bold text-white">Ripple effect (each person passes it on {result.ripple}×)</h3>
                <ul className="space-y-2 text-[#a8a8b3]">
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Wave 1 (you)</span><span className="font-bold text-white">{f(result.wave1)} people</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Wave 2 (ripple)</span><span className="font-bold text-white">{f(result.wave2)} people</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Wave 3 (ripple²)</span><span className="font-bold text-white">{f(result.wave3)} people</span></li>
                  <li className="flex justify-between"><span>Total potential impact</span><span className="font-bold text-[#e94560]">{f(result.totalRipple)} people</span></li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                {f(result.totalRipple)} people is approximately the population of {result.context}.
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-6 text-sm text-white">
                <p>&ldquo;Mother Teresa started by helping one person at a time.&rdquo;</p>
                <p className="mt-1 text-[#a8a8b3]">Each ripple starts with one act.</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="The Compound Effect of Kindness" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
