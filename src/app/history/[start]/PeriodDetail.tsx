"use client";

import { ExpenseList, type ExpenseItem } from "@/components/ExpenseList";
import { SummaryBar } from "@/components/SummaryBar";
import { apiFetch } from "@/lib/client-fetch";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Props {
  start: string;
  end: string;
  label: string;
}

export function PeriodDetail({ start, end, label }: Props) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, settings] = await Promise.all([
        apiFetch<ExpenseItem[]>(
          `/api/expenses?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
        ),
        apiFetch<{ currency: string }>("/api/settings"),
      ]);
      setExpenses(list);
      setCurrency(settings.currency);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = { need: 0, wants: 0, investment: 0, all: 0 };
  for (const e of expenses) {
    totals[e.category] += e.amount;
    totals.all += e.amount;
  }

  return (
    <>
      <Link href="/history" className="text-sm text-emerald-600">
        ← History
      </Link>
      <h1 className="mt-2 text-xl font-bold">{label}</h1>

      {loading ? (
        <p className="py-8 text-center text-zinc-500">Loading…</p>
      ) : (
        <>
          <div className="mt-4">
            <SummaryBar
              totals={totals}
              monthlySalary={0}
              remaining={null}
              currency={currency}
            />
          </div>
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
            <ExpenseList expenses={expenses} currency={currency} />
          </div>
        </>
      )}
    </>
  );
}
