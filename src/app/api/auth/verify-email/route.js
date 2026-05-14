import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {

  const { searchParams } = new URL(req.url);

  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
       `${process.env.NEXTAUTH_URL}/login`
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,

      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login`
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return NextResponse.redirect(
    `${process.env.NEXTAUTH_URL}/login?verified=true`
  );
}