import Link from "next/link"

export default function AuthorByline({ variant = "tool" }: { variant?: "tool" | "research" | "blog" }) {
  const label =
    variant === "research"
      ? "Research & analysis by"
      : variant === "blog"
      ? "Written by"
      : "Built by"

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "#1e2d4a",
        borderRadius: "8px",
        margin: "0 0 32px 0",
        flexWrap: "wrap",
      }}
    >
      <img
        src="/pierre-founder.jpg"
        alt="Pierre"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #e94560",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ color: "#a8a8b3", fontSize: "13px" }}>
          {label}{" "}
          <strong style={{ color: "#ffffff", fontWeight: "600" }}>Pierre</strong>
          <span style={{ color: "#a8a8b3" }}> — MBA, Business Strategist & AI Consultant, Founder of Dayblip</span>
        </span>
        <Link
          href="/about"
          style={{
            color: "#e94560",
            fontSize: "12px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          About the author →
        </Link>
      </div>
    </div>
  )
}
