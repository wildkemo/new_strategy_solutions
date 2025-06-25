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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/get_services/", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Split services into rows of 5
  const servicesPerRow = 5;
  const rows = [];
  for (let i = 0; i < services.length; i += servicesPerRow) {
    rows.push(services.slice(i, i + servicesPerRow));
  }

  // Convert features string to array
  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    return features.split(',').map(f => f.trim());
  };

  return (
    <div className={styles.servicesContainer}>
      {showPopup && (
        <div className={styles.popup}>
          {/* Popup content */}
        </div>
      )}
      <div className={styles.servicesContent}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.serviceRow}>
              {row.map((service) => (
                <div key={service.id} className={`${styles.serviceBox} ${
                  colorClasses[(rowIndex * servicesPerRow + row.indexOf(service)) % colorClasses.length]
                }`}>
                  <Link href={`/services/${getSlug(service.title)}`}>
                    <h2>{service.title}</h2>
                    {service.description && <p>{service.description}</p>}
                    <ul>
                      {parseFeatures(service.features).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
export {data};