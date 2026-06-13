import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get("day") || "1"
  const correct = searchParams.get("correct") === "true"
  const streak = searchParams.get("streak") || "1"

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
            fontSize: "26px",
            color: "#a8a8b3",
            marginBottom: "20px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Dayblip Daily #{day}
        </div>
        <div style={{ fontSize: "100px", marginBottom: "20px" }}>
          {correct ? "✅" : "❌"}
        </div>
        <div
          style={{
            fontSize: "40px",
            fontWeight: 700,
            color: correct ? "#27ae60" : "#e74c3c",
            marginBottom: "24px",
          }}
        >
          {correct ? "Got it right!" : "Got this one wrong"}
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#e94560",
            fontWeight: 700,
          }}
        >
          🔥 {streak} day streak
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "#a8a8b3",
          }}
        >
          Play today&apos;s financial puzzle free — www.dayblip.com/daily
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
