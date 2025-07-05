import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function PUT(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({
        status: "error",
        message: "Missing ID or status",
      });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ status: "error", message: "Order not found" });
    }

    // If status is being changed to "Done", send completion email
    if (status === "Done") {
      try {
        // Get order details for email
        const [orderDetails] = await connection.execute(
          "SELECT * FROM orders WHERE id = ? LIMIT 1",
          [id]
        );

        if (orderDetails.length > 0) {
          const order = orderDetails[0];

          // Send completion email
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
            subject: "Your Service Has Been Successfully Completed",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #0070f3; margin: 0;">Hello ${
                    order.name
                  },</h2>
                </div>
                
                <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
                  <p style="font-size: 16px; line-height: 1.6;">
                    We're pleased to inform you that your service request for <strong style="color: #0070f3;">${
                      order.service_type
                    }</strong> has been <strong>successfully completed</strong>.
                  </p>
                  
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Final Details:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li><strong>Service Type:</strong> ${
                        order.service_type
                      }</li>
                      <li><strong>Description:</strong> ${
                        order.service_description
                      }</li>
                      <li><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Completed</span></li>
                      <li><strong>Completed On:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 1.6;">
                    We appreciate your trust in Strategy Solutions. If you have any feedback, questions, or new requests, feel free to reach out.
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      Thank you once again for choosing <strong style="color: #0070f3;">Strategy Solutions</strong>.
                    </p>
                  </div>
                </div>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error("Error sending completion email:", emailError);
        // Don't fail the status update if email fails
      }
    }

    await connection.end();

    return NextResponse.json({
      status: "success",
      message:
        status === "Done"
          ? "Status updated and completion email sent"
          : "Status updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: "Server error" });
  }
}
