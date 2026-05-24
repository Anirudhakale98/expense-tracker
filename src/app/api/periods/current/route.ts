import { connectDB } from "@/lib/mongodb";
import { checkApiAuth, unauthorized } from "@/lib/api-auth";
import type { CategoryType } from "@/lib/categories";
import { getPeriodForDate } from "@/lib/salary-period";
import { Expense } from "@/models/Expense";
import { getOrCreateSettings } from "@/models/Settings";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    const period = getPeriodForDate(
      new Date(),
      settings.salaryDay,
      settings.customHolidays
    );

    const expenses = await Expense.find({
      periodStart: period.start,
      periodEnd: period.end,
    }).sort({ date: -1 });

    const totals = { need: 0, wants: 0, investment: 0, all: 0 };
    const bySector: Record<string, number> = {};

    for (const e of expenses) {
      totals[e.category as CategoryType] += e.amount;
      totals.all += e.amount;
      const key = `${e.category}:${e.sector}`;
      bySector[key] = (bySector[key] ?? 0) + e.amount;
    }

    return Response.json({
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString(),
        label: period.label,
        creditDate: period.creditDate.toISOString(),
      },
      settings: {
        monthlySalary: settings.monthlySalary,
        currency: settings.currency,
        salaryDay: settings.salaryDay,
      },
      totals,
      bySector,
      expenses,
      remaining:
        settings.monthlySalary > 0
          ? settings.monthlySalary - totals.all
          : null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load period";
    return Response.json({ error: msg }, { status: 500 });
  }
}
