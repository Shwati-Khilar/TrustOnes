import { evidenceSubmission } from "@/services/evidence-upload";
import { evidenceErrorResponse } from "@/lib/evidence-error";
import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getProjectById, updateProject, } from "@/services/project.service";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const { projectId } = await params;

    const result = await getProjectById(
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
      { project: result.project },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PROJECT_BY_ID_ROUTE_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching project." },
      { status: 500 }
    );
  }
}
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const { projectId } = await params;

    const { input:body, files } = await evidenceSubmission(req,true);

    const result = await updateProject(
      session.user.id,
      projectId,
      body,files
    );

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message,
        },
        {
          status: result.status,
        }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        project: result.project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const invalid=evidenceErrorResponse(error);
    if (invalid) return invalid;
    console.error("UPDATE_PROJECT_ROUTE_ERROR", error.name);

    return NextResponse.json(
      {
        message: "Something went wrong while updating project.",
      },
      {
        status: 500,
      }
    );
  }
}