"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";
import { validateRegistrationForm } from "../../lib/formSanitizer";

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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [showUserExists, setShowUserExists] = useState(false);
  const [userExistsMessage, setUserExistsMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpVerification = async () => {
    // console.log("OTP Verification initiated with:", otp);

    const verification = await fetch("/api/verify/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: form.email,
        otp: otp, // This is the user-entered OTP from state
        purpose: "register",
      }),
    });

    if (verification.ok) {
      const verificationResponse = await verification.json();
      if (verificationResponse.status === "success") {
        setFormSuccess(true);
        setShowOtpModal(false);
        setFormError("");

        const insertCustomer = await fetch("/api/insert_new_customer/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            company_name: form.companyName,
            password: form.password, // Ensure this is hashed in the backend
          }),
        });

        if (insertCustomer.ok) {
          const insertResponse = await insertCustomer.json();
          if (insertResponse.status === "success") {
            // alert("Registration successful! You can now log in.");
            setFormSuccess(true);
            // Optionally redirect to login page
            // window.location.href = "/login";
            const loginCustomer = await fetch("/api/login/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                email: form.email,
                password: form.password,
              }),
            });

            if (loginCustomer.ok) {
              const loginResponse = await loginCustomer.json();
              if (loginResponse.status === "success") {
                // Redirect to dashboard or home page
                window.location.href = "/services";
              } else {
                alert(
                  loginResponse.message || "Login failed. Please try again."
                );
              }
            }
          } else {
            setFormError(insertResponse.message || "Failed to register user.");
          }
        }
      } else {
        alert("OTP verification failed. Please try again.");
      }
    }
    // Handle response...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate and sanitize form data
    const validation = validateRegistrationForm(form);

    if (!validation.isValid) {
      // Show first error found
      const firstError = Object.values(validation.errors)[0];
      setFormError(firstError);
      return;
    }

    // Use sanitized data
    const sanitizedData = validation.sanitized;

    const registerRequest = await fetch(
      "/api/register/",
      // "http://localhost/www/oop_project/php_backend/app/Controllers/register.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          password: sanitizedData.password,
          company_name: sanitizedData.companyName,
        }),
      }
    );

    if (!registerRequest.ok) {
      let errorText = await registerRequest.text();
      // Try to parse JSON error
      let errorMsg = "";
      try {
        const errorObj = JSON.parse(errorText);
        errorMsg = errorObj.message || errorObj.error || errorText;
      } catch {
        errorMsg = errorText;
      }
      if (
        registerRequest.status === 409 ||
        (errorMsg && errorMsg.toLowerCase().includes("already"))
      ) {
        setUserExistsMessage(
          "This email is already registered. Please sign in or use another email to sign up."
        );
        setShowUserExists(true);
        return;
      }
      throw new Error(
        `HTTP error! Status: ${registerRequest.status}, Message: ${errorText}`
      );
    } else {
      const registerResponse = await registerRequest.json();

      if (registerResponse.status == "success") {
        setShowOtpModal(true);
      } else {
        if (
          registerResponse.message &&
          registerResponse.message.toLowerCase().includes("already exists")
        ) {
          setShowUserExists(true);
        } else {
          setFormError(registerResponse.message);
        }
      }
    }

    // if (!registerRequest.ok) {
    //   let errorText = await registerRequest.text();
    //   throw new Error(
    //     `HTTP error! Status: ${registerRequest.status}, Message: ${errorText}`
    //   );
    // }
    // else{
    //   const registerResponse = await registerRequest.json();

    //   if (registerResponse.status == "sucess") {
    //     alert(registerResponse.action);
    //   } else if (registerResponse.status == "fail") {
    //     alert(registerResponse.action);
    //   }
    // }

    // setFormError("");
    // setFormSuccess(true);

    // You can add backend logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Register</h2>
        {showUserExists && (
          <Popup
            message={userExistsMessage || "User already exists"}
            onClose={() => setShowUserExists(false)}
          />
        )}
        {showOtpModal && (
          <div className={styles.otpModalOverlay}>
            <div className={styles.otpModal}>
              <button
                onClick={() => setShowOtpModal(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 14,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#888",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 style={{ color: "#11c29b", marginBottom: 16 }}>
                Enter 6-Digit OTP
              </h2>
              <div
                style={{
                  fontSize: "1.1rem",
                  color: "#222",
                  marginBottom: 18,
                  textAlign: "center",
                }}
              >
                We sent a 6-digit code to your email. Please enter it below to
                verify your account.
              </div>
              <form autoComplete="off" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className={styles.otpInput}
                    placeholder="------"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    autoFocus
                    style={{ marginBottom: "1.2rem" }}
                  />
                  {otpError && (
                    <div className={styles.otpError}>{otpError}</div>
                  )}
                  <button
                    type="button"
                    className={styles.button}
                    disabled={otp.length !== 6}
                    style={{ width: 160 }}
                    onClick={handleOtpVerification}
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {formSuccess ? (
          <div className={styles.success}>
            Registration successful! You can now log in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
              <label className={styles.label}>Company Name</label>
              <input
                className={styles.input}
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                type="tel"
                autoComplete="tel"
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
                autoComplete="new-password"
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
              />
            </div>
            {formError && <div className={styles.error}>{formError}</div>}
            <button
              type="submit"
              className={styles.button}
              style={{ borderRadius: "4px" }}
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
