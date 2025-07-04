"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../Services.module.css";

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
          <div style={{ marginTop: 18, width: "100%" }}>
            <a
              href="/request-service"
              style={{
                display: "inline-block",
                background: "#4a90e2",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                padding: "14px 0",
                borderRadius: 24,
                textAlign: "center",
                width: 320,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(74,144,226,0.08)",
                transition: "background 0.2s",
              }}
            >
              Explore Services
            </a>
          </div>
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
        <p style={{ color: "#507c95", fontSize: 18, marginBottom: 32 }}>
          Our hardware services are designed to meet your specific needs,
          ensuring optimal performance and longevity of your systems.
        </p>
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
        <a
          href="/request-service"
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
        </a>
      </div>
    </div>
  );
}
