# Dayblip — Claude Code Project Reference

## Project Identity
- Site: [www.dayblip.com](https://www.dayblip.com)
- Stack: Next.js 14 App Router, TypeScript, Vercel free tier
- GitHub: pierre2000it-max/dayblip
- Local path: C:\Projects\dayblip
- Builder: Pierre (solo developer)
- Tagline: Free Tools for Curious Minds
- Promise: No signup. No email. No paywall. Ever.

## Daily Command
cd C:\Projects\dayblip && npm run submit-sitemap

## Credentials
- AdSense Publisher ID: ca-pub-8231179871551744
- ads.txt: google.com, pub-8231179871551744, DIRECT, f08c47fec0942fa0
- O*NET API Key: 6lz3V-RS5CA-M7PdM-3F2lS
- IndexNow Key: 272eea5409654b49b404dee73c5f0bfb
- ExchangeRate API: https://open.er-api.com/v6/latest/USD (free no key)
- Wikipedia API: https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/MM/DD
  Header required: Api-User-Agent: Dayblip/1.0 (dayblip.com)
- Twitter: @dayblip365
- Reddit: u/ThisEngineer7454
- Product Hunt: producthunt.com/posts/dayblip
  Next relaunch: December 9 2026

## Design System
- Accent red: #e94560
- Dark background: #0d1b2a
- Card background: #1e2d4a
- Text primary: #ffffff
- Text secondary: #a8a8b3
- Styling: Inline styles + globals.css (NO Tailwind)
- Fonts: System Arial throughout

## Quick Answer Box (required on all tools)
background: #1e2d4a
border-left: 4px solid #e94560
border-radius: 8px
padding: 16px 20px
Label: "QUICK ANSWER" in #e94560 11px uppercase letter-spacing 2px

## Every New Tool Must Have
1. Quick Answer box
2. All 8 share buttons (ShareButtons component)
3. Related Tools section (RelatedTools component)
4. Breadcrumb navigation (Breadcrumb component)
5. WebApplication + FAQPage schema markup
6. Unique meta title and description (120-155 chars)
7. Canonical URL: https://www.dayblip.com/[route]
8. LastUpdated component
9. MethodologyNote component (where applicable)
10. Zero external links

## Every New Blog Article Must Have
1. Quick Answer box
2. ShareButtons component
3. RelatedTools component
4. Breadcrumb navigation
5. Article schema (not WebApplication)
6. layout.tsx with canonical tag
7. Published date visible
8. 800-1200 words minimum
9. Tool callout box linking to relevant tool
10. Zero external links

## Key Components
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/ShareButtons.tsx
- src/components/RelatedTools.tsx
- src/components/Breadcrumb.tsx
- src/components/AdUnit.tsx
- src/components/LastUpdated.tsx
- src/components/MethodologyNote.tsx
- src/lib/schema.ts (WebApplication + Article schema)
- src/lib/authorSchema.ts (DAYBLIP_ORG + DAYBLIP_AUTHOR)

## Schema Pattern
All tools use webApplicationSchema() from src/lib/schema.ts
All blog articles use articleSchema() from src/lib/schema.ts
Both include author: DAYBLIP_AUTHOR and publisher: DAYBLIP_ORG
dateModified defaults to 2026-06-13

## OG Image Routes (all working as of commit 8ae20a7)
- /api/og — generic (params: title, subtitle, emoji, value)
- /api/og/life-score — (params: score, zone)
- /api/og/born-in — (params: year, song, gas, pop)
- /api/og/what-if — (params: amount, asset, year, value)
- /api/og/american-dream — (params: state, age, years)
- /api/og/generation — (params: diff, direction, homeRatio, parentRatio)
- /api/og/daily — (params: day, correct, streak)

CRITICAL: Every div in OG route JSX MUST have display: 'flex'
Satori renderer requires this on all elements.
Without it routes return 500 errors.
Always wrap OG routes in try/catch.

## OG Meta Warnings to Fix (flagged by opengraph.xyz)
- Page titles should be under 60 characters
- Meta descriptions should be under 155 characters
- og:site_name should be set globally in root layout.tsx
- twitter card should be summary_large_image globally

## Robots.txt — AI Crawlers Allowed
GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot
All explicitly allowed.
Disallow: /embed/ and /api/

## Embed System
25 embeddable tools at /embed
Embed pages have noindex (intentional)
Embed pages NOT in sitemap (intentional)
Educator page: /embed/for-educators

## Blog Status (as of June 13 2026)
21 articles live.
Target: 114 articles by June 2027.
Remaining: 93 articles to write.
Pace needed: 1.8 articles per week.

## Key Recent Commits
- b500874: Fixed Google indexing issues (canonical tags, embed noindex)
- 954edb8: Blog landing page — all 21 articles showing
- f0bb8d6: Blog article 21 — WFH Financial Value
- f5d064f: WFH article hybrid scenario section added
- 3132389: ads.txt restored and corrected
- c36bfd3: GEO optimization layer (author, dates, crawlers, methodology)
- dacc94c: OG image routes created (7 routes, 20 pages)
- 8ae20a7: OG image routes fixed (display flex, try/catch)

## Site Counts (as of June 13 2026)
- Total URLs in sitemap: 316
- Total tool pages: ~190+
- Blog articles: 21
- Embed tools: 25
- Born-in pages: 81 (1940-2020)

## Critical CSS Fixes — DO NOT REMOVE
In src/app/globals.css:
ins.adsbygoogle { background: transparent !important }
ins.adsbygoogle[data-ad-status="unfilled"] { display: none !important }

## Build Command
npm --prefix "C:\Projects\dayblip" run build
Build must always be completely clean with zero TypeScript errors.

## Push Pattern
git -C "C:\Projects\dayblip" add .
git -C "C:\Projects\dayblip" commit -m "descriptive message"
git -C "C:\Projects\dayblip" push origin main

## META DESCRIPTION RULES — ENFORCE ON EVERY PAGE

These rules apply to every meta description written or modified anywhere in the project.
Violation of these rules causes broken SERP listings and Bing/Google warnings.

### Hard limits:
- MINIMUM: 120 characters
- MAXIMUM: 155 characters
- Target range: 130-150 characters (sweet spot)

### Must always:
- End with a complete sentence ending in period, question mark, or exclamation mark
- Be specific to the page content — no generic descriptions
- Include the primary keyword naturally
- End with "Free — no signup required." or "Free [tool name]." when space allows

### Must never:
- End mid-word or mid-sentence
- End with "..." or any truncation
- Use the same description on multiple pages
- Exceed 155 characters under any circumstances
- Be under 120 characters on any indexable page
- Use vague language like "Learn more", "Discover", "Explore" without specifics
- Be generated by slicing a longer string with .slice() — always write dedicated descriptions

### Dynamic routes — special rules:
- Every dynamic route ([slug], [year], [date]) must have a dedicated description per value
- Never slice intro or body text to create a description
- Always write a purpose-built description for each page variant
- If a holiday, year, or date needs a description — write it explicitly, do not derive it

### Verification before every build:
Before running npm run build on any change that touches metadata, run:
grep -rn "description" src/app --include="*.tsx" --include="*.ts" | grep -v "//\|schema\|FAQ\|json\|acceptedAnswer" | awk -F'"' '{print length($2), $2}' | sort -rn | head -20

Review the output. Any description over 155 characters must be fixed before building.

## Annual Data Update Reminders
- **src/data/cost-of-living.ts** — update COLI indexes, rent, home prices, and household income each January using C2ER Q4 report, Zillow December data, and Census ACS latest release.

---

## ANNUAL DATA UPDATE SYSTEM

Every January, run through every section below. Each section lists the exact files to touch, the source to check, and what to change. Do not skip any section. Do not update one file and forget the others in the same category.

**When to run:** First week of January each year, after BLS releases December CPI and SSA publishes the new wage base.

---

### IRS TAX DATA — Update Every January

IRS publishes new brackets in November (Revenue Procedure). Changes take effect the following January 1.

**Source:** IRS Revenue Procedures (search "Revenue Procedure [year] standard deduction brackets")
**Verify at:** irs.gov/newsroom → search "tax year [year] inflation adjustments"

⚠️ IRS VERIFICATION WARNING: Always verify the standard deduction for single filers directly from the IRS Revenue Procedure before changing any file. The 2026 single standard deduction is $16,100 per IRS Rev. Proc. 2025-32. The 2025 value was $15,000. These are different — do not confuse them. Always state which tax year and Revenue Procedure you are using.

**Files to update:**

| File | What to change | Notes |
|---|---|---|
| `src/app/finance/tax-bracket/page.tsx` | `STD_DEDUCTION` object + all bracket thresholds | All 4 filing statuses |
| `src/app/finance/tax-bracket/layout.tsx` | Year in title and description | e.g. "2026" → "2027" |
| `src/app/finance/take-home-pay/page.tsx` | Same bracket thresholds + `STD_DEDUCTION` | Also check SS wage base |
| `src/app/finance/paycheck-calculator/page.tsx` | Bracket thresholds + `ssCap` constant | Also update FAQ text mentioning $168,600 etc |
| `src/app/embed/(tools)/take-home-pay/page.tsx` | `Math.min(s, XXXXXX)` SS wage base | This file has lagged 2+ years before — check carefully |
| `src/app/daily/page.tsx` | 401k limit question (amount + year label) + SS wage base in FICA explanation | Two separate locations |
| `src/app/blog/roth-ira-vs-traditional-ira/page.tsx` | IRA phase-out income thresholds | Check IRS Notice for Roth/trad limits |
| `src/app/blog/how-much-saved-by-age/page.tsx` | 401k/IRA contribution limits | Verify against IRS Notice |

**Key annual figures to update:**
- Standard deduction (single / MFJ / MFS / HOH)
- Federal bracket thresholds (7 brackets, 4 filing statuses)
- 401k employee contribution limit
- 401k catch-up contribution (age 50+)
- IRA contribution limit
- Roth IRA phase-out range (single and MFJ)
- Traditional IRA deductibility phase-out range
- Social Security wage base (also published by SSA separately)

---

### SSA WAGE BASE — Update Every January

Social Security Administration publishes the new wage base each October for the following year.

**Source:** ssa.gov/news/press/factsheets/colafacts-alt.pdf (published each October)
**2026 value:** $176,100
**Pattern to find:** `176100` or `168600` or `160200` — any of these in paycheck/FICA logic is the SS wage cap

**Files to update:**

| File | Pattern | Notes |
|---|---|---|
| `src/app/finance/paycheck-calculator/page.tsx` | `const ssCap = XXXXXX` | Also update FAQ text |
| `src/app/finance/take-home-pay/page.tsx` | `Math.min(annual, XXXXXX)` | |
| `src/app/embed/(tools)/take-home-pay/page.tsx` | `Math.min(s, XXXXXX)` | Historically lagged — always check |
| `src/app/daily/page.tsx` | Text: "on wages up to $X in 20XX" | Around line 825 |

---

### WORLD COUNTER ANCHOR VALUES — Update Every January

⚠️ CRITICAL PATTERN: World counter pages use a `_JAN1_YEAR` anchor constant + a rate multiplied by elapsed seconds. When the year rolls over, the anchor must be updated or the counter starts drifting from the wrong baseline. Each January 1 anchor must be set to the actual value at Jan 1 of the new year.

**Files to update:**

| File | Constant | Source | Notes |
|---|---|---|---|
| `src/app/world-counters/us-population/page.tsx` | `US_POP_JAN1_2026` → `US_POP_JAN1_2027` | census.gov/popclock (Jan 1 reading) | Also update birth/death/migrant rates if Census revises |
| `src/app/world-counters/us-debt/page.tsx` | `DEBT_JAN1_2026` → `DEBT_JAN1_2027` + `DEBT_PER_SEC` | fiscaldata.treasury.gov (Jan 1 reading) | Debt per second changes as deficit changes |
| `src/app/world-counters/plastic-in-ocean/page.tsx` | `CUMULATIVE_MT_JAN1_2026` → `CUMULATIVE_MT_JAN1_2027` | Calculated: prior value + (PLASTIC_MT_PER_YEAR × 1) | Add one year of plastic at current rate |
| `src/app/world-counters/population/page.tsx` | `WORLD_POP_NOW`, `ANNUAL_BIRTHS`, `ANNUAL_DEATHS` | UN Population Division (population.un.org) | Check World Population Prospects update |
| `src/app/world-counters/births-today/page.tsx` | `ANNUAL_BIRTHS`, `ANNUAL_DEATHS` | Same UN source | Must match population page |

**How to calculate new anchor values:**
1. Note the Jan 1 actual value from the official source
2. Rename constant: `_JAN1_2026` → `_JAN1_2027`
3. Also update any text in the file that says "Jan 1, 2026" → "Jan 1, 2027"

---

### COST OF LIVING DATA — Update Every January

**Source:** C2ER Cost of Living Index (Q4 report, published in January)
**Supplemental sources:** Zillow Research (zillow.com/research) for rent/home prices; Census ACS for household income

**File:** `src/data/cost-of-living.ts`

What to update for each city:
- `coliIndex` — from C2ER Q4 report
- `medRent1br` — from Zillow Observed Rent Index (December reading)
- `medHomePrice` — from Zillow Home Value Index (December reading)
- `medHouseholdIncome` — from Census ACS (released each September for prior year)
- Category indexes (`groceriesIndex`, `housingIndex`, `utilitiesIndex`, `transportIndex`, `healthcareIndex`) — from C2ER breakdown

Also update the comment at the top of the file: change "next update due January 20XX" to the next year.

---

### CPI TABLE — Update Every January

**File:** `src/app/finance/inflation/page.tsx`

The `CPI` constant at the top of the file must be extended with the new year's actual BLS annual average CPI value.

**Source:** BLS CPI tables → bls.gov/cpi → "CPI-U, US City Average, Annual" → get December value or annual average

Steps:
1. Find the CPI constant (lines ~10–15)
2. Replace the projection entry for the current year with the actual BLS value
3. Add a new projection entry for `currentYear + 4` at ~2% above the last projection
4. The `currentYear` variable (`new Date().getFullYear()`) auto-picks the correct year — no logic change needed

Example: if the 2026 actual BLS CPI was 326.8 (not the projection of 325.0), update `2026: 325.0` → `2026: 326.8` and add `2031: 358.8`.

---

### BLS WAGE DATA — Update When New Data Releases

BLS releases median weekly earnings quarterly (Q1: May, Q2: August, Q3: November, Q4: February).
BLS OES (Occupational Employment Statistics) releases annually in May.

**Files with quarterly BLS data:**

| File | Current data | What to update |
|---|---|---|
| `src/app/research/how-many-mondays-left/page.tsx` | BLS Q4 2024 — $1,145/week | Update median weekly earnings + label |
| `src/app/blog/average-salary-by-age/page.tsx` | BLS Q4 2023 — $1,220/week peak | **Highest priority** — currently 2+ years stale |
| `src/app/daily/page.tsx` | "median US household income $74,580 in 2022–2023" | Update to latest Census ACS release |

**Files with annual BLS OES data (update each May/June after release):**

| File | Notes |
|---|---|
| `src/app/tools/salary-negotiation/page.tsx` | Salary ranges for 80+ job titles — cite "BLS OES [year]" |
| `src/app/tools/salary-checker/page.tsx` | Same salary ranges — keep in sync with above |
| `src/app/embed/(tools)/salary-check/page.tsx` | Same data — no year label currently; add one |

**Source:** bls.gov/news.release/wkyeng.t01.htm (weekly earnings)
**Source:** bls.gov/oes (OES annual)

---

### INTEREST RATES AND MORTGAGE DATA — Update As Needed

These change frequently. Update whenever the Fed moves rates significantly or when the page's stated range becomes obviously wrong.

**Files:**

| File | Current text | Trigger to update |
|---|---|---|
| `src/app/finance/mortgage-calculator/page.tsx` | "2024–2026, 30-year fixed: 6–8%" | Update if 30-year fixed moves outside stated range for 3+ months |
| `src/app/finance/savings-goal/page.tsx` | "2024–2026 … 4–5.5% APY HYSA" | Update if Fed rate cuts push HYSA below 3% or above 6% |
| `src/app/tools/currency-converter/page.tsx` | Example exchange rates "as of mid-2026" | Update the year reference; note rates change daily |

**Source:** Freddie Mac PMMS (freddiemac.com/pmms) for mortgage rates; Fed.gov for HYSA/prime rate

---

### DATA SOURCE QUICK REFERENCE

| Data type | Source URL | Update frequency |
|---|---|---|
| Federal tax brackets + std deduction | irs.gov (search "Revenue Procedure [year]") | Annual — November release |
| SS wage base | ssa.gov/news/press/factsheets/colafacts-alt.pdf | Annual — October release |
| 401k / IRA limits | IRS Notice (search "IRS Notice [year] retirement plan limits") | Annual — October/November |
| US population anchor | census.gov/popclock (Jan 1 reading) | Annual — January 1 |
| US national debt anchor | fiscaldata.treasury.gov → Debt to the Penny | Annual — January 1 |
| World birth/death rates | population.un.org → World Population Prospects | Annual / as revised |
| Deforestation rate | fao.org → Global Forest Resources Assessment | Every 5 years (2025 next) |
| Ocean plastic rate | Check UNEP / Science journal for updates | As new studies publish |
| CPI inflation | bls.gov/cpi → CPI-U Annual Average | Annual — January release |
| BLS weekly earnings | bls.gov/news.release/wkyeng.t01.htm | Quarterly |
| BLS OES salary data | bls.gov/oes | Annual — May release |
| Cost of living index | coli.org (C2ER) | Quarterly — Q4 in January |
| Zillow rent/home prices | zillow.com/research | Monthly |
| Census household income | census.gov → ACS 5-year estimates | Annual — September release |
| Mortgage rates | freddiemac.com/pmms | Weekly |

---

### JANUARY ANNUAL UPDATE PROMPT

Copy and paste this prompt each January to run the full annual update:

```
You are working on the Dayblip Next.js project.
WORKING DIRECTORY: root of the Dayblip project.

WHAT THIS DOES: Annual data update for the new year. Updates all hardcoded
financial, demographic, and scientific data that changes on an annual cycle.

Run through CLAUDE.md section "ANNUAL DATA UPDATE SYSTEM" and update every
file listed in every section. For each file:
1. Read the file first
2. Find the constants/values to update
3. Verify the new value from the official source listed
4. Make the change
5. Confirm the change with grep before moving on

Start with IRS TAX DATA (highest user impact), then SSA WAGE BASE, then
WORLD COUNTER ANCHOR VALUES, then COST OF LIVING DATA, then CPI TABLE.

Do not update BLS WAGE DATA or INTEREST RATES in this pass — flag them
separately as they require independent verification.

After all updates:
- Run npm run build
- Fix any TypeScript errors
- git add -A
- git commit -m "Annual data update [YEAR]: IRS brackets, SS wage base, world counter anchors, COLI, CPI"
- git push origin main
- node scripts/submit-sitemap.js
```

## What Never to Do
- Never use Tailwind (not installed)
- Never add external links to tool or blog pages
- Never remove the AdSense CSS fixes from globals.css
- Never add noindex to tool or blog pages
- Never skip the Quick Answer box on a new tool
- Never skip layout.tsx with canonical on a new blog article
- Never forget display: 'flex' on divs inside OG image routes
- Never break the build — fix all TypeScript errors before pushing
