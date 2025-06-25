import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import mysql from 'mysql2/promise';

export async function POST(request) {
  try {
    // 1. Verify the auth_token cookie
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    let decoded;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      decoded = await jose.jwtVerify(authToken.value, secret);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // 3. Get user data from token
    const { name, email } = decoded.payload;

    // 4. Parse request body
    const { service_type, service_description } = await request.json();

    if (!service_type || !service_description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 5. Connect to MySQL and insert order
    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const [result] = await connection.execute(
        'INSERT INTO orders (name, email, service_type, service_description) VALUES (?, ?, ?, ?)',
        [name, email, service_type, service_description]
      );

      return NextResponse.json(
        { status: 'success'},
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    } finally {
      if (connection) await connection.end();
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}