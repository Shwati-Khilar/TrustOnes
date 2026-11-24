import { evidenceSubmission } from "@/services/evidence-upload";
import { evidenceErrorResponse } from "@/lib/evidence-error";
import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createProject } from "@/services/project.service";

import {
  getClientProjects,
} from "@/services/project.service";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const { input:body, files } = await evidenceSubmission(req,true);

    const result = await createProject(session.user.id, body,files);

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
        status: result.status,
      }
    );
  } catch (error) {
    const invalid=evidenceErrorResponse(error);
    if (invalid) return invalid;
    console.error("CREATE_PROJECT_ROUTE_ERROR", error.name);

    return NextResponse.json(
      {
        message: "Something went wrong while creating the project.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const result = await getClientProjects(session.user.id);

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
        projects: result.projects,
      },
      {
        status: result.status,
      }
    );
  } catch (error) {
    console.error("GET_PROJECTS_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while fetching projects.",
      },
      {
        status: 500,
      }
    );
  }
}