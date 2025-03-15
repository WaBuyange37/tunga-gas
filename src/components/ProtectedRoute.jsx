import React from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ user, adminOnly = false, children }) => {
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

