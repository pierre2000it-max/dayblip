// Shared by /price-history (tool) and /data/price-history (dataset). 2026 values are estimates.
export type PriceKey = "gas" | "bread" | "milk" | "movieTicket" | "house" | "car" | "stamp" | "coffee";

export const PRICE_DATA: Record<number, Record<PriceKey, number>> = {
  1950: { gas:0.27,bread:0.14,milk:0.83,movieTicket:0.46,house:7354,car:1510,stamp:0.03,coffee:0.05 },
  1960: { gas:0.31,bread:0.22,milk:1.04,movieTicket:0.69,house:11900,car:2600,stamp:0.04,coffee:0.10 },
  1970: { gas:0.36,bread:0.25,milk:1.32,movieTicket:1.55,house:23450,car:3900,stamp:0.06,coffee:0.25 },
  1980: { gas:1.25,bread:0.50,milk:2.16,movieTicket:2.69,house:76400,car:7200,stamp:0.15,coffee:0.45 },
  1990: { gas:1.16,bread:0.75,milk:2.78,movieTicket:4.23,house:149800,car:16012,stamp:0.25,coffee:0.75 },
  2000: { gas:1.51,bread:1.99,milk:3.29,movieTicket:5.39,house:244900,car:23368,stamp:0.33,coffee:1.50 },
  2010: { gas:2.79,bread:2.79,milk:3.40,movieTicket:7.89,house:272900,car:29217,stamp:0.44,coffee:2.00 },
  2020: { gas:2.17,bread:3.98,milk:3.54,movieTicket:9.16,house:407700,car:37876,stamp:0.55,coffee:3.00 },
};

export const CURRENT: Record<PriceKey, number> = { gas:3.20,bread:4.50,milk:4.29,movieTicket:14.00,house:420000,car:48000,stamp:0.73,coffee:5.50 };

// CPI-U annual averages. Multiplier = 2026 projection / year value.
// Update CPI_2026 each January with the BLS actual (same value as finance/inflation).
export const CPI_2026 = 325.0;
export const CPI_BY_YEAR: Record<number, number> = { 1950:24.1, 1960:29.6, 1970:38.8, 1980:82.4, 1990:130.7, 2000:172.2, 2010:218.1, 2020:258.8 };
export const CPI_MULT: Record<number, number> = Object.fromEntries(
  Object.entries(CPI_BY_YEAR).map(([y, v]) => [Number(y), CPI_2026 / v])
);
