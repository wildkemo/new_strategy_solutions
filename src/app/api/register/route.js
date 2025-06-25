import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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
  try {
    const { name, email, password, phone, company_name } = await req.json();

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createCustomer({
      name,
      email,
      password: hashedPassword,
      phone,
      company_name,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, admin: false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });

    const res = NextResponse.json(
      {
        status: 'success',
        message: 'Registration successful',
        user,
      },
      { status: 201 }
    );

    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Helpers
async function checkEmailExists(email) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT 1 FROM customers WHERE email = ? LIMIT 1', [email]);
    return rows.length > 0;
  } finally {
    conn.release();
  }
}

async function createCustomer({ name, email, password, phone, company_name }) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO customers (name, email, password, phone, company_name)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, phone, company_name]
    );
    return { id: result.insertId, name, email, phone, company_name };
  } finally {
    conn.release();
  }
}
