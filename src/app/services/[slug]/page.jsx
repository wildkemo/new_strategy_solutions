"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../Services.module.css";
import { request } from "http";
import { useRef } from "react";

const getSlug = (title) =>
  title
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const featureIcons = [
  // Simple SVG icons for demo, you can replace with your own
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#5eb5e8"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 9h6v6H9z" />
  </svg>,
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#5eb5e8"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>,
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#5eb5e8"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#5eb5e8"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </svg>,
];

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [pendingOtpData, setPendingOtpData] = useState(null);
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const otpInputRefs = useRef([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch("/api/get_services/");
        const services = await res.json();
        let found = services.find((s) => getSlug(s.title) === slug);
        if (found) {
          found.features = JSON.parse(found.features || "[]");
          setService(found);
        } else {
          setService(null);
        }
      } catch (err) {
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const orderIdRef = useRef(null); // at top of component

  const requestService = async () => {
    // Check if user is signed in
    const userRes = await fetch("/api/get_current_user/", {
      credentials: "include",
    });
    const userData = await userRes.json();
    if (!userData.user) {
      setShowSignInModal(true);
      return;
    }
    if (service) {
      const response = await fetch("/api/request_service/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          service_type: service.category,
          service_description: service.description,
          otp_only: true,
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
        orderIdRef.current = result.request_id;
        setShowOtpModal(true);
        setOtpSent(true);
      } else if (result.status === "error") {
        alert(result.message);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setLoading(true);

    // Determine which data to use based on whether we're verifying a pending order or a new request
    // const requestData = pendingOtpData || pendingRequestData;

    // Verify OTP first
    const response = await fetch("/api/verify_otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        otp,
        order_id: orderIdRef.current, // Use the ref to get the order ID
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

  const handleOtpBoxChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    let newOtp = otp.split("");
    newOtp[idx] = val;
    setOtp(newOtp.join("").slice(0, 6));
    // Move focus to next input
    if (val && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpBoxKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        otpInputRefs.current[idx - 1]?.focus();
      }
      let newOtp = otp.split("");
      newOtp[idx] = "";
      setOtp(newOtp.join(""));
    } else if (e.key === "ArrowLeft" && idx > 0) {
      otpInputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpBoxPaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste);
      // Focus last input
      setTimeout(() => otpInputRefs.current[5]?.focus(), 0);
    }
    e.preventDefault();
  };

  if (loading) {
    return (
      <div
        className={styles.servicesContainer}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#507c95", fontSize: 18 }}>
          Loading service details...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div
        className={styles.servicesContainer}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#ef4444", fontSize: 20, textAlign: "center" }}>
          Service not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.servicesContainer}
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          alignItems: "center",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 40,
          marginTop: 40,
          width: "100%",
          maxWidth: 1100,
          minHeight: 320,
        }}
      >
        {/* Left: Image */}
        {service.image && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={service.image}
              alt={service.title}
              style={{
                width: "100%",
                maxWidth: 340,
                borderRadius: 16,
                objectFit: "cover",
                aspectRatio: "4/3",
                background: "#f8fafb",
              }}
            />
          </div>
        )}
        {/* Right: Title, Desc, Button */}
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
              color: "#222",
              lineHeight: 1.1,
            }}
          >
            {service.title}
          </h1>
          <p
            style={{ color: "#507c95", fontSize: 18, margin: 0, maxWidth: 600 }}
          >
            {service.description}
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div style={{ width: "100%", maxWidth: 1100, marginTop: 48 }}>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#222",
            marginBottom: 8,
          }}
        >
          Key Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {service.features &&
            service.features.length > 0 &&
            service.features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  minHeight: 160,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  {featureIcons[idx % featureIcons.length]}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#222",
                    marginBottom: 4,
                  }}
                >
                  {feature.name}
                </div>
                <div style={{ color: "#507c95", fontSize: 15 }}>
                  {feature.description}
                </div>
              </div>
            ))}
        </div>
      </div>

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
            <h2 style={{ color: "#11c29b", marginBottom: 16 }}>Success</h2>
            <div style={{ fontSize: "1.1rem", color: "#222", marginBottom: 8 }}>
              Your service has been requested successfully. Stay tuned for our
              company's response.
            </div>
          </div>
        </div>
      )}

      {showSignInModal && (
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <button
              onClick={() => setShowSignInModal(false)}
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
            <h2 style={{ color: "#ef4444", marginBottom: 16 }}>
              Sign In Required
            </h2>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#222",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              You must be signed in to request a service.
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <button
                className={styles.button}
                style={{ background: "#4a90e2", color: "#fff", minWidth: 100 }}
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Sign In
              </button>
              <button
                className={styles.button}
                style={{
                  background: "#f3f3f3",
                  color: "#222",
                  border: "1px solid #ddd",
                  minWidth: 100,
                }}
                onClick={() => {
                  window.location.href = "/services";
                }}
              >
                View All Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons at the bottom (optional, can be moved) */}
      <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
        <a
          href="/services"
          style={{
            background: "#f3f3f3",
            color: "#0e161b",
            padding: "12px 28px",
            borderRadius: 8,
            fontWeight: 500,
            textDecoration: "none",
            border: "1px solid #e0e0e0",
            fontSize: 16,
            transition: "background 0.2s",
          }}
        >
          View All Services
        </a>
        <button
          onClick={requestService}
          style={{
            background: "#5eb5e8",
            color: "#0e161b",
            padding: "12px 28px",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 16,
            border: "none",
            transition: "background 0.2s",
          }}
        >
          Request this Service
        </button>
      </div>
    </div>
  );
}
