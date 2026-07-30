import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getFreelancerDealRoomDetail } from "@/services/freelancer-deal-room.service";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project id is required.",
        },
        {
          status: 400,
        }
      );
    }

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

    const data = await getFreelancerDealRoomDetail(
      session.user.id,
      projectId
    );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal room not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer deal room detail fetched successfully.",
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
    console.error("FREELANCER_DEAL_ROOM_DETAIL_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load freelancer deal room detail.",
      },
      {
        status: 500,
      }
    );
  }
}