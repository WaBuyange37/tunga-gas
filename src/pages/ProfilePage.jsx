"use client"

import React,{ useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../config/firebase"
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import "./ProfilePage.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserData(userData)
            setFormData({
              fullName: currentUser.displayName || userData.fullName || "",
              email: currentUser.email || "",
              phone: userData.phone || "",
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        navigate("/login")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateProfileForm = () => {
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) return

    setIsSubmitting(true)
    setNotification({ show: false, message: "", type: "" })

    try {
      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: formData.fullName,
      })

      // Update email if changed
      if (user.email !== formData.email) {
        await updateEmail(user, formData.email)
      }

      // Update user data in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      })

      setNotification({
        show: true,
        message: "Profile updated successfully",
        type: "success",
      })

      // Update local user state
      setUser({
        ...user,
        displayName: formData.fullName,
        email: formData.email,
      })

      setUserData({
        ...userData,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      })
    } catch (error) {
      console.error("Error updating profile:", error)

      let errorMessage = "An error occurred while updating your profile"

      if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log back in to update your email"
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account"
      }

      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    setIsSubmitting(true)
    setNotification({ show: false, message: "", type: "" })

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword)

      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, formData.newPassword)

      setNotification({
        show: true,
        message: "Password updated successfully",
        type: "success",
      })

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)

      let errorMessage = "An error occurred while updating your password"

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect"
        setErrors({
          ...errors,
          currentPassword: "Current password is incorrect",
        })
      }

      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-user-info">
              <img
                src={user?.photoURL || "/placeholder.svg?height=100&width=100"}
                alt={user?.displayName || "User"}
                className="profile-user-image"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=100&width=100"
                }}
              />
              <h3>{user?.displayName || "User"}</h3>
              <p>{user?.email}</p>
            </div>

            <div className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser /> Profile Information
              </button>
              <button
                className={`profile-tab ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <FaLock /> Security
              </button>
            </div>
          </div>

          <div className="profile-content">
            {notification.show && (
              <div className={`notification ${notification.type}`}>
                {notification.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
                <span>{notification.message}</span>
              </div>
            )}

            {activeTab === "profile" ? (
              <div className="profile-section">
                <h2>Profile Information</h2>
                <p>Update your personal information</p>

                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      <FaUser /> Full Name
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
                      <FaEnvelope /> Email
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
                      <FaPhone /> Phone Number
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

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="profile-section">
                <h2>Security</h2>
                <p>Update your password</p>

                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">
                      <FaLock /> Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-input"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      <FaLock /> New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock /> Confirm New Password
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

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

