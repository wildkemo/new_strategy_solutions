import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value


  const publicPaths = ['/', '/login', '/register', '/services', '/about', '/contact']
  const isPublicPath = publicPaths.includes(pathname)

  const isDashboard = pathname.startsWith('/blank_admin')

  // Allow public pages
  if (isPublicPath) return NextResponse.next()

  // If no token and trying to access a protected page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    // For /blank_admin only admins are allowed
    if (isDashboard && !payload.admin) {
      return NextResponse.redirect(new URL('/services', request.url))
    }

    // Token is valid
    return NextResponse.next()
  } catch (err) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Protect all paths except static files & API
}
