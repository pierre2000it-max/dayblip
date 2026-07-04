import Link from "next/link";

const countdownLinks = [
  { label: "Days Until Christmas", href: "/days-until/christmas" },
  { label: "Days Until Halloween", href: "/days-until/halloween" },
  { label: "Days Until Thanksgiving", href: "/days-until/thanksgiving" },
  { label: "Days Until New Year's", href: "/days-until/new-years" },
  { label: "Days Until Valentine's Day", href: "/days-until/valentines-day" },
];

const toolLinks = [
  { label: "Age Calculator", href: "/age-calculator" },
  { label: "Date Calculator", href: "/date-calculator" },
  { label: "Days Between Dates", href: "/days-between" },
  { label: "On This Day", href: "/on-this-day/january-1" },
  { label: "Born In Year", href: "/born-in" },
];

const funViralLinks = [
  { label: "World Live Counters", href: "/world-counters" },
  { label: "US Debt Live", href: "/world-counters/us-debt" },
  { label: "Population Live", href: "/world-counters/population" },
  { label: "Life Progress Bar", href: "/life-progress" },
  { label: "Birthday Twins", href: "/birthday-twins" },
  { label: "Celebrity Ages", href: "/celebrity-age" },
  { label: "Couples Countdown", href: "/couples-countdown" },
  { label: "Weekends Left", href: "/weekends-left" },
  { label: "Star Sign", href: "/star-sign" },
  { label: "Birthday Countdown", href: "/birthday-countdown" },
];

const gamesHistoryLinks = [
  { label: "History Quiz", href: "/history-quiz" },
  { label: "Decade Quiz", href: "/decade-quiz" },
  { label: "Daily Trivia", href: "/daily-trivia" },
  { label: "Guess the Year", href: "/guess-the-year" },
  { label: "Famous or Fictional", href: "/famous-or-fictional" },
  { label: "Fact Spinner", href: "/fact-spinner" },
  { label: "Days Since Events", href: "/days-since" },
  { label: "Price History", href: "/price-history" },
  { label: "What Generation", href: "/what-generation" },
];

const bottomLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclosure", href: "/disclosure" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f3460]">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-6">
        {/* Responsive column grid: 1 (mobile) · 3 (tablet) · 7 (desktop) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-8">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">day</span>
              <span className="text-[#e94560]">blip</span>
            </Link>
            <p className="text-[#a8a8b3] text-sm">
              Free tools for curious minds
            </p>
            <p className="text-[#a8a8b3] text-sm">
              © 2026 Dayblip. All rights reserved.
            </p>
          </div>

          {/* Column 2 — Popular Countdowns */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Popular Countdowns</h3>
            <ul className="flex flex-col gap-2">
              {countdownLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Date Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Date Tools</h3>
            <ul className="flex flex-col gap-2">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Finance Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Finance Tools</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Compound Interest", href: "/finance/compound-interest" },
                { label: "Mortgage Calculator", href: "/finance/mortgage-calculator" },
                { label: "Retirement Savings", href: "/finance/retirement-savings" },
                { label: "Debt Payoff", href: "/finance/debt-payoff" },
                { label: "Net Worth Calculator", href: "/finance/net-worth" },
                { label: "Inflation Calculator", href: "/finance/inflation" },
                { label: "Rent vs Buy", href: "/real-estate/rent-vs-buy" },
                { label: "Student Loans", href: "/finance/student-loan" },
                { label: "Freelancer Rate", href: "/finance/freelancer-rate" },
                { label: "Take Home Pay", href: "/finance/take-home-pay" },
                { label: "Tax Bracket", href: "/finance/tax-bracket" },
                { label: "Budget Calculator", href: "/finance/budget-calculator" },
                { label: "Capital Gains Tax", href: "/finance/capital-gains" },
                { label: "Cost of Living", href: "/finance/cost-of-living" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column — Life & Money */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Life &amp; Money</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Min Payment Cost", href: "/tools/minimum-payment" },
                { label: "Early vs Late Saver", href: "/tools/early-vs-late" },
                { label: "Market Timing", href: "/tools/market-timing" },
                { label: "Sleep Debt", href: "/tools/sleep-debt" },
                { label: "Smoking Cost", href: "/tools/smoking-cost" },
                { label: "College ROI", href: "/tools/college-roi" },
                { label: "WFH Calculator", href: "/tools/wfh-calculator" },
                { label: "Recession Score", href: "/tools/recession-score" },
                { label: "AI Job Score", href: "/tools/ai-job-score" },
                { label: "FI Date Calculator", href: "/tools/fi-date" },
                { label: "Salary Negotiation", href: "/tools/salary-negotiation" },
                { label: "Side Hustle Calculator", href: "/tools/side-hustle" },
                { label: "Am I Underpaid?", href: "/tools/salary-checker" },
                { label: "Historical Stocks", href: "/tools/stock-calculator" },
                { label: "State Tax Savings", href: "/tools/tax-migration" },
                { label: "True Hourly Wage", href: "/tools/true-hourly-wage" },
                { label: "Career Timeline", href: "/tools/career-timeline" },
                { label: "Home by Year", href: "/tools/mortgage-by-year" },
                { label: "Debt Freedom Date", href: "/tools/debt-freedom" },
                { label: "Car True Cost", href: "/tools/car-true-cost" },
                { label: "Life in Weeks", href: "/tools/life-in-weeks" },
                { label: "Birthday Personality", href: "/tools/birthday-personality" },
                { label: "Generation Quiz", href: "/tools/generation-quiz" },
                { label: "Music of Your Year", href: "/tools/music-of-your-year" },
                { label: "Learning Calculator", href: "/tools/learning-calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Curiosity */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Curiosity</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Subscription Cost", href: "/curiosity/subscriptions" },
                { label: "Latte Factor", href: "/curiosity/latte-factor" },
                { label: "Lottery Calculator", href: "/curiosity/lottery" },
                { label: "Side Hustle", href: "/curiosity/side-hustle" },
                { label: "Dining Out Cost", href: "/curiosity/dining-out" },
                { label: "Car Upgrade Cost", href: "/curiosity/car-upgrade" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6 — Fun & Viral */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Fun &amp; Viral</h3>
            <ul className="flex flex-col gap-2">
              {funViralLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Games & History */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Games &amp; History</h3>
            <ul className="flex flex-col gap-2">
              {gamesHistoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column — Blog */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Blog</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "All Articles", href: "/blog" },
                { label: "True Hourly Wage", href: "/blog/true-hourly-wage" },
                { label: "Will AI Replace My Job?", href: "/blog/will-ai-replace-my-job" },
                { label: "Minimum Payment Cost", href: "/blog/minimum-payment-true-cost" },
                { label: "Starting Early vs Late", href: "/blog/compound-interest-early-saver" },
                { label: "Market Timing Cost", href: "/blog/market-timing-cost" },
                { label: "Financial Independence", href: "/blog/financial-independence-date" },
                { label: "Salary Negotiation Guide", href: "/blog/salary-negotiation-guide" },
                { label: "Life in Weeks", href: "/blog/life-in-weeks" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column — Education */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Education</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "GPA Calculator", href: "/education/gpa-calculator" },
                { label: "Grade Calculator", href: "/education/grade-calculator" },
                { label: "College ROI", href: "/tools/college-roi" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column — Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-base">Resources</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Embed Our Tools", href: "/embed" },
                { label: "For Educators", href: "/embed/for-educators" },
                { label: "Finance Hub", href: "/tools/finance" },
                { label: "Life & Money Hub", href: "/tools/life-money" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-[#1a3a6e] pt-6 flex flex-wrap items-center justify-center gap-6">
          {bottomLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#a8a8b3] text-sm transition-colors duration-200 hover:text-[#e94560]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Affiliate disclosure */}
        <p className="mt-6 text-center text-xs text-[#a8a8b3]">
          Some links on this site are affiliate links. We may earn a small commission if you sign up or make a purchase — at no cost to you. We only recommend products we believe are genuinely useful.
        </p>
      </div>
    </footer>
  );
}
