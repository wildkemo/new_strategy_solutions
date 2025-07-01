// import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';

// export async function DELETE(req) {
//   try {
//     const { id } = await req.json(); // expecting { id: number }

//     if (!id) {
//       return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
//     }

//     // Connect to DB
//     const db = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     });

//     // Check if user exists
//     const [existingRows] = await db.execute(
//       'SELECT * FROM customers WHERE id = ?',
//       [id]
//     );

//     if (existingRows.length === 0) {
//       await db.end();
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Delete user
//     await db.execute('DELETE FROM customers WHERE id = ?', [id]);
//     await db.end();

//     // Return deleted user data (without password)
//     const deletedUser = existingRows[0];
//     delete deletedUser.password;

//     return NextResponse.json(
//       { message: 'User deleted successfully', user: deletedUser },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error('Delete error:', err);
//     return NextResponse.json(
//       { error: 'Database error', details: err.message },
//       { status: 500 }
//     );
//   }
// }










import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function DELETE(req) {
  try {
    const { id, email } = await req.json(); // expecting { id: number, email: string }

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    // Connect to DB
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if user exists
    const [existingRows] = await db.execute(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get customer email if not provided
    const customerEmail = email || existingRows[0].email;

    // Delete all orders associated with this customer's email
    await db.execute('DELETE FROM orders WHERE email = ?', [customerEmail]);

    // Delete user
    await db.execute('DELETE FROM customers WHERE id = ?', [id]);
    await db.end();

    // Return deleted user data (without password)
    const deletedUser = existingRows[0];
    delete deletedUser.password;

    return NextResponse.json(
      { message: 'User deleted successfully', user: deletedUser },
      { status: 200 }
    );

  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}