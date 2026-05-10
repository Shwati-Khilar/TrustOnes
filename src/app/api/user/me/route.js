// Check who is currently logged in.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Not logged in.",
        user: null,
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    message: "Current user fetched successfully.",
    user: session.user,
  });
}