import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, features, category, icon } = body;

    // Validate input
    if (!id || !title || !description || !category || !icon || !Array.isArray(features)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Connect to DB
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if service exists
    const [existing] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await db.end();
      return NextResponse.json(
        { status: 'error', message: 'Service not found' },
        { status: 404 }
      );
    }

    // Convert features array to JSON string
    const featuresJson = JSON.stringify(features);

    // Update the service
    await db.execute(
      `UPDATE services 
       SET title = ?, description = ?, features = ?, category = ?, icon = ? 
       WHERE id = ?`,
      [title, description, featuresJson, category, icon, id]
    );

    // Fetch updated row
    const [updated] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    await db.end();

    const updatedService = updated[0];
    updatedService.features = JSON.parse(updatedService.features || '[]');

    return NextResponse.json(
      { status: 'success', service: updatedService },
      { status: 200 }
    );
  } catch (err) {
    console.error('Update Service Error:', err);
    return NextResponse.json(
      { status: 'error', message: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}
