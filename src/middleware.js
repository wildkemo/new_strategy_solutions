import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value

  const isDashboard = request.nextUrl.pathname.startsWith('/blank_admin')

  // if accessing /dashboard and no token
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isDashboard && token) {
    try {
      const { payload } = await jwtVerify(token, secret)

      // if not admin
      if (!payload.admin) {
        return NextResponse.redirect(new URL('/services', request.url))
      }
    } catch (err) {
      // token invalid
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blank_admin/:path*'],
}
