import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  let { email, purpose } = await req.json();

  if (!email) {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { message: "Email or auth token is required" },
        { status: 400 }
      );
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  if (!purpose) {
    return NextResponse.json(
      { message: "Purpose is required" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "DELETE FROM otps WHERE email = ? AND purpose = ?",
      [email, purpose]
    );

    await connection.execute(
      "INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, ?)",
      [email, otp, purpose, expires_at]
    );

    await connection.end();

    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: process.env.SMTP_SECURE === 'true',
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // await transporter.sendMail({
    //   from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    //   to: email,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    //   html: `<b>Your OTP code is ${otp}. It will expire in 5 minutes.</b>`,
    // });

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
      subject: `Please confirm your ${purpose} request`,
      text: `Your OTP to confirm the ${purpose} process is: ${otp}\nIt will expire in 5 minutes.`,
    });

    return NextResponse.json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
