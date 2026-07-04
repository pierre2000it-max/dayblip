import type { Metadata } from "next";
import WeekendsLeftTool from "./WeekendsLeftTool";
export const metadata: Metadata = {
  title: "How Many Weekends Do You Have Left?",
  description: "Calculate how many weekends you have left in your life. A thought-provoking countdown to make the most of your time.",
  keywords: ["how many weekends left", "weekends remaining", "weekends left in life", "life weekends calculator"],
  alternates: { canonical: "https://www.dayblip.com/weekends-left" },
  openGraph: {
    title: "How Many Weekends Do You Have Left?",
    description: "Calculate how many weekends you have left in your life. A thought-provoking countdown to make the most of your time.",
    type: "website",
    url: "https://www.dayblip.com/weekends-left",
    images: [{ url: "/api/og?title=Weekends+Left&emoji=🏖️&subtitle=How+many+weekends+do+you+have+left+in+your+life", width: 1200, height: 630, alt: "Weekends Left" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Many Weekends Do You Have Left?",
    description: "Calculate how many weekends you have left in your life. A thought-provoking countdown to make the most of your time.",
    images: ["/api/og?title=Weekends+Left&emoji=🏖️&subtitle=How+many+weekends+do+you+have+left+in+your+life"],
  },
};
export default function WeekendsLeftPage() { return <WeekendsLeftTool />; }
