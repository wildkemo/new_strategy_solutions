import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
    }

    // Connect to the database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if the service exists
    const [existingRows] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Delete the service
    await db.execute('DELETE FROM services WHERE id = ?', [id]);
    await db.end();

    // Return the deleted row
    return NextResponse.json(
      {
        status: 'success',
        message: 'Service deleted successfully',
        service: existingRows[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting service:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}
