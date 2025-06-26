import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import mysql from 'mysql2/promise';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  // Return null if token is missing
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  let email;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    email = payload?.email;

    if (!email) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (err) {
    // Invalid/expired token, return null
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute(
      'SELECT * FROM customers WHERE email = ? LIMIT 1',
      [email]
    );

    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = rows[0];
    delete user.password;

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('[get_current_user] DB error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}
