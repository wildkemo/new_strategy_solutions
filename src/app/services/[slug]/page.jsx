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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={styles.serviceBox}
        style={{
          maxWidth: 900,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 32,
          display: "flex",
          flexDirection: "row",
          gap: 32,
        }}
      >
        {/* Left: Text Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#0e161b",
              fontWeight: 700,
              fontSize: 28,
              margin: 0,
            }}
          >
            {service.title}
          </h2>
          <p
            style={{
              color: "#507c95",
              fontSize: 16,
              fontWeight: 400,
              margin: 0,
            }}
          >
            {service.description}
          </p>
          {service.features && service.features.length > 0 && (
            <ul
              style={{
                margin: "16px 0 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {service.features.map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    color: "#0e161b",
                    fontSize: 15,
                    paddingLeft: 18,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 2,
                      width: 8,
                      height: 8,
                      background: "#5eb5e8",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  ></span>
                  <strong>{feature.name}</strong>
                  {feature.description && (
                    <div style={{ color: "#507c95", fontSize: 14 }}>
                      {feature.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <a
              href="/services"
              style={{
                background: "#f3f3f3",
                color: "#0e161b",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid #e0e0e0",
                fontSize: 15,
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
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 15,
                border: "none",
                transition: "background 0.2s",
              }}
            >
              Request this Service
            </a>
          </div>
        </div>
        {/* Right: Image */}
        {service.image && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 340,
                aspectRatio: "1/1",
                background: "#f8fafb",
                borderRadius: 12,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${service.image})`,
                minHeight: 220,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
