import { ImageResponse } from "next/og";
import holidaysRaw from "@/data/holidays.json";

export const runtime     = "edge";
export const alt         = "Days Until — Dayblip";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Holiday {
  slug:  string;
  name:  string;
  emoji: string;
  date:  string;
  color: string;
}

// ── Date helpers (duplicated here for edge-runtime isolation) ─────────────────

function getEaster(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getThanksgiving(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  return new Date(year, 10, 1 + ((4 - nov1.getDay() + 7) % 7) + 21);
}

function getBlackFriday(year: number): Date {
  const tg = getThanksgiving(year);
  return new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() + 1);
}

function getMothersDay(year: number): Date {
  const may1 = new Date(year, 4, 1);
  return new Date(year, 4, 1 + ((7 - may1.getDay()) % 7) + 7);
}

function getHolidayDate(date: string, year: number): Date {
  switch (date) {
    case "dynamic-thanksgiving": return getThanksgiving(year);
    case "dynamic-easter":       return getEaster(year);
    case "dynamic-blackfriday":  return getBlackFriday(year);
    case "dynamic-mothersday":   return getMothersDay(year);
    default: {
      const [m, d] = date.split("-").map(Number);
      return new Date(year, m - 1, d);
    }
  }
}

function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year  = today.getFullYear();
  let target  = getHolidayDate(date, year);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() <= today.getTime()) {
    target = getHolidayDate(date, year + 1);
    target.setHours(0, 0, 0, 0);
  }
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

// ── OG Image ─────────────────────────────────────────────────────────────────

export default function Image({ params }: { params: { slug: string } }) {
  const holiday = (holidaysRaw as Holiday[]).find((h) => h.slug === params.slug);
  const days    = holiday ? daysUntil(holiday.date) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width:          "100%",
          height:         "100%",
          background:     "#1a1a2e",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          fontFamily:     "Arial, Helvetica, sans-serif",
          color:          "#ffffff",
          position:       "relative",
          padding:        "60px",
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "10px", background: "#e94560", display: "flex" }} />

        {holiday ? (
          <>
            {/* Emoji */}
            <div style={{ fontSize: 130, display: "flex", marginBottom: "16px" }}>
              {holiday.emoji}
            </div>

            {/* Days count */}
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 100, fontWeight: 900, color: "#e94560", lineHeight: 1 }}>
                {days}
              </span>
              <span style={{ fontSize: 48, color: "#a8a8b3", marginLeft: "16px" }}>
                days until
              </span>
            </div>

            {/* Holiday name */}
            <div style={{ fontSize: 64, fontWeight: 900, color: "#ffffff", marginTop: "12px", display: "flex" }}>
              {holiday.name}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 64, fontWeight: 900, display: "flex" }}>
            Countdown & Date Tools
          </div>
        )}

        {/* Branding */}
        <div style={{ position: "absolute", bottom: "48px", right: "80px", display: "flex" }}>
          <span style={{ fontSize: 32, color: "#e94560", fontWeight: 700 }}>day</span>
          <span style={{ fontSize: 32, color: "#ffffff", fontWeight: 700 }}>blip.com</span>
        </div>

        {/* Bottom accent bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "8px", background: "#e94560", display: "flex" }} />
      </div>
    ),
    { ...size },
  );
}
