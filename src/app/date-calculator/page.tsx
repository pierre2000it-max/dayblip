import type { Metadata } from "next";
import DateCalculatorTool from "./DateCalculatorTool";
import { generateToolSchema, generateBreadcrumbSchema } from "@/lib/seo";

const BASE  = "https://www.dayblip.com";
const URL   = "/date-calculator";
const TITLE = "Date Calculator — Add or Subtract Days";
const DESC  = "Free date calculator. Add or subtract days, weeks, months or years from any date. Find the difference between two dates instantly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["date calculator", "add days to date", "days between dates", "what date is 90 days from today"],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE, description: DESC, type: "website", url: URL,
    images: [{ url: "/api/og?title=Date+Calculator&emoji=📅&subtitle=Add+or+subtract+days+from+any+date", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const toolSchema = generateToolSchema(
  "Date Calculator",
  DESC,
  `${BASE}${URL}`,
);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home",             url: BASE },
  { name: "Date Calculator",  url: `${BASE}${URL}` },
]);

export default function DateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DateCalculatorTool />
    </>
  );
}
