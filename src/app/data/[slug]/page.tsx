import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedTools from "@/components/RelatedTools";
import LastUpdated from "@/components/LastUpdated";
import MethodologyNote from "@/components/MethodologyNote";
import ShareButtons from "@/components/ShareButtons";
import { breadcrumbSchema } from "@/lib/schema";
import { DAYBLIP_ORG } from "@/lib/authorSchema";
import { DATASETS, getDataset, type Dataset } from "@/data/datasets";

const BASE = "https://www.dayblip.com/data";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = getDataset(params.slug);
  if (!d) return {};
  const url = `${BASE}/${d.slug}`;
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: d.metaTitle, description: d.metaDescription, url },
    twitter: { card: "summary_large_image" },
  };
}

function fmt(v: string | number, decimals?: number): string {
  if (typeof v !== "number") return v;
  const n = decimals ?? 0;
  return v.toLocaleString("en-US", { minimumFractionDigits: n, maximumFractionDigits: n });
}

function datasetSchema(d: Dataset) {
  const url = `${BASE}/${d.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: d.title,
    description: d.metaDescription,
    url,
    dateModified: d.updatedISO,
    creator: DAYBLIP_ORG,
    isAccessibleForFree: true,
    citation: d.sources,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${url}/csv`,
    },
  };
}

export default function DatasetPage({ params }: { params: { slug: string } }) {
  const d = getDataset(params.slug);
  if (!d) notFound();
  const url = `${BASE}/${d.slug}`;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          datasetSchema(d),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "Data Bank", url: BASE },
            { name: d.title, url },
          ]),
        ]}
      />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">{d.emoji}</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">{d.title}</h1>
          <p className="text-lg text-[#a8a8b3]">{d.intro}</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Data Bank", href: "/data" }, { label: d.title }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
              Quick Answer
            </div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>{d.keyFinding}</p>
          </div>

          <div>
            <a
              href={`/data/${d.slug}/csv`}
              download={`dayblip-${d.slug}.csv`}
              style={{
                display: "inline-block",
                background: "#e94560",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Download CSV
            </a>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
              <caption style={{ captionSide: "top", textAlign: "left", color: "#a8a8b3", fontSize: "13px", paddingBottom: "8px" }}>
                {d.title}. Source: {d.sources.join("; ")}.
              </caption>
              <thead>
                <tr>
                  {d.columns.map((c) => (
                    <th
                      key={c.label}
                      scope="col"
                      style={{ textAlign: "left", padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" }}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                    {r.map((v, j) => (
                      <td key={j} style={{ padding: "8px 12px", borderBottom: "1px solid #0f3460" }}>
                        {fmt(v, d.columns[j].decimals)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>Sources</h2>
            <ul style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.7, margin: 0, paddingLeft: "20px" }}>
              {d.sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>How to cite this data</h2>
            <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
              Dayblip, &quot;{d.title}&quot;, {d.updated}, dayblip.com/data/{d.slug}. The CSV is free to use with this credit.
            </p>
          </section>

          <div>
            <MethodologyNote text={d.method} />
            <LastUpdated date={d.updated} />
          </div>

          <ShareButtons text={`${d.title}: free table and CSV from Dayblip`} url={url} title={d.title} />

          <RelatedTools
            tools={[
              { emoji: d.emoji, title: d.toolLabel, desc: "Use this data in a free interactive tool", href: d.toolHref },
              { emoji: "🗂️", title: "All Datasets", desc: "Browse the full Dayblip Data Bank", href: "/data" },
              { emoji: "📈", title: "Inflation Calculator", desc: "See what any amount was worth in past years", href: "/finance/inflation" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
