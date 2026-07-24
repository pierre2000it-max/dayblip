"use client"

import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Puzzle bank ───────────────────────────────────────────────────────────────

interface Puzzle {
  question: string
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: string
}

const PUZZLES: Puzzle[] = [
  {
    question: "What is the Rule of 72?",
    options: [
      "Divide 72 by your interest rate to find years to double your money",
      "Maximum 401k contribution age limit",
      "Federal poverty line calculation method",
      "Credit score minimum for a mortgage",
    ],
    answer: 0,
    explanation: "Divide 72 by your annual return rate to find how many years to double your money. At 8% annual return: 72 ÷ 8 = 9 years to double. At 6%: 72 ÷ 6 = 12 years. It also works for inflation — at 3% inflation, prices double in 24 years.",
  },
  {
    question: "What does FICO stand for?",
    options: [
      "Federal Insurance Credit Office",
      "Fair Isaac Corporation",
      "Financial Industry Credit Organization",
      "First Individual Credit Order",
    ],
    answer: 1,
    explanation: "FICO stands for Fair Isaac Corporation — the company that created the credit scoring model. Your FICO score ranges from 300–850. A score above 670 is considered good. Above 740 is very good and qualifies for the best mortgage rates.",
  },
  {
    question: "The US national debt crossed $36 trillion in 2024. If divided equally among all Americans, what would each person owe?",
    options: ["About $47,000", "About $87,000", "About $107,000", "About $127,000"],
    answer: 2,
    explanation: "$36 trillion divided by approximately 336 million Americans equals about $107,000 per person. That is more than the median US household income of $74,580 per year. The debt has grown from $5 trillion in 2000 to $36 trillion in 2024.",
  },
  {
    question: "What percentage of Americans have less than $1,000 in savings?",
    options: ["12%", "22%", "32%", "42%"],
    answer: 2,
    explanation: "Approximately 32% of Americans have less than $1,000 in savings according to Federal Reserve surveys. This leaves them highly vulnerable to unexpected expenses. Financial experts recommend 3–6 months of expenses as a minimum emergency fund.",
  },
  {
    question: "If you invest $500/month starting at age 25 at 7% annual return, how much will you have at age 65?",
    options: ["$240,000", "$980,000", "$1,310,000", "$2,400,000"],
    answer: 2,
    explanation: "$500/month for 40 years at 7% grows to approximately $1.31 million through compound interest. You contributed $240,000 total. The remaining $1.07 million came from compound growth — showing why starting early is so powerful.",
  },
  {
    question: "What is the 4% rule in retirement?",
    options: [
      "Save 4% of income every year",
      "Withdraw 4% of your portfolio annually for a 30-year retirement",
      "Keep 4% of portfolio in cash at all times",
      "Retire when you have 4x your annual expenses saved",
    ],
    answer: 1,
    explanation: "The 4% rule states you can withdraw 4% of your retirement portfolio in year one then adjust for inflation each year with a high probability of not running out of money over 30 years. Based on the Trinity Study of historical market returns.",
  },
  {
    question: "What is dollar cost averaging?",
    options: [
      "Converting all savings to US dollars",
      "Investing a fixed amount on a regular schedule regardless of price",
      "Averaging your hourly wage over time",
      "Splitting investments 50/50 between stocks and bonds",
    ],
    answer: 1,
    explanation: "Dollar cost averaging means investing a fixed amount regularly — like $500 every month — regardless of whether markets are up or down. This automatically buys more shares when prices are low and fewer when prices are high, reducing the impact of volatility.",
  },
  {
    question: "What does ETF stand for?",
    options: [
      "Equity Transfer Fund",
      "Exchange Traded Fund",
      "Electronic Transfer Finance",
      "Equal Trading Formula",
    ],
    answer: 1,
    explanation: "An ETF (Exchange Traded Fund) is a basket of securities that trades on a stock exchange like a single stock. ETFs often track an index like the S&P 500. They offer diversification at low cost — a broad market ETF can have an expense ratio as low as 0.03%.",
  },
  {
    question: "What is the current annual contribution limit for a Roth IRA (2024–2026)?",
    options: ["$5,500", "$6,500", "$7,000", "$8,000"],
    answer: 2,
    explanation: "The 2024–2026 Roth IRA contribution limit is $7,000 per year ($8,000 if you are age 50 or older). Roth IRA contributions are made with after-tax dollars but grow tax-free, and qualified withdrawals in retirement are completely tax-free.",
  },
  {
    question: "Which state has the highest average property tax burden?",
    options: ["California", "New York", "New Jersey", "Illinois"],
    answer: 2,
    explanation: "New Jersey has the highest average property taxes in the nation at approximately $9,000+ per year. While California has the highest income tax rate at up to 13.3%, New Jersey's combination of high property taxes, income taxes, and other levies gives it the heaviest overall tax burden.",
  },
  {
    question: "The average American spends approximately how much per year on coffee?",
    options: ["$500", "$1,100", "$1,900", "$3,200"],
    answer: 1,
    explanation: "$1,100 per year is the average American's coffee spending. At $1,100 per year invested at 7% for 30 years that is $111,000 — the calculation behind the famous Latte Factor concept that shows how small daily spending compounds into large long-term costs.",
  },
  {
    question: "What is a HELOC?",
    options: [
      "Home Equity Line Of Credit",
      "High Earnings Loan On Collateral",
      "Home Exchange Listing Option Contract",
      "Housing Equity Lender Organization Code",
    ],
    answer: 0,
    explanation: "A HELOC (Home Equity Line of Credit) lets homeowners borrow against their home equity as a revolving credit line. Interest rates are variable and tied to the prime rate. HELOCs are commonly used for home improvements but put your home at risk if you cannot repay.",
  },
  {
    question: "What percentage of US households own stocks directly or through retirement accounts?",
    options: ["38%", "48%", "58%", "68%"],
    answer: 2,
    explanation: "Approximately 58% of US households own stocks directly or through retirement accounts like 401ks and IRAs according to Federal Reserve data. Ownership is heavily skewed by income — 92% of the top income quintile owns stocks versus 28% of the bottom quintile.",
  },
  {
    question: "What is the debt-to-income ratio most lenders require for a conventional mortgage?",
    options: ["Below 28%", "Below 36%", "Below 43%", "Below 50%"],
    answer: 2,
    explanation: "Most conventional mortgage lenders require a total debt-to-income ratio of 43% or below, though some allow up to 50% with compensating factors. DTI is calculated as total monthly debt payments divided by gross monthly income. The housing payment alone should ideally be under 28% of gross income.",
  },
  {
    question: "If inflation is 3% per year, how long does it take for prices to double?",
    options: ["18 years", "24 years", "30 years", "36 years"],
    answer: 1,
    explanation: "Using the Rule of 72: 72 divided by 3% inflation = 24 years for prices to double. At 7% inflation, prices double in about 10 years. This is why keeping too much money in cash long-term erodes purchasing power — your dollars buy less over time even without spending them.",
  },
  {
    question: "What is the maximum 401k contribution limit for 2026?",
    options: ["$19,500", "$22,500", "$23,500", "$25,000"],
    answer: 2,
    explanation: "The 2026 401k contribution limit is $23,500 for employees ($31,000 if age 50 or older, including the $7,500 catch-up contribution). This limit applies to traditional and Roth 401k combined. Employer matching contributions do not count toward this limit.",
  },
  {
    question: "What is compound interest often called?",
    options: [
      "The fifth economic wonder",
      "The eighth wonder of the world",
      "The magic multiplier",
      "The banker's secret",
    ],
    answer: 1,
    explanation: "Compound interest is often called the eighth wonder of the world — a quote attributed to Albert Einstein though its exact origin is debated. Unlike simple interest which pays only on the principal, compound interest pays interest on interest, causing exponential growth over time.",
  },
  {
    question: "What is the federal capital gains tax rate for long-term gains for most middle-income earners?",
    options: ["0%", "15%", "20%", "25%"],
    answer: 1,
    explanation: "Most middle-income Americans pay a 15% long-term capital gains tax rate on assets held over one year. The 0% rate applies to lower-income earners. The 20% rate kicks in for high earners. These rates are significantly lower than ordinary income tax rates, which can reach 37%.",
  },
  {
    question: "What is the Social Security full retirement age for someone born in 1960 or later?",
    options: ["65", "66", "67", "68"],
    answer: 2,
    explanation: "The full retirement age (FRA) for anyone born in 1960 or later is 67. You can claim Social Security as early as age 62 at a permanently reduced benefit (up to 30% less) or delay until age 70 for an 8% increase per year beyond FRA.",
  },
  {
    question: "The S&P 500 has averaged approximately what annual return over the past 50 years?",
    options: ["5.5%", "7%", "10%", "13%"],
    answer: 2,
    explanation: "The S&P 500 has returned approximately 10% annually on average over the past 50 years before inflation. After adjusting for inflation the real return is about 7%. This is the basis for the commonly used 7% real return assumption in retirement calculators.",
  },
  {
    question: "What does APR stand for in financial products?",
    options: [
      "Annual Percentage Rate",
      "Applied Principal Rate",
      "Adjusted Payment Ratio",
      "Annual Premium Requirement",
    ],
    answer: 0,
    explanation: "APR (Annual Percentage Rate) is the yearly cost of borrowing money including fees, expressed as a percentage. Unlike the interest rate alone, APR includes additional costs like origination fees, making it a more complete picture of the true cost of a loan.",
  },
  {
    question: "What is a 529 plan?",
    options: [
      "A small business retirement plan",
      "A tax-advantaged savings plan for education expenses",
      "A type of municipal bond",
      "A federal savings bond for first-time homebuyers",
    ],
    answer: 1,
    explanation: "A 529 plan is a tax-advantaged savings account for education expenses. Contributions grow tax-free and withdrawals for qualified education expenses are tax-free. Many states offer a tax deduction for contributions. In 2024, unused 529 funds can be rolled into a Roth IRA after 15 years.",
  },
  {
    question: "What is an expense ratio in a mutual fund or ETF?",
    options: [
      "The ratio of stock to bond holdings",
      "Annual fee charged as a percentage of assets",
      "The fund's price-to-earnings ratio",
      "The ratio of growth to value stocks",
    ],
    answer: 1,
    explanation: "An expense ratio is the annual fee a fund charges as a percentage of assets. A 1% expense ratio on a $100,000 investment costs $1,000 per year. Index funds typically charge 0.03%–0.20% while actively managed funds charge 0.50%–1.5%. Over 30 years a 1% expense ratio can reduce returns by 25%.",
  },
  {
    question: "What percentage of Americans have no retirement savings at all?",
    options: ["11%", "21%", "28%", "36%"],
    answer: 2,
    explanation: "Approximately 28% of Americans have no retirement savings according to Federal Reserve surveys. Among those 55–64 — within a decade of typical retirement age — the median retirement account balance is $134,000, which would generate only about $5,000 per year using the 4% rule.",
  },
  {
    question: "What is the standard deduction for a single filer in 2024?",
    options: ["$10,500", "$12,550", "$14,600", "$16,200"],
    answer: 2,
    explanation: "The standard deduction for a single filer in 2024 is $14,600. For married filing jointly it is $29,200. The standard deduction reduces your taxable income dollar for dollar. About 90% of Americans take the standard deduction rather than itemizing.",
  },
  {
    question: "What is the typical down payment percentage for a conventional mortgage?",
    options: ["3%", "5%", "10%", "20%"],
    answer: 3,
    explanation: "The traditional down payment is 20% to avoid Private Mortgage Insurance (PMI). However, conventional loans can go as low as 3–5% with PMI. FHA loans require just 3.5% down. PMI typically costs 0.5%–1.5% of the loan amount per year until you reach 20% equity.",
  },
  {
    question: "What does HSA stand for and who can use one?",
    options: [
      "Health Savings Account — anyone with health insurance",
      "Health Savings Account — only those with a high-deductible health plan",
      "Health Support Allocation — retirees only",
      "Health Spending Account — employer-funded accounts",
    ],
    answer: 1,
    explanation: "An HSA (Health Savings Account) is available only to people enrolled in a High-Deductible Health Plan (HDHP). Contributions are tax-deductible, grow tax-free, and withdrawals for medical expenses are tax-free — a triple tax advantage. In 2024 individuals can contribute up to $4,150, families up to $8,300.",
  },
  {
    question: "What is the minimum credit score generally needed for the best mortgage rates?",
    options: ["650", "700", "720", "760"],
    answer: 3,
    explanation: "A credit score of 760 or higher typically qualifies for the best mortgage interest rates. The difference between a 700 and 760 score on a $400,000 30-year mortgage can be 0.5% in rate — about $120 per month or $43,000 over the life of the loan.",
  },
  {
    question: "What is the median US household income as of 2023?",
    options: ["$56,900", "$68,700", "$74,580", "$82,400"],
    answer: 2,
    explanation: "The median US household income was $74,580 in 2022–2023 according to the US Census Bureau. This means half of US households earn more and half earn less. Median is a better measure than average because it is not skewed by the very wealthy. The average (mean) household income is approximately $105,000.",
  },
  {
    question: "What is the difference between a traditional IRA and a Roth IRA?",
    options: [
      "Traditional: pre-tax contributions, taxed on withdrawal. Roth: after-tax, tax-free withdrawal",
      "Traditional: for employees only. Roth: for self-employed only",
      "Traditional: higher limits. Roth: lower limits",
      "They are identical — just different names from different banks",
    ],
    answer: 0,
    explanation: "Traditional IRA contributions may be tax-deductible now (reducing current taxes) but withdrawals in retirement are taxed as income. Roth IRA contributions are made with after-tax money but qualified withdrawals in retirement are completely tax-free including all growth. Choosing between them depends on whether your tax rate is higher now or in retirement.",
  },
  {
    question: "What is PMI in a mortgage?",
    options: [
      "Primary Mortgage Insurance — mandatory on all loans",
      "Private Mortgage Insurance — required when down payment is below 20%",
      "Premium Mortgage Index — used to set ARM rates",
      "Principal Mortgage Interest — the interest-only portion",
    ],
    answer: 1,
    explanation: "Private Mortgage Insurance (PMI) protects the lender — not you — if you default. It is required on conventional loans when your down payment is below 20%. PMI typically costs 0.5%–1.5% of the loan amount annually. On a $400,000 loan that is $2,000–$6,000 per year until you reach 20% equity.",
  },
  {
    question: "What is an index fund?",
    options: [
      "A fund that actively picks winning stocks",
      "A fund that tracks a market index like the S&P 500",
      "A government bond fund",
      "A fund that only invests in index-linked products",
    ],
    answer: 1,
    explanation: "An index fund passively tracks a market index like the S&P 500 by holding all (or representative) stocks in the index. Because it requires minimal management it charges very low fees. Studies consistently show that most actively managed funds underperform their benchmark index over 10+ years after fees.",
  },
  {
    question: "What is an amortization schedule?",
    options: [
      "A schedule showing when bonds mature",
      "A table showing each loan payment split between principal and interest",
      "A depreciation schedule for business assets",
      "A schedule for annual tax payments",
    ],
    answer: 1,
    explanation: "An amortization schedule shows each payment on a loan broken down into principal and interest. Early payments are mostly interest. Later payments are mostly principal. On a typical 30-year mortgage, you pay more interest than principal for the first 20 years — which is why refinancing early can save significant money.",
  },
  {
    question: "What is a target-date fund?",
    options: [
      "A fund that only holds stocks until a specific date",
      "A fund that automatically shifts to more conservative investments as your retirement date approaches",
      "A fund that targets specific return dates for investors",
      "A fund matching the date of the S&P 500 index creation",
    ],
    answer: 1,
    explanation: "A target-date fund (like a 2050 fund) automatically rebalances from growth-oriented stocks to conservative bonds as the target year approaches. They are designed as a one-fund retirement solution. Most 401k plans offer them as a default. The main downside is expense ratios can be higher than simply buying index funds directly.",
  },
  {
    question: "What is the FDIC insurance limit per depositor per bank?",
    options: ["$100,000", "$150,000", "$250,000", "$500,000"],
    answer: 2,
    explanation: "The FDIC insures deposits up to $250,000 per depositor per bank per account ownership category. If you have more than $250,000 at a single bank it is wise to spread it across multiple institutions or account types. Joint accounts have separate $250,000 coverage per co-owner.",
  },
  {
    question: "What is the average American credit card interest rate in 2024?",
    options: ["12%", "17%", "21%", "27%"],
    answer: 2,
    explanation: "The average credit card interest rate hit approximately 21% in 2024 — the highest on record. On a $5,000 balance paying only the minimum, you would pay over $7,000 in interest and take 17+ years to pay it off. This is why eliminating high-interest credit card debt is always the highest-return 'investment' you can make.",
  },
  {
    question: "What does net worth mean?",
    options: [
      "Your annual salary after taxes",
      "The value of everything you own minus everything you owe",
      "Your total investment portfolio value",
      "Your bank account balances combined",
    ],
    answer: 1,
    explanation: "Net worth is your total assets minus your total liabilities. Assets include savings, investments, home equity, and personal property. Liabilities include mortgages, car loans, student loans, and credit card debt. The median net worth of Americans in their 30s is approximately $122,000 according to Federal Reserve data.",
  },
  {
    question: "What is a bond?",
    options: [
      "A stock in a defensive company",
      "A loan you make to a government or corporation that pays regular interest",
      "An insurance policy for investments",
      "A guaranteed savings account",
    ],
    answer: 1,
    explanation: "A bond is essentially a loan you make to a government or corporation. They promise to pay you regular interest (the coupon) and return your principal at maturity. Bonds are generally less volatile than stocks but provide lower long-term returns. They are used to stabilize portfolios as investors approach retirement.",
  },
  {
    question: "What is the highest marginal federal income tax rate in the US as of 2024?",
    options: ["32%", "35%", "37%", "39.6%"],
    answer: 2,
    explanation: "The highest federal marginal income tax rate is 37% on income above $609,350 for single filers and $731,200 for married filing jointly in 2024. Remember: marginal rates apply only to the income in each bracket — not all of your income. The effective tax rate (average rate paid) is always lower than your marginal rate.",
  },
  {
    question: "What is the typical US 30-year fixed mortgage rate range in 2024?",
    options: ["3–4%", "5–6%", "6.5–7.5%", "8–10%"],
    answer: 2,
    explanation: "30-year fixed mortgage rates ranged approximately 6.5%–7.5% throughout 2024, significantly higher than the historic lows of 2.6%–3.5% seen in 2020–2021. The payment difference between a 3% and 7% rate on a $400,000 mortgage is about $1,000 per month — nearly $360,000 over 30 years.",
  },
  {
    question: "What is the FIRE movement?",
    options: [
      "Financial Independence Research Exercises",
      "Financial Independence Retire Early",
      "Frequent Investment Return Evaluation",
      "Fixed Income Retirement Efficiency",
    ],
    answer: 1,
    explanation: "FIRE stands for Financial Independence Retire Early. Adherents typically save 50–70% of income and aim to retire decades before traditional retirement age. The number needed is roughly 25x annual expenses (based on the 4% withdrawal rule). 'Lean FIRE' targets minimal spending; 'Fat FIRE' targets a comfortable lifestyle.",
  },
  {
    question: "What is an emergency fund?",
    options: [
      "Insurance for emergencies",
      "A liquid savings buffer covering 3–6 months of living expenses",
      "A government program for financial emergencies",
      "A special high-yield savings account from the IRS",
    ],
    answer: 1,
    explanation: "An emergency fund is liquid savings covering 3–6 months of essential living expenses. It should be kept in a high-yield savings account — accessible within days but separate from daily spending. Without an emergency fund, unexpected costs like car repairs or medical bills often become high-interest debt.",
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Investing in companies from different countries only",
      "Spreading investments across different assets to reduce risk",
      "Having both checking and savings accounts",
      "Investing in both growth and value stocks",
    ],
    answer: 1,
    explanation: "Diversification means spreading investments across different asset classes, industries, and geographies to reduce risk. When one investment falls, others may hold steady or rise. A diversified portfolio might include US stocks, international stocks, bonds, and real estate. Modern Portfolio Theory shows diversification reduces risk without proportionally reducing returns.",
  },
  {
    question: "What is a fiduciary financial advisor?",
    options: [
      "An advisor certified by FINRA",
      "An advisor legally required to act in your best interest",
      "An advisor who only manages retirement accounts",
      "A fee-only advisor who charges flat rates",
    ],
    answer: 1,
    explanation: "A fiduciary is legally required to act in your best financial interest — not just recommend 'suitable' products. Non-fiduciary brokers only need to recommend products that are suitable, which can include products with higher commissions that are not the best option for you. Always ask if an advisor is a fiduciary before hiring them.",
  },
  {
    question: "What does it mean when a stock pays a dividend?",
    options: [
      "The stock split into two shares",
      "The company distributes a portion of profits to shareholders",
      "The stock reached its 52-week high",
      "The company is buying back shares",
    ],
    answer: 1,
    explanation: "A dividend is a regular cash payment a company distributes to shareholders from its profits. Dividend-paying stocks provide income regardless of whether the stock price rises or falls. Dividend reinvestment (DRIP) — automatically buying more shares with dividends — is one of the most powerful long-term wealth building strategies.",
  },
  {
    question: "What is the Rule of 110 in investing?",
    options: [
      "Subtract your age from 110 to get your recommended stock allocation percentage",
      "Save 110% of your monthly expenses in an emergency fund",
      "Invest for at least 110 months before withdrawing",
      "Never pay more than 110% of book value for a stock",
    ],
    answer: 0,
    explanation: "The Rule of 110 (sometimes 100 or 120 in more aggressive versions) suggests subtracting your age from 110 to get your percentage allocation to stocks. At age 30 that is 80% stocks; at age 60 it is 50% stocks. This is a rough guideline — actual allocation depends on your risk tolerance and financial situation.",
  },
  {
    question: "How much does the average US wedding cost in 2024?",
    options: ["$18,000", "$24,000", "$30,000", "$35,000"],
    answer: 2,
    explanation: "The average US wedding cost is approximately $30,000–$35,000 according to The Knot's annual survey. Invested at 7% annual return, $30,000 grows to approximately $228,000 over 30 years. This represents the opportunity cost of wedding spending — though obviously personal values vary widely on this tradeoff.",
  },
  {
    question: "What is the primary difference between term and whole life insurance?",
    options: [
      "Term: covers whole life. Whole: covers specific years",
      "Term: time-limited, no cash value. Whole: permanent, builds cash value",
      "Term: for businesses. Whole: for individuals",
      "Term: state-regulated. Whole: federally regulated",
    ],
    answer: 1,
    explanation: "Term life insurance covers you for a specific period (10, 20, or 30 years) and has no cash value — it is pure death benefit. Whole life is permanent coverage that also builds a cash value component. Term is significantly cheaper: a 35-year-old might pay $30/month for $500,000 in 20-year term versus $400+/month for whole life.",
  },
  {
    question: "What is the average cost of raising a child to age 18 in the US?",
    options: ["$122,000", "$170,000", "$237,000", "$310,000"],
    answer: 2,
    explanation: "The USDA estimated the cost of raising a child to age 18 at approximately $237,000 for a middle-income family — not including college. This breaks down to about $13,000 per year. Housing accounts for roughly 29% of the total, food 18%, childcare and education 16%.",
  },
  {
    question: "What is an HSA triple tax advantage?",
    options: [
      "Tax-free contributions, tax-free growth, tax-free medical withdrawals",
      "No state, local, or federal tax on interest",
      "Tax deductions for three years of medical expenses",
      "Combined tax benefits of IRA, 401k, and savings account",
    ],
    answer: 0,
    explanation: "The HSA triple tax advantage means: (1) contributions are tax-deductible reducing taxable income, (2) money grows tax-free inside the account, and (3) withdrawals for qualified medical expenses are tax-free. After age 65 you can withdraw for any purpose paying only regular income tax — making it essentially a super-IRA.",
  },
  {
    question: "What year was the S&P 500 index created?",
    options: ["1927", "1948", "1957", "1965"],
    answer: 2,
    explanation: "The S&P 500 was introduced in 1957, expanding from the earlier S&P 90 index. It tracks 500 large US public companies representing about 80% of US market capitalization. John Bogle launched the first index fund tracking it in 1976 — the idea that an average investor could simply own 'the market' was considered radical at the time.",
  },
  {
    question: "What is the current federal minimum wage in the US?",
    options: ["$7.25", "$8.00", "$9.50", "$10.00"],
    answer: 0,
    explanation: "The federal minimum wage has been $7.25 per hour since 2009 — over 15 years without a federal increase, the longest stretch in US history. However, 30+ states and many cities have higher minimum wages. California's minimum wage reached $16/hour in 2024. Full-time at $7.25/hour yields about $15,080 per year before taxes.",
  },
  {
    question: "What is a required minimum distribution (RMD)?",
    options: [
      "The minimum amount you must invest each year",
      "Mandatory annual withdrawal from traditional retirement accounts starting at age 73",
      "The minimum emergency fund the IRS requires",
      "Required quarterly tax payments for freelancers",
    ],
    answer: 1,
    explanation: "RMDs are mandatory withdrawals from traditional IRAs, 401ks, and similar accounts that must begin at age 73 (changed from 72 by the SECURE 2.0 Act). The IRS requires these withdrawals so it can collect taxes on previously tax-deferred money. Roth IRAs have no RMDs during the owner's lifetime.",
  },
  {
    question: "What is the 50/30/20 budgeting rule?",
    options: [
      "50% savings, 30% housing, 20% everything else",
      "50% needs, 30% wants, 20% savings and debt payoff",
      "50% investments, 30% retirement, 20% emergency fund",
      "50% income tax, 30% spending, 20% take-home",
    ],
    answer: 1,
    explanation: "The 50/30/20 rule suggests allocating 50% of after-tax income to needs (housing, food, utilities), 30% to wants (dining out, entertainment, subscriptions), and 20% to savings and debt payoff. Popularized by Senator Elizabeth Warren in her book All Your Worth. Many experts suggest pushing the 20% savings rate higher if possible.",
  },
  {
    question: "What is a credit utilization ratio and what is a healthy level?",
    options: [
      "Total debt to income — should be under 36%",
      "Credit card balance to credit limit — should be under 30%",
      "Number of cards to total credit lines — should be under 5",
      "Monthly payment to total balance — should be over 10%",
    ],
    answer: 1,
    explanation: "Credit utilization is how much of your available credit you are using. A $3,000 balance on a $10,000 limit = 30% utilization. Staying below 30% is good; below 10% is excellent. Credit utilization accounts for 30% of your FICO score — the second biggest factor after payment history.",
  },
  {
    question: "What is the average return of the US bond market over the past 20 years?",
    options: ["1.5%", "3%", "4.5%", "6%"],
    answer: 1,
    explanation: "The US bond market has returned approximately 3–4% annually over the past 20 years. After inflation that real return is closer to 1–2%. Bonds provide stability and income but their long-term returns are significantly lower than stocks. This is why most financial plans hold more stocks than bonds for anyone with a long investment horizon.",
  },
  {
    question: "What is a backdoor Roth IRA?",
    options: [
      "A Roth IRA opened without a Social Security number",
      "A strategy for high earners to contribute to a Roth IRA by converting from a traditional IRA",
      "An inherited IRA converted to Roth",
      "A self-directed IRA with alternative investments",
    ],
    answer: 1,
    explanation: "High earners above Roth IRA income limits ($161,000 single, $240,000 married in 2024) can use a backdoor Roth: contribute to a non-deductible traditional IRA then immediately convert it to a Roth. This legal strategy preserves access to tax-free retirement growth despite income limits.",
  },
  {
    question: "What percentage of Americans live paycheck to paycheck?",
    options: ["35%", "48%", "61%", "72%"],
    answer: 2,
    explanation: "Approximately 61% of Americans reported living paycheck to paycheck according to LendingClub research in 2023. This spans income levels — 44% of those earning $100,000 or more also live paycheck to paycheck. It reflects both the pressure of rising costs and spending behavior at higher income levels.",
  },
  {
    question: "What is the average interest rate on federal student loans in 2024?",
    options: ["3.5%", "5.5%", "6.5%", "8%"],
    answer: 2,
    explanation: "Federal student loan interest rates for undergraduates were approximately 6.53% for 2024–2025. Graduate loans are higher at 8.08%. These rates reset annually based on 10-year Treasury note auctions. Total US student loan debt exceeded $1.7 trillion in 2024, the second-largest consumer debt category after mortgages.",
  },
  {
    question: "What is dollar-for-dollar 401k matching?",
    options: [
      "The employer matches every dollar you contribute up to a limit",
      "You must contribute $1 for every $1 you want to withdraw",
      "The government matches low-income contributions",
      "Automatic investment doubling after 10 years",
    ],
    answer: 0,
    explanation: "Dollar-for-dollar 401k matching means your employer adds $1 to your 401k for every $1 you contribute up to a set limit (often 3–6% of salary). This is a 100% immediate return on your contribution — the single highest-return financial move available to most employees. Always contribute at least enough to get the full match.",
  },
  {
    question: "What is the maximum annual gift you can give someone without filing a gift tax return (2024)?",
    options: ["$10,000", "$15,000", "$18,000", "$25,000"],
    answer: 2,
    explanation: "The annual gift tax exclusion for 2024 is $18,000 per recipient. You can give $18,000 to as many people as you want without filing a gift tax return. Married couples can combine their exclusions to give $36,000 per recipient. Gifts above the annual exclusion use up your lifetime estate and gift tax exemption.",
  },
  {
    question: "What was the worst single-day percentage drop in US stock market history?",
    options: ["The 1929 crash: −11%", "Black Monday 1987: −22.6%", "The 2020 COVID crash: −12%", "The 2008 financial crisis day: −9.3%"],
    answer: 1,
    explanation: "Black Monday on October 19, 1987 saw the Dow Jones fall 22.6% in a single day — the largest single-day percentage drop in US market history. Despite this catastrophic drop, investors who stayed invested recovered all losses within two years. The crash was partly attributed to computer-driven program trading.",
  },
  {
    question: "What is the primary measure of US inflation?",
    options: [
      "GDP Deflator",
      "Producer Price Index (PPI)",
      "Consumer Price Index (CPI)",
      "Personal Consumption Expenditures (PCE)",
    ],
    answer: 2,
    explanation: "The Consumer Price Index (CPI) is the most commonly cited measure of inflation, tracking the price of a basket of consumer goods and services. The Federal Reserve actually targets the PCE (Personal Consumption Expenditures) index which tends to run slightly lower. The Fed's inflation target is 2% per year using PCE.",
  },
  {
    question: "What is the difference between a debit card and a credit card?",
    options: [
      "Debit cards offer rewards; credit cards do not",
      "Debit pulls money from your bank account; credit is borrowed money you repay",
      "Debit is for online purchases; credit is for in-person purchases",
      "Debit cards have no fees; credit cards always charge annual fees",
    ],
    answer: 1,
    explanation: "A debit card pulls money directly from your checking account in real time. A credit card allows you to borrow money from the card issuer and repay it later. Credit cards offer stronger fraud protections, rewards, and help build credit history — but only if you pay the full balance monthly to avoid interest charges averaging 21%.",
  },
  {
    question: "What is the average US credit card debt per household?",
    options: ["$3,400", "$6,200", "$8,900", "$12,300"],
    answer: 1,
    explanation: "The average US household carrying credit card debt owes approximately $6,200 according to Federal Reserve data. At a 21% interest rate, that costs about $1,300 per year in interest alone. Total US consumer credit card debt surpassed $1.1 trillion in 2024 — the first time it crossed that threshold.",
  },
  {
    question: "What is a Roth IRA income limit for single filers in 2024?",
    options: [
      "You earn over $100,000 annually",
      "You earn over $146,000 (phase-out begins)",
      "You earn over $200,000",
      "There is no income limit for Roth IRAs",
    ],
    answer: 1,
    explanation: "In 2024 the Roth IRA contribution phase-out begins at $146,000 for single filers and eliminates eligibility completely at $161,000. Married filers phase out between $230,000 and $240,000. Above these limits use the backdoor Roth strategy: contribute to a non-deductible traditional IRA then convert to Roth.",
  },
  {
    question: "What is the difference between good debt and bad debt?",
    options: [
      "Good debt is under 5%; bad debt is over 10%",
      "Good debt finances appreciating assets or increases income; bad debt finances depreciating consumption",
      "Good debt is secured; bad debt is unsecured",
      "Good debt is short-term; bad debt is long-term",
    ],
    answer: 1,
    explanation: "Good debt finances assets that appreciate or increase your earning power — mortgages on growing real estate, student loans for high-ROI degrees, or business loans. Bad debt finances consumption or depreciating assets — credit card balances, high-interest car loans, or buy-now-pay-later for clothing. The interest rate matters too, but the asset-vs-consumption distinction is the core principle.",
  },
  {
    question: "What is the average Social Security monthly benefit in 2024?",
    options: ["$1,050", "$1,350", "$1,900", "$2,400"],
    answer: 1,
    explanation: "The average Social Security retirement benefit was approximately $1,907 per month in 2024 according to the Social Security Administration. The maximum benefit for someone retiring at full retirement age in 2024 is $3,822/month. Social Security replaces about 40% of pre-retirement income for average earners — far below the 70-80% recommended replacement rate.",
  },
  {
    question: "What is the Latte Factor concept in personal finance?",
    options: [
      "Coffee shop investing clubs popular in the 1990s",
      "Small daily purchases that compound into large long-term costs",
      "The caffeine-productivity tradeoff in workplace economics",
      "A type of adjustable-rate mortgage popular in California",
    ],
    answer: 1,
    explanation: "The Latte Factor, coined by David Bach, illustrates how small daily purchases compound into large long-term costs. $6/day on coffee = $2,190/year = $219,000 over 30 years at 7% invested instead. The concept applies to any small recurring expense. Critics note it oversimplifies — systemic wealth barriers matter more than coffee for most people.",
  },
  {
    question: "What is inflation-adjusted return (real return)?",
    options: [
      "Return after paying taxes on gains",
      "Return after subtracting the inflation rate",
      "Return calculated using real estate assets",
      "The guaranteed portion of an annuity return",
    ],
    answer: 1,
    explanation: "Real return subtracts the inflation rate from your nominal investment return. If your portfolio earned 10% but inflation was 3%, your real return is approximately 7%. This matters because inflation erodes purchasing power. A savings account earning 1% when inflation is 3% is actually losing purchasing power at -2% per year.",
  },
  {
    question: "What is the Medicare tax rate for employees in 2024?",
    options: ["0.9%", "1.45%", "2.35%", "2.9%"],
    answer: 1,
    explanation: "The Medicare tax rate is 1.45% of all wages for employees, matched by 1.45% from employers for a combined 2.9%. High earners above $200,000 (single) or $250,000 (married) pay an additional 0.9% surtax on wages above those thresholds. Self-employed workers pay the full 2.9% themselves.",
  },
  {
    question: "What is dollar-cost averaging's main advantage?",
    options: [
      "It guarantees you always buy at the lowest price",
      "It removes the need to time the market and reduces the impact of volatility",
      "It doubles the return of any investment",
      "It eliminates taxes on investment gains",
    ],
    answer: 1,
    explanation: "Dollar-cost averaging's main advantage is removing the impossible task of timing the market. By investing a fixed amount regularly, you automatically buy more shares when prices are low and fewer when prices are high. Research shows most investors who try to time the market underperform those who invest consistently regardless of market conditions.",
  },
  {
    question: "What year did the Great Recession officially end in the US?",
    options: ["2008", "2009", "2010", "2011"],
    answer: 1,
    explanation: "The Great Recession officially ended in June 2009 according to the National Bureau of Economic Research, making it the longest US recession since World War II at 18 months. However recovery was slow — unemployment peaked at 10% in October 2009 and did not fully recover to pre-recession levels until 2016.",
  },
  {
    question: "What is a good debt-to-income ratio for personal finance health?",
    options: ["Below 15%", "Below 20%", "Below 36%", "Below 50%"],
    answer: 2,
    explanation: "A debt-to-income ratio below 36% is considered healthy by most financial planners, with the mortgage payment accounting for no more than 28% of gross income. Above 43% most mortgage lenders will not approve you. Above 50% indicates financial stress — most of your income is servicing debt leaving little room for saving or emergencies.",
  },
  {
    question: "What is the average cost of a 4-year public college education in 2024?",
    options: ["$25,000 total", "$45,000 total", "$46,400 per year", "$88,000 total"],
    answer: 2,
    explanation: "The average cost of attending a 4-year public college in 2024 is approximately $27,000 per year for in-state students including tuition, room, board, and fees — about $108,000 total for four years. Out-of-state costs average about $45,000 per year. Private non-profit colleges average $59,000 per year.",
  },
  {
    question: "What is passive income?",
    options: [
      "Income earned while sleeping",
      "Income earned with minimal ongoing effort after initial investment",
      "Income not reported to the IRS",
      "Income from government transfer payments",
    ],
    answer: 1,
    explanation: "Passive income is earned with minimal ongoing active effort after an initial time or money investment. Examples include rental income, dividends, royalties, and returns on index fund investments. True passive income usually requires significant upfront capital or work. Most 'passive income' gurus sell information products — a very active business.",
  },
  {
    question: "What is a reverse mortgage?",
    options: [
      "A mortgage where payments decrease over time",
      "A loan allowing homeowners 62+ to convert home equity to cash",
      "Paying extra principal to reduce the mortgage term",
      "A mortgage from a private lender instead of a bank",
    ],
    answer: 1,
    explanation: "A reverse mortgage allows homeowners aged 62 or older to borrow against their home equity without making monthly payments. The loan balance grows over time and is repaid when the borrower moves, sells, or dies. They can provide income in retirement but reduce the inheritance left to heirs and have significant fees.",
  },
  {
    question: "What is the average American's take-home pay after all taxes as a percentage of gross income?",
    options: ["55%", "68%", "75%", "82%"],
    answer: 1,
    explanation: "The average American takes home approximately 68–72% of gross income after federal, state, and FICA taxes. A $75,000 gross income in a moderate-tax state yields about $51,000–$54,000 take-home. High earners in high-tax states (like California or New York) can see effective rates above 40%, taking home less than 60% of gross income.",
  },
  {
    question: "What is a balance transfer credit card?",
    options: [
      "A card that automatically transfers your balance to savings each month",
      "A card offering a promotional low or 0% interest rate to move existing debt",
      "A card that converts rewards points to cash balance",
      "A business card for transferring funds between accounts",
    ],
    answer: 1,
    explanation: "A balance transfer card lets you move high-interest debt to a new card with a promotional 0% APR period — typically 12–21 months. This can save thousands in interest on large balances. Watch for balance transfer fees (typically 3–5% of the amount transferred) and what happens to the rate after the promotional period ends.",
  },
  {
    question: "What does the Dow Jones Industrial Average track?",
    options: [
      "All US publicly traded companies",
      "30 large US blue-chip companies",
      "The top 100 US companies by market cap",
      "US industrial and manufacturing companies only",
    ],
    answer: 1,
    explanation: "The Dow Jones Industrial Average (DJIA) tracks 30 large 'blue chip' US companies chosen by the editors of the Wall Street Journal. Despite the name, it includes companies from all industries. It is price-weighted (higher-priced stocks influence it more) unlike the S&P 500 which is market-cap weighted — making the S&P 500 a more representative market measure.",
  },
  {
    question: "What is the primary purpose of an umbrella insurance policy?",
    options: [
      "Covers all your insurance needs in one policy",
      "Provides extra liability coverage beyond your home and auto limits",
      "A policy that covers all weather-related damage",
      "Insurance for freelancers and self-employed people",
    ],
    answer: 1,
    explanation: "Umbrella insurance provides extra liability coverage — typically $1 million to $5 million — that kicks in when your home or auto liability limits are exceeded. If someone sues you for $2 million and your auto policy covers only $500,000, your umbrella covers the remaining $1.5 million. It typically costs $150–$300 per year for $1 million in coverage.",
  },
  {
    question: "What is a W-4 form used for?",
    options: [
      "Reporting freelance income over $600",
      "Telling your employer how much federal income tax to withhold",
      "Filing an amended tax return",
      "Reporting foreign income to the IRS",
    ],
    answer: 1,
    explanation: "The W-4 tells your employer how much federal income tax to withhold from each paycheck. If you claim too many allowances (now called adjustments), you get more money each paycheck but owe taxes in April. Too few and you overpay and get a refund. A large refund means you gave the government an interest-free loan all year.",
  },
  {
    question: "What is the average US household's monthly spending on subscriptions?",
    options: ["$86", "$133", "$219", "$340"],
    answer: 2,
    explanation: "Americans spend an average of $219 per month on subscriptions according to a 2024 survey — including streaming services, apps, gym memberships, and software. Most people underestimate their subscription spending by 40–50%. A subscription audit reviewing bank statements for recurring charges often finds $50–$100 in forgotten services to cancel.",
  },
  {
    question: "What is the difference between a tax deduction and a tax credit?",
    options: [
      "They are the same — both reduce taxes owed by the same amount",
      "A deduction reduces taxable income; a credit directly reduces taxes owed dollar-for-dollar",
      "A deduction is automatic; a credit requires an application",
      "A deduction helps lower income brackets more; credits help higher brackets",
    ],
    answer: 1,
    explanation: "A tax deduction reduces your taxable income — a $1,000 deduction saves you $220 if you are in the 22% bracket. A tax credit directly reduces your tax bill dollar-for-dollar — a $1,000 credit saves you exactly $1,000. Credits are more valuable. The Child Tax Credit ($2,000 per child in 2024) is one of the most valuable credits for families.",
  },
  {
    question: "What is the 'pay yourself first' principle?",
    options: [
      "Pay your own bills before your business expenses",
      "Automatically transfer savings before spending any income",
      "Negotiate salary increases before accepting raises",
      "Invest profits before paying employees",
    ],
    answer: 1,
    explanation: "Pay yourself first means automating savings transfers on payday before spending anything else. This removes the temptation to spend first and save whatever is left (which is usually nothing). Even $100/month automated to savings builds the habit and fund. Research shows people who automate savings save 3x more than those who save manually.",
  },
  {
    question: "What happened to the US stock market in March 2020?",
    options: [
      "It rose 20% due to fiscal stimulus",
      "It fell approximately 34% in 33 days — the fastest bear market in history",
      "It was closed for two weeks by the SEC",
      "It fell 10% and immediately recovered",
    ],
    answer: 1,
    explanation: "The COVID-19 crash saw the S&P 500 fall approximately 34% in 33 days from February 19 to March 23, 2020 — the fastest 30%+ decline in US market history. However markets then staged the fastest recovery in history, fully recovering to all-time highs by August 2020. Investors who panic-sold in March locked in massive losses.",
  },
  {
    question: "What is an annuity?",
    options: [
      "An annual interest payment from a savings account",
      "A contract with an insurance company providing regular income payments",
      "A type of government bond paying annual dividends",
      "A tax form for annual investment income",
    ],
    answer: 1,
    explanation: "An annuity is an insurance contract where you pay a lump sum or series of payments in exchange for regular income, either immediately or in the future. They can provide guaranteed lifetime income — solving the risk of outliving your money. However annuities are complex products with high fees and surrender charges. Fee-only financial advisors generally prefer income from diversified portfolios instead.",
  },
  {
    question: "What is the historical inflation rate for US college tuition over the past 30 years?",
    options: ["3% per year (matching overall inflation)", "5% per year", "8% per year", "College inflation has actually been negative"],
    answer: 2,
    explanation: "US college tuition has increased approximately 8% per year over the past 30 years — more than double the general inflation rate of about 3%. A 4-year degree at a public university cost an average of $10,000 in 1994. By 2024 that same degree costs approximately $110,000+. This is why student loan debt has ballooned to $1.7 trillion.",
  },
  {
    question: "What is a mutual fund?",
    options: [
      "A savings account where multiple people pool their money",
      "A pooled investment vehicle managed by a professional that holds many securities",
      "A type of government savings bond",
      "An account shared between spouses",
    ],
    answer: 1,
    explanation: "A mutual fund pools money from many investors and uses it to buy a diversified portfolio of stocks, bonds, or other securities. A professional fund manager decides what to buy and sell. Unlike ETFs, mutual funds price once per day after market close. Many mutual funds have high expense ratios that reduce long-term returns vs low-cost index funds.",
  },
  {
    question: "What is the average US annual healthcare cost per person?",
    options: ["$5,800", "$8,600", "$13,500", "$18,000"],
    answer: 2,
    explanation: "The US spends approximately $13,500 per person annually on healthcare — nearly twice the average of other developed nations. Total US healthcare spending exceeded $4.5 trillion in 2023, representing about 17.3% of GDP. Despite this spending the US has lower life expectancy than most peer nations.",
  },
  {
    question: "What is the approximate 10-year return of US real estate vs stocks?",
    options: [
      "Real estate: 15%, stocks: 10%",
      "Real estate: 5–7%, stocks: 10–12%",
      "They are roughly equal at 8–9% each",
      "Real estate: 12%, stocks: 8%",
    ],
    answer: 1,
    explanation: "Historically US stocks (S&P 500) have returned approximately 10–12% annually before inflation, while direct real estate investment has returned 5–7% annually not including leverage or rental income. However real estate with leverage (a mortgage) significantly amplifies returns — a 5% return on a property purchased with 20% down translates to a 25% return on cash invested.",
  },
  {
    question: "What is FICA and what percentage do employees pay?",
    options: [
      "Federal Insurance Contributions Act — 5.65% of wages",
      "Federal Insurance Contributions Act — 7.65% of wages",
      "Federal Income Credit Allocation — 6.2% of wages",
      "Financial Investment Contribution Agreement — 8.5% of wages",
    ],
    answer: 1,
    explanation: "FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare. Employees pay 7.65% of wages: 6.2% for Social Security (on wages up to $184,500 in 2026) and 1.45% for Medicare (no wage cap). Employers match the 7.65%, making the total FICA cost to the system 15.3% of wages.",
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff  = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

interface StoredState {
  lastPlayedKey: string
  streak: number
  totalPlayed: number
  totalCorrect: number
  answeredToday: boolean
  wasCorrect: boolean
}

function loadState(): StoredState {
  if (typeof window === "undefined") return { lastPlayedKey: "", streak: 0, totalPlayed: 0, totalCorrect: 0, answeredToday: false, wasCorrect: false }
  try {
    const raw = localStorage.getItem("dayblip-daily")
    if (!raw) return { lastPlayedKey: "", streak: 0, totalPlayed: 0, totalCorrect: 0, answeredToday: false, wasCorrect: false }
    return JSON.parse(raw) as StoredState
  } catch { return { lastPlayedKey: "", streak: 0, totalPlayed: 0, totalCorrect: 0, answeredToday: false, wasCorrect: false } }
}

function saveState(s: StoredState): void {
  if (typeof window === "undefined") return
  localStorage.setItem("dayblip-daily", JSON.stringify(s))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DailyPage() {
  const [answered,    setAnswered]    = useState<number | null>(null)
  const [stored,      setStored]      = useState<StoredState>({ lastPlayedKey: "", streak: 0, totalPlayed: 0, totalCorrect: 0, answeredToday: false, wasCorrect: false })
  const [dayOfYear,   setDayOfYear]   = useState(0)
  const [todayKey,    setTodayKey]    = useState("")
  const [puzzle,      setPuzzle]      = useState<Puzzle | null>(null)
  const [puzzleIndex, setPuzzleIndex] = useState(0)

  useEffect(() => {
    const today = new Date()
    const doy   = getDayOfYear(today)
    const key   = dateKey(today)
    const idx   = doy % PUZZLES.length
    setDayOfYear(doy)
    setTodayKey(key)
    setPuzzle(PUZZLES[idx])
    setPuzzleIndex(idx + 1)

    const s = loadState()
    // Check streak validity
    if (s.lastPlayedKey && s.answeredToday) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterKey = dateKey(yesterday)
      if (s.lastPlayedKey !== key && s.lastPlayedKey !== yesterKey) {
        s.streak = 0
        s.answeredToday = false
      }
      if (s.lastPlayedKey === key) {
        // Already played today — restore answer state
        setAnswered(s.wasCorrect ? puzzle?.answer ?? null : -1)
      }
    }
    setStored(s)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(idx: number) {
    if (answered !== null || !puzzle) return
    const correct = idx === puzzle.answer
    setAnswered(idx)

    const s    = loadState()
    const prev = s.lastPlayedKey
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterKey = dateKey(yesterday)

    const newStreak = prev === yesterKey || prev === todayKey ? s.streak + (prev === todayKey ? 0 : 1) : 1
    const next: StoredState = {
      lastPlayedKey: todayKey,
      streak:        newStreak,
      totalPlayed:   s.totalPlayed + (prev === todayKey ? 0 : 1),
      totalCorrect:  s.totalCorrect + (correct && prev !== todayKey ? 1 : 0),
      answeredToday: true,
      wasCorrect:    correct,
    }
    saveState(next)
    setStored(next)
  }

  const isCorrect = puzzle && answered !== null && answered === puzzle.answer
  const shareCorrect = `Dayblip Daily #${dayOfYear} ✅ I got it right — ${stored.streak} day streak! Can you beat me? Free daily financial puzzle — no signup: https://www.dayblip.com/daily`
  const shareWrong   = `Dayblip Daily #${dayOfYear} ❌ Got this one wrong — do you know the answer? Free daily financial quiz: https://www.dayblip.com/daily`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Dayblip Daily Financial Challenge",
          "One financial puzzle every day to test and build money knowledge",
          "https://www.dayblip.com/daily",
          "EducationalApplication"
        ),
        faqSchema([
          {
            question: "What is the Dayblip Daily challenge?",
            answer: "Dayblip Daily is a free financial knowledge puzzle posted every day. One multiple choice question covering personal finance, investing, taxes, retirement, or economic concepts. Takes under 2 minutes. Track your streak and share your score. A new puzzle appears every day at midnight. No account or signup required.",
          },
          {
            question: "How does the daily streak work?",
            answer: "Your streak counts consecutive days you have answered the daily puzzle. Answer today's puzzle and come back tomorrow to extend your streak. If you miss a day your streak resets to one. Streaks are tracked locally on your device — no account needed.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Dayblip Daily", url: "https://www.dayblip.com/daily" },
        ]),
      ]} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)", padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, lineHeight: 1.2, maxWidth: 700, margin: "0 auto 12px" }}>
          Dayblip Daily — Today&apos;s Financial Puzzle
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
          One question · Under 2 minutes · No signup · Share your streak
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 0" }}>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Dayblip Daily" },
        ]} />

        {/* Quick Answer */}
        <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Financial literacy directly impacts wealth. People who score in the top third of financial literacy tests
            accumulate nearly three times more wealth by retirement than those in the bottom third according to research
            by Lusardi and Mitchell. Testing your financial knowledge daily is one of the most effective ways to build
            the understanding that leads to better money decisions.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
          Dayblip Daily is a free financial puzzle posted every day. One question testing your knowledge of personal
          finance, investing, economics, or money history. Takes under 2 minutes. Share your streak and score with
          friends. A new puzzle appears every day at midnight.
        </p>
      </div>

      {/* Puzzle card */}
      <div style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {puzzle && (
            <>
              {/* Metadata row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ background: "#0f3460", color: "#4FC3F7", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                    Day {dayOfYear} — Puzzle #{puzzleIndex}
                  </span>
                  <span style={{ background: "#1a1a2e", color: "#F9A825", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                    🔥 {stored.streak} day streak
                  </span>
                </div>
                {stored.totalPlayed > 0 && (
                  <span style={{ color: "#a8a8b3", fontSize: 13 }}>
                    ✅ {stored.totalCorrect}/{stored.totalPlayed} correct
                  </span>
                )}
              </div>

              {/* Question */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
                <p style={{ color: "#ffffff", fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                  {puzzle.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {puzzle.options.map((opt, i) => {
                  const label = ["A", "B", "C", "D"][i]
                  const isSelected  = answered === i
                  const isCorrectAns = i === puzzle.answer
                  let bg = "#1a1a2e"
                  let border = "1px solid #0f3460"
                  let textColor = "#e8e8e8"
                  if (answered !== null) {
                    if (isCorrectAns) { bg = "#0d2a1a"; border = "2px solid #22c55e"; textColor = "#22c55e" }
                    else if (isSelected && !isCorrectAns) { bg = "#2a0d0d"; border = "2px solid #e94560"; textColor = "#e94560" }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered !== null}
                      style={{
                        background: bg, border, borderRadius: 10,
                        padding: "14px 18px", textAlign: "left", cursor: answered !== null ? "default" : "pointer",
                        display: "flex", alignItems: "flex-start", gap: 12,
                        transition: "all 0.15s",
                        opacity: answered !== null && !isSelected && !isCorrectAns ? 0.5 : 1,
                      }}
                    >
                      <span style={{ color: "#4FC3F7", fontWeight: 800, fontSize: 14, minWidth: 20 }}>{label})</span>
                      <span style={{ color: textColor, fontSize: 15, lineHeight: 1.5 }}>{opt}</span>
                      {answered !== null && isCorrectAns && (
                        <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: 18 }}>✓</span>
                      )}
                      {answered !== null && isSelected && !isCorrectAns && (
                        <span style={{ marginLeft: "auto", color: "#e94560", fontSize: 18 }}>✗</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Result */}
              {answered !== null && (
                <div>
                  <div style={{
                    background: isCorrect ? "#0d2a1a" : "#2a0d0d",
                    border: `1px solid ${isCorrect ? "#22c55e" : "#e94560"}`,
                    borderRadius: 12, padding: "16px 20px", marginBottom: 16,
                  }}>
                    <div style={{ color: isCorrect ? "#22c55e" : "#e94560", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                      {isCorrect ? "✅ Correct!" : `❌ The answer is ${["A", "B", "C", "D"][puzzle.answer]})`}
                    </div>
                    <p style={{ color: "#e8e8e8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {puzzle.explanation}
                    </p>
                  </div>

                  <div style={{ background: "#1e2d4a", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ color: "#a8a8b3", fontSize: 14 }}>
                      📅 Come back tomorrow for the next puzzle
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ color: "#F9A825", fontWeight: 700, fontSize: 14 }}>🔥 {stored.streak} day streak</span>
                      <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>✅ {stored.totalCorrect}/{stored.totalPlayed}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Share + Related */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 48px" }}>
        <ShareButtons
          text={answered !== null ? (isCorrect ? shareCorrect : shareWrong) : "Test your financial knowledge with Dayblip Daily — one free puzzle every day. No signup:"}
          url="https://www.dayblip.com/daily"
          title="Dayblip Daily Financial Challenge"
        />
        <div style={{ marginTop: 40 }}>
          <RelatedTools tools={[
            { emoji: "💯", title: "Financial Life Score",  desc: "Rate your overall financial health",          href: "/tools/financial-life-score" },
            { emoji: "🤖", title: "AI Job Score",          desc: "How AI-proof is your career?",                href: "/tools/ai-job-score" },
            { emoji: "🧠", title: "IQ Estimate Quiz",      desc: "10-question reasoning quiz",                  href: "/curiosity/iq-estimate" },
            { emoji: "🧬", title: "Generation Quiz",       desc: "What generation do you really belong to?",    href: "/tools/generation-quiz" },
          ]} />
        </div>
      </div>
    </div>
  )
}
