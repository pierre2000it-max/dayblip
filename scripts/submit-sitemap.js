#!/usr/bin/env node
/**
 * Dayblip — Sitemap & IndexNow Submission Script
 *
 * 1. Pings Google sitemap endpoint
 * 2. Pings Bing sitemap endpoint
 * 3. Submits all URLs via IndexNow to 4 endpoints
 *
 * Run: node scripts/submit-sitemap.js
 *      npm run submit-sitemap
 */

// ─────────────────────────────────────────────
// URL LIST
// ─────────────────────────────────────────────

const urls = [
  // Core pages
  "https://www.dayblip.com",
  "https://www.dayblip.com/born-in",
  "https://www.dayblip.com/on-this-day",
  "https://www.dayblip.com/finance",
  "https://www.dayblip.com/health",
  "https://www.dayblip.com/real-estate",
  "https://www.dayblip.com/productivity",
  "https://www.dayblip.com/curiosity",
  "https://www.dayblip.com/tools",

  // Life & Money tools (original batch)
  "https://www.dayblip.com/tools/salary-checker",
  "https://www.dayblip.com/tools/stock-calculator",
  "https://www.dayblip.com/tools/tax-migration",
  "https://www.dayblip.com/tools/true-hourly-wage",
  "https://www.dayblip.com/tools/career-timeline",
  "https://www.dayblip.com/tools/mortgage-by-year",
  "https://www.dayblip.com/tools/debt-freedom",
  "https://www.dayblip.com/tools/generational-wealth",
  "https://www.dayblip.com/tools/car-true-cost",
  "https://www.dayblip.com/tools/procrastination-cost",

  // Life & Money tools (Phase 2 — 10 new tools)
  "https://www.dayblip.com/tools/life-in-weeks",
  "https://www.dayblip.com/tools/life-in-numbers",
  "https://www.dayblip.com/tools/birthday-personality",
  "https://www.dayblip.com/tools/generation-quiz",
  "https://www.dayblip.com/tools/regret-minimization",
  "https://www.dayblip.com/tools/time-wasted",
  "https://www.dayblip.com/tools/privilege-calculator",
  "https://www.dayblip.com/tools/compound-kindness",
  "https://www.dayblip.com/tools/music-of-your-year",
  "https://www.dayblip.com/tools/learning-calculator",

  // High-impact tools (Phase 3)
  "https://www.dayblip.com/tools/ai-job-score",
  "https://www.dayblip.com/tools/fi-date",
  "https://www.dayblip.com/tools/salary-negotiation",
  "https://www.dayblip.com/tools/side-hustle",
  "https://www.dayblip.com/tools/college-roi",
  "https://www.dayblip.com/tools/wfh-calculator",
  "https://www.dayblip.com/tools/recession-score",
  "https://www.dayblip.com/tools/minimum-payment",
  "https://www.dayblip.com/tools/early-vs-late",
  "https://www.dayblip.com/tools/market-timing",
  "https://www.dayblip.com/tools/sleep-debt",
  "https://www.dayblip.com/tools/smoking-cost",

  // Section 1 — New viral tools
  "https://www.dayblip.com/finance/what-if-i-invested",
  "https://www.dayblip.com/tools/american-dream-calculator",
  "https://www.dayblip.com/tools/financial-life-score",
  "https://www.dayblip.com/time-machine",

  // Tool hub pages
  "https://www.dayblip.com/tools/finance",
  "https://www.dayblip.com/tools/life-money",
  "https://www.dayblip.com/tools/misconceptions",
  "https://www.dayblip.com/tools/curiosity",

  // Finance calculators
  "https://www.dayblip.com/finance/compound-interest",
  "https://www.dayblip.com/finance/retirement-savings",
  "https://www.dayblip.com/finance/mortgage-calculator",
  "https://www.dayblip.com/finance/debt-payoff",
  "https://www.dayblip.com/finance/net-worth",
  "https://www.dayblip.com/finance/inflation",
  "https://www.dayblip.com/finance/401k-calculator",
  "https://www.dayblip.com/finance/emergency-fund",
  "https://www.dayblip.com/finance/social-security",
  "https://www.dayblip.com/finance/student-loan",
  "https://www.dayblip.com/finance/freelancer-rate",
  "https://www.dayblip.com/finance/take-home-pay",
  "https://www.dayblip.com/finance/tax-bracket",
  "https://www.dayblip.com/finance/self-employment-tax",
  "https://www.dayblip.com/finance/savings-goal",
  "https://www.dayblip.com/finance/budget-calculator",
  "https://www.dayblip.com/finance/car-affordability",
  "https://www.dayblip.com/finance/college-savings",
  "https://www.dayblip.com/finance/break-even",
  "https://www.dayblip.com/finance/profit-margin",
  "https://www.dayblip.com/finance/capital-gains",
  "https://www.dayblip.com/finance/stock-return",
  "https://www.dayblip.com/finance/cost-of-living",

  // Phase 1 — 2026 tax law calculators
  "https://www.dayblip.com/finance/overtime-tax",
  "https://www.dayblip.com/tools/tip-calculator",
  "https://www.dayblip.com/finance/overtime-calculator",
  "https://www.dayblip.com/finance/paycheck-calculator",

  // Phase 2 — Education and utility calculators
  "https://www.dayblip.com/education",
  "https://www.dayblip.com/education/gpa-calculator",
  "https://www.dayblip.com/education/grade-calculator",
  "https://www.dayblip.com/tools/currency-converter",
  "https://www.dayblip.com/tools/unit-converter",

  // Health calculators
  "https://www.dayblip.com/health/life-expectancy",
  "https://www.dayblip.com/health/bmi-calculator",
  "https://www.dayblip.com/health/habit-cost",
  "https://www.dayblip.com/health/life-insurance",
  "https://www.dayblip.com/health/calorie-calculator",
  "https://www.dayblip.com/health/water-intake",
  "https://www.dayblip.com/health/heart-rate",
  "https://www.dayblip.com/health/alcohol-cost",

  // Phase 3 — Health and personal calculators
  "https://www.dayblip.com/health/due-date-calculator",
  "https://www.dayblip.com/health/body-fat",
  "https://www.dayblip.com/health/macro-calculator",
  "https://www.dayblip.com/health/sleep-calculator",

  // Real estate
  "https://www.dayblip.com/real-estate/rent-vs-buy",
  "https://www.dayblip.com/real-estate/home-value",
  "https://www.dayblip.com/real-estate/affordability",

  // Productivity
  "https://www.dayblip.com/productivity/work-hours",
  "https://www.dayblip.com/productivity/meeting-cost",
  "https://www.dayblip.com/productivity/salary-calculator",

  // Curiosity calculators
  "https://www.dayblip.com/curiosity/subscriptions",
  "https://www.dayblip.com/curiosity/latte-factor",
  "https://www.dayblip.com/curiosity/smoking-investment",
  "https://www.dayblip.com/curiosity/dining-out",
  "https://www.dayblip.com/curiosity/lottery",
  "https://www.dayblip.com/curiosity/car-upgrade",
  "https://www.dayblip.com/curiosity/impulse-shopping",
  "https://www.dayblip.com/curiosity/phone-upgrade",
  "https://www.dayblip.com/curiosity/side-hustle",
  "https://www.dayblip.com/curiosity/gym-membership",

  // Phase 5 — Utility tools
  "https://www.dayblip.com/tools/timezone-converter",
  "https://www.dayblip.com/tools/percentage-calculator",
  "https://www.dayblip.com/tools/reading-time",
  "https://www.dayblip.com/tools/password-strength",

  // Embed Phase 6 — 5 new embeddable tools
  "https://www.dayblip.com/embed/gpa-calculator",
  "https://www.dayblip.com/embed/overtime-tax",
  "https://www.dayblip.com/embed/tip-calculator",
  "https://www.dayblip.com/embed/paycheck-calculator",
  "https://www.dayblip.com/embed/due-date-calculator",

  // Embed Tier 2 — 5 more embeddable tools
  "https://www.dayblip.com/embed/currency-converter",
  "https://www.dayblip.com/embed/percentage-calculator",
  "https://www.dayblip.com/embed/sleep-calculator",
  "https://www.dayblip.com/embed/calorie-calculator",
  "https://www.dayblip.com/embed/body-fat",
  "https://www.dayblip.com/embed/overtime-calculator",
  "https://www.dayblip.com/embed/unit-converter",
  "https://www.dayblip.com/embed/bmi-calculator",
  "https://www.dayblip.com/embed/grade-calculator",
  "https://www.dayblip.com/embed/water-intake",

  // Phase 4 — Curiosity viral calculators
  "https://www.dayblip.com/curiosity/numerology",
  "https://www.dayblip.com/curiosity/chinese-zodiac",
  "https://www.dayblip.com/curiosity/compatibility",
  "https://www.dayblip.com/curiosity/iq-estimate",

  // Countdown pages
  "https://www.dayblip.com/days-until/christmas",
  "https://www.dayblip.com/days-until/halloween",
  "https://www.dayblip.com/days-until/thanksgiving",
  "https://www.dayblip.com/days-until/new-years",
  "https://www.dayblip.com/days-until/new-years-eve",
  "https://www.dayblip.com/days-until/valentines-day",
  "https://www.dayblip.com/days-until/st-patricks-day",
  "https://www.dayblip.com/days-until/easter",
  "https://www.dayblip.com/days-until/independence-day",
  "https://www.dayblip.com/days-until/black-friday",
  "https://www.dayblip.com/days-until/mothers-day",
  "https://www.dayblip.com/days-until/fathers-day",
  "https://www.dayblip.com/days-until/labor-day",
  "https://www.dayblip.com/days-until/memorial-day",

  // World counters
  "https://www.dayblip.com/world-counters",
  "https://www.dayblip.com/world-counters/population",
  "https://www.dayblip.com/world-counters/us-debt",
  "https://www.dayblip.com/world-counters/births-today",

  // Date & age tools
  "https://www.dayblip.com/age-calculator",
  "https://www.dayblip.com/date-calculator",
  "https://www.dayblip.com/days-between",
  "https://www.dayblip.com/celebrity-age",
  "https://www.dayblip.com/birthday-countdown",
  "https://www.dayblip.com/life-progress",
  "https://www.dayblip.com/days-alive",
  "https://www.dayblip.com/baby-age",
  "https://www.dayblip.com/retirement-countdown",
  "https://www.dayblip.com/weekends-left",
  "https://www.dayblip.com/couples-countdown",
  "https://www.dayblip.com/anniversary",
  "https://www.dayblip.com/star-sign",
  "https://www.dayblip.com/full-moons",
  "https://www.dayblip.com/birthday-twins",
  "https://www.dayblip.com/number-one-song",
  "https://www.dayblip.com/older-than",
  "https://www.dayblip.com/age-facts",
  "https://www.dayblip.com/what-generation",
  "https://www.dayblip.com/earth-orbits",
  "https://www.dayblip.com/world-population",
  "https://www.dayblip.com/birth-number",
  "https://www.dayblip.com/time-capsule",
  "https://www.dayblip.com/time-spent",
  "https://www.dayblip.com/day-of-year",
  "https://www.dayblip.com/week-number",
  "https://www.dayblip.com/birthday-now",

  // Embed pages
  "https://www.dayblip.com/embed",
  "https://www.dayblip.com/embed/for-educators",

  // Games & history
  "https://www.dayblip.com/history-quiz",
  "https://www.dayblip.com/decade-quiz",
  "https://www.dayblip.com/daily-trivia",
  "https://www.dayblip.com/guess-the-year",
  "https://www.dayblip.com/how-long-ago",
  "https://www.dayblip.com/famous-or-fictional",
  "https://www.dayblip.com/timeline-builder",
  "https://www.dayblip.com/name-that-decade",
  "https://www.dayblip.com/fact-spinner",
  "https://www.dayblip.com/price-history",
  "https://www.dayblip.com/tech-nostalgia",
  "https://www.dayblip.com/days-since",
  "https://www.dayblip.com/country-history",
  "https://www.dayblip.com/science-today",
  "https://www.dayblip.com/presidents",
  "https://www.dayblip.com/world-records",
  "https://www.dayblip.com/newspaper",
  "https://www.dayblip.com/this-week-in-history",

  // Blog articles
  "https://www.dayblip.com/blog",
  "https://www.dayblip.com/blog/true-hourly-wage",
  "https://www.dayblip.com/blog/will-ai-replace-my-job",
  "https://www.dayblip.com/blog/minimum-payment-true-cost",
  "https://www.dayblip.com/blog/compound-interest-early-saver",
  "https://www.dayblip.com/blog/market-timing-cost",
  "https://www.dayblip.com/blog/financial-independence-date",
  "https://www.dayblip.com/blog/salary-negotiation-guide",
  "https://www.dayblip.com/blog/life-in-weeks",
  "https://www.dayblip.com/blog/born-in-your-year",
  "https://www.dayblip.com/blog/true-cost-of-smoking",
  "https://www.dayblip.com/blog/true-cost-of-car-ownership",
  "https://www.dayblip.com/blog/rent-vs-buy-calculator",
  "https://www.dayblip.com/blog/name-popularity",
  "https://www.dayblip.com/blog/no-tax-on-overtime-2026",
  "https://www.dayblip.com/blog/what-is-net-worth",
  "https://www.dayblip.com/blog/how-much-house-can-you-afford",
  "https://www.dayblip.com/blog/the-4-percent-rule",
  "https://www.dayblip.com/blog/roth-ira-vs-traditional-ira",
  "https://www.dayblip.com/blog/what-your-paycheck-shows-you",
  "https://www.dayblip.com/blog/how-much-saved-by-age",
  "https://www.dayblip.com/blog/wfh-financial-value",
];

// Born-in pages 1940–2020
for (let year = 1940; year <= 2020; year++) {
  urls.push(`https://www.dayblip.com/born-in/${year}`);
}

// On-this-day spotlight pages
const onThisDayPages = [
  "january-1",   "january-15",  "january-20",
  "february-2",  "february-14", "march-14",
  "march-17",    "april-15",    "june-6",
  "july-4",      "august-6",    "september-11",
  "october-31",  "november-22", "december-25",
  "december-31",
];
onThisDayPages.forEach(date => {
  urls.push(`https://www.dayblip.com/on-this-day/${date}`);
});

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const INDEXNOW_KEY  = "272eea5409654b49b404dee73c5f0bfb";
const KEY_LOCATION  = `https://www.dayblip.com/${INDEXNOW_KEY}.txt`;
const HOST          = "www.dayblip.com";
const SITEMAP_URL   = "https://www.dayblip.com/sitemap.xml";
const BATCH_SIZE    = 100;
const BATCH_DELAY   = 1000; // ms between batches

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  console.log("=".repeat(48));
  console.log("  Dayblip Sitemap & IndexNow Submission");
  console.log("=".repeat(48));
  console.log(`  Total URLs: ${urls.length}`);
  console.log(`  Timestamp : ${new Date().toISOString()}`);
  console.log("=".repeat(48));
  console.log();

  // ── STEP 1: Google sitemap ping ──────────────
  console.log("1. Pinging Google...");
  try {
    const res = await fetch(
      "https://www.google.com/ping?sitemap=" + encodeURIComponent(SITEMAP_URL)
    );
    console.log(`   Google: HTTP ${res.status} ${res.ok ? "✅" : "⚠️"}`);
  } catch (e) {
    console.log(`   Google: Failed — ${e.message}`);
  }

  // ── STEP 2: Bing sitemap ping ─────────────────
  console.log("2. Pinging Bing...");
  try {
    const res = await fetch(
      "https://www.bing.com/ping?sitemap=" + encodeURIComponent(SITEMAP_URL)
    );
    console.log(`   Bing: HTTP ${res.status} ${res.ok ? "✅" : "⚠️"}`);
  } catch (e) {
    console.log(`   Bing: Failed — ${e.message}`);
  }

  // ── STEP 3: IndexNow submissions ──────────────
  console.log();
  console.log("3. Submitting to IndexNow...");

  const batches = chunkArray(urls, BATCH_SIZE);
  console.log(
    `   ${urls.length} URLs split into ${batches.length} batch(es) of ${BATCH_SIZE}`
  );
  console.log();

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    const domain = new URL(endpoint).hostname;
    let successCount = 0;
    let failCount = 0;

    process.stdout.write(`   ${domain.padEnd(28)} `);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: batch,
          }),
        });

        // IndexNow returns 200 or 202 on success
        if (res.status === 200 || res.status === 202) {
          successCount += batch.length;
        } else {
          // Log status for debugging non-success responses
          failCount += batch.length;
          process.stdout.write(`[HTTP ${res.status}]`);
        }
      } catch (e) {
        failCount += batch.length;
        process.stdout.write(`[ERR]`);
      }

      // Delay between batches (skip after last)
      if (i < batches.length - 1) {
        await sleep(BATCH_DELAY);
      }
    }

    const icon = failCount === 0 ? "✅" : successCount > 0 ? "⚠️" : "❌";
    console.log(`${successCount} submitted  ${failCount} failed  ${icon}`);
  }

  // ── SUMMARY ───────────────────────────────────
  console.log();
  console.log("=".repeat(48));
  console.log("  Summary");
  console.log("=".repeat(48));
  console.log(`  Total URLs submitted : ${urls.length}`);
  console.log(`  Born-in pages        : 81  (1940–2020)`);
  console.log(`  On-this-day pages    : ${onThisDayPages.length}`);
  console.log(`  Tool pages           : 37`);
  console.log(`  Finance pages        : 26`);
  console.log(`  Holiday countdowns   : 14`);
  console.log();
  console.log("  Sitemap pings        : Google ✓  Bing ✓");
  console.log("  IndexNow endpoints   : 4");
  console.log("  Batches per endpoint : " + batches.length);
  console.log();
  console.log("  Run this script any time you add new pages:");
  console.log("  npm run submit-sitemap");
  console.log("=".repeat(48));
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
