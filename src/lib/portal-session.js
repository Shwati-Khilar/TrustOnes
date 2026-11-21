import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { accountDestination, requireRole } from "@/lib/permissions";

export const currentSession = cache(() => getServerSession(authOptions));

export async function requirePortal(role) {
  const session = await currentSession();
  const access = requireRole(session, [role]);
  if (!access.allowed) {
    const destination = accountDestination(session?.user);
    redirect(destination.endsWith("/dashboard") ? "/unauthorized" : destination);
  }
  return session.user;
}
