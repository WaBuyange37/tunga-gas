"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";
import { auth, g_provider, t_provider, db } from "../config/firebase";
import { doc, serverTimestamp, setDoc , getDoc} from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, sendPasswordResetEmail, } from "firebase/auth";

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
  const [role, setRole] = useState('customer');
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
  }, [navigate]);

  const setErrorMessages = (err) => {
    let msg;
    switch (err) {
      case 'auth/invalid-email':
        msg = 'Invalid email format. Please check your email.'
        break;
      case 'auth/user-not-found':
        msg = "No user found with that email.  Please check or create an account.";
        break;
      case 'auth/user-disabled':
        msg = "Your account has been disabled. Please contact support.";
        break;
      case 'auth/wrong-password':
        msg = "Incorrect password. Please try again, or reset your password.";
        break;
      case 'auth/network-request-failed':
        msg = "We're having trouble connecting to the server. Please check your internet connection and try again later.";
        break;
      case 'auth/too-many-requests':
        msg = 'Too many login attempts. Please try again in a few minutes.';
        break;
      case 'auth/account-exists-with-different-credential':
        msg = "This email address is already registered with a different account type.";
        break;
      case 'firebase.auth.Error':
        msg = "We're having trouble sending the password reset email. Please try again later.";
        break;
      case 'auth/weak-password':
        msg = "Password is too weak";
        break;
      case 'auth/email-already-in-use':
        msg = "Email is already in use, use another email or login to your account.";
        break;
      case 'auth/invalid-credential':
        msg = "Invalid login credentials. Please double-check your email and password and try again.";
        break;
        
      default:
        msg = "An unexpected error occurred. Please try again later.";
        break;
    }
    return msg;
  }

  const handleAuth = async (e, provider) => {
    setErrors('');
    setIsLoading(true)
    setAuthError("")
    e.preventDefault();

    if (provider === 'google' || provider === 'twitter') {
      const providerToUse = (provider === 'google') ? g_provider : t_provider;
      signInWithPopup(auth, providerToUse)
        .then((userCredential) => {
          handleUser(userCredential, false);
        })
        .catch((error) => {
          setAuthError(setErrorMessages(error.code));
          console.log(error);
        });
    }

    else if (provider === 'email') {

      if (validateForm(e, false)) {
        signInWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
            handleUser(userCredential, false);
          })
          .catch((error) => {
            setAuthError(setErrorMessages(error.code));
            console.log(error);
            setErrors({
              msg: error.message
            });
          })
      }
    }

    else if (provider === 's_email') {
      if (validateForm(e, true)) {
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
            handleUser(userCredential, true);
            
            updateProfile(userCredential.user, {
              displayName: formData.fullName,
            });


          })
          .catch((error) => {
            setAuthError(setErrorMessages(error.code));
          })
      }
    }

  }

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

  const validateForm = (e, isSignup) => {
    e.preventDefault();
    setIsLoading(true)
    setAuthError("")
    const newErrors = {}

    if (isSignup) {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required"
      }
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (isSignup) {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (isSignup && !formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUser = async (userCredential, isNew) => {

    if (!isNew) {
      const userDoc = await getDoc(doc(db, "customer", userCredential.user.uid));
      if (userDoc.exists()) {
        return; // User found, do nothing
      } else {
        setActiveTab("signup"); // User not found, switch to signup
      }
    }

    setDoc(doc(db, "customer", userCredential.user.uid), {
      Name: formData.fullName,
      Email: formData.email,
      Phone: formData.phone,
      Password: formData.password,
      CreatedAt: serverTimestamp(),
      Role: "customer", // Default role
      HasAgreedToTerms: formData.agreeTerms
    })
      .then((docref) => {
        console.log("User credentials stored successfully");
        if (role === 'customer') {
          navigate("/b2c");
        } else if (role === 'supplier') {
          navigate("/b2b");
        }
      })
      .catch((err) => {
        console.log(err);
      })
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
              <form className="auth-form" onSubmit={(e)=>{handleAuth(e, 'email')}}>
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
                    onClick={(e) => { handleAuth(e, 'google') }}
                    disabled={isLoading}
                  >
                    <FcGoogle /> Google
                  </button>
                  <button
                    type="button"
                    className="social-btn twitter-btn"
                    onClick={(e) => { handleAuth(e, 'twitter') }}
                    disabled={isLoading}
                  >
                    <BsTwitterX /> Twitter
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
            <form className="auth-form" onSubmit={(e)=>{handleAuth(e, 's_email')}}>
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
                    onClick={(e) => { handleAuth(e, 'google') }}
                    disabled={isLoading}
                  >
                    <FcGoogle /> Google
                  </button>
                  <button
                    type="button"
                    className="social-btn twitter-btn"
                    onClick={(e) => { handleAuth(e, 'twitter') }}
                    disabled={isLoading}
                  >
                    <BsTwitterX /> Twitter
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

export default AuthForms;

