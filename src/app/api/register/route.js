import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import {verifyUser} from '../../../lib/session';


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
    // const hashedPassword = await bcrypt.hash(password, 10);

    
    const [rows] = await conn.query('SELECT 1 FROM customers WHERE email = ? LIMIT 1', [email]);

    if( rows.length > 0) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    await conn.query('DELETE FROM otps WHERE email = ? AND purpose = "register"', [email]);

    // ✅ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // const requestId = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await conn.query('INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, ?)', [email, otp, 'register', expiresAt]);

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
            subject: "Please confirm your Registration",
            text: `Hello ${name},\n\nYour OTP to confirm the Registration process is: ${otp}\nIt will expire in 5 minutes.`,
          });

    conn.release();



    
    return NextResponse.json({status: 'success', message: 'OTP sent to your email' }, {status: 200})


    


    

    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

