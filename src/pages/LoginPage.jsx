import React from "react"
import { Link } from "react-router-dom"
import AuthForms from "../components/AuthForms"
import "./AuthPages.css"

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1 className="auth-title">Login to Your Account</h1>
          <AuthForms initialTab="login" />
          <p className="auth-redirect">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

