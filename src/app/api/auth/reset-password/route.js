import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    const body = await req.json();

    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        {
          message: "Invalid request",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,

        resetPasswordExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash,

        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message:
          "Password reset successful",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error("RESET_PASSWORD_ERROR", error);

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