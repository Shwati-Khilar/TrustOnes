// Not logged in + dashboard route → /login
// Logged in + wrong role route → /unauthorized
// Logged in + correct role route → allow
// Logged in + login/register route → redirect to own dashboard
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const role = token?.role;

  const isLoginPage = nextUrl.pathname === "/login";
  const isRegisterPage = nextUrl.pathname === "/register";

  const isClientRoute = nextUrl.pathname.startsWith("/client");
  const isFreelancerRoute = nextUrl.pathname.startsWith("/freelancer");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  const isProtectedRoute =
    isClientRoute || isFreelancerRoute || isAdminRoute;

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    if (role === "CLIENT") {
      return NextResponse.redirect(new URL("/client/dashboard", nextUrl));
    }

    if (role === "FREELANCER") {
      return NextResponse.redirect(new URL("/freelancer/dashboard", nextUrl));
    }

    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
  }

  if (isLoggedIn) {
    if (isClientRoute && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }

    if (isFreelancerRoute && role !== "FREELANCER") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/client/:path*",
    "/freelancer/:path*",
    "/admin/:path*",
  ],
};