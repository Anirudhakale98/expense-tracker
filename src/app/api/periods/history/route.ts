import { connectDB } from "@/lib/mongodb";
import { checkApiAuth, unauthorized } from "@/lib/api-auth";
import type { CategoryType } from "@/lib/categories";
import { listRecentPeriods } from "@/lib/salary-period";
import { Expense } from "@/models/Expense";
import { getOrCreateSettings } from "@/models/Settings";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    const count = Number(req.nextUrl.searchParams.get("count") ?? 12);

    const periods = listRecentPeriods(
      count,
      settings.salaryDay,
      settings.customHolidays
    );

    const history = await Promise.all(
      periods.map(async (p) => {
        const expenses = await Expense.find({
          periodStart: p.start,
          periodEnd: p.end,
        });

        const totals = { need: 0, wants: 0, investment: 0, all: 0 };
        for (const e of expenses) {
          totals[e.category as CategoryType] += e.amount;
          totals.all += e.amount;
        }

        return {
          label: p.label,
          start: p.start.toISOString(),
          end: p.end.toISOString(),
          creditDate: p.creditDate.toISOString(),
          totals,
          expenseCount: expenses.length,
        };
      })
    );

    return Response.json({ history, currency: settings.currency });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load history";
    return Response.json({ error: msg }, { status: 500 });
  }
}
