import { NextRequest, NextResponse } from "next/server";
import { routes, COOKIE_NAME } from "@/constants";

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value || "";
  const pathName = request.nextUrl.pathname;

  const isPublicPath = pathName === routes.SIGNIN;

  if (isPublicPath && cookie) {
    return NextResponse.redirect(new URL(routes.HOME, request.nextUrl));
  }

  if (!isPublicPath && !cookie) {
    return NextResponse.redirect(new URL(routes.SIGNIN, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
  ],
};
