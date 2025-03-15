"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  FaGasPump,
  FaBars,
  FaTimes,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaCog,
  FaHistory,
  FaHeart,
  FaChevronDown,
} from "react-icons/fa"
import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import "./Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(!false)
  const [currentUser, setCurrentUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const profileMenuRef = useRef(null)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  // Load cart from localStorage and listen for changes
  useEffect(() => {
    const loadCartItems = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Error parsing cart data:", e)
          setCartItems([])
        }
      }
    }

    // Load cart initially
    loadCartItems()

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        loadCartItems()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for cart updates within the same window
    const handleCartUpdate = () => loadCartItems()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileMenuRef])

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsProfileMenuOpen(false)
      // No need to navigate, the auth state change will trigger a re-render
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Get user's profile image or use default
  const userProfileImage = currentUser?.photoURL || "/placeholder.svg?height=40&width=40"

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <FaGasPump />
          <span>TungaGas</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? "nav-mobile open" : "nav-mobile"}`}>
          <button className="menu-button" onClick={toggleMenu}>
            <FaTimes />
          </button>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/shop" onClick={() => setIsMenuOpen(false)}>
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/suppliers" onClick={() => setIsMenuOpen(false)}>
                Suppliers
              </NavLink>
            </li>
            {currentUser && (
              <li className="nav-item">
                <NavLink to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                  My Wishlist
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                About Us
              </NavLink>
            </li>
            {currentUser?.email === "admin@tungagas.com" && (
              <li className="nav-item">
                <NavLink to="/admin" onClick={() => setIsMenuOpen(false)}>
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="auth-buttons">
          {currentUser ? (
            <>
              <Link to="/cart" className="btn btn-primary cart-btn">
                <FaShoppingCart /> Cart {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
              </Link>
              <div className="profile-menu-container" ref={profileMenuRef}>
                <button className="profile-menu-trigger" onClick={toggleProfileMenu}>
                  <img
                    src={userProfileImage || "/placeholder.svg"}
                    alt={currentUser.displayName || "User"}
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=40&width=40"
                    }}
                  />
                  <span className="profile-name">{currentUser.displayName || "User"}</span>
                  <FaChevronDown className={`profile-chevron ${isProfileMenuOpen ? "rotate" : ""}`} />
                </button>
                {isProfileMenuOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <img
                        src={userProfileImage || "/placeholder.svg"}
                        alt={currentUser.displayName || "User"}
                        className="profile-header-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=60&width=60"
                        }}
                      />
                      <div className="profile-header-info">
                        <h4>{currentUser.displayName || "User"}</h4>
                        <p>{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="profile-menu-items">
                      <Link to="/profile" className="profile-menu-item" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaUser /> My Profile
                      </Link>
                      <Link to="/orders" className="profile-menu-item" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaHistory /> Order History
                      </Link>
                      <Link to="/wishlist" className="profile-menu-item" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaHeart /> My Wishlist
                      </Link>
                      <Link to="/settings" className="profile-menu-item" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaCog /> Account Settings
                      </Link>
                      <button className="profile-menu-item logout-item" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
              {cartItemCount > 0 && (
                <Link to="/cart" className="btn btn-primary cart-btn">
                  <FaShoppingCart /> <span className="cart-count">{cartItemCount}</span>
                </Link>
              )}
            </>
          )}
        </div>

        <button className="menu-button" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
    </header>
  )
}

export default Navbar

