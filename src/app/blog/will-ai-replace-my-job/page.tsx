import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Will AI Replace Your Job? Here Is What the Data Actually Shows",
  description: "AI replacement risk correlates with task type, not salary or education level.",
  url: "https://www.dayblip.com/blog/will-ai-replace-my-job",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "AI Job Score", href: "/tools/ai-job-score", description: "Score your job title 0–100 for AI replacement risk" },
  { title: "Salary Negotiation", href: "/tools/salary-negotiation", description: "Get paid what your role is worth now" },
  { title: "Career Timeline", href: "/tools/career-timeline", description: "Project your lifetime earnings trajectory" },
  { title: "Side Hustle Calculator", href: "/tools/side-hustle", description: "Build income streams AI cannot automate" },
]

export default function WillAIReplaceMyJobPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Will AI Replace My Job</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          Will AI Replace Your Job? Here Is What the Data Actually Shows
        </h1>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              AI replacement risk correlates with task type, not salary or education. Jobs involving pattern recognition and document processing score highest (data entry 95/100, bookkeepers 88/100). Jobs requiring physical presence and human judgment score lowest (plumbers 10/100, therapists 8/100, nurses 15/100).
            </p>
          </div>
        </section>

        {/* Share — Location 1: above article */}
        <div className="mb-8">
          <ShareButtons
            text="AI replacement risk correlates with task type not salary. Data entry scores 95/100. Plumbers score 10/100. Check your job: www.dayblip.com/tools/ai-job-score"
            url="https://www.dayblip.com/blog/will-ai-replace-my-job"
            title="Will AI Replace Your Job? What the Data Actually Shows"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            The question started showing up in performance reviews around 2023. Employees were asking their managers. Managers were asking HR. Everyone was running their job title through search engines and hoping the results were wrong.
          </p>

          <p>
            The problem with most AI replacement coverage is that it talks in averages. &quot;47% of jobs are at risk.&quot; &quot;AI will eliminate X million positions by 2030.&quot; These numbers come from credible research — the 47% figure is from a widely-cited Oxford study — but they do not tell you anything useful about your specific situation, because replacement risk is not evenly distributed.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Research Actually Measures</h2>

          <p>
            The most useful framework comes from the O*NET database, which the US Department of Labor uses to catalog the specific tasks involved in over 900 occupations. Researchers have analyzed those task lists and scored each one on how readily it can be automated using current or near-term AI systems.
          </p>

          <p>
            The key variable is not your salary. It is not your education level. It is whether your work is primarily composed of tasks that follow identifiable patterns.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="text-left text-[#a8a8b3] pb-2 font-medium">Job Title</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Risk Score</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Why</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {[
                  ["Telemarketer", "99/100", "Script + pattern"],
                  ["Data Entry Clerk", "95/100", "Pure pattern recognition"],
                  ["Bookkeeper", "88/100", "Structured data rules"],
                  ["Paralegal", "94/100", "Document processing"],
                  ["Elementary Teacher", "32/100", "Human + adaptive"],
                  ["Nurse", "15/100", "Physical + empathy"],
                  ["Surgeon", "13/100", "Unstructured physical"],
                  ["Therapist", "8/100", "Human presence core"],
                  ["Plumber", "10/100", "Novel environments"],
                ].map(([job, score, why]) => (
                  <tr key={job} className="border-b border-[#2d3748]/50">
                    <td className="text-white py-2">{job}</td>
                    <td className="text-right py-2 text-[#e94560] font-medium">{score}</td>
                    <td className="text-right py-2 text-[#a8a8b3] text-xs">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Tasks That Drive High Risk</h2>

          <p>
            Jobs with high automation scores share a common set of task characteristics: processing or classifying documents, answering questions from known information sets, generating reports from structured data, performing calculations on defined variables, and following explicit repeatable decision trees.
          </p>

          <p>
            Jobs with low automation scores share the opposite: physical judgment in novel environments, emotional regulation and therapeutic presence, creative work with undefined success criteria, managing unpredictable human behavior, and interdisciplinary synthesis across domains that have not been mapped.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Same Title, Different Risk</h2>

          <p>
            Here is where it gets complicated: the same job title can have very different risk profiles depending on what the work actually involves. A financial analyst at a bank doing routine variance reports on structured data may have 70%+ automation exposure. A financial analyst at a startup doing competitive research, investor narrative development and founder coaching may sit closer to 25%.
          </p>

          <p>
            Title is a starting point. Task composition is the variable that matters. When researchers classify jobs as &quot;high risk&quot; they are classifying the typical task distribution within that job category — not every individual instance of that job.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Historical Pattern</h2>

          <p>
            Previous automation waves — mechanical looms, industrial robots, ATMs — followed a consistent pattern. The jobs that disappeared were not necessarily the highest-volume ones. They were the ones where the tasks were most separable. ATMs did not eliminate bank tellers. The number of bank tellers actually increased after ATMs were introduced, because lower transaction costs made branches more economical. What changed was what tellers spent their time doing.
          </p>

          <p>
            The same pattern is emerging with AI. Roles are not disappearing cleanly — the routine tasks within roles are being absorbed, leaving the nonroutine ones. A paralegal who spent 60% of their time on document review may find AI handles that 60%. The question is whether the remaining 40% expands to fill the role or whether the role restructures around it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What to Do With This</h2>

          <p>
            If your current work skews heavily toward high-risk task types, the useful response is not panic — it is an audit. Which tasks in your role are routine-cognitive? Which are judgment-based or relationship-based? Where would upskilling move your work composition toward lower-risk tasks?
          </p>

          <p>
            The calculator below runs your job title against task-risk data and gives you a 0-to-100 risk score with breakdown. It will not tell you whether AI will replace you — that depends on how your organization responds and how you adapt. But it shows which parts of your work are most exposed, which is the right question to be asking.
          </p>
        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="AI replacement risk correlates with task type not salary. Data entry scores 95/100. Plumbers score 10/100. Check your job: www.dayblip.com/tools/ai-job-score"
            url="https://www.dayblip.com/blog/will-ai-replace-my-job"
            title="Will AI Replace Your Job? What the Data Actually Shows"
          />
        </div>
      </div>
    </main>
  )
}
