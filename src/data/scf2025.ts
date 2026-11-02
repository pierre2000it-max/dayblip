/**
 * Federal Reserve Survey of Consumer Finances, 2025 survey.
 * Source: "Changes in U.S. Family Finances from 2022 to 2025", Federal Reserve
 * Bulletin, released October 9, 2026 (federalreserve.gov/publications/files/scf26.pdf).
 * All dollar figures are in 2025 dollars, as published. Next survey: 2028
 * (bulletin expected late 2029).
 *
 * Used by blog/what-is-net-worth and blog/how-much-saved-by-age.
 */

export const SCF_YEAR = 2025
export const SCF_RELEASE = "October 9, 2026"
export const SCF_PRIOR_YEAR = 2022

/** Table 2: family median and mean net worth, all families, thousands of 2025 dollars. */
export const NET_WORTH_ALL = { median: 215_900, mean: 1_241_500, medianPrior: 211_100, meanPrior: 1_164_100 } as const

export interface AgeRow {
  label: string
  median: number
  mean: number
  /** 2022 survey value restated in 2025 dollars, from the same table. */
  medianPrior: number
}

/** Table 2: family net worth by age of reference person, 2025 dollars. */
export const NET_WORTH_BY_AGE: readonly AgeRow[] = [
  { label: "Under 35",     median: 33_000,  mean: 135_400,   medianPrior: 42_700 },
  { label: "Ages 35–44",   median: 155_600, mean: 681_900,   medianPrior: 148_400 },
  { label: "Ages 45–54",   median: 253_700, mean: 1_244_500, medianPrior: 270_600 },
  { label: "Ages 55–64",   median: 411_900, mean: 1_878_000, medianPrior: 398_900 },
  { label: "Ages 65–74",   median: 431_300, mean: 1_897_600, medianPrior: 448_600 },
  { label: "Ages 75 and older", median: 504_900, mean: 1_962_200, medianPrior: 367_300 },
]

/** Table 3: retirement accounts, all families. Percent holding and median value among holders. */
export const RETIREMENT_ACCOUNTS_ALL = { pctHolding: 54.9, medianAmongHolders: 106_000, pctHoldingPrior: 54.3, medianAmongHoldersPrior: 95_200 } as const

/**
 * Box 2, Table A: MEAN retirement savings among families with an IRA or a
 * defined-contribution plan, by age group, 2025 dollars. The 2026 bulletin
 * publishes means by age, not medians; the Fed's SCF tabulation spreadsheets
 * carry the medians. Mean values are pulled up by large balances.
 */
export const RETIREMENT_MEAN_BY_AGE: readonly { label: string; mean: number; meanPrior: number }[] = [
  { label: "Under 35",   mean: 48_400,  meanPrior: 53_800 },
  { label: "Ages 35–44", mean: 182_400, meanPrior: 154_800 },
  { label: "Ages 45–54", mean: 415_800, meanPrior: 342_700 },
  { label: "Ages 55–64", mean: 670_200, meanPrior: 588_500 },
]

/**
 * Last published MEDIAN retirement account balances by age, 2022 survey,
 * in 2022 dollars (2023 bulletin). Kept until the 2025 age medians are
 * pulled from the Fed's SCF tables.
 */
export const RETIREMENT_MEDIAN_BY_AGE_2022: readonly { label: string; median: number }[] = [
  { label: "Under 35",   median: 18_880 },
  { label: "Ages 35–44", median: 45_000 },
  { label: "Ages 45–54", median: 115_000 },
  { label: "Ages 55–64", median: 185_000 },
  { label: "Ages 65–74", median: 200_000 },
  { label: "Ages 75 and older", median: 130_600 },
]

export const usd = (v: number): string => "$" + Math.round(v).toLocaleString("en-US")
export const usdM = (v: number): string => "$" + (v / 1_000_000).toFixed(2) + " million"
export const pctChange = (now: number, prior: number): string => {
  const p = ((now - prior) / prior) * 100
  return `${p >= 0 ? "up" : "down"} ${Math.abs(Math.round(p))}%`
}
