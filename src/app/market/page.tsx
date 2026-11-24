import type { Metadata } from "next";
import Link from "next/link";
import seoPages from "@/data/seo-pages.json";

interface SeoPage {
  zip: string;
  state: string;
  state_name: string;
  category_slug: string;
  category_display: string;
  band_low: number;
  band_high: number;
  url_path: string;
}

const pages = seoPages as SeoPage[];

const TITLE = "Local Market Scores by City & Category — Dayblip";
const DESC =
  "Real market viability scores for local service businesses across US cities — auto detailing, lawn care, cleaning, pressure washing, and more. Powered by Ziplicit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/market" },
  openGraph: { title: TITLE, description: DESC, type: "website", url: "/market" },
};

function bandWord(low: number): string {
  if (low >= 80) return "Strong";
  if (low >= 65) return "Favorable";
  if (low >= 50) return "Mixed";
  if (low >= 35) return "Challenging";
  return "Poor";
}

export default function MarketHub() {
  // Group by state, then by category, for a scannable index.
  const byState = new Map<string, { stateName: string; pages: SeoPage[] }>();
  for (const p of pages) {
    if (!byState.has(p.state)) byState.set(p.state, { stateName: p.state_name, pages: [] });
    byState.get(p.state)!.pages.push(p);
  }

  const sortedStates = Array.from(byState.entries()).sort(
    (a, b) => b[1].pages.length - a[1].pages.length
  );

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, margin: "0 0 12px", color: "#111827" }}>
        Local Market Scores by City & Category
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 32 }}>
        {pages.length} real market scores for local service businesses, computed from US Census,
        BLS, and Google Maps Platform data — not estimates. Don&apos;t see your ZIP?{" "}
        <a href="/zip-score" style={{ color: "#1d4ed8" }}>
          Run a free score for it instantly →
        </a>
      </p>

      {sortedStates.map(([stateCode, { stateName, pages: statePages }]) => {
        const byCategory = new Map<string, SeoPage[]>();
        for (const p of statePages) {
          if (!byCategory.has(p.category_slug)) byCategory.set(p.category_slug, []);
          byCategory.get(p.category_slug)!.push(p);
        }

        return (
          <section key={stateCode} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 14px", color: "#111827" }}>
              {stateName}
            </h2>
            {Array.from(byCategory.entries()).map(([catSlug, catPages]) => (
              <div key={catSlug} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
                  {catPages[0].category_display}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {catPages
                    .sort((a, b) => a.zip.localeCompare(b.zip))
                    .map((p) => (
                      <Link
                        key={p.url_path}
                        href={p.url_path}
                        style={{
                          fontSize: 13,
                          color: "#1d4ed8",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: 6,
                          padding: "4px 10px",
                          textDecoration: "none",
                        }}
                      >
                        {p.zip} · {bandWord(p.band_low)}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
