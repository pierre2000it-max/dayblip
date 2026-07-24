import Breadcrumb from "@/components/Breadcrumb"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"
import RelatedTools from "@/components/RelatedTools"

const faqItems = [
  {
    question: "How much should I charge as a freelancer?",
    answer: "A general rule is to multiply your desired take-home salary by 1.4 to 1.5 to account for self-employment taxes, benefits you pay yourself, unpaid administrative time, and income gaps. If you want to net $75,000, you need to bill approximately $105,000 to $112,000 per year. Use the Dayblip Freelancer Rate Calculator for your exact number."
  },
  {
    question: "What is self-employment tax and how much is it?",
    answer: "Self-employment tax is 15.3% of your net self-employment income — covering both the employee (7.65%) and employer (7.65%) portions of Social Security and Medicare taxes. On $100,000 of net freelance income this is $15,300 in self-employment tax before income tax. You can deduct half of SE tax from your gross income when calculating income tax."
  },
  {
    question: "Should I charge hourly or per project as a freelancer?",
    answer: "Project-based pricing is generally more profitable for experienced freelancers because it rewards efficiency — you earn the same whether a project takes 5 hours or 10. Hourly pricing caps your earning potential at your hours times your rate. However hourly works well when scope is unclear or for ongoing retainer work where time is variable."
  },
  {
    question: "How do freelancers save for retirement?",
    answer: "Freelancers have several retirement account options. A Solo 401k allows contributions up to $69,000 per year (2026) — both employee contributions up to $23,500 and employer contributions up to 25% of net self-employment income. A SEP-IRA allows up to 25% of net self-employment income up to $69,000. Both reduce taxable income significantly."
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
  "name": "Freelancer Financial Calculator Hub",
  "url": "https://www.dayblip.com/tools/freelancer-hub",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "All the financial calculators freelancers need — true hourly wage, freelancer rate, self-employment tax, WFH savings, and side hustle potential. Free."
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

export default function FreelancerHubPage() {
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
            Freelancer Financial Tools
          </h1>
          <p style={{ color: "#a8a8b3", fontSize: "18px", margin: 0 }}>
            All the calculators freelancers need in one place — rate, tax, savings, and more
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 24px", background: "#1a1a2e" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e2e8f0", margin: 0 }}>
              To match a $75,000 salaried employee&apos;s true compensation as a freelancer, you need to charge approximately $110,000 to $120,000 in gross billings. Self-employment tax, benefits, and unpaid administrative time add up fast. Use these calculators to find your exact freelance rate and financial picture.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Freelancer Hub" }
          ]} />
          <AuthorByline variant="tool" />

          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "32px 0 20px 0" }}>
            Freelancer Calculators
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>💰</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>True Hourly Wage</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Find out what your job actually pays per hour of your life — after commute, work expenses, and unpaid time. Most people earn 20-35% less than their stated rate.
              </p>
              <a href="/tools/true-hourly-wage" style={btnStyle}>Calculate My True Rate →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>📊</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Freelancer Rate Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Calculate the hourly or project rate you need to charge to hit your income target after taxes, benefits, and unpaid time. Includes self-employment tax adjustment.
              </p>
              <a href="/finance/freelancer-rate" style={btnStyle}>Find My Rate →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>🧾</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Self-Employment Tax Calculator</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Calculate your self-employment tax burden. Freelancers pay both the employee and employer portions of Social Security and Medicare — totaling 15.3% on net earnings.
              </p>
              <a href="/finance/self-employment-tax" style={btnStyle}>Calculate SE Tax →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>🏠</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Work From Home Savings</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Calculate how much working from home saves you annually in commute costs, work clothing, lunches, and time. Many remote workers save $8,000-15,000 per year.
              </p>
              <a href="/tools/wfh-calculator" style={btnStyle}>Calculate WFH Savings →</a>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: "28px" }}>💼</div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Side Hustle Potential</h3>
              <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Estimate your side hustle earning potential based on your skills, available hours, and market rates. See what you could earn with 10 hours per week.
              </p>
              <a href="/tools/side-hustle" style={btnStyle}>Find My Potential →</a>
            </div>
          </div>

          <div style={{ background: "#0d1b2a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "24px 28px", marginBottom: "40px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
              The Freelancer Math Most People Miss
            </h2>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              If you want to match a $75,000 salaried employee&apos;s true compensation as a freelancer, you need to charge significantly more than $75,000 per year. Here is why.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: "0 0 12px 0" }}>
              A $75,000 salary comes with employer-paid benefits worth approximately $15,000-20,000 per year — health insurance, 401k match, paid time off, and payroll taxes. As a freelancer you pay all of these yourself.
            </p>
            <p style={{ color: "#a8a8b3", lineHeight: "1.7", margin: 0 }}>
              Add self-employment tax (15.3% on net earnings vs 7.65% for employees), unpaid time for client acquisition and administration (typically 20-30% of working hours), and income gaps between contracts — and the true freelance equivalent of a $75,000 salary is closer to $110,000-120,000 in gross billings.
            </p>
          </div>

          <FAQAccordion items={faqItems} />

          <RelatedTools tools={[
            { emoji: "📊", title: "Salary Checker", desc: "Compare your rate to market", href: "/tools/salary-checker" },
            { emoji: "🏆", title: "Income Percentile", desc: "Where your income ranks nationally", href: "/tools/where-you-rank" },
            { emoji: "💰", title: "Budget Calculator", desc: "Plan your freelance budget", href: "/finance/budget-calculator" },
            { emoji: "📅", title: "FI Date", desc: "When could you stop working?", href: "/tools/fi-date" },
          ]} />

          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6", marginTop: "40px" }}>
            Freelancer financial estimates on this page use standard IRS self-employment tax rates (15.3% on net earnings up to the SS wage base of $184,500 for 2026), average US employer benefit cost data from the Bureau of Labor Statistics, and typical freelance utilization rates of 70-80% billable hours. Individual results vary significantly based on field, location, experience, and client mix. Not financial or tax advice.
          </p>
        </div>
      </section>
    </div>
  )
}
