import Link from "next/link";

export default function DataLink({ slug, label }: { slug: string; label: string }) {
  return (
    <p style={{ color: "#a8a8b3", fontSize: "14px", marginTop: "12px" }}>
      {label}{" "}
      <Link href={`/data/${slug}`} style={{ color: "#e94560", textDecoration: "underline" }}>
        Download the table and CSV
      </Link>
      .
    </p>
  );
}
