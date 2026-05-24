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
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return Response.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const session: SessionUser = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = await createSessionToken(session);
    const res = NextResponse.json({
      user: session,
    });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Registration failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
