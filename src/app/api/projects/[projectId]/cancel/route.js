import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { cancelProject } from "@/services/project.service";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
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