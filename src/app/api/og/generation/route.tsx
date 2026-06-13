import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const diff = searchParams.get("diff") ?? "18"
    const direction = searchParams.get("direction") ?? "less"
    const homeRatio = searchParams.get("homeRatio") ?? "7.6"
    const parentRatio = searchParams.get("parentRatio") ?? "2.8"

    const isLess = direction === "less"

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
              fontSize: "26px",
              color: "#a8a8b3",
              marginBottom: "20px",
              letterSpacing: "2px",
              display: "flex",
            }}
          >
            GENERATION SALARY COMPARISON
          </div>
          <div
            style={{
              display: "flex",
              gap: "80px",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 900,
                  color: isLess ? "#e74c3c" : "#27ae60",
                  display: "flex",
                }}
              >
                {diff}%
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: isLess ? "#e74c3c" : "#27ae60",
                  display: "flex",
                }}
              >
                {isLess ? "less" : "more"} than parents
              </div>
            </div>
            <div
              style={{
                width: "2px",
                height: "120px",
                background: "#1e2d4a",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 900,
                  color: "#e94560",
                  display: "flex",
                }}
              >
                {homeRatio}x
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#a8a8b3",
                  display: "flex",
                }}
              >
                home cost today
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#a8a8b3",
              textAlign: "center",
              display: "flex",
            }}
          >
            vs {parentRatio}x income when parents were your age
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              fontSize: "18px",
              color: "#e94560",
              fontWeight: 600,
              display: "flex",
            }}
          >
            www.dayblip.com/tools/generation-compare
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return new Response("Error generating image", { status: 500 })
  }
}
