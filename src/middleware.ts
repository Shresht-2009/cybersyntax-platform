import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/signup", "/verify-email"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/api/auth") || pathname.startsWith("/api/uploadthing")
  );

  if (isPublic) return NextResponse.next();

  const session = await auth();
  const user = session?.user as any;

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

  if (pathname.startsWith("/api/mentor") && user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (pathname.startsWith("/api/student") && user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
