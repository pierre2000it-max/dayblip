import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Much Does a Wedding Actually Cost in 2026?",
  "description": "The Knot's 2026 Real Weddings Study of 10,474 couples married in 2025 found the average wedding costs $34,200 at approximately $292 per guest. The median is closer to $20,000-$25,000. The full breakdown by category and region.",
  "datePublished": "2026-07-25",
  "dateModified": "2026-07-25",
  "author": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "publisher": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "url": "https://www.dayblip.com/blog/how-much-does-a-wedding-cost",
  "isAccessibleForFree": true,
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does the average US wedding cost in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "According to The Knot's 2026 Real Weddings Study which surveyed 10,474 couples married in 2025 the average US wedding costs $34,200 at approximately $292 per guest. The median — the point where half of couples spend more and half spend less — is closer to $20,000 to $25,000 making it a more useful benchmark for most couples than the average which is pulled up by a smaller number of very expensive events.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the most expensive part of a wedding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The venue is typically the single largest wedding expense representing approximately 28 to 32 percent of the total wedding budget. The venue choice also determines the catering minimum since most venues require couples to use in-house catering or approved caterers with per-head minimums. Together venue and catering typically account for 40 to 50 percent of total wedding spend.",
      },
    },
    {
      "@type": "Question",
      "name": "How much does a wedding cost per person in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Knot's 2026 Real Weddings Study found the average cost per guest is approximately $292. This means a 100-guest wedding costs approximately $29,200 in per-head costs and a 150-guest wedding costs approximately $43,800 — before fixed costs like photography flowers and music that do not scale with guest count.",
      },
    },
  ],
}

const relatedTools = [
  { title: "FI Date Calculator", href: "/tools/fi-date", description: "See how big purchases affect your financial independence date" },
  { title: "Compound Interest", href: "/tools/compound-interest", description: "See what wedding costs invested would become over time" },
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track total assets minus liabilities" },
  { title: "Savings Calculator", href: "/finance/savings-calculator", description: "Plan your wedding savings timeline" },
]

export default function HowMuchDoesAWeddingCostPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-8">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">How Much Does a Wedding Cost</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How Much Does a Wedding Actually Cost in 2026?
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most couples begin planning with a number in mind and finish the process having spent significantly more. The gap follows predictable patterns &mdash; and most of them are preventable once you see where the money actually goes.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              According to The Knot&rsquo;s 2026 Real Weddings Study &mdash; which surveyed 10,474 US couples married in 2025 and is one of the most comprehensive annual wedding surveys conducted &mdash; the average US wedding costs $34,200 at approximately $292 per guest. The median cost is closer to $20,000 to $25,000 making it a more representative benchmark for most couples since the average is pulled up by a smaller number of very expensive events. Geography is the single largest driver of cost variation: the same 150-guest wedding can cost twice as much in a major northeastern city as in the Midwest or South. The venue is the largest individual expense representing approximately 28 to 32 percent of the total budget. The venue choice determines the catering minimum which together account for roughly 40 to 50 percent of total spend.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="The average US wedding costs $34,200 in 2026 per The Knot (10,474 couples surveyed). The median is closer to $20,000-$25,000. At $292/guest cutting 30 people saves ~$8,760. The venue is the single biggest cost driver. Full breakdown by category and region:"
            url="https://www.dayblip.com/blog/how-much-does-a-wedding-cost"
            title="How Much Does a Wedding Actually Cost in 2026?"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Average vs the Median &mdash; Why One Number Matters More</h2>

          <p>
            When The Knot reports that the average wedding costs $34,200 that number is accurate. It is also not the most useful number for most people planning a wedding.
          </p>

          <p>
            The mean &mdash; the arithmetic average &mdash; is pulled upward by a relatively small number of very expensive events. A handful of $150,000 galas in Manhattan or $200,000 destination weddings in the Hamptons shift the national average considerably. The couples spending that amount are real but they are not representative of what most people actually spend.
          </p>

          <p>
            The median &mdash; the point where exactly half of couples spend more and half spend less &mdash; tells a more useful story. Based on The Knot&rsquo;s 2026 data the median US wedding cost is closer to $20,000 to $25,000.
          </p>

          <p>
            That is still a significant amount of money. But it is different from $34,200 and it is different from the six-figure numbers that appear in some wedding coverage.
          </p>

          <p>
            The Knot&rsquo;s 2026 Real Weddings Study surveyed 10,474 US couples married in 2025. Key headline numbers: average cost $34,200 average guests 117 average cost per guest approximately $292.
          </p>

          <p>
            Guest count is the single most controllable lever in the budget. At $292 per guest removing 30 people from a 150-person guest list reduces costs by approximately $8,760 &mdash; and that math applies before you have reduced photography flowers or music by a single dollar.
          </p>

          <p className="text-sm text-[#a8a8b3]">
            Source: The Knot 2026 Real Weddings Study. 10,474 couples married in 2025.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Where the Money Goes &mdash; The Six Biggest Cost Categories</h2>

          <p>
            <strong className="text-white">Venue:</strong> The single largest expense in most wedding budgets representing 28 to 32 percent of total spend. Venue costs vary more dramatically by geography than any other category. A hotel ballroom in a major northeastern city can run $8,000 to $20,000 or more for the space rental alone. A barn venue outside a mid-size midwestern city might be $2,000 to $5,000. The most important financial advice about venues is also the simplest one: set the total budget before you tour a single venue. Once you tour a venue you fall in love with a price point and every subsequent decision gets more expensive to match it.
          </p>

          <p>
            <strong className="text-white">Catering:</strong> Closely linked to the venue since most venues either include catering or require couples to use approved caterers with minimum per-head spending requirements. A sit-down dinner with standard bar service typically runs $85 to $175 per person in most markets. At 100 guests that is $8,500 to $17,500. At 150 guests: $12,750 to $26,250.
          </p>

          <p>
            <strong className="text-white">Photography and videography:</strong> Wedding photography runs $2,000 to $6,000 or more for an experienced photographer covering the full day. Videography adds $1,500 to $4,000. These are consistently the vendors couples report regretting skimping on most in post-wedding surveys.
          </p>

          <p>
            <strong className="text-white">Music:</strong> A DJ runs $1,000 to $3,000 for a reception. A live band runs $3,500 to $10,000 or more depending on the size and market. Music is one of the highest guest-satisfaction investments in most post-event research.
          </p>

          <p>
            <strong className="text-white">Flowers and d&eacute;cor:</strong> $1,500 to $6,000 for a typical mid-range wedding. One of the more value-engineerable categories: choosing seasonal flowers minimizing centerpiece complexity and focusing on a few high-impact arrangements rather than covering every surface can reduce costs meaningfully without changing the visual impression.
          </p>

          <p>
            <strong className="text-white">Wedding attire:</strong> Wedding dress: $1,000 to $5,000 plus alterations and accessories. Groom or partner attire: $300 to $800. Bridesmaid and attendant costs &mdash; which in many cases are passed to the attendants themselves &mdash; vary widely.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Geography Is the Biggest Variable by a Wide Margin</h2>

          <p>
            The identical 150-guest wedding costs dramatically different amounts depending on location. Not slightly different. Dramatically different.
          </p>

          <p>
            A ballroom wedding for 150 guests in New York City can cost $80,000 to $100,000 or more. The same guest count the same food quality the same band in a mid-sized Midwestern city might cost $35,000 to $55,000.
          </p>

          <p>
            The reason is the underlying cost of space and labor. Commercial real estate in Manhattan bears no resemblance to commercial real estate in Columbus Ohio. Catering labor reflects local wage markets. Florists photographers and bands all price according to what their local market will support.
          </p>

          <p>
            Based on available regional data: Northeast and New England: average $46,000 to $48,000. South: approximately 15 to 20 percent below the national average. Midwest: approximately 20 to 25 percent below the national average.
          </p>

          <p>
            For couples with genuine flexibility on location &mdash; or willing to consider a destination wedding in a lower-cost area &mdash; geography is the single highest-leverage financial decision in the entire planning process. More impactful than any vendor negotiation. More impactful than changing your flowers.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Hidden Costs That Inflate Every Final Bill</h2>

          <p>
            There is a consistent gap between what couples budget and what they spend. It is not because people are bad at math. It is because certain costs are genuinely difficult to anticipate from the outside.
          </p>

          <p>
            <strong className="text-white">Service charges:</strong> Most venue and catering contracts include a service charge of 18 to 22 percent on top of the per-head price. This is not the gratuity &mdash; it is a mandatory fee that appears in the fine print of most venue contracts. On a $15,000 catering bill that is $2,700 to $3,300 before anyone has been tipped.
          </p>

          <p>
            <strong className="text-white">Gratuity:</strong> Industry standard is 15 to 20 percent for catering staff and 10 to 15 percent for most other vendors. This is separate from service charges.
          </p>

          <p>
            <strong className="text-white">Overtime fees:</strong> Many venues have hard end times written into contracts. If the reception runs long &mdash; and receptions run long &mdash; overtime rates of $500 to $1,500 per hour are common.
          </p>

          <p>
            <strong className="text-white">Week-of purchases:</strong> Items forgotten in planning that get purchased at retail prices the week of the wedding. Emergency alterations. Rush delivery on forgotten items. The cake cutting fee some venues charge for cakes brought in from outside.
          </p>

          <p>
            The practical recommendation from every experienced wedding planner: build a 10 to 15 percent contingency buffer into the budget from day one. Set the vendor budget at 87 to 90 percent of the total and reserve the rest. You will use it.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "24px", textAlign: "center", margin: "32px 0" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">See how your wedding savings plan affects your financial independence date:</p>
            <Link
              href="/tools/fi-date"
              style={{ display: "inline-block", background: "#e94560", color: "white", padding: "12px 24px", borderRadius: "6px", fontWeight: 600, textDecoration: "none", fontSize: "15px" }}
            >
              FI Date Calculator &rarr;
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only. Wedding costs vary significantly based on location guest count vendor choices and personal preferences. The figures cited represent averages and ranges from available sources. Actual costs will differ.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div style={{ borderTop: "1px solid #2a3f5f", paddingTop: "32px", marginTop: "32px" }}>
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The average US wedding costs $34,200 in 2026 per The Knot (10,474 couples surveyed). The median is closer to $20,000-$25,000. At $292/guest cutting 30 people saves ~$8,760. The venue is the single biggest cost driver. Full breakdown by category and region:"
            url="https://www.dayblip.com/blog/how-much-does-a-wedding-cost"
            title="How Much Does a Wedding Actually Cost in 2026?"
          />
        </div>

      </div>
    </main>
  )
}
