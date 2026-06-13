const fs = require('fs');

const BASE = "C:\\Projects\\dayblip\\src\\app";
const IMPORT_LINE = 'import RelatedTools from "@/components/RelatedTools"';

const pages = {
  [`${BASE}/finance/net-worth/page.tsx`]: [
    ["ðŸ¦", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ’°", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
  ],
  [`${BASE}/finance/inflation/page.tsx`]: [
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸ’¡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["ðŸ–ï¸", "Retirement Savings", "Plan for retirement", "/finance/retirement-savings"],
    ["ðŸ ", "Cost of Living", "Compare living costs", "/finance/cost-of-living"],
  ],
  [`${BASE}/finance/emergency-fund/page.tsx`]: [
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}/finance/401k-calculator/page.tsx`]: [
    ["ðŸ’°", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["ðŸ“‹", "Roth IRA vs Traditional", "Which is better for you?", "/blog/roth-ira-vs-traditional-ira"],
  ],
  [`${BASE}/finance/social-security/page.tsx`]: [
    ["ðŸ’°", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["ðŸ“Š", "401(k) Calculator", "Maximize your 401k", "/finance/401k-calculator"],
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}/finance/capital-gains/page.tsx`]: [
    ["ðŸ“‹", "Tax Bracket Calculator", "Find your tax bracket", "/finance/tax-bracket"],
    ["ðŸ’¡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ“Š", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
  ],
  [`${BASE}/finance/self-employment-tax/page.tsx`]: [
    ["â±ï¸", "Freelancer Rate Calculator", "Set your hourly rate", "/finance/freelancer-rate"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["ðŸ’¼", "Side Hustle Calculator", "Value your side income", "/tools/side-hustle"],
    ["ðŸ“‹", "Overtime Tax Calculator", "Tax on extra hours", "/finance/overtime-tax"],
  ],
  [`${BASE}/finance/college-savings/page.tsx`]: [
    ["ðŸŽ“", "Student Loan Calculator", "Plan for student debt", "/finance/student-loan"],
    ["ðŸ«", "College ROI Calculator", "Is college worth it?", "/tools/college-roi"],
    ["ðŸ“ˆ", "Compound Interest", "Grow savings over time", "/finance/compound-interest"],
    ["ðŸ“š", "GPA Calculator", "Track your GPA", "/education/gpa-calculator"],
  ],
  [`${BASE}/finance/stock-return/page.tsx`]: [
    ["ðŸ’¡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["â±ï¸", "Market Timing Cost", "Cost of bad timing", "/tools/market-timing"],
    ["ðŸ’°", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
  ],
  [`${BASE}/finance/savings-goal/page.tsx`]: [
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸš¨", "Emergency Fund", "Build your safety net", "/finance/emergency-fund"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}/finance/budget-calculator/page.tsx`]: [
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}/finance/freelancer-rate/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ§¾", "Self-Employment Tax", "Know your tax burden", "/finance/self-employment-tax"],
    ["ðŸ’¼", "Side Hustle Calculator", "Value your side income", "/tools/side-hustle"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}/finance/car-affordability/page.tsx`]: [
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}/health/habit-cost/page.tsx`]: [
    ["ðŸº", "Alcohol Cost Calculator", "Cost of drinking", "/health/alcohol-cost"],
    ["ðŸš¬", "Smoking Cost Calculator", "Cost of smoking", "/tools/smoking-cost"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
  ],
  [`${BASE}/health/life-insurance/page.tsx`]: [
    ["ðŸ›¡ï¸", "Life Insurance Calculator", "How much coverage?", "/tools/life-insurance-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ“ˆ", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}/curiosity/car-upgrade/page.tsx`]: [
    ["ðŸš—", "Car Affordability", "Can you afford it?", "/finance/car-affordability"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/curiosity/dining-out/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["ðŸ½ï¸", "Tip Calculator", "Calculate the right tip", "/tools/tip-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/curiosity/gym-membership/page.tsx`]: [
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ”¥", "Calorie Calculator", "Track your calories", "/health/calorie-calculator"],
  ],
  [`${BASE}/curiosity/impulse-shopping/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/curiosity/latte-factor/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/curiosity/lottery/page.tsx`]: [
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}/curiosity/phone-upgrade/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
  ],
  [`${BASE}/curiosity/side-hustle/page.tsx`]: [
    ["ðŸ§¾", "Self-Employment Tax", "Know your tax burden", "/finance/self-employment-tax"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“‰", "Break-Even Calculator", "When do you profit?", "/finance/break-even"],
    ["ðŸ’¼", "Freelancer Rate", "Set your hourly rate", "/finance/freelancer-rate"],
  ],
  [`${BASE}/curiosity/smoking-investment/page.tsx`]: [
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["ðŸº", "Alcohol Cost Calculator", "Cost of drinking", "/health/alcohol-cost"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/curiosity/subscriptions/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’¸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/tools/car-true-cost/page.tsx`]: [
    ["ðŸš—", "Car Affordability", "Can you afford it?", "/finance/car-affordability"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“Š", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
  ],
  [`${BASE}/tools/career-timeline/page.tsx`]: [
    ["ðŸ’µ", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ¤–", "AI Job Score", "AI risk for your job", "/tools/ai-job-score"],
    ["ðŸ“Š", "Job Offer Comparison", "Compare job offers", "/tools/job-offer-comparison"],
  ],
  [`${BASE}/tools/compound-kindness/page.tsx`]: [
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["â³", "Procrastination Cost", "Cost of waiting", "/tools/procrastination-cost"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ¤”", "Regret Minimization", "Make better decisions", "/tools/regret-minimization"],
  ],
  [`${BASE}/tools/generational-wealth/page.tsx`]: [
    ["ðŸ‘¥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}/tools/life-in-numbers/page.tsx`]: [
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["ðŸŽ‚", "Age Calculator", "How old are you exactly?", "/age-calculator"],
    ["â¤ï¸", "Life Expectancy", "How long will you live?", "/health/life-expectancy"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/tools/misconceptions/page.tsx`]: [
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ‘¥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}/tools/mortgage-by-year/page.tsx`]: [
    ["ðŸ ", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ’³", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["ðŸ¡", "Rent vs Buy", "Should you rent or buy?", "/real-estate/rent-vs-buy"],
  ],
  [`${BASE}/tools/music-of-your-year/page.tsx`]: [
    ["ðŸŽ‚", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["ðŸŽ¯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["ðŸŒŸ", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
    ["ðŸŽ‚", "Age Calculator", "How old are you exactly?", "/age-calculator"],
  ],
  [`${BASE}/tools/name-popularity/page.tsx`]: [
    ["ðŸŽ‚", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["ðŸŽ¯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["ðŸŒŸ", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
    ["ðŸŽ‚", "Age Calculator", "How old are you exactly?", "/age-calculator"],
  ],
  [`${BASE}/tools/privilege-calculator/page.tsx`]: [
    ["ðŸ‘¥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["ðŸ’µ", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
  ],
  [`${BASE}/tools/regret-minimization/page.tsx`]: [
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["ðŸ–ï¸", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["â³", "Procrastination Cost", "Cost of waiting", "/tools/procrastination-cost"],
    ["ðŸ’¯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}/tools/salary-checker/page.tsx`]: [
    ["ðŸ’¼", "Salary Negotiation", "Negotiate a raise", "/tools/salary-negotiation"],
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ“Š", "Job Offer Comparison", "Compare job offers", "/tools/job-offer-comparison"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}/tools/stock-calculator/page.tsx`]: [
    ["ðŸ’¡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["ðŸ“ˆ", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["â±ï¸", "Market Timing Cost", "Cost of bad timing", "/tools/market-timing"],
    ["ðŸ“Š", "Stock Return Calculator", "Calculate returns", "/finance/stock-return"],
  ],
  [`${BASE}/real-estate/affordability/page.tsx`]: [
    ["ðŸ ", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ¡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}/real-estate/home-value/page.tsx`]: [
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ¡", "Rent vs Buy", "Should you rent or buy?", "/real-estate/rent-vs-buy"],
    ["ðŸ ", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["ðŸ¡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
  ],
  [`${BASE}/real-estate/rent-vs-buy/page.tsx`]: [
    ["ðŸ ", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["ðŸ“Š", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["ðŸ“‹", "Rent vs Buy Guide", "Deep dive analysis", "/blog/rent-vs-buy-calculator"],
    ["ðŸ¡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
  ],
  [`${BASE}/productivity/salary-calculator/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["ðŸ’µ", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["ðŸ•", "Overtime Calculator", "Calculate overtime pay", "/finance/overtime-calculator"],
  ],
  [`${BASE}/productivity/work-hours/page.tsx`]: [
    ["â°", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["ðŸ•", "Overtime Calculator", "Calculate overtime pay", "/finance/overtime-calculator"],
    ["ðŸ’µ", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["â³", "Time Wasted Calculator", "Reclaim your time", "/tools/time-wasted"],
  ],
  [`${BASE}/age-calculator/page.tsx`]: [
    ["ðŸŽ‚", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["â¤ï¸", "Life Expectancy", "How long will you live?", "/health/life-expectancy"],
    ["ðŸŒŸ", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
  ],
  [`${BASE}/born-in/page.tsx`]: [
    ["ðŸŽ‚", "Age Calculator", "How old are you exactly?", "/age-calculator"],
    ["ðŸ“…", "On This Day", "History on your birthday", "/on-this-day"],
    ["ðŸŽ¯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["ðŸ“…", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
  ],
};

function buildToolsJsx(tools) {
  const lines = ['          <RelatedTools tools={['];
  for (const [emoji, title, desc, href] of tools) {
    lines.push(`            { emoji: "${emoji}", title: "${title}", desc: "${desc}", href: "${href}" },`);
  }
  lines.push('          ]} />');
  return lines.join('\n');
}

const errors = [];
const successes = [];

for (const [filepath, tools] of Object.entries(pages)) {
  try {
    let content = fs.readFileSync(filepath, 'utf-8');

    if (content.includes('RelatedTools')) {
      successes.push(`SKIP (already has): ${filepath}`);
      continue;
    }

    // Add import after last import line
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportIdx = i;
    }

    if (lastImportIdx === -1) {
      errors.push(`No import found in ${filepath}`);
      continue;
    }

    lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
    content = lines.join('\n');

    const toolsJsx = buildToolsJsx(tools);

    const disclaimerPatterns = [
      '          <p className="text-xs text-[#a8a8b3]">',
      '        <p className="text-xs text-[#a8a8b3]">',
      '            <p className="text-xs text-[#a8a8b3]">',
    ];

    let inserted = false;
    for (const pat of disclaimerPatterns) {
      const idx = content.indexOf(pat);
      if (idx !== -1) {
        content = content.slice(0, idx) + toolsJsx + '\n' + content.slice(idx);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      errors.push(`Could not find insertion point in ${filepath}`);
      continue;
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    successes.push(`OK: ${filepath}`);

  } catch (e) {
    errors.push(`ERROR ${filepath}: ${e.message}`);
  }
}

console.log('=== SUCCESSES ===');
successes.forEach(s => console.log(s));
console.log('\n=== ERRORS ===');
errors.forEach(e => console.log(e));
console.log(`\nTotal: ${successes.length} successes, ${errors.length} errors`);

