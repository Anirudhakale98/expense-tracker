"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS, type CategoryType } from "@/lib/categories";
import { formatMoney } from "@/lib/format";

interface Props {
  totals: Record<CategoryType, number> & { all: number };
  monthlySalary: number;
  remaining: number | null;
  currency: string;
}

export function SummaryBar({ totals, monthlySalary, remaining, currency }: Props) {
  const pct =
    monthlySalary > 0
      ? Math.min(100, Math.round((totals.all / monthlySalary) * 100))
      : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg">
        <p className="text-sm opacity-90">Spent this salary cycle</p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {formatMoney(totals.all, currency)}
        </p>
        {monthlySalary > 0 && (
          <p className="mt-2 text-xs opacity-90 sm:text-sm">
            of {formatMoney(monthlySalary, currency)} salary
            {remaining !== null && (
              <span className="block sm:ml-1 sm:inline">
                · {formatMoney(Math.max(0, remaining), currency)} left
              </span>
            )}
          </p>
        )}
        {pct !== null && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(["need", "wants", "investment"] as CategoryType[]).map((c) => (
          <div
            key={c}
            className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className="mb-1 h-1 w-8 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[c] }}
            />
            <p className="text-xs text-zinc-500">{CATEGORY_LABELS[c]}</p>
            <p className="text-base font-semibold sm:text-lg">
              {formatMoney(totals[c], currency)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
