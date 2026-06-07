import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/blog/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Number Most Smokers Have Never Calculated",
  description: "A pack-a-day habit invested at 7% grows to $640,000 over 40 years.",
  url: "https://www.dayblip.com/blog/true-cost-of-smoking",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "True Cost of Smoking", href: "/tools/smoking-cost", description: "Full financial and time cost of your habit" },
  { title: "Habit Cost Calculator", href: "/health/habit-cost", description: "Calculate the cost of any daily habit" },
  { title: "Latte Factor Calculator", href: "/curiosity/latte-factor", description: "Any daily spend invested instead" },
  { title: "Compound Interest", href: "/finance/compound-interest", description: "Watch invested money grow over decades" },
]

export default function TrueCostOfSmokingPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">True Cost of Smoking</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          The Number Most Smokers Have Never Calculated
        </h1>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              A pack-a-day smoker at $9.50 per pack spends $3,468 per year on cigarettes. Invested at 7% annual return over 40 years that money grows to $640,000. The habit also costs approximately 608 hours per year — 25 full days — spent in the act of smoking.
            </p>
          </div>
        </section>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            I am not going to tell you smoking is bad for you. You know that. Every pack of cigarettes sold in the United States since 1966 has contained a health warning. The health cost of smoking is the most covered topic in public health history.
          </p>

          <p>
            What almost nobody has calculated is the financial cost — not the healthcare expenses downstream, but the straightforward investment opportunity cost of spending money on cigarettes instead of letting it grow.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Baseline Number</h2>

          <p>
            The national average price of a pack of cigarettes in the United States is approximately $9.50 as of 2024, with significant variation by state. New York averages $12.85 per pack. Missouri averages $7.05. A pack-a-day smoker spends:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Per day", "$9.50"],
                  ["Per month", "$289"],
                  ["Per year", "$3,468"],
                  ["Over 10 years", "$34,680"],
                  ["Over 20 years", "$69,360"],
                  ["Over 40 years", "$138,720"],
                ].map(([period, cost]) => (
                  <tr key={period} className="border-b border-[#2d3748]/50">
                    <td className="text-[#a8a8b3] py-2">{period}</td>
                    <td className="text-right py-2 text-white font-medium">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            These numbers are significant. The investment numbers are larger.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What That Money Does If Invested Instead</h2>

          <p>
            The $289 per month spent on cigarettes, invested instead in a broadly diversified index fund earning 7% average annual return:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="text-left text-[#a8a8b3] pb-2 font-medium">Time Period</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Amount Spent on Cigarettes</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">If Invested at 7%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["10 years", "$34,680", "$49,800"],
                  ["20 years", "$69,360", "$161,800"],
                  ["30 years", "$104,040", "$348,600"],
                  ["40 years", "$138,720", "$640,000"],
                ].map(([period, spent, invested]) => (
                  <tr key={period} className="border-b border-[#2d3748]/50">
                    <td className="text-white py-2">{period}</td>
                    <td className="text-right py-2 text-[#a8a8b3]">{spent}</td>
                    <td className="text-right py-2 text-[#e94560] font-bold">{invested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            $640,000 from a pack-a-day habit, invested at 7% over 40 years. Most smokers have never seen this number. Not because they are avoiding it — because nobody has presented it to them. The conversation about smoking almost always ends at health consequences. The financial calculation is sitting there, waiting to be run.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Time Cost</h2>

          <p>
            Beyond the financial cost, there is a time cost that is rarely calculated. A standard cigarette takes approximately 5 minutes to smoke. A pack-a-day smoker smokes 20 cigarettes per day.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Per day</span><span className="text-white font-medium">100 minutes</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Per year</span><span className="text-white font-medium">608 hours (25 full days)</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Over 20 years</span><span className="text-[#e94560] font-bold">500 days (71 weeks)</span></div>
          </div>

          <p>
            Over 20 years, more than a year of waking hours is spent in the physical act of smoking. This time cost is not frequently discussed because it is harder to put a dollar figure on time than on money. But it is real.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Honest Framing</h2>

          <p>
            The point of these calculations is not to shame smokers. Nicotine is one of the most addictive substances humans have encountered, and addiction is not a simple choice problem. The quit rate among smokers who try to quit without assistance is approximately 5% per attempt.
          </p>

          <p>
            The point is that the financial cost of the habit is almost never presented clearly, and people make better decisions with better information. A $640,000 opportunity cost over 40 years deserves to be part of the conversation — alongside the health consequences that receive far more attention.
          </p>

          <p>
            The smoking cost calculator below calculates your specific numbers: your state&apos;s average price, your years smoking, the investment value of those funds at various return rates, and the time cost in days.
          </p>
        </article>

        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <p className="text-[#a8a8b3] text-sm mb-4 font-medium">Found this useful? Share it.</p>
          <ShareButtons
            shareText="A pack-a-day smoking habit invested instead at 7% grows to $640,000 over 40 years. Calculate your number:"
            url="https://www.dayblip.com/blog/true-cost-of-smoking"
          />
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </main>
  )
}
