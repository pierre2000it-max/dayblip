import type { Metadata } from "next"
import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import AuthorByline from "@/components/AuthorByline"

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "How Popular Was Your Name the Year You Were Born?",
  description: "The year you were born, how many other babies shared your name? Using 144 years of SSA data, here is what your birth year number actually tells you.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/name-popularity",
  },
  openGraph: {
    title: "How Popular Was Your Name the Year You Were Born?",
    description: "The year you were born, how many other babies shared your name? Using 144 years of SSA data, here is what your birth year number actually tells you.",
    url: "https://www.dayblip.com/blog/name-popularity",
    type: "article",
    publishedTime: "2026-06-12T00:00:00.000Z",
    section: "Life & Identity",
  },
}

// ── JSON-LD ───────────────────────────────────────────────────────────────────

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Popular Was Your Name the Year You Were Born?",
  description: "The year you were born, how many other babies shared your name? Using 144 years of SSA data, here is what your birth year number actually tells you.",
  url: "https://www.dayblip.com/blog/name-popularity",
  publisher: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  mainEntityOfPage: "https://www.dayblip.com/blog/name-popularity",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                        item: "https://www.dayblip.com" },
    { "@type": "ListItem", position: 2, name: "Blog",                        item: "https://www.dayblip.com/blog" },
    { "@type": "ListItem", position: 3, name: "How Popular Was Your Name?",  item: "https://www.dayblip.com/blog/name-popularity" },
  ],
}

// ── Related articles ──────────────────────────────────────────────────────────

const relatedArticles = [
  { title: "Your Life as a Grid of Squares",  href: "/blog/life-in-weeks",                description: "A 90-year life is 4,680 weeks. Seeing it is different from knowing it." },
  { title: "Starting Early vs Starting Late", href: "/blog/compound-interest-early-saver", description: "Each dollar invested early does 3.5 times more work than a dollar invested later." },
  { title: "Your True Hourly Wage",           href: "/blog/true-hourly-wage",              description: "Your salary divided by 2,080 is not your real hourly rate." },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NamePopularityBlogPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-[780px] px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">How Popular Was Your Name?</span>
        </nav>

        {/* Tag + reading time */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-green-900/40 text-green-300 rounded px-2 py-1">Life &amp; Identity</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How Popular Was Your Name the Year You Were Born?
        </h1>

        {/* Subtitle */}
        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The 1-in-X number is the one that actually describes your life — not the rank, not the peak year.
        </p>

        <AuthorByline variant="blog" />
        {/* Quick Answer */}
        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              The SSA has recorded every name given to five or more American babies since 1880 — 144 years of actual Social Security applications. The 1-in-X figure divides total US births in your birth year by the number of babies who received your name that year. It tells you your actual density among the people who grew up alongside you.
            </p>
          </div>
        </section>

        {/* Share — above article */}
        <div className="mb-8">
          <ShareButtons
            text="The year you were born, how many other babies shared your name? 144 years of SSA data tells you: www.dayblip.com/blog/name-popularity"
            url="https://www.dayblip.com/blog/name-popularity"
            title="How Popular Was Your Name the Year You Were Born?"
          />
        </div>

        {/* Article body */}
        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <p>
            I looked up my own name for the first time about two years ago, mostly out of curiosity. I knew it wasn&apos;t uncommon. I didn&apos;t expect the number to hit the way it did.
          </p>

          <p>
            The year I was born, my name was given to 1 in every 89 babies. Not rare. Not top ten. Somewhere in that middle band where you spend your whole childhood sharing a name with at least one other kid in class but never feeling like a Jennifer or a Michael about it.
          </p>

          <p>
            That number told me something the name itself never could.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Data Actually Is</h2>

          <p>
            The Social Security Administration has recorded every name given to five or more American babies since 1880. Not estimates. Actual Social Security card applications — 144 years of them. For each year, the data shows how many babies received each name and where it ranked among all names that year.
          </p>

          <p>
            The dataset behind this tool contains 52,134 names. That covers nearly everything except genuinely rare names that stayed below five occurrences in a given year — which the SSA excludes to protect privacy.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Your Birth Year Is the One That Matters</h2>

          <p>
            You could look at your name&apos;s peak. You could look at where it stands today. The birth year number is the one that describes your actual life.
          </p>

          <p>
            It tells you what the classroom sounded like. How often your teacher paused at attendance. Whether you were the only one or the third one.
          </p>

          <p>
            A name that ranked #4 the year you were born is different from the same name ranking #4 today. The population is different. Total births are different. The rank alone doesn&apos;t tell you how crowded it was.
          </p>

          <p>
            The 1-in-X figure corrects for that. It tells you your actual density among the people who grew up alongside you.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Peak Year Actually Means</h2>

          <p>
            Every name has a moment. Linda peaked in 1947 — roughly 1 in every 33 girls born that year was named Linda. If you were born in 1947, you knew a lot of Lindas. Born in 1972, fewer. Born in 2005, probably none.
          </p>

          <p>
            The gap between your birth year and your name&apos;s peak year is one of the more quietly interesting things the data shows. Names that peaked decades before you were born carry a different social weight than names that were at maximum velocity the year you arrived.
          </p>

          <p>
            Some names fall out of use for thirty years and come back. The data flags these as vintage comebacks — names where the last decade runs significantly higher than the decade before it, after a long flat stretch. Ashley did this. Emma did this. These names feel simultaneously classic and current because they genuinely are both things at once.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How the Numbers Are Calculated</h2>

          <p>
            The rank is every name for your gender sorted by count in your birth year. Fourth highest count means rank 4.
          </p>

          <p>
            The 1-in-X divides total US births for your year by the count of babies with your name. For 1990, total births were 4,158,212. If 22,000 babies were named Emma that year, that is 1 in every 189. The birth totals come from CDC and SSA records.
          </p>

          <p>
            The trend compares the last ten years of data against the prior ten. A name moving more than 20% in either direction gets labeled Rising or Falling. Stable means it held within that range. Vintage Comeback means it dropped for an extended period then recovered.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">One Thing the Data Does Not Show</h2>

          <p>
            The SSA records exactly what was written on the application. Michael and Micheal are two separate names. Mike is separate from Michael. If you go by a nickname, search both — the counts will be different and both will be accurate.
          </p>

          <p>
            Hyphenated names are recorded without the hyphen. Accented characters are dropped. The dataset is comprehensive, but it captures what people wrote down, which is not always what they had in mind.
          </p>

        </article>

        {/* CTA box */}
        <div
          className="mt-12 rounded-xl p-8 text-center"
          style={{ background: "#1e2d4a", border: "1px solid #e94560" }}
        >
          <h2 className="text-white text-2xl font-bold mb-3">Find Out How Popular Your Name Was</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            Enter your name and birth year to see your rank, your 1-in-X number, your peak year, and how your name trended across every decade since 1920.
          </p>
          <Link
            href="/tools/name-popularity"
            style={{
              display: "inline-block",
              background: "#e94560",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "14px 28px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Check My Name →
          </Link>
        </div>

        {/* Related articles */}
        <RelatedTools tools={relatedArticles} />

        {/* Share — below article */}
        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The year you were born, how many other babies shared your name? 144 years of SSA data tells you: www.dayblip.com/blog/name-popularity"
            url="https://www.dayblip.com/blog/name-popularity"
            title="How Popular Was Your Name the Year You Were Born?"
          />
        </div>

      </div>
    </main>
  )
}
