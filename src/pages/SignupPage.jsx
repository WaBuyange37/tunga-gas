import React from "react"
import { Link } from "react-router-dom"
import AuthForms from "../components/AuthForms"
import "./AuthPages.css"

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1 className="auth-title">Create an Account</h1>
          <AuthForms initialTab="signup" />
          <p className="auth-redirect">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

