import type { Metadata } from "next";
import AnniversaryTool from "./AnniversaryTool";
export const metadata: Metadata = {
  title: "Anniversary Calculator — Traditional Gift Guide",
  description: "Calculate your anniversary milestone and find the traditional gift for it, from paper to diamond. Free anniversary calculator — no signup required.",
  keywords: ["anniversary calculator", "anniversary gifts", "traditional anniversary gifts", "how many years anniversary", "wedding anniversary calculator"],
  alternates: { canonical: "https://www.dayblip.com/anniversary" },
};
export default function AnniversaryPage() { return <AnniversaryTool />; }
