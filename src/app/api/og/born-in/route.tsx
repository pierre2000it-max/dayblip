import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = searchParams.get("year") || "1980"
  const song = searchParams.get("song") || ""
  const gas = searchParams.get("gas") || ""
  const pop = searchParams.get("pop") || ""

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
            marginBottom: "8px",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Born In
        </div>
        <div
          style={{
            fontSize: "180px",
            fontWeight: 900,
            color: "#e94560",
            lineHeight: 1,
            marginBottom: "32px",
          }}
        >
          {year}
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "1000px",
          }}
        >
          {song ? (
            <div
              style={{
                background: "#1e2d4a",
                padding: "16px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                color: "#e8e8e8",
                textAlign: "center",
              }}
            >
              🎵 {song}
            </div>
          ) : null}
          {gas ? (
            <div
              style={{
                background: "#1e2d4a",
                padding: "16px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                color: "#e8e8e8",
                textAlign: "center",
              }}
            >
              ⛽ ${gas}/gallon
            </div>
          ) : null}
          {pop ? (
            <div
              style={{
                background: "#1e2d4a",
                padding: "16px 24px",
                borderRadius: "8px",
                fontSize: "20px",
                color: "#e8e8e8",
                textAlign: "center",
              }}
            >
              🌍 {pop} billion people
            </div>
          ) : null}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#a8a8b3",
          }}
        >
          Find your year free — www.dayblip.com/born-in/{year}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
