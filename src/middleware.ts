import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/signup", "/verify-email"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/api/auth") || pathname.startsWith("/api/uploadthing")
  );

  if (isPublic) return NextResponse.next();

  const isSecure = request.nextUrl.protocol === "https:";
  const cookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";

  const token = request.cookies.get(cookieName)?.value ?? request.cookies.get("authjs.session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return NextResponse.next();

  try {
    const decoded = await decode({ token, secret, salt: cookieName });
    const user = decoded as any;

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/mentor") && user.role !== "MENTOR") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/student") && user.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/mentor/dashboard", request.url));
    }

    if (pathname.startsWith("/student") && user.role === "STUDENT") {
      const studentStatus = user.studentStatus;
      if (studentStatus && !["ACCEPTED"].includes(studentStatus)) {
        const allowedPaths = ["/student/apply", "/api/student/apply", "/api/auth"];
        const isAllowed = allowedPaths.some((p) => pathname === p || pathname.startsWith(p));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/student/apply", request.url));
        }
      }
    }

    if (pathname.startsWith("/api/mentor") && user.role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (pathname.startsWith("/api/student") && user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
