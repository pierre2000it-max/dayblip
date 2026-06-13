import type { Metadata } from "next";
import Link from "next/link";
import { DAYBLIP_ORG } from "@/lib/authorSchema";

export const metadata: Metadata = {
  title: "About Dayblip — Free Tools for Curious Minds",
  description:
    "Dayblip is a free tool site built by a solo developer. 175+ free calculators covering personal finance, career, life and curiosity. No signup. No email. Free forever.",
  alternates: { canonical: "https://www.dayblip.com/about" },
  openGraph: {
    title: "About Dayblip — Free Tools for Curious Minds",
    description:
      "Dayblip is a free tool site built by a solo developer. 175+ free calculators covering personal finance, career, life and curiosity. No signup. No email. Free forever.",
    type: "website",
    url: "https://www.dayblip.com/about",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "About Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dayblip — Free Tools for Curious Minds",
    description:
      "Dayblip is a free tool site built by a solo developer. 175+ free calculators covering personal finance, career, life and curiosity. No signup. No email. Free forever.",
  },
};

const CATEGORIES = [
  {
    emoji: "💰",
    title: "Finance",
    href: "/finance",
    desc: "Mortgage, compound interest, retirement, debt payoff and more",
  },
  {
    emoji: "💼",
    title: "Career",
    href: "/tools/ai-job-score",
    desc: "Salary negotiation, AI job risk, true hourly wage and side hustles",
  },
  {
    emoji: "📊",
    title: "Life & Money",
    href: "/tools/life-in-weeks",
    desc: "Life in weeks, financial independence date, procrastination cost",
  },
  {
    emoji: "🎂",
    title: "Born In",
    href: "/born-in",
    desc: "What the world looked like the year you were born",
  },
  {
    emoji: "🔍",
    title: "Curiosity",
    href: "/curiosity",
    desc: "Latte factor, subscriptions, lottery and daily habit costs",
  },
  {
    emoji: "❤️",
    title: "Health",
    href: "/health",
    desc: "Life expectancy, BMI, habit cost and life insurance calculators",
  },
];

const orgSchema = {
  "@context": "https://schema.org",
  ...DAYBLIP_ORG,
  "@type": "Organization",
}

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#0d1b2a", color: "#e8e8e8" }} className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <div className="mx-auto max-w-[800px] px-6 py-16">

        {/* H1 */}
        <h1 className="mb-12 text-4xl font-bold text-white md:text-5xl">About Dayblip</h1>

        {/* Section 1 — The Story */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Why I Built This</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Three years ago I calculated my true hourly wage for the first time.
              $72,000 salary. Thirty-minute commute. Three bought lunches a week.
            </p>
            <p>
              Real hourly rate: <span className="font-semibold text-[#e94560]">$26.80</span>.
            </p>
            <p>
              I sat with that number for a while. Then I went looking for a tool that
              would let me run different scenarios — cut the commute, work from home
              two days, negotiate a raise. I could not find one that was free, clean
              and did not require an account.
            </p>
            <p>So I built it. Then I built 175 more.</p>
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 2 — What Dayblip Is */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">What Is Dayblip?</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Dayblip is a collection of 175+ free interactive calculators and tools covering
              personal finance, career decisions, life visualization and historical
              curiosity. Every calculation runs in the browser — no data is collected,
              stored, or shared.
            </p>
            <p>Every tool on the site is:</p>
            <ul className="flex flex-col gap-2">
              {[
                "Completely free to use",
                "No signup required",
                "No email address required",
                "No paywall",
                "No premium tier",
                "Free forever",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-[#e94560]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 3 — Methodology and Sources */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">How the Calculations Work</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Every calculator on Dayblip is built from primary sources. No estimates,
              no approximations where exact figures exist.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Tax calculators", src: "2026 IRS federal tax brackets, FICA rates, and state income tax tables sourced from each state's revenue department." },
                { label: "Paycheck and withholding", src: "IRS Publication 15-T federal income tax withholding tables, current Social Security wage base, and Medicare rates." },
                { label: "Mortgage and loan tools", src: "Standard amortization formula. Interest compounds monthly. Results match outputs from the CFPB mortgage calculator." },
                { label: "Retirement calculators", src: "IRS contribution limits (updated annually), historical S&P 500 average return data from FRED (Federal Reserve Economic Data)." },
                { label: "Health calculators (BMI, calories)", src: "CDC BMI classification thresholds. Mifflin-St Jeor equation for basal metabolic rate, which clinical research rates as the most accurate for the general population." },
                { label: "Body fat estimation", src: "US Navy circumference measurement method, validated in peer-reviewed literature as a reliable field estimate." },
                { label: "Cost of living comparisons", src: "Bureau of Labor Statistics Consumer Expenditure Survey and EPI Family Budget Calculator." },
                { label: "Wage and salary data", src: "BLS Occupational Employment and Wage Statistics (OEWS) program, updated annually." },
              ].map(({ label, src }) => (
                <li key={label} className="flex flex-col gap-1">
                  <span className="font-semibold text-white">{label}</span>
                  <span style={{ color: "#a8a8b3" }} className="text-sm">{src}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 4 — The Tools */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">What You Can Find Here</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col gap-2 rounded-xl border border-[#1a3a6e] bg-[#16213e] p-5 transition-all duration-200 hover:border-[#e94560]"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-lg font-semibold text-white">{cat.title}</span>
                <span className="text-sm" style={{ color: "#a8a8b3" }}>{cat.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 5 — The Builder */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Who Built This</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Dayblip is built and maintained by a solo developer with a background
              in software engineering and personal finance.
            </p>
            <p>
              The site launched in 2026. Every tool is built from scratch — no
              purchased calculators, no white-labeled widgets. The formulas are
              documented, the sources are cited, and the math is verified against
              official government calculators where they exist.
            </p>
            <p>
              The free-forever model is intentional. These tools should belong to
              anyone who needs them — not just people who can afford a subscription.
            </p>
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 6 — Accuracy and Limitations */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Accuracy and Limitations</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Dayblip calculators produce educational estimates, not professional advice.
              Tax figures reflect current published rates but individual situations vary.
              Health calculations use validated population formulas that produce reasonable
              estimates, not clinical measurements.
            </p>
            <p>
              For consequential financial decisions — taxes, mortgages, retirement
              planning — consult a qualified professional who knows your specific situation.
              Dayblip is a starting point for understanding, not a replacement for
              professional advice.
            </p>
          </div>
        </section>

        <hr className="my-12 border-t border-[#1a3a6e]" />

        {/* Section 7 — Contact */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Get in Touch</h2>
          <div className="space-y-4 leading-relaxed" style={{ color: "#e8e8e8" }}>
            <p>
              Have a suggestion for a new tool? Found a calculation error? Want to
              embed a tool on your website?
            </p>
            <p>
              Visit the embed page:{" "}
              <Link href="/embed" className="font-semibold text-[#e94560] hover:underline">
                www.dayblip.com/embed
              </Link>
            </p>
            <p>
              Follow on X:{" "}
              <a
                href="https://twitter.com/dayblip365"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#e94560] hover:underline"
              >
                twitter.com/dayblip365
              </a>
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
