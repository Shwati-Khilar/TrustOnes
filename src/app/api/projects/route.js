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

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (session.user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          message: "Your account is not active.",
        },
        {
          status: 403,
        }
      );
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        {
          message: "Only clients can create projects.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await req.json();

    const result = await createProject(session.user.id, body);

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
    console.error("CREATE_PROJECT_ROUTE_ERROR", error);

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

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (session.user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          message: "Your account is not active.",
        },
        {
          status: 403,
        }
      );
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        {
          message: "Only clients can access client projects.",
        },
        {
          status: 403,
        }
      );
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