import { account } from "@/config/appwrite-config/appwrite";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // const userCreds = await account.getSession("current");
  // console.log(userCreds);
  // if (!userCreds) {
  //   console.log("USER SESSION IS NOT PRESENT");
  //   return NextResponse.redirect(new URL("/join-in", request.url));
  // }
  console.log("USER SESSION IS PRESENT");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
