import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Dayblip team.",
  alternates: { canonical: "https://www.dayblip.com/contact" },
};

const CONTACTS = [
  { label: "General questions",     email: "hello@dayblip.com" },
  { label: "Advertising inquiries", email: "ads@dayblip.com" },
  { label: "Privacy questions",     email: "privacy@dayblip.com" },
  { label: "Legal & terms",         email: "legal@dayblip.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">✉️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
          <p className="text-lg text-[#a8a8b3]">
            Have a question or suggestion? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact cards ─────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACTS.map(({ label, email }) => (
              <div key={email}
                className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 transition-all hover:border-[#e94560]">
                <p className="mb-2 text-sm uppercase tracking-wider text-[#a8a8b3]">{label}</p>
                <a href={`mailto:${email}`}
                  className="text-[#e94560] font-semibold hover:underline">
                  {email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Note ──────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-8 text-center">
            <p className="mb-6 text-[#a8a8b3] leading-relaxed">
              Dayblip is a small independent project. We read every message and
              aim to respond within a few business days. Thank you for your
              support — it means a lot.
            </p>
            <Link href="/"
              className="inline-block rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
