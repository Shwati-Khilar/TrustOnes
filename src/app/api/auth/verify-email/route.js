import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

function getBaseUrl(req) {
  const requestUrl = new URL(req.url);
  return process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
}

function redirectTo(req, path) {
  const baseUrl = getBaseUrl(req);
  return NextResponse.redirect(new URL(path, baseUrl));
}

export async function GET(req) {
  try {
    const requestUrl = new URL(req.url);
    const token = requestUrl.searchParams.get("token");

    if (!token || typeof token !== "string") {
      return redirectTo(req, "/verify-email?status=missing-token");
    }

    const hashedToken = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
      },
      select: {
        id: true,
        verificationTokenExpiry: true,
      },
    });

    if (!user) {
      return redirectTo(req, "/verify-email?status=invalid-token");
    }

    if (!user.verificationTokenExpiry || user.verificationTokenExpiry <= new Date()) {
      return redirectTo(req, "/verify-email?status=expired-token");
    }

    const { count } = await prisma.user.updateMany({
      where: {
        id: user.id,
        verificationToken: hashedToken,
        verificationTokenExpiry: { gt: new Date() },
        emailVerified: false,
        status: { in: ["PENDING", "ACTIVE"] },
        role: { not: null },
        provider: "credentials",
      },
      data: {
        emailVerified: true,
        status: "ACTIVE",
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });
    if (!count) return redirectTo(req, "/verify-email?status=invalid-token");

    return redirectTo(req, "/login?verified=true");
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);
    return redirectTo(req, "/verify-email?status=server-error");
  }
}
