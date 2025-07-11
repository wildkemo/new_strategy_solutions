"use client";
import styles from "./profile.module.css";
import { useEffect, useState, useRef } from "react";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company_name: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updatedFieldsMessage, setUpdatedFieldsMessage] = useState("");
  const messageTimeoutRef = useRef(null);
  const [wrongPasswordPopup, setWrongPasswordPopup] = useState(false);
  const [samePasswordPopup, setSamePasswordPopup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "/api/get_current_user/", // Adjust this path based on your API route
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        // console.log(data);
        const userdata = data.user;
        setUser(userdata);
        setFormData({
          name: userdata.name,
          phone: userdata.phone,
          company_name: userdata.company_name,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
        // Fetch admin list and check if user is admin
        const adminRes = await fetch("/api/get_admins/", {
          credentials: "include",
        });
        if (adminRes.ok) {
          let admins = await adminRes.json();
          console.log("Admin API response:", admins); // Debug log
          if (Array.isArray(admins)) {
            if (admins.some((a) => a.email === userdata.email))
              setIsAdmin(true);
          } else if (admins && Array.isArray(admins.admins)) {
            if (admins.admins.some((a) => a.email === userdata.email))
              setIsAdmin(true);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setUpdateError("New passwords do not match");
      return;
    }
    if (formData.password && formData.password.length < 8) {
      setUpdateError("New password must be at least 8 characters long");
      return;
    }
    // Check if new password and old password are the same
    if (
      formData.password &&
      formData.currentPassword &&
      formData.password === formData.currentPassword
    ) {
      setSamePasswordPopup(true);
      setUpdateError(null);
      return;
    }
    try {
      const response = await fetch("/api/update_user_info/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update user info");
      const result = await response.json();
      if (result.status === "success") {
        // Determine which fields were updated
        const updatedFields = [];
        if (formData.name !== user.name) updatedFields.push("Name");
        if (formData.phone !== user.phone) updatedFields.push("Phone Number");
        if (formData.company_name !== user.company_name)
          updatedFields.push("Company Name");
        if (formData.password) updatedFields.push("Password");
        let message = result.message;
        if (updatedFields.length > 0) {
          message = `You have updated the following: ${updatedFields.join(
            ", "
          )}`;
        }
        setUpdatedFieldsMessage(message);
        setUpdateSuccess(true);
        setUpdateError(null);
        // Refresh user data
        const userResponse = await fetch(
          "/api/get_current_user/", // Adjust this path based on your API route
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (userResponse.ok) {
          const data = await userResponse.json();
          const userdata = data;
          setUser(userdata);
          setFormData({
            name: userdata.name || "",
            phone: userdata.phone || "",
            company_name: userdata.company_name || "",
            currentPassword: "",
            password: "",
            confirmPassword: "",
          });
        }
      } else if (
        result.status === "error" &&
        result.message &&
        result.message.toLowerCase().includes("wrong password")
      ) {
        setWrongPasswordPopup(true);
        setUpdateError(null);
      } else {
        alert(result.message);
        setUpdateError(result.message);
      }
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.profileContainer} style={{ position: "relative" }}>
      <h1>Manage My Profile</h1>
      {updateSuccess && updatedFieldsMessage && (
        <PopupNotification
          message={updatedFieldsMessage}
          onClose={() => {
            setUpdateSuccess(false);
            setUpdatedFieldsMessage("");
          }}
        />
      )}
      {wrongPasswordPopup && (
        <PopupNotification
          message={"Wrong password"}
          onClose={() => setWrongPasswordPopup(false)}
          error
        />
      )}
      {samePasswordPopup && (
        <PopupNotification
          message={
            "Choose another password. Old and new passwords are the same."
          }
          onClose={() => setSamePasswordPopup(false)}
          error
        />
      )}
      {updateError && <div className={styles.errorMessage}>{updateError}</div>}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        {!isAdmin && (
          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        {!isAdmin && (
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        {/* Show error if passwords do not match and both fields are filled, under confirm password */}
        {formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <div
              className={styles.errorMessage}
              style={{ marginTop: "-1rem", marginBottom: "1rem" }}
            >
              Passwords do not match
            </div>
          )}
        <button type="submit" className={styles.updateButton}>
          Update Profile
        </button>
      </form>
      {isAdmin && (
        <button
          style={{
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 24,
            marginTop: 8,
            display: "block",
          }}
          onClick={() => (window.location.href = "/blank_admin")}
        >
          Return to Admin Dashboard
        </button>
      )}
    </div>
  );
}

function PopupNotification({ message, onClose, error }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.3)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: error ? "#fff" : "#fff",
          color: error ? "#e74c3c" : "#222",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: error
            ? "0 4px 24px rgba(231,76,60,0.18)"
            : "0 4px 24px rgba(0,0,0,0.18)",
          border: error ? "1.5px solid #e74c3c" : undefined,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          position: "relative",
          animation: "fadeIn 0.7s",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            background: "none",
            border: "none",
            fontSize: 22,
            color: error ? "#e74c3c" : "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 12, color: error ? "#e74c3c" : "#0070f3" }}>
          {error ? "Error" : "Success"}
        </h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}
