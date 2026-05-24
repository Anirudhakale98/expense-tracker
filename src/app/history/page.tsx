"use client";

import { PageShell } from "@/components/PageShell";
import { CATEGORY_LABELS, type CategoryType } from "@/lib/categories";
import { apiFetch } from "@/lib/client-fetch";
import { formatMoney } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HistoryItem {
  label: string;
  start: string;
  end: string;
  totals: Record<CategoryType, number> & { all: number };
  expenseCount: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ history: HistoryItem[]; currency: string }>(
      "/api/periods/history?count=12"
    )
      .then((res) => {
        setHistory(res.history);
        setCurrency(res.currency);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell
      title="History"
      subtitle="Past salary cycles (26th → next salary date)"
    >
      {loading && <p className="text-center text-zinc-500">Loading…</p>}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <ul className="space-y-3">
        {history.map((h, i) => (
          <li key={h.start}>
            <Link
              href={`/history/${encodeURIComponent(h.start)}?end=${encodeURIComponent(h.end)}&label=${encodeURIComponent(h.label)}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug sm:text-base">
                    {h.label}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {h.expenseCount} expenses
                    {i === 0 && (
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        current
                      </span>
                    )}
                  </p>
                </div>
                <p className="shrink-0 text-base font-bold sm:text-lg">
                  {formatMoney(h.totals.all, currency)}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] text-zinc-500 sm:text-xs">
                {(["need", "wants", "investment"] as CategoryType[]).map(
                  (c) => (
                    <span key={c} className="truncate">
                      {CATEGORY_LABELS[c]}: {formatMoney(h.totals[c], currency)}
                    </span>
                  )
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
