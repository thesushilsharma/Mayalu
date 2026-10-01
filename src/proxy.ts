import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const authMiddleware = auth.middleware({ loginUrl: "/auth/login" });

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect account routes at the network edge
  if (pathname.startsWith("/account")) {
    return authMiddleware(request);
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (pathname === "/auth/login" || pathname === "/auth/sign-up") {
    const sessionCookie = request.cookies.get("neon-auth.session_token");
    if (sessionCookie?.value) {
      return NextResponse.redirect(
        new URL("/account/dashboard", request.nextUrl),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/auth/login", "/auth/sign-up"],
};
