import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import {
  updateMilestone,
  deleteMilestone,
} from "@/services/milestone.service";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { milestoneId } = await params;

  const body = await request.json();

  const result = await updateMilestone(
    session.user.id,
    milestoneId,
    body
  );

  return NextResponse.json(result, {
    status: result.status,
  });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { milestoneId } = await params;

  const result = await deleteMilestone(
    session.user.id,
    milestoneId
  );

  return NextResponse.json(result, {
    status: result.status,
  });
}