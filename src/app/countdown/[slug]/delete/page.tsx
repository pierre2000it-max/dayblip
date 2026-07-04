import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DeleteConfirmClient from "./DeleteConfirmClient";

export const metadata: Metadata = {
  title: "Delete Countdown | Dayblip",
  robots: { index: false, follow: false },
};

interface Props {
  params: { slug: string };
  searchParams: { token?: string };
}

export default async function DeletePage({ params, searchParams }: Props) {
  const { slug } = params;
  const token = searchParams.token ?? "";

  const { data: countdown } = await supabase
    .from("countdowns")
    .select("id, slug, event_name, photo_url, delete_token")
    .eq("slug", slug)
    .single();

  if (!countdown) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Countdown not found</h1>
          <p className="text-[#a8a8b3] mb-6">This countdown may have already been deleted.</p>
          <Link href="/countdown/create"
            className="inline-block rounded-xl bg-[#e94560] px-6 py-3 font-bold text-white hover:opacity-90">
            Create a New Countdown →
          </Link>
        </div>
      </div>
    );
  }

  if (!token || token !== countdown.delete_token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid management link</h1>
          <p className="text-[#a8a8b3] mb-6">
            The token in this link doesn&apos;t match. Use the original management link
            you saved when creating the countdown.
          </p>
          <Link href="/"
            className="inline-block rounded-xl bg-[#e94560] px-6 py-3 font-bold text-white hover:opacity-90">
            Go to Dayblip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DeleteConfirmClient
      slug={countdown.slug}
      eventName={countdown.event_name}
      photoUrl={countdown.photo_url}
      token={token}
    />
  );
}
