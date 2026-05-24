import {
  createSessionToken,
  setSessionCookie,
  type SessionUser,
} from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const session: SessionUser = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = await createSessionToken(session);
    const res = NextResponse.json({ user: session });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Login failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
