import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = searchParams.get("year") ?? "1980"
    const song = searchParams.get("song") ?? ""
    const gas = searchParams.get("gas") ?? ""
    const pop = searchParams.get("pop") ?? ""

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
              left: "0px",
              top: "0px",
              width: "12px",
              height: "630px",
              background: "#e94560",
              display: "flex",
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
              display: "flex",
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
              display: "flex",
            }}
          >
            BORN IN
          </div>
          <div
            style={{
              fontSize: "180px",
              fontWeight: 900,
              color: "#e94560",
              lineHeight: "1",
              marginBottom: "32px",
              display: "flex",
            }}
          >
            {year}
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "1000px",
            }}
          >
            {song ? (
              <div
                style={{
                  background: "#1e2d4a",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  color: "#e8e8e8",
                  display: "flex",
                }}
              >
                {song}
              </div>
            ) : null}
            {gas ? (
              <div
                style={{
                  background: "#1e2d4a",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  color: "#e8e8e8",
                  display: "flex",
                }}
              >
                Gas: ${gas}/gal
              </div>
            ) : null}
            {pop ? (
              <div
                style={{
                  background: "#1e2d4a",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  color: "#e8e8e8",
                  display: "flex",
                }}
              >
                {pop}B people
              </div>
            ) : null}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              fontSize: "18px",
              color: "#a8a8b3",
              display: "flex",
            }}
          >
            www.dayblip.com/born-in/{year}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return new Response("Error generating image", { status: 500 })
  }
}
