import type { Metadata } from "next";
import PresidentsTool from "./PresidentsTool";
export const metadata: Metadata = {
  title: "US Presidential Timeline — All 47 Presidents",
  description: "Explore all US presidents in chronological order and find out which presidents served during your lifetime. Free presidents timeline — no signup required.",
  keywords: ["US presidents list", "presidential timeline", "all US presidents", "presidents in my lifetime"],
  alternates: { canonical: "https://www.dayblip.com/presidents" },
};
export default function PresidentsPage() { return <PresidentsTool />; }
