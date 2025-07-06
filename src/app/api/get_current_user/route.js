import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mysql from "mysql2/promise";
import {verifyUser} from '../../../lib/session';


export async function GET() {


  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

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

    // First, check if the user is an admin
    const [adminRows] = await db.execute(
      "SELECT id, email, name FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (adminRows.length > 0) {
      const admin = adminRows[0];
      await db.end();
      return NextResponse.json(
        { user: { ...admin, isAdmin: true } },
        { status: 200 }
      );
    }

    // If not admin, check customers
    const [rows] = await db.execute(
      "SELECT id, email, name FROM customers WHERE email = ? LIMIT 1",
      [email]
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = rows[0];
    return NextResponse.json(
      { user: { ...user, isAdmin: false } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[get_current_user] DB error:", err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
