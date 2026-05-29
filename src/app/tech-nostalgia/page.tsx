import type { Metadata } from "next";
import TechNostalgiaTool from "./TechNostalgiaTool";
export const metadata: Metadata = {
  title: "Tech Nostalgia Calculator — Tech Invented in Your Lifetime",
  description: "See every major technology invented in your lifetime. Find out how many iPhones ago you were born.",
  keywords: ["tech in my lifetime", "technology nostalgia", "iphone generations", "tech timeline", "what technology existed when I was born"],
};
export default function TechNostalgiaPage() { return <TechNostalgiaTool />; }
