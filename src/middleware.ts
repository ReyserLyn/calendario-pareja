import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateAuth } from "./lib/pocketbase";

export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/profile"];
  const authRoutes = ["/login"];

  try {
    const isAuthenticated = await validateAuth();

    if (authRoutes.includes(request.nextUrl.pathname) && isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      protectedRoutes.includes(request.nextUrl.pathname) &&
      !isAuthenticated
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
