"use client";

import {
  CATEGORY_LABELS,
  SECTOR_LABELS,
  type CategoryType,
  type Sector,
} from "@/lib/categories";
import { formatMoney } from "@/lib/format";

interface Props {
  bySector: Record<string, number>;
  currency: string;
}

export function SectorBreakdown({ bySector, currency }: Props) {
  const entries = Object.entries(bySector)
    .map(([key, amount]) => {
      const [cat, sector] = key.split(":") as [CategoryType, Sector];
      return { cat, sector, amount };
    })
    .filter((e) => e.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold text-zinc-600">By sector</h2>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li
            key={`${e.cat}:${e.sector}`}
            className="flex justify-between text-sm"
          >
            <span>
              {CATEGORY_LABELS[e.cat]} · {SECTOR_LABELS[e.sector]}
            </span>
            <span className="font-medium">{formatMoney(e.amount, currency)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
