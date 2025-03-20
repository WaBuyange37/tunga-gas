"use client"

import React,{ useState } from "react"
import { FaEye, FaCheck, FaTruck, FaTimesCircle } from "react-icons/fa"
import "./AdminPages.css"

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-7829",
      customer: "John Doe",
      date: "2023-05-15",
      amount: "RWF 24,000",
      status: "Pending",
      items: 2,
    },
    {
      id: "ORD-7830",
      customer: "Jane Smith",
      date: "2023-05-15",
      amount: "RWF 36,000",
      status: "Processing",
      items: 3,
    },
    {
      id: "ORD-7831",
      customer: "Robert Johnson",
      date: "2023-05-14",
      amount: "RWF 15,000",
      status: "Delivered",
      items: 1,
    },
    {
      id: "ORD-7832",
      customer: "Emily Williams",
      date: "2023-05-14",
      amount: "RWF 42,000",
      status: "Cancelled",
      items: 4,
    },
    {
      id: "ORD-7833",
      customer: "Michael Brown",
      date: "2023-05-13",
      amount: "RWF 28,000",
      status: "Delivered",
      items: 2,
    },
  ])

  // Function to update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Order Management</h1>
        <p>View and manage customer orders</p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn view-btn" title="View Order">
                      <FaEye />
                    </button>

                    {order.status === "Pending" && (
                      <button
                        className="admin-action-btn approve-btn"
                        title="Process Order"
                        onClick={() => updateOrderStatus(order.id, "Processing")}
                      >
                        <FaCheck />
                      </button>
                    )}

                    {order.status === "Processing" && (
                      <button
                        className="admin-action-btn"
                        title="Mark as Delivered"
                        style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}
                        onClick={() => updateOrderStatus(order.id, "Delivered")}
                      >
                        <FaTruck />
                      </button>
                    )}

                    {(order.status === "Pending" || order.status === "Processing") && (
                      <button
                        className="admin-action-btn reject-btn"
                        title="Cancel Order"
                        onClick={() => updateOrderStatus(order.id, "Cancelled")}
                      >
                        <FaTimesCircle />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrdersPage

