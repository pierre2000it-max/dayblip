"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

type PriceKey = "gas" | "bread" | "milk" | "movieTicket" | "house" | "car" | "stamp" | "coffee";

const PRICE_DATA: Record<number, Record<PriceKey, number>> = {
  1950: { gas:0.27,bread:0.14,milk:0.83,movieTicket:0.46,house:7354,car:1510,stamp:0.03,coffee:0.05 },
  1960: { gas:0.31,bread:0.22,milk:1.04,movieTicket:0.69,house:11900,car:2600,stamp:0.04,coffee:0.10 },
  1970: { gas:0.36,bread:0.25,milk:1.32,movieTicket:1.55,house:23450,car:3900,stamp:0.06,coffee:0.25 },
  1980: { gas:1.25,bread:0.50,milk:2.16,movieTicket:2.69,house:76400,car:7200,stamp:0.15,coffee:0.45 },
  1990: { gas:1.16,bread:0.75,milk:2.78,movieTicket:4.23,house:149800,car:16012,stamp:0.25,coffee:0.75 },
  2000: { gas:1.51,bread:1.99,milk:3.29,movieTicket:5.39,house:244900,car:23368,stamp:0.33,coffee:1.50 },
  2010: { gas:2.79,bread:2.79,milk:3.40,movieTicket:7.89,house:272900,car:29217,stamp:0.44,coffee:2.00 },
  2020: { gas:2.17,bread:3.98,milk:3.54,movieTicket:9.16,house:407700,car:37876,stamp:0.55,coffee:3.00 },
};

const CURRENT: Record<PriceKey, number> = { gas:3.20,bread:4.50,milk:4.29,movieTicket:14.00,house:420000,car:48000,stamp:0.73,coffee:5.50 };

const ITEMS: { key: PriceKey; emoji: string; label: string; fmt: (n: number) => string }[] = [
  { key:"gas",         emoji:"⛽", label:"Gallon of Gas",    fmt: n => `$${n.toFixed(2)}` },
  { key:"bread",       emoji:"🍞", label:"Loaf of Bread",    fmt: n => `$${n.toFixed(2)}` },
  { key:"milk",        emoji:"🥛", label:"Gallon of Milk",   fmt: n => `$${n.toFixed(2)}` },
  { key:"movieTicket", emoji:"🎬", label:"Movie Ticket",     fmt: n => `$${n.toFixed(2)}` },
  { key:"house",       emoji:"🏠", label:"Average House",    fmt: n => `$${n.toLocaleString()}` },
  { key:"car",         emoji:"🚗", label:"Average New Car",  fmt: n => `$${n.toLocaleString()}` },
  { key:"stamp",       emoji:"📮", label:"Postage Stamp",    fmt: n => `$${n.toFixed(2)}` },
  { key:"coffee",      emoji:"☕", label:"Cup of Coffee",    fmt: n => `$${n.toFixed(2)}` },
];

// CPI-U annual averages. Multiplier = 2026 projection / year value.
// Update CPI_2026 each January with the BLS actual (same value as finance/inflation).
const CPI_2026 = 325.0;
const CPI_BY_YEAR: Record<number, number> = { 1950:24.1, 1960:29.6, 1970:38.8, 1980:82.4, 1990:130.7, 2000:172.2, 2010:218.1, 2020:258.8 };
const CPI_MULT: Record<number, number> = Object.fromEntries(
  Object.entries(CPI_BY_YEAR).map(([y, v]) => [Number(y), CPI_2026 / v])
);

const YEARS = [1950,1960,1970,1980,1990,2000,2010,2020];

export default function PriceHistoryTool() {
  const [year,      setYear]      = useState(1990);
  const [infAmt,    setInfAmt]    = useState("100");
  const [infYear,   setInfYear]   = useState(1990);
  const [infResult, setInfResult] = useState<number | null>(null);

  const data = PRICE_DATA[year];

  const calcInflation = () => {
    const amt  = parseFloat(infAmt);
    if (isNaN(amt)) return;
    const mult = CPI_MULT[infYear] ?? 1;
    setInfResult(Math.round(amt * mult * 100) / 100);
  };

  return (
    <div className="space-y-8">
          {/* Year selector */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 flex flex-wrap items-center gap-3">
            <span className="text-white font-semibold">Select year:</span>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${y === year ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                {y}
              </button>
            ))}
          </div>

          {/* Price table */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] overflow-hidden">
            <div className="grid grid-cols-4 gap-0 bg-[#0f3460] px-4 py-2 text-xs font-bold uppercase text-[#a8a8b3]">
              <span>Item</span><span>In {year}</span><span>In 2026</span><span>Change</span>
            </div>
            {ITEMS.map(item => {
              const past = data[item.key];
              const now  = CURRENT[item.key];
              const pct  = Math.round((now - past) / past * 100);
              const big  = pct > 200;
              return (
                <div key={item.key} className="grid grid-cols-4 gap-0 border-t border-[#0f3460] px-4 py-3 items-center">
                  <span className="text-white text-sm">{item.emoji} {item.label}</span>
                  <span className="text-[#a8a8b3] text-sm">{item.fmt(past)}</span>
                  <span className="text-white font-semibold text-sm">{item.fmt(now)}</span>
                  <span className={`text-sm font-bold ${big ? "text-[#e94560]" : "text-green-400"}`}>+{pct}%</span>
                </div>
              );
            })}
          </div>

          <ShareButtons
            text="Check out how prices have changed since the 1950s! Free price history calculator."
            url="https://www.dayblip.com/price-history"
            title="Price History Calculator"
          />

          {/* Inflation calculator */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h3 className="mb-4 font-bold text-white">Inflation Calculator</h3>
            <p className="text-sm text-[#a8a8b3] mb-4">What would $X in a past year be worth today?</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <input type="number" value={infAmt} onChange={e => setInfAmt(e.target.value)} placeholder="Amount"
                className="w-32 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none" />
              <span className="text-white self-center">in</span>
              <select value={infYear} onChange={e => setInfYear(Number(e.target.value))}
                className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button onClick={calcInflation} className="rounded-lg bg-[#e94560] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            </div>
            {infResult !== null && (
              <div className="rounded-lg bg-[#16213e] px-4 py-3">
                <p className="text-white">${infAmt} in {infYear} is worth approximately <strong className="text-[#e94560]">${infResult.toLocaleString()}</strong> in 2026</p>
              </div>
            )}
          </div>
    </div>
  );
}
