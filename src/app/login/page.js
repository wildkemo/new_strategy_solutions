"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";
import Image from "next/image";

function Popup({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#d63031",
          padding: "2rem 2.5rem",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          fontWeight: 600,
          fontSize: "1.2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        {message}
      </div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Invalid email address.");
      return;
    }

    try {
      const loginRequest = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!loginRequest.ok) {
        let errorText = await loginRequest.text();
        throw new Error(
          `HTTP error! Status: ${loginRequest.status}, Message: ${errorText}`
        );
      } else {
        const loginResponse = await loginRequest.json();

        if (
          loginResponse.status === "success-user" ||
          loginResponse.status === "success-admin"
        ) {
          setFormError("");
          setFormSuccess(true);

          // Check if it's admin and redirect accordingly
          if (form.email === "admin@gmail.com") {
            window.location.href = "/blank_admin";
          } else {
            window.location.href = "/services";
          }
        } else if (loginResponse.status === "error") {
          setFormError(loginResponse.message);
          setFormSuccess(false);
        } else {
          setFormError("An unknown error occurred");
          setFormSuccess(false);
        }
      }
    } catch (error) {
      setFormError(error.message);
      setFormSuccess(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f1eb",
        display: "flex",
        alignItems: "center",
        padding: "2rem",
        position: "relative",
        zIndex: 2,
        paddingTop: "80px",
      }}
    >
      {/* Left side - Form */}
      <div
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.content}>
          <h2 className={styles.title}>Sign In</h2>
          {formSuccess ? (
            <div className={styles.success}>
              Login successful! Redirecting...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  autoComplete="email"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  type="password"
                  autoComplete="current-password"
                />
              </div>
              {formError && <div className={styles.error}>{formError}</div>}
              <button type="submit" className={styles.button}>
                Sign In
              </button>
              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: "0.7rem",
                  background: "#fff",
                  color: "#444",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  padding: "0.8rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.7rem",
                  cursor: "pointer",
                }}
                onClick={() => console.log("Google sign in clicked")}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 48 48"
                  style={{ verticalAlign: "middle" }}
                >
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.93 37.13 46.1 31.3 46.1 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.67 28.65c-1.01-2.99-1.01-6.31 0-9.3l-7.98-6.2C.99 17.1 0 20.44 0 24c0 3.56.99 6.9 2.69 10.15l7.98-6.2z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.59c-2.01 1.35-4.59 2.16-8.35 2.16-6.38 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.73 42.52 14.82 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </g>
                </svg>
                Sign in with Google
              </button>
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <a
                  href="/register"
                  style={{
                    color: "#4a90e2",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Don't have an account? Register here
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "80vh",
        }}
      >
        <Image
          src="/images/WhatsApp_Image_2025-06-08_at_20.37.40_9716fb98-removebg-preview.png"
          alt="Strategy Solutions Logo"
          fill
          className="loginLogoAnimated"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
}
