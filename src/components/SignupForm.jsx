import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, g_provider, t_provider, db } from "../config/firebase"
import { FaGoogle, FaTwitter } from "react-icons/fa"
import "./AuthForms.css"

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer", // "customer" or "supplier"
        agreeTerms: false,
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState("")
    const [verificationSent, setVerificationSent] = useState(false)
    const [waitingVerification, setWaitingVerification] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user && user.emailVerified) {
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
        if (errors[name]) setErrors({ ...errors, [name]: "" })
        if (authError) setAuthError("")
    }

    const validateSignupForm = () => {
        const newErrors = {}
        if (!formData.email) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault()
        if (validateSignupForm()) {
            setIsLoading(true)
            setAuthError("")
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
                // Save user role in Firestore
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: formData.email,
                    role: formData.role,
                    createdAt: serverTimestamp(),
                })
                // Send verification email
                await sendEmailVerification(userCredential.user)
                setVerificationSent(true)
                setWaitingVerification(true)
            } catch (error) {
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

    // Poll for email verification if waiting
    useEffect(() => {
        let interval
        if (waitingVerification && auth.currentUser && !auth.currentUser.emailVerified) {
            interval = setInterval(async () => {
                await auth.currentUser.reload()
                if (auth.currentUser.emailVerified) {
                    setWaitingVerification(false)
                    navigate("/shop")
                }
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [waitingVerification, navigate])

    return (
        <div className="auth-form-center">
            <div className="auth-forms">
                <h2>Sign Up</h2>
                {authError && <div className="auth-error">{authError}</div>}
                {verificationSent && waitingVerification ? (
                    <div className="auth-info" style={{ color: "#22c55e", marginBottom: 16 }}>
                        Verification email sent! Please check your inbox and verify your email to continue.
                        <br />
                        <span style={{ fontSize: 14, color: "#888" }}>
                            Once verified, you will be redirected automatically.
                        </span>
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
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
                            <label htmlFor="password" className="form-label">Password</label>
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
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
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
                            <label className="form-label">Sign up as:</label>
                            <div style={{ display: "flex", gap: 16 }}>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={formData.role === "customer"}
                                        onChange={handleChange}
                                    />{" "}
                                    Customer
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="supplier"
                                        checked={formData.role === "supplier"}
                                        onChange={handleChange}
                                    />{" "}
                                    Supplier
                                </label>
                            </div>
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
                            <p className="social-auth-divider"><span>Or sign up with</span></p>
                            <div className="social-buttons">
                                <button type="button" className="social-btn google-btn" onClick={() => {}} disabled>
                                    <FaGoogle /> Google
                                </button>
                                <button type="button" className="social-btn twitter-btn" onClick={() => {}} disabled>
                                    <FaTwitter /> Twitter
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupForm