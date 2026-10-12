import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const authMiddleware = auth.middleware({ loginUrl: "/auth/login" });

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isServerAction =
    request.headers.has("next-action") ||
    request.headers.get("content-type")?.includes("multipart/form-data");
  const isGetMethod = request.method === "GET";

  // Prepare custom request headers to pass pathname to Server Components & Layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Check if request has an active authentication session cookie
  const hasAuthSession = request.cookies.getAll().some(
    (c) =>
      (c.name.includes("session_token") || c.name.includes("session_data")) &&
      Boolean(c.value),
  );

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
      return authRes || NextResponse.next({ request: { headers: requestHeaders } });
    }

    const isOnboarded =
      request.cookies.get("mayalu_onboarded")?.value === "true";

    // MANDATORY ONBOARDING REDIRECT:
    // Only redirect browser page navigations (GET); never intercept Server Actions
    if (!isOnboarded && isGetMethod && !isServerAction) {
      const redirectRes = NextResponse.redirect(
        new URL("/account/onboarding", request.nextUrl),
      );
      if (authRes) {
        authRes.cookies.getAll().forEach((c) => {
          redirectRes.cookies.set(c.name, c.value);
        });
      }
      return redirectRes;
    }

    return authRes || NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Prevent logged-in users from accessing any auth pages (login, sign-up, forgot-password, etc.)
  // CRITICAL: ONLY redirect browser GET navigations. NEVER redirect Server Actions or POST requests.
  if (pathname.startsWith("/auth") && pathname !== "/auth/error") {
    if (isGetMethod && !isServerAction && hasAuthSession) {
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
    if (isGetMethod && !isServerAction) {
      const isOnboarded =
        request.cookies.get("mayalu_onboarded")?.value === "true";
      const targetPath = isOnboarded
        ? "/account/dashboard"
        : "/account/onboarding";
      return NextResponse.redirect(new URL(targetPath, request.nextUrl));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/account/:path*", "/auth/:path*", "/onboarding"],
};
