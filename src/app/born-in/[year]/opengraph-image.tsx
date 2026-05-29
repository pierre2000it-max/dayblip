import { ImageResponse } from "next/og";
import bornInRaw from "@/data/bornIn.json";

export const runtime     = "edge";
export const alt         = "Born In Year — Dayblip";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

interface BornIn {
  year:         number;
  number1Song:  string;
  number1Movie: string;
  gasPrice:     string;
  population:   string;
}

function trunc(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function Image({ params }: { params: { year: string } }) {
  const year  = parseInt(params.year, 10);
  const data  = (bornInRaw as BornIn[]).find((d) => d.year === year) ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          background:      "#1a1a2e",
          display:         "flex",
          flexDirection:   "column",
          padding:         "64px 80px",
          position:        "relative",
          fontFamily:      "Arial, Helvetica, sans-serif",
          color:           "#ffffff",
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "10px", background: "#e94560", display: "flex" }} />

        {/* Headline */}
        <div style={{ display: "flex", fontSize: 110, fontWeight: 900, lineHeight: 1, marginTop: "12px" }}>
          Born in&nbsp;
          <span style={{ color: "#e94560" }}>{isNaN(year) ? "?" : year}</span>
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#a8a8b3", marginTop: "20px" }}>
          Here&apos;s what the world looked like
        </div>

        {/* Data rows */}
        {data ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: "48px", gap: "0px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: 28, color: "#e94560", marginRight: "16px", fontWeight: 700 }}>🎵 #1 Song</span>
              <span style={{ fontSize: 28, color: "#ffffff" }}>{trunc(data.number1Song, 45)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: 28, color: "#e94560", marginRight: "16px", fontWeight: 700 }}>🎬 #1 Movie</span>
              <span style={{ fontSize: 28, color: "#ffffff" }}>{trunc(data.number1Movie, 45)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 28, color: "#e94560", marginRight: "16px", fontWeight: 700 }}>⛽ Gas Price</span>
              <span style={{ fontSize: 28, color: "#ffffff" }}>{data.gasPrice} per gallon</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 36, color: "#a8a8b3", marginTop: "48px" }}>
            Discover history from {isNaN(year) ? "your birth year" : year}
          </div>
        )}

        {/* Branding */}
        <div style={{ position: "absolute", bottom: "48px", right: "80px", display: "flex", alignItems: "center" }}>
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
