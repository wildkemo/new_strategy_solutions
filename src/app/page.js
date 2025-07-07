"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch user data to determine if signed in
    const fetchUserData = async () => {
      try {
        const response = await fetch("api/get_current_user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.user) {
            setUser(userData.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <main className={styles.homeContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Empowering businesses with innovative strategies and solutions
              </h1>
              <p className={styles.heroSubtitle}>
                We provide cutting-edge IT consulting, cloud computing, and
                cybersecurity services to help your business thrive in the
                digital age.
              </p>
            </div>
            <a href="/services" className={styles.exploreBtn}>
              Explore Our Services
            </a>
          </div>
        </section>

        {/* Company Info Section */}
        <section
          style={{
            maxWidth: 960,
            margin: "32px auto 0 auto",
            padding: "0 20px",
          }}
        >
          <h2 className={styles.sectionTitle}>Strategy Solution</h2>
          <p
            className={styles.sectionDescription}
            style={{ marginBottom: 16, marginTop: 16 }}
          >
            Strategy Solution is a distinguished provider of specialized
            Information Technology talent outsourcing and consultancy services,
            headquartered in Cairo, Egypt. With over two decades of experience
            in the regional IT sector, our team possesses the expertise and
            capabilities required to deliver a comprehensive suite of services.
            We empower our clients by offering high-caliber resources in a
            cost-efficient and operationally effective manner, supporting the
            growth and success of their businesses and their customers.
          </p>
          <p className={styles.sectionDescription}>
            Our service portfolio is underpinned by a long-standing commitment
            to the development and enablement of Egyptian IT professionals. Over
            the past 20 years, we have cultivated privileged access to Egypt's
            extensive pool of technology talent, allowing us to deliver
            customized solutions that align precisely with our clients'
            strategic objectives.
          </p>
        </section>

        {/* Core Services Section */}
        <section className={styles.servicesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Core Services</h2>
            <p className={styles.sectionDescription}>
              We offer a comprehensive suite of services designed to meet the
              evolving needs of modern businesses.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"></path>
                </svg>
              </div>
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>Cloud Computing</h3>
                <p className={styles.serviceDescription}>
                  Scalable and secure cloud solutions to optimize your
                  infrastructure and reduce costs.
                </p>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56l160,0Z"></path>
                </svg>
              </div>
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>Cybersecurity</h3>
                <p className={styles.serviceDescription}>
                  Robust cybersecurity measures to protect your data and ensure
                  business continuity.
                </p>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                </svg>
              </div>
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>IT Consulting</h3>
                <p className={styles.serviceDescription}>
                  Expert IT consulting to align your technology with your
                  business goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className={styles.industriesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Industries We Serve</h2>
            <p className={styles.sectionDescription}>
              We have a proven track record of delivering successful solutions
              across various industries.
            </p>
          </div>
          {/* First row of 3 cards */}
          <div className={styles.industriesGrid} style={{ marginBottom: 32 }}>
            <div className={styles.industryCard}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 220,
                  aspectRatio: "1 / 1",
                  padding: 24,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  border: "1px solid #f0f2f5",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.13)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <img
                  src="/images/42fbcfb7-13be-4d1e-a997-029b1ea424dd.png"
                  alt="Financial Services & Banking"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                    display: "block",
                  }}
                />
              </div>
              <div className={styles.industryContent}>
                <h3 className={styles.industryTitle}>
                  Financial Services & Banking
                </h3>
                <p className={styles.industryDescription}>
                  Data security, compliance, business continuity
                </p>
              </div>
            </div>
            <div className={styles.industryCard}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 220,
                  aspectRatio: "1 / 1",
                  padding: 24,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  border: "1px solid #f0f2f5",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.13)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <img
                  src="/images/enterprise software img.png"
                  alt="Manufacturing & Logistics"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                    display: "block",
                  }}
                />
              </div>
              <div className={styles.industryContent}>
                <h3 className={styles.industryTitle}>
                  Manufacturing & Logistics
                </h3>
                <p className={styles.industryDescription}>
                  ERP, supply chain, hardware infrastructure
                </p>
              </div>
            </div>
          </div>
          {/* Second row of 3 cards */}
          <div className={styles.industriesGrid}>
            <div className={styles.industryCard}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 220,
                  aspectRatio: "1 / 1",
                  padding: 24,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  border: "1px solid #f0f2f5",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.13)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <img
                  src="/images/Gemini_Generated_Image_20ta1r20ta1r20ta.png"
                  alt="Retail & E-Commerce"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                    display: "block",
                  }}
                />
              </div>
              <div className={styles.industryContent}>
                <h3 className={styles.industryTitle}>Retail & E-Commerce</h3>
                <p className={styles.industryDescription}>
                  Omnichannel platforms, data analytics
                </p>
              </div>
            </div>
            <div className={styles.industryCard}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 220,
                  aspectRatio: "1 / 1",
                  padding: 24,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  border: "1px solid #f0f2f5",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.13)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <img
                  src="/images/Gemini_Generated_Image_bl95hfbl95hfbl95.png"
                  alt="Telecommunications"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                    display: "block",
                  }}
                />
              </div>
              <div className={styles.industryContent}>
                <h3 className={styles.industryTitle}>Telecommunications</h3>
                <p className={styles.industryDescription}>
                  High-availability systems, cloud scaling
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>
                Ready to Transform Your Business?
              </h2>
              <p className={styles.ctaDescription}>
                Get in touch with our experts to discuss your specific needs and
                how we can help you achieve your goals.
              </p>
            </div>
            <a href="/contact" className={styles.contactBtn}>
              Contact Us
            </a>
          </div>
        </section>
      </main>

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
    </>
  );
}
