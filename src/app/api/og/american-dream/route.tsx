import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get("state") || "the US"
  const age = searchParams.get("age") || "47"
  const years = searchParams.get("years") || "17"

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
          padding: "60px",
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
            fontSize: "26px",
            color: "#a8a8b3",
            marginBottom: "20px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          American Dream Calculator
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "24px",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          In {state}, the American Dream is achievable at age
        </div>
        <div
          style={{
            fontSize: "160px",
            fontWeight: 900,
            color: "#e94560",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          {age}
        </div>
        <div style={{ fontSize: "28px", color: "#a8a8b3" }}>
          {years} years from now
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#e94560",
            fontWeight: 600,
          }}
        >
          www.dayblip.com/tools/american-dream-calculator
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
