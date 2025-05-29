import React, { useState } from "react"
import { Link } from "react-router-dom"
import ShopPage from "./ShopPage"
import TrackingPage from "./TrackingPage"
// Import other components as needed

const menuItems = [
    { key: "shop", label: "Shop", icon: "🛒" },
    { key: "orders", label: "Order History", icon: "📦" },
    { key: "track", label: "Track Order", icon: "🚚" },
    { key: "refund", label: "Refunds", icon: "💸" },
    { key: "support", label: "Support", icon: "💬" },
]

const CustomerDashboard = ({ user }) => {
    const [active, setActive] = useState("shop")

    return (
        <div className="customer-dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar-menu">
                    <div className="dashboard-sidebar-header">
                        <span style={{ fontWeight: 700, fontSize: 18, marginBottom: 24, display: "block" }}>
                            My Account
                        </span>
                    </div>
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            className={`dashboard-sidebar-btn${active === item.key ? " active" : ""}`}
                            onClick={() => setActive(item.key)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="dashboard-sidebar-bottom">
                    <button
                        className={`dashboard-sidebar-btn${active === "settings" ? " active" : ""}`}
                        onClick={() => setActive("settings")}
                    >
                        <span className="sidebar-icon">⚙️</span>
                        Settings
                    </button>
                </div>
            </aside>
            <main className="dashboard-main-content">
                {active === "shop" && (
                    <div className="dashboard-shop-content">
                        <ShopPage
                            showSidebar={false}
                            filterPosition="right"
                        />
                    </div>
                )}
                {active === "orders" && (
                    <div>
                        <h2>Order History</h2>
                        {/* Replace with your OrderHistory component */}
                        <p>All your past orders will appear here.</p>
                    </div>
                )}
                {active === "track" && (
                    <div>
                        <TrackingPage />
                    </div>
                )}
                {active === "refund" && (
                    <div>
                        <h2>Refunds</h2>
                        {/* Replace with your Refunds component */}
                        <p>Request and view your refunds here.</p>
                    </div>
                )}
                {active === "support" && (
                    <div>
                        <h2>Support</h2>
                        {/* Replace with your Support component */}
                        <p>Contact support or view your tickets here.</p>
                    </div>
                )}
                {active === "settings" && (
                    <div>
                        <h2>Settings</h2>
                        {/* Replace with your Settings component */}
                        <p>Update your account settings here.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default CustomerDashboard