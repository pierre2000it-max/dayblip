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

## What Never to Do
- Never use Tailwind (not installed)
- Never add external links to tool or blog pages
- Never remove the AdSense CSS fixes from globals.css
- Never add noindex to tool or blog pages
- Never skip the Quick Answer box on a new tool
- Never skip layout.tsx with canonical on a new blog article
- Never forget display: 'flex' on divs inside OG image routes
- Never break the build — fix all TypeScript errors before pushing
