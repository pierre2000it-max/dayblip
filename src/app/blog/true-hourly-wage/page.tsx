import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/blog/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Your Salary Actually Pays Per Hour",
  description: "Your true hourly wage after commute time and work costs is usually 15–25% lower than your stated salary.",
  url: "https://www.dayblip.com/blog/true-hourly-wage",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "True Hourly Wage Calculator", href: "/tools/true-hourly-wage", description: "Calculate your own true rate after all work-related costs" },
  { title: "WFH Savings Calculator", href: "/tools/wfh-calculator", description: "See exactly what remote work is worth in dollars" },
  { title: "Salary Negotiation", href: "/tools/salary-negotiation", description: "Get paid what your role is actually worth" },
  { title: "Salary Checker", href: "/tools/salary-checker", description: "Find out if you are at, above or below market rate" },
]

export default function TrueHourlyWagePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">True Hourly Wage</span>
        </nav>

        {/* Meta */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          What Your Salary Actually Pays Per Hour
        </h1>

        {/* Quick Answer */}
        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              A $75,000 salary appears to pay $36.06 per hour. After accounting for a 30-minute daily commute, three bought lunches per week and basic work clothing costs, the true hourly rate drops to approximately $27–29 per hour — 20–22% less than the stated salary.
            </p>
          </div>
        </section>

        {/* Article */}
        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            I did this calculation for the first time in 2019, sitting in traffic on the way home from a job I thought paid well. I had just been offered a raise to $78,000 and I was trying to figure out if it was enough. I opened a spreadsheet and started listing every cost the job created that would not exist if I did not have it. By the time I finished, I had a different number entirely.
          </p>

          <p>
            Your salary is not your hourly wage. The number on your offer letter is calculated on 2,080 hours per year — 40 hours a week for 52 weeks. For a $75,000 salary, that gives you $36.06 per hour on paper. Almost nobody actually earns $36.06 per hour.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Stated Rate Ignores</h2>

          <p>
            The calculation leaves out everything your job requires beyond the 40 hours you spend at your desk. Commuting is the obvious one. The average American commute is 27 minutes each way — nearly an hour per day. Over a 250-day work year, that is 225 hours you spent moving toward and away from work that nobody counted and nobody paid for.
          </p>

          <p>
            Then there are the direct financial costs. Work clothing is real. Even in a casual office, most people spend $600 to $1,200 per year maintaining a wardrobe they would not need otherwise. Bought lunches, convenience dinners on late nights, coffee at the client meeting — these add up to $2,000 to $3,500 per year for most full-time workers. There is also parking, transit passes, professional memberships, and software subscriptions your employer does not cover.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The True Hourly Calculation</h2>

          <p>Here is how to calculate it. Start with your take-home pay after tax — not your gross salary. Then:</p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3"><span className="text-[#e94560] font-bold">1.</span> Add up all annual work-required costs (commuting, clothing, food, other job-only expenses)</li>
              <li className="flex gap-3"><span className="text-[#e94560] font-bold">2.</span> Subtract that total from your take-home pay</li>
              <li className="flex gap-3"><span className="text-[#e94560] font-bold">3.</span> Add up total annual hours worked (scheduled hours + commute + prep time + unpaid overtime)</li>
              <li className="flex gap-3"><span className="text-[#e94560] font-bold">4.</span> Divide adjusted income by total hours</li>
            </ol>
          </div>

          <p>
            For a $75,000 salary with a $52,000 take-home, $2,400 in work clothing and food costs, and a 45-minute round-trip commute:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Adjusted income</span><span className="text-white font-medium">$52,000 − $2,400 = $49,600</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Total hours</span><span className="text-white font-medium">2,080 + 188 commute = 2,268 hrs</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-[#e94560] font-bold">True hourly rate</span><span className="text-[#e94560] font-bold">$49,600 ÷ 2,268 = $21.87/hr</span></div>
          </div>

          <p>
            The stated rate was $25 per hour after tax. The true rate is $21.87. That is a 12% gap — and this is a relatively modest commute with moderate work expenses. Add longer commutes or higher food and clothing costs and the gap widens further.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why This Changes Everything</h2>

          <p>
            The true hourly rate changes almost every financial decision you make at work. It changes how you evaluate a raise. A $3,000 raise sounds meaningful. If your employer is also asking you to come into the office two additional days per week — adding 48 hours of commuting per year — the true value of that raise may be negative.
          </p>

          <p>
            It changes how you evaluate remote work. If working from home saves you $2,400 in commuting costs and 188 hours per year, that is worth $10,000 to $15,000 in true compensation even with no change to your salary.
          </p>

          <p>
            It changes how you evaluate side income. Many people dismiss a side project earning $30 per hour because their salary &quot;pays&quot; $36 per hour. If their true hourly rate is $22, that side project is paying 36% more than their day job for the same hour of time.
          </p>

          <p>
            It changes how you evaluate job offers. A $90,000 offer in a city with a long commute may pay less per true hour than an $82,000 offer close to home. You need the actual numbers — not the headline number — before you decide.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Promotion Math Nobody Runs</h2>

          <p>
            This calculation also clarifies the real value of promotions. If a promotion adds $8,000 in salary but also adds 15 hours of meetings per week that were not in your previous role, you are accepting 780 extra hours per year for $8,000 — about $10 per hour for your additional time. That may still be worth it. But you should know the number before you sign.
          </p>

          <p>
            Most people accept job offers, promotions and raises based on the stated salary. The true hourly wage calculation gives you the actual cost of your time. Use the calculator below to find your number.
          </p>
        </article>

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <p className="text-[#a8a8b3] text-sm mb-4 font-medium">Found this useful? Share it.</p>
          <ShareButtons
            shareText="My $75,000 salary actually pays ~$22/hr after commute and work costs. Calculate yours:"
            url="https://www.dayblip.com/blog/true-hourly-wage"
          />
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </main>
  )
}
