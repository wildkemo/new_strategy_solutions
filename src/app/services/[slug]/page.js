"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
        const found = services.find((s) => getSlug(s.title) === slug);
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
      <div style={wrapperStyle}>
        <p>Loading...</p>
      </div>
    );

  if (!service)
    return (
      <div style={wrapperStyle}>
        <p style={{ color: "red" }}>Service not found</p>
      </div>
    );

  const features = service.features?.split(",").map((f) => f.trim());

  return (
    <div style={wrapperStyle}>
      <div style={boxStyle}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{service.title}</h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>{service.description}</p>
        <h3 style={{ marginBottom: "0.5rem" }}>Features:</h3>
        <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
          {features?.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
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
