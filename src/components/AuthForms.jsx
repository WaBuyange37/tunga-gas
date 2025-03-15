"use client"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";
import { auth, g_provider, t_provider, db } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";
import { ImAppleinc } from "react-icons/im";

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
  const [email, setEmail] = useState('')
  const [password, setPasword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('customer');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()
  const collectionRef = collection(db, role === 'customer' ? 'customer' : 'supplier');

  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  /* const handleFacebookLogin = () => {
    signInWithPopup(auth, f_provider)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/UserDashBoard");
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handleAppleLogin = () => {
    signInWithPopup(auth, a_provider)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/UserDashBoard");
      })
      .catch((error) => {
        console.log(error);
      })
  } */

  const handleUserCredential = (userCredential) => {
    const user = userCredential.user;
    console.log(user);
    const userRef = doc(db, role === 'customer' ? 'customer' : 'supplier', user.uid);

    getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        console.log(user);
        navigate("/UserDashBoard");
      } else {
        alert("You're not registered, please signup");
        navigate("/signup");
      }
    }).catch((error) => {
      console.log("Error getting user document:", error);
    });
  }

  const handleAuth = async (e, provider) => {
    setErrors('');
    e.preventDefault();

    if (provider === 'google' || provider === 'twitter') {
      const providerToUse = (provider === 'google') ? g_provider : t_provider;
      signInWithPopup(auth, providerToUse)
        .then((userCredential) => {
          handleUserCredential(userCredential);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    else if (provider === 'email') {

      if (validateForm(e, false)) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            handleUserCredential(userCredential);
          })
          .catch((error) => {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
              alert("Invalid email / not registered");
              setActiveTab("signup");
              setPasword('');
            } else if (error.code === 'auth/wrong-password') {
              alert("Wrong password");
            } else {
              alert("Something went wrong");
            }
            setErrors({
              msg: error.message
            });
          })
      }
    }
    
    else if (provider === 's_email') {
      if (validateForm(e, true)) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            storeUserCredentials(userCredential);
          })
          .catch((err) => {
            console.log(err);
          })
      }
    }

  }

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, g_provider)
      .then((userCredential) => {
        handleUserCredential(userCredential);
      })
      .catch((error) => {
        console.log(error);
      })

    setIsLoading(true)
    /* setTimeout(() => {
      setIsLoading(false)
      navigate("/UserDashBoard")
    }, 5000) */
  }

  const handleTwitterSignIn = () => {
    signInWithPopup(auth, t_provider)
      .then((userCredential) => {
        handleUserCredential(userCredential);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPasword(value);
    } else if (name === "fullName") {
      setFormData({ ...formData, fullName: value });
    } else if (name === "phone") {
      setFormData({ ...formData, phone: value });
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = (e, isSignup) => {
    e.preventDefault();
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (validateForm(false)) {

      if (isLogin) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            handleUserCredential(userCredential);
          })
          .catch((error) => {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
              alert("Invalid email / not registered");
              setActiveTab("signup");
              setPasword('');
            } else if (error.code === 'auth/wrong-password') {
              alert("Wrong password");
            } else {
              alert("Something went wrong");
            }
            setErrors({
              msg: error.message
            });
          })
      }

      setIsLoading(true)
    }
  }

  const storeUserCredentials = async (userCredential) => {
    const user = userCredential.user; // Get the user from the credentials

    addDoc(collectionRef, {
      uid: user.uid, // User ID
      email: user.email, // User email
      name: formData.fullName,
      password: formData.password,
      phone: formData.phone,
      HasAgreedToTerms: formData.agreeTerms,
      createdAt: serverTimestamp(), // When the user was created
      // Add more fields if needed
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

  const handleSignupSubmit = (e) => {
    e.preventDefault()

    if (validateForm(true)) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          storeUserCredentials(userCredential);
        })
        .catch((err) => {
          console.log(err);
        })
      setIsLoading(true)

      /* // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Redirect to login tab after successful signup
        setActiveTab("login")
      }, 1500) */
    }
  }

  const handleGoogleSignUp = (e) => {
    signInWithPopup(auth, g_provider)
      .then((userCredential) => {
        storeUserCredentials(userCredential);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handleTwitterSignUp = (e) => {
    signInWithPopup(auth, t_provider)
      .then((userCredential) => {
        storeUserCredentials(userCredential);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="auth-forms">
      <div className="auth-tabs">
        <div className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
          Login
        </div>
        <div className={`auth-tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => setActiveTab("signup")}>
          Sign Up
        </div>
      </div>

      {activeTab === "login" ? (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          {/* Role selection using a select input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="role">Select Role: </label>
            <select id="role" value={role} onChange={handleRoleChange} style={{ width: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="customer" style={{ backgroundColor: 'var(--gray-100)' }}>Customer</option>
              <option value="supplier" style={{ backgroundColor: 'var(--gray-100)' }}>Supplier</option>
              {/* Add more roles here if needed */}
            </select>
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

          <div className="auth-footer">
            <p>
              Forgot your password? <button type="button">Reset Password</button>
            </p>
            or sign in with
            <div className="social-login" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              <button type="button" className="social-btn google" onClick={handleGoogleSignIn} style={{ fontSize: '30px',/*  backgroundColor: '#db4437', */ color: 'white', padding: '10px 15px' }}>
                <FcGoogle />
              </button>
              <button type="button" className="social-btn facebook" style={{ fontSize: '30px', backgroundColor: '#3b5998', color: 'white', padding: '10px 15px' }}>
                <IoLogoFacebook />
              </button>
              <button type="button" className="social-btn twitter" onClick={handleTwitterSignIn} style={{ fontSize: '20px', backgroundColor: '#000000', color: 'white', padding: '10px 15px' }}>
                <BsTwitterX />
              </button>
              <button type="button" className="social-btn apple" style={{ fontSize: '20px', backgroundColor: '#000000', color: 'white', padding: '10px 15px' }}>
                <ImAppleinc />
              </button>
            </div>

          </div>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleSignupSubmit}>
          {/* Role selection using a select input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="role">Select Role: </label>
            <select id="role" value={role} onChange={handleRoleChange} style={{ width: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="customer" style={{ backgroundColor: 'orange' }}>Customer</option>
              <option value="supplier" style={{ backgroundColor: 'orange' }}>Supplier</option>
              {/* Add more roles here if needed */}
            </select>
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

          <div className="auth-footer">
            or sign up with
            <div className="social-login" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              <button type="button" className="social-btn google" onClick={handleGoogleSignUp} style={{ fontSize: '30px',/*  backgroundColor: '#db4437', */ color: 'white', padding: '10px 15px' }}>
                <FcGoogle />
              </button>
              <button type="button" className="social-btn facebook" style={{ fontSize: '30px', backgroundColor: '#3b5998', color: 'white', padding: '10px 15px' }}>
                <IoLogoFacebook />
              </button>
              <button type="button" className="social-btn twitter" onClick={handleTwitterSignUp} style={{ fontSize: '20px', backgroundColor: '#000000', color: 'white', padding: '10px 15px' }}>
                <BsTwitterX />
              </button>
              <button type="button" className="social-btn apple" style={{ fontSize: '20px', backgroundColor: '#000000', color: 'white', padding: '10px 15px' }}>
                <ImAppleinc />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AuthForms

