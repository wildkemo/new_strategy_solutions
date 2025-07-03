import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function PUT(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ status: "error", message: "Missing ID or status" });
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

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ status: "error", message: "Order not found" });
    }

    return NextResponse.json({ status: "success", message: "Status updated successfully" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: "Server error" });
  }
}
