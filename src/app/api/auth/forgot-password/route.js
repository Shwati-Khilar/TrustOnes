import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    const body = await req.json();

    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // SECURITY:
    // Don't reveal whether email exists
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists, a reset link was sent.",
        },
        {
          status: 200,
        }
      );
    }

    const resetPasswordToken =
      crypto.randomBytes(32).toString("hex");

    const resetPasswordExpiry = new Date(
      Date.now() + 1000 * 60 * 30
    );

    await prisma.user.update({
      where: {
        email,
      },

      data: {
        resetPasswordToken,
        resetPasswordExpiry,
      },
    });

    const resetUrl =
      `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "Reset your password",

      html: `
        <h2>Reset Password</h2>

        <p>Click below to reset your password:</p>

        <a href="${resetUrl}">
          Reset Password
        </a>
      `,
    });

    return NextResponse.json(
      {
        message:
          "If an account exists, a reset link was sent.",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error("FORGOT_PASSWORD_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}