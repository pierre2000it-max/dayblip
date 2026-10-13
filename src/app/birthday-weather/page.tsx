import type { Metadata } from "next";
import BirthdayWeatherTool from "./BirthdayWeatherTool";
export const metadata: Metadata = {
  title: "Historical Weather on Your Birthday",
  description: "Find out what the weather was typically like on the day you were born, with historical seasonal patterns by region. Free — no signup required.",
  keywords: ["weather on my birthday", "historical birthday weather", "what was weather like when I was born", "birthday weather history"],
  alternates: { canonical: "https://www.dayblip.com/birthday-weather" },
};
export default function BirthdayWeatherPage() { return <BirthdayWeatherTool />; }
