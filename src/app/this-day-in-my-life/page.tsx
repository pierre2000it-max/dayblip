import type { Metadata } from "next";
import ThisDayInMyLifeTool from "./ThisDayInMyLifeTool";

export const metadata: Metadata = {
  title: "This Day in Your Life — Your Personal Life Timeline",
  description: "Discover what was happening in the world on your milestone days. Your personal life timeline with world events.",
  keywords: ["this day in my life", "my life timeline", "what happened on my 10000th day", "personal history timeline"],
};

export default function ThisDayInMyLifePage() {
  return <ThisDayInMyLifeTool />;
}
