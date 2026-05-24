import { connectDB } from "@/lib/mongodb";
import { checkApiAuth, unauthorized } from "@/lib/api-auth";
import { Expense } from "@/models/Expense";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkApiAuth(req)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    await Expense.findByIdAndDelete(id);
    return Response.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    return Response.json({ error: msg }, { status: 500 });
  }
}
