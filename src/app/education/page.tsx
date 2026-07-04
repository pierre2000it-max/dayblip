import type { Metadata } from "next"
import Link from "next/link"
import Breadcrumb from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Education Calculators — GPA, Grades, College ROI and More",
  description: "Free education calculators for students. GPA calculator, grade calculator, college ROI, student loan cost and more. No signup. No email. Free forever.",
  alternates: { canonical: "https://www.dayblip.com/education" },
}

const tools = [
  {
    emoji: "📊",
    title: "GPA Calculator",
    desc: "Calculate semester and cumulative GPA. Weighted and unweighted. High school and college.",
    href: "/education/gpa-calculator",
    badge: "New",
  },
  {
    emoji: "📝",
    title: "Grade Calculator",
    desc: "What grade do you need on your final exam? Weighted grades and test scores too.",
    href: "/education/grade-calculator",
    badge: "New",
  },
  {
    emoji: "🎓",
    title: "College ROI Calculator",
    desc: "Was your degree worth it? Compare lifetime earnings vs total cost of college.",
    href: "/tools/college-roi",
    badge: null,
  },
  {
    emoji: "💰",
    title: "Student Loan Calculator",
    desc: "True total cost of your student debt including interest over the full repayment period.",
    href: "/finance/student-loan",
    badge: null,
  },
  {
    emoji: "🤖",
    title: "AI Job Score",
    desc: "How at risk is your career from automation? Score your field against 700+ occupations.",
    href: "/tools/ai-job-score",
    badge: null,
  },
  {
    emoji: "⏰",
    title: "Procrastination Cost Calculator",
    desc: "Calculate the real financial cost of waiting to start investing or saving.",
    href: "/tools/procrastination-cost",
    badge: null,
  },
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-4xl">🎓</div>
          <h1 className="mb-4 text-4xl font-bold text-white">Education Calculators</h1>
          <p className="text-[#a8a8b3] text-lg">Free tools for students — GPA, grades, college value and career planning. No signup. No email. Free forever.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Education" }]} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
              <Link key={tool.href} href={tool.href}
                className="group relative rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 transition-all hover:border-[#e94560] hover:bg-[#16213e]">
                {tool.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#e94560] px-2 py-0.5 text-xs font-bold text-white">{tool.badge}</span>
                )}
                <div className="mb-3 text-3xl">{tool.emoji}</div>
                <h2 className="mb-2 text-base font-bold text-white group-hover:text-[#e94560] transition-colors">{tool.title}</h2>
                <p className="text-sm text-[#a8a8b3] leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
