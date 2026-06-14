import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Average American Salary by Age: What BLS Data Actually Shows",
  description: "Median weekly earnings peak at $1,220 for workers 45–54. The gender pay gap of 16.3% reflects occupation mix alongside career interruptions. Full BLS breakdown.",
  url: "https://www.dayblip.com/blog/average-salary-by-age",
  datePublished: "2026-06-13",
  dateModified: "2026-06-13",
  author: { "@type": "Organization", name: "Dayblip" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "At what age do American workers earn the most?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "According to Bureau of Labor Statistics Q4 2023 data, median weekly earnings peak at $1,220 per week ($63,440 annually) for workers aged 45 to 54. Earnings decline slightly after 54, falling to $1,154 per week at 55–64 and $1,048 at 65+. The peak earnings window for most workers is roughly age 40–55.",
      },
    },
    {
      "@type": "Question",
      name: "What drives the gender pay gap in median earnings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 16.3% median earnings gap between men and women (BLS Q4 2023) reflects two main factors: occupation and industry mix (women are more concentrated in lower-paying occupations as a group) and career interruptions (women are more likely to take parental leave, work part-time, or leave the workforce temporarily for caregiving). Within the same occupation, controlled pay gaps are substantially smaller but still present. Both factors are documented in peer-reviewed research including NBER working papers.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Salary Comparison Tool", href: "/career/salary-comparison", description: "See how your salary compares to peers in your field and region." },
  { title: "True Hourly Wage Calculator", href: "/career/true-hourly-wage", description: "Calculate what you actually earn per hour after work-related costs." },
  { title: "Career Timeline Planner", href: "/career/career-timeline", description: "Model your earnings trajectory over a full career." },
  { title: "Job Offer Comparison", href: "/career/job-offer-comparison", description: "Compare total compensation across two job offers." },
]

export default function AverageSalaryByAgePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Average Salary by Age</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          Average American Salary by Age: What BLS Data Actually Shows
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Bureau of Labor Statistics earnings data by age group — with a plain-English explanation of the gender pay gap and what actually drives it.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Median weekly earnings peak at <strong>$1,220/week ($63,440/year)</strong> for workers aged 45–54, per BLS Q4 2023. Entry-level workers aged 16–24 earn a median of $685/week ($35,620/year). The overall gender pay gap in median weekly earnings is <strong>16.3%</strong> — driven by occupation mix as well as career interruptions. Within the same occupation and hours worked, the gap is substantially smaller but not zero.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="Peak US salary is $63,440/year at age 45–54 per BLS. Entry-level: $35,620. The 16.3% gender pay gap reflects both occupation mix and career interruptions. Full breakdown: www.dayblip.com/blog/average-salary-by-age"
            url="https://www.dayblip.com/blog/average-salary-by-age"
            title="Average American Salary by Age: What BLS Data Actually Shows"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Median Weekly Earnings by Age Group — BLS Q4 2023</h2>

          <p>
            The Bureau of Labor Statistics publishes median usual weekly earnings for full-time wage and salary workers by age group each quarter. The Q4 2023 data (the most recent full-year benchmark available) shows a clear earnings arc across the career.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Age group</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Median weekly</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Annual (×52)</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">vs. peak</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { age: "16–24", weekly: "$685", annual: "$35,620", vs: "−44%" },
                  { age: "25–34", weekly: "$1,070", annual: "$55,640", vs: "−12%" },
                  { age: "35–44", weekly: "$1,207", annual: "$62,764", vs: "−1%" },
                  { age: "45–54", weekly: "$1,220", annual: "$63,440", vs: "Peak", peak: true },
                  { age: "55–64", weekly: "$1,154", annual: "$59,992", vs: "−5%" },
                  { age: "65+",   weekly: "$1,048", annual: "$54,496", vs: "−14%" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: row.peak ? "#1e2d4a" : i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.age}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825] font-semibold">{row.weekly}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{row.annual}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${row.peak ? "text-[#4FC3F7]" : "text-[#a8a8b3]"}`}>{row.vs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#a8a8b3]">
            Source: Bureau of Labor Statistics, Usual Weekly Earnings of Wage and Salary Workers, Q4 2023 (BLS.gov). Full-time workers only. Medians; not averages — average earnings are higher due to high earner skew.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Earnings Peak in the 45–54 Band</h2>

          <p>
            The 45–54 peak reflects the compounding of several factors over a 20–25 year career: accumulated industry expertise, management seniority, professional networks, and credential advancement. Workers in this band are typically in mid-to-senior individual contributor or management roles rather than entry-level or junior positions.
          </p>

          <p>
            The slight decline from 55 onward does not necessarily mean older workers are paid less — it reflects composition effects. High earners in high-cost metropolitan areas often retire earlier, leaving the 55–64 working population weighted toward workers in lower-cost areas or less-senior roles. Additionally, some workers voluntarily step back to part-time arrangements, which BLS excludes, or to bridge employment before retirement.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Gender Pay Gap — What the 16.3% Reflects</h2>

          <p>
            In Q4 2023, women working full-time earned a median of $1,017 per week; men earned $1,214 per week — a gap of $197, or 16.3% (Source: BLS, Table 1). This is the headline gap in median earnings, not a controlled within-occupation comparison.
          </p>

          <p>
            Two main factors explain most of the gap:
          </p>

          <p>
            <strong className="text-white">1. Occupation and industry mix.</strong> Women are more concentrated, as a group, in occupations with lower median pay (education, social work, administrative support) and less concentrated in higher-paying fields (engineering, finance, technology). This reflects both historical barriers that have substantially narrowed and ongoing differences in field selection. Research by economists Claudia Goldin (2023 Nobel laureate in Economics) and others finds this factor accounts for a significant portion of the earnings gap at the aggregate level.
          </p>

          <p>
            <strong className="text-white">2. Career interruptions.</strong> Women are statistically more likely to take parental leave, work part-time for a period, or exit the workforce temporarily for caregiving. Even short career gaps compound over time through lost seniority, reduced raises, and slower promotion timelines. Research from Harvard Business School and NBER finds that the earnings penalty for career interruptions is largest in high-paying, high-demand occupations like finance and law where hours-intensity is highest.
          </p>

          <p>
            Within the same occupation, hours worked, and experience level, controlled pay gaps are substantially smaller — but research consistently finds they are not zero. Estimates vary widely by study design and data source; a reasonable range from peer-reviewed literature is 5–8% within-occupation for comparable workers (Source: NBER Working Paper No. 18533, Goldin 2014; National Academy of Sciences 2020 report on pay equity).
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What These Numbers Mean for Career Planning</h2>

          <p>
            The BLS data is a useful benchmark, not a ceiling. The 25–34 median of $1,070/week ($55,640 annually) is a midpoint — roughly half of 25-to-34-year-old full-time workers earn more, half earn less. Field, employer, geographic market, and education level create significant variance around these medians.
          </p>

          <p>
            The steepest earnings growth typically happens between the early 20s and mid-30s — a window where job-switching tends to produce larger income gains than staying put. Research from the Atlanta Federal Reserve&apos;s Wage Growth Tracker shows that workers who switched jobs consistently earned higher wage growth than job-stayers from 2014 to 2023.
          </p>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="Peak US salary is $63,440/year at age 45–54 per BLS. Entry-level: $35,620. The 16.3% gender pay gap reflects both occupation mix and career interruptions. Full breakdown: www.dayblip.com/blog/average-salary-by-age"
            url="https://www.dayblip.com/blog/average-salary-by-age"
            title="Average American Salary by Age: What BLS Data Actually Shows"
          />
        </div>

      </div>
    </main>
  )
}
