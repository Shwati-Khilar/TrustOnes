import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedRoles = ["CLIENT", "FREELANCER"];

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login again.",
        },
        {
          status: 401,
        }
      );
    }

    const { role } = await req.json();

    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid role.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email.toLowerCase().trim(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been suspended.",
        },
        {
          status: 403,
        }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before completing your profile.",
        },
        {
          status: 403,
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        provider: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile completed successfully.",
        user: updatedUser,
        redirectTo:
          updatedUser.role === "CLIENT"
            ? "/client/dashboard"
            : "/freelancer/dashboard",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("COMPLETE_PROFILE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while completing profile.",
      },
      {
        status: 500,
      }
    );
  }
}