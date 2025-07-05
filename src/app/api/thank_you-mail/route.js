import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { status: "error", message: "Missing order ID" },
        { status: 400 }
      );
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND otp = "Confirmed" LIMIT 1',
      [order_id]
    );

    if (orders.length === 0) {
      await db.end();
      return NextResponse.json(
        { status: "error", message: "Order not found or not verified" },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Update order status to active
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [
      "Active",
      order.id,
    ]);

    await db.end();

    // Email the customer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Strategy Solutions" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: "Your Service Request Has Been Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0070f3; margin: 0;">Hello ${order.name},</h2>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <p style="font-size: 16px; line-height: 1.6;">
              Great news! Your service request for <strong style="color: #0070f3;">${
                order.service_type
              }</strong> has been successfully approved.
            </p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Request Details:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Service Type:</strong> ${order.service_type}</li>
                <li><strong>Description:</strong> ${
                  order.service_description
                }</li>
                <li><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Active</span></li>
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

    return NextResponse.json(
      { status: "success", message: "Order confirmed and email sent" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error confirming order:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
