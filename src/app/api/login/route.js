import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken'; //for token generation
import mysql from 'mysql2/promise'; //for database connection
import bcrypt from 'bcryptjs'; //for password hashing
import {verifyUser} from '../../../lib/session';


// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // let isAdmin = false;

    const user = await validateCredentials(email, password);

    if (user === 1) {
      return NextResponse.json({ status: 'error', message: 'Email not registered' }, { status: 200 });
    }
    if (user === 2) {
      return NextResponse.json({ status: 'error', message: 'Invalid password' }, { status: 200 });
    }

    console.log("user found:", user);


    let token = null;

    if(user.isAdmin === true){
      token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, admin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    }else{
      token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name, admin: false },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    }

    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });

    const res = NextResponse.json({
      status: 'success',
      message: 'Login successful',
      isAdmin: user.isAdmin,
      
    }, { status: 200 });

    res.headers.set('Set-Cookie', cookie);

    console.log("isAdmin", res.isAdmin);
    return res;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}

async function validateCredentials(email, password) {
  let connection;
  try {
    connection = await pool.getConnection();

    const [adminRow] = await connection.execute(
      'SELECT id, email, name, password FROM admins WHERE email = ? LIMIT 1',
      [email]
    );

    if (adminRow.length !== 0){
      const admin = adminRow[0];

      const isAdminPasswordValid = await bcrypt.compare(password, admin.password);
      if (isAdminPasswordValid){
        // isAdmin = true;
        return { id: admin.id, email: admin.email, name: admin.name, isAdmin: true };
      }else{
        return 2; // Invalid password
      }
    };

    

    const [rows] = await connection.execute(
      'SELECT id, email, name, password FROM customers WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) return 1;
    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return 2;

    return { id: user.id, email: user.email, name: user.name, isAdmin: false };
  } finally {
    if (connection) connection.release();
  }
}
