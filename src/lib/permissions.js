import { getDashboardRoute } from "./routes.js";

export function requireAuth(session) {
  if (!session?.user?.id) {
    return { allowed: false, status: 401, message: "Your session has expired. Please sign in." };
  }
  return { allowed: true };
}

export function requireRole(session, allowedRoles) {
  const auth = requireAuth(session);
  if (!auth.allowed) return auth;

  const { role, status, emailVerified } = session.user;
  if (status !== "ACTIVE" || !emailVerified || !allowedRoles.includes(role)) {
    return { allowed: false, status: 403, message: "You do not have access to this resource." };
  }
  return { allowed: true };
}

export function accountDestination(user) {
  if (!user?.id) return "/login";
  if (user.status === "SUSPENDED") return "/unauthorized";
  if (!user.emailVerified) return "/verify-email?email=" + encodeURIComponent(user.email);
  if (user.status === "PENDING" && !user.role) return "/complete-profile";
  if (user.status !== "ACTIVE" || !user.role) return "/unauthorized";
  return getDashboardRoute(user.role);
}
