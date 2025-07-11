"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";
import Image from "next/image";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setFormError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Invalid email address.");
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/send_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "Reset Password" }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setFormSuccess("OTP sent successfully to your email!");
        setFormError("");
      } else {
        setFormError(data.message || "Failed to send OTP. Please try again.");
        setFormSuccess("");
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.");
      setFormSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (
      !form.otp.trim() ||
      !form.newPassword.trim() ||
      !form.confirmPassword.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          password: form.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setFormSuccess("Password reset successfully! Redirecting to login...");
        setFormError("");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setFormError(
          data.message || "Failed to reset password. Please try again."
        );
        setFormSuccess("");
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.");
      setFormSuccess("");
    } finally {
      setIsLoading(false);
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
          <h2 className={styles.title}>Forgot Password</h2>
          {formSuccess && <div className={styles.success}>{formSuccess}</div>}

          <form onSubmit={handleResetPassword} className={styles.form}>
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
              <label className={styles.label}>OTP</label>
              <input
                className={styles.input}
                name="otp"
                value={form.otp}
                onChange={handleChange}
                required
                type="text"
                placeholder="Enter the OTP sent to your email"
                maxLength="6"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>New Password</label>
              <input
                className={styles.input}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                className={styles.input}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="button"
                className={styles.button}
                disabled={isLoading}
                onClick={handleSendOTP}
                style={{ flex: 1, borderRadius: "4px" }}
              >
                {isLoading ? "Sending..." : "Send OTP to this email"}
              </button>

              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
                style={{ flex: 1, borderRadius: "4px" }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>

            {formError && <div className={styles.error}>{formError}</div>}

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <a
                href="/login"
                style={{
                  color: "#4a90e2",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Back to Login
              </a>
            </div>
          </form>
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
