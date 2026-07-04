import type { Metadata } from "next";
import { Suspense } from "react";
import BirthdayCountdownClient from "./BirthdayCountdownClient";
export const metadata: Metadata = {
  title: "Birthday Countdown",
  robots: { index: false, follow: false },
};
export default function BirthdayCountdownSlugPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1a2e]" />}>
      <BirthdayCountdownClient slug={params.slug} />
    </Suspense>
  );
}
