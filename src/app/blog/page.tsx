"use client"

import Link from "next/link"
import { useState } from "react"

const articles = [
  {
    category: "Career",
    title: "What Your Salary Actually Pays Per Hour",
    excerpt:
      "Most people know their salary. Almost nobody knows what their job actually costs them after commuting, work food and clothing. The real number is usually 20% lower.",
    readTime: "5 min read",
    href: "/blog/true-hourly-wage",
  },
  {
    category: "Career",
    title: "Will AI Replace Your Job? Here Is What the Data Actually Shows",
    excerpt:
      "The answer is more specific and more useful than most coverage suggests. It correlates almost entirely with task type — not salary or education level.",
    readTime: "6 min read",
    href: "/blog/will-ai-replace-my-job",
  },
  {
    category: "Finance",
    title: "Paying the Minimum on Your Credit Card Is One of the Most Expensive Decisions You Can Make",
    excerpt:
      "On an $8,000 balance at 19.99% the minimum payment takes 27 years and costs $16,247 in interest. Adding $100 per month saves $13,400.",
    readTime: "5 min read",
    href: "/blog/minimum-payment-true-cost",
  },
  {
    category: "Finance",
    title: "The Math Behind Starting Early Is More Brutal Than You Think",
    excerpt:
      "Saving $200 per month from 25 to 35 then stopping completely often outperforms $500 per month from 35 to 65. The numbers explain why.",
    readTime: "5 min read",
    href: "/blog/compound-interest-early-saver",
  },
  {
    category: "Finance",
    title: "Why Missing 10 Days in the Stock Market Costs You More Than You Think",
    excerpt:
      "Missing the 10 best trading days over 20 years can cut your returns by more than half. Those days almost always follow the worst days immediately.",
    readTime: "5 min read",
    href: "/blog/market-timing-cost",
  },
  {
    category: "Finance",
    title: "The Exact Date You Could Stop Working Is a Calculation, Not a Dream",
    excerpt:
      "Financial independence is not an age — it is a number. Your annual expenses divided by 0.04. The date you hit it is calculable today.",
    readTime: "6 min read",
    href: "/blog/financial-independence-date",
  },
  {
    category: "Career",
    title: "The 10-Minute Conversation Most People Never Have — And What It Costs Them",
    excerpt:
      "Between 55% and 60% of workers never negotiate their starting salary. Starting $8,000 below market compounds to a $300,000 career earnings gap.",
    readTime: "5 min read",
    href: "/blog/salary-negotiation-guide",
  },
  {
    category: "Life",
    title: "Your Life as a Grid of Squares",
    excerpt:
      "Each square is one week. The filled ones are gone. The empty ones are still ahead. Seeing it does something that knowing the number does not.",
    readTime: "5 min read",
    href: "/blog/life-in-weeks",
  },
  {
    category: "Life",
    title: "What the World Looked Like the Year You Were Born",
    excerpt:
      "Gas prices, the number one song, world population, major events. Birth year facts hit differently when they are connected to your own existence.",
    readTime: "5 min read",
    href: "/blog/born-in-your-year",
  },
  {
    category: "Finance",
    title: "The Number Most Smokers Have Never Calculated",
    excerpt:
      "Not the health cost. The financial one. A pack-a-day habit invested instead grows to $640,000 over 40 years. Most smokers have never seen that number.",
    readTime: "5 min read",
    href: "/blog/true-cost-of-smoking",
  },
  {
    category: "Finance",
    title: "The Number on the Window Sticker Is the Least Important Number When Buying a Car",
    excerpt:
      "A $25,000 car appears to cost $495 per month. True monthly cost including insurance fuel maintenance and depreciation: $1,211. Most buyers never run this calculation.",
    readTime: "6 min read",
    href: "/blog/true-cost-of-car-ownership",
  },
  {
    category: "Finance",
    title: "Buying a Home Is Not Always Better Than Renting. Here Is the Math.",
    excerpt:
      "The break-even point where buying beats renting is typically 5-7 years. On a $400,000 home the true monthly cost is $3,400-$3,800 — not the $2,661 mortgage payment.",
    readTime: "6 min read",
    href: "/blog/rent-vs-buy-calculator",
  },
]

const CATEGORIES = ["All", "Finance", "Career", "Life"]

const categoryColors: Record<string, string> = {
  Finance: "bg-blue-900/40 text-blue-300",
  Career: "bg-purple-900/40 text-purple-300",
  Life: "bg-green-900/40 text-green-300",
}

export default function BlogPage() {
  const [active, setActive] = useState("All")

  const filtered = active === "All" ? articles : articles.filter((a) => a.category === active)

  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      {/* Hero */}
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-[700px]">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">The Dayblip Blog</h1>
          <p className="text-[#a8a8b3] text-lg">Practical articles on money, work and life. No fluff.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-[1000px] flex gap-3 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-[#e94560] text-white"
                  : "bg-[#1e2d4a] text-[#a8a8b3] hover:text-white hover:bg-[#2d3f6b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="flex flex-col bg-[#1e2d4a] rounded-xl p-6 border border-transparent hover:border-[#e94560] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                    categoryColors[article.category] ?? "bg-gray-800 text-gray-300"
                  }`}
                >
                  {article.category}
                </span>
              </div>
              <h2 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-[#e94560] transition-colors">
                {article.title}
              </h2>
              <p className="text-[#a8a8b3] text-sm leading-relaxed flex-1">{article.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[#e94560] text-xs font-medium">{article.readTime}</span>
                <span className="text-[#e94560] text-sm">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
