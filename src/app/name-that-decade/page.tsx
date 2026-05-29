import type { Metadata } from "next";
import NameThatDecadeTool from "./NameThatDecadeTool";
export const metadata: Metadata = {
  title: "Name That Decade Music Quiz",
  description: "Can you guess which decade these famous songs are from? Test your music knowledge in this fun decade music quiz.",
  keywords: ["name that decade quiz", "music decade quiz", "guess the decade", "80s music quiz", "90s music quiz"],
};
export default function NameThatDecadePage() { return <NameThatDecadeTool />; }
