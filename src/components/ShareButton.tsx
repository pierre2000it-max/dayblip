"use client";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };
  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 rounded bg-[#e94560] text-white text-sm font-medium hover:opacity-90 transition-opacity"
    >
      Share
    </button>
  );
}
