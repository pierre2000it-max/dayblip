import Breadcrumb from "@/components/Breadcrumb"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"
import RelatedTools from "@/components/RelatedTools"

const faqItems = [
  {
    question: "How much do I need to retire?",
    answer: "The standard rule is 25 times your annual expenses — based on the 4% safe withdrawal rate from the Trinity Study. If you spend $50,000 per year you need $1,250,000 invested. If you spend $80,000 you need $2,000,000. This assumes a diversified portfolio of stocks and bonds with approximately 7% average annual returns."
  },
  {
    question: "What is the 4% rule for retirement?",
    answer: "The 4% rule states that you can withdraw 4% of your retirement portfolio in year one, then adjust for inflation each year, with a high probability of your money lasting 30 or more years. It comes from the Trinity Study which analyzed historical market returns and found 4% to be a historically safe withdrawal rate for a balanced portfolio."
  },
  {
    question: "When should I start saving for retirement?",
    answer: "The best time to start is now regardless of your age. Due to compound interest the difference between starting at 25 vs 35 is enormous — a 25-year-old investing $500 per month at 7% will have approximately $1.3 million at 65 while a 35-year-old investing the same amount will have approximately $567,000. Starting 10 years earlier more than doubles the outcome."
  },
  {
    question: "What is the maximum I can contribute to my 401k in 2026?",
    answer: "The 2026 401k employee contribution limit is $23,500 per year. If you are age 50 or older you can contribute an additional $7,500 catch-up contribution for a total of $31,000. The combined limit including employer contributions is $70,000. Contributing the maximum from age 30 at 7% average returns would produce approximately $2.2 million by age 65."
  }
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Retirement Planning Calculator Hub",
  "url": "https://www.dayblip.com/tools/retirement-hub",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "All the retirement calculators you need — FI date, compound interest, Social Security, retirement savings, and early vs late investing. Free."
}

const cardStyle: React.CSSProperties = {
  background: "#1e2d4a",
  borderRadius: "12px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const btnStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#e94560",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 600,
  fontSize: "14px",
  marginTop: "auto"
}

export default function RetirementHubPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <section style={{ padding: "64px 24px", textAlign: "center", background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, marginBottom: "12px" }}>
            Retirement Planning Calculators
          </h1>
          <p style={{ color: "#a8a8b3", fontSize: "18px", margin: 0 }}>
            Find your number, your date, and your path to financial independence
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 24px", background: "#1a1a2e" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e2e8f0", margin: 0 }}>
              The most important retirement number is your FI number — 25 times your annual expenses. On $50,000 per year in expenses your FI number is $1,250,000. At a 7% average return and 15% savings rate, most people can reach this in 20-30 years. Use these calculators to find your exact timeline.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Retirement Hub" }
          ]} />
          <AuthorByline variant="tool" />

          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "32px 0 20px 0" }}>
            Retirement Calculators
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>📅</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Financial Independence Date</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Find the exact date you could stop working based on your savings rate and expenses. See how small changes to your savings rate dramatically move your retirement date.
              </p>
              <a href="/tools/fi-date" style={btnStyle}>Find My FI Date →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>📈</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Compound Interest Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                See how your investments grow over time with compound interest. Visualize year-by-year growth and the dramatic difference between starting now vs waiting 5 years.
              </p>
              <a href="/finance/compound-interest" style={btnStyle}>Calculate Growth →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>🏛️</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Social Security Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Find your optimal Social Security claiming age. See the breakeven point between claiming at 62 vs 67 vs 70 — and which age maximizes your lifetime benefit.
              </p>
              <a href="/finance/social-security" style={btnStyle}>Find My Benefit →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>💰</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Retirement Savings Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Are you on track for retirement? Enter your current savings, monthly contributions, and target retirement age to see your projected balance and income in retirement.
              </p>
              <a href="/finance/retirement-savings" style={btnStyle}>Check My Progress →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>⏰</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Early vs Late Investor</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                See why starting early beats saving more later. Compare two investors — one who starts at 22 and stops at 32 vs one who starts at 32 and never stops. The result surprises most people.
              </p>
              <a href="/tools/early-vs-late" style={btnStyle}>See the Comparison →</a>
            </div>
          </div>

          <div style={{ background: "#0d1b2a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "24px 28px", marginBottom: "40px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
              The Retirement Number Most People Never Calculate
            </h2>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              Most people think about retirement in years — &apos;I want to retire at 65.&apos; But the more useful frame is your FI number — the specific dollar amount at which your invested assets could cover your living expenses indefinitely.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              The formula is simple: annual expenses multiplied by 25. This is based on the 4% safe withdrawal rate — the percentage you can withdraw annually with a high probability of never running out of money over a 30-year retirement.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: 0 }}>
              On $60,000 per year in expenses your FI number is $1,500,000. On $40,000 it is $1,000,000. On $80,000 it is $2,000,000. Knowing your number turns retirement from a vague someday into a specific target with a specific date.
            </p>
          </div>

          <FAQAccordion items={faqItems} />

          <RelatedTools tools={[
            { emoji: "🏆", title: "Income Percentile", desc: "Where your savings rank", href: "/tools/where-you-rank" },
            { emoji: "⏱️", title: "Market Timing Cost", desc: "Why staying invested matters", href: "/tools/market-timing" },
            { emoji: "💰", title: "401k Calculator", desc: "Project your 401k balance", href: "/finance/401k-calculator" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
          ]} />

          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6", marginTop: "40px" }}>
            Retirement estimates use a 7% average annual return assumption based on long-term US stock market historical averages. The 4% safe withdrawal rate is based on the Trinity Study (Cooley, Hubbard, Walz 1998, updated 2011). Social Security estimates use SSA published benefit formulas. 401k limits reflect IRS Revenue Procedure 2025-32 for tax year 2026. Not financial advice — consult a licensed financial planner for personalized retirement planning.
          </p>
        </div>
      </section>
    </div>
  )
}
