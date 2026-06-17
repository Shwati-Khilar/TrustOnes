import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import { NextResponse } from "next/server";
import { resetPasswordEmail } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // SECURITY: Don't reveal whether email exists
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a reset link was sent." },
        { status: 200 }
      );
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetPasswordExpiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;
    const userName = user.name || "there";

    await transporter.sendMail({
      from: `"TrustOnes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your TrustOnes password",
      html: resetPasswordEmail({ userName, email, resetUrl }),
    });

    return NextResponse.json(
      { message: "If an account exists, a reset link was sent." },
      { status: 200 }
    );

  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}