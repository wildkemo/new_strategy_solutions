import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import {verifyUser} from '../../../lib/session';


export async function GET() {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    // Connect to the database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch all orders
    const [orders] = await db.execute('SELECT * FROM orders');
    
    await db.end();

    // Return orders
    return NextResponse.json(orders, { status: 200 });

  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json(
      { error: 'Database connection failed', details: err.message },
      { status: 500 }
    );
  }
}
