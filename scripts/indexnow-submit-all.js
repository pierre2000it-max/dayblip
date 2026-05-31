#!/usr/bin/env node
/**
 * IndexNow full-site submission for Dayblip — all 228+ URLs.
 * Submits to 4 IndexNow-compatible endpoints.
 * Run: node scripts/indexnow-submit-all.js
 */

const KEY      = "272eea5409654b49b404dee73c5f0bfb";
const HOST    = "dayblip.com";
const KEY_LOC = `https://dayblip.com/${KEY}.txt`;
const BATCH    = 100;
const DELAY_MS = 2000;

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://search.seznam.cz/indexnow",
  "https://yandex.com/indexnow",
];

const BASE = "https://dayblip.com";

// ── Core landing pages ────────────────────────────────────────────────────────
const core = [
  "/", "/born-in", "/on-this-day",
  "/finance", "/health", "/real-estate", "/productivity", "/curiosity",
];

// ── Core tools ────────────────────────────────────────────────────────────────
const coreTools = [
  "/age-calculator", "/date-calculator", "/days-between",
  "/celebrity-age", "/birthday-countdown",
];

// ── Countdown spotlight pages ─────────────────────────────────────────────────
const countdowns = [
  "/days-until/christmas", "/days-until/halloween", "/days-until/thanksgiving",
  "/days-until/new-years", "/days-until/valentines-day", "/days-until/st-patricks-day",
  "/days-until/easter", "/days-until/independence-day", "/days-until/black-friday",
  "/days-until/mothers-day",
];

// ── Born-in 1940–2020 ─────────────────────────────────────────────────────────
const bornIn = [];
for (let y = 1940; y <= 2020; y++) bornIn.push(`/born-in/${y}`);

// ── On This Day spotlight ─────────────────────────────────────────────────────
const onThisDay = [
  "/on-this-day/january-1",  "/on-this-day/january-15", "/on-this-day/january-20",
  "/on-this-day/february-2", "/on-this-day/february-14",
  "/on-this-day/march-14",   "/on-this-day/march-17",
  "/on-this-day/april-15",   "/on-this-day/june-6",    "/on-this-day/july-4",
  "/on-this-day/august-6",   "/on-this-day/september-11",
  "/on-this-day/october-31", "/on-this-day/november-22",
  "/on-this-day/december-25","/on-this-day/december-31",
];

// ── Finance calculators ───────────────────────────────────────────────────────
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

// ── Health calculators ────────────────────────────────────────────────────────
const health = [
  "/health/life-expectancy", "/health/bmi-calculator",
  "/health/habit-cost", "/health/life-insurance",
];

// ── Real estate ───────────────────────────────────────────────────────────────
const realEstate = [
  "/real-estate/rent-vs-buy", "/real-estate/home-value", "/real-estate/affordability",
];

// ── Productivity ──────────────────────────────────────────────────────────────
const productivity = [
  "/productivity/work-hours", "/productivity/meeting-cost", "/productivity/salary-calculator",
];

// ── Curiosity / opportunity-cost ──────────────────────────────────────────────
const curiosity = [
  "/curiosity/subscriptions", "/curiosity/latte-factor", "/curiosity/smoking-investment",
  "/curiosity/dining-out", "/curiosity/lottery", "/curiosity/car-upgrade",
  "/curiosity/impulse-shopping", "/curiosity/phone-upgrade",
  "/curiosity/side-hustle", "/curiosity/gym-membership",
];

// ── World live counters ───────────────────────────────────────────────────────
const worldCounters = [
  "/world-counters", "/world-counters/population",
  "/world-counters/us-debt", "/world-counters/births-today",
];

// ── Life & personal tools ─────────────────────────────────────────────────────
const lifeTools = [
  "/life-progress", "/days-alive", "/baby-age", "/retirement-countdown",
  "/weekends-left", "/couples-countdown", "/anniversary", "/birthday-countdown",
  "/school-countdown", "/resolution-tracker", "/time-capsule", "/star-sign",
  "/full-moons", "/birthday-now", "/birthday-twins", "/number-one-song",
  "/birthday-weather",
];

// ── Games & quizzes ───────────────────────────────────────────────────────────
const games = [
  "/history-quiz", "/decade-quiz", "/daily-trivia", "/guess-the-year",
  "/how-long-ago", "/famous-or-fictional", "/timeline-builder",
  "/name-that-decade", "/fact-spinner", "/older-than",
];

// ── Fun & viral ───────────────────────────────────────────────────────────────
const funViral = [
  "/age-facts", "/world-countdowns", "/this-day-in-my-life", "/earth-orbits",
  "/world-population", "/birth-number", "/time-spent",
  "/day-of-year", "/week-number", "/what-generation",
];

// ── History & world ───────────────────────────────────────────────────────────
const history = [
  "/days-since", "/country-history", "/science-today", "/presidents",
  "/how-long-to-build", "/world-records", "/price-history", "/tech-nostalgia",
  "/newspaper", "/this-week-in-history", "/oldest-things",
];

// ── Legal ─────────────────────────────────────────────────────────────────────
const legal = ["/privacy", "/terms", "/contact"];

// ── Build full list (de-duplicated) ───────────────────────────────────────────
const allPaths = [
  ...core, ...coreTools, ...countdowns, ...bornIn, ...onThisDay,
  ...finance, ...health, ...realEstate, ...productivity, ...curiosity,
  ...worldCounters, ...lifeTools, ...games, ...funViral, ...history, ...legal,
];

const seen = new Set();
const urls = [];
for (const p of allPaths) {
  const url = BASE + p;
  if (!seen.has(url)) { seen.add(url); urls.push(url); }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function submitBatch(endpoint, batch, batchIdx, totalBatches) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOC,
    urlList: batch,
  });
  try {
    const res  = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    const text = await res.text().catch(() => "");
    const ok   = res.status === 200 || res.status === 202;
    console.log(`  ${ok ? "✅" : "❌"}  [${endpoint.replace("https://","").split("/")[0]}] batch ${batchIdx}/${totalBatches} — HTTP ${res.status}${ok ? "" : ": " + text.slice(0,80)}`);
    return ok ? batch.length : 0;
  } catch (e) {
    console.log(`  ❌  [${endpoint}] batch ${batchIdx}/${totalBatches} — network error: ${e.message}`);
    return 0;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH) batches.push(urls.slice(i, i + BATCH));

  console.log(`\n🚀  IndexNow — Full Site Submission`);
  console.log(`    Total URLs: ${urls.length}  (${bornIn.length} born-in + ${urls.length - bornIn.length} static)`);
  console.log(`    Batches: ${batches.length} × max ${BATCH} URLs`);
  console.log(`    Endpoints: ${ENDPOINTS.length}\n`);

  const epResults = Object.fromEntries(ENDPOINTS.map(e => [e, 0]));

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`  📦  Batch ${bi + 1}/${batches.length} (${batch.length} URLs):`);
    const results = await Promise.all(
      ENDPOINTS.map(ep => submitBatch(ep, batch, bi + 1, batches.length).then(n => ({ ep, n })))
    );
    for (const { ep, n } of results) epResults[ep] += n;
    if (bi < batches.length - 1) {
      console.log(`      ⏱  Waiting ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n📊  Summary by endpoint:`);
  for (const [ep, n] of Object.entries(epResults)) {
    const host = ep.replace("https://","").split("/")[0];
    console.log(`    ${n > 0 ? "✅" : "❌"}  ${host}: ${n} URLs accepted`);
  }
  console.log(`\n    Total URLs: ${urls.length}  |  Endpoints: ${ENDPOINTS.length}`);
  console.log(`    🏁  Done.\n`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
