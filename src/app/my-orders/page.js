"use client";
import { useEffect, useState } from "react";
import React from "react";

export default function MyOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "/api/get_user_orders/",
          // "http://localhost/www/oop_project/php_backend/app/Controllers/get_user_orders.php",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        let data = await response.json();
        data = data.orders;
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleDeleteOrder = async (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const response = await fetch("/api/delete_order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderToDelete, isAdmin: false }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrders((prev) => prev.filter((order) => order.id !== orderToDelete));
      } else {
        alert(result.message || "Failed to delete order");
      }
    } catch (err) {
      alert("Failed to delete order");
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(search) ||
      order.service_type.toLowerCase().includes(search.toLowerCase()) ||
      (order.service_description &&
        order.service_description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error)
    return <div style={{ padding: 32, color: "red" }}>Error: {error}</div>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: "80px 32px 32px 32px", textAlign: "center" }}>
        <h1>My Orders</h1>
        <div style={{ marginTop: 40, fontSize: 20, color: "#888" }}>
          There are no requested services yet.
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafb", padding: 0 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 0 0 0" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
          My Orders
        </h1>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: 32,
            marginBottom: 32,
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="\uD83D\uDD0D  Search orders..."
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid #e3e7ea",
              fontSize: 16,
              marginBottom: 24,
              outline: "none",
              background: "#f7f9fa",
              color: "#222",
              boxSizing: "border-box",
            }}
          />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                fontSize: 15,
                margin: 0,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafb" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Verification
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: 12,
                      fontWeight: 700,
                      color: "#222",
                      borderBottom: "1px solid #e3e7ea",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: "#888",
                      }}
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td
                        style={{ padding: 12, color: "#222", fontWeight: 500 }}
                      >
                        {order.id}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          color: "#4a90e2",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {order.service_type}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span
                          style={{
                            background:
                              order.status === "Active"
                                ? "#e6f4ea"
                                : order.status === "Done"
                                ? "#e6f0fa"
                                : order.status === "Pending"
                                ? "#fffbe6"
                                : order.status === "Rejected"
                                ? "#faeaea"
                                : "#f0f0f0",
                            color:
                              order.status === "Active"
                                ? "#11c29b"
                                : order.status === "Done"
                                ? "#4a90e2"
                                : order.status === "Pending"
                                ? "#e6b800"
                                : order.status === "Rejected"
                                ? "#e74c3c"
                                : "#888",
                            borderRadius: 16,
                            padding: "4px 18px",
                            fontWeight: 700,
                            fontSize: 14,
                            display: "inline-block",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        <span
                          style={{
                            background:
                              order.otp === "Confirmed" ? "#e6f4ea" : "#fffbe6",
                            color:
                              order.otp === "Confirmed" ? "#11c29b" : "#e6b800",
                            borderRadius: 16,
                            padding: "4px 18px",
                            fontWeight: 700,
                            fontSize: 14,
                            display: "inline-block",
                          }}
                        >
                          {order.otp === "Confirmed"
                            ? "Confirmed"
                            : "Not confirmed"}
                        </span>
                      </td>
                      <td
                        style={{ padding: 12, color: "#222", fontWeight: 500 }}
                      >
                        {order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : "-"}
                      </td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        <button
                          style={{
                            color: "#4a90e2",
                            background: "#f7f9fa",
                            border: "none",
                            borderRadius: 4,
                            padding: "6px 18px",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer
        style={{
          textAlign: "center",
          marginTop: 48,
          color: "#888",
          fontSize: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 8,
          }}
        >
          <a href="#" style={{ color: "#4a90e2", textDecoration: "none" }}>
            Privacy Policy
          </a>
          <a href="#" style={{ color: "#4a90e2", textDecoration: "none" }}>
            Terms of Service
          </a>
          <a href="#" style={{ color: "#4a90e2", textDecoration: "none" }}>
            Contact Us
          </a>
        </div>
        <div style={{ color: "#b0b0b0", fontSize: 14, marginTop: 4 }}>
          © 2024 Service Orders. All rights reserved.
        </div>
      </footer>
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              padding: "2rem 2.5rem",
              minWidth: 320,
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={cancelDeleteOrder}
              style={{
                position: "absolute",
                top: 10,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#888",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 style={{ color: "#e74c3c", marginBottom: 16 }}>Delete Order</h2>
            <div
              style={{ fontSize: "1.1rem", color: "#222", marginBottom: 18 }}
            >
              Are you sure you want to delete this order?
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <button
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={confirmDeleteOrder}
              >
                Yes
              </button>
              <button
                style={{
                  background: "#f3f3f3",
                  color: "#222",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={cancelDeleteOrder}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
