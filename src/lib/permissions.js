// Reusable server-side role checking for API routes.

export function requireAuth(session) {
  if (!session?.user) {
    return {
      allowed: false,
      status: 401,
      message: "You must be logged in to access this resource.",
    };
  }

  return {
    allowed: true,
  };
}

export function requireRole(session, allowedRoles) {
  if (!session?.user) {
    return {
      allowed: false,
      status: 401,
      message: "You must be logged in to access this resource.",
    };
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      allowed: false,
      status: 403,
      message: "You do not have permission to perform this action.",
    };
  }

  return {
    allowed: true,
  };
}