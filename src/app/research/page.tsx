import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Dayblip Index — Original Research & Data Reports",
  description:
    "Original data reports from Dayblip: paycheck take-home by state, weekends remaining, career weeks left, and more. Free, no signup.",
  alternates: { canonical: "https://www.dayblip.com/research" },
  openGraph: {
    title: "The Dayblip Index — Original Research & Data Reports",
    description:
      "Original data reports from Dayblip: paycheck take-home by state, weekends remaining, career weeks left, and more. Free, no signup.",
    type: "website",
    url: "https://www.dayblip.com/research",
    images: [{ url: "/api/og?title=The+Dayblip+Index&emoji=📊&subtitle=Original+research+and+data+reports", width: 1200, height: 630, alt: "The Dayblip Index" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dayblip Index — Original Research & Data Reports",
    description:
      "Original data reports from Dayblip: paycheck take-home by state, weekends remaining, career weeks left, and more. Free, no signup.",
  },
}

interface ReportCard {
  href: string
  label: string
  title: string
  description: string
  meta: string
  status: "live" | "soon"
}

const reports: ReportCard[] = [
  {
    href: "/research/paycheck-report-2026",
    label: "Paycheck",
    title: "2026 American Paycheck Report",
    description:
      "A $60,000 salary feels very different depending on which state you live in. We ran the numbers for all 50 states using 2026 IRS brackets, FICA rates, and current state income tax tables.",
    meta: "Published June 2026 · 50 states · $60K benchmark salary",
    status: "live",
  },
  {
    href: "/research/weekends-you-have-left",
    label: "Life & Time",
    title: "How Many Weekends Do You Have Left?",
    description:
      "The number that changes how you think about every Saturday morning. We calculated remaining weekends by age from 20 to 75.",
    meta: "Published May 2026 · Ages 20–75",
    status: "live",
  },
  {
    href: "/research/how-many-mondays-left",
    label: "Career",
    title: "How Many Mondays Do You Have Left in Your Career?",
    description:
      "The number of working weeks remaining before retirement — and what each one is actually worth.",
    meta: "Published May 2026 · Ages 22–64",
    status: "live",
  },
  {
    href: "#",
    label: "Wealth",
    title: "The American Dream Index by State",
    description:
      "Which states still offer a realistic path to homeownership, retirement security, and upward mobility on a median income?",
    meta: "Coming Q4 2026",
    status: "soon",
  },
]

export default function ResearchPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <div className="mx-auto max-w-[800px] px-6 py-14">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Research</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-3 py-1 text-xs font-medium text-[#e94560] mb-4">
            Original data · Updated 2026
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
            The Dayblip Index
          </h1>
          <p className="text-[#a8a8b3] text-lg leading-relaxed max-w-[620px]">
            Numbers most people never think to calculate. Each report is built from primary
            government sources — no estimates, no spin.
          </p>
        </div>

        {/* Report cards */}
        <div className="flex flex-col gap-5">
          {reports.map((r) =>
            r.status === "live" ? (
              <Link
                key={r.href}
                href={r.href}
                className="group block rounded-2xl border border-[#1e2d4a] bg-[#16213e] p-7 transition-all duration-200 hover:border-[#e94560]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full border border-[#e94560]/30 bg-[#e94560]/10 px-2.5 py-0.5 text-xs font-medium text-[#e94560]">
                    {r.label}
                  </span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2 group-hover:text-[#e94560] transition-colors">
                  {r.title}
                </h2>
                <p className="text-[#a8a8b3] text-sm leading-relaxed mb-4">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#a8a8b3] text-xs">{r.meta}</span>
                  <span className="text-[#e94560] text-sm font-medium">Read report →</span>
                </div>
              </Link>
            ) : (
              <div
                key={r.title}
                className="rounded-2xl border border-[#1e2d4a]/60 bg-[#16213e]/50 p-7 opacity-60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full border border-[#a8a8b3]/20 bg-[#a8a8b3]/10 px-2.5 py-0.5 text-xs font-medium text-[#a8a8b3]">
                    {r.label}
                  </span>
                  <span className="rounded-full border border-[#a8a8b3]/20 px-2.5 py-0.5 text-xs text-[#a8a8b3]">
                    Coming soon
                  </span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">{r.title}</h2>
                <p className="text-[#a8a8b3] text-sm leading-relaxed mb-4">{r.description}</p>
                <span className="text-[#a8a8b3] text-xs">{r.meta}</span>
              </div>
            )
          )}
        </div>

      </div>
    </main>
  )
}
