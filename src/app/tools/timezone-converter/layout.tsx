import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Time Zone Converter — Convert Any Time Zone Instantly",
  description: "Convert time between any two time zones. Find meeting times for remote teams across New York, London, Tokyo, and 400+ cities. Free — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/timezone-converter" },
}

// IST is UTC+5:30 all year. US Eastern is UTC-5 (EST) in winter and UTC-4 (EDT) in summer.
const EST_TO_IST_MINUTES = 10 * 60 + 30
const EDT_TO_IST_MINUTES = 9 * 60 + 30

function fmt(totalMinutes: number): string {
  const nextDay = totalMinutes >= 1440
  const m = ((totalMinutes % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, "0")
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${h24 < 12 ? "AM" : "PM"}${nextDay ? " (next day)" : ""}`
}

const HOURS = Array.from({ length: 24 }, (_, h) => h)
const th = { textAlign: "left" as const, padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" as const }
const td = { padding: "6px 12px", borderBottom: "1px solid #0f3460" }

const FAQS = [
  { q: "What is 9:30 AM EST in IST?", a: `${fmt(9 * 60 + 30 + EST_TO_IST_MINUTES)} IST on the same day. During daylight saving time, 9:30 AM EDT is ${fmt(9 * 60 + 30 + EDT_TO_IST_MINUTES)} IST.` },
  { q: "How many hours is IST ahead of EST?", a: "10 hours 30 minutes. IST is UTC+5:30 and EST is UTC-5. When the US moves to daylight saving time (EDT, UTC-4), the gap shrinks to 9 hours 30 minutes." },
  { q: "Does India observe daylight saving time?", a: "No. IST stays at UTC+5:30 all year, so the gap with the US changes twice a year when US clocks change. US daylight saving time runs from the second Sunday in March to the first Sunday in November." },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>EST to IST conversion chart</h2>
          <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            India Standard Time (IST) is 10 hours 30 minutes ahead of US Eastern Standard Time (EST) and 9 hours 30 minutes ahead of
            Eastern Daylight Time (EDT). Find your Eastern time in the left column.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
              <thead>
                <tr>
                  <th scope="col" style={th}>Eastern time</th>
                  <th scope="col" style={th}>IST (when EST)</th>
                  <th scope="col" style={th}>IST (when EDT)</th>
                </tr>
              </thead>
              <tbody>
                {HOURS.map((h, i) => (
                  <tr key={h} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                    <td style={td}>{fmt(h * 60)}</td>
                    <td style={td}>{fmt(h * 60 + EST_TO_IST_MINUTES)}</td>
                    <td style={td}>{fmt(h * 60 + EDT_TO_IST_MINUTES)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "grid", gap: "16px" }}>
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600, margin: "0 0 6px" }}>{f.q}</h3>
                <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
