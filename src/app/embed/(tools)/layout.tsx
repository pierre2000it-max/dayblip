import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Hide main site header and footer for embed context */}
      <style>{`
        header { display: none !important; }
        footer { display: none !important; }
        body { background: #0d1b2a !important; margin: 0; padding: 0; }
      `}</style>

      <div
        style={{
          padding: "20px",
          minHeight: "calc(100vh - 44px)",
          background: "#0d1b2a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </div>

      {/* Dayblip branding footer — required for embed attribution */}
      <div
        style={{
          borderTop: "1px solid #1e2d4a",
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a1628",
        }}
      >
        <span style={{ fontSize: "12px", color: "#a8a8b3" }}>
          Free tool by{" "}
          <a
            href="https://www.dayblip.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#e94560",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Dayblip.com
          </a>
        </span>
        <a
          href="https://www.dayblip.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            color: "#a8a8b3",
            textDecoration: "none",
          }}
        >
          200+ Free Tools →
        </a>
      </div>
    </>
  )
}
