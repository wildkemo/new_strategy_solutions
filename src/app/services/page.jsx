"use client";
import React, { useEffect, useState } from "react";
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
          features: JSON.parse(service.features),
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
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.serviceRow}
              style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}
            >
              {row.map((service, colIndex) => {
                const globalIndex = rowIndex * servicesPerRow + colIndex;
                const isBlurred =
                  hoveredIndex !== null && hoveredIndex !== globalIndex;
                const isFocused = hoveredIndex === globalIndex;
                return (
                  <div
                    key={service.id}
                    className={`${styles.serviceBox} ${
                      colorClasses[globalIndex % colorClasses.length]
                    } ${isBlurred ? styles.blurred : ""} ${
                      isFocused ? styles.focused : ""
                    }`}
                    style={{ flex: 1 }}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link href={`/services/${getSlug(service.title)}`}>
                      <h2>{service.title}</h2>
                      {service.description && <p>{service.description}</p>}
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
export { data };
