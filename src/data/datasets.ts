import { NAME_ROWS } from "@/data/name-popularity";
import { PRICE_DATA, CURRENT, CPI_BY_YEAR, CPI_2026 } from "@/data/price-history";

export interface DatasetColumn {
  label: string;
  decimals?: number;
}

export interface Dataset {
  slug: string;
  emoji: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyFinding: string;
  intro: string;
  columns: DatasetColumn[];
  rows: Array<Array<string | number>>;
  sources: string[];
  method: string;
  updated: string;
  updatedISO: string;
  toolHref: string;
  toolLabel: string;
}

const SECS_YEAR = 365.25 * 86_400;

// ── 1. World population and births ──────────────────────────────────────────
// Keep in sync with src/app/world-counters/population/page.tsx (annual January update).
const W_BIRTHS = 132_400_000;
const W_DEATHS = 63_100_000;
const W_NET = W_BIRTHS - W_DEATHS;
const W_POP_JAN1_2026 = 8_200_000_000;

function rateRow(label: string, perYear: number): Array<string | number> {
  return [label, Math.round(perYear), Math.round(perYear / 365.25), Math.round(perYear / 8766), Math.round(perYear / 525_960), Number((perYear / SECS_YEAR).toFixed(2))];
}

const worldPopulation: Dataset = {
  slug: "world-population",
  emoji: "🌍",
  title: "World Population and Births Data",
  metaTitle: "World Population and Births Data (CSV)",
  metaDescription:
    "World births, deaths and net growth per year, day, hour, minute and second, with a CSV download and method notes. Free, no signup required.",
  keyFinding:
    "About 132.4 million people are born and 63.1 million die each year, a net gain of 69.3 million, or roughly 2.2 people every second.",
  intro:
    "This table converts yearly world births and deaths into the rates behind the Dayblip world counters. The population anchor is the estimated world total on January 1, 2026.",
  columns: [
    { label: "Measure" },
    { label: "Per year" },
    { label: "Per day" },
    { label: "Per hour" },
    { label: "Per minute" },
    { label: "Per second", decimals: 2 },
  ],
  rows: [
    rateRow("Births", W_BIRTHS),
    rateRow("Deaths", W_DEATHS),
    rateRow("Net growth", W_NET),
    ["World population, Jan 1 2026 (estimate)", W_POP_JAN1_2026, "", "", "", ""],
    ["Net growth as share of population (%)", Number(((W_NET / W_POP_JAN1_2026) * 100).toFixed(2)), "", "", "", ""],
  ],
  sources: ["United Nations Population Division, World Population Prospects 2024 (2025 estimates)"],
  method:
    "Yearly births and deaths are rounded UN estimates. Per-day, hour, minute and second values divide the yearly figure by 365.25 days. The January 1, 2026 total is an estimate, not a census count, so treat all rates as approximate.",
  updated: "October 2026",
  updatedISO: "2026-10-04",
  toolHref: "/world-counters/population",
  toolLabel: "World Population Counter",
};

// ── 2. US population ────────────────────────────────────────────────────────
// Keep in sync with src/app/world-counters/us-population/page.tsx (annual January update).
const US_BIRTH_SEC = 9.0;
const US_DEATH_SEC = 9.4;
const US_MIGRANT_SEC = 23.2;
const US_POP_JAN1_2025 = 341_145_670;
const US_BIRTH_YR = SECS_YEAR / US_BIRTH_SEC;
const US_DEATH_YR = SECS_YEAR / US_DEATH_SEC;
const US_MIG_YR = SECS_YEAR / US_MIGRANT_SEC;
const US_NET_YR = US_BIRTH_YR - US_DEATH_YR + US_MIG_YR;
const US_NET_SEC = 1 / US_BIRTH_SEC - 1 / US_DEATH_SEC + 1 / US_MIGRANT_SEC;

const usPopulation: Dataset = {
  slug: "us-population",
  emoji: "🇺🇸",
  title: "US Population Growth Data",
  metaTitle: "US Population Growth Data: Births, Deaths, Migration",
  metaDescription:
    "US births, deaths and net migration as one event every few seconds, with yearly totals and a CSV download. Free, no signup required.",
  keyFinding:
    "The US gains about 1 person every 21 seconds: 1 birth every 9.0 seconds, 1 death every 9.4 seconds and 1 net international migrant every 23.2 seconds.",
  intro:
    "This table turns the Census Bureau's population clock rates into yearly and daily totals. The anchor is the Census estimate for January 1, 2025.",
  columns: [
    { label: "Measure" },
    { label: "Seconds per event", decimals: 1 },
    { label: "Per year" },
    { label: "Per day" },
  ],
  rows: [
    ["Births", US_BIRTH_SEC, Math.round(US_BIRTH_YR), Math.round(US_BIRTH_YR / 365.25)],
    ["Deaths", US_DEATH_SEC, Math.round(US_DEATH_YR), Math.round(US_DEATH_YR / 365.25)],
    ["Net international migration", US_MIGRANT_SEC, Math.round(US_MIG_YR), Math.round(US_MIG_YR / 365.25)],
    ["Net population gain", Number((1 / US_NET_SEC).toFixed(1)), Math.round(US_NET_YR), Math.round(US_NET_YR / 365.25)],
    ["US population, Jan 1 2025 (estimate)", "", US_POP_JAN1_2025, ""],
    ["Projected population, Jan 1 2026 (Dayblip calculation)", "", Math.round(US_POP_JAN1_2025 + US_NET_YR), ""],
  ],
  sources: ["U.S. Census Bureau, Population Clock and Vintage population estimates (release of December 30, 2024)"],
  method:
    "Event intervals come from the Census population clock. Yearly totals multiply the per-second rate by 365.25 days. The January 1, 2026 row adds one year of net gain to the January 1, 2025 estimate, so it is a projection and will differ from the official figure.",
  updated: "October 2026",
  updatedISO: "2026-10-04",
  toolHref: "/world-counters/us-population",
  toolLabel: "US Population Counter",
};

// ── 3. Name popularity ──────────────────────────────────────────────────────
const namePopularity: Dataset = {
  slug: "name-popularity",
  emoji: "👶",
  title: "Most Popular Baby Names by Decade",
  metaTitle: "Most Popular US Baby Names by Decade, 1880 to 2025",
  metaDescription:
    "Top 10 US girl and boy names for every decade from 1880s to 2020s, with birth counts and a CSV download. Free, no signup required.",
  keyFinding:
    "Mary ranked first for girls in every decade from the 1880s through the 1950s. John led boys through the 1910s, and Michael led from the 1960s through the 1990s. Liam leads boys in the 2020s so far.",
  intro:
    "Each row shows a name's total recorded births in one decade. Names are ranked within each decade and sex. The 2020s row covers 2020 to 2025 only.",
  columns: [
    { label: "Decade" },
    { label: "Sex" },
    { label: "Rank" },
    { label: "Name" },
    { label: "Births in decade" },
  ],
  rows: NAME_ROWS.map((r) => [...r]),
  sources: ["U.S. Social Security Administration, national baby names data, 1880 to 2025"],
  method:
    "Counts are the number of Social Security card applications that list the name, summed by decade. The source only includes names given to at least 5 babies of one sex in a year. Spelling variants are counted as separate names, so a name's real popularity can be higher than its rank suggests.",
  updated: "October 2026",
  updatedISO: "2026-10-04",
  toolHref: "/tools/name-popularity",
  toolLabel: "Name Popularity Explorer",
};

// ── 4. Price history ────────────────────────────────────────────────────────
const PRICE_KEYS = ["gas", "bread", "milk", "movieTicket", "house", "car", "stamp", "coffee"] as const;
const priceYears = Object.keys(PRICE_DATA).map(Number);

const priceHistory: Dataset = {
  slug: "price-history",
  emoji: "💰",
  title: "US Price History, 1950 to 2026",
  metaTitle: "US Price History Data: Gas, Bread, Houses, 1950-2026",
  metaDescription:
    "Average US prices for gas, bread, milk, movie tickets, houses and cars from 1950 to 2026, with CPI-U and a CSV download. Free, no signup required.",
  keyFinding:
    "A gallon of gas cost about $0.27 in 1950 and about $3.20 in 2026, while the average house rose from $7,354 to about $420,000. CPI-U rose about 13.5x over the same period.",
  intro:
    "Rounded US average prices for 8 everyday items, one row per benchmark year. The CPI-U column lets you adjust any price for inflation.",
  columns: [
    { label: "Year" },
    { label: "Gas per gallon ($)", decimals: 2 },
    { label: "Bread loaf ($)", decimals: 2 },
    { label: "Milk gallon ($)", decimals: 2 },
    { label: "Movie ticket ($)", decimals: 2 },
    { label: "Average house ($)" },
    { label: "Average new car ($)" },
    { label: "Postage stamp ($)", decimals: 2 },
    { label: "Coffee cup ($)", decimals: 2 },
    { label: "CPI-U annual average", decimals: 1 },
  ],
  rows: [
    ...priceYears.map((y) => [String(y), ...PRICE_KEYS.map((k) => PRICE_DATA[y][k]), CPI_BY_YEAR[y]]),
    ["2026 (estimate)", ...PRICE_KEYS.map((k) => CURRENT[k]), CPI_2026],
  ],
  sources: [
    "U.S. Bureau of Labor Statistics, CPI-U annual averages",
    "Item prices: rounded national averages compiled by Dayblip from public U.S. government price series",
  ],
  method:
    "Past prices are rounded national averages for each benchmark year. The 2026 prices are Dayblip estimates and the 2026 CPI-U is a projection of 325.0, so percentage changes are approximate. To adjust a price for inflation, multiply it by 325.0 divided by the CPI-U for its year.",
  updated: "October 2026",
  updatedISO: "2026-10-04",
  toolHref: "/price-history",
  toolLabel: "Historical Price Comparison",
};

export const DATASETS: Dataset[] = [worldPopulation, usPopulation, namePopularity, priceHistory];

export function getDataset(slug: string): Dataset | undefined {
  return DATASETS.find((d) => d.slug === slug);
}

export function datasetToCsv(d: Dataset): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [d.columns.map((c) => esc(c.label)).join(",")];
  for (const r of d.rows) lines.push(r.map(esc).join(","));
  return lines.join("\n") + "\n";
}
