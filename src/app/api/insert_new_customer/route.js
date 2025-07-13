import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateCompanyName,
  validatePassword,
} from "../../../lib/formSanitizer";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(req) {
  try {
    const { name, email, phone, company_name, password } = await req.json();

    if (!name || !email || !phone || !company_name || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Server-side validation
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      );
    }

    const companyValidation = validateCompanyName(company_name);
    if (!companyValidation.isValid) {
      return NextResponse.json(
        { error: companyValidation.error },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Use sanitized data
    const sanitizedData = {
      name: nameValidation.sanitized,
      email: emailValidation.sanitized,
      phone: phoneValidation.sanitized,
      company_name: companyValidation.sanitized,
      password: passwordValidation.sanitized,
    };

    // Check if email already exists
    const [existing] = await pool.query(
      "SELECT id FROM customers WHERE email = ?",
      [sanitizedData.email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);

    const [result] = await pool.query(
      "INSERT INTO customers (name, email, phone, company_name, password) VALUES (?, ?, ?, ?, ?)",
      [sanitizedData.name, sanitizedData.email, sanitizedData.phone, sanitizedData.company_name, hashedPassword]
    );

    return NextResponse.json({
      status: "success",
      message: "Customer created",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
