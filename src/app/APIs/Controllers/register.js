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
  queueLimit: 0
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password, phone, company_name } = req.body;

    // 1. Check if email exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 3. Create user in database
    const user = await createCustomer({
      name,
      email,
      password: hashedPassword,
      phone,
      company_name
    });

    // 4. Create JWT token for auto-login
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Set HTTP-only cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company_name: user.company_name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper Functions
async function checkEmailExists(email) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT 1 FROM customers WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0;
  } finally {
    if (connection) connection.release();
  }
}

async function createCustomer({ name, email, password, phone, company_name }) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO customers 
       (name, email, password, phone, company_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, phone, company_name]
    );
    
    // Return the newly created user (without password)
    return {
      id: result.insertId,
      name,
      email,
      phone,
      company_name
    };
  } finally {
    if (connection) connection.release();
  }
}