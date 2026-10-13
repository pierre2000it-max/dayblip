import type { Metadata } from "next";
import CapsuleView from "./CapsuleView";

export const metadata: Metadata = {
  title: "Time Capsule — A Message from the Past",
  description: "Open a shared Dayblip time capsule: a message sealed for the future and waiting to be unlocked on its date. Free — no signup required.",
};

export default async function CapsuleIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CapsuleView id={id} />;
}
