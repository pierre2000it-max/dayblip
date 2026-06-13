const fs = require('fs');

const BASE = "C:\\Projects\\dayblip\\src\\app";
const IMPORT_LINE = 'import RelatedTools from "@/components/RelatedTools"';

const pages = {
  [`${BASE}\\finance\\net-worth\\page.tsx`]: [
    ["🏦", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["💰", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
  ],
  [`${BASE}\\finance\\inflation\\page.tsx`]: [
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["💡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["🏖️", "Retirement Savings", "Plan for retirement", "/finance/retirement-savings"],
    ["🏠", "Cost of Living", "Compare living costs", "/finance/cost-of-living"],
  ],
  [`${BASE}\\finance\\emergency-fund\\page.tsx`]: [
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}\\finance\\401k-calculator\\page.tsx`]: [
    ["💰", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["📋", "Roth IRA vs Traditional", "Which is better for you?", "/blog/roth-ira-vs-traditional-ira"],
  ],
  [`${BASE}\\finance\\social-security\\page.tsx`]: [
    ["💰", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["📊", "401(k) Calculator", "Maximize your 401k", "/finance/401k-calculator"],
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}\\finance\\capital-gains\\page.tsx`]: [
    ["📋", "Tax Bracket Calculator", "Find your tax bracket", "/finance/tax-bracket"],
    ["💡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["📊", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
  ],
  [`${BASE}\\finance\\self-employment-tax\\page.tsx`]: [
    ["⏱️", "Freelancer Rate Calculator", "Set your hourly rate", "/finance/freelancer-rate"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["💼", "Side Hustle Calculator", "Value your side income", "/tools/side-hustle"],
    ["📋", "Overtime Tax Calculator", "Tax on extra hours", "/finance/overtime-tax"],
  ],
  [`${BASE}\\finance\\college-savings\\page.tsx`]: [
    ["🎓", "Student Loan Calculator", "Plan for student debt", "/finance/student-loan"],
    ["🏫", "College ROI Calculator", "Is college worth it?", "/tools/college-roi"],
    ["📈", "Compound Interest", "Grow savings over time", "/finance/compound-interest"],
    ["📚", "GPA Calculator", "Track your GPA", "/education/gpa-calculator"],
  ],
  [`${BASE}\\finance\\stock-return\\page.tsx`]: [
    ["💡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["⏱️", "Market Timing Cost", "Cost of bad timing", "/tools/market-timing"],
    ["💰", "Retirement Savings", "Are you on track?", "/finance/retirement-savings"],
  ],
  [`${BASE}\\finance\\savings-goal\\page.tsx`]: [
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["🚨", "Emergency Fund", "Build your safety net", "/finance/emergency-fund"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}\\finance\\budget-calculator\\page.tsx`]: [
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}\\finance\\freelancer-rate\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["🧾", "Self-Employment Tax", "Know your tax burden", "/finance/self-employment-tax"],
    ["💼", "Side Hustle Calculator", "Value your side income", "/tools/side-hustle"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}\\finance\\car-affordability\\page.tsx`]: [
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}\\health\\habit-cost\\page.tsx`]: [
    ["🍺", "Alcohol Cost Calculator", "Cost of drinking", "/health/alcohol-cost"],
    ["🚬", "Smoking Cost Calculator", "Cost of smoking", "/tools/smoking-cost"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
  ],
  [`${BASE}\\health\\life-insurance\\page.tsx`]: [
    ["🛡️", "Life Insurance Calculator", "How much coverage?", "/tools/life-insurance-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["📈", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}\\curiosity\\car-upgrade\\page.tsx`]: [
    ["🚗", "Car Affordability", "Can you afford it?", "/finance/car-affordability"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\curiosity\\dining-out\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["🍽️", "Tip Calculator", "Calculate the right tip", "/tools/tip-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\curiosity\\gym-membership\\page.tsx`]: [
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["🔥", "Calorie Calculator", "Track your calories", "/health/calorie-calculator"],
  ],
  [`${BASE}\\curiosity\\impulse-shopping\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\curiosity\\latte-factor\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\curiosity\\lottery\\page.tsx`]: [
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}\\curiosity\\phone-upgrade\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
  ],
  [`${BASE}\\curiosity\\side-hustle\\page.tsx`]: [
    ["🧾", "Self-Employment Tax", "Know your tax burden", "/finance/self-employment-tax"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📉", "Break-Even Calculator", "When do you profit?", "/finance/break-even"],
    ["💼", "Freelancer Rate", "Set your hourly rate", "/finance/freelancer-rate"],
  ],
  [`${BASE}\\curiosity\\smoking-investment\\page.tsx`]: [
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["🍺", "Alcohol Cost Calculator", "Cost of drinking", "/health/alcohol-cost"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\curiosity\\subscriptions\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💸", "Habit Cost Calculator", "Total cost of habits", "/health/habit-cost"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\tools\\car-true-cost\\page.tsx`]: [
    ["🚗", "Car Affordability", "Can you afford it?", "/finance/car-affordability"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📊", "Budget Calculator", "Build a monthly budget", "/finance/budget-calculator"],
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
  ],
  [`${BASE}\\tools\\career-timeline\\page.tsx`]: [
    ["💵", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["🤖", "AI Job Score", "AI risk for your job", "/tools/ai-job-score"],
    ["📊", "Job Offer Comparison", "Compare job offers", "/tools/job-offer-comparison"],
  ],
  [`${BASE}\\tools\\compound-kindness\\page.tsx`]: [
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["⏳", "Procrastination Cost", "Cost of waiting", "/tools/procrastination-cost"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["🤔", "Regret Minimization", "Make better decisions", "/tools/regret-minimization"],
  ],
  [`${BASE}\\tools\\generational-wealth\\page.tsx`]: [
    ["👥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
  ],
  [`${BASE}\\tools\\life-in-numbers\\page.tsx`]: [
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["🎂", "Age Calculator", "How old are you exactly?", "/age-calculator"],
    ["❤️", "Life Expectancy", "How long will you live?", "/health/life-expectancy"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\tools\\misconceptions\\page.tsx`]: [
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["👥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
  ],
  [`${BASE}\\tools\\mortgage-by-year\\page.tsx`]: [
    ["🏠", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["💳", "Debt Payoff Calculator", "Pay off debt faster", "/finance/debt-payoff"],
    ["🏡", "Rent vs Buy", "Should you rent or buy?", "/real-estate/rent-vs-buy"],
  ],
  [`${BASE}\\tools\\music-of-your-year\\page.tsx`]: [
    ["🎂", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["🎯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["🌟", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
    ["🎂", "Age Calculator", "How old are you exactly?", "/age-calculator"],
  ],
  [`${BASE}\\tools\\name-popularity\\page.tsx`]: [
    ["🎂", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["🎯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["🌟", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
    ["🎂", "Age Calculator", "How old are you exactly?", "/age-calculator"],
  ],
  [`${BASE}\\tools\\privilege-calculator\\page.tsx`]: [
    ["👥", "Generation Compare", "Compare generations", "/tools/generation-compare"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
    ["💵", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
  ],
  [`${BASE}\\tools\\regret-minimization\\page.tsx`]: [
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["🏖️", "FI Date Calculator", "When can you stop working?", "/tools/fi-date"],
    ["⏳", "Procrastination Cost", "Cost of waiting", "/tools/procrastination-cost"],
    ["💯", "Financial Life Score", "Rate your financial health", "/tools/financial-life-score"],
  ],
  [`${BASE}\\tools\\salary-checker\\page.tsx`]: [
    ["💼", "Salary Negotiation", "Negotiate a raise", "/tools/salary-negotiation"],
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["📊", "Job Offer Comparison", "Compare job offers", "/tools/job-offer-comparison"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}\\tools\\stock-calculator\\page.tsx`]: [
    ["💡", "What If I Invested?", "See investment growth", "/finance/what-if-i-invested"],
    ["📈", "Compound Interest", "Grow wealth over time", "/finance/compound-interest"],
    ["⏱️", "Market Timing Cost", "Cost of bad timing", "/tools/market-timing"],
    ["📊", "Stock Return Calculator", "Calculate returns", "/finance/stock-return"],
  ],
  [`${BASE}\\real-estate\\affordability\\page.tsx`]: [
    ["🏠", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["🏡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
  ],
  [`${BASE}\\real-estate\\home-value\\page.tsx`]: [
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["🏡", "Rent vs Buy", "Should you rent or buy?", "/real-estate/rent-vs-buy"],
    ["🏠", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["🏡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
  ],
  [`${BASE}\\real-estate\\rent-vs-buy\\page.tsx`]: [
    ["🏠", "Mortgage Calculator", "Calculate payments", "/finance/mortgage-calculator"],
    ["📊", "Net Worth Calculator", "Track your net worth", "/finance/net-worth"],
    ["📋", "Rent vs Buy Guide", "Deep dive analysis", "/blog/rent-vs-buy-calculator"],
    ["🏡", "American Dream Calculator", "Can you afford it?", "/tools/american-dream-calculator"],
  ],
  [`${BASE}\\productivity\\salary-calculator\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["💵", "Salary Checker", "Is your salary fair?", "/tools/salary-checker"],
    ["🕐", "Overtime Calculator", "Calculate overtime pay", "/finance/overtime-calculator"],
  ],
  [`${BASE}\\productivity\\work-hours\\page.tsx`]: [
    ["⏰", "True Hourly Wage", "What you really earn", "/tools/true-hourly-wage"],
    ["🕐", "Overtime Calculator", "Calculate overtime pay", "/finance/overtime-calculator"],
    ["💵", "Take-Home Pay", "See your net paycheck", "/finance/take-home-pay"],
    ["⏳", "Time Wasted Calculator", "Reclaim your time", "/tools/time-wasted"],
  ],
  [`${BASE}\\age-calculator\\page.tsx`]: [
    ["🎂", "Born In Explorer", "Explore your birth year", "/born-in"],
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
    ["❤️", "Life Expectancy", "How long will you live?", "/health/life-expectancy"],
    ["🌟", "Birthday Personality", "Your birthday traits", "/tools/birthday-personality"],
  ],
  [`${BASE}\\born-in\\page.tsx`]: [
    ["🎂", "Age Calculator", "How old are you exactly?", "/age-calculator"],
    ["📅", "On This Day", "History on your birthday", "/on-this-day"],
    ["🎯", "Generation Quiz", "What generation are you?", "/tools/generation-quiz"],
    ["📅", "Life in Weeks", "Visualize your life", "/tools/life-in-weeks"],
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
      // Files that use {DISCLAIMER} instead of inline p tag
      '\n          {DISCLAIMER}\n        </div>',
      '\n            {DISCLAIMER}\n          </div>',
      // Files that end with just ShareButtons closing /> before </div>
      '\n          />\n        </div>\n      </section>',
      '\n              />\n              {DISCLAIMER}\n            </div>',
      // Files with no disclaimer - insert before closing section
      '\n        </div>\n      </section>\n    </div>\n  )\n}',
    ];

    let inserted = false;
    for (const pat of disclaimerPatterns) {
      const idx = content.indexOf(pat);
      if (idx !== -1) {
        // For the end-of-file pattern, insert before the closing div chain
        content = content.slice(0, idx) + toolsJsx + '\n' + content.slice(idx);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      errors.push(`No insertion point found in ${filepath}`);
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
