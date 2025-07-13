"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";
import Image from "next/image";
import { validateLoginForm } from "../../lib/formSanitizer";

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

    // Validate and sanitize form data
    const validation = validateLoginForm(form);

    if (!validation.isValid) {
      // Show first error found
      const firstError = Object.values(validation.errors)[0];
      setFormError(firstError);
      return;
    }

    // Use sanitized data
    const sanitizedData = validation.sanitized;

    try {
      const loginRequest = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: sanitizedData.email,
          password: sanitizedData.password,
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
              <button
                type="submit"
                className={styles.button}
                style={{ borderRadius: "4px" }}
              >
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
                <br />
                <a
                  href="/forgot-password"
                  style={{
                    color: "#4a90e2",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                    display: "inline-block",
                  }}
                >
                  Forgot my password?
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

      <style jsx>{`
        @media (max-width: 768px) {
          .loginPageRoot {
            width: 100vw !important;
            height: 100vh !important;
            min-height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: #f3f1eb !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          .loginFormContainer {
            width: 100vw !important;
            height: 100vh !important;
            flex: 1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }

          .loginLogoContainer {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .loginPageRoot {
            padding-top: 0 !important;
          }

          .loginFormContainer {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
