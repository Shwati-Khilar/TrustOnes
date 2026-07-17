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
        emailVerified: true,
        verificationTokenExpiry: true,
      },
    });

    if (!user) {
      return redirectTo(req, "/verify-email?status=invalid-token");
    }

    if (user.emailVerified) {
      return redirectTo(req, "/login?verified=already");
    }

    if (
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry <= new Date()
    ) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });

      return redirectTo(req, "/verify-email?status=expired-token");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        status: "ACTIVE",
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return redirectTo(req, "/login?verified=true");
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);
    return redirectTo(req, "/verify-email?status=server-error");
  }
}
