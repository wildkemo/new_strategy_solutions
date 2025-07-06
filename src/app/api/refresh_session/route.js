import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 401 })
  }

  try {
    await jwtVerify(token, secret)
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 401 })
  }

  cookieStore.set('auth_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 3600, // reset to 1 hour from now
  })

  // console.log('Session refreshed successfully');

  return NextResponse.json({ ok: true })
}
