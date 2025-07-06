import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import {verifyUser} from '../../../lib/session';


export async function PATCH(req) {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) return NextResponse.json({ error: 'No auth token' }, { status: 401 })

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    const email = payload.email
    if (!email) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { name, phone, password, company_name, currentPassword } = await req.json()

    // connect to DB
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
    })

    // check current password
    const [rows] = await db.execute('SELECT password FROM customers WHERE email = ?', [email])
    if (rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].password)
    if (!passwordMatch) return NextResponse.json({ error: 'Wrong password' }, { status: 403 })

    // Update logic
    if (password !== '') {
      const hashedNewPassword = await bcrypt.hash(password, 10)
      await db.execute(
        'UPDATE customers SET name = ?, phone = ?, password = ?, company_name = ? WHERE email = ?',
        [name, phone, hashedNewPassword, company_name, email]
      )
    } else {
      await db.execute(
        'UPDATE customers SET name = ?, phone = ?, company_name = ? WHERE email = ?',
        [name, phone, company_name, email]
      )
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
