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
  onMouseLeave={() => setHoveredService(null)}    // Keep for other hover effects
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
export { data };
