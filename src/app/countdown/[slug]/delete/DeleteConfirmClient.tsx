"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Props {
  slug: string;
  eventName: string;
  photoUrl: string | null;
  token: string;
}

type DeleteState = "confirm" | "deleting" | "deleted" | "error";

export default function DeleteConfirmClient({ slug, eventName, photoUrl, token }: Props) {
  const [state, setState] = useState<DeleteState>("confirm");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDelete() {
    setState("deleting");
    try {
      // Delete photo from storage if present
      if (photoUrl) {
        const filename = photoUrl.split("/").pop();
        if (filename) {
          await supabase.storage.from("countdown-photos").remove([filename]);
        }
      }

      const { error: dbError } = await supabase
        .from("countdowns")
        .delete()
        .eq("slug", slug)
        .eq("delete_token", token);

      if (dbError) throw dbError;
      setState("deleted");
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "deleted") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">Countdown Deleted</h1>
          <p className="text-[#a8a8b3] mb-6">
            Your countdown has been deleted and the link no longer works.
          </p>
          <Link
            href="/countdown/create"
            className="inline-block rounded-xl bg-[#e94560] px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Create a New Countdown →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[#0f3460] bg-[#16213e] p-8 text-center space-y-5">
          <div className="text-5xl">🗑️</div>
          <h1 className="text-2xl font-bold text-white">Delete Your Countdown</h1>
          <p className="text-[#a8a8b3]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">&ldquo;{eventName}&rdquo;</span>?
          </p>
          <p className="text-sm text-[#a8a8b3]">
            This cannot be undone. The countdown URL will stop working immediately.
          </p>

          {state === "error" && (
            <p className="rounded-lg bg-[#e94560]/10 border border-[#e94560]/30 px-4 py-3 text-sm text-[#e94560]">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/countdown/${slug}`}
              className="flex-1 rounded-xl border border-[#0f3460] py-3 text-sm font-semibold text-[#a8a8b3] text-center transition-colors hover:border-[#a8a8b3]"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              disabled={state === "deleting"}
              className="flex-1 rounded-xl bg-[#e94560] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {state === "deleting" ? "Deleting…" : "Yes, Delete It"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
