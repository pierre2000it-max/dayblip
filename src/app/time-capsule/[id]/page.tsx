import type { Metadata } from "next";
import CapsuleView from "./CapsuleView";

export const metadata: Metadata = {
  title: "Time Capsule — A Message from the Past",
  description: "Open a shared Dayblip time capsule. A message sealed for the future, waiting to be unlocked.",
};

export default async function CapsuleIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CapsuleView id={id} />;
}
