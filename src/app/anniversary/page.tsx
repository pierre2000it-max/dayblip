import type { Metadata } from "next";
import AnniversaryTool from "./AnniversaryTool";
export const metadata: Metadata = {
  title: "Anniversary Calculator — Traditional Gift Guide",
  description: "Calculate your anniversary milestone and find the traditional gift. From paper to diamond anniversaries.",
  keywords: ["anniversary calculator", "anniversary gifts", "traditional anniversary gifts", "how many years anniversary", "wedding anniversary calculator"],
};
export default function AnniversaryPage() { return <AnniversaryTool />; }
