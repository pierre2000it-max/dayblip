import type { Metadata } from "next";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumb from "@/components/Breadcrumb";
import LastUpdated from "@/components/LastUpdated";
import { breadcrumbSchema } from "@/lib/schema";
import { DATASETS } from "@/data/datasets";

const URL = "https://www.dayblip.com/data";
const TITLE = "Dayblip Data Bank: Free Datasets and CSV Downloads";
const DESCRIPTION =
  "Free datasets on world population, US population, baby names and historical prices, each with a table, CSV and method notes. No signup required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL },
  twitter: { card: "summary_large_image" },
};

export default function DataHubPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Dayblip Data Bank",
            description: DESCRIPTION,
            url: URL,
            hasPart: DATASETS.map((d) => ({ "@type": "Dataset", name: d.title, url: `${URL}/${d.slug}` })),
          },
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "Data Bank", url: URL },
          ]),
        ]}
      />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🗂️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Dayblip Data Bank</h1>
          <p className="text-lg text-[#a8a8b3]">Free datasets with a table, a CSV download and the method behind each number</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Data Bank" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
              Quick Answer
            </div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              The Data Bank holds {DATASETS.length} datasets: world population, US population, baby names by decade and US prices
              since 1950. Each page has a full table, a CSV file, the source name and a note on how the numbers were built. Cite
              any of them with a link to its page.
            </p>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {DATASETS.map((d) => (
              <Link
                key={d.slug}
                href={`/data/${d.slug}`}
                className="block rounded-xl border bg-[#1a1a2e] p-5"
                style={{ borderColor: "#0f3460" }}
              >
                <div style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
                  {d.emoji} {d.title}
                </div>
                <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{d.keyFinding}</p>
              </Link>
            ))}
          </div>

          <div>
            <LastUpdated date="October 2026" />
          </div>
        </div>
      </section>
    </div>
  );
}
