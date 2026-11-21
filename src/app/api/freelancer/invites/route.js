import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getFreelancerInvites } from "@/services/freelancer-invite.service";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["FREELANCER"]);

    if (!permission.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: permission.message,
        },
        {
          status: permission.status,
        }
      );
    }

    if (session.user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is not active.",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } = new URL(request.url);

    const data = await getFreelancerInvites(session.user.id, {
      status: searchParams.get("status"),
      search: searchParams.get("search"),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer proposal responses fetched successfully.",
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("FREELANCER_INVITES_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load freelancer proposal responses.",
      },
      {
        status: 500,
      }
    );
  }
}