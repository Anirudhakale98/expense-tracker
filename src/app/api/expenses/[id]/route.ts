import { requireUser, unauthorized } from "@/lib/api-auth";
import { connectDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const result = await Expense.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });
    if (!result) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    return Response.json({ error: msg }, { status: 500 });
  }
}
