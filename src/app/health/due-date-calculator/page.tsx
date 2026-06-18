"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import FAQAccordion from "@/components/FAQAccordion"
import AuthorByline from "@/components/AuthorByline"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

const ZODIAC = [
  ["Capricorn", [1,1],[1,19]], ["Aquarius", [1,20],[2,18]], ["Pisces", [2,19],[3,20]],
  ["Aries", [3,21],[4,19]], ["Taurus", [4,20],[5,20]], ["Gemini", [5,21],[6,20]],
  ["Cancer", [6,21],[7,22]], ["Leo", [7,23],[8,22]], ["Virgo", [8,23],[9,22]],
  ["Libra", [9,23],[10,22]], ["Scorpio", [10,23],[11,21]], ["Sagittarius", [11,22],[12,21]],
  ["Capricorn", [12,22],[12,31]],
] as const

function getZodiac(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  for (const [sign, [sm, sd], [em, ed]] of ZODIAC) {
    if ((m === sm && d >= sd) || (m === em && d <= ed)) return sign
  }
  return "Capricorn"
}

const MILESTONES: [number, string][] = [
  [4, "Pregnancy test positive"],
  [6, "Heartbeat detectable"],
  [8, "Baby the size of a kidney bean"],
  [12, "End of first trimester"],
  [20, "Anatomy scan / gender reveal"],
  [24, "Viability milestone"],
  [28, "Third trimester begins"],
  [37, "Early term"],
  [39, "Full term"],
  [40, "Due date"],
  [42, "Overdue — induction discussed"],
]

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function weeksFromNow(d: Date): number {
  return Math.round((d.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000))
}

function daysFromNow(d: Date): number {
  return Math.round((d.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
}

interface Result {
  dueDate: Date
  tri1End: Date
  tri2End: Date
  tri3Start: Date
  fullTermStart: Date
  zodiac: string
  weeksAway: number
  daysAway: number
  milestones: { week: number; label: string; date: Date }[]
}

export default function DueDateCalculatorPage() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp")
  const [lmpDate, setLmpDate] = useState("")
  const [cycleLength, setCycleLength] = useState(28)
  const [conceptionDate, setConceptionDate] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  function calculate() {
    setError("")
    let due: Date

    if (method === "lmp") {
      if (!lmpDate) { setError("Please enter your last menstrual period date."); return }
      const lmp = new Date(lmpDate + "T12:00:00")
      const adjustment = cycleLength - 28
      due = addDays(lmp, 280 + adjustment)
    } else {
      if (!conceptionDate) { setError("Please enter your conception date."); return }
      const conception = new Date(conceptionDate + "T12:00:00")
      due = addDays(conception, 266)
    }

    const lmpRef = method === "lmp"
      ? new Date(lmpDate + "T12:00:00")
      : addDays(due, -280)

    const milestones = MILESTONES.map(([week, label]) => ({
      week,
      label,
      date: addDays(lmpRef, week * 7),
    }))

    setResult({
      dueDate: due,
      tri1End: addDays(lmpRef, 12 * 7),
      tri2End: addDays(lmpRef, 26 * 7),
      tri3Start: addDays(lmpRef, 27 * 7),
      fullTermStart: addDays(lmpRef, 39 * 7),
      zodiac: getZodiac(due),
      weeksAway: weeksFromNow(due),
      daysAway: daysFromNow(due),
      milestones,
    })
  }

  const shareText = result
    ? `My baby is due on ${fmtDate(result.dueDate)}! Calculate your pregnancy due date free: www.dayblip.com/health/due-date-calculator`
    : "Calculate your pregnancy due date free: www.dayblip.com/health/due-date-calculator"

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Pregnancy Due Date Calculator", "Calculate pregnancy due date from last menstrual period or conception date", "https://www.dayblip.com/health/due-date-calculator", "HealthApplication"),
        faqSchema([
          { question: "How is a pregnancy due date calculated?", answer: "A due date is calculated using Naegele's Rule — add 280 days (40 weeks) to the first day of your last menstrual period. If your cycle is longer or shorter than 28 days the due date is adjusted accordingly. Your doctor may also use ultrasound measurements to confirm or adjust the estimated due date." },
          { question: "How accurate is a due date calculator?", answer: "Due date calculators give an estimate based on average pregnancy length. Only about 5% of babies are born on their exact due date. Most babies arrive within two weeks before or after the estimated date. Ultrasound dating in the first trimester is more accurate than date-based calculations." },
          { question: "What is full term pregnancy?", answer: "Full term pregnancy is 39 to 40 weeks of gestation. Early term is 37 to 38 weeks. Late term is 41 weeks and post-term is 42+ weeks. Babies born before 37 weeks are considered premature. Most doctors recommend waiting until at least 39 weeks for planned deliveries." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Health", url: "https://www.dayblip.com/health" },
          { name: "Due Date Calculator", url: "https://www.dayblip.com/health/due-date-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🤰</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Pregnancy Due Date Calculator — When Is Your Baby Due?</h1>
          <p className="text-[#a8a8b3]">Calculate from your last period or conception date — with trimester timeline and milestones</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Health", href: "/health" }, { label: "Due Date Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>A pregnancy due date is calculated by adding 280 days (40 weeks) to the first day of your last menstrual period — known as Naegele&apos;s Rule. If your last period started January 1 your estimated due date is October 8. Only 5% of babies are born on their exact due date. Most arrive within two weeks before or after. Full term is 39 to 40 weeks.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>An estimated due date (EDD) marks the end of the 40th week of pregnancy counted from the first day of your last menstrual period. Pregnancy is divided into three trimesters: first (weeks 1–12) second (weeks 13–26) and third (weeks 27–40). Your healthcare provider may adjust your due date based on ultrasound measurements. This calculator is for informational purposes only — always consult your doctor.</p>

          <AuthorByline variant="tool" />

          {/* Method toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
            <button onClick={() => setMethod("lmp")}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: method === "lmp" ? "#e94560" : "#1a1a2e", color: method === "lmp" ? "#fff" : "#a8a8b3" }}>
              I know my last period date
            </button>
            <button onClick={() => setMethod("conception")}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: method === "conception" ? "#e94560" : "#1a1a2e", color: method === "conception" ? "#fff" : "#a8a8b3" }}>
              I know my conception date
            </button>
          </div>

          {method === "lmp" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">First day of last menstrual period</span>
                <input type="date" value={lmpDate} max={today} onChange={e => setLmpDate(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Average cycle length — {cycleLength} days</span>
                <input type="range" min={20} max={45} value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value))}
                  className="w-full accent-[#e94560]" />
                <div className="flex justify-between text-xs text-[#a8a8b3] mt-1"><span>20 days</span><span>45 days</span></div>
              </label>
            </div>
          ) : (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Conception date</span>
              <input type="date" value={conceptionDate} max={today} onChange={e => setConceptionDate(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          )}

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Due Date
          </button>

          {result && (
            <div className="space-y-4">
              {/* Main result */}
              <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
                <div className="text-sm text-[#a8a8b3] mb-1">Estimated Due Date</div>
                <div className="text-4xl font-black text-[#F9A825]">{fmtDate(result.dueDate)}</div>
                <div className="text-sm text-white mt-1">{DAYS[result.dueDate.getDay()]}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] p-2">
                    <div className="font-black text-white text-xl">{result.daysAway > 0 ? result.daysAway : 0}</div>
                    <div className="text-[#a8a8b3] text-xs">days until due date</div>
                  </div>
                  <div className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] p-2">
                    <div className="font-black text-white text-xl">{result.zodiac}</div>
                    <div className="text-[#a8a8b3] text-xs">baby&apos;s zodiac sign</div>
                  </div>
                </div>
              </div>

              {/* Trimester timeline */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                <h2 className="font-bold text-white">Trimester Timeline</h2>
                {(
                  [
                    { icon: "🌱", label: "First Trimester ends",  date: result.tri1End,      week: "Week 12" },
                    { icon: "🌸", label: "Second Trimester ends", date: result.tri2End,      week: "Week 26" },
                    { icon: "⭐", label: "Third Trimester begins",date: result.tri3Start,    week: "Week 27" },
                    { icon: "✅", label: "Full term begins",       date: result.fullTermStart,week: "Week 39" },
                    { icon: "🎉", label: "Estimated due date",    date: result.dueDate,      week: "Week 40" },
                  ] as { icon: string; label: string; date: Date; week: string }[]
                ).map(({ icon, label, date, week }) => (
                  <div key={label} className="flex items-center justify-between border-b border-[#0f3460] pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <div>
                        <div className="text-sm text-white">{label}</div>
                        <div className="text-xs text-[#a8a8b3]">{week}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#4FC3F7]">{fmtDate(date)}</div>
                  </div>
                ))}
              </div>

              {/* Milestones table */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="font-bold text-white mb-3">Weekly Milestones</h2>
                <div className="space-y-2">
                  {result.milestones.map(({ week, label, date }) => (
                    <div key={week} className="grid grid-cols-[40px_1fr_auto] gap-2 text-sm border-b border-[#0f3460] pb-2 last:border-0">
                      <div className="text-[#e94560] font-bold">W{week}</div>
                      <div className="text-white">{label}</div>
                      <div className="text-[#a8a8b3] text-xs">{fmtDate(date)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 text-xs text-[#a8a8b3]">
                ⚠️ This calculator provides an estimate for informational purposes only. Actual due dates are determined by your healthcare provider based on clinical assessment and ultrasound. Always consult your doctor or midwife for medical advice.
              </div>

              <FAQAccordion items={[
                {
                  question: "How is a pregnancy due date calculated?",
                  answer: "A due date is calculated using Naegele's Rule — add 280 days (40 weeks) to the first day of your last menstrual period (LMP). If your cycle is longer or shorter than 28 days the calculator adjusts accordingly. For example a 35-day cycle shifts the due date 7 days later. Conception date calculation adds 266 days (38 weeks) from the estimated date of conception. Your healthcare provider may adjust your due date based on first-trimester ultrasound measurements which are the most accurate method."
                },
                {
                  question: "How accurate is a due date calculator?",
                  answer: "Due date calculators provide an estimate — only about 5% of babies are born on their exact due date. Most babies arrive within 2 weeks before or after the estimated due date. First-trimester ultrasound (before 14 weeks) is the most accurate method for confirming dates and can adjust the LMP-based estimate if there is a significant discrepancy. The due date is best understood as the center of a 5-week window (weeks 38-42) during which birth is expected."
                },
                {
                  question: "What is full term pregnancy?",
                  answer: "Full term pregnancy is defined as 39-40 weeks of gestation. Early term is 37-38 weeks, late term is 41 weeks, and post-term is 42 weeks or more. Babies born before 37 weeks are considered premature. The American College of Obstetricians and Gynecologists recommends avoiding elective deliveries before 39 weeks when possible as the final weeks of pregnancy are important for brain, lung, and liver development."
                },
                {
                  question: "What are the three trimesters of pregnancy?",
                  answer: "The first trimester runs from week 1 through week 12 — covering early development, organ formation, and the highest risk period for miscarriage. The second trimester runs from week 13 through week 26 — often called the most comfortable trimester, when most major anomaly screenings occur. The third trimester runs from week 27 through week 40 — covering rapid fetal growth, lung maturation, and preparation for birth."
                },
                {
                  question: "Can I use this calculator if my cycle is not 28 days?",
                  answer: "Yes — this calculator adjusts for cycle length. The standard Naegele's Rule assumes a 28-day cycle with ovulation on day 14. If your cycle is longer (say 35 days) ovulation typically occurs on day 21, shifting conception and the due date approximately 7 days later. Use the cycle length slider to enter your average cycle length. If your cycle is irregular consult your healthcare provider — ultrasound dating is more reliable in that case."
                },
                {
                  question: "When should I see a doctor after calculating my due date?",
                  answer: "Schedule your first prenatal appointment as soon as you have a positive pregnancy test — ideally between weeks 6 and 8. Early prenatal care is associated with better outcomes for both mother and baby. Your doctor will confirm your due date with ultrasound, conduct initial blood work, and establish your prenatal care schedule. Do not rely on this calculator as a substitute for medical care — it is a planning tool only."
                }
              ]} />

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/due-date-calculator" title="Pregnancy Due Date Calculator" />
            </div>
          )}

          <LastUpdated date="June 2026" />
          <MethodologyNote text="Due date calculated using Naegele's Rule: first day of last menstrual period plus 280 days (40 weeks), adjusted for cycle length deviation from 28-day baseline. Conception date method adds 266 days (38 weeks) from estimated conception date. Trimester boundaries: first trimester weeks 1-12, second trimester weeks 13-26, third trimester weeks 27-40. Full term defined as 39-40 weeks per American College of Obstetricians and Gynecologists (ACOG) guidelines. Weekly milestones sourced from ACOG and Mayo Clinic pregnancy week-by-week data. This calculator is for informational and planning purposes only — not a substitute for medical advice. Always consult your healthcare provider for clinical due date determination." />

          <RelatedTools tools={[
            { emoji: "📅", title: "Age Calculator", desc: "Calculate exact age in days and weeks", href: "/age-calculator" },
            { emoji: "📊", title: "Life in Weeks", desc: "Visualize your entire life as a grid", href: "/tools/life-in-weeks" },
            { emoji: "❤️", title: "Life Expectancy Calculator", desc: "Statistical life expectancy estimate", href: "/health/life-expectancy" },
            { emoji: "💊", title: "BMI Calculator", desc: "Body mass index calculator", href: "/health/bmi-calculator" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
