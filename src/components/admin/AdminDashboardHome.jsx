import { FaGasPump, FaWarehouse, FaChartLine, FaClipboardList } from "react-icons/fa"
import "./AdminDashboard.css"
import React from "react"

const AdminDashboardHome = ({ stats }) => {
  // Calculate statistics
  const totalOrders = stats.orders.length
  const totalRevenue = stats.orders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = stats.products.length
  const totalSuppliers = stats.suppliers.length

  // Get recent orders
  const recentOrders = stats.orders.slice(0, 5)

  return (
    <div className="admin-main-content">
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
        <div className="admin-user">
          <span>Admin User</span>
          <img src="/placeholder.svg?height=40&width=40" alt="Admin" className="admin-avatar" />
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card" style={{ borderLeftColor: "var(--primary)" }}>
          <div className="admin-stat-icon" style={{ color: "var(--primary)" }}>
            <FaClipboardList />
          </div>
          <div className="admin-stat-content">
            <h3 className="admin-stat-title">Total Orders</h3>
            <p className="admin-stat-value">{totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{ borderLeftColor: "var(--success)" }}>
          <div className="admin-stat-icon" style={{ color: "var(--success)" }}>
            <FaChartLine />
          </div>
          <div className="admin-stat-content">
            <h3 className="admin-stat-title">Total Revenue</h3>
            <p className="admin-stat-value">RWF {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{ borderLeftColor: "var(--secondary)" }}>
          <div className="admin-stat-icon" style={{ color: "var(--secondary)" }}>
            <FaGasPump />
          </div>
          <div className="admin-stat-content">
            <h3 className="admin-stat-title">Gas Products</h3>
            <p className="admin-stat-value">{totalProducts}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{ borderLeftColor: "var(--warning)" }}>
          <div className="admin-stat-icon" style={{ color: "var(--warning)" }}>
            <FaWarehouse />
          </div>
          <div className="admin-stat-content">
            <h3 className="admin-stat-title">Suppliers</h3>
            <p className="admin-stat-value">{totalSuppliers}</p>
          </div>
        </div>
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
                  <td>{order.id.substring(0, 8)}</td>
                  <td>{order.customerName || "Customer"}</td>
                  <td>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                  <td>RWF {order.total.toLocaleString()}</td>
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
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardHome

