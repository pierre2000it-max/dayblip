import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Dayblip",
  description: "Dayblip privacy policy — how we collect, use and protect your data.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. Introduction",
    body: `Dayblip ("we", "us", "our") operates dayblip.com. This page informs you of our policies regarding the collection and use of personal data when you use our service, and the choices you have associated with that data. By using Dayblip, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    title: "2. Information We Collect",
    body: null,
    list: [
      "Log data — when you visit our site, our servers may automatically record information including your IP address, browser type, the pages you visited and the time of your visit.",
      "Cookies — we use cookies to enable advertising and optional analytics. Cookies are small data files stored on your device.",
      "No registration — Dayblip does not require accounts or personal registration. We do not collect names, email addresses or passwords.",
    ],
  },
  {
    title: "3. Google AdSense",
    body: `We use Google AdSense to display advertisements on our site. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalised advertising by visiting google.com/settings/ads. For more information on how Google uses data, visit google.com/policies/privacy/partners.`,
  },
  {
    title: "4. Cookies",
    body: "We use cookies for the following purposes:",
    list: [
      "Google AdSense — advertising personalisation and frequency capping.",
      "Anonymous analytics — aggregated, non-identifiable traffic statistics.",
    ],
    footer: "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our service may not function correctly.",
  },
  {
    title: "5. Third-Party Links",
    body: `Our site may contain links to other websites that are not operated by us. If you click a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over, and assume no responsibility for, the content, privacy policies or practices of any third-party sites or services.`,
  },
  {
    title: "6. Children's Privacy",
    body: `Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from a child under age 13 without verification of parental consent, we will take steps to remove that information.`,
  },
  {
    title: "7. Changes to This Policy",
    body: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`,
  },
  {
    title: "8. Contact Us",
    body: `If you have any questions about this Privacy Policy, please contact us at privacy@dayblip.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
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
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e94560]" />
                      <span className="leading-relaxed text-[#a8a8b3]">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {"footer" in s && s.footer && (
                <p className="mt-3 leading-relaxed text-[#a8a8b3]">{s.footer}</p>
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
