import Link from "next/link"

interface FinanceCTAProps {
  emoji: string
  headline: string
  description: string
  linkText: string
  href: string
}

export default function FinanceCTA({ emoji, headline, description, linkText, href }: FinanceCTAProps) {
  return (
    <div style={{
      background: "#1e2435",
      border: "1px solid #0f3460",
      borderRadius: "12px",
      padding: "20px 24px",
      marginTop: "24px",
    }}>
      <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "8px", fontSize: "16px" }}>
        {emoji} {headline}
      </div>
      <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px 0" }}>
        {description}
      </p>
      <Link
        href={href}
        className="finance-cta-link"
        style={{ color: "#e8445a", fontWeight: 600, fontSize: "14px" }}
      >
        → {linkText}
      </Link>
    </div>
  )
}
