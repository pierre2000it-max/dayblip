import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Meet Pierre — Founder of Dayblip",
  description:
    "Dayblip was built by Pierre — MBA, Business Strategist & AI Consultant, author, and entrepreneur — 200+ free tools. No signup, no paywall, no email.",
  alternates: { canonical: "https://www.dayblip.com/about" },
  openGraph: {
    title: "Meet Pierre — Founder of Dayblip",
    description:
      "Dayblip was built by Pierre — MBA, Business Strategist & AI Consultant, author, and entrepreneur — 200+ free tools. No signup, no paywall, no email.",
    type: "website",
    url: "https://www.dayblip.com/about",
    images: [{ url: "/api/og?title=Meet+Pierre&emoji=👋&subtitle=Founder+of+Dayblip", width: 1200, height: 630, alt: "Meet Pierre — Founder of Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Pierre — Founder of Dayblip",
    description:
      "Dayblip was built by Pierre — MBA, Business Strategist & AI Consultant, author, and entrepreneur — 200+ free tools. No signup, no paywall, no email.",
  },
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dayblip",
  url: "https://www.dayblip.com",
  description:
    "Free tools for curious minds — 200+ calculators for personal finance, career, life visualization, and historical curiosity.",
  founder: { "@type": "Person", name: "Pierre" },
  foundingLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressRegion: "WI", addressCountry: "US" },
  },
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pierre",
  jobTitle: "Founder, Business Strategist, AI Consultant, Author, Entrepreneur",
  description:
    "MBA, Business Strategist, AI consultant, author, servant leader, and entrepreneur. Certified Scrum Master and Agile practitioner. Founder of Dayblip and Generational Wealth 360. Published author and content creator in financial literacy and wealth building.",
  knowsAbout: [
    "Business Strategy",
    "Personal Finance",
    "Financial Literacy",
    "Generational Wealth",
    "AI Automation",
    "Data Visualization",
    "Entrepreneurship",
    "Servant Leadership",
    "Agile",
    "Scrum",
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "MBA",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Certified Scrum Master",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Agile Certified Practitioner",
    },
  ],
  worksFor: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  sameAs: ["https://www.generationalwealth360.com", "https://www.youtube.com/@GenerationalWealth360"],
  address: { "@type": "PostalAddress", addressRegion: "WI", addressCountry: "US" },
}

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://www.dayblip.com/about",
  name: "About Dayblip",
  mainEntity: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#0d1b2a", color: "#e8e8e8" }} className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 20px" }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: "32px", fontSize: "14px", color: "#a8a8b3" }}>
          <Link href="/" style={{ color: "#a8a8b3", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#ffffff" }}>About</span>
        </nav>

        {/* H1 */}
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 800, textAlign: "center", margin: "24px 0 8px 0" }}>
          About Dayblip
        </h1>

        {/* Photo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "32px 0" }}>
          <img
            src="/pierre-founder.jpg"
            alt="Pierre — Founder of Dayblip"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center center",
              border: "3px solid #e94560",
            }}
          />
          <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "8px", margin: "8px 0 0 0", textAlign: "center" }}>
            Pierre — Founder, Dayblip
          </p>
        </div>

        {/* Founder */}
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Dayblip was built by Pierre Ndongue, an MBA and entrepreneur based in Milwaukee, Wisconsin.
          Pierre built Dayblip out of frustration with financial calculator sites that were cluttered
          with ads, required signups, and gave generic answers.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          The goal was simple: build the tools he actually wanted to use — fast, honest, and completely free.
        </p>

        {/* Our Mission */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          Our Mission
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Dayblip&apos;s mission is to make personal finance and life math accessible to everyone. Every tool
          on this site is free, requires no email address, and never will require one. We believe everyone
          deserves access to the same financial clarity that expensive advisors charge for.
        </p>

        {/* What We Believe */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          What We Believe
        </h2>
        <ul style={{ margin: "0 0 20px 0", padding: 0, listStyle: "none" }}>
          {[
            "Free tools should actually be free",
            "Your data belongs to you",
            "Financial clarity should not require a subscription",
            "Good design makes hard topics easier",
          ].map((item) => (
            <li key={item} style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 8px 0", paddingLeft: "20px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Affiliate Transparency */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          Affiliate Transparency
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          How Dayblip stays free: Some finance pages on Dayblip contain affiliate links to financial
          products we genuinely recommend. If you sign up through one of our links, we may earn a
          commission at no cost to you. This is how we keep every tool free forever. See our full
          affiliate disclosure at{" "}
          <Link href="/disclosure" style={{ color: "#e94560", textDecoration: "none" }}>
            /disclosure
          </Link>
          .
        </p>

        {/* Contact */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          Contact
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Questions, feedback, or partnership inquiries:{" "}
          <a href="mailto:hello@dayblip.com" style={{ color: "#e94560", textDecoration: "none" }}>
            hello@dayblip.com
          </a>
        </p>

        {/* Closing line */}
        <span style={{ color: "#e94560", fontStyle: "italic", fontSize: "16px", display: "block", margin: "40px 0" }}>
          — Pierre, Founder of Dayblip
        </span>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid #1e2d4a", margin: "48px 0" }} />

        {/* CTA box */}
        <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "32px", textAlign: "center", margin: "0 0 48px 0" }}>
          <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px 0" }}>
            Explore the Tools
          </h2>
          <p style={{ color: "#a8a8b3", fontSize: "15px", margin: "0 0 24px 0" }}>
            200+ free tools and counting. No signup, no email, no paywall.
          </p>
          <Link
            href="/tools"
            style={{
              display: "inline-block",
              background: "#e94560",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "8px",
              padding: "14px 28px",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Browse Everything →
          </Link>
        </div>

      </div>
    </main>
  )
}
