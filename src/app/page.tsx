"use client";

import { ExpenseList, type ExpenseItem } from "@/components/ExpenseList";
import { PageShell } from "@/components/PageShell";
import { SectorBreakdown } from "@/components/SectorBreakdown";
import { SummaryBar } from "@/components/SummaryBar";
import { apiFetch } from "@/lib/client-fetch";
import type { CategoryType } from "@/lib/categories";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface PeriodData {
  period: { label: string; start: string; end: string; creditDate: string };
  settings: { monthlySalary: number; currency: string };
  totals: Record<CategoryType, number> & { all: number };
  bySector: Record<string, number>;
  expenses: ExpenseItem[];
  remaining: number | null;
}

export default function HomePage() {
  const [data, setData] = useState<PeriodData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<PeriodData>("/api/periods/current");
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense?")) return;
    try {
      await apiFetch(`/api/expenses/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <PageShell
      title="Expense Tracker"
      subtitle={data?.period.label}
      action={
        <Link
          href="/add"
          className="touch-target inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow active:bg-emerald-700"
        >
          + Add
        </Link>
      }
    >
      {loading && (
        <p className="py-12 text-center text-zinc-500">Loading…</p>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950">
          <p className="font-medium text-amber-800 dark:text-amber-200">
            Setup required
          </p>
          <p className="mt-1 text-amber-700 dark:text-amber-300">{error}</p>
          <p className="mt-2 text-xs text-amber-600">
            Add MONGODB_URI to .env.local — see README.
          </p>
        </div>
      )}

      {data && !loading && (
        <>
          <SummaryBar
            totals={data.totals}
            monthlySalary={data.settings.monthlySalary}
            remaining={data.remaining}
            currency={data.settings.currency}
          />

          <div className="mt-6">
            <SectorBreakdown
              bySector={data.bySector}
              currency={data.settings.currency}
            />
          </div>

          <section className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-zinc-600">
              Recent expenses
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white px-3 sm:px-4 dark:border-zinc-800 dark:bg-zinc-900">
              <ExpenseList
                expenses={data.expenses.slice(0, 20)}
                currency={data.settings.currency}
                onDelete={handleDelete}
              />
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
