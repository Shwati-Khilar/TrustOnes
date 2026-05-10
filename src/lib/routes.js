// After login, send user to correct dashboard based on role.
export const USER_ROLES = {
  CLIENT: "CLIENT",
  FREELANCER: "FREELANCER",
  ADMIN: "ADMIN",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",

  CLIENT_DASHBOARD: "/client/dashboard",
  FREELANCER_DASHBOARD: "/freelancer/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
};

export function getDashboardRoute(role) {
  const dashboardRoutes = {
    [USER_ROLES.CLIENT]: ROUTES.CLIENT_DASHBOARD,
    [USER_ROLES.FREELANCER]: ROUTES.FREELANCER_DASHBOARD,
    [USER_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  };

  return dashboardRoutes[role] || ROUTES.LOGIN;
}