import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import {
  createFreelancerSupportTicket,
  getFreelancerSettings,
  updateFreelancerAccountSettings,
  updateFreelancerPassword,
} from "@/services/freelancer-settings.service";

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

    const data = await getFreelancerSettings(sessionResult.session.user.id);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer settings not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer settings fetched successfully.",
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
    console.error("FREELANCER_SETTINGS_GET_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load freelancer settings.",
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

    const data = await updateFreelancerAccountSettings(
      sessionResult.session.user.id,
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer settings updated successfully.",
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
    console.error("FREELANCER_SETTINGS_PATCH_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update freelancer settings.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const payload = await request.json();

    const data = await updateFreelancerPassword(
      sessionResult.session.user.id,
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully.",
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
    console.error("FREELANCER_PASSWORD_UPDATE_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update password.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(request) {
  try {
    const sessionResult = await getFreelancerSession();

    if (sessionResult.error) {
      return sessionResult.error;
    }

    const payload = await request.json();

    const data = await createFreelancerSupportTicket(
      sessionResult.session.user.id,
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Support ticket created successfully.",
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
    console.error("FREELANCER_SUPPORT_TICKET_API_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to create support ticket.",
      },
      {
        status: 400,
      }
    );
  }
}