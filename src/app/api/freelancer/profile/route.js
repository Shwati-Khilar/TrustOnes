import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import {
  getFreelancerProfile,
  updateFreelancerProfile,
} from "@/services/freelancer-profile.service";

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

export async function GET() {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const data = await getFreelancerProfile(sessionResult.session.user.id);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer profile fetched successfully.",
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
    console.error("FREELANCER_PROFILE_GET_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load freelancer profile.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const payload = await request.json();

    const data = await updateFreelancerProfile(
      sessionResult.session.user.id,
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer profile updated successfully.",
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
    console.error("FREELANCER_PROFILE_PATCH_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update freelancer profile.",
      },
      {
        status: 500,
      }
    );
  }
}