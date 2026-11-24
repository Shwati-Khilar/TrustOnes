import { createRawToken, hashToken } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import { NextResponse } from "next/server";
import { resetPasswordEmail } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // SECURITY: Don't reveal whether email exists
    if (!user?.passwordHash || user.status === "SUSPENDED") {
      return NextResponse.json(
        { message: "If an account exists, a reset link was sent." },
        { status: 200 }
      );
    }

    const resetPasswordToken = createRawToken();
    const resetPasswordExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    const { count } = await prisma.user.updateMany({
      where: { id: user.id, status: { not: "SUSPENDED" }, passwordHash: { not: null } },
      data: { resetPasswordToken: hashToken(resetPasswordToken), resetPasswordExpiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;
    const userName = user.name || "there";

    if (count) await transporter.sendMail({
      from: `"TrustOnes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your TrustOnes password",
      html: resetPasswordEmail({ userName, email, resetUrl }),
    }).catch(() => console.error("RESET_EMAIL_DELIVERY_FAILED"));

    return NextResponse.json(
      { message: "If an account exists, a reset link was sent." },
      { status: 200 }
    );

  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}