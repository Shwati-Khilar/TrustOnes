import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import {
  getFreelancerMilestoneSubmissions,
  submitFreelancerMilestoneWork,
} from "@/services/freelancer-submission.service";

export const dynamic = "force-dynamic";

async function getFreelancerSession() {
  const session = await getServerSession(authOptions);

  const permission = requireRole(session, ["FREELANCER"]);

  if (!permission.allowed) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: permission.message,
        },
        {
          status: permission.status,
        }
      ),
    };
  }

  if (session.user.status !== "ACTIVE") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Your account is not active.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    session,
  };
}

export async function GET(request, context) {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const { milestoneId } = await context.params;

    const data = await getFreelancerMilestoneSubmissions(
      sessionResult.session.user.id,
      milestoneId
    );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Milestone not found or not assigned to you.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Milestone submissions fetched successfully.",
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
    console.error("FREELANCER_MILESTONE_SUBMISSIONS_GET_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load milestone submissions.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request, context) {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const { milestoneId } = await context.params;
    const payload = await request.json();

    const data = await submitFreelancerMilestoneWork(
      sessionResult.session.user.id,
      milestoneId,
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Milestone work submitted successfully.",
        data,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("FREELANCER_MILESTONE_SUBMISSION_POST_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to submit milestone work.",
      },
      {
        status: 400,
      }
    );
  }
}