"use client"
import { useState, useCallback } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Time zone definitions ─────────────────────────────────────────────────────
interface TZ { label: string; iana: string; cities: string }

const ZONES: TZ[] = [
  { label: "EST — Eastern (UTC-5)", iana: "America/New_York", cities: "New York, Boston, Miami" },
  { label: "CST — Central (UTC-6)", iana: "America/Chicago", cities: "Chicago, Dallas, Houston" },
  { label: "MST — Mountain (UTC-7)", iana: "America/Denver", cities: "Denver, Phoenix" },
  { label: "PST — Pacific (UTC-8)", iana: "America/Los_Angeles", cities: "Los Angeles, Seattle" },
  { label: "AKST — Alaska (UTC-9)", iana: "America/Anchorage", cities: "Anchorage" },
  { label: "HST — Hawaii (UTC-10)", iana: "Pacific/Honolulu", cities: "Honolulu" },
  { label: "GMT — London (UTC+0)", iana: "Europe/London", cities: "London, Dublin, Lisbon" },
  { label: "CET — Central Europe (UTC+1)", iana: "Europe/Paris", cities: "Paris, Berlin, Rome, Madrid" },
  { label: "EET — Eastern Europe (UTC+2)", iana: "Europe/Athens", cities: "Athens, Helsinki, Cairo, Istanbul" },
  { label: "MSK — Moscow (UTC+3)", iana: "Europe/Moscow", cities: "Moscow, St Petersburg" },
  { label: "AST — Gulf (UTC+4)", iana: "Asia/Dubai", cities: "Dubai, Abu Dhabi" },
  { label: "PKT — Pakistan (UTC+5)", iana: "Asia/Karachi", cities: "Karachi, Islamabad" },
  { label: "IST — India (UTC+5:30)", iana: "Asia/Kolkata", cities: "Mumbai, Delhi, Kolkata" },
  { label: "BST — Bangladesh (UTC+6)", iana: "Asia/Dhaka", cities: "Dhaka" },
  { label: "ICT — Indochina (UTC+7)", iana: "Asia/Bangkok", cities: "Bangkok, Jakarta" },
  { label: "CST — China (UTC+8)", iana: "Asia/Shanghai", cities: "Beijing, Shanghai, Singapore" },
  { label: "JST — Japan (UTC+9)", iana: "Asia/Tokyo", cities: "Tokyo, Seoul" },
  { label: "AEST — Australia East (UTC+10)", iana: "Australia/Sydney", cities: "Sydney, Melbourne" },
  { label: "NZST — New Zealand (UTC+12)", iana: "Pacific/Auckland", cities: "Auckland, Wellington" },
  { label: "BRT — Brazil (UTC-3)", iana: "America/Sao_Paulo", cities: "São Paulo, Rio" },
  { label: "ART — Argentina (UTC-3)", iana: "America/Argentina/Buenos_Aires", cities: "Buenos Aires" },
  { label: "COT — Colombia/Peru (UTC-5)", iana: "America/Bogota", cities: "Bogotá, Lima" },
  { label: "WAT — West Africa (UTC+1)", iana: "Africa/Lagos", cities: "Lagos, Kinshasa" },
  { label: "SAST — South Africa (UTC+2)", iana: "Africa/Johannesburg", cities: "Johannesburg, Cape Town" },
  { label: "EAT — East Africa (UTC+3)", iana: "Africa/Nairobi", cities: "Nairobi, Addis Ababa" },
]

const QUICK: { label: string; iana: string }[] = [
  { label: "EST (NY)", iana: "America/New_York" },
  { label: "PST (LA)", iana: "America/Los_Angeles" },
  { label: "GMT (London)", iana: "Europe/London" },
  { label: "CET (Paris)", iana: "Europe/Paris" },
  { label: "IST (Mumbai)", iana: "Asia/Kolkata" },
  { label: "CST (Beijing)", iana: "Asia/Shanghai" },
  { label: "JST (Tokyo)", iana: "Asia/Tokyo" },
  { label: "AEST (Sydney)", iana: "Australia/Sydney" },
]

function fmt12(date: Date, iana: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: iana, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(date)
}

function fmtDate(date: Date, iana: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: iana, weekday: "short", month: "short", day: "numeric",
  }).format(date)
}

function getDateLabel(fromIana: string, toIana: string, baseDate: Date): string {
  const fromDay = new Intl.DateTimeFormat("en-US", { timeZone: fromIana, day: "numeric" }).format(baseDate)
  const toDay   = new Intl.DateTimeFormat("en-US", { timeZone: toIana,   day: "numeric" }).format(baseDate)
  const diff = parseInt(toDay) - parseInt(fromDay)
  if (diff === 1 || diff < -20) return "(+1 day)"
  if (diff === -1 || diff > 20) return "(-1 day)"
  return ""
}

function buildDate(timeStr: string): Date {
  const now = new Date()
  const [hhmm, ampm] = timeStr.split(" ")
  let [h] = hhmm.split(":").map(Number)
  const [, mStr] = hhmm.split(":")
  const m = parseInt(mStr)
  if (ampm === "PM" && h !== 12) h += 12
  if (ampm === "AM" && h === 12) h = 0
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
}

// ── Business hours overlap for meeting planner ────────────────────────────────
function businessHoursInUTC(iana: string, dayDate: Date): number[] {
  const hours: number[] = []
  for (let h = 0; h < 24; h++) {
    const testDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), h, 0)
    const localH = parseInt(
      new Intl.DateTimeFormat("en-US", { timeZone: iana, hour: "numeric", hour12: false }).format(testDate)
    )
    if (localH >= 9 && localH < 17) hours.push(h)
  }
  return hours
}

function intersection(arrays: number[][]): number[] {
  if (!arrays.length) return []
  return arrays.reduce((a, b) => a.filter(x => b.includes(x)))
}

export default function TimezoneConverterPage() {
  const [time, setTime] = useState("09:00 AM")
  const [fromZone, setFromZone] = useState("America/New_York")
  const [toZone, setToZone] = useState("Europe/London")
  const [meetingLocs, setMeetingLocs] = useState<string[]>(["America/New_York", "Europe/London"])
  const [addLoc, setAddLoc] = useState("Asia/Tokyo")

  const baseDate = buildDate(time)
  const converted = fmt12(baseDate, toZone)
  const convertedDate = fmtDate(baseDate, toZone)
  const fromDate = fmtDate(baseDate, fromZone)
  const dayLabel = getDateLabel(fromZone, toZone, baseDate)

  const fromCity = ZONES.find(z => z.iana === fromZone)?.cities.split(",")[0] ?? fromZone
  const toCity = ZONES.find(z => z.iana === toZone)?.cities.split(",")[0] ?? toZone

  const swap = useCallback(() => {
    setFromZone(toZone)
    setToZone(fromZone)
  }, [fromZone, toZone])

  // Meeting planner
  const today = new Date()
  const overlapHours = intersection(meetingLocs.map(loc => businessHoursInUTC(loc, today)))

  function removeLoc(idx: number) {
    setMeetingLocs(locs => locs.filter((_, i) => i !== idx))
  }

  const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white text-sm focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Time Zone Converter", "Convert time between any two time zones with daylight saving time handled automatically", "https://www.dayblip.com/tools/timezone-converter", "UtilitiesApplication"),
        faqSchema([
          { question: "What time is it in London when it is 9 AM in New York?", answer: "When it is 9 AM Eastern Time in New York it is 2 PM GMT in London — a 5-hour difference. During US daylight saving time (March to November) the difference is 5 hours. Outside DST when the US is on standard time the difference is also 5 hours as the UK observes GMT in winter." },
          { question: "How many time zones does the US have?", answer: "The US has 6 standard time zones: Eastern (UTC-5) Central (UTC-6) Mountain (UTC-7) Pacific (UTC-8) Alaska (UTC-9) and Hawaii (UTC-10). Arizona does not observe daylight saving time and stays on Mountain Standard Time year-round. Indiana counties used to vary but now all observe Eastern Time." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Time Zone Converter", url: "https://www.dayblip.com/tools/timezone-converter" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🌐</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Time Zone Converter — What Time Is It Anywhere in the World?</h1>
          <p className="text-[#a8a8b3]">Instant conversion with daylight saving time handled automatically</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Time Zone Converter" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>New York (EST) is 5 hours behind London (GMT) and 14 hours behind Tokyo (JST). When it is 9 AM Monday in New York it is 2 PM Monday in London and 11 PM Monday in Tokyo. The US has 6 time zones from Eastern (UTC-5) to Hawaii (UTC-10). Daylight saving time shifts clocks forward 1 hour in spring and back in fall in most US states except Arizona and Hawaii.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Time zones divide the world into regions that observe the same standard time. There are 24 primary time zones each representing one hour of difference from UTC (Universal Coordinated Time). Remote work has made time zone conversion a daily need for millions of workers worldwide. This converter handles daylight saving time adjustments automatically for all major world cities.</p>

          {/* Section 1 — Quick Converter */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <h2 className="font-bold text-white text-lg">Convert a specific time</h2>

            {/* Quick select */}
            <div>
              <div className="text-xs text-[#a8a8b3] mb-2">Quick select — From zone:</div>
              <div className="flex flex-wrap gap-2">
                {QUICK.map(q => (
                  <button key={q.iana} onClick={() => setFromZone(q.iana)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${fromZone === q.iana ? "border-[#e94560] bg-[#e94560]/20 text-[#e94560]" : "border-[#0f3460] bg-[#16213e] text-[#a8a8b3] hover:border-[#e94560]"}`}>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Time</span>
                <select value={time} onChange={e => setTime(e.target.value)} className={inp}>
                  {Array.from({ length: 24 }, (_, i) => {
                    const ampm = i < 12 ? "AM" : "PM"
                    const h = i % 12 === 0 ? 12 : i % 12
                    return [`${String(h).padStart(2, "0")}:00 ${ampm}`, `${String(h).padStart(2, "0")}:30 ${ampm}`]
                  }).flat().map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <button onClick={swap} className="mb-0.5 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-lg text-[#4FC3F7] hover:border-[#e94560] transition-colors">⇄</button>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">To zone</span>
                <select value={toZone} onChange={e => setToZone(e.target.value)} className={inp}>
                  {ZONES.map(z => <option key={z.iana} value={z.iana}>{z.label}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-white">From zone</span>
              <select value={fromZone} onChange={e => setFromZone(e.target.value)} className={inp}>
                {ZONES.map(z => <option key={z.iana} value={z.iana}>{z.label}</option>)}
              </select>
            </label>

            {/* Result */}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-5">
              <div className="text-xs text-[#a8a8b3] mb-1">{fromDate} — {fromCity}</div>
              <div className="text-3xl font-black text-white">{time}</div>
              <div className="mt-3 flex items-center gap-2 text-[#4FC3F7] text-lg">
                <span>→</span>
                <div>
                  <div className="text-xs text-[#a8a8b3] mb-0.5">{convertedDate} — {toCity} {dayLabel && <span className="text-[#F9A825]">{dayLabel}</span>}</div>
                  <div className="text-3xl font-black text-[#e94560]">{converted}</div>
                </div>
              </div>
            </div>

            {/* Quick select to zone */}
            <div>
              <div className="text-xs text-[#a8a8b3] mb-2">Quick select — To zone:</div>
              <div className="flex flex-wrap gap-2">
                {QUICK.map(q => (
                  <button key={q.iana} onClick={() => setToZone(q.iana)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${toZone === q.iana ? "border-[#e94560] bg-[#e94560]/20 text-[#e94560]" : "border-[#0f3460] bg-[#16213e] text-[#a8a8b3] hover:border-[#e94560]"}`}>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 — Meeting Planner */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <h2 className="font-bold text-white text-lg">Find the best meeting time for your remote team</h2>

            <div className="space-y-2">
              {meetingLocs.map((loc, i) => {
                const z = ZONES.find(z => z.iana === loc)
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2">
                    <div>
                      <span className="text-sm font-semibold text-white">{z?.cities.split(",")[0]}</span>
                      <span className="text-xs text-[#a8a8b3] ml-2">{z?.label.split("—")[0].trim()}</span>
                    </div>
                    {meetingLocs.length > 2 && (
                      <button onClick={() => removeLoc(i)} className="text-[#FF6B6B] text-xs hover:opacity-70">✕</button>
                    )}
                  </div>
                )
              })}
            </div>

            {meetingLocs.length < 5 && (
              <div className="flex gap-2">
                <select value={addLoc} onChange={e => setAddLoc(e.target.value)} className={`flex-1 ${inp}`}>
                  {ZONES.filter(z => !meetingLocs.includes(z.iana)).map(z => (
                    <option key={z.iana} value={z.iana}>{z.label}</option>
                  ))}
                </select>
                <button onClick={() => { setMeetingLocs(l => [...l, addLoc]) }}
                  className="rounded-lg border border-[#e94560] bg-transparent px-4 py-2 text-sm font-semibold text-[#e94560] hover:bg-[#e94560] hover:text-white transition-colors">
                  + Add
                </button>
              </div>
            )}

            {/* Overlap result */}
            {overlapHours.length > 0 ? (
              <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-4">
                <div className="text-sm font-bold text-green-300 mb-2">✅ Best meeting windows (UTC):</div>
                <div className="flex flex-wrap gap-2">
                  {overlapHours.map(h => (
                    <span key={h} className="rounded-lg bg-green-900/30 border border-green-500/40 px-3 py-1 text-sm text-green-200">
                      {h === 0 ? "12" : h > 12 ? h - 12 : h}:00 {h < 12 ? "AM" : "PM"} UTC
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#a8a8b3] mt-2">These UTC hours fall within 9 AM–5 PM business hours for all selected locations.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 text-sm text-yellow-200">
                No standard business hour overlap found. Consider rotating meeting times to share the inconvenience fairly.
              </div>
            )}
          </div>

          <ShareButtons
            text="9 AM New York = 2 PM London = 11 PM Tokyo. Free time zone converter for remote teams: www.dayblip.com/tools/timezone-converter"
            url="https://www.dayblip.com/tools/timezone-converter"
            title="Time Zone Converter"
          />

          <RelatedTools tools={[
            { emoji: "💱", title: "Currency Converter", desc: "Live exchange rates for 150+ currencies", href: "/tools/currency-converter" },
            { emoji: "🏠", title: "WFH Savings Calculator", desc: "Financial value of remote work", href: "/tools/wfh-calculator" },
            { emoji: "💼", title: "Meeting Cost Calculator", desc: "Real cost of your meetings", href: "/productivity/meeting-cost" },
            { emoji: "📅", title: "Days Between Dates", desc: "Exact days between any two dates", href: "/days-between" },
          ]} />
        </div>
      </section>
    </div>
  )
}
