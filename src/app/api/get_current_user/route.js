import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    // 1. Read the auth_token cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log(token);

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Missing or invalid auth_token' },
        { status: 401 }
      );
    }

    const email = token.email;

    // 2. Connect to MySQL database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 3. Query the user by email
    const [rows] = await connection.execute(
      'SELECT * FROM customers WHERE email = ? LIMIT 1',
      [email]
    );

    await connection.end();

    // 4. Return result
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log(rows[0]);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/get-user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
