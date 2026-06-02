"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"

const CURRENT_YEAR = 2026
const FINNHUB_KEY = "d8f2su9r01qub7kfkojgd8f2su9r01qub7kfkok0"
const CORS_PROXY = "https://corsproxy.io/?"

const stockMultipliers: Record<string, Record<number, number>> = {
  "Apple": { 2001: 780, 2003: 420, 2005: 120, 2008: 48, 2010: 35, 2012: 18, 2015: 8.5, 2017: 5.2, 2019: 3.8, 2020: 3.2, 2022: 1.4 },
  "Amazon": { 2001: 1900, 2003: 800, 2005: 280, 2008: 95, 2010: 45, 2012: 22, 2015: 12, 2017: 6.8, 2019: 4.2, 2020: 3.5, 2022: 1.3 },
  "Netflix": { 2007: 180, 2009: 120, 2011: 45, 2013: 25, 2015: 12, 2017: 7.5, 2019: 3.2, 2020: 2.8, 2022: 0.8 },
  "Tesla": { 2012: 120, 2014: 55, 2016: 18, 2018: 12, 2020: 8.5, 2021: 4.2, 2022: 1.5, 2023: 2.1 },
  "Google": { 2004: 95, 2006: 42, 2008: 18, 2010: 12, 2013: 7.5, 2015: 5.2, 2017: 3.8, 2019: 2.8, 2021: 2.2 },
  "Microsoft": { 2000: 18, 2005: 8.5, 2010: 6.2, 2013: 5.8, 2015: 4.8, 2017: 3.5, 2019: 2.8, 2021: 2.1 },
  "Bitcoin": { 2015: 380, 2016: 88, 2017: 45, 2019: 22, 2020: 12, 2021: 6.5, 2022: 1.8, 2023: 3.2 },
  "S&P 500": { 2000: 3.8, 2003: 5.8, 2005: 5.2, 2008: 3.2, 2010: 6.1, 2013: 4.5, 2015: 3.2, 2017: 2.8, 2019: 2.2, 2020: 2.1, 2022: 1.1 },
}

const PRESET_STOCK_NAMES = new Set(Object.keys(stockMultipliers))

const spYears = Object.keys(stockMultipliers["S&P 500"]).map(Number).sort((a, b) => a - b)
function getSpMult(year: number): number {
  let closest = spYears[0]
  for (const y of spYears) if (Math.abs(y - year) < Math.abs(closest - year)) closest = y
  return stockMultipliers["S&P 500"][closest]
}

const STOCKS = Object.keys(stockMultipliers)
const presets = [
  { stock: "Apple", year: 2001, amount: 1000, mult: 780 },
  { stock: "Amazon", year: 2001, amount: 1000, mult: 1900 },
  { stock: "Netflix", year: 2007, amount: 1000, mult: 180 },
  { stock: "Tesla", year: 2012, amount: 1000, mult: 120 },
  { stock: "Google", year: 2004, amount: 1000, mult: 95 },
  { stock: "Microsoft", year: 2000, amount: 1000, mult: 18 },
  { stock: "Bitcoin", year: 2015, amount: 1000, mult: 45 },
  { stock: "S&P 500", year: 2000, amount: 1000, mult: 3.8 },
]

const POPULAR_TICKERS = ["NVDA", "META", "DIS", "JPM", "V", "WMT", "JNJ", "AMD", "BABA", "PYPL"]

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmt2(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Featured examples use historical approximations for illustration.</strong> Custom stock searches use real price data from Yahoo Finance. Past returns do not predict future results. Educational purposes only. Not investment advice.
  </div>
)

interface PresetResult {
  kind: "preset"
  stock: string; year: number; amount: number; mult: number
  result: number; years: number; annualReturn: number; profit: number
  spResult: number
}

interface LiveResult {
  kind: "live"
  ticker: string; companyName: string; year: number; amount: number
  mult: number; result: number; years: number; annualReturn: number; profit: number
  firstPrice: number; lastPrice: number; spResult: number
}

type CalcResult = PresetResult | LiveResult

interface CacheEntry {
  multiplier: number; firstPrice: number; lastPrice: number; companyName: string
}

// module-level cache: keyed by "TICKER-YEAR"
const priceCache = new Map<string, CacheEntry>()

// Fetch historical prices via Yahoo Finance (through CORS proxy) + Finnhub for company name
async function fetchStockData(sym: string, year: number, signal: AbortSignal): Promise<CacheEntry> {
  const cacheKey = `${sym}-${year}`
  const cached = priceCache.get(cacheKey)
  if (cached) return cached

  // Parallel: company name from Finnhub profile + price history from Yahoo Finance
  const period1 = Math.floor(new Date(year, 0, 1).getTime() / 1000)
  const period2 = Math.floor(Date.now() / 1000)

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1mo&period1=${period1}&period2=${period2}`
  const [profileRes, yahooRes] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${sym}&token=${FINNHUB_KEY}`, { signal }),
    fetch(CORS_PROXY + encodeURIComponent(yahooUrl), { signal }),
  ])

  const [profile, yahooData] = await Promise.all([profileRes.json(), yahooRes.json()])

  const companyName: string = profile.name || sym
  const result = yahooData.chart?.result?.[0]
  const closes: number[] | undefined = result?.indicators?.quote?.[0]?.close
  const timestamps: number[] | undefined = result?.timestamp

  if (!closes || closes.length < 2 || !timestamps) {
    throw new Error("no_data")
  }

  // Filter out null closes (Yahoo sometimes returns nulls mid-series)
  const validPairs = timestamps
    .map((ts: number, i: number) => ({ ts, close: closes[i] }))
    .filter((p: { ts: number; close: number }) => p.close != null && !isNaN(p.close))

  if (validPairs.length < 2) throw new Error("no_data")

  const firstPrice = validPairs[0].close
  const lastPrice = validPairs[validPairs.length - 1].close
  const multiplier = lastPrice / firstPrice

  const entry: CacheEntry = { multiplier, firstPrice, lastPrice, companyName }
  priceCache.set(cacheKey, entry)
  return entry
}

export default function StockCalculatorPage() {
  // Preset state
  const [stock, setStock] = useState("Apple")
  const [year, setYear] = useState(2001)
  const [amount, setAmount] = useState("1000")
  const [result, setResult] = useState<CalcResult | null>(null)

  // Live ticker state
  const [ticker, setTicker] = useState("")
  const [liveYear, setLiveYear] = useState(2015)
  const [liveAmount, setLiveAmount] = useState("1000")
  const [loading, setLoading] = useState(false)
  const [liveError, setLiveError] = useState("")

  const abortRef = useRef<AbortController | null>(null)

  const yearsFor = (s: string) => Object.keys(stockMultipliers[s]).map(Number).sort((a, b) => a - b)

  // --- Preset ---
  function computePreset(s: string, y: number, amt: number): PresetResult | null {
    const mult = stockMultipliers[s]?.[y]
    if (mult === undefined) return null
    const res = amt * mult
    const years = CURRENT_YEAR - y
    const annualReturn = (Math.pow(mult, 1 / years) - 1) * 100
    return {
      kind: "preset", stock: s, year: y, amount: amt, mult, result: res,
      years, annualReturn, profit: res - amt, spResult: amt * getSpMult(y),
    }
  }

  function runPresetCalc(s = stock, y = year, amt = parseFloat(amount) || 0, push = true) {
    const res = computePreset(s, y, amt)
    if (!res) return
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?stock=${encodeURIComponent(s)}&year=${y}&amount=${amt}`)
    }
  }

  function applyPreset(p: typeof presets[number]) {
    setStock(p.stock); setYear(p.year); setAmount(String(p.amount))
    runPresetCalc(p.stock, p.year, p.amount)
  }

  function onStockChange(s: string) {
    setStock(s)
    const yrs = yearsFor(s)
    if (!yrs.includes(year)) setYear(yrs[0])
  }

  // --- Live ---
  async function fetchLive(sym: string, yr: number, amt: number, push = true) {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    setLoading(true)
    setLiveError("")
    setResult(null)

    try {
      const { multiplier, firstPrice, lastPrice, companyName } = await fetchStockData(sym, yr, signal)

      const res = amt * multiplier
      const yearsHeld = CURRENT_YEAR - yr
      const annualReturn = yearsHeld > 0 ? (Math.pow(multiplier, 1 / yearsHeld) - 1) * 100 : 0

      const liveRes: LiveResult = {
        kind: "live", ticker: sym, companyName, year: yr, amount: amt,
        mult: multiplier, result: res, years: yearsHeld,
        annualReturn, profit: res - amt, firstPrice, lastPrice,
        spResult: amt * getSpMult(yr),
      }
      setResult(liveRes)

      if (push && typeof window !== "undefined") {
        window.history.pushState({}, "", `?stock=${sym}&year=${yr}&amount=${amt}`)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      const msg = err instanceof Error ? err.message : ""
      if (msg === "no_data") {
        setLiveError(`No historical data for ${sym} from ${yr}. Try a more recent year.`)
      } else if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("invalid")) {
        setLiveError(`${sym} not found. Please check the symbol and try again.`)
      } else {
        setLiveError("Unable to fetch data. Please try again in a moment.")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleLiveCalc() {
    const sym = ticker.toUpperCase().trim()
    if (!sym) return
    fetchLive(sym, liveYear, parseFloat(liveAmount) || 1000)
  }

  // URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const s = p.get("stock"); const y = p.get("year"); const amt = p.get("amount")
    if (!s || !y) return
    const yn = Number(y); const an = amt ? Number(amt) : 1000

    if (PRESET_STOCK_NAMES.has(s) && stockMultipliers[s]?.[yn] !== undefined) {
      setStock(s); setYear(yn); setAmount(String(an))
      runPresetCalc(s, yn, an, false)
    } else {
      setTicker(s); setLiveYear(yn); setLiveAmount(String(an))
      fetchLive(s, yn, an, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result
    ? result.kind === "preset"
      ? `https://www.dayblip.com/tools/stock-calculator?stock=${encodeURIComponent(result.stock)}&year=${result.year}&amount=${result.amount}`
      : `https://www.dayblip.com/tools/stock-calculator?stock=${result.ticker}&year=${result.year}&amount=${result.amount}`
    : ""

  const shareText = result
    ? result.kind === "preset"
      ? `${fmt(result.amount)} in ${result.stock} in ${result.year} would be worth ${fmt(result.result)} today! That is ${result.mult}x in ${result.years} years 😮 (Not investment advice)`
      : `$${result.amount.toLocaleString()} invested in ${result.companyName} (${result.ticker}) in ${result.year} would be worth ${fmt(result.result)} today! That is ${result.mult.toFixed(1)}x in ${result.years} years 📈 (Educational only, not investment advice)`
    : ""

  const liveYearOptions = Array.from({ length: 23 }, (_, i) => 2000 + i)

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white">What If You Had Invested Then?</h1>
          <p className="text-[#a8a8b3]">See what a past investment in famous stocks would be worth today</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          {DISCLAIMER}

          {/* ── Live ticker search ── */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
            <h2 className="mb-4 text-lg font-bold text-white">🔍 Search Any Stock</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {POPULAR_TICKERS.map(t => (
                <button key={t} onClick={() => setTicker(t)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${ticker === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Ticker symbol</span>
                <input
                  type="text"
                  value={ticker}
                  onChange={e => setTicker(e.target.value.toUpperCase())}
                  placeholder="Enter ticker: NVDA, META, DIS..."
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-sm text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Year invested</span>
                <select value={liveYear} onChange={e => setLiveYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-sm text-white focus:border-[#e94560] focus:outline-none">
                  {liveYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Amount ($)</span>
                <input type="number" value={liveAmount} onChange={e => setLiveAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-sm text-white focus:border-[#e94560] focus:outline-none" />
              </label>
            </div>

            <button onClick={handleLiveCalc} disabled={!ticker.trim() || loading}
              className="mt-3 w-full rounded-lg bg-[#e94560] px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {loading ? `Fetching ${ticker.trim() || "…"} data from Yahoo Finance…` : "Calculate Return"}
            </button>

            {liveError && (
              <div className="mt-3 rounded-lg border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 px-4 py-3 text-sm text-[#FF6B6B]">
                {liveError}
              </div>
            )}
          </div>

          {/* ── Featured presets ── */}
          <div>
            <h2 className="mb-4 text-center text-xl font-bold text-white">Featured Examples</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {presets.map(p => (
                <button key={p.stock + p.year} onClick={() => applyPreset(p)}
                  className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#e94560]">
                  <div className="text-sm font-semibold text-white">${p.amount.toLocaleString()} in {p.stock} in {p.year}</div>
                  <div className="mt-1 text-lg font-black text-[#e94560]">→ {fmt(p.amount * p.mult)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Preset calculator ── */}
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Stock</span>
              <select value={stock} onChange={e => onStockChange(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Year invested</span>
              <select value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {yearsFor(stock).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Amount invested</span>
              <div className="flex items-center gap-2">
                <span className="text-[#a8a8b3]">$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <button onClick={() => runPresetCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate
            </button>
          </div>

          {/* ── Results ── */}
          {result && (
            <div className="space-y-6">
              {result.kind === "live" ? (
                <>
                  <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                    <p className="mb-1 text-lg font-bold text-white">{result.companyName} ({result.ticker})</p>
                    <p className="mb-2 text-[#a8a8b3]">${result.amount.toLocaleString()} invested in {result.year} would be worth:</p>
                    <div className="text-6xl font-black text-[#e94560]">{fmt(result.result)}</div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div><div className="font-bold text-[#F9A825]">{result.mult.toFixed(1)}x</div><div className="text-[#a8a8b3]">Your money</div></div>
                      <div><div className="font-bold text-[#4ade80]">{result.annualReturn.toFixed(1)}%</div><div className="text-[#a8a8b3]">Annual return</div></div>
                      <div><div className="font-bold text-white">{result.years}</div><div className="text-[#a8a8b3]">Years held</div></div>
                      <div><div className="font-bold text-[#4ade80]">{fmt(result.profit)}</div><div className="text-[#a8a8b3]">Profit</div></div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#a8a8b3]">
                      <div>Price in {result.year}: ~{fmt2(result.firstPrice)}</div>
                      <div>Current price: ~{fmt2(result.lastPrice)}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                    <h3 className="mb-2 font-bold text-white">vs S&amp;P 500 same period</h3>
                    <p className="text-sm text-[#a8a8b3]">${result.amount.toLocaleString()} in the S&amp;P 500 in {result.year} would be worth <span className="font-bold text-white">{fmt(result.spResult)}</span>.</p>
                    <p className="mt-2 text-sm" style={{ color: result.result >= result.spResult ? "#4ade80" : "#FF6B6B" }}>
                      {result.ticker} {result.result >= result.spResult ? "outperformed" : "underperformed"} the S&amp;P 500 by {fmt(Math.abs(result.result - result.spResult))}.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                    <div className="text-6xl font-black text-[#e94560]">{fmt(result.result)}</div>
                    <p className="mt-3 text-white">{fmt(result.amount)} in {result.stock} in {result.year} would be worth {fmt(result.result)} today</p>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div><div className="font-bold text-[#F9A825]">{result.mult}x</div><div className="text-[#a8a8b3]">Your money</div></div>
                      <div><div className="font-bold text-[#4ade80]">{result.annualReturn.toFixed(1)}%</div><div className="text-[#a8a8b3]">Annual return</div></div>
                      <div><div className="font-bold text-white">{result.years}</div><div className="text-[#a8a8b3]">Years held</div></div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                    <h3 className="mb-2 font-bold text-white">vs S&amp;P 500 same period</h3>
                    <p className="text-sm text-[#a8a8b3]">{fmt(result.amount)} in the S&amp;P 500 in {result.year} would be worth <span className="font-bold text-white">{fmt(result.spResult)}</span>.</p>
                    <p className="mt-2 text-sm" style={{ color: result.result >= result.spResult ? "#4ade80" : "#FF6B6B" }}>
                      {result.stock} {result.result >= result.spResult ? "outperformed" : "underperformed"} the S&amp;P 500 by {fmt(Math.abs(result.result - result.spResult))}.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#4ade80]">{fmt(result.profit)}</div><div className="text-[#a8a8b3]">Profit</div></div>
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#F9A825]">{((result.mult - 1) * 100).toFixed(0)}%</div><div className="text-[#a8a8b3]">Total return</div></div>
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-white">{result.annualReturn.toFixed(1)}%/yr</div><div className="text-[#a8a8b3]">Annualized</div></div>
                  </div>
                </>
              )}

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-[#F9A825]">⚠️ The hard truth</h3>
                <p>Most investors do NOT achieve these returns because they:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[#e0e0e8]">
                  <li>Buy after prices have already risen</li>
                  <li>Sell during market downturns</li>
                  <li>Cannot predict which stocks will win</li>
                  <li>Timing the market is nearly impossible</li>
                </ul>
                <p className="mt-2">This is why index funds (S&amp;P 500) work better for most investors.</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Historical Stock Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
