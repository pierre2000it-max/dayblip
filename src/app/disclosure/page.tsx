import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Dayblip affiliate disclosure — how we earn commissions and how it affects you.",
  alternates: { canonical: "https://www.dayblip.com/disclosure" },
};

const SECTIONS = [
  {
    title: "1. What This Means",
    body: `Dayblip.com participates in affiliate marketing programs with financial services companies including but not limited to SoFi, NerdWallet, Credit Karma, and Marcus by Goldman Sachs.\n\nSome links on this site are affiliate links. This means if you click a link and sign up for or purchase a product, Dayblip may earn a commission. This comes at no additional cost to you.`,
  },
  {
    title: "2. What This Does Not Affect",
    body: `Affiliate compensation does not influence our tool results, calculator outputs, or content recommendations. All tools on Dayblip are and will remain 100% free to use. We only recommend products and services we believe provide genuine value.`,
  },
  {
    title: "3. Our Promise",
    body: `We will always be transparent about affiliate relationships. Every page that contains an affiliate link is clearly disclosed. We never recommend a product solely because it pays a commission.`,
  },
  {
    title: "4. Contact",
    body: `If you have any questions about our affiliate relationships or this disclosure, contact us at hello@dayblip.com`,
  },
];

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Affiliate Disclosure</h1>
          <p className="text-[#a8a8b3]">Last updated: July 2026</p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="mb-4 text-xl font-bold text-[#e94560]">{s.title}</h2>
              {s.body.split("\n\n").map((para, i) => (
                <p key={i} className="leading-relaxed text-[#a8a8b3] mb-4 last:mb-0">{para}</p>
              ))}
            </div>
          ))}

          <div className="border-t border-[#0f3460] pt-8">
            <Link href="/"
              className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
