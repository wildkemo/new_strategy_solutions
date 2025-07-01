"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../data-management/ServiceDetail.module.css";

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
        found.features = JSON.parse(found.features || "[]");
        setService(found || null);
      } catch (err) {
        console.error("Error:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading)
    return (
      <div className={styles.wrapper}>
        <p>Loading...</p>
      </div>
    );

  if (!service)
    return (
      <div className={styles.wrapper}>
        <p className={styles.notFound}>Service not found</p>
      </div>
    );

  const features = service.features

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <h1 className={styles.serviceTitle}>{service.title}</h1>
        <p className={styles.serviceDescription}>{service.description}</p>
        <h3 className={styles.featuresTitle}>Features:</h3>
        <ul className={styles.featuresList}>
          {features?.map((f, i) => (
            <li
              key={i}
              className={styles.featureItem}
              style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
            >
              <strong>{f.name}</strong>: {f.description}
            </li>
          ))}
        </ul>
        <img src={service.image} alt="failed to load image" width={400} height={250}/>
      </div>
    </div>
  );
}

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8f8f8",
  padding: "1rem",
};

const boxStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "600px",
  width: "100%",
  textAlign: "center",
};
