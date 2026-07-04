import type { Metadata } from "next";
import AgeCalculatorTool from "./AgeCalculatorTool";
import { generateToolSchema, generateBreadcrumbSchema } from "@/lib/seo";

const BASE = "https://www.dayblip.com";
const URL  = "/age-calculator";
const TITLE = "Age Calculator — How Old Am I?";
const DESC  = "Free age calculator. Find out exactly how old you are in years, months, weeks, days and hours. Also shows your next birthday countdown.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["age calculator", "how old am I", "age in days", "birthday calculator"],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE, description: DESC, type: "website", url: URL,
    images: [{ url: "/api/og?title=Age+Calculator&emoji=🎂&subtitle=How+old+are+you+in+days%2C+weeks+and+months", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const toolSchema = generateToolSchema(
  "Age Calculator",
  DESC,
  `${BASE}${URL}`,
);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home",           url: BASE },
  { name: "Age Calculator", url: `${BASE}${URL}` },
]);

export default function AgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AgeCalculatorTool />
    </>
  );
}
