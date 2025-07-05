import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const cookieStore = cookies();
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

    const { name, email } = decoded.payload;
    const { service_type, service_description } = await request.json();

    if (!service_type || !service_description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to MySQL
    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      // // Insert into orders table
      // const [result] = await connection.execute(
      //   "INSERT INTO orders (name, email, service_type, service_description) VALUES (?, ?, ?, ?)",
      //   [name, email, service_type, service_description]
      // );

      // const orderId = result.insertId;

      // ✅ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // ✅ Store OTP in otps table
      await connection.execute(
        "INSERT INTO otps (email, otp_code, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

      // ✅ Send OTP to user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for Approving Your Service Request",
        text: `Hello ${name},\n\nYour OTP to confirm the service request is: ${otp}\nIt will expire in 5 minutes.`,
      });

      return NextResponse.json(
        { status: "otp_sent", message: "Order placed, OTP sent." },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to process order" },
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
