import { PageShell } from "@/components/PageShell";
import { PeriodDetail } from "./PeriodDetail";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ start: string }>;
  searchParams: Promise<{ end?: string; label?: string }>;
}

export default async function PeriodDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { start: rawStart } = await params;
  const sp = await searchParams;
  const start = decodeURIComponent(rawStart);
  const end = sp.end ?? "";
  const label = sp.label ? decodeURIComponent(sp.label) : "Period";

  return (
    <PageShell>
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <PeriodDetail start={start} end={end} label={label} />
      </Suspense>
    </PageShell>
  );
}
