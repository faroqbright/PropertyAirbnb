import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authPages = ["/Auth/Login", "/Auth/Signup", "/Auth/Forgot", "/Auth/Personal", "/Auth/ChangePassword"];

  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  const uid = request.cookies.get("uid")?.value;

  if (uid && isAuthPage) {
    return NextResponse.redirect(new URL("/Landing/Home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Auth/:path*", "/Landing/Home"],
};
