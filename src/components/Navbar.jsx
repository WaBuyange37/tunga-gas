"use client"

import React,{ useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { FaGasPump, FaBars, FaTimes, FaUser, FaShoppingCart } from "react-icons/fa"
import "./Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

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

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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
            <li className="nav-item">
              <NavLink to="/tracking" onClick={() => setIsMenuOpen(false)}>
                Track Order
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin" onClick={() => setIsMenuOpen(false)}>
                Admin Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/account" className="btn btn-outline">
                <FaUser /> Account
              </Link>
              <Link to="/cart" className="btn btn-primary cart-btn">
                <FaShoppingCart /> Cart {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
              </Link>
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

