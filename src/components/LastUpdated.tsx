export const SITE_LAST_UPDATED = "June 2026"

export default function LastUpdated({ date = SITE_LAST_UPDATED }: { date?: string }) {
  return (
    <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "8px" }}>
      Last updated: {date}
    </p>
  )
}
