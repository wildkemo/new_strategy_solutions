import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import {verifyUser} from '../../../lib/session';


export async function PUT(req) {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    const formData = await req.formData();

    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const icon = formData.get('icon');
    const image = formData.get('image');
    const featuresRaw = formData.get('features');

    let features;
    try {
      features = JSON.parse(featuresRaw || '[]');
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JSON for features' },
        { status: 400 }
      );
    }

    if (!id || !title || !description || !category || !icon || !Array.isArray(features)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [existing] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      await db.end();
      return NextResponse.json(
        { status: 'error', message: 'Service not found' },
        { status: 404 }
      );
    }

    let imagePath = existing[0].image; // default: keep old image

    // Only replace image if a new file was actually sent
    if (
      image &&
      typeof image.arrayBuffer === 'function' &&
      image.size > 0 &&
      image.name // if empty, name is usually ""
    ) {
      // Delete old image if exists
      if (imagePath) {
        const oldPath = path.join(process.cwd(), 'public', imagePath);
        try {
          await unlink(oldPath);
        } catch (err) {
          console.warn('Failed to delete old image:', err.message);
        }
      }

      // Save new image
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filename = `${title.replace(/\s+/g, '_')}${path.extname(image.name)}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // Update DB
    await db.execute(
      `UPDATE services 
       SET title = ?, description = ?, features = ?, category = ?, icon = ?, image = ?
       WHERE id = ?`,
      [title, description, JSON.stringify(features), category, icon, imagePath, id]
    );

    const [updated] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
    await db.end();

    const updatedService = updated[0];
    updatedService.features = JSON.parse(updatedService.features || '[]');

    return NextResponse.json({ status: 'success', service: updatedService }, { status: 200 });
  } catch (err) {
    console.error('Update Service Error:', err);
    return NextResponse.json(
      { status: 'error', message: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
