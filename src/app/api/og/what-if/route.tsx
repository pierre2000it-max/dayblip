import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const amount = searchParams.get("amount") || "10,000"
  const asset = searchParams.get("asset") || "Apple"
  const year = searchParams.get("year") || "2000"
  const value = searchParams.get("value") || "3,847,000"

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
            fontSize: "28px",
            color: "#a8a8b3",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          ${amount} in {asset} in {year} would be worth
        </div>
        <div
          style={{
            fontSize: "100px",
            fontWeight: 900,
            color: "#e94560",
            lineHeight: 1,
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          ${value}
        </div>
        <div
          style={{
            fontSize: "26px",
            color: "#a8a8b3",
            marginBottom: "40px",
          }}
        >
          today
        </div>
        <div style={{ fontSize: "22px", color: "#4a5568" }}>
          What would YOUR investment be worth?
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
          www.dayblip.com/finance/what-if-i-invested
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
