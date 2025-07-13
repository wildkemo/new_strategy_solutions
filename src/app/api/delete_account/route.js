import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function DELETE(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication token not found.' },
        { status: 401 }
      );
    }

    let email;
    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }

    const { otp, purpose } = await req.json();

    if (!otp || !purpose) {
      return NextResponse.json(
        { message: 'OTP and purpose are required.' },
        { status: 400 }
      );
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [otpRows] = await db.execute(
      'SELECT * FROM otps WHERE email = ? AND purpose = ?',
      [email, purpose]
    );

    if (otpRows.length === 0) {
      await db.end();
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
    }

    const otpRecord = otpRows[0];

    if (otpRecord.otp !== otp) {
      await db.end();
      return NextResponse.json({ message: 'Incorrect OTP.' }, { status: 400 });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      await db.execute('DELETE FROM otps WHERE id = ?', [otpRecord.id]);
      await db.end();
      return NextResponse.json({ message: 'OTP has expired.' }, { status: 400 });
    }


    await db.beginTransaction();
    try {
      await db.execute('DELETE FROM orders WHERE email = ?', [email]);
      await db.execute('DELETE FROM customers WHERE email = ?', [email]);
      await db.execute('DELETE FROM otps WHERE id = ?', [otpRecord.id]);
      await db.commit();
      await db.end();

      return NextResponse.json({status:"success", message: 'Account deleted successfully.' });
    } catch (error) {
      await db.rollback();
      await db.end();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the account.' },
      { status: 500 }
    );
  }
}