import { getSessionFromRequest, type SessionUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export function unauthorized(message = "Please sign in") {
  return Response.json({ error: message }, { status: 401 });
}

/** Returns the logged-in user or null. */
export async function requireUser(
  req: NextRequest
): Promise<SessionUser | null> {
  return getSessionFromRequest(req);
}
