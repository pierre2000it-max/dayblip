import type { MetadataRoute } from "next";
import holidaysData from "@/data/holidays.json";
import onThisDayData from "@/data/onThisDay.json";

const BASE     = "https://www.dayblip.com";
const holidays = holidaysData as Array<{ slug: string }>;
const otdKeys  = Object.keys(onThisDayData as Record<string, unknown>);

const DAILY   = "daily"   as const;
const WEEKLY  = "weekly"  as const;
const MONTHLY = "monthly" as const;

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
    p("/",             1.0, DAILY),
    p("/born-in",      1.0, DAILY),
    p("/on-this-day",  1.0, WEEKLY),
    p("/finance",      1.0, MONTHLY),
    p("/health",       1.0, MONTHLY),
    p("/real-estate",  1.0, MONTHLY),
    p("/productivity", 1.0, MONTHLY),
    p("/curiosity",    1.0, MONTHLY),
    p("/tools",        1.0, MONTHLY),

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

    // ═══════════════════════════════════════════════════════════════════════
    // LIFE & MONEY INSIGHT TOOLS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════════════
    // HEALTH CALCULATORS  (priority 0.9, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/health/life-expectancy", 0.9),
    p("/health/bmi-calculator",  0.9),
    p("/health/habit-cost",      0.9),
    p("/health/life-insurance",  0.9),

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
    p("/world-counters",               0.85, DAILY),
    p("/world-counters/population",    0.85, DAILY),
    p("/world-counters/us-debt",       0.85, DAILY),
    p("/world-counters/births-today",  0.85, DAILY),

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
    p("/days-until",          0.8, DAILY),
    p("/days-between",        0.9, WEEKLY),  // also in core, deduplicated by Next.js
    p("/days-since",          0.8),          // appears in multiple sections — fine
    p("/day-of-year",         0.8),
    p("/week-number",         0.8),

    // ═══════════════════════════════════════════════════════════════════════
    // LEGAL PAGES  (priority 0.3, monthly)
    // ═══════════════════════════════════════════════════════════════════════
    p("/privacy", 0.3),
    p("/terms",   0.3),
    p("/contact", 0.3),

    // ═══════════════════════════════════════════════════════════════════════
    // DYNAMIC URL SETS
    // ═══════════════════════════════════════════════════════════════════════
    ...countdownUrls,   // all holidays from holidays.json  (daily, 0.9)
    ...bornInUrls,      // born-in/1940 through born-in/2020 (monthly, 0.8)
    ...otdUrls,         // all on-this-day dates from onThisDay.json (weekly, 0.8)
    ...otdSpotlight,    // spotlight dates not already in JSON (weekly, 0.8)
  ];
}
