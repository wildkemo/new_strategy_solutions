import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {verifyUser} from '../../../lib/session';


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
      },
    }, { status: 200 });

  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    console.error('Session check error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
