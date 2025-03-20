"use client"

import React,{ useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { getAllOrders } from "../../services/orderService"
import { getAllProducts } from "../../services/productService"
import { getAllSuppliers } from "../../services/supplierService"
import { FaHome, FaBox, FaUsers, FaTruck, FaWarehouse, FaSignOutAlt, FaGasPump } from "react-icons/fa"
import "./AdminDashboard.css"

// Admin Dashboard Components
import AdminDashboardHome from "./AdminDashboardHome"
import AdminProductsPage from "./AdminProductsPage"
import AdminCustomersPage from "./AdminCustomersPage"
import AdminOrdersPage from "./AdminOrdersPage"
import SupplierApprovalPage from "./SupplierApprovalPage"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    orders: [],
    products: [],
    suppliers: [],
  })
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const navigate = useNavigate()

  // Check if user is admin
  useEffect(() => {
    if (!user || user.email !== "admin@tungagas.com") {
      navigate("/login")
    }
  }, [user, navigate])

  // Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, products, suppliers] = await Promise.all([getAllOrders(), getAllProducts(), getAllSuppliers()])

        setStats({
          orders,
          products,
          suppliers,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboardHome stats={stats} />
      case "products":
        return <AdminProductsPage products={stats.products} />
      case "customers":
        return <AdminCustomersPage />
      case "orders":
        return <AdminOrdersPage orders={stats.orders} />
      case "suppliers":
        return <SupplierApprovalPage suppliers={stats.suppliers} />
      default:
        return <AdminDashboardHome stats={stats} />
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    )
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
              <button
                className={`admin-menu-link ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <FaHome className="admin-menu-icon" />
                Dashboard
              </button>
            </li>
            <li className="admin-menu-item">
              <button
                className={`admin-menu-link ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                <FaBox className="admin-menu-icon" />
                Products
              </button>
            </li>
            <li className="admin-menu-item">
              <button
                className={`admin-menu-link ${activeTab === "customers" ? "active" : ""}`}
                onClick={() => setActiveTab("customers")}
              >
                <FaUsers className="admin-menu-icon" />
                Customers
              </button>
            </li>
            <li className="admin-menu-item">
              <button
                className={`admin-menu-link ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <FaTruck className="admin-menu-icon" />
                Orders
              </button>
            </li>
            <li className="admin-menu-item">
              <button
                className={`admin-menu-link ${activeTab === "suppliers" ? "active" : ""}`}
                onClick={() => setActiveTab("suppliers")}
              >
                <FaWarehouse className="admin-menu-icon" />
                Suppliers
              </button>
            </li>
            <li className="admin-menu-item">
              <button className="admin-menu-link logout-link" onClick={() => navigate("/login")}>
                <FaSignOutAlt className="admin-menu-icon" />
                Logout
              </button>
            </li>
          </ul>
        </div>
        <div className="admin-main">{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default AdminDashboard

