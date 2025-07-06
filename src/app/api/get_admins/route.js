import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import {verifyUser} from '../../../lib/session';


// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306
};

export async function GET() {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    // Create a new connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get all admin records (excluding passwords for security)
      const [admins] = await connection.query(
        'SELECT id, name, email, created_at FROM admins'
      );

      if (admins.length === 0) {
        return NextResponse.json({ message: 'No admins found' }, { status: 404 });
      }

      return NextResponse.json(admins);
    } finally {
      // Close the connection
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}