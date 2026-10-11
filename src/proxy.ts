import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const authMiddleware = auth.middleware({ loginUrl: "/auth/login" });

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prepare custom request headers to pass pathname to Server Components & Layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Protect account routes at the network edge
  if (pathname.startsWith("/account")) {
    const authRes = await authMiddleware(request);
    // If authMiddleware triggers a redirect (e.g. not logged in -> /auth/login), honour it
    if (authRes && authRes.status >= 300 && authRes.status < 400) {
      return authRes;
    }

    // Allow authenticated access to onboarding message environment
    if (
      pathname === "/account/onboarding" ||
      pathname.startsWith("/account/onboarding")
    ) {
      return NextResponse.next();
    }

    const isOnboarded =
      request.cookies.get("mayalu_onboarded")?.value === "true";

    // MANDATORY ONBOARDING REDIRECT:
    // If accessing any other /account route without completing onboarding, redirect to onboarding
    if (!isOnboarded) {
      return NextResponse.redirect(
        new URL("/account/onboarding", request.nextUrl),
      );
    }

    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages to onboarding or dashboard
  if (pathname === "/auth/login" || pathname === "/auth/sign-up") {
    const sessionCookie = request.cookies.get("neon-auth.session_token");
    if (sessionCookie?.value) {
      const isOnboarded =
        request.cookies.get("mayalu_onboarded")?.value === "true";
      const targetPath = isOnboarded
        ? "/account/dashboard"
        : "/account/onboarding";
      return NextResponse.redirect(new URL(targetPath, request.nextUrl));
    }
  }

  // Handle /onboarding shortcut at network edge
  if (pathname === "/onboarding") {
    const isOnboarded =
      request.cookies.get("mayalu_onboarded")?.value === "true";
    const targetPath = isOnboarded
      ? "/account/dashboard"
      : "/account/onboarding";
    return NextResponse.redirect(new URL(targetPath, request.nextUrl));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/account/:path*", "/auth/login", "/auth/sign-up", "/onboarding"],
};
