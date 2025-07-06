import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import {verifyUser} from '../../../lib/session';


export async function POST(req) {

  const validSession = verifyUser();

  if(!validSession){
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 }
      );
    }

    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = decoded.email;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // console.log("Email:", email);

    const { otp, service_type, service_description, name, order_id } =
      await req.json();

    // let order_id = 30

    if (!otp) {
      return NextResponse.json({ error: "Missing OTP" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM orders WHERE id = ? LIMIT 1",
      [order_id]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json(
        {
          error:
            "Order not found or not verified in time,\n please re-order it",
        },
        { status: 404 }
      );
    }
    
    const otpRecord = rows[0];
    const now = new Date();

    if (otpRecord.otp !== "Confirmed") {
      if (new Date(otpRecord.expires_at) < now) {
        await connection.execute("DELETE FROM orders WHERE id = ?", [order_id]);
      await connection.end();
        return NextResponse.json({ error: "OTP expired" }, { status: 410 });
      }
    
      if (otpRecord.otp !== otp) {
        await connection.end();
        return NextResponse.json({ error: "Incorrect OTP" }, { status: 401 });
      } else {
        // // Insert into orders table
        // await connection.execute(
        //   "INSERT INTO orders (name, email, service_type, service_description) VALUES (?, ?, ?, ?)",
        //   [name, email, service_type, service_description]
        // );

        // await connection.execute('DELETE FROM otps WHERE id = ?', [order_id]);
        await connection.execute(
          'UPDATE orders SET otp = "Confirmed", status = "approved" WHERE id = ?',
          [order_id]
        );
        await connection.end();

        // Send thank you email
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Strategy Solutions" <${process.env.EMAIL_USER}>`,
            to: otpRecord.email,
            subject: "Your Service Request Has Been Approved",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #0070f3; margin: 0;">Hello ${
                    otpRecord.name
                  },</h2>
                </div>
                
                <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    Great news! Your service request for <strong style="color: #0070f3;">${
                      otpRecord.service_type
                    }</strong> has been successfully approved.
                  </p>
                  
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Request Details:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li><strong>Service Type:</strong> ${
                        otpRecord.service_type
                      }</li>
                      <li><strong>Description:</strong> ${
                        otpRecord.service_description
                      }</li>
                      <li><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Approved</span></li>
                      <li><strong>Approval Date:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 1.6;">
                    Our team will contact you within 24 hours to discuss the next steps and begin working on your project.
                  </p>
                  
                  <p style="font-size: 16px; line-height: 1.6;">
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      Thank you for choosing <strong style="color: #0070f3;">Strategy Solutions</strong>!
                    </p>
                  </div>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Error sending thank you email:", emailError);
        }

        return NextResponse.json({ status: "success" });
      }
    } else {
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
