// Site-wide default stamp. Change it only when pages are actually reviewed.
// Last reviewed: October 20 2026 (titles, metadata, data claims, indexing cleanup).
export const SITE_LAST_UPDATED = "October 2026"

export default function LastUpdated({ date = SITE_LAST_UPDATED }: { date?: string }) {
  return (
    <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "8px" }}>
      Last updated: {date}
    </p>
  )
}
