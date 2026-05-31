#!/usr/bin/env node
/**
 * IndexNow submission for new/recently added Dayblip pages.
 * Submits to 4 IndexNow-compatible endpoints simultaneously.
 * Run: node scripts/google-index-submit.js
 */

const KEY      = "272eea5409654b49b404dee73c5f0bfb";
const BING_API = "d9e517040548463db99d17518a78476a"; // Bing Webmaster API key
const HOST    = "www.dayblip.com";
const KEY_LOC = `https://www.dayblip.com/${KEY}.txt`;
const BATCH    = 100;
const DELAY_MS = 2000;

// Endpoints that need the Bing API-Key header
const BING_ENDPOINTS = new Set([
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
]);

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://search.seznam.cz/indexnow",
  "https://yandex.com/indexnow",
];

const urlsToSubmit = [
  "https://www.dayblip.com/world-counters",
  "https://www.dayblip.com/world-counters/population",
  "https://www.dayblip.com/world-counters/us-debt",
  "https://www.dayblip.com/world-counters/births-today",
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
  "https://www.dayblip.com/health/life-expectancy",
  "https://www.dayblip.com/health/bmi-calculator",
  "https://www.dayblip.com/health/habit-cost",
  "https://www.dayblip.com/health/life-insurance",
  "https://www.dayblip.com/real-estate/rent-vs-buy",
  "https://www.dayblip.com/real-estate/home-value",
  "https://www.dayblip.com/real-estate/affordability",
  "https://www.dayblip.com/productivity/work-hours",
  "https://www.dayblip.com/productivity/meeting-cost",
  "https://www.dayblip.com/productivity/salary-calculator",
  "https://www.dayblip.com/on-this-day",
  "https://www.dayblip.com/born-in",
  "https://www.dayblip.com/curiosity",
  "https://www.dayblip.com/finance",
  "https://www.dayblip.com/health",
  "https://www.dayblip.com/real-estate",
  "https://www.dayblip.com/productivity",
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function submitBatch(endpoint, batch, batchIdx, totalBatches) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOC,
    urlList: batch,
  });
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  if (BING_ENDPOINTS.has(endpoint)) headers["API-Key"] = BING_API;
  try {
    const res  = await fetch(endpoint, { method: "POST", headers, body });
    const text = await res.text().catch(() => "");
    const ok   = res.status === 200 || res.status === 202;
    console.log(`  ${ok ? "✅" : "❌"}  [${endpoint.replace("https://","").split("/")[0]}] batch ${batchIdx}/${totalBatches} — HTTP ${res.status}${ok ? "" : ": " + text.slice(0,80)}`);
    return ok ? batch.length : 0;
  } catch (e) {
    console.log(`  ❌  [${endpoint}] batch ${batchIdx}/${totalBatches} — network error: ${e.message}`);
    return 0;
  }
}

async function main() {
  // De-duplicate
  const urls   = [...new Set(urlsToSubmit)];
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH) batches.push(urls.slice(i, i + BATCH));

  console.log(`\n🚀  IndexNow — New Pages Submission`);
  console.log(`    URLs: ${urls.length}  |  Batches: ${batches.length}  |  Endpoints: ${ENDPOINTS.length}\n`);

  let totalOk = 0;

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`  📦  Batch ${bi + 1}/${batches.length} (${batch.length} URLs):`);
    const results = await Promise.all(
      ENDPOINTS.map(ep => submitBatch(ep, batch, bi + 1, batches.length))
    );
    // Count successes from best-performing endpoint for this batch
    totalOk += Math.max(...results) > 0 ? batch.length : 0;
    if (bi < batches.length - 1) {
      console.log(`      ⏱  Waiting ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n📊  Summary`);
  console.log(`    URLs submitted: ${urls.length}  |  Endpoints: ${ENDPOINTS.length}`);
  console.log(`    🏁  Done.\n`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
