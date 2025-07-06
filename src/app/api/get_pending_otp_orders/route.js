import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import mysql from "mysql2/promise";
import {verifyUser} from '../../../lib/session';


export async function GET(request) {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT
    let decoded;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      decoded = await jose.jwtVerify(authToken.value, secret);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { email } = decoded.payload;

    // Connect to MySQL
    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      // Get orders with pending OTP verification
      const [rows] = await connection.execute(
        "SELECT id, service_type, service_description, created_at, expires_at FROM orders WHERE email = ? AND status = 'pending' AND otp != 'Confirmed' AND expires_at > NOW()",
        [email]
      );

      return NextResponse.json(
        {
          status: "success",
          pendingOrders: rows,
          hasPendingOrders: rows.length > 0,
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch pending orders" },
        { status: 500 }
      );
    } finally {
      if (connection) await connection.end();
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
