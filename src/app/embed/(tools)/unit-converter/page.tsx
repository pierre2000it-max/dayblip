"use client"
import { useState } from "react"

type Category = "length" | "weight" | "temperature" | "volume"

const LENGTH_UNITS = ["mm","cm","m","km","inch","foot","yard","mile"]
const LENGTH_TO_M: Record<string,number> = { mm:0.001, cm:0.01, m:1, km:1000, inch:0.0254, foot:0.3048, yard:0.9144, mile:1609.344 }

const WEIGHT_UNITS = ["mg","g","kg","oz","lb","stone"]
const WEIGHT_TO_G: Record<string,number> = { mg:0.001, g:1, kg:1000, oz:28.3495, lb:453.592, stone:6350.29 }

const TEMP_UNITS = ["Celsius","Fahrenheit","Kelvin"]

const VOLUME_UNITS = ["ml","L","tsp","tbsp","fl oz","cup","pint","quart","gallon"]
const VOLUME_TO_ML: Record<string,number> = { ml:1, L:1000, tsp:4.92892, tbsp:14.7868, "fl oz":29.5735, cup:236.588, pint:473.176, quart:946.353, gallon:3785.41 }

function convertTemp(val: number, from: string, to: string): number {
  let c: number
  if (from === "Celsius") c = val
  else if (from === "Fahrenheit") c = (val - 32) * 5/9
  else c = val - 273.15
  if (to === "Celsius") return c
  if (to === "Fahrenheit") return c * 9/5 + 32
  return c + 273.15
}

function convertLinear(val: number, from: string, to: string, factors: Record<string,number>): number {
  return val * factors[from] / factors[to]
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 })
  if (Math.abs(n) >= 0.01) return n.toPrecision(6).replace(/\.?0+$/, "")
  return n.toExponential(4)
}

const QUICK_BUTTONS: Record<Category, { label: string; from: string; to: string; val: string }[]> = {
  length: [
    { label: "Miles→KM", from: "mile", to: "km", val: "1" },
    { label: "KM→Miles", from: "km", to: "mile", val: "1" },
    { label: "Inches→CM", from: "inch", to: "cm", val: "1" },
    { label: "Feet→Meters", from: "foot", to: "m", val: "1" },
  ],
  weight: [
    { label: "LBS→KG", from: "lb", to: "kg", val: "1" },
    { label: "KG→LBS", from: "kg", to: "lb", val: "1" },
    { label: "OZ→Grams", from: "oz", to: "g", val: "1" },
    { label: "Stone→LBS", from: "stone", to: "lb", val: "1" },
  ],
  temperature: [
    { label: "°C→°F", from: "Celsius", to: "Fahrenheit", val: "100" },
    { label: "°F→°C", from: "Fahrenheit", to: "Celsius", val: "98.6" },
    { label: "Body Temp", from: "Celsius", to: "Fahrenheit", val: "37" },
    { label: "Boiling", from: "Celsius", to: "Fahrenheit", val: "100" },
  ],
  volume: [
    { label: "Cups→ML", from: "cup", to: "ml", val: "1" },
    { label: "Gallons→L", from: "gallon", to: "L", val: "1" },
    { label: "TBSP→TSP", from: "tbsp", to: "tsp", val: "1" },
    { label: "FL OZ→ML", from: "fl oz", to: "ml", val: "1" },
  ],
}

const UNITS: Record<Category, string[]> = {
  length: LENGTH_UNITS,
  weight: WEIGHT_UNITS,
  temperature: TEMP_UNITS,
  volume: VOLUME_UNITS,
}

const DEFAULTS: Record<Category, { from: string; to: string }> = {
  length: { from: "mile", to: "km" },
  weight: { from: "lb", to: "kg" },
  temperature: { from: "Celsius", to: "Fahrenheit" },
  volume: { from: "cup", to: "ml" },
}

export default function EmbedUnitConverter() {
  const [category, setCategory] = useState<Category>("length")
  const [amount, setAmount] = useState("1")
  const [from, setFrom] = useState("mile")
  const [to, setTo] = useState("km")

  const categories: { key: Category; label: string }[] = [
    { key: "length", label: "Length" },
    { key: "weight", label: "Weight" },
    { key: "temperature", label: "Temperature" },
    { key: "volume", label: "Volume" },
  ]

  function switchCategory(cat: Category) {
    setCategory(cat)
    setFrom(DEFAULTS[cat].from)
    setTo(DEFAULTS[cat].to)
    setAmount("1")
  }

  function swap() {
    setFrom(to)
    setTo(from)
  }

  function applyQuick(q: { from: string; to: string; val: string }) {
    setFrom(q.from)
    setTo(q.to)
    setAmount(q.val)
  }

  function getResult(): string {
    const val = parseFloat(amount)
    if (isNaN(val)) return "—"
    if (category === "temperature") return fmt(convertTemp(val, from, to))
    const factors = category === "length" ? LENGTH_TO_M : category === "weight" ? WEIGHT_TO_G : VOLUME_TO_ML
    return fmt(convertLinear(val, from, to, factors))
  }

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  const units = UNITS[category]

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        📐 Unit Converter
      </h2>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: "1px solid #1e2d4a", paddingBottom: 10 }}>
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => switchCategory(c.key)}
            style={{
              flex: 1, padding: "6px 4px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: category === c.key ? "#e94560" : "transparent",
              color: category === c.key ? "#fff" : "#a8a8b3",
              border: category === c.key ? "none" : "1px solid transparent",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Quick buttons */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {QUICK_BUTTONS[category].map(q => (
          <button
            key={q.label}
            onClick={() => applyQuick(q)}
            style={{
              padding: "5px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: "#16213e", color: "#a8a8b3", border: "1px solid #1e2d4a",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "end", marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>From</span>
          <select value={from} onChange={e => setFrom(e.target.value)} style={inputStyle}>
            {units.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <button
          onClick={swap}
          style={{ background: "#16213e", border: "1px solid #1e2d4a", borderRadius: 6, color: "#a8a8b3", padding: "8px 10px", cursor: "pointer", fontSize: 14, marginTop: 18 }}
        >
          ⇄
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>To</span>
          <select value={to} onChange={e => setTo(e.target.value)} style={inputStyle}>
            {units.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 3 }}>Amount</span>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Result */}
      <div style={{ background: "#16213e", borderRadius: 8, padding: 16, marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#a8a8b3", marginBottom: 4 }}>
          {amount || "0"} {from} =
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F9A825" }}>
          {getResult()} {to}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/tools/unit-converter" target="_blank" rel="noopener noreferrer" style={{ color: "#a8a8b3", textDecoration: "none" }}>
          More unit types → dayblip.com/tools/unit-converter
        </a>
      </div>
    </div>
  )
}
