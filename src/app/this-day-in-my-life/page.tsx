import type { Metadata } from "next";
import ThisDayInMyLifeTool from "./ThisDayInMyLifeTool";

export const metadata: Metadata = {
  title: "This Day in Your Life — Your Personal Life Timeline",
  description: "Discover what was happening in the world on your milestone days, with a personal life timeline and world events. Free — no signup required.",
  keywords: ["this day in my life", "my life timeline", "what happened on my 10000th day", "personal history timeline"],
  alternates: { canonical: "https://www.dayblip.com/this-day-in-my-life" },
};

export default function ThisDayInMyLifePage() {
  return <ThisDayInMyLifeTool />;
}
