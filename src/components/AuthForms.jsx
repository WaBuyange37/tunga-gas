"use client"

import React,{ useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, g_provider, t_provider, db } from "../config/firebase"
import { FaGoogle, FaTwitter, FaEnvelope } from "react-icons/fa"
import "./AuthForms.css"

const AuthForms = ({ initialTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/shop")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // Clear general auth error when user makes changes
    if (authError) {
      setAuthError("")
    }
  }

  const validateLoginForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignupForm = () => {
    const newErrors = {}

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (validateLoginForm()) {
      setIsLoading(true)
      setAuthError("")

      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        // No need to navigate here as the useEffect will handle it
      } catch (error) {
        console.error("Login error:", error)

        // Handle specific error codes
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          setAuthError("Invalid email or password")
        } else if (error.code === "auth/too-many-requests") {
          setAuthError("Too many failed login attempts. Please try again later")
        } else {
          setAuthError("An error occurred during login. Please try again")
        }

        setIsLoading(false)
      }
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    if (validateSignupForm()) {
      setIsLoading(true)
      setAuthError("")

      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

        // Update profile with display name
        await updateProfile(userCredential.user, {
          displayName: formData.fullName,
        })

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: serverTimestamp(),
          role: "customer", // Default role
        })

        // No need to navigate here as the useEffect will handle it
      } catch (error) {
        console.error("Signup error:", error)

        // Handle specific error codes
        if (error.code === "auth/email-already-in-use") {
          setAuthError("Email is already in use")
        } else if (error.code === "auth/weak-password") {
          setAuthError("Password is too weak")
        } else {
          setAuthError("An error occurred during signup. Please try again")
        }

        setIsLoading(false)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError("")

    try {
      await signInWithPopup(auth, g_provider)
      // No need to navigate here as the useEffect will handle it
    } catch (error) {
      console.error("Google sign-in error:", error)
      setAuthError("An error occurred during Google sign-in. Please try again")
      setIsLoading(false)
    }
  }

  const handleTwitterSignIn = async () => {
    setIsLoading(true)
    setAuthError("")

    try {
      await signInWithPopup(auth, t_provider)
      // No need to navigate here as the useEffect will handle it
    } catch (error) {
      console.error("Twitter sign-in error:", error)
      setAuthError("An error occurred during Twitter sign-in. Please try again")
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()

    if (!resetEmail) {
      setAuthError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setAuthError("")

    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetSent(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Password reset error:", error)

      if (error.code === "auth/user-not-found") {
        setAuthError("No account found with this email address")
      } else {
        setAuthError("An error occurred. Please try again")
      }

      setIsLoading(false)
    }
  }

  return (
    <div className="auth-forms">
      {!resetSent ? (
        <>
          <div className="auth-tabs">
            <div className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
              Login
            </div>
            <div
              className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </div>
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          {activeTab === "login" ? (
            <>
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>

              <div className="social-auth">
                <p className="social-auth-divider">
                  <span>Or login with</span>
                </p>
                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <FaGoogle /> Google
                  </button>
                  <button
                    type="button"
                    className="social-btn twitter-btn"
                    onClick={handleTwitterSignIn}
                    disabled={isLoading}
                  >
                    <FaTwitter /> Twitter
                  </button>
                </div>
              </div>

              <div className="auth-footer">
                <p>
                  Forgot your password?{" "}
                  <button type="button" onClick={() => setResetSent("request")}>
                    Reset Password
                  </button>
                </p>
              </div>
            </>
          ) : (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>

              <div className="form-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    className="form-checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  I agree to the Terms and Conditions
                </label>
                {errors.agreeTerms && <div className="form-error">{errors.agreeTerms}</div>}
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <div className="social-auth">
                <p className="social-auth-divider">
                  <span>Or sign up with</span>
                </p>
                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <FaGoogle /> Google
                  </button>
                  <button
                    type="button"
                    className="social-btn twitter-btn"
                    onClick={handleTwitterSignIn}
                    disabled={isLoading}
                  >
                    <FaTwitter /> Twitter
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      ) : resetSent === "request" ? (
        <div className="password-reset-form">
          <h3>Reset Your Password</h3>
          <p>Enter your email address and we'll send you a link to reset your password.</p>

          {authError && <div className="auth-error">{authError}</div>}

          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <label htmlFor="resetEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="resetEmail"
                className="form-input"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => {
                  setResetSent(false)
                  setAuthError("")
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="password-reset-success">
          <div className="success-icon">
            <FaEnvelope />
          </div>
          <h3>Check Your Email</h3>
          <p>
            We've sent a password reset link to <strong>{resetEmail}</strong>. Please check your email and follow the
            instructions to reset your password.
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              setResetSent(false)
              setActiveTab("login")
              setAuthError("")
            }}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  )
}

export default AuthForms

