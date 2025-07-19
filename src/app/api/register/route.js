import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { verifyUser } from "../../../lib/session";
import { validateEmail, validateName } from "../../../lib/formSanitizer";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req) {
  let conn;
  conn = await pool.getConnection();
  try {
    const { name, email } = await req.json();
    
    // Server-side validation
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { message: nameValidation.error },
        { status: 400 }
      );
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { message: emailValidation.error },
        { status: 400 }
      );
    }
    
    // Use sanitized data
    const sanitizedName = nameValidation.sanitized;
    const sanitizedEmail = emailValidation.sanitized;
    
    const [rows] = await conn.query(
      "SELECT 1 FROM customers WHERE email = ? LIMIT 1",
      [sanitizedEmail]
    );

    if (rows.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    await conn.query(
      'DELETE FROM otps WHERE email = ? AND purpose = "register"',
      [sanitizedEmail]
    );

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const requestId = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await conn.query(
      "INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, ?)",
      [sanitizedEmail, otp, "register", expiresAt]
    );

    // ✅ Send OTP to user's email
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true only for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

    try{
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sanitizedEmail,
      subject: "Please confirm your Registration",
      text: `Hello ${sanitizedName},\n\nYour OTP to confirm the Registration process is: ${otp}\nIt will expire in 5 minutes.`,
    });
    }catch (emailError) {
      // console.error("Error sending email:", emailError);
      return NextResponse.json(
        { message: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    conn.release();

    return NextResponse.json(
      { status: "success", message: "OTP sent to your email" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
