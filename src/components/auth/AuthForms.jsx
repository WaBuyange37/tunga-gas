"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser, loginWithEmail, loginWithGoogle, resetPassword } from "../../services/authService"
import { FaGoogle, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import "./AuthForms.css"

// Rwanda provinces and districts data
const rwandaLocations = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
}

const AuthForms = ({ initialTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    userType: "customer", // Default to customer
    province: "",
    district: "",
    sector: "",
    agreeTerms: false,
    // Supplier specific fields
    businessName: "",
    businessDescription: "",
    rdbCertificate: null,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [districts, setDistricts] = useState([])

  const navigate = useNavigate()

  // Update districts when province changes
  React.useEffect(() => {
    if (formData.province && rwandaLocations[formData.province]) {
      setDistricts(rwandaLocations[formData.province])
      // Reset district if it's not in the new province
      if (!rwandaLocations[formData.province].includes(formData.district)) {
        setFormData((prev) => ({
          ...prev,
          district: "",
          sector: "",
        }))
      }
    } else {
      setDistricts([])
    }
  }, [formData.province, formData.district])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }

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

    if (!formData.province) {
      newErrors.province = "Province is required"
    }

    if (!formData.district) {
      newErrors.district = "District is required"
    }

    if (!formData.sector) {
      newErrors.sector = "Sector/Town is required"
    }

    // Supplier specific validations
    if (formData.userType === "supplier") {
      if (!formData.businessName) {
        newErrors.businessName = "Business name is required"
      }

      if (!formData.businessDescription) {
        newErrors.businessDescription = "Business description is required"
      }

      if (!formData.rdbCertificate) {
        newErrors.rdbCertificate = "RDB certificate is required"
      }
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
        await loginWithEmail(formData.email, formData.password)
        navigate("/shop") // Redirect to shop page after login
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
      } finally {
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
        await registerUser(formData.email, formData.password, {
          fullName: formData.fullName,
          phone: formData.phone,
          userType: formData.userType,
          province: formData.province,
          district: formData.district,
          sector: formData.sector,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          rdbCertificate: formData.rdbCertificate,
        })

        navigate("/shop") // Redirect to shop page after signup
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
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError("")

    try {
      await loginWithGoogle()
      navigate("/shop") // Redirect to shop page after login
    } catch (error) {
      console.error("Google sign-in error:", error)
      setAuthError("An error occurred during Google sign-in. Please try again")
    } finally {
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
      await resetPassword(resetEmail)
      setResetSent(true)
    } catch (error) {
      console.error("Password reset error:", error)

      if (error.code === "auth/user-not-found") {
        setAuthError("No account found with this email address")
      } else {
        setAuthError("An error occurred. Please try again")
      }
    } finally {
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
                <label htmlFor="userType" className="form-label">
                  I am a:
                </label>
                <div className="user-type-selector">
                  <label className={`user-type-option ${formData.userType === "customer" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="customer"
                      checked={formData.userType === "customer"}
                      onChange={handleChange}
                    />
                    <span>Customer</span>
                  </label>
                  <label className={`user-type-option ${formData.userType === "supplier" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="supplier"
                      checked={formData.userType === "supplier"}
                      onChange={handleChange}
                    />
                    <span>Supplier</span>
                  </label>
                </div>
              </div>

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

              <div className="location-section">
                <h3 className="location-heading">
                  <FaMapMarkerAlt /> Your Location
                </h3>

                <div className="form-group">
                  <label htmlFor="province" className="form-label">
                    Province
                  </label>
                  <select
                    id="province"
                    name="province"
                    className="form-select"
                    value={formData.province}
                    onChange={handleChange}
                  >
                    <option value="">Select Province</option>
                    {Object.keys(rwandaLocations).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && <div className="form-error">{errors.province}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="district" className="form-label">
                    District
                  </label>
                  <select
                    id="district"
                    name="district"
                    className="form-select"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!formData.province}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && <div className="form-error">{errors.district}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="sector" className="form-label">
                    Sector/Town
                  </label>
                  <input
                    type="text"
                    id="sector"
                    name="sector"
                    className="form-input"
                    value={formData.sector}
                    onChange={handleChange}
                    placeholder="Enter your sector or town"
                  />
                  {errors.sector && <div className="form-error">{errors.sector}</div>}
                </div>
              </div>

              {formData.userType === "supplier" && (
                <div className="supplier-section">
                  <h3 className="supplier-heading">Business Information</h3>

                  <div className="form-group">
                    <label htmlFor="businessName" className="form-label">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      className="form-input"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                    {errors.businessName && <div className="form-error">{errors.businessName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="businessDescription" className="form-label">
                      Business Description
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      className="form-textarea"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      rows={3}
                    />
                    {errors.businessDescription && <div className="form-error">{errors.businessDescription}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="rdbCertificate" className="form-label">
                      RDB Business Certificate
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id="rdbCertificate"
                        name="rdbCertificate"
                        className="form-file-input"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="file-input-text">
                        {formData.rdbCertificate ? formData.rdbCertificate.name : "Choose file"}
                      </div>
                      <button type="button" className="file-input-button">
                        Browse
                      </button>
                    </div>
                    <div className="file-input-help">
                      Upload your RDB business registration certificate (PDF, JPG, PNG)
                    </div>
                    {errors.rdbCertificate && <div className="form-error">{errors.rdbCertificate}</div>}
                  </div>
                </div>
              )}

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

