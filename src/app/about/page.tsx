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

        {/* Intro */}
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          I built Dayblip because I got tired of the scavenger hunt.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          You know the one. You have a simple question — how much will this loan actually cost me, what was
          the world like the year I was born, how many years until I could retire — and answering it means
          opening eight tabs, getting nagged for your email on three of them, hitting a paywall on two, and
          finally cobbling together an answer from a site covered in popups.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          I thought it should be simpler than that. I&apos;m genuinely curious about money, time, and the numbers
          that shape a life — and I think that curiosity should be free to follow. So I built the version I
          wanted to exist.
        </p>

        {/* Who I am */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          Who I am
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          I&apos;m Pierre — an MBA, Business Strategist, AI consultant, author, and entrepreneur based in Wisconsin.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Over the years I&apos;ve founded several ventures, including an AI automation services company and{" "}
          <a
            href="https://www.generationalwealth360.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e94560", textDecoration: "none" }}
          >
            Generational Wealth 360
          </a>
          , where I&apos;ve authored financial literacy content and published works on wealth building and
          financial education.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          I&apos;m also a certified Scrum Master and Agile practitioner — a formal way of saying I believe good things
          get built in small, tested, intentional steps. That philosophy shows up in how Dayblip gets built:
          one tool at a time, each one designed to actually work before the next one starts.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Outside of building, I&apos;ve spent years in leadership roles guided by one principle: serve first.
          Whether leading teams or building products, the question I keep coming back to is the same — how
          does this help the people it touches? Dayblip is that question applied to tools.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          I should be upfront about one thing: I am not a certified financial planner. Dayblip&apos;s finance
          tools are built on standard, publicly documented formulas and reputable data sources — the Social
          Security Administration, the Census Bureau, the Bureau of Labor Statistics, the CDC. They&apos;re
          designed to make numbers visible and help you think clearly. They are not personalized financial
          advice, and for decisions that matter, a licensed professional is worth every penny.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          What I do bring is a genuine obsession with making complicated things understandable, and years
          spent building tools, companies, and published work around exactly that.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          If you want to go deeper on financial education topics, I also create content on YouTube at{" "}
          <a
            href="https://www.youtube.com/@GenerationalWealth360"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e94560", textDecoration: "none" }}
          >
            Generational Wealth 360
          </a>
          . It is a growing channel and every video is free.
        </p>

        {/* What Dayblip is */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          What Dayblip is
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          200+ free calculators and tools covering personal finance, career decisions, life visualization, and
          historical curiosity.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          No signup. No email required. No paywall. Free, and I intend to keep it that way.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          The tools fall into a few buckets. There are the practical ones — mortgage, debt payoff, retirement,
          take-home pay. There are the ones that show you something about your own life you&apos;d never
          calculated — your life as a grid of weeks, the number one song the day you were born, how popular
          your name was the year you arrived. And there&apos;s original research, where I run the numbers on
          questions most people never stop to ask, like how many weekends you have left.
        </p>

        {/* Why it's free */}
        <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: "48px 0 16px 0" }}>
          Why it&apos;s free
        </h2>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Because the information should be. I run ads to cover the cost of keeping the lights on, and
          that&apos;s the whole business model. You get the tools. I get to keep building them.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Giving back to the community has always been part of how I work. Free tools that help real people
          make better decisions about their money and their time — that&apos;s not a business strategy.
          It&apos;s just what I think this kind of platform should do.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          Free also means free to share. Many of Dayblip&apos;s tools can be embedded directly on your own
          website, blog, or classroom page — no cost, no catch. If a calculator here would help your readers,
          your students, or your community, take it. That&apos;s what it&apos;s for.
        </p>
        <p style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
          If something on Dayblip ever taught you something, surprised you, or made you see a number
          you&apos;d never seen before — that&apos;s the entire point. That&apos;s the thing I set out to build.
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
