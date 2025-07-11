import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/forgot-password",
  ];
  const isPublicPath =
    publicPaths.includes(pathname) || pathname.startsWith("/services");
  const isDashboard = pathname.startsWith("/blank_admin");

  // ✅ If logged in and trying to access /login or /register → redirect to /services
  if (token && (pathname === "/login" || pathname === "/register")) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/services", request.url));
    } catch {
      // token is invalid → clear it and proceed
      return NextResponse.next();
    }
  }

  // ✅ Allow public pages
  if (isPublicPath) return NextResponse.next();

  // ❌ No token, trying to access a protected page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // 🔒 /blank_admin requires admin
    if (isDashboard && !payload.admin) {
      return NextResponse.redirect(new URL("/services", request.url));
    }

    // ✅ Token is valid, allow access
    return NextResponse.next();
  } catch (err) {
    // ❌ Invalid or expired token
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Protect all paths except static files & API
};
