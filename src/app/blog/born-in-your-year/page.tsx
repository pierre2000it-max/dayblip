import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/blog/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What the World Looked Like the Year You Were Born",
  description: "Birth year data becomes personal history when connected to your own existence.",
  url: "https://www.dayblip.com/blog/born-in-your-year",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Born In Year", href: "/born-in/1990", description: "Full facts for the year you arrived — change year in the URL" },
  { title: "Age Calculator", href: "/age-calculator", description: "Your exact age in years, months, days and weeks" },
  { title: "Music of Your Year", href: "/tools/music-of-your-year", description: "Songs that defined your birth year" },
  { title: "Life in Weeks", href: "/tools/life-in-weeks", description: "Visualize your whole life as a grid" },
]

export default function BornInYourYearPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Born In Your Year</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-green-900/40 text-green-300 rounded px-2 py-1">Life</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          What the World Looked Like the Year You Were Born
        </h1>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              The world population in 1980 was 4.45 billion — 3.65 billion fewer people than today. Gas cost $1.25 per gallon. The number one song was &quot;Call Me&quot; by Blondie. Birth year facts become personal history rather than trivia when connected to your own arrival in the world.
            </p>
          </div>
        </section>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            My father was born in 1955. When I was growing up, he told stories about the world he was born into the way most parents do — casually, in pieces, without a coherent picture. Gas cost almost nothing. There was no color television. The Korean War had just ended. These facts seemed to me like history trivia. Interesting, but not personal.
          </p>

          <p>
            What changes when you connect birth year data to your own existence is the frame. It stops being historical trivia and starts being personal context. The world that existed when you arrived — the population, the prices, the technology, the events — is the environment you were born into. It shaped what was normal before you were old enough to question what normal meant.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Numbers That Shift Your Perspective</h2>

          <p>
            When someone born in 1980 looks up the world population in 1980, they find 4.45 billion. Today it is approximately 8.1 billion. That means more than half the people on Earth are younger than a person born in 1980. The infrastructure, the job market, the housing prices, the college acceptance rates — all were shaped by demographic conditions meaningfully different from the ones that shaped your early experience.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <p className="text-[#a8a8b3] text-xs uppercase font-semibold tracking-wider mb-4">Sample birth year snapshot — 1990</p>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["World population", "5.3 billion"],
                  ["US gas price", "$1.15 / gallon"],
                  ["US median home price", "$122,900"],
                  ["Number one song", "Nothing Compares 2 U — Sinéad O&apos;Connor"],
                  ["Life expectancy at birth", "75.4 years"],
                  ["Approximate birth order", "~95th billionth human ever born"],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-[#2d3748]/50">
                    <td className="text-[#a8a8b3] py-2">{label}</td>
                    <td className="text-right py-2 text-white font-medium" dangerouslySetInnerHTML={{ __html: value }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Price Anchors</h2>

          <p>
            One of the most practically useful birth year facts is the price of common goods in the year you were born. Not because nostalgia is interesting, but because it reveals how dramatically price levels have shifted and contextualizes a lot of inter-generational disagreement.
          </p>

          <p>
            A house that cost $64,000 in 1980 costs approximately $400,000 as a national median today — a 525% increase. Inflation-adjusted wages have not risen nearly as fast. When older generations talk about buying a house in their 20s, they are not describing a different level of discipline or sacrifice. They are describing a different price-to-income ratio that no longer exists in most US markets.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Number One Song</h2>

          <p>
            The number one song the week you were born is the data point that consistently generates the most emotional response. It is a specific cultural artifact from that precise moment in time. For someone born in mid-1985, it was &quot;Everybody Wants to Rule the World&quot; by Tears for Fears. For someone born in early 1995, it was &quot;Creep&quot; by TLC.
          </p>

          <p>
            The song connection works because music is emotionally indexed in a way that population statistics are not. It pulls the birth year from the abstract into something you can actually listen to.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Your Place in Human History</h2>

          <p>
            Demographic historians estimate that approximately 108 billion humans have ever been born. If you were born in 1990 among a world population of 5.3 billion, you were approximately the 95th to 96th billionth human to have ever lived.
          </p>

          <p>
            This number does something specific: it places your individual existence within the largest possible context. You are one of 108 billion. You are also one of 8 billion alive right now. Both of those facts are simultaneously humbling and, when you sit with them, remarkable.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Using the Data</h2>

          <p>
            The born-in-year calculators on Dayblip compile the major factual categories — world population, gas price, number one song, major events, life expectancy at birth, notable births — for any birth year from 1940 to 2010.
          </p>

          <p>
            The point is not nostalgia. It is orientation. Understanding the world you were born into gives you a frame for the assumptions you absorbed without choosing them. Prices, demographics, cultural context — these shaped your baseline sense of what is normal. Seeing the data makes the shaping visible.
          </p>
        </article>

        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <p className="text-[#a8a8b3] text-sm mb-4 font-medium">Found this useful? Share it.</p>
          <ShareButtons
            shareText="The world population the year you were born. The gas price. The number one song. See your birth year:"
            url="https://www.dayblip.com/blog/born-in-your-year"
          />
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </main>
  )
}
