import { NextRequest } from "next/server";

export function checkApiAuth(req: NextRequest): boolean {
  const secret = process.env.API_SECRET;
  if (!secret) return true;
  const header = req.headers.get("x-api-secret");
  return header === secret;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
