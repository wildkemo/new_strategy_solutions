import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    console.log("Email:", email);

    const { otp, service_type, service_description, name, order_id } = await req.json();

    // let order_id = 30

    if (!otp) {
      return NextResponse.json({ error: 'Missing OTP' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? LIMIT 1',
      [order_id]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Order not found or not verified in time,\n please re-order it' }, { status: 404 });
    }
    
    const otpRecord = rows[0];
    const now = new Date();






    
    if(otpRecord.otp !== "Confirmed"){

      if (new Date(otpRecord.expires_at) < now) {
      await connection.execute('DELETE FROM orders WHERE id = ?', [order_id]);
      await connection.end();
      return NextResponse.json({ error: 'OTP expired' }, { status: 410 });
      }




    
      if (otpRecord.otp !== otp) {
        await connection.end();
        return NextResponse.json({ error: 'Incorrect OTP' }, { status: 401 });
      }else{

        // // Insert into orders table
        // await connection.execute(
        //   "INSERT INTO orders (name, email, service_type, service_description) VALUES (?, ?, ?, ?)",
        //   [name, email, service_type, service_description]
        // );

        // await connection.execute('DELETE FROM otps WHERE id = ?', [order_id]);
        await connection.execute('UPDATE orders SET otp = "Confirmed" WHERE id = ?', [order_id]);
        await connection.end();
        return NextResponse.json({ status: "success" });
      }
    }else{
      await connection.end();
      return NextResponse.json({ status: "success" });
    }



    // let otpSuccess = false;
    // let reason;

    // for(let i=0;i<rows.length;i++){
    //   if(rows[i].otp_code === otp){
    //     if(rows[i].order_id === request_id){
    //         // Insert into orders table
    //         await connection.execute(
    //           "INSERT INTO orders (name, email, service_type, service_description) VALUES (?, ?, ?, ?)",
    //           [name, email, service_type, service_description]
    //         );

    //         await connection.execute('DELETE FROM otps WHERE email = ?', [email]);
    //         await connection.end();
    //         otpSuccess = true;
    //         break;
    //       }
    //       else{
    //         reason = 'This is not the otp for the current order';
            
    //       }
    //     }
    //     else{
    //       reason = 'Incorrect OTP';
    //     }
    //   }
      
      
    //   return NextResponse.json({ status: "success" });


    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
