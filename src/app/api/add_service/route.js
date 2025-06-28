import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, category, icon, features } = body;

    // Validate required fields
    if (!title || !description || !category || !icon || !Array.isArray(features)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields or invalid features format' },
        { status: 400 }
      );
    }

    // Prepare DB connection
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Convert features to JSON
    const featuresJson = JSON.stringify(features);

    // Insert service
    const [insertResult] = await db.execute(
      'INSERT INTO services (title, description, features, category, icon) VALUES (?, ?, ?, ?, ?)',
      [title, description, featuresJson, category, icon]
    );

    // Get inserted service
    const [rows] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [insertResult.insertId]
    );

    await db.end();

    // Convert features back to object before sending to frontend
    const service = rows[0];
    service.features = JSON.parse(service.features || '[]');

    return NextResponse.json(
      { status: 'success', service },
      { status: 200 }
    );
  } catch (err) {
    console.error('Add Service API Error:', err);
    return NextResponse.json(
      { status: 'error', message: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}
