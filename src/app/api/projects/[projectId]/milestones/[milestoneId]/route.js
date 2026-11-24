import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import {
  updateMilestone,
  deleteMilestone,
} from "@/services/milestone.service";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);

  const permission = requireRole(session, ["CLIENT"]);
  if (!permission.allowed) {
    return NextResponse.json(
      { message: permission.message },
      { status: permission.status }
    );
  }

  const { projectId, milestoneId } = await params;

  const body = await request.json();

  const result = await updateMilestone(
    session.user.id,
    projectId,
    milestoneId,
    body
  );

  return NextResponse.json(result, {
    status: result.status,
  });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  const permission = requireRole(session, ["CLIENT"]);
  if (!permission.allowed) {
    return NextResponse.json(
      { message: permission.message },
      { status: permission.status }
    );
  }

  const { projectId, milestoneId } = await params;

  const result = await deleteMilestone(
    session.user.id,
    projectId,
    milestoneId
  );

  return NextResponse.json(result, {
    status: result.status,
  });
}