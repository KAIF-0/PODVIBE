import { account } from "@/config/appwrite-config/appwrite";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export function middleware(request) {
  const cookieStore = cookies();
  const protectedRoutes = [
    "/discover",
    "/join-pod",
    "/join-pod/pod-room",
    "/profile",
    "/start-stream",
  ];
  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
      console.log("No session token found. Redirecting to Join-In page");
      return NextResponse.redirect(new URL("/join-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
