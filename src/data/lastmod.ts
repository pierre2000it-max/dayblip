// Real content dates for sitemap <lastmod>. Bump a value only when that
// group's underlying data or copy actually changes. Search engines and
// IndexNow consumers discount sites whose lastmod is always "now".
// Dates below come from the last git commit touching each data source.
export const LASTMOD = {
  static:  new Date("2026-09-20"), // default for static pages (last sitemap/structure change)
  bornIn:  new Date("2026-06-04"), // src/data/bornIn.json
  salary:  new Date("2026-06-17"), // src/data/salary-data.ts
  compare: new Date("2026-09-20"), // src/data/compare-index.ts + cost-of-living.ts
} as const
