"use client";

import { useState } from "react";
import {
  CATEGORY_LABELS,
  FOOD_SUB_LABELS,
  SECTORS_BY_CATEGORY,
  SECTOR_LABELS,
  getFoodSubType,
  type CategoryType,
  type Sector,
} from "@/lib/categories";
import { apiFetch } from "@/lib/client-fetch";

interface Props {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryType>("need");
  const [sector, setSector] = useState<Sector>("food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sectors = SECTORS_BY_CATEGORY[category];

  function onCategoryChange(c: CategoryType) {
    setCategory(c);
    const list = SECTORS_BY_CATEGORY[c];
    if (!list.includes(sector)) setSector(list[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          category,
          sector,
          foodSubType: sector === "food" ? getFoodSubType(category) : undefined,
          note,
          date,
        }),
      });
      setAmount("");
      setNote("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const foodHint =
    sector === "food"
      ? category === "need"
        ? FOOD_SUB_LABELS.essential
        : FOOD_SUB_LABELS.discretionary
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Amount (₹)
        </label>
        <input
          type="number"
          inputMode="decimal"
          min="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-2xl font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600">
          Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["need", "wants", "investment"] as CategoryType[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={`touch-target rounded-xl border py-3 text-sm font-medium transition active:scale-[0.98] ${
                category === c
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600">
          Sector
        </label>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`touch-target rounded-full border px-3.5 py-2.5 text-sm transition active:scale-[0.98] ${
                sector === s
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {SECTOR_LABELS[s]}
            </button>
          ))}
        </div>
        {foodHint && (
          <p className="mt-2 text-xs text-zinc-500">{foodHint}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Note (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Swiggy, movie tickets"
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="touch-target w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow active:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save expense"}
      </button>
    </form>
  );
}
