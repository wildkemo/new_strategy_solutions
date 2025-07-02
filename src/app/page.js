"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDiagram, setHoveredDiagram] = useState(null);
  const [showAllDiagramCards, setShowAllDiagramCards] = useState(false);

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

  // Data for each segment
  const diagramSegments = [
    {
      key: "enterprise",
      label: "Enterprise Software Solutions",
      details: [
        "ERP Solutions",
        "Oracle EBS, Hyperion, SAP BASIS, Dashboards",
        "Packaged Application Services",
        "Deployment, Support, Technical Migration & Upgrades",
        "Fusion Middleware Technologies",
        "Data Management Solutions (Governance, Transformation, Best Practices)",
      ],
    },
    {
      key: "cyber",
      label: "Cybersecurity & Data Protection",
      details: [
        "Oracle Database Security (TDE, Data Redaction, Vault, Label Security)",
        "SIEM Integration",
        "Network, Email, Mobile, and Endpoint Security",
        "Audit Vault & SQL Injection Protection",
        "Backup & Encryption Key Management (Key Vault)",
        "Data Masking, Subsetting",
      ],
    },
    {
      key: "infra",
      label: "Infrastructure, Cloud & Virtualization",
      details: [
        "Hardware Infrastructure",
        "Oracle/Dell/Cisco Servers, Networking, Storage",
        "Data Center Prep, Performance Tuning",
        "Cloud & Virtualization",
        "Oracle Cloud (OCI), Virtualization, Federation, SSO",
        "Cloud Migration, Capacity Planning, Testing",
      ],
    },
    {
      key: "support",
      label: "Support Services & Project Delivery",
      details: [
        "Business Continuity & Disaster Recovery",
        "DR Architecture, RPO/RTO, Replication, Full Stack DR",
        "Project Management",
        "End-to-End Planning, Stakeholder Alignment",
        "Outsourcing & Support",
        "Technical Engineer Outsourcing",
        "Post-implementation SLA-Based Support",
        "Monitoring, Optimization, Troubleshooting",
      ],
    },
  ];

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

        {/* Circular Diagram Section */}
        <div
          className={styles.circularDiagramSection}
          onMouseEnter={() => setShowAllDiagramCards(true)}
          onMouseLeave={() => setShowAllDiagramCards(false)}
          style={{ position: "relative" }}
        >
          <img
            src="/images/circular diagram.png"
            alt="Our Services Diagram"
            className={styles.circularDiagramImg}
            style={{ position: "relative", width: "480px", maxWidth: "98vw" }}
          />
          {showAllDiagramCards && (
            <>
              <div
                className={`${styles.diagramFloatingCard} ${styles.diagramCardTop}`}
                style={{ animationDelay: "0.2s" }}
              >
                <strong>🧠 Enterprise Software Solutions</strong>
                <div style={{ marginTop: 12 }}>
                  Implementation, customization, and support for ERP and
                  packaged enterprise applications.
                  <br />
                  <br />
                  Integration of Oracle Middleware technologies for data flow
                  and analytics.
                </div>
              </div>
              <div
                className={`${styles.diagramFloatingCard} ${styles.diagramCardRight}`}
                style={{ animationDelay: "0.4s" }}
              >
                <strong>📈 Support Services & Project Delivery</strong>
                <div style={{ marginTop: 12 }}>
                  SLA-based technical support, outsourcing, and ongoing
                  maintenance.
                  <br />
                  <br />
                  Full-cycle project management and disaster recovery planning.
                </div>
              </div>
              <div
                className={`${styles.diagramFloatingCard} ${styles.diagramCardBottom}`}
                style={{ animationDelay: "0.6s" }}
              >
                <strong>☁️ Infrastructure, Cloud & Virtualization</strong>
                <div style={{ marginTop: 12 }}>
                  Deployment and management of on-premise and cloud
                  infrastructure (OCI, servers, networking).
                  <br />
                  <br />
                  Virtualization, capacity planning, and seamless cloud
                  migration.
                </div>
              </div>
              <div
                className={`${styles.diagramFloatingCard} ${styles.diagramCardLeft}`}
                style={{ animationDelay: "0.8s" }}
              >
                <strong>🔐 Cybersecurity & Data Protection</strong>
                <div style={{ marginTop: 12 }}>
                  End-to-end protection for databases, networks, and
                  applications using Oracle security tools.
                  <br />
                  <br />
                  Data encryption, masking, auditing, and SIEM-based threat
                  detection.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enterprise Software Solutions Section */}
        <section className={styles.enterpriseSection}>
          <img
            src="/images/enterprise software img.png"
            alt="Enterprise Software Solutions"
            className={styles.enterpriseImage}
          />
          <div className={styles.enterpriseContent}>
            <h2 className={styles.enterpriseTitle}>
              Enterprise Software Solutions
            </h2>
            <p className={styles.enterpriseDesc}>
              Focuses on delivering, customizing, and optimizing enterprise
              applications and databases.
            </p>
            <ul className={styles.enterpriseList}>
              <li className={styles.enterpriseListItem}>ERP Solutions</li>
              <li className={styles.enterpriseListItem}>
                Oracle EBS, Hyperion, SAP BASIS, Dashboards
              </li>
              <li className={styles.enterpriseListItem}>
                Packaged Application Services
              </li>
              <li className={styles.enterpriseListItem}>
                Deployment, Support, Technical Migration & Upgrades
              </li>
              <li className={styles.enterpriseListItem}>
                Fusion Middleware Technologies (WebLogic, OBIEE, SOA, ODI, ADF,
                OHS)
              </li>
              <li className={styles.enterpriseListItem}>
                Data Management Solutions (Governance, Transformation, Best
                Practices)
              </li>
            </ul>
            <a href="/services" className={styles.discoverBtn}>
              Discover Our Services
            </a>
          </div>
        </section>

        {/* CyberSecurity and Data Protection Section */}
        <section
          className={`${styles.enterpriseSection} ${styles.reverseSection}`}
        >
          <img
            src="/images/cyber services.png"
            alt="CyberSecurity and Data Protection"
            className={styles.enterpriseImage}
          />
          <div className={styles.enterpriseContent}>
            <h2 className={styles.enterpriseTitle}>
              CyberSecurity and Data Protection
            </h2>
            <p className={styles.enterpriseDesc}>
              Securing digital assets across applications, databases, endpoints,
              and networks.
            </p>
            <ul className={styles.enterpriseList}>
              <li className={styles.enterpriseListItem}>
                Oracle Database Security (TDE, Data Redaction, Vault, Label
                Security)
              </li>
              <li className={styles.enterpriseListItem}>SIEM Integration</li>
              <li className={styles.enterpriseListItem}>
                Network, Email, Mobile, and Endpoint Security
              </li>
              <li className={styles.enterpriseListItem}>
                Audit Vault & SQL Injection Protection
              </li>
              <li className={styles.enterpriseListItem}>
                Backup & Encryption Key Management (Key Vault)
              </li>
              <li className={styles.enterpriseListItem}>
                Data Masking, Subsetting
              </li>
            </ul>
            <a href="/services" className={styles.discoverBtn}>
              Discover Our Services
            </a>
          </div>
        </section>

        {/* Infrastructure, Cloud & Virtualization Section */}
        <section className={styles.enterpriseSection}>
          <img
            src="/images/cloud service.png"
            alt="Infrastructure, Cloud & Virtualization"
            className={styles.enterpriseImage}
          />
          <div className={styles.enterpriseContent}>
            <h2 className={styles.enterpriseTitle}>
              Infrastructure, Cloud & Virtualization
            </h2>
            <p className={styles.enterpriseDesc}>
              Designing, deploying, and managing IT infrastructure both
              on-premises and in the cloud.
            </p>
            <ul className={styles.enterpriseList}>
              <li className={styles.enterpriseListItem}>
                Hardware Infrastructure
              </li>
              <li className={styles.enterpriseListItem}>
                Oracle/Dell/Cisco Servers, Networking, Storage
              </li>
              <li className={styles.enterpriseListItem}>
                Data Center Prep, Performance Tuning
              </li>
              <li className={styles.enterpriseListItem}>
                Cloud & Virtualization
              </li>
              <li className={styles.enterpriseListItem}>
                Oracle Cloud (OCI), Virtualization, Federation, SSO
              </li>
              <li className={styles.enterpriseListItem}>
                Cloud Migration, Capacity Planning, Testing
              </li>
            </ul>
            <a href="/services" className={styles.discoverBtn}>
              Discover Our Services
            </a>
          </div>
        </section>

        {/* Support Services & Project Delivery Section */}
        <section
          className={`${styles.enterpriseSection} ${styles.reverseSection}`}
        >
          <img
            src="/images/support services.png"
            alt="Support Services & Project Delivery"
            className={styles.enterpriseImage}
          />
          <div className={styles.enterpriseContent}>
            <h2 className={styles.enterpriseTitle}>
              Support Services & Project Delivery
            </h2>
            <p className={styles.enterpriseDesc}>
              Ensuring long-term success through managed support and structured
              delivery.
            </p>
            <ul className={styles.enterpriseList}>
              <li className={styles.enterpriseListItem}>
                Business Continuity & Disaster Recovery
              </li>
              <li className={styles.enterpriseListItem}>
                DR Architecture, RPO/RTO, Replication, Full Stack DR
              </li>
              <li className={styles.enterpriseListItem}>Project Management</li>
              <li className={styles.enterpriseListItem}>
                End-to-End Planning, Stakeholder Alignment
              </li>
              <li className={styles.enterpriseListItem}>
                Outsourcing & Support
              </li>
              <li className={styles.enterpriseListItem}>
                Technical Engineer Outsourcing
              </li>
              <li className={styles.enterpriseListItem}>
                Post-implementation SLA-Based Support
              </li>
              <li className={styles.enterpriseListItem}>
                Monitoring, Optimization, Troubleshooting
              </li>
            </ul>
            <a href="/services" className={styles.discoverBtn}>
              Discover Our Services
            </a>
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
