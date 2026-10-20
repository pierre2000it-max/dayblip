import type { Metadata } from "next";
import Link from "next/link";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Dayblip privacy policy: what data we collect, how we use cookies and analytics, how we protect your information, and your choices.",
  alternates: {
    canonical: "https://www.dayblip.com/privacy",
  },
  robots: { index: true, follow: true },
};

type Section = {
  title: string;
  body: string | null;
  list?: string[];
  footer?: string;
  showCookieButton?: boolean;
};

const SECTIONS: Section[] = [
  {
    title: "1. Introduction",
    body: `Dayblip ("we", "us", "our") operates dayblip.com. This page explains what data we collect when you use our service, how we use it, and the choices you have. By using Dayblip, you agree to the practices described here.`,
  },
  {
    title: "2. Information We Collect",
    body: null,
    list: [
      "Log and usage data: when you visit, our hosting and analytics providers may record your IP address, browser type, device type, the pages you visit and the time of your visit.",
      "Cookies and similar technologies: we use them for analytics and advertising, but only after you accept them in our cookie banner. Section 4 explains how.",
      "No accounts: Dayblip does not require registration. We do not ask for your name, email address or password to use any calculator.",
      "Content you choose to publish: the shareable countdown feature stores what you enter (see section 3).",
    ],
  },
  {
    title: "3. Shareable Countdowns",
    body: `If you create a shareable countdown, we store the event name, event date, optional message, theme and optional photo you submit, along with a private management token and a view count. Anyone with the countdown link can see what you entered. Do not include private or sensitive information in a countdown. You can delete your countdown at any time using the management link shown when you create it. We cannot recover that link for you because we do not collect your email address. Calculators and tools that do not offer sharing run in your browser.`,
  },
  {
    title: "4. Cookies and Your Choices",
    body: `When you first visit, a banner asks you to accept or reject cookies. Strictly necessary cookies are always on. Analytics and advertising cookies stay off until you accept them. You can change your choice at any time:`,
    list: [
      "Strictly necessary: required for the site to function.",
      "Analytics: help us understand how visitors use the site. We also use Vercel Web Analytics to measure aggregate traffic and performance.",
      "Advertising: used by Google to show and measure ads (see section 5).",
    ],
    footer: "You can also block cookies in your browser settings. Some parts of the site may not work correctly if you do.",
    showCookieButton: true,
  },
  {
    title: "5. Google Advertising and Measurement",
    body: `We use Google AdSense to show ads on our site. Google and its partners use cookies to serve ads based on your prior visits to our site and other sites. We may also advertise Dayblip through Google Ads, and may use Google's tags for conversion measurement, Google Analytics and remarketing. These tags run only according to your cookie choices. You can opt out of personalized advertising at google.com/settings/ads or aboutads.info. To learn how Google uses data from sites that use its services, visit google.com/policies/privacy/partners.`,
  },
  {
    title: "6. Affiliate Partners",
    body: `Some pages contain affiliate links to financial companies. If you click one, the partner's site may set its own cookies and collect data under its own privacy policy. We do not control those practices. See our affiliate disclosure for the list of programs.`,
  },
  {
    title: "7. Third-Party Links",
    body: `Our site may link to websites we do not operate. We have no control over, and assume no responsibility for, the content or privacy practices of third-party sites. Review the privacy policy of every site you visit.`,
  },
  {
    title: "8. Data Retention",
    body: `Server logs and analytics data are kept by our hosting and analytics providers under their own retention policies. Shareable countdowns stay on our systems until you delete them. We do not keep any other personal data about you.`,
  },
  {
    title: "9. Your Privacy Rights",
    body: `Depending on where you live, including California, Colorado, Connecticut, Virginia and other US states, you may have the right to know what personal data we hold about you, request that we delete it, correct it, and opt out of the sale or sharing of your personal data for targeted advertising. We do not sell personal data for money. Advertising cookies may count as "sharing" under some state laws. You can opt out by rejecting advertising cookies in the banner or the preferences button above. To make a request, email privacy@dayblip.com. We respond within 45 days.`,
  },
  {
    title: "10. Children's Privacy",
    body: `Our service does not address anyone under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has given us personal data, please contact us and we will delete it.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this policy from time to time. We will post the new version on this page and update the "last updated" date. Changes take effect when posted.`,
  },
  {
    title: "12. Contact Us",
    body: `If you have questions about this Privacy Policy, email privacy@dayblip.com.`,
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
          <p className="text-[#a8a8b3]">Last updated: October 2026</p>
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
              {s.footer && (
                <p className="mt-3 leading-relaxed text-[#a8a8b3]">{s.footer}</p>
              )}
              {s.showCookieButton && (
                <div className="mt-4">
                  <CookiePreferencesButton />
                </div>
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
