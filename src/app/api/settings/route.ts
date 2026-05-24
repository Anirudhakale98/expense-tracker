import { connectDB } from "@/lib/mongodb";
import { checkApiAuth, unauthorized } from "@/lib/api-auth";
import { getOrCreateSettings } from "@/models/Settings";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return Response.json(settings);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load settings";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    const body = await req.json();

    if (body.salaryDay !== undefined) settings.salaryDay = body.salaryDay;
    if (body.monthlySalary !== undefined)
      settings.monthlySalary = body.monthlySalary;
    if (body.customHolidays !== undefined)
      settings.customHolidays = body.customHolidays;
    if (body.currency !== undefined) settings.currency = body.currency;

    await settings.save();
    return Response.json(settings);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to update settings";
    return Response.json({ error: msg }, { status: 500 });
  }
}
