import React from "react";
import Image from "next/image";
import homeStyles from "../page.module.css";

export default function About() {
  return (
    <>
      <main className={homeStyles.homeContainer} style={{ marginTop: 50 }}>
        {/* About Us Section */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 0" }}>
          <h1
            className={homeStyles.heroTitle}
            style={{ color: "#0e161b", marginBottom: 12 }}
          >
            About Us
          </h1>
          <p
            className={homeStyles.heroSubtitle}
            style={{ color: "#0e161b", marginBottom: 32 }}
          >
            Strategy Solution is a leading IT talent outsourcing and consultancy
            firm in Egypt, with over two decades of experience. We are dedicated
            to excellence, client satisfaction, and the growth of Egyptian IT
            professionals.
          </p>
        </section>

        {/* Who We Are Section */}
        <section
          className={homeStyles.servicesSection}
          style={{ paddingTop: 0 }}
        >
          <div className={homeStyles.sectionHeader}>
            <h2 className={homeStyles.sectionTitle}>Who We Are</h2>
            <p className={homeStyles.sectionDescription}>
              With a rich history spanning over 20 years, Strategy Solution has
              established itself as a trusted partner for businesses seeking
              top-tier IT talent and strategic consultancy. Our deep
              understanding of the Egyptian market, combined with our global
              expertise, allows us to deliver tailored solutions that drive
              success. We are a team of seasoned professionals committed to
              bridging the gap between exceptional IT talent and organizations
              striving for digital transformation.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Image
              src="/images/Gemini_Generated_Image_lyolodlyolodlyol.png"
              alt="Team Illustration"
              width={600}
              height={300}
              style={{
                borderRadius: 12,
                objectFit: "cover",
                background: "#f5f5f5",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </section>

        {/* Our Mission Section */}
        <section
          className={homeStyles.servicesSection}
          style={{ paddingTop: 0 }}
        >
          <div className={homeStyles.sectionHeader}>
            <h2 className={homeStyles.sectionTitle}>Our Mission</h2>
            <p className={homeStyles.sectionDescription}>
              Our mission is to empower businesses with the right IT talent and
              strategic insights to achieve their goals. We are committed to
              fostering a culture of innovation, collaboration, and continuous
              improvement, ensuring that our clients receive the highest quality
              service and support. We aim to be the catalyst for growth,
              connecting organizations with the skilled professionals they need
              to thrive in today's dynamic digital landscape.
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section
          className={homeStyles.servicesSection}
          style={{ paddingTop: 0 }}
        >
          <div className={homeStyles.sectionHeader}>
            <h2 className={homeStyles.sectionTitle}>Our Values</h2>
          </div>
          <div className={homeStyles.servicesGrid}>
            <div className={homeStyles.serviceCard}>
              <div className={homeStyles.serviceContent}>
                <h3 className={homeStyles.serviceTitle}>
                  Client-Centric Approach
                </h3>
                <p className={homeStyles.serviceDescription}>
                  We prioritize our clients' needs and strive to exceed their
                  expectations.
                </p>
              </div>
            </div>
            <div className={homeStyles.serviceCard}>
              <div className={homeStyles.serviceContent}>
                <h3 className={homeStyles.serviceTitle}>
                  Commitment to Quality
                </h3>
                <p className={homeStyles.serviceDescription}>
                  We uphold the highest standards of quality in all our
                  services.
                </p>
              </div>
            </div>
            <div className={homeStyles.serviceCard}>
              <div className={homeStyles.serviceContent}>
                <h3 className={homeStyles.serviceTitle}>
                  Continuous Improvement
                </h3>
                <p className={homeStyles.serviceDescription}>
                  We embrace innovation and constantly seek ways to enhance our
                  offerings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Legacy Section */}
        <section
          className={homeStyles.servicesSection}
          style={{ paddingTop: 0 }}
        >
          <div className={homeStyles.sectionHeader}>
            <h2 className={homeStyles.sectionTitle}>Our Legacy</h2>
            <p className={homeStyles.sectionDescription}>
              Over the past two decades, Strategy Solution has played a pivotal
              role in shaping the IT landscape in Egypt. We have successfully
              partnered with numerous organizations, helping them realize
              complex projects and achieve sustainable growth. Driven by our
              unwavering commitment to trust, integrity, and relentless
              excellence, we are proud to have contributed to the development of
              countless IT professionals and the success of businesses across
              various sectors.
            </p>
          </div>
          <div style={{ position: "relative", marginBottom: 0 }}>
            <Image
              src="/images/WhatsApp_Image_2025-06-08_at_20.37.40_9716fb98-removebg-preview.png"
              alt="Legacy Banner"
              width={800}
              height={200}
              style={{
                borderRadius: 12,
                objectFit: "cover",
                width: "100%",
                height: 220,
                maxWidth: "100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 24,
                bottom: 24,
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                padding: "14px 20px",
                borderRadius: 10,
                maxWidth: 320,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                20+ Years of Excellence
              </div>
              <div style={{ fontSize: 14 }}>
                Strategy Solution has been a leader in the Egyptian IT market
                for over two decades.
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className={homeStyles.footer}>
        <div className={homeStyles.footerContent}>
          <div className={homeStyles.footerLinks}>
            <a className={homeStyles.footerLink} href="/privacy">
              Privacy Policy
            </a>
            <a className={homeStyles.footerLink} href="/terms">
              Terms of Service
            </a>
          </div>
          <p className={homeStyles.footerCopyright}>
            © 2025 Strategy Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
