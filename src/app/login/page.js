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

        if (loginResponse.status === "success") {
          setFormError("");
          setFormSuccess(true);

          // Check if it's admin and redirect accordingly
          if (loginResponse.isAdmin) {
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
      className="loginPageRoot"
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
        className="loginFormContainer"
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
        className="loginLogoContainer"
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
