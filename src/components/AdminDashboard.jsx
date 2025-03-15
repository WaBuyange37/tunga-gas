"use client"

import {
  FaHome,
  FaBox,
  FaUsers,
  FaTruck,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaGasPump,
  FaWarehouse,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import React from "react"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,248",
      icon: <FaClipboardList />,
      color: "var(--primary)",
    },
    {
      title: "Total Revenue",
      value: "RWF 4.2M",
      icon: <FaChartLine />,
      color: "var(--success)",
    },
    {
      title: "Gas Cylinders",
      value: "3,842",
      icon: <FaGasPump />,
      color: "var(--secondary)",
    },
    {
      title: "Suppliers",
      value: "24",
      icon: <FaWarehouse />,
      color: "var(--warning)",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-7829",
      customer: "John Doe",
      date: "2023-05-15",
      amount: "RWF 24,000",
      status: "Delivered",
    },
    {
      id: "ORD-7830",
      customer: "Jane Smith",
      date: "2023-05-15",
      amount: "RWF 36,000",
      status: "Processing",
    },
    {
      id: "ORD-7831",
      customer: "Robert Johnson",
      date: "2023-05-14",
      amount: "RWF 15,000",
      status: "Delivered",
    },
    {
      id: "ORD-7832",
      customer: "Emily Williams",
      date: "2023-05-14",
      amount: "RWF 42,000",
      status: "Pending",
    },
    {
      id: "ORD-7833",
      customer: "Michael Brown",
      date: "2023-05-13",
      amount: "RWF 28,000",
      status: "Delivered",
    },
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Redirect will happen automatically due to auth state change
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-sidebar">
          <div className="admin-logo">
            <FaGasPump />
            <span>TungaGas Admin</span>
          </div>
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <Link to="/admin" className="admin-menu-link active">
                <FaHome className="admin-menu-icon" />
                Dashboard
              </Link>
            </li>
            <li className="admin-menu-item">
              <Link to="/admin/products" className="admin-menu-link">
                <FaBox className="admin-menu-icon" />
                Products
              </Link>
            </li>
            <li className="admin-menu-item">
              <Link to="/admin/customers" className="admin-menu-link">
                <FaUsers className="admin-menu-icon" />
                Customers
              </Link>
            </li>
            <li className="admin-menu-item">
              <Link to="/admin/orders" className="admin-menu-link">
                <FaTruck className="admin-menu-icon" />
                Orders
              </Link>
            </li>
            <li className="admin-menu-item">
              <Link to="/admin/transactions" className="admin-menu-link">
                <FaCreditCard className="admin-menu-icon" />
                Transactions
              </Link>
            </li>
            <li className="admin-menu-item">
              <Link to="/admin/settings" className="admin-menu-link">
                <FaCog className="admin-menu-icon" />
                Settings
              </Link>
            </li>
            <li className="admin-menu-item">
              <button onClick={handleLogout} className="admin-menu-link logout-link">
                <FaSignOutAlt className="admin-menu-icon" />
                Logout
              </button>
            </li>
          </ul>
        </div>
        <div className="admin-main">
          <div className="admin-header">
            <h1 className="admin-title">Dashboard</h1>
            <div className="admin-user">
              <span>Admin User</span>
              <img src="/placeholder.svg?height=40&width=40" alt="Admin" className="admin-avatar" />
            </div>
          </div>

          <div className="admin-stats">
            {stats.map((stat, index) => (
              <div className="admin-stat-card" key={index} style={{ borderLeftColor: stat.color }}>
                <div className="admin-stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="admin-stat-content">
                  <h3 className="admin-stat-title">{stat.title}</h3>
                  <p className="admin-stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-recent-orders">
            <h2 className="admin-section-title">Recent Orders</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="admin-table-action">View</button>
                          <button className="admin-table-action">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

