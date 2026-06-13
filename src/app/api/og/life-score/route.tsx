import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || "0"
  const zone = searchParams.get("zone") || "Financial Health"

  const zoneColors: Record<string, string> = {
    "Financial Red Zone": "#e74c3c",
    "Financial Yellow Zone": "#f39c12",
    "Financial Green Zone": "#3498db",
    "Financial Strong Zone": "#27ae60",
    "Financial Elite Zone": "#f1c40f",
  }
  const zoneColor = zoneColors[zone] || "#e94560"

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1b2a",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "12px",
            height: "630px",
            background: "#e94560",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            fontSize: "28px",
            fontWeight: 700,
            color: "#e94560",
          }}
        >
          dayblip
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a8a8b3",
            marginBottom: "20px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Financial Life Score
        </div>
        <div
          style={{
            fontSize: "160px",
            fontWeight: 900,
            color: "#e94560",
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: "40px",
            color: "#a8a8b3",
            marginBottom: "24px",
          }}
        >
          out of 100
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: zoneColor,
            padding: "12px 32px",
            border: `3px solid ${zoneColor}`,
            borderRadius: "8px",
          }}
        >
          {zone}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#a8a8b3",
          }}
        >
          Calculate yours free at www.dayblip.com/tools/financial-life-score
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
