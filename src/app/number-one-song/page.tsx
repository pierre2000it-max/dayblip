import type { Metadata } from "next";
import NumberOneSongTool from "./NumberOneSongTool";

export const metadata: Metadata = {
  title: "What Was the #1 Song When You Were Born?",
  description: "Find out what song was #1 on the charts the exact week you were born. Discover your birthday number one hit from any year since 1960. Free tool.",
  keywords: ["number 1 song when I was born", "what song was number one on my birthday", "number one song my birth year"],
  alternates: { canonical: "https://www.dayblip.com/number-one-song" },
};

export default function NumberOneSongPage() {
  return <NumberOneSongTool />;
}
