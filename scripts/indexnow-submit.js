#!/usr/bin/env node
/**
 * IndexNow URL submission script for dayblip.com
 * Submits all site URLs to IndexNow API in batches of 100.
 * Run: node scripts/indexnow-submit.js
 */

// dayblip.com redirects (307) to www.dayblip.com, so IndexNow must use www
// as the host so it can verify the key file without following redirects.
// The urlList still uses the non-www canonical URLs as seen by users.
const HOST        = "www.dayblip.com";          // where key file is reachable (no redirect)
const URL_BASE    = "https://dayblip.com";      // canonical user-facing URLs
const KEY         = "272eea5409654b49b404dee73c5f0bfb";
const KEY_LOC     = `https://${HOST}/${KEY}.txt`;
const ENDPOINT    = "https://api.indexnow.org/indexnow";
const BATCH_SIZE  = 100;
const BATCH_DELAY = 1000; // ms between batches

// ── URL list ─────────────────────────────────────────────────────────────────

const base = URL_BASE;

// Core landing pages
const core = [
  "/", "/born-in", "/on-this-day",
  "/finance", "/health", "/real-estate", "/productivity", "/curiosity",
];

// Core tools
const coreTools = [
  "/age-calculator", "/date-calculator", "/days-between",
  "/celebrity-age", "/birthday-countdown",
];

// Countdown pages
const countdowns = [
  "/days-until/christmas", "/days-until/halloween", "/days-until/thanksgiving",
  "/days-until/new-years", "/days-until/valentines-day", "/days-until/st-patricks-day",
  "/days-until/easter", "/days-until/independence-day", "/days-until/black-friday",
  "/days-until/mothers-day",
];

// Born-in pages: 1940–2020 (81 pages)
const bornIn = [];
for (let year = 1940; year <= 2020; year++) {
  bornIn.push(`/born-in/${year}`);
}

// On This Day spotlight pages
const onThisDay = [
  "/on-this-day/january-1",   "/on-this-day/january-15",  "/on-this-day/january-20",
  "/on-this-day/february-2",  "/on-this-day/february-14",
  "/on-this-day/march-14",    "/on-this-day/march-17",
  "/on-this-day/april-15",    "/on-this-day/june-6",      "/on-this-day/july-4",
  "/on-this-day/august-6",    "/on-this-day/september-11",
  "/on-this-day/october-31",  "/on-this-day/november-22",
  "/on-this-day/december-25", "/on-this-day/december-31",
];

// Life & personal tools
const lifeTools = [
  "/life-progress", "/days-alive", "/baby-age", "/retirement-countdown",
  "/weekends-left", "/couples-countdown", "/anniversary", "/birthday-countdown",
  "/school-countdown", "/resolution-tracker", "/time-capsule", "/star-sign",
  "/full-moons", "/birthday-now", "/birthday-twins", "/number-one-song",
];

// Games & quizzes
const games = [
  "/history-quiz", "/decade-quiz", "/daily-trivia", "/guess-the-year",
  "/how-long-ago", "/famous-or-fictional", "/timeline-builder",
  "/name-that-decade", "/fact-spinner", "/older-than",
];

// Fun & viral tools
const funViral = [
  "/age-facts", "/world-countdowns", "/this-day-in-my-life", "/earth-orbits",
  "/world-population", "/birth-number", "/birthday-weather", "/time-spent",
  "/day-of-year", "/week-number", "/what-generation",
];

// History & world
const history = [
  "/days-since", "/country-history", "/science-today", "/presidents",
  "/how-long-to-build", "/world-records", "/price-history", "/tech-nostalgia",
  "/newspaper", "/this-week-in-history",
];

// Finance calculators
const finance = [
  "/finance/compound-interest", "/finance/retirement-savings", "/finance/mortgage-calculator",
  "/finance/debt-payoff", "/finance/net-worth", "/finance/inflation",
  "/finance/401k-calculator", "/finance/emergency-fund", "/finance/social-security",
  "/finance/student-loan", "/finance/freelancer-rate", "/finance/take-home-pay",
  "/finance/tax-bracket", "/finance/self-employment-tax", "/finance/savings-goal",
  "/finance/budget-calculator", "/finance/car-affordability", "/finance/college-savings",
  "/finance/break-even", "/finance/profit-margin", "/finance/capital-gains",
  "/finance/stock-return", "/finance/cost-of-living",
];

// Health calculators
const health = [
  "/health/life-expectancy", "/health/bmi-calculator",
  "/health/habit-cost", "/health/life-insurance",
];

// Real estate calculators
const realEstate = [
  "/real-estate/rent-vs-buy", "/real-estate/home-value", "/real-estate/affordability",
];

// Productivity tools
const productivity = [
  "/productivity/work-hours", "/productivity/meeting-cost", "/productivity/salary-calculator",
];

// Curiosity calculators
const curiosity = [
  "/curiosity/subscriptions", "/curiosity/latte-factor", "/curiosity/smoking-investment",
  "/curiosity/dining-out", "/curiosity/lottery", "/curiosity/car-upgrade",
  "/curiosity/impulse-shopping", "/curiosity/phone-upgrade",
  "/curiosity/side-hustle", "/curiosity/gym-membership",
];

// Legal pages
const legal = ["/privacy", "/terms", "/contact"];

// ── Build full URL list (de-duplicated) ───────────────────────────────────────
const allPaths = [
  ...core, ...coreTools, ...countdowns, ...bornIn, ...onThisDay,
  ...lifeTools, ...games, ...funViral, ...history,
  ...finance, ...health, ...realEstate, ...productivity, ...curiosity,
  ...legal,
];

// De-duplicate
const seen = new Set();
const urls = [];
for (const path of allPaths) {
  const url = base + path;
  if (!seen.has(url)) { seen.add(url); urls.push(url); }
}

// ── Submission helpers ────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function submitBatch(batch, batchNum, totalBatches) {
  const body = JSON.stringify({
    host:        HOST,
    key:         KEY,
    keyLocation: KEY_LOC,
    urlList:     batch,
  });

  const res = await fetch(ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  const status = res.status;
  const text   = await res.text().catch(() => "");

  if (status === 200 || status === 202) {
    console.log(`  ✅  Batch ${batchNum}/${totalBatches} — ${batch.length} URLs → HTTP ${status}`);
    return true;
  } else {
    console.log(`  ❌  Batch ${batchNum}/${totalBatches} — HTTP ${status}: ${text.slice(0, 120)}`);
    return false;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀  IndexNow submission for ${HOST}`);
  console.log(`    Key:      ${KEY}`);
  console.log(`    Endpoint: ${ENDPOINT}`);
  console.log(`    Total URLs: ${urls.length}`);

  // Split into batches
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }
  console.log(`    Batches: ${batches.length} (max ${BATCH_SIZE} URLs each)\n`);

  let submitted = 0;
  let failed    = 0;

  for (let i = 0; i < batches.length; i++) {
    const ok = await submitBatch(batches[i], i + 1, batches.length);
    if (ok) {
      submitted += batches[i].length;
    } else {
      failed += batches[i].length;
    }
    if (i < batches.length - 1) {
      await sleep(BATCH_DELAY);
    }
  }

  console.log(`\n📊  Summary`);
  console.log(`    ✅  Submitted: ${submitted} URLs`);
  if (failed > 0) console.log(`    ❌  Failed:    ${failed} URLs`);
  console.log(`    🏁  Done.\n`);
}

main().catch((err) => { console.error("Fatal error:", err); process.exit(1); });
