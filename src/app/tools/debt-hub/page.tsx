import Breadcrumb from "@/components/Breadcrumb"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"
import RelatedTools from "@/components/RelatedTools"

const faqItems = [
  {
    question: "What is the avalanche method for paying off debt?",
    answer: "The avalanche method prioritizes paying off the debt with the highest interest rate first while making minimum payments on all other debts. Once the highest-rate debt is paid off you roll that payment to the next highest rate. This method minimizes total interest paid and is mathematically optimal — but requires patience since high-rate debts are often also large balances."
  },
  {
    question: "What is the snowball method for paying off debt?",
    answer: "The snowball method prioritizes paying off the smallest balance first regardless of interest rate. Once the smallest debt is eliminated you roll that payment to the next smallest balance. This creates early wins that build momentum and motivation. Research shows many people are more likely to successfully eliminate debt using this method even though it costs slightly more in total interest."
  },
  {
    question: "How much does paying only the minimum cost me?",
    answer: "Paying only the minimum on a $5,000 credit card balance at 20% APR takes approximately 30 years to pay off and costs over $7,000 in interest — meaning you pay more than double the original balance. Increasing your payment to just $200 per month cuts the payoff time to 2.5 years and total interest to under $1,000. The Dayblip minimum payment calculator shows your exact numbers."
  },
  {
    question: "What debt should I pay off first?",
    answer: "Mathematically you should pay off the highest interest rate debt first — typically credit cards at 18-29% APR. However if you have small balances you can eliminate quickly the psychological boost of early wins can be worth the small additional interest cost. Most financial advisors recommend always paying at least the minimum on all debts while putting extra money toward either the highest rate or smallest balance depending on your motivation style."
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
  "name": "Debt Payoff Calculator Hub",
  "url": "https://www.dayblip.com/tools/debt-hub",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "All the debt calculators you need — debt payoff date, minimum payment true cost, debt freedom tracker, and budget planner. Free."
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

export default function DebtHubPage() {
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
            Debt Payoff Calculators
          </h1>
          <p style={{ color: "#a8a8b3", fontSize: "18px", margin: 0 }}>
            Find your debt-free date and the fastest path to get there
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 24px", background: "#1a1a2e" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e2e8f0", margin: 0 }}>
              Paying just $100 extra per month on a $10,000 credit card balance at 20% APR cuts your payoff time from 30 years to 4 years and saves over $11,000 in interest. Use these calculators to find your exact numbers and your debt-free date.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Debt Hub" }
          ]} />
          <AuthorByline variant="tool" />

          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "32px 0 20px 0" }}>
            Debt Payoff Calculators
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>📅</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Debt Freedom Date</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Enter all your debts and choose avalanche or snowball method. See your exact debt-free date and total interest paid — and how extra payments accelerate your timeline.
              </p>
              <a href="/tools/debt-freedom" style={btnStyle}>Find My Freedom Date →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>💳</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Minimum Payment True Cost</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                See what paying only the minimum on your credit card actually costs you. Most people are shocked — a $5,000 balance at 20% takes 30 years and costs $7,000+ in interest.
              </p>
              <a href="/tools/minimum-payment" style={btnStyle}>See The True Cost →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>💰</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Debt Payoff Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Calculate your debt payoff timeline for any loan. Compare avalanche vs snowball methods side by side and see exactly how much each method costs in total interest.
              </p>
              <a href="/finance/debt-payoff" style={btnStyle}>Calculate Payoff →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>📊</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Budget Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Build a budget that includes aggressive debt payoff. See where your money goes, find room to increase debt payments, and track your 50/30/20 ratios.
              </p>
              <a href="/finance/budget-calculator" style={btnStyle}>Build My Budget →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>🛡️</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Recession Readiness Score</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Get a personalized score for how prepared you are when the next recession hits. Emergency fund, debt-to-income, job stability, and investment diversification.
              </p>
              <a href="/tools/recession-score" style={btnStyle}>Get My Score →</a>
            </div>
          </div>

          <div style={{ background: "#0d1b2a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "24px 28px", marginBottom: "40px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
              Avalanche vs Snowball — Which Wins?
            </h2>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              The avalanche method pays off the highest interest rate debt first. Mathematically it is always optimal — you pay less total interest and get debt-free faster.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              The snowball method pays off the smallest balance first. Psychologically it often wins — early wins keep people motivated and on track. Research from the Harvard Business Review found that debtors who used the snowball method were more likely to successfully eliminate their debt.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: 0 }}>
              The right method is the one you will actually stick to. Use the Dayblip debt calculators to run both scenarios for your specific debt situation — the difference in total interest is often smaller than you expect.
            </p>
          </div>

          <FAQAccordion items={faqItems} />

          <RelatedTools tools={[
            { emoji: "📅", title: "FI Date", desc: "When can you stop working?", href: "/tools/fi-date" },
            { emoji: "🛡️", title: "Emergency Fund", desc: "How much should you have saved?", href: "/finance/emergency-fund" },
            { emoji: "🔥", title: "Recession Score", desc: "How prepared are you?", href: "/tools/recession-score" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Track your financial progress", href: "/finance/net-worth" },
          ]} />

          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6", marginTop: "40px" }}>
            Debt calculations use standard amortization formulas. Interest calculations assume fixed interest rates and minimum payments as a percentage of balance. Avalanche and snowball comparisons assume consistent extra payments throughout the payoff period. Actual payoff timelines may vary based on interest rate changes, missed payments, or additional charges. Not financial advice.
          </p>
        </div>
      </section>
    </div>
  )
}
