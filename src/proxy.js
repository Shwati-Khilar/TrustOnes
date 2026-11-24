import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Portal layouts and API handlers authorize against the current database identity.
export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });
  if (!token?.id) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/freelancer/:path*", "/admin/:path*"],
};
