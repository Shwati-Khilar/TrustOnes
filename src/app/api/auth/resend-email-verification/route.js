import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { createRawToken, hashToken } from "@/lib/tokens";

const VERIFICATION_TOKEN_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return jsonResponse(
        {
          success: false,
          message: "Email is required.",
        },
        400
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    const message = "If your account is eligible, a verification email will be sent.";
    if (!user || user.emailVerified) return jsonResponse({ success: true, message });

    const rawVerificationToken = createRawToken();
    const hashedVerificationToken = hashToken(rawVerificationToken);

    const verificationTokenExpiry = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRY_MS
    );

    const { count } = await prisma.user.updateMany({
      where: {
        id: user.id,
        provider: "credentials",
        status: { not: "SUSPENDED" },
        emailVerified: false,
      },
      data: {
        verificationToken: hashedVerificationToken,
        verificationTokenExpiry,
      },
    });

    if (count) {
      await sendVerificationEmail({ to: user.email, name: user.name, token: rawVerificationToken });
    }
    return jsonResponse({ success: true, message });
  } catch (error) {
    console.error("RESEND_EMAIL_VERIFICATION_ERROR", error);

    return jsonResponse(
      {
        success: false,
        message: "Something went wrong while sending verification email.",
      },
      500
    );
  }
}
