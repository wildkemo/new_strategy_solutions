import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import mysql from 'mysql2/promise'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }

  let email
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    email = payload.email
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await db.execute('SELECT * FROM customers WHERE email = ?', [email])
    await db.end()

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    rows[0].password = undefined // Remove password from response
    return NextResponse.json(rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'DB error', details: err.message }, { status: 500 })
  }
}
