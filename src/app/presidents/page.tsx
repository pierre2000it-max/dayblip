import type { Metadata } from "next";
import PresidentsTool from "./PresidentsTool";
export const metadata: Metadata = {
  title: "US Presidential Timeline — All 47 Presidents",
  description: "Explore all US presidents in chronological order. Find out which presidents served during your lifetime.",
  keywords: ["US presidents list", "presidential timeline", "all US presidents", "presidents in my lifetime"],
};
export default function PresidentsPage() { return <PresidentsTool />; }
