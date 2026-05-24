"use client";

import { PageShell } from "@/components/PageShell";
import { apiFetch } from "@/lib/client-fetch";
import { formatMoney } from "@/lib/format";
import { useEffect, useState } from "react";

interface Settings {
  salaryDay: number;
  monthlySalary: number;
  customHolidays: string[];
  currency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [salaryDay, setSalaryDay] = useState(26);
  const [monthlySalary, setMonthlySalary] = useState("");
  const [holidayInput, setHolidayInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch<Settings>("/api/settings").then((s) => {
      setSettings(s);
      setSalaryDay(s.salaryDay);
      setMonthlySalary(s.monthlySalary ? String(s.monthlySalary) : "");
    });
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const updated = await apiFetch<Settings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          salaryDay,
          monthlySalary: Number(monthlySalary) || 0,
          customHolidays: settings?.customHolidays ?? [],
        }),
      });
      setSettings(updated);
      setMessage("Saved");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function addHoliday() {
    if (!holidayInput || !settings) return;
    const d = holidayInput.trim();
    if (settings.customHolidays.includes(d)) return;
    setSettings({
      ...settings,
      customHolidays: [...settings.customHolidays, d].sort(),
    });
    setHolidayInput("");
  }

  function removeHoliday(d: string) {
    if (!settings) return;
    setSettings({
      ...settings,
      customHolidays: settings.customHolidays.filter((h) => h !== d),
    });
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <PageShell title="Settings">
      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Salary credit day (max)
          </label>
          <p className="mb-2 text-xs text-zinc-500">
            If this day is a weekend or bank holiday, credit moves to the
            previous working day.
          </p>
          <input
            type="number"
            min={1}
            max={28}
            value={salaryDay}
            onChange={(e) => setSalaryDay(Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Monthly salary (₹)
          </label>
          <input
            type="number"
            min={0}
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="For budget tracking"
            className={inputClass}
          />
          {settings && Number(monthlySalary) > 0 && (
            <p className="mt-1 text-xs text-zinc-500">
              Preview: {formatMoney(Number(monthlySalary), settings.currency)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Extra bank holidays
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={holidayInput}
              onChange={(e) => setHolidayInput(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addHoliday}
              className="touch-target rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium dark:border-zinc-700"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {settings?.customHolidays.map((h) => (
              <li
                key={h}
                className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs dark:bg-zinc-800"
              >
                {h}
                <button
                  type="button"
                  onClick={() => removeHoliday(h)}
                  className="touch-target px-1 text-zinc-400"
                  aria-label={`Remove ${h}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="touch-target w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white active:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>

        {message && (
          <p className="text-center text-sm text-emerald-600">{message}</p>
        )}
      </div>

      <section className="mt-8 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
          About salary cycles
        </h2>
        <p className="mt-2 leading-relaxed">
          Each cycle runs from your salary credit date until the day before the
          next credit. Food under Need = mess/daily groceries; Wants + Food =
          outings, dates, cafes.
        </p>
      </section>
    </PageShell>
  );
}
