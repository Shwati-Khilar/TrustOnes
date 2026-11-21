import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { fundMilestone } from "@/services/funding.service";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const { milestoneId } = await params;

  const result = await fundMilestone(
    session.user.id,
    milestoneId
  );

  return NextResponse.json(result, {
    status: result.status,
  });
}