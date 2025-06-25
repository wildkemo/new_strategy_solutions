import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import mysql from 'mysql2/promise'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  let email
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    email = payload.email
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE email = ?',
      [email]
    )
    await db.end()

    if (orders.length === 0) {
      return NextResponse.json({ message: 'No orders found for this user' }, { status: 200 })
    }
    console.log('Orders fetched successfully:', orders)
    return NextResponse.json(orders, { status: 200 })

  } catch (err) {
    console.error('DB error:', err)
    return NextResponse.json(
      { error: 'Database connection failed', details: err.message },
      { status: 500 }
    )
  }
}
