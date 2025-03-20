"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import React from "react"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Check if route requires admin access
  if (adminOnly && user.email !== "admin@tungagas.com") {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute

