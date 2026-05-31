import type { Metadata } from "next";
import DaysBetweenTool from "./DaysBetweenTool";
import { generateToolSchema, generateBreadcrumbSchema } from "@/lib/seo";

const BASE  = "https://www.dayblip.com";
const URL   = "/days-between";
const TITLE = "Days Between Dates Calculator";
const DESC  = "Calculate the exact number of days between any two dates. Find weekdays, weekends, weeks and months between dates instantly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["days between dates", "days between two dates calculator", "how many days between dates"],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE, description: DESC, type: "website", url: URL,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const toolSchema = generateToolSchema(
  "Days Between Dates Calculator",
  DESC,
  `${BASE}${URL}`,
);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home",                        url: BASE },
  { name: "Days Between Dates",          url: `${BASE}${URL}` },
]);

export default function DaysBetweenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DaysBetweenTool />
    </>
  );
}
