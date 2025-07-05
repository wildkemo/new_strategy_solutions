"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RequestService.module.css";
import LoadingScreen from "../components/LoadingScreen";
import { useRef } from 'react';


const validateSession = async () => {
  // const response2 = await fetch(
  //   // "http://localhost/strategy_solutions_backend/app/Controllers/validate_request.php",
  //   "http://localhost:3000/APIs/Controllers/validate_request.js",
  //   { headers: { "Content-Type": "application/json" }, credentials: "include" }
  // );
  // if (!response2.ok) throw new Error("Failed to fetch services");
  // let result = await response2.json();
  // if (result.status != "success") {
  //   return false;
  //   throw new Error("Permission required");
  // } else {
  //   return true;
  // }
};

function PopupNotification({ message, onClose, error }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.3)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
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
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 12, color: "#0070f3" }}>
          {error ? "Error" : "Success"}
        </h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}

export default function RequestService() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingRequestData, setPendingRequestData] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const isValid = await validateSession();
  //     if (!isValid) {
  //       window.location.href = "/"; // redirect here if not allowed
  //     } else {
  //       setCheckingSession(false);
  //     }
  //   };
  //   checkSession();
  // }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        window.location.href = "/services?requested=1";
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  useEffect(() => {
    // Fetch signed-in user's email
    // const fetchSignedInEmail = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost/3000/APIs/Controllers/get_current_user.js",
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         credentials: "include",
    //       }
    //     );
    //     if (response.ok) {
    //       const data = await response.json();
    //       if (data && data[0] && data[0].email) {
    //         setSignedInEmail(data[0].email);
    //       }
    //     }
    //   } catch {}
    // };
    // fetchSignedInEmail();
  }, []);

  useEffect(() => {
    // Check if user is signed in
    const checkUser = async () => {
      try {
        const response = await fetch("/api/get_current_user/", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Not signed in");
        const data = await response.json();
        if (!data.user) {
          setShowSignInModal(true);
        }
      } catch {
        setShowSignInModal(true);
      } finally {
        setCheckingUser(false);
      }
    };
    checkUser();
  }, [router]);

  const validateForm = () => {
    return true;
  };

  // let order_id;
  const orderIdRef = useRef(null); // at top of component


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Send OTP only, do not submit the service request yet
    const response = await fetch("/api/request_service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        service_type: formData.serviceType,
        service_description: formData.description,
        otp_only: true, // Add a flag so backend knows to only send OTP
      }),
    });
    setLoading(false);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }
    const result = await response.json();
    if (result.status === "otp_sent") {
      // order_id = result.request_id
      orderIdRef.current = result.request_id;

      setPendingRequestData({ ...formData });
      setShowOtpModal(true);
      setOtpSent(true);
    } else if (result.status === "error") {
      alert(result.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setLoading(true);
    // Verify OTP first
    const response = await fetch("/api/verify_otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: pendingRequestData.email,
        otp,
        order_id: orderIdRef.current, // Use the ref to get the order ID
        service_type: pendingRequestData.serviceType,
        service_description: pendingRequestData.description,
        name: pendingRequestData.name,
      }),
    });
    setLoading(false);
    const result = await response.json();
    if (!response.ok) {
      setOtpError(result.error || "Failed to verify OTP. Try again.");
      return;
    }
    if (result.status === "success") {
      // Now submit the actual service request
      setLoading(true);
      // const serviceResponse = await fetch("/api/request_service/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     service_type: pendingRequestData.serviceType,
      //     service_description: pendingRequestData.description,
      //     email: pendingRequestData.email,
      //     name: pendingRequestData.name,
      //     phone: pendingRequestData.phone,
      //   }),
      // });
      setLoading(false);
      // if (!serviceResponse.ok) {
      //   setOtpError("Failed to submit service request after OTP verification.");
      //   return;
      // }
      setShowOtpModal(false);
      setShowPopup(true);
    } else {
      setOtpError(result.error || "Invalid OTP. Try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (checkingSession) return <div className={styles.loading}>Loading...</div>;
  if (loading) return <LoadingScreen />;
  if (checkingUser) return <LoadingScreen />;
  if (showSignInModal) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            color: "#222",
            padding: "2.5rem 2rem 2rem 2rem",
            borderRadius: "14px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: 16, color: "#0070f3" }}>
            Sign In Required
          </h2>
          <div style={{ fontSize: "1.1rem", marginBottom: 24 }}>
            To request a service, please sign in.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              style={{
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.7rem 1.3rem",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
            <button
              style={{
                background: "#f3f3f3",
                color: "#222",
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "0.7rem 1.3rem",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => router.push("/services")}
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showPopup && (
        <PopupNotification
          message={
            "Your service has been requested successfully. Stay tuned for our company's response."
          }
          onClose={() => setShowPopup(false)}
        />
      )}
      {showEmailPopup && (
        <PopupNotification
          message={"Enter your mail you have signed in with"}
          onClose={() => setShowEmailPopup(false)}
          error
        />
      )}
      {showOtpModal && (
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <h2>Enter 6-Digit OTP</h2>
            <p>We sent a 6-digit code to your email. Please enter it below:</p>
            <form onSubmit={handleOtpSubmit} autoComplete="off">
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
              />
              {otpError && <div className={styles.otpError}>{otpError}</div>}
              <button
                type="submit"
                className={styles.button}
                disabled={otp.length !== 6}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {!isSubmitted && (
        <div className={styles.content}>
          <h1 className={styles.title}>Request a Service</h1>
          <p className={styles.subtitle}>
            Fill out the form below and we'll get back to you within 24 hours
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.email ? styles.error : ""
                }`}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="serviceType" className={styles.label}>
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`${styles.input} ${styles.select} ${
                  errors.serviceType ? styles.error : ""
                }`}
              >
                <option value="">Select a service</option>
                <option value="data-management">
                  Data Management Solutions
                </option>
                <option value="cloud-virtualization">
                  Cloud & Virtualization
                </option>
                <option value="oracle-database">
                  Oracle Database Technologies
                </option>
                <option value="hardware-infrastructure">
                  Hardware Infrastructure
                </option>
                <option value="cyber-security">Cyber Security Services</option>
                <option value="business-continuity">Business Continuity</option>
                <option value="erp-solutions">ERP Solutions</option>
                <option value="project-management">Project Management</option>
                <option value="fusion-middleware">
                  Fusion Middleware Technologies
                </option>
                <option value="outsourcing-support">
                  Outsourcing & Support
                </option>
                <option value="other">Other</option>
              </select>
              {errors.serviceType && (
                <span className={styles.error}>{errors.serviceType}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Service Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${styles.textarea} ${
                  errors.description ? styles.error : ""
                }`}
                rows="5"
              />
              {errors.description && (
                <span className={styles.error}>{errors.description}</span>
              )}
            </div>

            <button type="submit" className={styles.button}>
              Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
