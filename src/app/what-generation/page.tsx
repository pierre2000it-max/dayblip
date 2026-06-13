import type { Metadata } from "next";
import WhatGenerationTool from "./WhatGenerationTool";
export const metadata: Metadata = {
  title: "What Generation Am I? Generation Calculator",
  description: "Find out which generation you belong to. Are you a Boomer, Gen X, Millennial, Gen Z or Gen Alpha?",
  keywords: ["what generation am I", "am I a millennial", "am I gen z", "generation calculator", "boomer gen x millennial gen z"],
  alternates: { canonical: "https://www.dayblip.com/tools/generation-quiz" },
};
export default function WhatGenerationPage() { return <WhatGenerationTool />; }
