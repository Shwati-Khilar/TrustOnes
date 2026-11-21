import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createMilestone } from "@/services/milestone.service";
import { getProjectMilestones } from "@/services/milestone.service";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const { projectId } = await params;
    const body = await req.json();

    const result = await createMilestone(
      session.user.id,
      projectId,
      body
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
        milestone: result.milestone,
      },
      { status: result.status }
    );
  } catch (error) {
    console.error("CREATE_MILESTONE_ROUTE_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while creating milestone." },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);
    if (!permission.allowed) {
      return NextResponse.json({ message: permission.message }, { status: permission.status });
    }

    const { projectId } = await params;

    const result = await getProjectMilestones(
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
      { milestones: result.milestones },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PROJECT_MILESTONES_ROUTE_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching milestones." },
      { status: 500 }
    );
  }
}