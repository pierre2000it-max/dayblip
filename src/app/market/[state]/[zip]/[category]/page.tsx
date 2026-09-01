import { notFound } from "next/navigation";
import type { Metadata } from "next";
import seoPages from "@/data/seo-pages.json";

interface SeoPage {
  zip: string;
  state: string;
  state_name: string;
  category: string;
  category_slug: string;
  category_display: string;
  population: number | null;
  band_low: number;
  band_high: number;
  assumed_pct: number | null;
  strongest_criterion: string | null;
  weakest_criterion: string | null;
  alternate_zip: string | null;
  template: "A" | "B" | "C" | "D";
  word_count: number;
  url_path: string;
  headline: string;
  direct_answer: string;
  location_context: string;
  saturation_data: string;
  spend_data: string;
  market_context: string;
  what_it_means: string;
  confidence_line: string;
  freshness_line: string;
  disclaimer: string;
  cta_url: string;
  cat_slug: string;
  generated_at: string;
}

const pages = seoPages as SeoPage[];

interface Props {
  params: { state: string; zip: string; category: string };
}

export async function generateStaticParams() {
  return pages.map((p) => ({
    state: p.state,
    zip: p.zip,
    category: p.category_slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pages.find(
    (p) => p.state === params.state && p.zip === params.zip && p.category_slug === params.category
  );
  if (!page) return { title: "Market Score — Dayblip" };
  return {
    title: `${page.headline} — Dayblip`,
    description: page.direct_answer,
  };
}

function Paragraph({ text }: { text: string }) {
  // Handle "heading\n\nbody" format used by market_context
  const parts = text.split("\n\n");
  if (parts.length === 2) {
    return (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 12px", color: "#111827" }}>
          {parts[0]}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
          {parts[1]}
        </p>
      </>
    );
  }
  return <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>{text}</p>;
}

function ScoreBand({ page }: { page: SeoPage }) {
  const confidencePct = page.assumed_pct !== null ? Math.round(100 - page.assumed_pct) : null;
  let bandWord = "Mixed";
  if (page.band_low >= 80) bandWord = "Strong";
  else if (page.band_low >= 65) bandWord = "Favorable";
  else if (page.band_low >= 50) bandWord = "Mixed";
  else if (page.band_low >= 35) bandWord = "Challenging";
  else bandWord = "Poor";

  const bandColors: Record<string, { bg: string; border: string; text: string; sub: string }> = {
    Strong: { bg: "#f0fdf4", border: "#86efac", text: "#15803d", sub: "#166534" },
    Favorable: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", sub: "#1e40af" },
    Mixed: { bg: "#fffbeb", border: "#fde68a", text: "#d97706", sub: "#92400e" },
    Challenging: { bg: "#fff7ed", border: "#fdba74", text: "#ea580c", sub: "#9a3412" },
    Poor: { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626", sub: "#991b1b" },
  };
  const c = bandColors[bandWord] ?? bandColors["Mixed"];

  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 12, padding: "24px 28px", marginBottom: 24
    }}>
      <p style={{ fontSize: 13, color: c.sub, marginBottom: 6, fontWeight: 600 }}>Score band</p>
      <p style={{ fontSize: 40, fontWeight: 800, color: c.text, margin: "0 0 4px" }}>
        {page.band_low}–{page.band_high}
      </p>
      <p style={{ fontSize: 17, fontWeight: 700, color: c.sub, margin: "0 0 12px" }}>
        {bandWord} market conditions
      </p>
      {confidencePct !== null && (
        <p style={{ fontSize: 12, color: c.sub }}>
          Score confidence: {confidencePct}% sourced data
          {page.assumed_pct !== null && page.assumed_pct > 0
            ? ` · ${Math.round(page.assumed_pct)}% inputs assumed`
            : ""}
        </p>
      )}
      {page.strongest_criterion && (
        <p style={{ fontSize: 13, color: c.sub, marginTop: 8 }}>
          ↑ Strongest: {page.strongest_criterion.replace(/_/g, " ")}
          {page.weakest_criterion
            ? ` · ↓ Weakest: ${page.weakest_criterion.replace(/_/g, " ")}`
            : ""}
        </p>
      )}
    </div>
  );
}

function CtaBlock({ page }: { page: SeoPage }) {
  return (
    <div style={{
      background: "#1d4ed8", borderRadius: 12, padding: "24px 28px",
      textAlign: "center", margin: "32px 0"
    }}>
      <p style={{ color: "#bfdbfe", fontSize: 13, margin: "0 0 6px" }}>
        The full report includes the exact score, all 7 criteria, live competitor
        names and ratings, and an estimated revenue range.
      </p>
      <a
        href={page.cta_url}
        style={{
          display: "inline-block", background: "#fff", color: "#1d4ed8",
          fontWeight: 700, fontSize: 15, padding: "12px 28px",
          borderRadius: 8, textDecoration: "none", marginTop: 8
        }}
      >
        See the full report — $99 →
      </a>
    </div>
  );
}

function InternalLinks({ page }: { page: SeoPage }) {
  const catSlug = page.category_slug;
  const zip = page.zip;
  const state = page.state;

  return (
    <div style={{ marginBottom: 24, borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>
        Related
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: 6 }}>
          <a href="https://ziplicit.com/zip-score" style={{ color: "#2563eb", fontSize: 14 }}>
            → Score any ZIP instantly at Ziplicit.com
          </a>
        </li>
        {page.alternate_zip && (
          <li style={{ marginBottom: 6 }}>
            <a
              href={`/market/${state}/${page.alternate_zip}/${catSlug}`}
              style={{ color: "#2563eb", fontSize: 14 }}
            >
              → {page.alternate_zip} — nearby ZIP with a different score
            </a>
          </li>
        )}
        <li style={{ marginBottom: 6 }}>
          {/* Link to the same ZIP for a related category */}
          {page.category !== "auto_detailing" ? (
            <a
              href={`/market/${state}/${zip}/auto-detailing`}
              style={{ color: "#2563eb", fontSize: 14 }}
            >
              → {zip} auto detailing market score
            </a>
          ) : (
            <a
              href={`/market/${state}/${zip}/lawn-care`}
              style={{ color: "#2563eb", fontSize: 14 }}
            >
              → {zip} lawn care market score
            </a>
          )}
        </li>
      </ul>
    </div>
  );
}

export default function MarketPage({ params }: Props) {
  const page = pages.find(
    (p) => p.state === params.state && p.zip === params.zip && p.category_slug === params.category
  );
  if (!page) notFound();

  // Section renderer
  const S = {
    directAnswer: (
      <p style={{ fontSize: 16, lineHeight: 1.7, color: "#111827", marginBottom: 20, fontWeight: 500 }}>
        {page.direct_answer}
      </p>
    ),
    locationContext: <Paragraph text={page.location_context} />,
    marketContext: <Paragraph text={page.market_context} />,
    whatItMeans: (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 12px", color: "#111827" }}>
          What {page.band_low >= 65 && page.band_low < 80 ? "Favorable" :
                page.band_low >= 80 ? "Strong" :
                page.band_low >= 50 ? "Mixed" :
                page.band_low >= 35 ? "Challenging" : "Poor"} conditions means
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
          {page.what_it_means}
        </p>
      </>
    ),
  };

  // Template orderings (Widget + CTA always appear after the text sections)
  const sections: Record<string, React.ReactNode[]> = {
    A: [S.directAnswer, S.locationContext, S.marketContext, S.whatItMeans],
    B: [S.locationContext, S.directAnswer, S.whatItMeans, S.marketContext],
    C: [S.directAnswer, S.whatItMeans, S.locationContext, S.marketContext],
    D: [S.locationContext, S.marketContext, S.directAnswer, S.whatItMeans],
  };
  const orderedSections = sections[page.template] ?? sections.A;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
      {/* Header breadcrumb */}
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
        {page.zip} · {page.state.toUpperCase()} · {page.category_display}
      </p>

      {/* Requirement 1: specific answerable headline */}
      <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, margin: "0 0 24px", color: "#111827" }}>
        {page.headline}
      </h1>

      {/* Template-ordered text sections */}
      {orderedSections}

      {/* Requirement 7: score widget */}
      <ScoreBand page={page} />

      {/* Requirement 4: confidence line */}
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        {page.confidence_line}
      </p>

      {/* Requirement 8: CTA with correct params */}
      <CtaBlock page={page} />

      {/* Requirement 9: internal links */}
      <InternalLinks page={page} />

      {/* Requirement 10: data freshness */}
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
        {page.freshness_line}
      </p>

      {/* Requirement 11: methodology link */}
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
        Learn how this score is calculated at{" "}
        <a href="https://ziplicit.com/methodology" style={{ color: "#6b7280" }}>
          ziplicit.com/methodology
        </a>
      </p>

      {/* Requirement 12: disclaimer */}
      <p style={{ fontSize: 11, color: "#9ca3af", borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
        {page.disclaimer}
      </p>
    </main>
  );
}
