import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { cancelProject } from "@/services/project.service";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.user.status !== "ACTIVE" ||
      session.user.role !== "CLIENT"
    ) {
      return NextResponse.json(
        { message: "You are not allowed to cancel this project." },
        { status: 403 }
      );
    }

    const { projectId } = await params;

    const result = await cancelProject(
      session.user.id,
      projectId
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        project: result.project,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CANCEL_PROJECT_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while cancelling project.",
      },
      { status: 500 }
    );
  }
}