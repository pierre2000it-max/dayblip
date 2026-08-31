import type { MetadataRoute } from "next";
import holidaysData from "@/data/holidays.json";
import onThisDayData from "@/data/onThisDay.json";
import { getAllSalarySlugs, SALARY_DATA } from "@/data/salary-data";
import { cities } from "@/data/cost-of-living";

const BASE     = "https://www.dayblip.com";
const holidays = holidaysData as Array<{ slug: string }>;
const otdKeys  = Object.keys(onThisDayData as Record<string, unknown>);

const DAILY   = "daily"   as const;
const WEEKLY  = "weekly"  as const;
const MONTHLY = "monthly" as const;
const YEARLY  = "yearly"  as const;

type SitemapEntry = MetadataRoute.Sitemap[number];

function p(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = MONTHLY,
): SitemapEntry {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {

  // ── Dynamic: all holiday countdowns (from holidays.json) ──────────────────
  const countdownUrls: MetadataRoute.Sitemap = holidays.map((h) => ({
    url:             `${BASE}/days-until/${h.slug}`,
    lastModified:    new Date(),
    changeFrequency: DAILY,
    priority:        0.9,
  }));

  // ── Dynamic: born-in 1940–2020 (81 pages) ────────────────────────────────
  const bornInUrls: MetadataRoute.Sitemap = Array.from({ length: 81 }, (_, i) => ({
    url:             `${BASE}/born-in/${1940 + i}`,
    lastModified:    new Date(),
    changeFrequency: MONTHLY,
    priority:        0.8,
  }));

  // ── Dynamic: all on-this-day pages (from onThisDay.json) ─────────────────
  const otdUrls: MetadataRoute.Sitemap = otdKeys.map((key) => ({
    url:             `${BASE}/on-this-day/${key}`,
    lastModified:    new Date(),
    changeFrequency: WEEKLY,
    priority:        0.8,
  }));

  // ── Static on-this-day spotlight dates (ensures indexed even if not in JSON)
  const OTD_SPOTLIGHT = [
    "january-1","january-15","january-20","february-2","february-14",
    "march-14","march-17","april-15","june-6","july-4",
    "august-6","september-11","october-31","november-22",
    "december-25","december-31",
  ];
  // de-dupe against dynamic set
  const otdDynSet = new Set(otdKeys);
  const otdSpotlight: MetadataRoute.Sitemap = OTD_SPOTLIGHT
    .filter((d) => !otdDynSet.has(d))
    .map((d) => ({
      url:             `${BASE}/on-this-day/${d}`,
      lastModified:    new Date(),
      changeFrequency: WEEKLY,
      priority:        0.8,
    }));

  return [

    // ═══════════════════════════════════════════════════════════════════════
    // CORE LANDING PAGES  (priority 1.0, daily)
    // ═══════════════════════════════════════════════════════════════════════
    p("/",                              1.0, DAILY),
    p("/born-in",                       1.0, DAILY),
    p("/on-this-day",                   1.0, WEEKLY),
    p("/research",                      0.9, MONTHLY),
    p("/research/paycheck-report-2026", 0.9, MONTHLY),
    p("/research/weekends-you-have-left", 0.8, MONTHLY),
    p("/research/how-many-mondays-left",  0.8, MONTHLY),
    p("/finance",                       1.0, MONTHLY),
    p("/health",       1.0, MONTHLY),
    p("/real-estate",  1.0, MONTHLY),
    p("/productivity", 1.0, MONTHLY),
    p("/curiosity",    1.0, MONTHLY),
    p("/tools",        1.0, MONTHLY),
    p("/zip-score",    0.9, WEEKLY),
    p("/countdown",    0.6, MONTHLY),
    p("/embed",                0.8),
    p("/embed/for-educators",  0.7),

    // ═══════════════════════════════════════════════════════════════════════
    // CORE DATE & AGE TOOLS  (priority 0.9, weekly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/age-calculator",   0.9, WEEKLY),
    p("/date-calculator",  0.9, WEEKLY),
    p("/days-between",     0.9, WEEKLY),
    p("/celebrity-age",    0.9, WEEKLY),
    p("/birthday-countdown", 0.9, WEEKLY),

    // ═══════════════════════════════════════════════════════════════════════
    // HARDCODED COUNTDOWN SPOTLIGHT PAGES  (priority 0.9, daily)
    // ═══════════════════════════════════════════════════════════════════════
    p("/days-until/christmas",       0.9, DAILY),
    p("/days-until/halloween",       0.9, DAILY),
    p("/days-until/thanksgiving",    0.9, DAILY),
    p("/days-until/new-years",       0.9, DAILY),
    p("/days-until/valentines-day",  0.9, DAILY),
    p("/days-until/st-patricks-day", 0.9, DAILY),
    p("/days-until/easter",          0.9, DAILY),
    p("/days-until/independence-day",0.9, DAILY),
    p("/days-until/black-friday",    0.9, DAILY),
    p("/days-until/mothers-day",     0.9, DAILY),
    p("/days-until/fathers-day",     0.85, WEEKLY),
    p("/days-until/labor-day",       0.85, WEEKLY),
    p("/days-until/memorial-day",    0.85, WEEKLY),
    p("/days-until/new-years-eve",   0.85, WEEKLY),

    // ═══════════════════════════════════════════════════════════════════════
    // SPORTS COUNTDOWNS  (priority 0.8, weekly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/days-until/super-bowl",     0.6, MONTHLY),
    p("/days-until/world-cup",      0.5, MONTHLY),
    p("/days-until/world-series",   0.8, WEEKLY),
    p("/days-until/march-madness",  0.6, MONTHLY),
    p("/days-until/nba-finals",     0.6, MONTHLY),

    // ═══════════════════════════════════════════════════════════════════════
    // FINANCE CALCULATORS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/finance/compound-interest",   0.9),
    p("/finance/retirement-savings",  0.9),
    p("/finance/mortgage-calculator", 0.9),
    p("/finance/debt-payoff",         0.9),
    p("/finance/net-worth",           0.9),
    p("/finance/inflation",           0.9),
    p("/finance/401k-calculator",     0.9),
    p("/finance/emergency-fund",      0.9),
    p("/finance/social-security",     0.9),
    p("/finance/student-loan",        0.9),
    p("/finance/freelancer-rate",     0.9),
    p("/finance/take-home-pay",       0.9),
    p("/finance/tax-bracket",         0.9),
    p("/finance/self-employment-tax", 0.9),
    p("/finance/savings-goal",        0.9),
    p("/finance/budget-calculator",   0.9),
    p("/finance/car-affordability",   0.9),
    p("/finance/college-savings",     0.9),
    p("/finance/break-even",          0.9),
    p("/finance/profit-margin",       0.9),
    p("/finance/capital-gains",       0.9),
    p("/finance/stock-return",        0.9),
    p("/finance/cost-of-living",      0.9),
    p("/finance/overtime-tax",        0.9),
    p("/finance/overtime-calculator", 0.9),
    p("/finance/paycheck-calculator",    0.9),
    p("/finance/what-if-i-invested",     0.9),
    p("/finance/first-paycheck",         0.9),
    p("/finance/holiday-budget",         0.9),

    // ═══════════════════════════════════════════════════════════════════════
    // EDUCATION CALCULATORS  (priority 0.9, monthly) — Phase 2
    // ═══════════════════════════════════════════════════════════════════════
    p("/education",                   0.9),
    p("/education/gpa-calculator",    0.9),
    p("/education/grade-calculator",  0.9),

    // ═══════════════════════════════════════════════════════════════════════
    // LIFE & MONEY INSIGHT TOOLS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/tools/american-dream-calculator", 0.9),
    p("/tools/financial-life-score",     0.9),
    p("/time-machine",                   0.9),
    p("/tools/minimum-payment",         0.9),
    p("/tools/early-vs-late",           0.9),
    p("/tools/market-timing",           0.9),
    p("/tools/sleep-debt",              0.9),
    p("/tools/tip-calculator",          0.9),
    p("/tools/currency-converter",      0.9),
    p("/tools/unit-converter",          0.9),
    p("/tools/timezone-converter",      0.8),
    p("/tools/percentage-calculator",   0.8),
    p("/tools/reading-time",            0.8),
    p("/tools/password-strength",       0.8),
    p("/tools/smoking-cost",            0.9),
    p("/tools/college-roi",            0.9),
    p("/tools/wfh-calculator",         0.9),
    p("/tools/recession-score",        0.9),
    p("/tools/ai-job-score",          0.9),
    p("/tools/fi-date",               0.9),
    p("/tools/salary-negotiation",    0.9),
    p("/tools/side-hustle",           0.9),
    p("/tools/salary-checker",      0.9),
    p("/tools/stock-calculator",    0.9),
    p("/tools/tax-migration",       0.9),
    p("/tools/job-offer-comparison",           0.9),
    p("/tools/relationship-calculator",        0.9),
    p("/tools/money-transfer-comparison",      0.9),
    p("/tools/life-insurance-calculator",      0.9),
    p("/daily",                                0.9, DAILY),
    p("/tools/generation-compare",             0.9),
    p("/tools/cost-of-living",      0.9),
    p("/tools/true-hourly-wage",    0.9),
    p("/tools/career-timeline",     0.9),
    p("/tools/mortgage-by-year",    0.9),
    p("/tools/debt-freedom",        0.9),
    p("/tools/generational-wealth", 0.9),
    p("/tools/car-true-cost",       0.9),
    p("/tools/procrastination-cost",0.9),
    p("/tools/life-in-weeks",         0.85),
    p("/tools/life-in-numbers",       0.85),
    p("/tools/birthday-personality",  0.85),
    p("/tools/generation-quiz",       0.85),
    p("/tools/regret-minimization",   0.85),
    p("/tools/time-wasted",           0.85),
    p("/tools/privilege-calculator",  0.85),
    p("/tools/compound-kindness",     0.85),
    p("/tools/music-of-your-year",    0.85),
    p("/tools/learning-calculator",   0.85),
    p("/tools/freelancer-hub",        0.8),
    p("/tools/retirement-hub",        0.8),
    p("/tools/debt-hub",              0.8),
    p("/tools/time-with-parents",     0.8),
    p("/tools/time-with-kids",        0.8),
    p("/tools/time-with-pet",         0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // TAX TOOLS  (priority 0.8, yearly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/tools/tax-refund-estimator", 0.8, YEARLY),

    // ═══════════════════════════════════════════════════════════════════════
    // IS IT WORTH IT? SERIES  (priority 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/tools/is-it-worth-it",                        0.8),
    p("/tools/is-it-worth-it/buy-vs-rent",            0.8),
    p("/tools/is-it-worth-it/lease-vs-buy-car",       0.8),
    p("/tools/is-it-worth-it/degree-vs-bootcamp",     0.8),
    p("/tools/is-it-worth-it/gym-membership",         0.8),
    p("/tools/is-it-worth-it/cable-vs-streaming",     0.8),
    p("/tools/is-it-worth-it/black-friday-deal",      0.8),
    p("/tools/new-year-resolution-cost",              0.9),
    p("/tools/where-you-rank",                        0.85),
    p("/tools/couple-compatibility",                  0.85),
    p("/tools/this-year-progress",                    0.85),
    p("/tools/misconceptions",                        0.7),

    // ═══════════════════════════════════════════════════════════════════════
    // HEALTH CALCULATORS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/health/life-expectancy",       0.9),
    p("/health/bmi-calculator",        0.9),
    p("/health/habit-cost",            0.9),
    p("/health/life-insurance",        0.9),
    p("/health/calorie-calculator",    0.8),
    p("/health/water-intake",          0.8),
    p("/health/heart-rate",            0.8),
    p("/health/alcohol-cost",          0.8),
    p("/health/due-date-calculator",   0.8),
    p("/health/body-fat",              0.8),
    p("/health/macro-calculator",      0.8),
    p("/health/sleep-calculator",      0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // REAL ESTATE CALCULATORS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/real-estate/rent-vs-buy",   0.9),
    p("/real-estate/home-value",    0.9),
    p("/real-estate/affordability", 0.9),

    // ═══════════════════════════════════════════════════════════════════════
    // PRODUCTIVITY TOOLS  (priority 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/productivity/work-hours",        0.8),
    p("/productivity/meeting-cost",      0.8),
    p("/productivity/salary-calculator", 0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // WORLD LIVE COUNTERS  (priority 0.85, daily)
    // ═══════════════════════════════════════════════════════════════════════
    p("/world-counters",                          0.85, DAILY),
    p("/world-counters/population",              0.85, DAILY),
    p("/world-counters/us-debt",                 0.85, DAILY),
    p("/world-counters/births-today",            0.85, DAILY),
    p("/world-counters/co2-emissions",           0.85, DAILY),
    p("/world-counters/money-printed-today",     0.85, DAILY),
    p("/world-counters/plastic-in-ocean",        0.85, DAILY),
    p("/world-counters/trees-cut-today",         0.85, DAILY),
    p("/world-counters/earthquakes-today",       0.85, DAILY),
    p("/world-counters/us-population",           0.85, DAILY),

    // ═══════════════════════════════════════════════════════════════════════
    // CURIOSITY / OPPORTUNITY-COST CALCULATORS  (priority 0.85, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/curiosity/subscriptions",      0.85),
    p("/curiosity/latte-factor",       0.85),
    p("/curiosity/smoking-investment", 0.85),
    p("/curiosity/dining-out",         0.85),
    p("/curiosity/lottery",            0.85),
    p("/curiosity/car-upgrade",        0.85),
    p("/curiosity/impulse-shopping",   0.85),
    p("/curiosity/phone-upgrade",      0.85),
    p("/curiosity/side-hustle",        0.85),
    p("/curiosity/gym-membership",     0.85),

    // Phase 4 — Curiosity viral calculators
    p("/curiosity/numerology",         0.8),
    p("/curiosity/chinese-zodiac",     0.8),
    p("/curiosity/compatibility",      0.8),
    p("/curiosity/iq-estimate",        0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // LIFE & PERSONAL TOOLS  (priority 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/life-progress",        0.8),
    p("/days-alive",           0.8),
    p("/baby-age",             0.8),
    p("/retirement-countdown", 0.8),
    p("/weekends-left",        0.8),
    p("/couples-countdown",    0.8),
    p("/anniversary",          0.8),
    p("/school-countdown",     0.8),
    p("/resolution-tracker",   0.8),
    p("/time-capsule",         0.8),
    p("/star-sign",            0.8),
    p("/full-moons",           0.8),
    p("/birthday-now",         0.8),
    p("/birthday-twins",       0.8),
    p("/number-one-song",      0.8),
    p("/birthday-weather",     0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // GAMES & QUIZZES  (priority 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/history-quiz",       0.8),
    p("/decade-quiz",        0.8),
    p("/daily-trivia",       0.8, DAILY),
    p("/guess-the-year",     0.8),
    p("/how-long-ago",       0.8),
    p("/famous-or-fictional",0.8),
    p("/timeline-builder",   0.8),
    p("/name-that-decade",   0.8),
    p("/fact-spinner",       0.8),
    p("/older-than",         0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // FUN & VIRAL TOOLS  (priority 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/age-facts",           0.8),
    p("/world-countdowns",    0.8, DAILY),
    p("/this-day-in-my-life", 0.8),
    p("/earth-orbits",        0.8),
    p("/world-population",    0.8),
    p("/birth-number",        0.8),
    p("/time-spent",          0.8),
    p("/day-of-year",         0.8),
    p("/week-number",         0.8),
    p("/what-generation",     0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // HISTORY & WORLD  (priority 0.8, monthly/weekly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/days-since",          0.8),
    p("/country-history",     0.8),
    p("/science-today",       0.8, DAILY),
    p("/presidents",          0.8),
    p("/how-long-to-build",   0.8),
    p("/world-records",       0.8),
    p("/price-history",       0.8),
    p("/tech-nostalgia",      0.8),
    p("/newspaper",           0.8),
    p("/this-week-in-history",0.8, WEEKLY),
    p("/oldest-things",       0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // ADDITIONAL DATE TOOLS
    // ═══════════════════════════════════════════════════════════════════════
    p("/days-until",          0.9, DAILY),
    p("/days-between",        0.9, WEEKLY),  // also in core, deduplicated by Next.js
    p("/days-since",          0.8),          // appears in multiple sections — fine
    p("/day-of-year",         0.8),
    p("/week-number",         0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // BLOG  (priority 0.9 / 0.8, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/blog",                                      0.9, MONTHLY),
    p("/blog/true-hourly-wage",                     0.8, MONTHLY),
    p("/blog/will-ai-replace-my-job",               0.8, MONTHLY),
    p("/blog/minimum-payment-true-cost",            0.8, MONTHLY),
    p("/blog/compound-interest-early-saver",        0.8, MONTHLY),
    p("/blog/market-timing-cost",                   0.8, MONTHLY),
    p("/blog/financial-independence-date",          0.8, MONTHLY),
    p("/blog/salary-negotiation-guide",             0.8, MONTHLY),
    p("/blog/life-in-weeks",                        0.8, MONTHLY),
    p("/blog/born-in-your-year",                    0.8, MONTHLY),
    p("/blog/true-cost-of-smoking",                 0.8, MONTHLY),
    p("/blog/true-cost-of-car-ownership",           0.8, MONTHLY),
    p("/blog/rent-vs-buy-calculator",               0.8, MONTHLY),
    p("/blog/name-popularity",                      0.8, MONTHLY),
    p("/blog/no-tax-on-overtime-2026",              0.8, MONTHLY),
    p("/blog/what-is-net-worth",                    0.8, MONTHLY),
    p("/blog/how-much-house-can-you-afford",        0.8, MONTHLY),
    p("/blog/the-4-percent-rule",                   0.8, MONTHLY),
    p("/blog/roth-ira-vs-traditional-ira",          0.8, MONTHLY),
    p("/blog/what-your-paycheck-shows-you",         0.8, MONTHLY),
    p("/blog/how-much-saved-by-age",                0.8, MONTHLY),
    p("/blog/wfh-financial-value",                  0.8, MONTHLY),
    p("/blog/paycheck-by-state-2026",              0.8, MONTHLY),
    p("/blog/moving-states-tax-savings",           0.8, MONTHLY),
    p("/blog/average-salary-by-age",               0.8, MONTHLY),
    p("/blog/is-college-worth-it",                 0.8, MONTHLY),
    p("/blog/how-much-to-save-in-401k",            0.8, MONTHLY),
    p("/blog/true-cost-of-commuting",              0.8, MONTHLY),
    p("/blog/how-to-build-emergency-fund",         0.8, MONTHLY),
    p("/blog/true-cost-of-minimum-payments",       0.8, MONTHLY),
    p("/blog/what-is-a-hysa",                      0.8, MONTHLY),
    p("/blog/how-to-read-your-w2",                 0.8, MONTHLY),
    p("/blog/renting-vs-buying-2026",              0.8, MONTHLY),
    p("/blog/what-is-a-roth-ira",                  0.8, MONTHLY),
    p("/blog/how-much-house-can-i-afford",         0.8, MONTHLY),
    p("/blog/cost-of-raising-a-child-2026",       0.8, MONTHLY),
    p("/blog/debt-avalanche-vs-snowball",          0.8, MONTHLY),
    p("/blog/true-cost-of-owning-a-pet",          0.8, MONTHLY),
    p("/blog/what-is-the-4-percent-rule",         0.8, MONTHLY),
    p("/blog/how-much-does-a-wedding-cost",       0.8, MONTHLY),
    p("/blog/how-to-compare-job-offers",          0.8, MONTHLY),
    p("/blog/true-cost-of-student-loans",         0.8, MONTHLY),

    // ═══════════════════════════════════════════════════════════════════════
    // LEGAL PAGES  (priority 0.3, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/about",       0.7, YEARLY),
    p("/privacy",     0.3),
    p("/terms",       0.3),
    p("/disclosure",  0.3, YEARLY),
    p("/contact",     0.3),

    // ═══════════════════════════════════════════════════════════════════════
    // DYNAMIC URL SETS
    // ═══════════════════════════════════════════════════════════════════════
    ...countdownUrls,   // all holidays from holidays.json  (daily, 0.9)
    ...bornInUrls,      // born-in/1940 through born-in/2020 (monthly, 0.8)
    ...otdUrls,         // all on-this-day dates from onThisDay.json (weekly, 0.8)
    ...otdSpotlight,    // spotlight dates not already in JSON (weekly, 0.8)

    // ═══════════════════════════════════════════════════════════════════════
    // COMPARE PAGES  (priority 0.8, monthly) — city vs city + job vs job
    // ═══════════════════════════════════════════════════════════════════════
    p("/compare", 0.8, MONTHLY),
    ...(() => {
      const slugs: string[] = []
      for (let i = 0; i < cities.length; i++) {
        for (let j = i + 1; j < cities.length; j++) {
          slugs.push(`${cities[i].slug}-vs-${cities[j].slug}`)
        }
      }
      for (let i = 0; i < SALARY_DATA.length; i++) {
        for (let j = i + 1; j < SALARY_DATA.length; j++) {
          slugs.push(`${SALARY_DATA[i].slug}-vs-${SALARY_DATA[j].slug}`)
        }
      }
      return slugs.map((slug) => ({
        url:             `${BASE}/compare/${slug}`,
        lastModified:    new Date(),
        changeFrequency: MONTHLY,
        priority:        0.8,
      }))
    })(),

    // ═══════════════════════════════════════════════════════════════════════
    // SALARY PAGES  (priority 0.8, monthly) — 40 jobs × 50 states = 2,000
    // ═══════════════════════════════════════════════════════════════════════
    p("/salary", 0.8, MONTHLY),
    ...getAllSalarySlugs().map((slug) => ({
      url:             `${BASE}/salary/${slug}`,
      lastModified:    new Date(),
      changeFrequency: MONTHLY,
      priority:        0.8,
    })),
  ];
}
