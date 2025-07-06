import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // Connect to the database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if the order exists and get the image path
    const [existingRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'order not found' }, { status: 404 });
    }

    const order = existingRows[0];

    if(order.status !== "pending") {
      return NextResponse.json(
        { message: 'Only pending orders can be deleted' },
        { status: 400 }
      );

    }
    
    
    // Delete the order from database
    await db.execute('DELETE FROM orders WHERE id = ?', [id]);
    await db.end();

    // Return the deleted row
    return NextResponse.json(
      {
        status: 'success',
        message: 'order deleted successfully',
        order: order,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting order:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}