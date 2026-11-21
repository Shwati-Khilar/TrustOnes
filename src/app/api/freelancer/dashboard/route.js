import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getFreelancerDashboard } from "@/services/freelancer-dashboard.service";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const data = await getFreelancerDashboard(session.user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer dashboard fetched successfully.",
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
    console.error("FREELANCER_DASHBOARD_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load freelancer dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}
