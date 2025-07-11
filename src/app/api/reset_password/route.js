import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, otp, password } = await req.json();

  if (!email || !otp || !password) {
    return NextResponse.json({ message: 'Email, OTP, and password are required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM otps WHERE email = ? AND purpose = ?',
      [email, 'Reset Password']
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid OTP or email' }, { status: 400 });
    }

    const otpRecord = rows[0];

    if (new Date() > new Date(otpRecord.expires_at)) {
      await connection.execute('DELETE FROM otps WHERE id = ?', [otpRecord.id]);
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
        return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    // OTP is valid, delete it and update the password
    await connection.execute('DELETE FROM otps WHERE id = ?', [otpRecord.id]);

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updateResult] = await connection.execute(
      'UPDATE customers SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (updateResult.affectedRows === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({status: "success", message: 'Password reset successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
      if (connection) {
          await connection.end();
      }
  }
}
