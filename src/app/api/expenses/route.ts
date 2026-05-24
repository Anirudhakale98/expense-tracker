import { connectDB } from "@/lib/mongodb";
import { checkApiAuth, unauthorized } from "@/lib/api-auth";
import {
  getFoodSubType,
  type CategoryType,
  type Sector,
} from "@/lib/categories";
import { getPeriodForDate, isDateInPeriod } from "@/lib/salary-period";
import { Expense } from "@/models/Expense";
import { getOrCreateSettings } from "@/models/Settings";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    const filter =
      start && end
        ? { periodStart: new Date(start), periodEnd: new Date(end) }
        : {};

    const expenses = await Expense.find(filter).sort({ date: -1 }).limit(500);
    return Response.json(expenses);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load expenses";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    const body = await req.json();

    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const category = body.category as CategoryType;
    const sector = body.sector as Sector;
    if (!category || !sector) {
      return Response.json(
        { error: "Category and sector required" },
        { status: 400 }
      );
    }

    const date = body.date ? new Date(body.date) : new Date();
    const period = getPeriodForDate(
      date,
      settings.salaryDay,
      settings.customHolidays
    );

    if (!isDateInPeriod(date, period.start, period.end)) {
      return Response.json(
        { error: "Date is outside the salary period" },
        { status: 400 }
      );
    }

    let foodSubType = body.foodSubType;
    if (sector === "food") {
      foodSubType = foodSubType ?? getFoodSubType(category);
    }

    const expense = await Expense.create({
      amount,
      category,
      sector,
      foodSubType: sector === "food" ? foodSubType : undefined,
      note: body.note?.trim() || undefined,
      date,
      periodStart: period.start,
      periodEnd: period.end,
      periodLabel: period.label,
    });

    return Response.json(expense, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create expense";
    return Response.json({ error: msg }, { status: 500 });
  }
}
