"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Conversion tables ─────────────────────────────────────────────────────────
// All values convert to/from a base unit (SI or common reference)

type Unit = { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }

function lin(factor: number): Unit["toBase"] { return v => v * factor }
function linFrom(factor: number): Unit["fromBase"] { return v => v / factor }

const LENGTH: Unit[] = [
  { label: "Millimeter (mm)",   toBase: lin(0.001),       fromBase: linFrom(0.001) },
  { label: "Centimeter (cm)",   toBase: lin(0.01),        fromBase: linFrom(0.01) },
  { label: "Meter (m)",         toBase: lin(1),           fromBase: linFrom(1) },
  { label: "Kilometer (km)",    toBase: lin(1000),        fromBase: linFrom(1000) },
  { label: "Inch (in)",         toBase: lin(0.0254),      fromBase: linFrom(0.0254) },
  { label: "Foot (ft)",         toBase: lin(0.3048),      fromBase: linFrom(0.3048) },
  { label: "Yard (yd)",         toBase: lin(0.9144),      fromBase: linFrom(0.9144) },
  { label: "Mile (mi)",         toBase: lin(1609.344),    fromBase: linFrom(1609.344) },
  { label: "Nautical mile",     toBase: lin(1852),        fromBase: linFrom(1852) },
]

const WEIGHT: Unit[] = [
  { label: "Milligram (mg)",  toBase: lin(0.000001),    fromBase: linFrom(0.000001) },
  { label: "Gram (g)",        toBase: lin(0.001),       fromBase: linFrom(0.001) },
  { label: "Kilogram (kg)",   toBase: lin(1),           fromBase: linFrom(1) },
  { label: "Metric ton (t)",  toBase: lin(1000),        fromBase: linFrom(1000) },
  { label: "Ounce (oz)",      toBase: lin(0.0283495),   fromBase: linFrom(0.0283495) },
  { label: "Pound (lb)",      toBase: lin(0.453592),    fromBase: linFrom(0.453592) },
  { label: "Stone (st)",      toBase: lin(6.35029),     fromBase: linFrom(6.35029) },
  { label: "US ton",          toBase: lin(907.185),     fromBase: linFrom(907.185) },
]

const TEMPERATURE: Unit[] = [
  { label: "Celsius (°C)",    toBase: v => v,               fromBase: v => v },
  { label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
  { label: "Kelvin (K)",      toBase: v => v - 273.15,       fromBase: v => v + 273.15 },
]

const VOLUME: Unit[] = [
  { label: "Milliliter (ml)",        toBase: lin(0.001),        fromBase: linFrom(0.001) },
  { label: "Liter (L)",              toBase: lin(1),            fromBase: linFrom(1) },
  { label: "US fluid oz",            toBase: lin(0.0295735),    fromBase: linFrom(0.0295735) },
  { label: "US cup",                 toBase: lin(0.236588),     fromBase: linFrom(0.236588) },
  { label: "US pint",                toBase: lin(0.473176),     fromBase: linFrom(0.473176) },
  { label: "US quart",               toBase: lin(0.946353),     fromBase: linFrom(0.946353) },
  { label: "US gallon",              toBase: lin(3.78541),      fromBase: linFrom(3.78541) },
  { label: "Imperial fluid oz",      toBase: lin(0.0284131),    fromBase: linFrom(0.0284131) },
  { label: "Imperial pint",          toBase: lin(0.568261),     fromBase: linFrom(0.568261) },
  { label: "Imperial gallon",        toBase: lin(4.54609),      fromBase: linFrom(4.54609) },
  { label: "Cubic centimeter (cc)",  toBase: lin(0.001),        fromBase: linFrom(0.001) },
  { label: "Cubic meter (m³)",       toBase: lin(1000),         fromBase: linFrom(1000) },
  { label: "Cubic inch (in³)",       toBase: lin(0.0163871),    fromBase: linFrom(0.0163871) },
  { label: "Cubic foot (ft³)",       toBase: lin(28.3168),      fromBase: linFrom(28.3168) },
]

const SPEED: Unit[] = [
  { label: "km/h",    toBase: lin(1/3.6),    fromBase: linFrom(1/3.6) },
  { label: "mph",     toBase: lin(0.44704),  fromBase: linFrom(0.44704) },
  { label: "m/s",     toBase: lin(1),        fromBase: linFrom(1) },
  { label: "ft/s",    toBase: lin(0.3048),   fromBase: linFrom(0.3048) },
  { label: "Knots",   toBase: lin(0.514444), fromBase: linFrom(0.514444) },
]

const AREA: Unit[] = [
  { label: "sq mm (mm²)",   toBase: lin(0.000001),    fromBase: linFrom(0.000001) },
  { label: "sq cm (cm²)",   toBase: lin(0.0001),      fromBase: linFrom(0.0001) },
  { label: "sq meter (m²)", toBase: lin(1),           fromBase: linFrom(1) },
  { label: "sq km (km²)",   toBase: lin(1e6),         fromBase: linFrom(1e6) },
  { label: "sq inch (in²)", toBase: lin(0.00064516),  fromBase: linFrom(0.00064516) },
  { label: "sq foot (ft²)", toBase: lin(0.092903),    fromBase: linFrom(0.092903) },
  { label: "sq yard (yd²)", toBase: lin(0.836127),    fromBase: linFrom(0.836127) },
  { label: "Acre",          toBase: lin(4046.86),     fromBase: linFrom(4046.86) },
  { label: "sq mile (mi²)", toBase: lin(2.59e6),      fromBase: linFrom(2.59e6) },
  { label: "Hectare (ha)",  toBase: lin(10000),       fromBase: linFrom(10000) },
]

const COOKING: Unit[] = [
  { label: "Teaspoon (tsp)",    toBase: lin(4.92892),   fromBase: linFrom(4.92892) },
  { label: "Tablespoon (tbsp)", toBase: lin(14.7868),   fromBase: linFrom(14.7868) },
  { label: "Cup",               toBase: lin(236.588),   fromBase: linFrom(236.588) },
  { label: "Fluid oz (fl oz)",  toBase: lin(29.5735),   fromBase: linFrom(29.5735) },
  { label: "Pint (pt)",         toBase: lin(473.176),   fromBase: linFrom(473.176) },
  { label: "Quart (qt)",        toBase: lin(946.353),   fromBase: linFrom(946.353) },
  { label: "Gallon (gal)",      toBase: lin(3785.41),   fromBase: linFrom(3785.41) },
  { label: "Milliliter (ml)",   toBase: lin(1),         fromBase: linFrom(1) },
  { label: "Liter (L)",         toBase: lin(1000),      fromBase: linFrom(1000) },
  { label: "Gram (g)",          toBase: lin(1),         fromBase: linFrom(1) },
  { label: "Ounce (oz)",        toBase: lin(28.3495),   fromBase: linFrom(28.3495) },
]

const TIME: Unit[] = [
  { label: "Second",       toBase: lin(1),         fromBase: linFrom(1) },
  { label: "Minute",       toBase: lin(60),        fromBase: linFrom(60) },
  { label: "Hour",         toBase: lin(3600),      fromBase: linFrom(3600) },
  { label: "Day",          toBase: lin(86400),     fromBase: linFrom(86400) },
  { label: "Week",         toBase: lin(604800),    fromBase: linFrom(604800) },
  { label: "Month (30d)",  toBase: lin(2592000),   fromBase: linFrom(2592000) },
  { label: "Year",         toBase: lin(31536000),  fromBase: linFrom(31536000) },
]

type TabKey = "length" | "weight" | "temperature" | "volume" | "speed" | "area" | "cooking" | "time"

const TABS: { key: TabKey; label: string; units: Unit[] }[] = [
  { key: "length",      label: "Length",      units: LENGTH },
  { key: "weight",      label: "Weight",      units: WEIGHT },
  { key: "temperature", label: "Temp",        units: TEMPERATURE },
  { key: "volume",      label: "Volume",      units: VOLUME },
  { key: "speed",       label: "Speed",       units: SPEED },
  { key: "area",        label: "Area",        units: AREA },
  { key: "cooking",     label: "Cooking",     units: COOKING },
  { key: "time",        label: "Time",        units: TIME },
]

const QUICK_PRESETS: Record<TabKey, [string, string, string, string][]> = {
  length:      [["1", "7", "Miles → KM", ""], ["1", "7", "KM → Miles", ""], ["1", "4", "Inches → CM", ""], ["1", "5", "Feet → Meters", ""]],
  weight:      [["1", "5", "KG → Lbs", ""], ["1", "2", "Lbs → KG", ""], ["1", "1", "Oz → Grams", ""], ["1", "1", "Grams → Oz", ""]],
  temperature: [["100", "0", "°C → °F", ""], ["212", "1", "°F → °C", ""], ["37", "0", "Body temp", ""]],
  volume:      [["1", "6", "Gallons → L", ""], ["1", "1", "L → Gallons", ""], ["1", "2", "Cups → ml", ""], ["1", "1", "fl oz → ml", ""]],
  speed:       [["60", "0", "mph → km/h", ""], ["100", "1", "km/h → mph", ""], ["1", "2", "m/s → mph", ""]],
  area:        [["1", "7", "Acres → m²", ""], ["1", "5", "m² → ft²", ""], ["1", "6", "km² → mi²", ""]],
  cooking:     [["1", "0", "tsp → ml", ""], ["1", "1", "tbsp → ml", ""], ["1", "2", "Cups → oz", ""], ["1", "6", "L → Cups", ""]],
  time:        [["1", "2", "Hours → min", ""], ["1", "3", "Days → hr", ""], ["1", "4", "Weeks → days", ""], ["1", "5", "Year → days", ""]],
}

function fmtResult(n: number): string {
  if (!isFinite(n)) return "—"
  if (Math.abs(n) >= 1e9) return n.toExponential(4)
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 4 })
  if (Math.abs(n) >= 1) return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 6 })
  return n.toPrecision(6)
}

export default function UnitConverterPage() {
  const [tab, setTab] = useState<TabKey>("length")
  const [amount, setAmount] = useState("1")
  const [fromIdx, setFromIdx] = useState(7) // mile default for length
  const [toIdx, setToIdx] = useState(3)     // km default for length

  const currentTab = TABS.find(t => t.key === tab)!
  const units = currentTab.units

  function convert(val: number, fi: number, ti: number): number {
    const base = units[fi]?.toBase(val) ?? 0
    return units[ti]?.fromBase(base) ?? 0
  }

  const parsed = parseFloat(amount) || 0
  const result = convert(parsed, fromIdx, toIdx)

  const fromLabel = units[fromIdx]?.label ?? ""
  const toLabel = units[toIdx]?.label ?? ""
  const shareText = `${amount} ${fromLabel} = ${fmtResult(result)} ${toLabel}. Free unit converter — no signup: www.dayblip.com/tools/unit-converter`

  function switchTab(key: TabKey) {
    setTab(key)
    setFromIdx(0)
    setToIdx(1)
    setAmount("1")
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Unit Converter", "Convert between metric and imperial units for length weight temperature volume and more", "https://www.dayblip.com/tools/unit-converter", "UtilitiesApplication"),
        faqSchema([
          { question: "How do I convert Fahrenheit to Celsius?", answer: "To convert Fahrenheit to Celsius subtract 32 then multiply by 5 divided by 9. Formula: C = (F - 32) × 5/9. Examples: 32°F = 0°C (freezing), 98.6°F = 37°C (body temperature), 212°F = 100°C (boiling), 72°F = 22.2°C (comfortable room temperature)." },
          { question: "How many kilometers in a mile?", answer: "One mile equals exactly 1.60934 kilometers. One kilometer equals 0.621371 miles. A 5K race is 3.107 miles. A 10K race is 6.214 miles. A marathon (26.2 miles) is 42.195 kilometers." },
          { question: "How many cups in a gallon?", answer: "One US gallon equals 16 US cups or 8 US pints or 4 US quarts or 128 US fluid ounces or 3.785 liters. One US cup equals 8 fluid ounces or 236.6 milliliters." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Unit Converter", url: "https://www.dayblip.com/tools/unit-converter" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Unit Converter — Metric to Imperial and Everything In Between</h1>
          <p className="text-[#a8a8b3]">Length, weight, temperature, volume, speed, area, cooking and time</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Unit Converter" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Common unit conversions: 1 mile equals 1.609 kilometers. 1 kilogram equals 2.205 pounds. To convert Fahrenheit to Celsius subtract 32 and multiply by 5 divided by 9. 100°F equals 37.8°C. 1 US gallon equals 3.785 liters. 1 inch equals 2.54 centimeters. 1 US cup equals 236.6 milliliters.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Unit conversion translates a measurement from one system to another — most commonly between the US customary system (miles, pounds, Fahrenheit, gallons) and the metric system (kilometers, kilograms, Celsius, liters) used by most of the world. This converter covers 8 categories with all common units in each.</p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t.key} onClick={() => switchTab(t.key)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
                style={{ background: tab === t.key ? "#e94560" : "#1a1a2e", color: tab === t.key ? "#fff" : "#a8a8b3", border: "1px solid #0f3460" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS[tab].map(([amt, fi, label]) => (
              <button key={label} onClick={() => { setAmount(amt); setFromIdx(parseInt(fi)); setToIdx(parseInt(fi) === fromIdx ? toIdx : parseInt(fi) + 1) }}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#4FC3F7] hover:border-[#4FC3F7] transition-colors">
                {label}
              </button>
            ))}
          </div>

          {/* Converter */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Amount</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-lg text-white focus:border-[#e94560] focus:outline-none" />
            </label>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">From</span>
                <select value={fromIdx} onChange={e => setFromIdx(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-sm text-white focus:border-[#e94560] focus:outline-none">
                  {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
                </select>
              </label>
              <button onClick={() => { setFromIdx(toIdx); setToIdx(fromIdx) }}
                className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-[#e94560] text-xl hover:border-[#e94560] transition-colors mb-0.5">
                ⇄
              </button>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">To</span>
                <select value={toIdx} onChange={e => setToIdx(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-sm text-white focus:border-[#e94560] focus:outline-none">
                  {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">{amount || "1"} {fromLabel} =</div>
            <div className="text-4xl font-black text-[#F9A825] break-all">{fmtResult(result)}</div>
            <div className="text-lg text-white mt-1">{toLabel}</div>
          </div>

          <ShareButtons text={shareText} url="https://www.dayblip.com/tools/unit-converter" title="Unit Converter" />

          <RelatedTools tools={[
            { emoji: "💱", title: "Currency Converter", desc: "Live exchange rates for 150+ currencies", href: "/tools/currency-converter" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Your actual paycheck after taxes", href: "/finance/take-home-pay" },
            { emoji: "📅", title: "Days Between Dates", desc: "Exact days between any two dates", href: "/days-between" },
            { emoji: "📊", title: "GPA Calculator", desc: "Calculate your grade point average", href: "/education/gpa-calculator" },
          ]} />
        </div>
      </section>
    </div>
  )
}
