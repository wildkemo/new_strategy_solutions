import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import {verifyUser} from '../../../lib/session';


export async function POST() {
  try {
    const expiredCookie = serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Successfully logged out',
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': expiredCookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500 }
    );
  }
}
