"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const colorClasses = [styles.box1, styles.box2, styles.box3, styles.box4];

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);
  const gridRef = useRef(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/get_services/", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        data = data.map((service) => ({
          ...service,
          features: service.features ? JSON.parse(service.features) : [],
        }));
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Split services into rows of 4
  const servicesPerRow = 4;
  const rows = [];
  for (let i = 0; i < services.length; i += servicesPerRow) {
    rows.push(services.slice(i, i + servicesPerRow));
  }

  // Convert features string to array
  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    return features.split(",").map((f) => f.trim());
  };

  const handleMouseMove = (e) => {
    document.querySelectorAll(".serviceBox").forEach((box) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      box.style.setProperty("--x", `${x}px`);
      box.style.setProperty("--y", `${y}px`);
    });
  };

  // Function to check if user is signed in
  const handleRequestService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/get_current_user/", {
        credentials: "include",
      });
      const data = await res.json();
      if (data && data.user) {
        window.location.href = "/request-service";
      } else {
        setShowSignInModal(true);
      }
    } catch (err) {
      setShowSignInModal(true);
    }
  };

  return (
    <div className={styles.servicesContainer} onMouseMove={handleMouseMove}>
      {showPopup && <div className={styles.popup}>{/* Popup content */}</div>}
      <div className={styles.servicesContent}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1.5rem",
            padding: "1rem 0 0 0",
          }}
        >
          <div
            style={{
              minWidth: 280,
              flex: 1,
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h1
              className={styles.servicesTitle}
              style={{
                color: "#0e161b",
                textAlign: "left",
                fontWeight: 800,
                fontSize: 44,
                marginBottom: 8,
                marginTop: 0,
              }}
            >
              Our Services
            </h1>
            <p
              style={{
                color: "#507c95",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              We offer a range of technology solutions to help your business
              thrive in the digital age.
            </p>
          </div>
        </div>
        <div
          className={styles.servicesGrid}
          style={{ marginTop: 24, position: "relative" }}
          ref={gridRef}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            {isLoading && <div>Loading...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {!isLoading &&
              !error &&
              services.map((service) => (
                <div
                  key={service.id}
                  className={styles.serviceBox}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 20,
                    borderRadius: 12,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    minHeight: 320,
                  }}
                  onMouseEnter={() => setHoveredService(service)} // Keep for other hover effects
                  onMouseLeave={() => setHoveredService(null)} // Keep for other hover effects
                >
                  <Link
                    href={`/services/${getSlug(service.title)}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    {/* 👇 Always visible (no hover check) 👇 */}
                    {service.image && (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          background: "#f8fafb",
                          borderRadius: 8,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url(${service.image})`,
                        }}
                      />
                    )}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <p
                        style={{
                          color: "#0e161b",
                          fontWeight: 600,
                          fontSize: 18,
                          margin: 0,
                        }}
                      >
                        {service.title}
                      </p>
                      <p
                        style={{
                          color: "#507c95",
                          fontSize: 14,
                          fontWeight: 400,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "3.9em",
                          lineHeight: "1.3em",
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </Link>
                  {/* <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
    <Link
      href="/request-service"
      style={{
        background: "#5eb5e8",
        color: "#0e161b",
        padding: "8px 18px",
        borderRadius: 8,
        fontWeight: 600,
        textDecoration: "none",
        fontSize: 14,
        border: "none",
        transition: "background 0.2s",
      }}
    >
      Request this Service
    </Link>
  </div> */}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "48px 0 32px 0",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "36px 24px 32px 24px",
            maxWidth: 600,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: 29,
              fontWeight: 800,
              color: "#111",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              color: "#5a7d91",
              fontSize: 18,
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 600,
            }}
          >
            Let's discuss how our IT solutions can transform your business.
            Request a Service Now.
          </p>
          <button
            onClick={handleRequestService}
            style={{
              background: "#5eb5e8",
              color: "#0e161b",
              padding: "10px 22px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
              textAlign: "center",
              marginTop: 8,
              marginBottom: 0,
              display: "inline-block",
              border: "none",
              cursor: "pointer",
            }}
          >
            Request a Service
          </button>
        </div>
      </div>

      {/* Sign In Required Modal */}
      {showSignInModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(16, 30, 54, 0.13)",
              padding: "2.5rem 2rem 2.5rem 2rem",
              maxWidth: 370,
              width: "100%",
              textAlign: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setShowSignInModal(false)}
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
              aria-label="Close"
            >
              &times;
            </button>
            <h2
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#ff5a5a",
                marginBottom: 16,
                marginTop: 0,
                letterSpacing: "-1px",
              }}
            >
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
                gap: 16,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <button
                style={{
                  background: "#4a90e2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "0.5em 1.2em",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: "0 2px 8px rgba(16, 30, 54, 0.1)",
                  cursor: "pointer",
                  transition: "background 0.18s",
                }}
                onClick={() => (window.location.href = "/login")}
              >
                Sign In
              </button>
              <button
                style={{
                  background: "#f3f3f3",
                  color: "#222",
                  border: "none",
                  borderRadius: 20,
                  padding: "0.5em 1.2em",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: "0 2px 8px rgba(16, 30, 54, 0.1)",
                  cursor: "pointer",
                  transition: "background 0.18s",
                }}
                onClick={() => setShowSignInModal(false)}
              >
                View All Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a className={styles.footerLink} href="/privacy">
              Privacy Policy
            </a>
            <a className={styles.footerLink} href="/terms">
              Terms of Service
            </a>
          </div>
          <p className={styles.footerCopyright}>
            © 2025 Strategy Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Services;
