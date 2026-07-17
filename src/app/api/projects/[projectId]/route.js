import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getProjectById, updateProject, } from "@/services/project.service";

export async function GET(req, { params }) {
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
        { message: "You are not allowed to access this project." },
        { status: 403 }
      );
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
        { message: "You are not allowed to update this project." },
        { status: 403 }
      );
    }

    const { projectId } = await params;

    const body = await req.json();

    const result = await updateProject(
      session.user.id,
      projectId,
      body
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
    console.error("UPDATE_PROJECT_ROUTE_ERROR", error);

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