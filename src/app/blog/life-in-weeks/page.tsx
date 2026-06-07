import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/blog/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Your Life as a Grid of Squares",
  description: "A 90-year life is 4,680 weeks. At 35, about 1,820 are already filled. Seeing it is different from knowing it.",
  url: "https://www.dayblip.com/blog/life-in-weeks",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Life in Weeks", href: "/tools/life-in-weeks", description: "Generate your own personal life grid" },
  { title: "Life in Numbers", href: "/tools/life-in-numbers", description: "Your heartbeats, breaths and more in real time" },
  { title: "Weekends Left", href: "/weekends-left", description: "How many weekends remain before retirement?" },
  { title: "Retirement Countdown", href: "/retirement-countdown", description: "Days until you stop working" },
]

export default function LifeInWeeksPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Life in Weeks</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-green-900/40 text-green-300 rounded px-2 py-1">Life</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          Your Life as a Grid of Squares
        </h1>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              A 90-year life contains 4,680 weeks. At 35 years old you have lived approximately 1,820 weeks and have approximately 2,266 remaining at US average life expectancy. Visualizing life as a finite grid of squares makes the abstraction concrete in a way that the number alone does not.
            </p>
          </div>
        </section>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            Tim Urban published a post in 2014 called &quot;Your Life in Weeks.&quot; It showed a 90-year human life as a grid of small squares — each square representing one week. The post spread widely not because it contained new information, but because it made an old idea visceral.
          </p>

          <p>
            You already knew your life was finite. Seeing it as a specific number of small boxes did something that knowing the number did not.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Math</h2>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="text-left text-[#a8a8b3] pb-2 font-medium">Your Age</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Weeks Lived</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Weeks Remaining*</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["25", "1,300", "2,786"],
                  ["30", "1,560", "2,526"],
                  ["35", "1,820", "2,266"],
                  ["40", "2,080", "2,006"],
                  ["50", "2,600", "1,486"],
                  ["60", "3,120", "966"],
                ].map(([age, lived, remaining]) => (
                  <tr key={age} className="border-b border-[#2d3748]/50">
                    <td className="text-white py-2">{age}</td>
                    <td className="text-right py-2 text-[#a8a8b3]">{lived}</td>
                    <td className="text-right py-2 text-[#e94560] font-medium">{remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[#a8a8b3] text-xs mt-3">*Based on US average life expectancy of 78.6 years</p>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Visual Representations Work Differently</h2>

          <p>
            There is a well-documented gap in human psychology between understanding a fact and feeling its implications. We understand intellectually that we will die, that our time is limited, that we cannot get days back. We do not experience these facts with the same weight we give to immediate, concrete information.
          </p>

          <p>
            The life-in-weeks visualization works because it converts an abstract statistic into a concrete quantity. Your 78-year life expectancy is abstract. A grid where you can count the remaining empty boxes is concrete. The brain processes them differently. This is why researchers in behavioral economics have found that visualizing finite quantities produces measurably different decisions than presenting the same information as numbers.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Categories Within the Grid</h2>

          <p>
            Looking at the grid by category is often more useful than the raw count. If you are 35, consider how your remaining weeks break down:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#a8a8b3]">Career weeks remaining (to age 65)</span>
              <span className="text-white font-medium">~1,560 weeks</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a8a8b3]">Working days within those weeks</span>
              <span className="text-white font-medium">~7,800 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a8a8b3]">If you see parents 10×/year for 20 yrs</span>
              <span className="text-[#e94560] font-medium">200 visits total</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a8a8b3]">Summer vacations remaining before 65</span>
              <span className="text-[#e94560] font-medium">30 summers</span>
            </div>
          </div>

          <p>
            These sub-calculations are not meant to be morbid. They are meant to give specific quantities to things that are easy to treat as indefinitely available. The visits with aging parents. The summers before the kids are grown. The years of your current health. They are not.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Productive Use of This</h2>

          <p>
            There is a version of this exercise that generates anxiety and paralysis — &quot;I have already used so much,&quot; &quot;there is not much left.&quot; This is not the useful response.
          </p>

          <p>
            The productive response is clarity about priorities. If the remaining empty boxes are finite — and they are — then filling them in a way that aligns with what actually matters is not a vague aspiration. It is a resource allocation problem with real numbers.
          </p>

          <p>
            Most people operate on an implicit assumption of unlimited future time. &quot;I will do that when things calm down.&quot; &quot;We will travel when the kids are older.&quot; &quot;I will start that project next year.&quot; The life-in-weeks visualization reveals that the time available for these things is a specific number, not an unlimited buffer.
          </p>

          <p>
            The calculator below generates your personal grid — your actual filled and empty boxes — and lets you download it. Spend 30 seconds looking at the empty section. That is what you have to work with.
          </p>
        </article>

        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <p className="text-[#a8a8b3] text-sm mb-4 font-medium">Found this useful? Share it.</p>
          <ShareButtons
            shareText="A 90-year life is 4,680 weeks. At 35, about 1,820 are already filled. See your own life grid:"
            url="https://www.dayblip.com/blog/life-in-weeks"
          />
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </main>
  )
}
