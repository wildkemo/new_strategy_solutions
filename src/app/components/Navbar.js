"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar({ className = "" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [pendingOtpOrders, setPendingOtpOrders] = useState([]);
  const [hasPendingOtp, setHasPendingOtp] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [isFinalConfirmationOpen, setIsFinalConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
    if (pathname.startsWith("/services")) {
      setScrolled(false);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/get_current_user/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          let errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        }

        const userData = await response.json();
        // console.log("User data fetched:", userData);
        if (userData.user) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        // console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserOrders = async () => {
    if (!user) return;

    setIsOrdersLoading(true);
    try {
      const response = await fetch("/api/get_user_orders/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      let ordersData = await response.json();
      ordersData = ordersData.orders || []; // Ensure ordersData is an array
      if (ordersData.length !== 0) {
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const fetchPendingOtpOrders = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/get_pending_otp_orders/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending OTP orders");
      }

      const data = await response.json();
      if (data.status === "success") {
        setPendingOtpOrders(data.pendingOrders || []);
        setHasPendingOtp(data.hasPendingOrders);
      }
    } catch (err) {
      console.error("Error fetching pending OTP orders:", err);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to close menu when navigation link is clicked
  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    // if (!user) return;

    try {
      const response = await fetch("/api/send_otp", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          purpose: "Delete Account",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      const data = await response.json();
      if (data.status === "success") {
        setIsOtpModalOpen(true);
        setSidebarOpen(false);
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.message);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    setIsOtpModalOpen(false);
    setIsFinalConfirmationOpen(true);
  };

  const handleFinalDelete = async () => {
    setIsFinalConfirmationOpen(false);

    try {
      const response = await fetch("/api/delete_account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp, purpose: "Delete Account" }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        handleLogout();
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = {
            message: `Request failed with status: ${response.status}`,
          };
        }
        setOtpError(errorData.message || "An error occurred.");
        setIsOtpModalOpen(true);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setOtpError("A network error occurred. Please try again.");
      setIsOtpModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setOrders([]);
      setSidebarOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Error during logout:", err);
      setError(err.message);
    }
  };

  // Fetch orders when sidebar opens
  useEffect(() => {
    if (sidebarOpen && user) {
      fetchUserOrders();
      fetchPendingOtpOrders();
    }
  }, [sidebarOpen, user]);

  // Fetch pending OTP orders when user data is loaded
  useEffect(() => {
    if (user) {
      fetchPendingOtpOrders();
    }
  }, [user]);

  const isSolidNavbarPage =
    pathname === "/" ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/request-service") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/my-orders") ||
    pathname.startsWith("/register");
  const navbarClass = isSolidNavbarPage
    ? `${styles.navbar} ${styles.scrolled}`
    : hasMounted
      ? `${styles.navbar} ${scrolled ? styles.scrolled : ""}`
      : styles.navbar;

  const mergedNavbarClass = `${navbarClass} ${className}`.trim();

  if (!hasMounted) {
    return null;
  }

  return (
    <nav className={mergedNavbarClass}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img
            src="/images/SS-logo-small-removebg-preview.png"
            alt="Strategy Solutions Logo"
            className={styles.logoImage}
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* Overlay for mobile sidebar */}
        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu}></div>
        )}

        {/* Navigation links */}
        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          <Link
            href="/"
            className={styles.navLink}
            onClick={handleNavLinkClick}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={styles.navLink}
            onClick={handleNavLinkClick}
          >
            Services
          </Link>
          {!isLoading && user && (
            <Link
              href="/request-service"
              className={styles.navLink}
              onClick={handleNavLinkClick}
            >
              Request Service
            </Link>
          )}
          <Link
            href="/about"
            className={styles.navLink}
            onClick={handleNavLinkClick}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={styles.navLink}
            onClick={handleNavLinkClick}
          >
            Contact
          </Link>
          {/* Add Login/Sign Up button if not signed in */}
          {!isLoading && !user && (
            <Link
              href="/login"
              className={styles.loginBtn}
              onClick={handleNavLinkClick}
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        {!isLoading && user && (
          <div className={styles.profileWrapper}>
            <button
              className={styles.profileIcon}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open profile sidebar"
            >
              <img
                src="/images/user profile.avif"
                alt="Profile"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            </button>
          </div>
        )}

        {isLoading && (
          <div className={styles.profileWrapper}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        >
          <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
            {user && (
              <>
                <div className={styles.userInfo}>
                  <h2>{user.name}</h2>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>

                {/* Hide orders section and View All Orders for admin */}
                {user.isAdmin !== true && (
                  <>
                    <div className={styles.ordersSection}>
                      <h3>Recent Orders</h3>
                      {isOrdersLoading ? (
                        <div className={styles.loadingSpinner}></div>
                      ) : orders.length > 0 ? (
                        <div className={styles.ordersList}>
                          {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className={styles.orderItem}>
                              <span className={styles.orderService}>
                                {order.service_type}
                              </span>
                              <span className={styles.orderStatus}>
                                {order.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.noOrders}>No orders found</p>
                      )}
                    </div>

                    {/* Show Verify Now button if there are pending OTP orders */}
                    {hasPendingOtp && (
                      <button
                        className={styles.sidebarBtn}
                        style={{ background: "#e74c3c", marginBottom: "1rem" }}
                        onClick={() => {
                          setSidebarOpen(false);
                          router.push("/request-service?verify_otp=true");
                        }}
                      >
                        Verify Now ({pendingOtpOrders.length})
                      </button>
                    )}

                    <button
                      className={styles.sidebarBtn}
                      onClick={() => {
                        setSidebarOpen(false);
                        router.push("/my-orders");
                      }}
                    >
                      View All Orders
                    </button>
                  </>
                )}

                <button
                  className={styles.sidebarBtn}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/profile");
                  }}
                >
                  Manage My Profile
                </button>
                {user.isAdmin === true && (
                  <button
                    className={styles.sidebarBtn}
                    style={{ background: "#d63031", marginTop: "2rem" }}
                    onClick={() => {
                      setSidebarOpen(false);
                      router.push("/blank_admin");
                    }}
                  >
                    Return to Admin Dashboard
                  </button>
                )}
                <button
                  className={styles.sidebarBtn}
                  style={{ background: "#d63031", marginTop: "2rem" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className={styles.deleteAccountSidebarBtn}
                  onClick={() => {
                    setIsDeleteConfirmationOpen(true);
                  }}
                >
                  Delete My Account
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isOtpModalOpen && (
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <h3>Enter OTP</h3>
            <p>
              An OTP has been sent to your email. Please enter it below to
              confirm account deletion.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                  setOtp(value);
                }
              }}
              className={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />
            {otpError && <p className={styles.otpError}>{otpError}</p>}
            <div className={styles.otpActions}>
              <button
                className={`${styles.otpBtn} ${styles.confirm}`}
                onClick={handleOtpSubmit}
              >
                Confirm
              </button>
              <button
                className={`${styles.otpBtn} ${styles.cancel}`}
                onClick={() => setIsOtpModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmationOpen && (
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className={styles.otpActions}>
              <button
                className={`${styles.otpBtn} ${styles.confirm}`}
                onClick={() => {
                  setIsDeleteConfirmationOpen(false);
                  handleDeleteAccount();
                }}
              >
                Send Confirmation Code
              </button>
              <button
                className={`${styles.otpBtn} ${styles.cancel}`}
                onClick={() => setIsDeleteConfirmationOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isFinalConfirmationOpen && (
        <div className={styles.otpModalOverlay}>
          <div className={styles.otpModal}>
            <h3>Final Confirmation</h3>
            <p>
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className={styles.otpActions}>
              <button
                className={`${styles.otpBtn} ${styles.confirm}`}
                onClick={handleFinalDelete}
              >
                Yes, Delete My Account
              </button>
              <button
                className={`${styles.otpBtn} ${styles.cancel}`}
                onClick={() => setIsFinalConfirmationOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
