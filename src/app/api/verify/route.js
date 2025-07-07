import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import {verifyUser} from '../../../lib/session';


export async function POST(req) {

  

  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const { otp, email, purpose } = await req.json();


    if (!otp) {
      return NextResponse.json({status: "error", message: "Missing OTP" }, { status: 400 });
    }


    const [rows] = await connection.execute(
      "SELECT * FROM otps WHERE email = ? AND purpose = ? LIMIT 1",
      [email, purpose]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json(
        {status: "error",
          message: "No OTP found for this email",
        },
        { status: 404 }
      );
    }

    if(rows[0].otp !== otp) {
      await connection.end();
      return NextResponse.json({status: "error", message: "Incorrect OTP" }, { status: 401 });

    }

    const now = new Date();

    if (new Date(rows[0].expires_at) < now){

        await connection.execute("DELETE FROM otps WHERE email = ? AND purpose = ?", [email, purpose]);
        await connection.end();
        return NextResponse.json(
            {status: "error", message: "OTP has expired" },
            { status: 400 }
        );
    }

    await connection.execute("DELETE FROM otps WHERE email = ? AND purpose = ?", [email, purpose]);


    await connection.end();
    return NextResponse.json({ status: "success" }, { status: 200 });




    
    

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
