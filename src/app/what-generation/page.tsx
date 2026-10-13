import type { Metadata } from "next";
import WhatGenerationTool from "./WhatGenerationTool";
export const metadata: Metadata = {
  title: "What Generation Am I? Generation Calculator",
  description: "Find out which generation you belong to: Boomer, Gen X, Millennial, Gen Z, or Gen Alpha. Enter your birth year for the answer. Free — no signup required.",
  keywords: ["what generation am I", "am I a millennial", "am I gen z", "generation calculator", "boomer gen x millennial gen z"],
  alternates: { canonical: "https://www.dayblip.com/tools/generation-quiz" },
};
export default function WhatGenerationPage() { return <WhatGenerationTool />; }
