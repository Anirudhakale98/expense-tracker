import { getSessionFromRequest } from "@/lib/auth";
import { unauthorized } from "@/lib/api-auth";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return unauthorized();
  return Response.json({ user });
}
