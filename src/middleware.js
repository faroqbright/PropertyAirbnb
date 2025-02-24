import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authPages = ["/Auth/Login", "/Auth/Signup", "/Auth/Forgot", "/Auth/Personal", "/Auth/ResetPassword"];
  const protectedPages = ["/Landing/Profile"];

  const uid = request.cookies.get("uid")?.value;

  if (uid && authPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL("/Landing/Home", request.url));
  }

  if (!uid && protectedPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL("/Auth/Login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Auth/:path*", "/Landing/Home", "/Landing/Profile"],
};
