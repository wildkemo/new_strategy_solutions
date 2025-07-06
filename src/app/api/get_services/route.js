import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import {verifyUser} from '../../../lib/session';


export async function GET() {
  let connection;
  try {
    // 1. Connect to MySQL database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 2. Query all services
    const [rows] = await connection.execute('SELECT * FROM services');

    if (rows.length === 0) {
      return NextResponse.json(
        { status: 'error' },
        { status: 200 }
      );
    }

    // console.log(rows[0].features);
    // 3. Return the services as JSON
    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  } finally {
    // 4. Close the connection
    if (connection) await connection.end();
  }
}