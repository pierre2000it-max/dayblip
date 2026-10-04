import { DATASETS, getDataset, datasetToCsv } from "@/data/datasets";

export const dynamic = "force-static";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const d = getDataset(params.slug);
  if (!d) return new Response("Not found", { status: 404 });
  return new Response(datasetToCsv(d), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dayblip-${d.slug}.csv"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
