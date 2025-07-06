import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import {verifyUser} from '../../../lib/session';


export async function DELETE(req) {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
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

    // Check if the service exists and get the image path
    const [existingRows] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const service = existingRows[0];
    
    // Delete the image file if it exists
    if (service.image) {
      try {
        const imagePath = path.join(process.cwd(), 'public', service.image);
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete the service from database
    await db.execute('DELETE FROM services WHERE id = ?', [id]);
    await db.end();

    // Return the deleted row
    return NextResponse.json(
      {
        status: 'success',
        message: 'Service deleted successfully',
        service: service,
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