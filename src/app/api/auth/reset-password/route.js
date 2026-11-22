import { passwordPolicy } from "@/lib/password-policy";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const { token, password } = body || {};
    const invalid = () => NextResponse.json({ message: "Invalid or expired reset link." }, { status: 400 });
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return invalid();
    if (!passwordPolicy.safeParse(password).success) {
      return NextResponse.json({ message: "Use at least 8 characters and at most 72 UTF-8 bytes." }, { status: 400 });
    }

    const match = {
      resetPasswordToken: hashToken(token),
      resetPasswordExpiry: { gt: new Date() },
      status: { not: "SUSPENDED" },
      passwordHash: { not: null },
    };
    const user = await prisma.user.findFirst({ where: match, select: { id: true } });
    if (!user) return invalid();
    const passwordHash = await bcrypt.hash(password, 12);
    const { count } = await prisma.user.updateMany({
      where: { ...match, id: user.id, resetPasswordExpiry: { gt: new Date() } },
      data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null },
    });
    if (!count) return invalid();
    return NextResponse.json({ message: "Password reset successful." });
  } catch {
    return NextResponse.json({ message: "Unable to reset password." }, { status: 500 });
  }
}
