"use client"

import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { auth } from "./config/firebase"
import { onAuthStateChanged } from "firebase/auth"
import "./App.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ShopPage from "./pages/ShopPage"
import SuppliersPage from "./pages/SuppliersPage"
import TrackingPage from "./pages/TrackingPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CheckoutPage from "./pages/CheckoutPage"
import CartPage from "./pages/CartPage"
import ProfilePage from "./pages/ProfilePage"
import WishlistPage from "./pages/WishlistPage"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
    // Dispatch event for other components to update
    window.dispatchEvent(new Event("cartUpdated"))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity < 1) return

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute user={currentUser}>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={currentUser ? <Navigate to="/shop" /> : <LoginPage />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/shop" /> : <SignupPage />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartItemQuantity={updateCartItemQuantity}
                  clearCart={clearCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute user={currentUser}>
                  <CheckoutPage
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={currentUser}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute user={currentUser}>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute user={currentUser} adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

