import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(req) {
  try {
    const { name, email, phone, company_name, password } = await req.json();

    if (!name || !email || !phone || !company_name || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      "SELECT id FROM customers WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO customers (name, email, phone, company_name, password) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, company_name, hashedPassword]
    );

    return NextResponse.json({
      status: "success",
      message: "Customer created",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
