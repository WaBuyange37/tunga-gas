import { Navigate } from "react-router-dom"
import React from "react"
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

