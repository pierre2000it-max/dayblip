"use client"
import { useState, useEffect } from "react"

const CURRENCIES: { code: string; name: string }[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "KRW", name: "South Korean Won" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "SEK", name: "Swedish Krone" },
]

const FALLBACK: Record<string, number> = {
  USD: 1, EUR: 0.93, GBP: 0.79, JPY: 149, CAD: 1.36,
  AUD: 1.55, CHF: 0.90, CNY: 7.24, INR: 83.5, MXN: 17.2,
  BRL: 5.1, KRW: 1340, SGD: 1.35, HKD: 7.82, NOK: 10.8, SEK: 10.4,
}

const QUICK = [
  { from: "USD", to: "EUR" }, { from: "USD", to: "GBP" },
  { from: "USD", to: "JPY" }, { from: "USD", to: "CAD" },
  { from: "EUR", to: "USD" }, { from: "GBP", to: "USD" },
]

function fmtAmount(n: number, code: string): string {
  const decimals = ["JPY", "KRW"].includes(code) ? 0 : 2
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function EmbedCurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK)
  const [updatedDate, setUpdatedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("100")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("EUR")

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(data => {
        if (data?.rates) {
          setRates({ USD: 1, ...data.rates })
          if (data.time_last_update_utc) {
            setUpdatedDate(new Date(data.time_last_update_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const amountNum = parseFloat(amount) || 0
  const fromRate = rates[from] ?? 1
  const toRate = rates[to] ?? 1
  const result = amountNum * (toRate / fromRate)
  const rate = toRate / fromRate
  const inverseRate = fromRate / toRate

  function swap() {
    setFrom(to)
    setTo(from)
  }

  const selectStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        💱 Currency Converter
      </h2>

      {loading && (
        <div style={{ fontSize: 12, color: "#a8a8b3", marginBottom: 10 }}>Loading rates…</div>
      )}

      {/* Quick select */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
        {QUICK.map(q => (
          <button
            key={`${q.from}-${q.to}`}
            onClick={() => { setFrom(q.from); setTo(q.to) }}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: from === q.from && to === q.to ? "#e94560" : "#16213e",
              color: from === q.from && to === q.to ? "#fff" : "#a8a8b3",
              border: from === q.from && to === q.to ? "none" : "1px solid #1e2d4a",
            }}
          >
            {q.from}→{q.to}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Amount</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={selectStyle}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>From</span>
            <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </label>
          <button
            onClick={swap}
            style={{ padding: "9px 12px", background: "#16213e", border: "1px solid #1e2d4a", borderRadius: 6, color: "#e94560", fontSize: 16, cursor: "pointer", fontWeight: 700 }}
          >
            ⇄
          </button>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>To</span>
            <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Result */}
      <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#F9A825", marginBottom: 10, textAlign: "center" }}>
          {fmtAmount(amountNum, from)} {from} = {fmtAmount(result, to)} {to}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #1e2d4a", fontSize: 12 }}>
          <span style={{ color: "#a8a8b3" }}>1 {from}</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>{fmtAmount(rate, to)} {to}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #1e2d4a", fontSize: 12 }}>
          <span style={{ color: "#a8a8b3" }}>1 {to}</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>{fmtAmount(inverseRate, from)} {from}</span>
        </div>
        {updatedDate && (
          <div style={{ fontSize: 11, color: "#a8a8b3", marginTop: 6, textAlign: "right" }}>
            Rates updated {updatedDate}
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 10, lineHeight: 1.5 }}>
        Mid-market rate. Banks charge a spread above this rate.
      </p>

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/tools/currency-converter" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          150+ currencies → dayblip.com/tools/currency-converter
        </a>
      </div>
    </div>
  )
}
