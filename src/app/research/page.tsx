import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Original Research & Data Reports | Dayblip",
  description:
    "Original data reports from Dayblip covering life, time, money, and the numbers most people never think to calculate.",
  alternates: { canonical: "https://www.dayblip.com/research" },
}

export default function ResearchPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <div className="mx-auto max-w-[780px] px-6 py-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-3">
          Dayblip Research
        </h1>
        <p className="text-[#a8a8b3] text-lg mb-10">
          Original data and analysis on life, time, and money.
        </p>

        <Link
          href="/research/weekends-you-have-left"
          style={{
            background: "#1e2d4a",
            borderRadius: "12px",
            padding: "24px",
            display: "block",
            textDecoration: "none",
          }}
          className="border border-transparent hover:border-[#e94560] transition-all duration-200 group"
        >
          <div className="text-white font-bold text-xl mb-2 group-hover:text-[#e94560] transition-colors">
            How Many Weekends Do You Have Left?
          </div>
          <div className="text-[#a8a8b3]">
            The number that changes how you think about every Saturday morning.
          </div>
          <div className="mt-4 text-[#e94560] text-sm font-medium">Read report →</div>
        </Link>
      </div>
    </main>
  )
}
