import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title") || "Free Tools for Curious Minds"
  const subtitle = searchParams.get("subtitle") || "No signup. No email. Free forever."
  const emoji = searchParams.get("emoji") || "🧮"
  const value = searchParams.get("value") || ""

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
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Red left accent bar */}
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

        {/* Dayblip wordmark top left */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#e94560",
              letterSpacing: "-0.5px",
            }}
          >
            dayblip
          </div>
          <div style={{ fontSize: "16px", color: "#a8a8b3" }}>
            Free Tools for Curious Minds
          </div>
        </div>

        {/* Main emoji */}
        <div style={{ fontSize: "80px", marginBottom: "24px" }}>{emoji}</div>

        {/* Main value if provided */}
        {value && (
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#e94560",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {value}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: value ? "32px" : "48px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "16px",
            maxWidth: "900px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#a8a8b3",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          {subtitle}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: "18px",
            color: "#e94560",
            fontWeight: 600,
          }}
        >
          www.dayblip.com
        </div>

        {/* Decorative dots top right */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex",
            gap: "8px",
          }}
        >
          {(["#e94560", "#1e2d4a", "#1e2d4a"] as string[]).map((c, i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
