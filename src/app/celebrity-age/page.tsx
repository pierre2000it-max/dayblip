import type { Metadata } from "next";
import CelebrityAgeTool from "./CelebrityAgeTool";

export const metadata: Metadata = {
  title: "Celebrity Age Calculator — How Old Is Any Celebrity?",
  description: "Find out how old any celebrity is today. Search any famous person to see their exact age in years, months and days plus countdown to their next birthday.",
  keywords: ["celebrity age calculator", "how old is taylor swift", "celebrity birthdays", "how old is elon musk", "celebrity age today", "famous people ages"],
  alternates: { canonical: "https://www.dayblip.com/celebrity-age" },
};

export default function CelebrityAgePage() {
  return <CelebrityAgeTool />;
}
