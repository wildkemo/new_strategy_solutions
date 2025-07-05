"use client";
import { useEffect, useState } from "react";

export default function MyOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        data = data.orders
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

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
    <div style={{ padding: "80px 32px 32px 32px" }}>
      <h1>My Orders</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>ID</th>
            <th style={{ textAlign: "left", padding: 8 }}>Service Type</th>
            <th style={{ textAlign: "left", padding: 8 }}>Description</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ textAlign: "left", padding: 8 }}>Verification</th>

          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: 8 }}>{order.id}</td>
              <td style={{ padding: 8 }}>{order.service_type}</td>
              <td style={{ padding: 8 }}>{order.service_description}</td>
              <td style={{ padding: 8 }}>{order.status}</td>
              <td style={{ padding: 8 }}>{order.otp === "Confirmed" ? order.otp : "Not confirmed"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
