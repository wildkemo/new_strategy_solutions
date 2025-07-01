import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM otps WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
    }

    const otpRecord = rows[0];
    const now = new Date();

    if (new Date(otpRecord.expires_at) < now) {
      await connection.execute('DELETE FROM otps WHERE email = ?', [email]);
      await connection.end();
      return NextResponse.json({ error: 'OTP expired' }, { status: 410 });
    }

    if (otpRecord.otp_code !== otp) {
      await connection.end();
      return NextResponse.json({ error: 'Incorrect OTP' }, { status: 401 });
    }

    await connection.execute('DELETE FROM otps WHERE email = ?', [email]);
    await connection.end();
    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
