import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CountdownClient from "./CountdownClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from("countdowns")
    .select("event_name, event_date")
    .eq("slug", params.slug)
    .single();

  if (!data) {
    return { title: "Countdown Not Found | Dayblip" };
  }

  const title = `Countdown to ${data.event_name} | Dayblip`;
  const description = `See how many days, hours, and minutes are left until ${data.event_name} on ${data.event_date}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.dayblip.com/countdown/${params.slug}`,
      siteName: "Dayblip",
      type: "website",
    },
  };
}

export default async function CountdownPage({ params }: Props) {
  const { data: countdown } = await supabase
    .from("countdowns")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!countdown) notFound();

  return <CountdownClient countdown={countdown} />;
}
