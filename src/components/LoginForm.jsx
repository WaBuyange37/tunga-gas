import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, g_provider, t_provider } from "../config/firebase"
import { FaGoogle, FaTwitter } from "react-icons/fa"
import "./AuthForms.css"

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState("")
    const [resetSent, setResetSent] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) navigate("/shop")
        })
        return () => unsubscribe()
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: "" })
        if (authError) setAuthError("")
    }

    const validateLoginForm = () => {
        const newErrors = {}
        if (!formData.email) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
        if (!formData.password) newErrors.password = "Password is required"
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
            } catch (error) {
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

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setAuthError("")
        try {
            await signInWithPopup(auth, g_provider)
        } catch (error) {
            setAuthError("An error occurred during Google sign-in. Please try again")
            setIsLoading(false)
        }
    }

    const handleTwitterSignIn = async () => {
        setIsLoading(true)
        setAuthError("")
        try {
            await signInWithPopup(auth, t_provider)
        } catch (error) {
            setAuthError("An error occurred during Twitter sign-in. Please try again")
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-form-center">
            <div className="auth-forms">
                <h2>Login</h2>
                {authError && <div className="auth-error">{authError}</div>}
                <form className="auth-form" onSubmit={handleLoginSubmit}>
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
                        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
                <div className="social-auth">
                    <p className="social-auth-divider"><span>Or login with</span></p>
                    <div className="social-buttons">
                        <button type="button" className="social-btn google-btn" onClick={handleGoogleSignIn} disabled={isLoading}>
                            <FaGoogle /> Google
                        </button>
                        <button type="button" className="social-btn twitter-btn" onClick={handleTwitterSignIn} disabled={isLoading}>
                            <FaTwitter /> Twitter
                        </button>
                    </div>
                </div>
                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <a href="/signup">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm