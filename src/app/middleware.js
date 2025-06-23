// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const PUBLIC_ROUTES = ['/', '/services', '/about'];

// export async function middleware(request) {
//   const token = request.cookies.get('auth_token')?.value;
//   const url = request.nextUrl;

//   // No token and accessing protected route → redirect to login
//   if (!token && !PUBLIC_ROUTES.includes(url.pathname)) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // Token exists
//   if (token) {
//     try {
//       const { payload } = await jwtVerify(
//         token,
//         new TextEncoder().encode(process.env.JWT_SECRET)
//       );

//       // Logged in user accessing public route → redirect to dashboard if admin
//       if (PUBLIC_ROUTES.includes(url.pathname) && payload.admin === true) {
//         return NextResponse.redirect(new URL('/blank_admin', request.url));
//       }

//     } catch (err) {
//       console.error('JWT error:', err);
//       // Invalid token → clear cookie and redirect to login
//       const response = NextResponse.redirect(new URL('/', request.url));
//       response.cookies.set('auth_token', '', { maxAge: 0 });
//       return response;
//     }
//   }

//   return NextResponse.next();
// }





// middleware.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request) {
  // Path to protect (adjust as needed)
  if (request.nextUrl.pathname.startsWith('/blank_admin')) {
    const cookieStore = cookies()
    const adminCookie = cookieStore.get('auth_token')?.value;
    
    // If cookie doesn't exist or doesn't have the right value
    if (!adminCookie || adminCookie.admin === false) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Apply middleware only to admin routes (optional config)
export const config = {
  matcher: ['/blank_admin/:path*']
}