"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"

interface Result {
  dob: string
  expectancy: number
  weeksLived: number
  weeksTotal: number
  weeksRemaining: number
  pct: number
  years: number
  months: number
  days: number
}

function compute(dobStr: string, expectancy: number): Result | null {
  const dob = new Date(dobStr)
  if (isNaN(dob.getTime())) return null
  const now = new Date()
  const msLived = now.getTime() - dob.getTime()
  if (msLived < 0) return null
  const weeksLived = Math.floor(msLived / (1000 * 60 * 60 * 24 * 7))
  const weeksTotal = expectancy * 52
  const weeksRemaining = Math.max(0, weeksTotal - weeksLived)
  const pct = Math.min(100, (weeksLived / weeksTotal) * 100)

  // exact age
  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  let days = now.getDate() - dob.getDate()
  if (days < 0) {
    months -= 1
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  return { dob: dobStr, expectancy, weeksLived, weeksTotal, weeksRemaining, pct, years, months, days }
}

export default function LifeInWeeksPage() {
  const [dob, setDob] = useState("1990-01-01")
  const [expectancy, setExpectancy] = useState(80)
  const [result, setResult] = useState<Result | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  function runCalc(push = true, d = dob, e = expectancy) {
    const res = compute(d, e)
    setResult(res)
    if (res && push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?dob=${d}&expectancy=${e}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const d = p.get("dob")
    const e = p.get("expectancy")
    if (d) {
      setDob(d)
      const exp = e ? Number(e) : 80
      setExpectancy(exp)
      const res = compute(d, exp)
      setResult(res)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function download() {
    if (!gridRef.current) return
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(gridRef.current, { backgroundColor: "#1a1a2e" })
    const link = document.createElement("a")
    link.download = "dayblip-life-in-weeks.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const shareUrl = result ? `https://www.dayblip.com/tools/life-in-weeks?dob=${result.dob}&expectancy=${result.expectancy}` : ""
  const shareText = result
    ? `I am ${result.pct.toFixed(1)}% through my life.\n${result.weeksLived.toLocaleString()} weeks lived. ${result.weeksRemaining.toLocaleString()} weeks left.\nEach square = one week of life.`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Life in Weeks — Visualize Your Entire Life as a Grid</h1>
          <p className="text-[#a8a8b3]">See your entire life visualized in one grid — every week you have lived and every week you have remaining</p>
          <a href="/blog/life-in-weeks" style={{ fontSize: "13px", color: "#e94560", marginTop: "8px", display: "inline-block" }}>Read: Your Life as a Grid of Squares →</a>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[900px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American life expectancy is 78.6 years — approximately 4,087 weeks. A 35-year-old has lived roughly 1,820 weeks and has approximately 2,267 weeks remaining. Each row in the life in weeks grid represents one year. Each small square represents one week of your life.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The life in weeks visualization was popularized by author Tim Urban and shows your entire lifespan as a grid of squares. Filled squares represent weeks already lived. Empty squares represent weeks remaining at average life expectancy. Many people find this visualization powerfully motivating for making intentional choices about time.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Life in Weeks" }
          ]} />
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Your birth date</span>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Life expectancy: {expectancy} years</span>
              <input type="range" min={70} max={100} value={expectancy} onChange={e => setExpectancy(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Show My Life
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div ref={gridRef} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 sm:p-6">
                <div className="mb-3 text-center text-sm text-[#a8a8b3]">Each square = one week · {result.expectancy} years</div>
                <div className="flex">
                  {/* age labels */}
                  <div className="mr-2 flex flex-col" style={{ gap: "1px" }}>
                    {Array.from({ length: result.expectancy }, (_, row) => (
                      <div key={row} className="flex items-center justify-end text-[8px] leading-none text-[#a8a8b3] sm:text-[9px]" style={{ height: "8px", width: "22px" }}>
                        {row % 10 === 0 ? row : ""}
                      </div>
                    ))}
                  </div>
                  {/* grid */}
                  <div className="grid" style={{ gridTemplateColumns: "repeat(52, 1fr)", gap: "1px", flex: 1 }}>
                    {Array.from({ length: result.weeksTotal }, (_, i) => (
                      <div
                        key={i}
                        className="aspect-square"
                        style={{ backgroundColor: i < result.weeksLived ? "#e94560" : "rgba(255,255,255,0.08)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-[#e94560]">{result.weeksLived.toLocaleString()}</div><div className="text-[#a8a8b3]">weeks lived</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-white">{result.weeksRemaining.toLocaleString()}</div><div className="text-[#a8a8b3]">weeks remaining</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-[#F9A825]">{result.pct.toFixed(1)}%</div><div className="text-[#a8a8b3]">through your life</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-white">{result.years}y {result.months}m {result.days}d</div><div className="text-[#a8a8b3]">old</div></div>
              </div>

              <button onClick={download} className="w-full rounded-lg border border-[#e94560] bg-transparent px-5 py-3 font-semibold text-[#e94560] transition-colors hover:bg-[#e94560] hover:text-white">
                Download My Life Grid →
              </button>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <p className="text-base font-medium">&ldquo;This visualization is not meant to be depressing. Each empty square is a week of opportunity still ahead.&rdquo;</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Your Life in Weeks" />
            </div>
          )}
          {/* Cluster mesh block — do not remove */}
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', margin: '0 0 32px 0' }}>
            <p style={{ color: '#a8a8b3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Explore Your Story</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="/born-in" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🌍 Born In Your Year</a>
              <a href="/tools/generation-quiz" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🧬 What Generation Am I?</a>
              <a href="/number-one-song" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎵 #1 Song on Your Birthday</a>
              <a href="/birthday-twins" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎂 Celebrity Birthday Twins</a>
              <a href="/tools/name-popularity" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🔤 Name Popularity</a>
            </div>
          </div>
          <RelatedTools tools={[
            { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
            { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
            { emoji: "🎵", title: "#1 Song on Your Birthday", desc: "Discover the hit song from your birth year", href: "/number-one-song" },
            { emoji: "🎂", title: "Celebrity Birthday Twins", desc: "Famous people who share your birthday", href: "/birthday-twins" },
          ]} />
        </div>
      </section>
    </div>
  )
}
