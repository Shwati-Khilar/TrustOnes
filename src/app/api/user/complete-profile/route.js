import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardRoute } from "@/lib/routes";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const role = body?.role;
    if (!["CLIENT", "FREELANCER"].includes(role)) {
      return NextResponse.json({ message: "Choose a valid role." }, { status: 400 });
    }
    const { count } = await prisma.user.updateMany({
      where: { id: session.user.id, provider: "google", role: null, status: "PENDING", emailVerified: true },
      data: { role, status: "ACTIVE" },
    });
    if (!count) {
      return NextResponse.json({ message: "Role selection is unavailable for this account." }, { status: 403 });
    }
    return NextResponse.json({
      success: true,
      message: "Profile completed successfully.",
      user: { ...session.user, role, status: "ACTIVE" },
      redirectTo: getDashboardRoute(role),
    });
  } catch {
    return NextResponse.json({ message: "Unable to complete your profile." }, { status: 500 });
  }
}
