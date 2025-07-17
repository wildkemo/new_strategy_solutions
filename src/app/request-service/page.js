"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RequestService.module.css";
import LoadingScreen from "../components/LoadingScreen";
import { useRef } from "react";
import { validateServiceRequestForm } from "../../lib/formSanitizer";

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

function RequestService() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [pendingOtpData, setPendingOtpData] = useState(null);

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
        } else {
          // If user is signed in and verify_otp parameter is present, fetch pending OTP orders
          if (searchParams.get("verify_otp") === "true") {
            await fetchPendingOtpOrders();
          }
        }
      } catch {
        setShowSignInModal(true);
      } finally {
        setCheckingUser(false);
      }
    };
    checkUser();
  }, [router, searchParams]);

  const fetchPendingOtpOrders = async () => {
    try {
      const response = await fetch("/api/get_pending_otp_orders/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending OTP orders");
      }

      const data = await response.json();
      if (data.status === "success" && data.pendingOrders.length > 0) {
        // Use the first pending order
        const firstOrder = data.pendingOrders[0];
        setPendingOtpData({
          orderId: firstOrder.id,
          serviceType: firstOrder.service_type,
          serviceDescription: firstOrder.service_description,
          email: "", // Will be filled from user data
          name: "", // Will be filled from user data
        });
        orderIdRef.current = firstOrder.id;
        setShowOtpModal(true);
      }
    } catch (err) {
      console.error("Error fetching pending OTP orders:", err);
    }
  };

  const validateForm = () => {
    return true;
  };

  // let order_id;
  const orderIdRef = useRef(null); // at top of component

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate and sanitize form data
    const validation = validateServiceRequestForm(formData);

    if (!validation.isValid) {
      // Show first error found
      const firstError = Object.values(validation.errors)[0];
      alert(firstError);
      return;
    }

    // Use sanitized data
    const sanitizedData = validation.sanitized;

    setLoading(true);
    // Send OTP only, do not submit the service request yet
    const response = await fetch("/api/request_service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: sanitizedData.email,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        service_type: sanitizedData.serviceType,
        service_description: sanitizedData.description,
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

    // Determine which data to use based on whether we're verifying a pending order or a new request
    const requestData = pendingOtpData || pendingRequestData;

    // Verify OTP first
    const response = await fetch("/api/verify_otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: requestData.email,
        otp,
        order_id: orderIdRef.current, // Use the ref to get the order ID
        service_type: requestData.serviceType,
        service_description:
          requestData.serviceDescription || requestData.description,
        name: requestData.name,
      }),
    });
    setLoading(false);
    const result = await response.json();
    if (!response.ok) {
      setOtpError(result.error || "Failed to verify OTP. Try again.");
      return;
    }
    if (result.status === "success") {
      setShowOtpModal(false);
      setShowPopup(true);
      // Clear the pending OTP data if it was a pending order
      if (pendingOtpData) {
        setPendingOtpData(null);
      }
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
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <button
              onClick={() => setShowPopup(false)}
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
            <h2
              style={{
                color: "#11c29b",
                marginBottom: 16,
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "-1px",
              }}
            >
              Success
            </h2>
            <div
              style={{
                fontSize: "1.18rem",
                color: "#222",
                marginBottom: 8,
                marginTop: 0,
                textAlign: "center",
              }}
            >
              Your service has been requested successfully. Stay tuned for our
              company's response.
            </div>
          </div>
        </div>
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
            <p>
              {pendingOtpData
                ? "Please enter the 6-digit code sent to your email to verify your pending service request:"
                : "We sent a 6-digit code to your email. Please enter it below:"}
            </p>
            {pendingOtpData && (
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  border: "1px solid #e9ecef",
                }}
              >
                <strong>Service:</strong> {pendingOtpData.serviceType}
                <br />
                <strong>Description:</strong>{" "}
                {pendingOtpData.serviceDescription}
              </div>
            )}
            <form
              onSubmit={handleOtpSubmit}
              autoComplete="off"
              style={{ width: "100%" }}
            >
              <div className={styles.otpFormRow}>
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
                <button
                  type="submit"
                  className={styles.button}
                  disabled={otp.length !== 6}
                >
                  {pendingOtpData ? "Verify OTP" : "Submit"}
                </button>
              </div>
              {otpError && <div className={styles.otpError}>{otpError}</div>}
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

export default function RequestServicePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RequestService />
    </Suspense>
  );
}
