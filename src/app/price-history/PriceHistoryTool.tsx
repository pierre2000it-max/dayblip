"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

import { PRICE_DATA, CURRENT, CPI_MULT, type PriceKey } from "@/data/price-history";

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
