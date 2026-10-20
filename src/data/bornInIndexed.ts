// Born-in years that stay indexable. Every other year renders for users but is noindex
// and out of the sitemap. Basis: the 16 years Google had already indexed (Search Console,
// Oct 2026) plus anchor years people search for. Imported by born-in/[year]/page.tsx and sitemap.ts.
export const BORN_IN_INDEXED_YEARS: ReadonlySet<number> = new Set([
  1943, 1945, 1950, 1951, 1952, 1954, 1956, 1958, 1959, 1961, 1963, 1967,
  1985, 2005, 2016, 2018,
  1980, 1990, 1995, 2000,
])
