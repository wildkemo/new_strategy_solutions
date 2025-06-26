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
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Strategy Solution</h1>
            <p className={styles.heroSubtitle}>
              Empowering businesses with innovative strategies and solutions
            </p>
            <div className={styles.ctas}>
              {!isLoading && !user && (
                <a href="/login" className={styles.primary}>
                  Get Started
                </a>
              )}
              <a href="/services" className={styles.secondary}>
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featuresHeader}>
            <Image
              src="/images/server1.png"
              alt="Server Rack"
              width={80}
              height={80}
              className={styles.solutionsImage}
              priority
            />
            <h2>Our Solutions</h2>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Strategic Planning</h3>
              <p>
                Comprehensive business strategy development and implementation
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Digital Transformation</h3>
              <p>
                Modernize your business with cutting-edge technology solutions
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Performance Optimization</h3>
              <p>
                Enhance efficiency and productivity across your organization
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer
        style={{
          width: "100vw",
          background: "#000",
          color: "#fff",
          textAlign: "center",
          padding: "1rem 0",
          fontSize: "1.3rem",
          fontWeight: 500,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          marginTop: "2.5rem",
          left: 0,
          right: 0,
        }}
      >
        Copyright © 2025 Strategy Solution - All Rights Reserved.
      </footer>
    </>
  );
}
