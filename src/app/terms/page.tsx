import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Dayblip terms of use — the rules governing use of dayblip.com.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing and using dayblip.com ("the site"), you accept and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our service.`,
  },
  {
    title: "2. Use of Service",
    body: "Dayblip provides free date and countdown tools for informational purposes. By using this service, you agree that you will:",
    list: [
      "Not use the site for any illegal or unauthorised purpose.",
      "Not attempt to damage, overload, or impair the servers or networks connected to the site.",
      "Not reproduce, duplicate, copy or sell any portion of the service without express written permission.",
      "Understand that all content is provided for informational purposes only.",
    ],
  },
  {
    title: "3. Intellectual Property",
    body: `All content published on dayblip.com — including but not limited to text, graphics, logos and data compilations — is the property of Dayblip unless otherwise stated. You may not reproduce, distribute or create derivative works from this content without express written permission from Dayblip.`,
  },
  {
    title: "4. Disclaimer",
    body: `Date calculations, countdowns and historical data are provided for informational and entertainment purposes only. While we strive to ensure accuracy, Dayblip cannot guarantee that all calculations are free from error. Historical data is sourced from publicly available records and may not be exhaustive. Nothing on this site constitutes financial, legal or professional advice.`,
  },
  {
    title: "5. Advertising",
    body: `Dayblip displays third-party advertisements through Google AdSense. We are not responsible for the content of advertisements displayed on our site, nor for any products or services advertised. Any transactions you enter into with advertisers are solely between you and the advertiser.`,
  },
  {
    title: "6. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, Dayblip shall not be liable for any indirect, incidental, special, consequential or punitive damages, including but not limited to loss of profits, data or goodwill, arising from or related to your use of the service. Our total liability for any claim shall not exceed the amount you paid to access the service (which is zero, as the service is free).`,
  },
  {
    title: "7. Changes to Terms",
    body: `We reserve the right to modify or replace these Terms of Use at any time at our sole discretion. When we make material changes, we will update the "last updated" date at the top of this page. Your continued use of the site following the posting of any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: "8. Affiliate Relationships",
    body: `Some content on Dayblip includes affiliate links to third-party products and services. Dayblip may receive compensation when users sign up for or purchase products through these links. All affiliate recommendations are clearly disclosed. Dayblip is not responsible for the products, services, or policies of third-party companies we link to. Use of third-party services is at your own discretion.`,
  },
  {
    title: "9. Contact",
    body: `If you have questions about these Terms of Use, please contact us at legal@dayblip.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Terms of Use</h1>
          <p className="text-[#a8a8b3]">Last updated: May 2026</p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="mb-4 text-xl font-bold text-[#e94560]">{s.title}</h2>
              {s.body && (
                <p className="leading-relaxed text-[#a8a8b3]">{s.body}</p>
              )}
              {"list" in s && s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e94560]" />
                      <span className="leading-relaxed text-[#a8a8b3]">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
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
