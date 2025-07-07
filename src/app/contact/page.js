"use client";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.contactContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Get in Touch with Strategy Solutions
            </h1>
            <p className={styles.heroSubtitle}>
              Ready to transform your business? Let's discuss how our innovative
              IT solutions can drive your success. Contact us today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className={styles.contactSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.sectionDescription}>
            Reach out to us through any of these channels. We're here to help
            you achieve your business goals.
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,134.4,113.21a8,8,0,0,1-4.8,0L60.57,64ZM216,192H40V74.19l82.59,47.84a16,16,0,0,0,9.6,0L216,74.19V192Z"></path>
              </svg>
            </div>
            <div className={styles.contactContent}>
              <h3 className={styles.contactTitle}>Email Us</h3>
              <p className={styles.contactText}>
                amr.elshimy@strategy-solution.com
              </p>
              <p className={styles.contactDescription}>
                Send us an email and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,64A40,40,0,1,0,168,104,40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112C87.63,16,56,47.63,56,88c0,46.33,39.07,81.43,56,95.23a8,8,0,0,0,16,0c16.93-13.8,56-48.9,56-95.23C184,47.63,152.37,16,112,16Zm0,128c-22.06,0-40-17.94-40-40s17.94-40,40-40,40,17.94,40,40S150.06,144,128,144Z"></path>
              </svg>
            </div>
            <div className={styles.contactContent}>
              <h3 className={styles.contactTitle}>Visit Us</h3>
              <p className={styles.contactText}>
                Capital Mall, Unit 27, 5th Settlement
              </p>
              <p className={styles.contactDescription}>Cairo, Egypt</p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M231.88,175.08A56.26,56.26,0,0,1,176,224C96.6,224,32,159.4,32,80A56.26,56.26,0,0,1,80.92,24.12a16,16,0,0,1,16.62,9.52l21.12,47.15,0,.12A16,16,0,0,1,117.39,96c-.18.27-.37.52-.57.77L96,121.45c7.49,15.22,23.41,31.06,38.83,38.51l24.34-20.71a8.12,8.12,0,0,1,.75-.56,16,16,0,0,1,15.17-1.4l.13,0,47.21,21.11A16,16,0,0,1,231.88,175.08Z"></path>
              </svg>
            </div>
            <div className={styles.contactContent}>
              <h3 className={styles.contactTitle}>Call Us</h3>
              <p className={styles.contactText}>+20 123 456 7890</p>
              <p className={styles.contactDescription}>
                Available Monday to Friday, 9 AM - 6 PM EET
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Location</h2>
          <p className={styles.sectionDescription}>
            Find us at our headquarters in Cairo, Egypt. We're conveniently
            located in the heart of the city.
          </p>
        </div>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps/embed/v1/place?q=Egypt%20%2C%20new%20cairo%20%2C%205th%20settlement%20court%20%2C%20al%20nasr%20mall&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Strategy Solutions Location"
          ></iframe>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <p className={styles.ctaDescription}>
              Let's discuss how our IT solutions can transform your business.
              Contact us today for a free consultation.
            </p>
          </div>
          <a href="/services" className={styles.ctaButton}>
            Explore Our Services
          </a>
        </div>
      </section>

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
    </div>
  );
}
