import type { MetadataRoute } from "next";
import holidaysData from "@/data/holidays.json";
import onThisDayData from "@/data/onThisDay.json";

const BASE = "https://dayblip.com";

const holidays = holidaysData as Array<{ slug: string }>;
const otdKeys  = Object.keys(onThisDayData as Record<string, unknown>);

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHLY = "monthly" as const;
const DAILY   = "daily"   as const;
const WEEKLY  = "weekly"  as const;

function page(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = MONTHLY,
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {

  // ── Dynamic: countdowns ────────────────────────────────────────────────────
  const countdownUrls: MetadataRoute.Sitemap = holidays.map((h) => ({
    url:             `${BASE}/days-until/${h.slug}`,
    lastModified:    new Date(),
    changeFrequency: DAILY,
    priority:        0.9,
  }));

  // ── Dynamic: born-in 1940–2020 ────────────────────────────────────────────
  const bornInUrls: MetadataRoute.Sitemap = Array.from({ length: 81 }, (_, i) => ({
    url:             `${BASE}/born-in/${1940 + i}`,
    lastModified:    new Date(),
    changeFrequency: MONTHLY,
    priority:        0.8,
  }));

  // ── Dynamic: on-this-day ──────────────────────────────────────────────────
  const otdUrls: MetadataRoute.Sitemap = otdKeys.map((key) => ({
    url:             `${BASE}/on-this-day/${key}`,
    lastModified:    new Date(),
    changeFrequency: WEEKLY,
    priority:        0.8,
  }));

  return [
    // ── Core / homepage ──────────────────────────────────────────────────────
    page("/",                    1.0, DAILY),

    // ── Date & age tools ─────────────────────────────────────────────────────
    page("/age-calculator",      0.9),
    page("/date-calculator",     0.9),
    page("/days-between",        0.9),
    page("/days-alive",          0.8),
    page("/days-since",          0.8),
    page("/days-until",          0.8),
    page("/day-of-year",         0.7),
    page("/week-number",         0.7),

    // ── Born In landing ───────────────────────────────────────────────────────
    page("/born-in",             0.9),

    // ── On This Day landing ───────────────────────────────────────────────────
    page("/on-this-day/january-1", 0.8, WEEKLY),

    // ── Finance landing & calculators ─────────────────────────────────────────
    page("/finance",                        0.9),
    page("/finance/compound-interest",      0.9),
    page("/finance/retirement-savings",     0.9),
    page("/finance/mortgage-calculator",    0.9),
    page("/finance/debt-payoff",            0.9),
    page("/finance/net-worth",              0.9),
    page("/finance/inflation",              0.9),
    page("/finance/401k-calculator",        0.9),
    page("/finance/emergency-fund",         0.9),
    page("/finance/social-security",        0.9),
    page("/finance/student-loan",           0.9),

    // ── Health landing & calculators ──────────────────────────────────────────
    page("/health",                         0.9),
    page("/health/life-expectancy",         0.9),
    page("/health/bmi-calculator",          0.9),
    page("/health/habit-cost",              0.9),
    page("/health/life-insurance",          0.9),

    // ── Real estate landing & calculators ─────────────────────────────────────
    page("/real-estate",                    0.9),
    page("/real-estate/rent-vs-buy",        0.9),
    page("/real-estate/home-value",         0.9),
    page("/real-estate/affordability",      0.9),

    // ── Productivity landing & calculators ────────────────────────────────────
    page("/productivity",                   0.9),
    page("/productivity/work-hours",        0.9),
    page("/productivity/meeting-cost",      0.9),
    page("/productivity/salary-calculator", 0.9),

    // ── Birthday & personal tools ─────────────────────────────────────────────
    page("/birthday-countdown",  0.8),
    page("/birthday-twins",      0.8),
    page("/birthday-weather",    0.7),
    page("/birthday-now",        0.7),
    page("/age-facts",           0.7),
    page("/older-than",          0.7),
    page("/baby-age",            0.7),
    page("/birth-number",        0.7),
    page("/star-sign",           0.7),
    page("/full-moons",          0.7),

    // ── Life & personal calculators ───────────────────────────────────────────
    page("/life-progress",       0.8),
    page("/time-spent",          0.7),
    page("/this-day-in-my-life", 0.7),
    page("/time-capsule",        0.7),
    page("/resolution-tracker",  0.7),
    page("/school-countdown",    0.7),
    page("/retirement-countdown",0.7),
    page("/anniversary",         0.7),
    page("/couples-countdown",   0.7),
    page("/weekends-left",       0.7),

    // ── History & world ───────────────────────────────────────────────────────
    page("/on-this-day/january-1", 0.8, WEEKLY),
    page("/this-week-in-history",  0.8, WEEKLY),
    page("/days-since",            0.8),
    page("/country-history",       0.7),
    page("/science-today",         0.7, DAILY),
    page("/presidents",            0.7),
    page("/how-long-to-build",     0.7),
    page("/world-records",         0.7),
    page("/price-history",         0.7),
    page("/tech-nostalgia",        0.7),
    page("/newspaper",             0.7),
    page("/oldest-things",         0.7),
    page("/world-countdowns",      0.7, DAILY),
    page("/world-population",      0.7),

    // ── Games & quizzes ───────────────────────────────────────────────────────
    page("/history-quiz",          0.8),
    page("/decade-quiz",           0.8),
    page("/daily-trivia",          0.8, DAILY),
    page("/guess-the-year",        0.8),
    page("/how-long-ago",          0.7),
    page("/famous-or-fictional",   0.7),
    page("/timeline-builder",      0.7),
    page("/name-that-decade",      0.7),

    // ── Fun & viral ───────────────────────────────────────────────────────────
    page("/fact-spinner",          0.8),
    page("/celebrity-age",         0.8),
    page("/number-one-song",       0.8),
    page("/earth-orbits",          0.7),
    page("/what-generation",       0.7),

    // ── Utility ───────────────────────────────────────────────────────────────
    page("/privacy",  0.3),
    page("/terms",    0.3),
    page("/contact",  0.3),

    // ── Dynamic URL sets ──────────────────────────────────────────────────────
    ...countdownUrls,
    ...bornInUrls,
    ...otdUrls,
  ];
}
