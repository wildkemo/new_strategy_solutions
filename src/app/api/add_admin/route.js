import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
};

export async function POST(request) {
  try {
    // Parse the incoming JSON data
    const { name, email, password } = await request.json();

    // Create a database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Check if admin with the same email exists
      const [existingAdmins] = await connection.execute(
        'SELECT id FROM admins WHERE email = ?',
        [email]
      );

      if (existingAdmins.length > 0) {
        return NextResponse.json(
          { error: 'An admin with this email already exists' },
          { status: 409 }
        );
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new admin record
      const [result] = await connection.execute(
        'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      return NextResponse.json(
        { message: 'Admin created successfully', adminId: result.insertId },
        { status: 201 }
      );
    } finally {
      // Close the database connection
      await connection.end();
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}