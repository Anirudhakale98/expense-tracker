"use client";

import {
  CATEGORY_LABELS,
  FOOD_SUB_LABELS,
  SECTOR_LABELS,
  type CategoryType,
  type FoodSubType,
  type Sector,
} from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import { format } from "date-fns";

export interface ExpenseItem {
  _id: string;
  amount: number;
  category: CategoryType;
  sector: Sector;
  foodSubType?: FoodSubType;
  note?: string;
  date: string;
}

interface Props {
  expenses: ExpenseItem[];
  currency: string;
  onDelete?: (id: string) => void;
}

export function ExpenseList({ expenses, currency, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No expenses yet. Tap Add to log one.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {expenses.map((e) => (
        <li
          key={e._id}
          className="flex items-start justify-between gap-3 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {CATEGORY_LABELS[e.category]} · {SECTOR_LABELS[e.sector]}
            </p>
            {e.sector === "food" && e.foodSubType && (
              <p className="text-xs text-zinc-500">
                {FOOD_SUB_LABELS[e.foodSubType]}
              </p>
            )}
            {e.note && (
              <p className="truncate text-sm text-zinc-500">{e.note}</p>
            )}
            <p className="text-xs text-zinc-400">
              {format(new Date(e.date), "d MMM yyyy")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {formatMoney(e.amount, currency)}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(e._id)}
                className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                aria-label="Delete"
              >
                ×
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
