"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./admin.module.css";
import Navbar from "../components/Navbar";

const validateSession = async () => {
  // // const response2 = await fetch(
  // // "http://localhost/oop_project/php_backend/app/Controllers/route.php",
  // //  {headers: { 'Content-Type': 'application/json' } ,credentials: 'include'})
  // const response2 = await fetch(
  //   "http://localhost:3000/APIs/Controllers/route.js",
  //   // "http://localhost/www/oop_project/php_backend/app/Controllers/route.php",
  //   { headers: { "Content-Type": "application/json" }, credentials: "include" }
  // );
  // if (!response2.ok) throw new Error("Failed to fetch services");
  // let result = await response2.json();
  // if (result.status != "success") {
  //   return false;
  //   throw new Error("Permission required");
  // } else {
  //   return true;
  // }
};

function PopupNotification({ message, onClose, success = true }) {
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
          background: "#fff",
          color: success ? "#0070f3" : "#e74c3c",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: success
            ? "0 4px 24px rgba(0,112,243,0.18)"
            : "0 4px 24px rgba(231,76,60,0.18)",
          border: success ? "1.5px solid #0070f3" : "1.5px solid #e74c3c",
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
            color: success ? "#0070f3" : "#e74c3c",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 12 }}>{success ? "Success" : "Deleted"}</h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  useEffect(() => {
    // const checkSession = async () => {
    //   try {
    //     const valid = await validateSession();
    //     if (!valid) {
    //       window.location.href = "/"; // or handle it however you want
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     window.location.href = "/services/page.js"; // redirect on failure
    //   }
    // };
    // checkSession();
  }, []);

  // if(validateSession() == true){

  const [serviceRequests, setServiceRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add this with your other state declarations
  const [admins, setAdmins] = useState([]);
  const [isAdminsLoading, setIsAdminsLoading] = useState(true);
  const [adminsError, setAdminsError] = useState(null);

  // Add this with your other state declarations
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [adminError, setAdminError] = useState("");

  // New service form state
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    features: [{ name: "", description: "" }],
    category: "",
    icon: "box1",
  });

  const [statusDropdown, setStatusDropdown] = useState({
    open: false,
    requestId: null,
  });
  const statusButtonRefs = useRef({});
  const statusDropdownRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });

  const [statusUpdating, setStatusUpdating] = useState(false);

  const [showCustomerOrdersModal, setShowCustomerOrdersModal] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState("");

  const handleAddAdmin = () => {
    setAdminError("");
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowAdminModal(true);
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setAdminError("Passwords do not match");
      return;
    }

    if (newAdmin.password.length < 6) {
      setAdminError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("/api/add_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add admin");
      }

      const result = await response.json();

      if (result.status === "success") {
        setPopup({
          show: true,
          message: "Admin added successfully",
          success: true,
        });
        setShowAdminModal(false);
        // Refresh admin list if needed
        // await fetchAdmins();
      } else {
        setAdminError(result.message || "Error adding admin");
      }
    } catch (err) {
      setAdminError(err.message);
    }
  };

  // Add this with your other fetch functions
  const fetchAdmins = async () => {
    setIsAdminsLoading(true);
    setAdminsError(null);
    try {
      const response = await fetch("api/get_admins", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setAdminsError(err.message);
    } finally {
      setIsAdminsLoading(false);
    }
  };

  // Helper to normalize features array
  function normalizeFeatures(features) {
    if (!Array.isArray(features)) return [];
    return features.map((f) =>
      typeof f === "string"
        ? { name: f, description: "" }
        : { name: f.name || "", description: f.description || "" }
    );
  }

  // Fetch all services from backend
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "api/get_services"
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_services.php"
      );
      if (!response.ok) throw new Error("Failed to fetch services");

      let data = await response.json();

      if (data.status === "error") {
        data = [];
      }

      // Normalize features for all services
      data = data.map((service) => ({
        ...service,
        features: JSON.parse(service.features),
      }));
      setServices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all service requests from backend
  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(
        "api/get_all_orders"
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_orders.php"
      );
      if (!response.ok) throw new Error("Failed to fetch service requests");
      const data = await response.json();
      setServiceRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch all users from backend
  const fetchUsers = async () => {
    setIsUsersLoading(true);
    setUsersError(null);
    try {
      const response = await fetch("api/get_all_users", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServiceRequests();
    fetchUsers();
    fetchAdmins();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        statusDropdown.open &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdown({ open: false, requestId: null });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusDropdown]);

  const handleRefresh = () => {
    fetchServices();
  };

  const handleAddService = () => {
    setEditingService(null);
    setNewService({
      title: "",
      description: "",
      features: [{ name: "", description: "" }],
      category: "",
      icon: "box1",
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = async (ID, EMAIL) => {
    const response = await fetch(
      "/api/delete_user", // make sure this matches your file path
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ID, email: EMAIL }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed response:", errorText);
      throw new Error("Failed to delete user");
    }

    const result = await response.json();
    if (result.message === "User deleted successfully") {
      setPopup({ show: true, message: "User deleted.", success: true });
    } else {
      alert(result.error || "An unknown error occurred.");
    }

    await fetchUsers();
    await fetchServiceRequests();
    await fetchServices();
  };

  const handleEditService = (service) => {
    setEditingService(service);
    // Normalize features
    const features = normalizeFeatures(service.features);
    setNewService({ ...service, features });
    setShowAddModal(true);
  };
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const response = await fetch("/api/delete_services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: serviceId }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Delete service failed:", errText);
        throw new Error("Failed to delete service");
      }

      const result = await response.json();

      if (result.status === "success") {
        setPopup({ show: true, message: "Service deleted.", success: true });
        await fetchServices();
      } else {
        alert(result.message || "Unknown error");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "/api/add_service";
      let method = "POST";
      let isEdit = false;

      if (editingService) {
        url = "/api/update_services";
        method = "PUT";
        isEdit = true;
      }

      const features = normalizeFeatures(newService.features); // assuming this is defined
      const formData = new FormData();
      formData.append("title", newService.title);
      formData.append("description", newService.description);
      formData.append("category", newService.category);
      formData.append("icon", newService.icon);
      formData.append("features", JSON.stringify(features));
      if (editingService) formData.append("id", editingService.id);
      if (newService.image) formData.append("image", newService.image);

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Failed request:", errorDetails);
        throw new Error("Failed to save service");
      }

      const result = await response.json();

      if (result.status === "success") {
        setShowAddModal(false);
        setEditingService(null);
        setNewService({
          title: "",
          description: "",
          features: [{ name: "", description: "" }],
          category: "",
          icon: "box1",
        });
        await fetchServices();

        setPopup({
          show: true,
          message: `Service '${newService.title}' ${
            isEdit ? "edited" : "added"
          } successfully.`,
          success: true,
        });
      } else {
        alert(result.message);
        setError(result.message || "Error in database");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...newService.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setNewService({ ...newService, features: newFeatures });
  };

  const addFeatureField = () => {
    setNewService({
      ...newService,
      features: [...newService.features, { name: "", description: "" }],
    });
  };

  const removeFeatureField = (index) => {
    const newFeatures = newService.features.filter((_, i) => i !== index);
    setNewService({ ...newService, features: newFeatures });
  };

  const handleStatusButtonClick = (requestId) => {
    setStatusDropdown((prev) => ({
      open: prev.requestId !== requestId || !prev.open,
      requestId,
    }));
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setStatusUpdating(true);
    try {
      const response = await fetch("/api/update_order_status/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: newStatus }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setPopup({ show: true, message: result.message, success: true });
      } else {
        setPopup({ show: true, message: result.message, success: false });
      }
      await fetchServiceRequests();
    } catch (err) {
      setPopup({
        show: true,
        message: "Failed to update status",
        success: false,
      });
    } finally {
      setStatusDropdown({ open: false, requestId: null });
      setStatusUpdating(false);
    }
  };

  // Filtered data based on search
  const term = searchTerm.toLowerCase();
  const matches = (value) =>
    value && value.toString().toLowerCase().includes(term);

  const filteredServices = services.filter((service) => {
    if (!term) return true;
    return (
      matches(service.id) ||
      matches(service.title) ||
      matches(service.category) ||
      (service.features &&
        service.features.some((f) => matches(f.name) || matches(f.description)))
    );
  });

  const filteredServiceRequests = serviceRequests.filter((request) => {
    if (!term) return true;
    return (
      matches(request.id) ||
      matches(request.name) ||
      matches(request.email) ||
      matches(request.phone) ||
      matches(request.company_name) ||
      matches(request.service_type) ||
      matches(request.service_description) ||
      matches(request.status)
    );
  });

  const filteredUsers = users.filter((user) => {
    if (!term) return true;
    return (
      matches(user.id) ||
      matches(user.name) ||
      matches(user.email) ||
      matches(user.phone) ||
      matches(user.company_name) ||
      matches(user.gender)
    );
  });

  const filteredAdmins = admins.filter((admin) => {
    if (!term) return true;
    return (
      matches(admin.id) ||
      matches(admin.name) ||
      matches(admin.email) ||
      matches(admin.created_at)
    );
  });

  const handleViewCustomerOrders = async (user) => {
    setShowCustomerOrdersModal(true);
    setSelectedCustomer(user);
    setCustomerOrdersLoading(true);
    try {
      // Fetch orders for this customer (by email or id)
      const response = await fetch(
        `/api/get_user_orders?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();
      setCustomerOrders(
        Array.isArray(data) ? data : data.orders || data.data || []
      );
    } catch (err) {
      setCustomerOrders([]);
    } finally {
      setCustomerOrdersLoading(false);
    }
  };

  const handleOpenAddAdmin = () => {
    setShowAddAdminModal(true);
    setNewAdminForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAddAdminError("");
  };
  const handleCloseAddAdmin = () => {
    setShowAddAdminModal(false);
    setNewAdminForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAddAdminError("");
  };
  const handleAddAdminInput = (e) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    setAddAdminError("");
    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      setAddAdminError("Passwords do not match");
      return;
    }
    if (newAdminForm.password.length < 6) {
      setAddAdminError("Password must be at least 6 characters");
      return;
    }
    setAddAdminLoading(true);
    try {
      const response = await fetch("/api/add_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdminForm.name,
          email: newAdminForm.email,
          password: newAdminForm.password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setPopup({
          show: true,
          message: "Admin created successfully",
          success: true,
        });
        setShowAddAdminModal(false);
        setNewAdminForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        await fetchAdmins();
      } else {
        setAddAdminError(result.error || "Failed to add admin");
      }
    } catch (err) {
      setAddAdminError("Server error");
    } finally {
      setAddAdminLoading(false);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className={styles.refreshButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar className="navbarWhite" />
      <div className={styles.dashboardModernBG}>
        <div className={styles.dashboardModernContainer}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

          {/* Service Management Section */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Service Management</h2>
            <button
              className={styles.addModernBtn}
              style={{ marginBottom: "1.2rem" }}
              onClick={handleAddService}
            >
              Add New Service
            </button>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchIcon}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#5c788a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#5c788a"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search services"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tableModernWrapper}>
              <table className={styles.tableModern}>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.title}</td>
                      <td>{service.description}</td>
                      <td>
                        <div className={styles.actionButtonGroup}>
                          <button
                            className={styles.editModernBtn}
                            onClick={() => handleEditService(service)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteModernBtn}
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Orders Management Section */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Orders Management</h2>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchIcon}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#5c788a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#5c788a"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tableModernWrapper}>
              <table className={styles.tableModern}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Company Name</th>
                    <th>Customer Email</th>
                    <th>Service</th>
                    <th>Date Requested</th>
                    <th>Status</th>
                    <th>Verification</th>

                  </tr>
                </thead>
                <tbody>
                  {filteredServiceRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.name}</td>
                      <td>{request.phone || "-"}</td>
                      <td>{request.company_name}</td>
                      <td>{request.email}</td>
                      <td>{request.service_type}</td>
                      <td>{request.date || request.created_at || ""}</td>
                      <td style={{ position: "relative" }}>
                        <button
                          className={styles.statusButton}
                          data-status={request.status || "Pending"}
                          onClick={() => {request.otp === "Confirmed" ? handleStatusButtonClick(request.id): ()=>{}}}
                        >
                          {request.status || "Pending"}
                        </button>
                        {statusDropdown.open &&
                          statusDropdown.requestId === request.id && (
                            <div
                              className={styles.statusDropdown}
                              ref={statusDropdownRef}
                            >
                              {["Active", "Done", "Rejected", "Pending"].map(
                                (option) => (
                                  <button
                                    key={option}
                                    className={styles.statusDropdownOption}
                                    onClick={() =>
                                      !statusUpdating &&
                                      handleStatusChange(request.id, option)
                                    }
                                    disabled={statusUpdating}
                                  >
                                    {option}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                      </td>
                      <td>{request.otp === "Confirmed" ? request.otp : "Not confirmed"}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Customer Management Section */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Customer Management</h2>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchIcon}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#5c788a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#5c788a"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search customers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tableModernWrapper}>
              <table className={styles.tableModern}>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userOrders = serviceRequests.filter(
                      (order) => order.email === user.email
                    );
                    return (
                      <tr key={user.id || user.email || user.name}>
                        <td>{user.name}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{user.company_name}</td>
                        <td>{user.email}</td>
                        <td>
                          {userOrders.length > 0
                            ? userOrders
                                .map((order) => order.service_type || order.id)
                                .join(", ")
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Admin Management Section */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Admin Management</h2>
            <button
              className={styles.addModernBtn}
              style={{ marginBottom: "1.2rem" }}
              onClick={handleOpenAddAdmin}
            >
              Add New Admin
            </button>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchIcon}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#5c788a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#5c788a"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search admins"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tableModernWrapper}>
              <table className={styles.tableModern}>
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id || admin.email || admin.name}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowAddModal(false);
            setEditingService(null);
            setNewService({
              title: "",
              description: "",
              features: [{ name: "", description: "" }],
              category: "",
              icon: "box1",
              image: null,
            });
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => {
                setShowAddModal(false);
                setEditingService(null);
                setNewService({
                  title: "",
                  description: "",
                  features: [{ name: "", description: "" }],
                  category: "",
                  icon: "box1",
                  image: null,
                });
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
            <form onSubmit={handleServiceSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) =>
                    setNewService({ ...newService, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({ ...newService, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Icon Style</label>
                <select
                  value={newService.icon}
                  onChange={(e) =>
                    setNewService({ ...newService, icon: e.target.value })
                  }
                >
                  <option value="box1">Box 1</option>
                  <option value="box2">Box 2</option>
                  <option value="box3">Box 3</option>
                  <option value="box4">Box 4</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Features</label>
                {newService.features.map((feature, index) => (
                  <div key={index} className={styles.featureInput}>
                    <input
                      type="text"
                      placeholder="Feature Name"
                      value={feature.name}
                      onChange={(e) =>
                        handleFeatureChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <textarea
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      style={{ minHeight: "60px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className={styles.removeButton}
                      style={{ alignSelf: "flex-end" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeatureField}
                  className={styles.addFeatureButton}
                >
                  Add Feature
                </button>
              </div>
              <div className={styles.formGroup}>
                <label>Upload Icon Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewService({ ...newService, image: e.target.files[0] })
                  }
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  {editingService ? "Update Service" : "Add Service"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                    setNewService({
                      title: "",
                      description: "",
                      features: [{ name: "", description: "" }],
                      category: "",
                      icon: "box1",
                      image: null,
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Customer Orders Modal */}
      {showCustomerOrdersModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCustomerOrdersModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setShowCustomerOrdersModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Orders for {selectedCustomer?.name}</h2>
            {customerOrdersLoading ? (
              <div>Loading orders...</div>
            ) : customerOrders.length === 0 ? (
              <div>No orders found for this customer.</div>
            ) : (
              <table
                className={styles.tableModern}
                style={{ marginTop: "1.2rem" }}
              >
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.service_type}</td>
                      <td>{order.date || order.created_at || ""}</td>
                      <td>{order.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className={styles.modalOverlay} onClick={handleCloseAddAdmin}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleCloseAddAdmin}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Add New Admin</h2>
            {addAdminError && (
              <div className={styles.error}>{addAdminError}</div>
            )}
            <form onSubmit={handleAddAdminSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAdminForm.name}
                  onChange={handleAddAdminInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAdminForm.email}
                  onChange={handleAddAdminInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newAdminForm.password}
                  onChange={handleAddAdminInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newAdminForm.confirmPassword}
                  onChange={handleAddAdminInput}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={addAdminLoading}
                >
                  {addAdminLoading ? "Adding..." : "Add Admin"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseAddAdmin}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
  // }
}
