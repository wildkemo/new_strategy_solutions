import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, requestId } = await req.json();

    if (!email || !requestId) {
      return NextResponse.json({ message: 'Missing email or request ID' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store in DB
    await db.query(
      'INSERT INTO otps (email, otp_code, request_id, expires_at) VALUES (?, ?, ?, ?)',
      [email, otp, requestId, expiresAt]
    );

    // Send via email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP to approve request ${requestId} is ${otp}. This code will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { status: 500 });
  }
}
